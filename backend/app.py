import hashlib
import os
import secrets
import time
from dataclasses import dataclass, field
from typing import Any

import requests
from flask import Flask, jsonify, request

from cypherpunk_caduceus import create_caduceus

app = Flask(__name__)

HOUSE_EDGE = float(os.getenv('HOUSE_EDGE', '0.05'))
ALBY_API = os.getenv('ALBY_API_URL', 'https://api.getalby.com')
ALBY_TOKEN = os.getenv('ALBY_TOKEN', '')
SESSION_TTL_SECONDS = int(os.getenv('SESSION_TTL_SECONDS', '3600'))
MIN_BET = int(os.getenv('MIN_BET_SATS', '1000'))
MAX_BET = int(os.getenv('MAX_BET_SATS', '100000'))

VALID_TRIBINARY = {-1, 0, 1, 3}


@dataclass
class Session:
    seed: str
    commitment_hash: str
    created_at: float = field(default_factory=time.time)
    bet_sats: int = 0
    prediction_type: str = ''
    prediction_value: int = 0
    paid: bool = False
    payout_sats: int = 0
    rolled: bool = False


SESSIONS: dict[str, Session] = {}


def _clean_old_sessions() -> None:
    now = time.time()
    stale = [sid for sid, sess in SESSIONS.items() if now - sess.created_at > SESSION_TTL_SECONDS]
    for sid in stale:
        del SESSIONS[sid]


def _get_session(session_id: str) -> Session:
    session = SESSIONS.get(session_id)
    if not session:
        raise KeyError('session_not_found')
    return session


def _error(message: str, status_code: int = 400):
    return jsonify({'error': message}), status_code


def create_invoice(amount: int, memo: str) -> dict[str, Any]:
    if not ALBY_TOKEN:
        return {'payment_request': f'lntest{amount}{memo[:6]}', 'id': secrets.token_hex(6)}

    response = requests.post(
        f'{ALBY_API}/invoices',
        headers={'Authorization': f'Bearer {ALBY_TOKEN}'},
        json={'amount': amount, 'memo': memo},
        timeout=10,
    )
    response.raise_for_status()
    return response.json()


@app.get('/api/healthz')
def healthz():
    return jsonify({'ok': True, 'service': 'lucky-palace-backend'})


@app.post('/api/game/init')
def init_game():
    _clean_old_sessions()
    session_id = secrets.token_hex(12)
    seed = secrets.token_hex(16)
    commitment = hashlib.sha256(seed.encode()).hexdigest()
    SESSIONS[session_id] = Session(seed=seed, commitment_hash=commitment)
    return jsonify({'session_id': session_id, 'commitment_hash': commitment})


@app.post('/api/game/place_bet')
def place_bet():
    _clean_old_sessions()
    payload = request.get_json(force=True) or {}

    try:
        session = _get_session(payload.get('session_id', ''))
    except KeyError:
        return _error('Unknown session_id', 404)

    bet_sats = int(payload.get('bet_sats', 0))
    prediction_type = payload.get('prediction_type', '')
    prediction_value = payload.get('prediction_value')

    if bet_sats < MIN_BET or bet_sats > MAX_BET:
        return _error(f'bet_sats must be between {MIN_BET} and {MAX_BET}')

    if prediction_type not in {'tribinary', 'hexagram'}:
        return _error('prediction_type must be tribinary or hexagram')

    try:
        prediction_value = int(prediction_value)
    except (TypeError, ValueError):
        return _error('prediction_value must be an integer')

    if prediction_type == 'tribinary' and prediction_value not in VALID_TRIBINARY:
        return _error('tribinary prediction_value must be one of -1, 0, 1, 3')
    if prediction_type == 'hexagram' and not (1 <= prediction_value <= 64):
        return _error('hexagram prediction_value must be between 1 and 64')

    session.bet_sats = bet_sats
    session.prediction_type = prediction_type
    session.prediction_value = prediction_value
    session.paid = False
    session.rolled = False
    session.payout_sats = 0

    invoice = create_invoice(bet_sats, 'Lucky Palace Satoshi Dice Bet')
    return jsonify({'invoice': invoice['payment_request'], 'invoice_id': invoice.get('id')})


@app.get('/api/game/verify_payment/<session_id>')
def verify_payment(session_id):
    try:
        session = _get_session(session_id)
    except KeyError:
        return _error('Unknown session_id', 404)

    # TODO: replace with real invoice lookup from Alby/LNBits.
    session.paid = True
    return jsonify({'paid': session.paid})


@app.post('/api/game/roll')
def roll():
    payload = request.get_json(force=True) or {}

    try:
        session = _get_session(payload.get('session_id', ''))
    except KeyError:
        return _error('Unknown session_id', 404)

    if not session.paid:
        return _error('Invoice has not been paid yet', 409)
    if session.rolled:
        return _error('This session already rolled', 409)

    word = payload.get('word_of_power') or secrets.token_hex(8)
    caduceus = create_caduceus(session.seed)
    outcome = caduceus.speak_both(word)
    state = outcome['sphinx']['state']
    hexagram = outcome['sphinx']['hexagram']['number']

    won = (session.prediction_type == 'tribinary' and session.prediction_value == state) or (
        session.prediction_type == 'hexagram' and session.prediction_value == hexagram
    )

    base_multiplier = 2 if session.prediction_type == 'tribinary' else 10
    effective_multiplier = base_multiplier * (1 - HOUSE_EDGE)
    payout = int(session.bet_sats * effective_multiplier) if won else 0

    session.payout_sats = payout
    session.rolled = True

    message = (
        f'🏴‍☠️ The Kraken smiles upon ye! +{payout} sats!'
        if won
        else '💀 The void claims yer tribute. Try again, round eye.'
    )

    return jsonify(
        {
            'outcome': {'state': state, 'hexagram': hexagram},
            'won': won,
            'payout_sats': payout,
            'seed_reveal': session.seed,
            'word_of_power': word,
            'message': message,
        }
    )


@app.post('/api/game/withdraw')
def withdraw():
    payload = request.get_json(force=True) or {}

    try:
        session = _get_session(payload.get('session_id', ''))
    except KeyError:
        return _error('Unknown session_id', 404)

    lightning_address = payload.get('lightning_address', '').strip()
    if not lightning_address:
        return _error('lightning_address is required')

    if session.payout_sats <= 0:
        return _error('No winnings available for withdrawal')

    return jsonify({'sent': True, 'amount_sats': session.payout_sats, 'destination': lightning_address})


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
