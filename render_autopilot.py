import requests
import json
import os
import time
import logging

# Configuration
API_KEY = "rnd_W57SSu6NO7CSAnPK0zL661gMJJUt"
BASE_URL = "https://api.render.com/v1"
HEADERS = {
    "Authorization": f"Bearer {API_KEY}",
    "Content-Type": "application/json"
}

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger("AutoPilot")

def get_services():
    resp = requests.get(f"{BASE_URL}/services?limit=20", headers=HEADERS)
    if resp.status_code == 200:
        return resp.json()
    return []

def restart_service(service_id, name):
    logger.info(f"Triggering RESTART for {name} ({service_id})...")
    resp = requests.post(f"{BASE_URL}/services/{service_id}/restart", headers=HEADERS)
    return resp.status_code == 202

def suspend_service(service_id, name):
    logger.info(f"Triggering SUSPENSION for {name} ({service_id}) to save hours...")
    resp = requests.post(f"{BASE_URL}/services/{service_id}/suspend", headers=HEADERS)
    return resp.status_code == 202

def check_and_manage():
    services = get_services()
    if not services:
        logger.error("Could not fetch services.")
        return

    clones = [s['service'] for s in services if 'clone' in s['service']['name']]
    main_miner = next((s['service'] for s in services if s['service']['name'] == 'sentient-miner-mainnet'), None)
    
    current_day = time.gmtime().tm_mday
    if current_day > 20:
        logger.info("Past day 20 of the month. Managing free-tier preservation...")
        for clone in clones:
            if clone['suspended'] == 'not_suspended':
                suspend_service(clone['id'], clone['name'])
    else:
        logger.info(f"Day {current_day} of the month. Grid is in 'Full Aggression' mode.")

    if main_miner and main_miner['suspended'] == 'suspended':
        logger.warning("Main miner found suspended! Resuming...")
        requests.post(f"{BASE_URL}/services/{main_miner['id']}/resume", headers=HEADERS)

if __name__ == "__main__":
    logger.info("Aetherion Auto-Pilot engaged.")
    check_and_manage()
    logger.info("Cycle complete.")
