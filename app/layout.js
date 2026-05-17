import './globals.css'
import '@rainbow-me/rainbowkit/styles.css'
import { Providers } from './providers'

export const metadata = {
  title: 'Aetherion Empire | Sovereign Wallet Interface',
  description: 'High-resonance wallet interface with PHI-resonance layout principles',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <script dangerouslySetInnerHTML={{__html:'window.addEventListener("error",function(e){if(e.error instanceof DOMException&&e.error.name==="DataCloneError"&&e.message&&e.message.includes("PerformanceServerTiming")){e.stopImmediatePropagation();e.preventDefault()}},true);'}} />
      </head>
      <body className="bg-black text-white antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
