import { useMemo, useState } from 'react'

async function sha256(input) {
  const bytes = new TextEncoder().encode(input)
  const hashBuffer = await crypto.subtle.digest('SHA-256', bytes)
  return [...new Uint8Array(hashBuffer)].map((b) => b.toString(16).padStart(2, '0')).join('')
}

export default function VerifyPage() {
  const [seed, setSeed] = useState('')
  const [commitment, setCommitment] = useState('')
  const [calculated, setCalculated] = useState('')

  const matches = useMemo(() => commitment && calculated && commitment === calculated, [commitment, calculated])

  return (
    <main className="min-h-screen bg-void p-8 text-gold">
      <h1 className="mb-4 text-3xl font-bold">Verify Past Rolls</h1>
      <p className="mb-6 text-violet">Paste yer seed and commitment hash to confirm the oracle's honesty.</p>
      <div className="mx-auto max-w-2xl space-y-3 rounded-xl border border-gold/40 bg-black/50 p-5">
        <input
          placeholder="Seed reveal"
          value={seed}
          onChange={(e) => setSeed(e.target.value)}
          className="w-full rounded border border-violet/50 bg-black p-2"
        />
        <input
          placeholder="Commitment hash"
          value={commitment}
          onChange={(e) => setCommitment(e.target.value)}
          className="w-full rounded border border-violet/50 bg-black p-2"
        />
        <button
          onClick={async () => setCalculated(await sha256(seed))}
          className="rounded bg-gold px-4 py-2 font-bold text-black"
        >
          Verify the Prophecy
        </button>
        {calculated && <p className="text-xs">SHA-256(seed): {calculated}</p>}
        {matches && <p className="font-bold text-green-400">✅ Commitment matches. Fair winds confirmed.</p>}
        {calculated && commitment && !matches && <p className="font-bold text-red-400">❌ Mismatch. This roll be cursed.</p>}
      </div>
    </main>
  )
}
