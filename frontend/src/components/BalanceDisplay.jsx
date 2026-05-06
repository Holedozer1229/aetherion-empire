export default function BalanceDisplay({ betSats }) {
  return (
    <div className="rounded-lg border border-violet/40 bg-black/40 p-4">
      <p className="text-sm uppercase text-violet">Lay yer bet, matey</p>
      <p className="text-2xl font-bold text-gold">{betSats.toLocaleString()} sats</p>
    </div>
  )
}
