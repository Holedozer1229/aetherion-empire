export default function OpiumDenLayout({ children }) {
  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-[#0b0c0e] to-black p-6 text-gold">
      <div className="pointer-events-none fixed inset-0 animate-pulse bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-50" />
      <section className="relative mx-auto max-w-4xl rounded-2xl border border-gold/40 bg-black/50 p-6 shadow-[0_0_60px_rgba(212,175,55,0.15)]">
        {children}
      </section>
    </main>
  )
}
