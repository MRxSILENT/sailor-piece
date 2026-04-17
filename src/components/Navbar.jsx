import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useFavorites } from '../utils/favorites'

const navLinks = [
  { to: '/',          label: '⚓ Home'      },
  { to: '/tierlist',  label: '🏆 Tier List' },
  { to: '/builder',   label: '🧠 AI Builder' },
  { to: '/favorites', label: '❤️ Favorites'  },
]

export default function Navbar() {
  const location = useLocation()
  const { favorites } = useFavorites()
  const favCount = Object.values(favorites).flat().length

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand">
          <span className="brand-anchor">⚓</span>
          <span className="brand-text">Sailor<span className="brand-accent">Piece</span></span>
          <span className="brand-sub">Hub</span>
        </Link>

        <div className="navbar-links">
          {navLinks.map(({ to, label }) => {
            const isActive = location.pathname === to
            const isFav = to === '/favorites'
            return (
              <Link key={to} to={to} className={`nav-link ${isActive ? 'active' : ''}`}>
                {label}
                {isFav && favCount > 0 && (
                  <span className="fav-badge">{favCount}</span>
                )}
                {isActive && (
                  <motion.div
                    className="nav-underline"
                    layoutId="nav-underline"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            )
          })}
        </div>
      </div>

      <style>{`
        .navbar {
          position: fixed; top: 0; left: 0; right: 0; z-index: 1000;
          height: 70px;
          background: rgba(6,7,16,0.85);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(245,166,35,0.15);
        }
        .navbar-inner {
          max-width: 1400px; margin: 0 auto; height: 100%;
          padding: 0 1.5rem;
          display: flex; align-items: center; justify-content: space-between;
        }
        .navbar-brand {
          display: flex; align-items: center; gap: 0.4rem;
          text-decoration: none;
        }
        .brand-anchor { font-size: 1.6rem; }
        .brand-text {
          font-family: 'Pirata One', cursive;
          font-size: 1.5rem;
          color: var(--text-primary);
          line-height: 1;
        }
        .brand-accent { color: var(--accent-gold); }
        .brand-sub {
          font-family: 'Rajdhani', sans-serif;
          font-size: 0.7rem; font-weight: 700;
          letter-spacing: 0.15em; text-transform: uppercase;
          color: var(--accent-cyan);
          align-self: flex-end; padding-bottom: 2px;
        }
        .navbar-links {
          display: flex; align-items: center; gap: 0.25rem;
        }
        .nav-link {
          position: relative;
          display: flex; align-items: center; gap: 0.35rem;
          padding: 0.45rem 0.9rem;
          color: var(--text-secondary);
          text-decoration: none;
          font-weight: 600; font-size: 0.95rem;
          border-radius: var(--radius-sm);
          transition: color 0.2s, background 0.2s;
        }
        .nav-link:hover { color: var(--text-primary); background: rgba(255,255,255,0.05); }
        .nav-link.active { color: var(--accent-gold); }
        .nav-underline {
          position: absolute; bottom: -2px; left: 0; right: 0;
          height: 2px;
          background: linear-gradient(90deg, transparent, var(--accent-gold), transparent);
          border-radius: 1px;
        }
        .fav-badge {
          display: inline-flex; align-items: center; justify-content: center;
          width: 18px; height: 18px;
          background: var(--tier-s);
          color: white; font-size: 0.65rem; font-weight: 700;
          border-radius: 50%;
        }
        @media (max-width: 600px) {
          .brand-sub { display: none; }
          .nav-link { padding: 0.4rem 0.5rem; font-size: 0.8rem; }
          .navbar-links { gap: 0; }
        }
      `}</style>
    </nav>
  )
}
