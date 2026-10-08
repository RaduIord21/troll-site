import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Poza from './pages/Poza.jsx'

// HashRouter, ca refresh-ul pe /#/poza să nu dea 404 pe GitHub Pages
export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/poza" element={<Poza />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  )
}
