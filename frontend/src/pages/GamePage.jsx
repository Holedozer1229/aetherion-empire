import { useEffect, useMemo, useState } from 'react'
import OpiumDenLayout from '../components/OpiumDenLayout'
import BalanceDisplay from '../components/BalanceDisplay'
import HexagramDice from '../components/HexagramDice'
import TribinaryWheel from '../components/TribinaryWheel'
import BetControls from '../components/BetControls'
import ProvablyFairModal from '../components/ProvablyFairModal'

const API = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'

export default function GamePage() {
  const [sessionId, setSessionId] = useState('')
  const [betSats, setBetSats] = useState(1000)
  const [predictionType, setPredictionType] = useState('tribinary')
  const [tribinary, setTribinary] = useState(1)
  const [hexagramGuess, setHexagramGuess] = useState(1)
  const [hexagram, setHexagram] = useState(1)
  const [rolling, setRolling] = useState(false)
  const [commitment, setCommitment] = useState('')
  const [seedReveal, setSeedReveal] = useState('')
  const [message, setMessage] = useState('Lay yer bet, matey.')

  const predictionValue = useMemo(
    () => (predictionType === 'tribinary' ? tribinary : hexagramGuess),
    [predictionType, tribinary, hexagramGuess],
  )

  useEffect(() => {
    fetch(`${API}/api/game/init`, { method: 'POST' })
      .then((res) => res.json())
      .then((data) => {
        setSessionId(data.session_id)
        setCommitment(data.commitment_hash)
      })
      .catch(() => setMessage('Oracle asleep. Backend unreachable.'))
  }, [])

  const onRoll = async () => {
    if (!sessionId) return

    setRolling(true)
    setMessage('Forging invoice in the underhold...')

    const placeBet = await fetch(`${API}/api/game/place_bet`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        session_id: sessionId,
        bet_sats: betSats,
        prediction_type: predictionType,
        prediction_value: predictionValue,
      }),
    }).then((r) => r.json())

    if (placeBet.error) {
      setRolling(false)
      setMessage(placeBet.error)
      return
    }

    await fetch(`${API}/api/game/verify_payment/${sessionId}`).then((r) => r.json())

    const roll = await fetch(`${API}/api/game/roll`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ session_id: sessionId, word_of_power: 'kraken' }),
    }).then((r) => r.json())

    setHexagram(roll.outcome?.hexagram || 1)
    setSeedReveal(roll.seed_reveal || '')
    setMessage(roll.message || 'The oracle speaks.')
    setRolling(false)
  }

  return (
    <OpiumDenLayout>
      <h1 className="mb-2 text-3xl font-black text-gold">Lucky Palace Satoshi Dice</h1>
      <p className="mb-6 text-violet">Fortune favors the bold. The oracle speaks in smoke and thunder.</p>
      <div className="mb-4 rounded-md border border-violet/40 bg-black/60 p-3 text-sm">{message}</div>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <BalanceDisplay betSats={betSats} />
          <div className="space-y-2 rounded-lg border border-gold/20 p-3">
            <label className="mr-4">
              <input
                type="radio"
                checked={predictionType === 'tribinary'}
                onChange={() => setPredictionType('tribinary')}
              />{' '}
              Tribinary
            </label>
            <label>
              <input
                type="radio"
                checked={predictionType === 'hexagram'}
                onChange={() => setPredictionType('hexagram')}
              />{' '}
              Hexagram
            </label>
            {predictionType === 'hexagram' && (
              <input
                type="number"
                min={1}
                max={64}
                value={hexagramGuess}
                onChange={(e) => setHexagramGuess(Number(e.target.value || 1))}
                className="mt-2 w-full rounded border border-violet/40 bg-black p-2"
              />
            )}
          </div>
          <BetControls betSats={betSats} onBetSats={setBetSats} onRoll={onRoll} />
          {predictionType === 'tribinary' && (
            <TribinaryWheel selected={tribinary} onSelect={setTribinary} />
          )}
        </div>
        <div className="space-y-4">
          <div className="flex justify-center">
            <HexagramDice hexagramNumber={hexagram} rolling={rolling} />
          </div>
          <ProvablyFairModal commitment={commitment} seed={seedReveal} />
        </div>
      </div>
    </OpiumDenLayout>
  )
}
