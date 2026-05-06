const STATES = [
  { label: 'GRAVITY', value: -1 },
  { label: 'RARITY', value: 0 },
  { label: 'LEVITY', value: 1 },
  { label: 'DENSITY', value: 3 },
]

export default function TribinaryWheel({ selected, onSelect }) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {STATES.map((state) => (
        <button
          key={state.value}
          onClick={() => onSelect(state.value)}
          className={`rounded-lg p-3 text-sm font-semibold transition ${
            selected === state.value
              ? 'bg-gradient-to-r from-gold to-violet text-black'
              : 'border border-gold/30 bg-black/40 text-gold'
          }`}
        >
          {state.label}
        </button>
      ))}
    </div>
  )
}
