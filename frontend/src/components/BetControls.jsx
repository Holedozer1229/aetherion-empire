export default function BetControls({ betSats, onBetSats, onRoll }) {
  return (
    <div className="space-y-3">
      <input
        type="number"
        min={1000}
        max={100000}
        value={betSats}
        onChange={(e) => onBetSats(Number(e.target.value || 0))}
        className="w-full rounded-md border border-gold/40 bg-black p-2 text-gold"
      />
      <button
        onClick={onRoll}
        className="w-full rounded-md bg-gold px-4 py-2 font-bold text-black hover:bg-yellow-300"
      >
        Roll the Oracle
      </button>
    </div>
  )
}
