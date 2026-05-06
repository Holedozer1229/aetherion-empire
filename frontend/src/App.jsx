import { Route, Routes } from 'react-router-dom'
import GamePage from './pages/GamePage'
import VerifyPage from './pages/VerifyPage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<GamePage />} />
      <Route path="/verify" element={<VerifyPage />} />
    </Routes>
  )
}
