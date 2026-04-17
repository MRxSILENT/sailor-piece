import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

const features = [
  { icon: '🏆', title: 'Tier Lists',        desc: '8 full tier lists — Fruits, Swords, Melee Specs, Races, Traits, Runes, Clans & Artifacts. Updated with Ice Update data.', to: '/tierlist', cta: 'View Tiers' },
  { icon: '🧠', title: 'AI Build Generator', desc: 'Generate optimal 7-slot builds for Farming, Boss fights, and PvP using real meta data and synergy detection.', to: '/builder', cta: 'Generate Build' },
  { icon: '❤️', title: 'Favorites',          desc: 'Save your top picks across all 8 categories for quick reference. Stored locally — no account needed.', to: '/favorites', cta: 'My Favorites' },
]

const stats = [
  { label: 'Items Tracked',  value: '60+' },
  { label: 'Categories',     value: '8'   },
  { label: 'Build Slots',    value: '7'   },
  { label: 'Tier Levels',    value: '6'   },
]

const metaSnippets = [
  { icon: '🍎', label: 'Best Fruit',  val: 'Dragon Fruit', tier: 'S+', color: '#ff9a3c' },
  { icon: '⚔️', label: 'Best Sword',  val: 'Ice Queen',    tier: 'S+', color: '#ff9a3c' },
  { icon: '👊', label: 'Best Melee',  val: 'Moon Slayer',  tier: 'S+', color: '#ff9a3c' },
  { icon: '🧬', label: 'Best Race',   val: 'SwordBlessed', tier: 'S+', color: '#ff9a3c' },
  { icon: '✨', label: 'Best Trait',  val: 'Emperor',      tier: 'S+', color: '#ff9a3c' },
  { icon: '💎', label: 'Best Rune',   val: 'Havoc Rune',   tier: 'S',  color: '#ff4757' },
  { icon: '🏴', label: 'Best Clan',   val: 'Frostbane',    tier: 'S+', color: '#ff9a3c' },
]

const container = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } }
const item = { hidden: { opacity: 0, y: 28 }, show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } } }

