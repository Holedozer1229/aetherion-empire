import hashlib

TRIBINARY = [-1, 0, 1, 3]


class Caduceus:
    def __init__(self, seed: str):
        self.seed = seed

    def speak_both(self, word: str):
        digest = hashlib.sha256(f"{self.seed}:{word}".encode()).hexdigest()
        value = int(digest[:8], 16)
        state = TRIBINARY[value % 4]
        hexagram = (value % 64) + 1
        return {
            "sphinx": {
                "state": state,
                "hexagram": {"number": hexagram},
            }
        }


def create_caduceus(seed: str):
    return Caduceus(seed)
