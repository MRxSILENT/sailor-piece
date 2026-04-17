import { motion, AnimatePresence } from 'framer-motion'
import { useFavorites } from '../utils/favorites'

const TIER_COLORS = {
  'S+': '#ff9a3c', 'S': '#ff4757', 'A': '#ffd32a',
  'B': '#2ed573',  'C': '#1e90ff', 'D': '#747d8c'
}

const CAT_ICONS = {
  fruits: '🍎', swords: '⚔️', melee: '👊',
  races: '🧬', traits: '✨', runes: '💎',
  clans: '🏴', artifacts: '🏺'
}

const CAT_LABELS = {
  fruits: 'Fruits', swords: 'Swords', melee: 'Melee Specs',
  races: 'Races', traits: 'Traits', runes: 'Runes',
  clans: 'Clans', artifacts: 'Artifacts'
}

function FavCard({ item, category, onRemove }) {
  const color = TIER_COLORS[item.tier] || '#747d8c'
  return (
    <motion.div
      layout
      className="fav-card"
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.88, transition: { duration: 0.18 } }}
      transition={{ duration: 0.25 }}
      style={{ borderColor: `${color}33` }}
    >
      <div className="fav-card-top">
        <span className="fav-emoji">{item.emoji || '🔹'}</span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="fav-name">{item.name}</div>
          <div className="fav-cat">{CAT_ICONS[category]} {CAT_LABELS[category] || category}</div>
        </div>
        <span className="fav-tier" style={{ background: `${color}22`, color, border: `1px solid ${color}44` }}>
          {item.tier}
        </span>
      </div>
      {item.description && <p className="fav-desc">{item.description.split('.')[0]}.</p>}
      {item.bonuses && <p className="fav-bonuses">{item.bonuses}</p>}
      {item.tags?.length > 0 && (
        <div className="flex gap-1" style={{ flexWrap: 'wrap', margin: '0.4rem 0' }}>
          {item.tags.map(t => <span key={t} className={`tag tag-${t}`}>{t}</span>)}
        </div>
      )}
      <button className="fav-remove-btn" onClick={onRemove}>✕ Remove</button>
    </motion.div>
  )
}

export default function Favorites() {
  const { favorites, removeFavorite, clearFavorites } = useFavorites()

  const allCount = Object.values(favorites).flat().length
  const grouped = Object.fromEntries(
    Object.entries(favorites).filter(([, items]) => items.length > 0)
  )
  const catOrder = Object.keys(CAT_ICONS)
  const sortedGroups = catOrder.filter(k => grouped[k]).concat(Object.keys(grouped).filter(k => !catOrder.includes(k)))

  return (
    <motion.div
      className="page"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
    >
      <div className="fav-header">
        <div>
          <h1 className="section-title">❤️ Favorites</h1>
          <p className="section-subtitle">
            {allCount > 0
              ? `${allCount} saved item${allCount !== 1 ? 's' : ''} across ${Object.keys(grouped).length} categor${Object.keys(grouped).length !== 1 ? 'ies' : 'y'} — stored locally`
              : 'No favorites saved yet'}
          </p>
        </div>
        {allCount > 0 && (
          <button className="btn btn-danger" onClick={() => { if (window.confirm('Clear all favorites?')) clearFavorites() }}>
            🗑️ Clear All
          </button>
        )}
      </div>

      {allCount === 0 ? (
        <motion.div className="empty-state" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
          <span className="emoji">💔</span>
          <h3 style={{ color: 'var(--text-secondary)', fontFamily: 'Pirata One', fontSize: '1.5rem' }}>No Favorites Yet</h3>
          <p>Browse the Tier List and click 🤍 on any card to save items here.</p>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            Works across Fruits, Swords, Melee Specs, Races, Traits, Runes, Clans & Artifacts.
          </p>
        </motion.div>
      ) : (
        sortedGroups.map(cat => (
          <div key={cat} className="fav-section">
            <h2 className="fav-section-title">
              {CAT_ICONS[cat] || '📦'} {CAT_LABELS[cat] || cat}
              <span className="fav-section-count">{grouped[cat].length}</span>
            </h2>
            <div className="fav-grid">
              <AnimatePresence>
                {grouped[cat].map(item => (
                  <FavCard
                    key={item.name}
                    item={item}
                    category={cat}
                    onRemove={() => removeFavorite(cat, item.name)}
                  />
                ))}
              </AnimatePresence>
            </div>
          </div>
        ))
      )}

      <style>{`
        .fav-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 1rem; margin-bottom: 2rem; flex-wrap: wrap; }
        .fav-section { margin-bottom: 2.5rem; }
        .fav-section-title {
          font-family: 'Pirata One', cursive; font-size: 1.45rem; color: var(--accent-gold);
          display: flex; align-items: center; gap: 0.7rem; margin-bottom: 1rem;
        }
        .fav-section-count {
          background: rgba(245,166,35,0.15); border: 1px solid rgba(245,166,35,0.3);
          color: var(--accent-gold); border-radius: 20px; padding: 0.1rem 0.6rem;
          font-size: 0.78rem; font-weight: 700; font-family: 'Rajdhani', sans-serif;
        }
        .fav-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(230px, 1fr)); gap: 1rem; }
        .fav-card { background: var(--bg-card); border: 1px solid var(--border-dim); border-radius: var(--radius-md); padding: 1.1rem; transition: border-color 0.2s; }
        .fav-card:hover { border-color: rgba(245,166,35,0.3); }
        .fav-card-top { display: flex; align-items: center; gap: 0.65rem; margin-bottom: 0.5rem; }
        .fav-emoji { font-size: 1.7rem; flex-shrink: 0; }
        .fav-name { font-weight: 700; font-size: 1rem; }
        .fav-cat { font-size: 0.75rem; color: var(--text-muted); text-transform: capitalize; font-weight: 600; }
        .fav-tier { flex-shrink: 0; padding: 0.2rem 0.5rem; border-radius: 5px; font-size: 0.72rem; font-weight: 800; }
        .fav-desc { font-size: 0.8rem; color: var(--text-muted); line-height: 1.4; margin-bottom: 0.3rem; }
        .fav-bonuses { font-size: 0.72rem; color: var(--accent-cyan); font-family: 'JetBrains Mono', monospace; margin-bottom: 0.3rem; }
        .fav-remove-btn {
          margin-top: 0.75rem; background: none; border: 1px solid rgba(255,71,87,0.2);
          border-radius: 5px; color: rgba(255,71,87,0.55); padding: 0.3rem 0.7rem;
          font-size: 0.76rem; font-weight: 700; cursor: pointer; transition: all 0.2s;
          font-family: 'Rajdhani', sans-serif; width: 100%;
        }
        .fav-remove-btn:hover { background: rgba(255,71,87,0.1); border-color: rgba(255,71,87,0.5); color: #ff4757; }
        @media (max-width: 500px) { .fav-grid { grid-template-columns: 1fr; } }
      `}</style>
    </motion.div>
  )
}