export default function Home() {
  return (
    <motion.div className="page home-page" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }}>
      <div className="stars-bg" />

      {/* Hero */}
      <motion.section className="hero-section" variants={container} initial="hidden" animate="show">
        <motion.div variants={item} className="hero-badge">
          ⚓ Ice Update — April 8, 2026 · Sea 2 Coming Soon
        </motion.div>
        <motion.h1 variants={item} className="hero-title">
          <span className="glow-gold">Sailor</span>
          <span style={{ color: 'var(--accent-cyan)' }}> Piece</span>
          <br />
          <span style={{ color: 'var(--text-secondary)', fontSize: '52%', fontFamily: 'Rajdhani, sans-serif', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
            The Ultimate Hub
          </span>
        </motion.h1>
        <motion.p variants={item} className="hero-sub">
          8 complete tier lists. AI build generator with 7 slots. Powered by real wiki data
          from Beebom, Destructoid & the official Sailor Piece community.
        </motion.p>
        <motion.div variants={item} className="hero-ctas">
          <Link to="/tierlist" className="btn btn-primary" style={{ fontSize: '1.05rem', padding: '0.75rem 2rem' }}>🏆 View Tier Lists</Link>
          <Link to="/builder"  className="btn btn-cyan"    style={{ fontSize: '1.05rem', padding: '0.75rem 2rem' }}>🧠 AI Build Generator</Link>
        </motion.div>
        <motion.div variants={item} className="stats-bar">
          {stats.map(s => (
            <div key={s.label} className="stat-item">
              <span className="stat-value glow-gold">{s.value}</span>
              <span className="stat-label">{s.label}</span>
            </div>
          ))}
        </motion.div>
      </motion.section>

      {/* Quick meta reference */}
      <motion.section className="meta-quick" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <h2 className="section-title" style={{ fontSize: '1.6rem', marginBottom: '1rem' }}>⚡ Current Meta Snapshot</h2>
        <div className="meta-grid">
          {metaSnippets.map(m => (
            <div key={m.label} className="meta-item">
              <div className="meta-item-top">
                <span className="meta-item-icon">{m.icon}</span>
                <span className="meta-item-tier" style={{ color: m.color, border: `1px solid ${m.color}44`, background: `${m.color}15` }}>{m.tier}</span>
              </div>
              <div className="meta-item-label">{m.label}</div>
              <div className="meta-item-val">{m.val}</div>
            </div>
          ))}
        </div>
      </motion.section>

      {/* Feature cards */}
      <motion.section className="features-section" variants={container} initial="hidden" animate="show">
        <motion.h2 variants={item} className="section-title text-center">What's Inside</motion.h2>
        <div className="features-grid">
          {features.map(f => (
            <motion.div key={f.title} variants={item} className="feature-card card">
              <div className="feature-icon">{f.icon}</div>
              <h3 className="feature-title">{f.title}</h3>
              <p className="feature-desc">{f.desc}</p>
              <Link to={f.to} className="btn btn-secondary mt-2">{f.cta} →</Link>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Sea 2 callout */}
      <motion.div className="upcoming-banner card" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
        <div className="upcoming-inner">
          <div>
            <h3 style={{ color: 'var(--accent-cyan)', marginBottom: '0.3rem' }}>🔜 Sea 2 Update — Coming April 18–19, 2026</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              4 new islands · Guilds & Leaderboards · Bloodlines · World Bosses · Sea Beasts · 4 new Melee Specs (Frieren, Castorice, Cosmic Garou, DIO) · Easter Event
            </p>
          </div>
          <Link to="/tierlist" className="btn btn-cyan" style={{ flexShrink: 0, fontSize: '0.9rem' }}>Track Changes →</Link>
        </div>
      </motion.div>

      <style>{`
        .home-page { position: relative; padding-top: 2.5rem; }
        .hero-section { text-align: center; padding: 2.5rem 1rem 1.5rem; position: relative; z-index: 1; }
        .hero-badge {
          display: inline-block; padding: 0.3rem 1rem;
          background: rgba(245,166,35,0.1); border: 1px solid rgba(245,166,35,0.3);
          border-radius: 20px; font-size: 0.82rem; font-weight: 600;
          color: var(--accent-gold); letter-spacing: 0.05em; margin-bottom: 1.25rem;
        }
        .hero-title { font-size: clamp(2.8rem,8vw,5.5rem); line-height: 1.05; margin-bottom: 1.1rem; }
        .hero-sub { max-width: 540px; margin: 0 auto 1.75rem; color: var(--text-secondary); font-size: 1.1rem; line-height: 1.6; }
        .hero-ctas { display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; }
        .stats-bar {
          display: flex; justify-content: center; gap: 2rem; flex-wrap: wrap;
          margin-top: 2.5rem; padding: 1.25rem;
          background: var(--bg-surface); border: 1px solid var(--border-dim); border-radius: var(--radius-lg);
        }
        .stat-item { text-align: center; }
        .stat-value { font-size: 1.9rem; font-family: 'Pirata One', cursive; display: block; }
        .stat-label { font-size: 0.75rem; color: var(--text-muted); letter-spacing: 0.08em; text-transform: uppercase; font-weight: 600; }

        .meta-quick { margin-top: 3rem; }
        .meta-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
          gap: 0.75rem;
        }
        .meta-item {
          background: var(--bg-card); border: 1px solid var(--border-dim);
          border-radius: var(--radius-md); padding: 0.9rem 0.8rem;
          transition: all 0.2s;
        }
        .meta-item:hover { border-color: rgba(245,166,35,0.2); transform: translateY(-2px); }
        .meta-item-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.5rem; }
        .meta-item-icon { font-size: 1.3rem; }
        .meta-item-tier { font-size: 0.65rem; font-weight: 800; padding: 1px 5px; border-radius: 4px; }
        .meta-item-label { font-size: 0.7rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.07em; font-weight: 700; margin-bottom: 2px; }
        .meta-item-val { font-size: 0.9rem; font-weight: 700; color: var(--text-primary); }

        .features-section { margin-top: 3rem; }
        .features-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1.1rem; margin-top: 1.25rem; }
        .feature-card { display: flex; flex-direction: column; }
        .feature-icon { font-size: 2.2rem; margin-bottom: 0.65rem; }
        .feature-title { font-family: 'Pirata One', cursive; font-size: 1.4rem; color: var(--accent-gold); margin-bottom: 0.4rem; }
        .feature-desc { color: var(--text-secondary); font-size: 0.9rem; flex: 1; line-height: 1.5; }

        .upcoming-banner {
          margin-top: 2rem;
          background: linear-gradient(135deg, rgba(0,212,255,0.06), rgba(168,85,247,0.04));
          border-color: rgba(0,212,255,0.2);
        }
        .upcoming-inner { display: flex; align-items: center; justify-content: space-between; gap: 1.5rem; flex-wrap: wrap; }
      `}</style>
    </motion.div>
  )
}
