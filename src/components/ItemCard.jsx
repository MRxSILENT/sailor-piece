import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useFavorites } from '../utils/favorites'

const TIER_COLORS = {
  'S+': '#ff9a3c', 'S': '#ff4757', 'A': '#ffd32a',
  'B': '#2ed573',  'C': '#1e90ff', 'D': '#747d8c'
}

function TierBadge({ tier }) {
  const color = TIER_COLORS[tier] || '#747d8c'
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      width: 28, height: 28, borderRadius: 6,
      background: `${color}22`, border: `1.5px solid ${color}`,
      color, fontSize: '0.68rem', fontWeight: 800,
      letterSpacing: '0.03em', flexShrink: 0,
    }}>{tier}</span>
  )
}

export default function ItemCard({ item, tier, category }) {
  const { toggleFavorite, isFavorite } = useFavorites()
  const [expanded, setExpanded] = useState(false)
  const favored = isFavorite(category, item.name)

  const hasExtra = item.location || item.requirements || item.bonuses || item.rarity

  return (
    <motion.div
      className="item-card"
      whileHover={{ y: -3, scale: 1.015 }}
      transition={{ type: 'spring', stiffness: 400, damping: 28 }}
      style={{ borderColor: expanded ? `${TIER_COLORS[tier]}44` : undefined }}
    >
      <div className="item-card-header">
        <span className="item-emoji">{item.emoji || '🔹'}</span>
        <TierBadge tier={tier} />
        <button
          className={`fav-btn ${favored ? 'active' : ''}`}
          onClick={e => { e.stopPropagation(); toggleFavorite(category, item) }}
          title={favored ? 'Remove from favorites' : 'Add to favorites'}
        >
          {favored ? '❤️' : '🤍'}
        </button>
      </div>

      <div className="item-card-name">{item.name}</div>

      {item.rarity && (
        <span className={`rarity-badge rarity-${item.rarity?.toLowerCase().replace(' ','')}`}>{item.rarity}</span>
      )}

      {item.description && (
        <div className="item-card-desc">{item.description}</div>
      )}

      {item.bonuses && (
        <div className="item-bonuses">{item.bonuses}</div>
      )}

      {item.tags && item.tags.length > 0 && (
        <div className="item-tags">
          {item.tags.map(tag => (
            <span key={tag} className={`tag tag-${tag}`}>{tag}</span>
          ))}
        </div>
      )}

      {hasExtra && (
        <button className="expand-btn" onClick={() => setExpanded(!expanded)}>
          {expanded ? '▲ Less info' : '▼ Where to get'}
        </button>
      )}

      <AnimatePresence>
        {expanded && (
          <motion.div
            className="item-extra"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            {item.location && (
              <div className="extra-row">
                <span className="extra-label">📍 Location</span>
                <span className="extra-val">{item.location}</span>
              </div>
            )}
            {item.requirements && (
              <div className="extra-row">
                <span className="extra-label">📋 Requirements</span>
                <span className="extra-val">{item.requirements}</span>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .item-card {
          background: var(--bg-card);
          border: 1px solid var(--border-dim);
          border-radius: var(--radius-md);
          padding: 1rem;
          position: relative; overflow: hidden;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .item-card:hover {
          border-color: rgba(245,166,35,0.3);
          box-shadow: 0 8px 30px rgba(0,0,0,0.4), 0 0 20px rgba(245,166,35,0.06);
        }
        .item-card-header {
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 0.5rem; gap: 0.4rem;
        }
        .item-emoji { font-size: 1.4rem; line-height: 1; }
        .fav-btn {
          background: none; border: none; cursor: pointer;
          font-size: 0.95rem; padding: 2px; border-radius: 4px;
          transition: transform 0.2s; line-height: 1;
        }
        .fav-btn:hover { transform: scale(1.3); }
        .fav-btn.active { animation: heartPop 0.3s ease; }
        @keyframes heartPop {
          0%  { transform: scale(1); }
          50% { transform: scale(1.5); }
          100%{ transform: scale(1); }
        }
        .item-card-name {
          font-weight: 700; font-size: 0.97rem;
          color: var(--text-primary); margin-bottom: 0.3rem;
          line-height: 1.2;
        }
        .rarity-badge {
          display: inline-block; margin-bottom: 0.35rem;
          font-size: 0.65rem; font-weight: 800;
          letter-spacing: 0.08em; text-transform: uppercase;
          padding: 1px 6px; border-radius: 3px;
        }
        .rarity-mythic    { background: rgba(168,85,247,0.2); color: #c084fc; border: 1px solid rgba(168,85,247,0.3); }
        .rarity-legendary { background: rgba(245,166,35,0.15); color: var(--accent-gold); border: 1px solid rgba(245,166,35,0.3); }
        .rarity-rare      { background: rgba(30,144,255,0.15); color: #60a5fa; border: 1px solid rgba(30,144,255,0.3); }
        .rarity-uncommon  { background: rgba(46,213,115,0.1);  color: #2ed573; border: 1px solid rgba(46,213,115,0.25); }
        .rarity-common    { background: rgba(116,125,140,0.15); color: #9ca3af; border: 1px solid rgba(116,125,140,0.3); }

        .item-card-desc {
          font-size: 0.8rem; color: var(--text-muted);
          line-height: 1.45; margin-bottom: 0.5rem;
        }
        .item-bonuses {
          font-size: 0.75rem; color: var(--accent-cyan);
          font-family: 'JetBrains Mono', monospace;
          margin-bottom: 0.5rem; line-height: 1.4;
        }
        .item-tags { display: flex; flex-wrap: wrap; gap: 0.3rem; }

        .expand-btn {
          display: block; margin-top: 0.65rem; width: 100%;
          background: rgba(255,255,255,0.04);
          border: 1px solid var(--border-dim);
          border-radius: 5px; padding: 0.3rem;
          font-size: 0.72rem; font-weight: 700;
          color: var(--text-muted); cursor: pointer;
          font-family: 'Rajdhani', sans-serif;
          letter-spacing: 0.05em; transition: all 0.2s;
        }
        .expand-btn:hover { background: rgba(245,166,35,0.08); color: var(--accent-gold); border-color: rgba(245,166,35,0.2); }

        .item-extra { overflow: hidden; }
        .extra-row {
          display: flex; flex-direction: column; gap: 2px;
          margin-top: 0.5rem; padding-top: 0.5rem;
          border-top: 1px solid var(--border-dim);
        }
        .extra-label { font-size: 0.68rem; font-weight: 800; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.07em; }
        .extra-val { font-size: 0.78rem; color: var(--text-secondary); line-height: 1.4; }
      `}</style>
    </motion.div>
  )
}
