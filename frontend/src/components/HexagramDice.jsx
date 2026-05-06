import { motion } from 'framer-motion'

export default function HexagramDice({ hexagramNumber, rolling }) {
  const glyph = String.fromCodePoint(0x4dc0 + ((hexagramNumber - 1) % 64))

  return (
    <motion.div
      animate={rolling ? { rotate: [0, 90, 180, 360] } : { rotate: 0 }}
      transition={{ duration: 1.2, repeat: rolling ? Infinity : 0, ease: 'linear' }}
      className="flex h-32 w-32 items-center justify-center rounded-full border border-gold bg-black text-6xl shadow-[0_0_30px_#d4af37]"
    >
      {glyph}
    </motion.div>
  )
}
