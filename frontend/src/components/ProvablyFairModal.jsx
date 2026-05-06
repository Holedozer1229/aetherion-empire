export default function ProvablyFairModal({ commitment, seed }) {
  return (
    <div className="rounded-lg border border-gold/30 bg-black/70 p-4 text-sm">
      <h3 className="mb-2 text-gold">Provably Fair Ledger</h3>
      <p>Commitment: {commitment}</p>
      <p>Seed Reveal: {seed || 'Pending roll...'}</p>
      <p className="mt-2 text-violet">Verify by hashing seed reveal with SHA-256.</p>
    </div>
  )
}
