import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import TierList from './pages/TierList'
import AIBuilder from './pages/AIBuilder'
import Favorites from './pages/Favorites'

function App() {
  const location = useLocation()

  return (
    <div className="app-wrapper">
      <Navbar />
      <main className="main-content">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Home />} />
            <Route path="/tierlist" element={<TierList />} />
            <Route path="/builder" element={<AIBuilder />} />
            <Route path="/favorites" element={<Favorites />} />
          </Routes>
        </AnimatePresence>
      </main>
    </div>
  )
}

export default App
