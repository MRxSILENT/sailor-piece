import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ItemCard from './ItemCard'

const TIER_COLORS = {
  'S+': '#ff9a3c', 'S': '#ff4757', 'A': '#ffd32a',
  'B': '#2ed573',  'C': '#1e90ff', 'D': '#747d8c'
}

export default function TierRow({ tier, items, category, searchQuery }) {
  const [collapsed, setCollapsed] = useState(false)

  const filtered = searchQuery
    ? items.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tags?.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : items

  if (filtered.length === 0 && searchQuery) return null

  const color = TIER_COLORS[tier] || '#747d8c'

  return (
    <div className="tier-row-wrapper">
      <div className="tier-row-header" onClick={() => setCollapsed(!collapsed)}>
        <div className="tier-label-box" style={{
          background: `${color}18`,
          border: `2px solid ${color}`,
          color
        }}>
          {tier}
        </div>
        <div className="tier-row-meta">
          <span className="tier-count" style={{ color: `${color}99` }}>
            {filtered.length} item{filtered.length !== 1 ? 's' : ''}
          </span>
          <span className="tier-chevron" style={{ transform: collapsed ? 'rotate(-90deg)' : 'rotate(0deg)' }}>
            ▾
          </span>
        </div>
      </div>

      <AnimatePresence>
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="tier-row-items"
          >
            <div className="grid-auto" style={{ paddingTop: '0.75rem' }}>
              {filtered.map((item, i) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                >
                  <ItemCard item={item} tier={tier} category={category} />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .tier-row-wrapper {
          background: var(--bg-surface);
          border: 1px solid var(--border-dim);
          border-radius: var(--radius-md);
          overflow: hidden;
          margin-bottom: 0.75rem;
        }
        .tier-row-header {
          display: flex; align-items: center; gap: 1rem;
          padding: 0.75rem 1rem;
          cursor: pointer;
          transition: background 0.2s;
        }
        .tier-row-header:hover { background: rgba(255,255,255,0.03); }
        .tier-label-box {
          display: flex; align-items: center; justify-content: center;
          width: 52px; height: 52px; flex-shrink: 0;
          font-family: 'Pirata One', cursive;
          font-size: 1.4rem; border-radius: var(--radius-sm);
          font-weight: 900;
        }
        .tier-row-meta {
          display: flex; align-items: center; gap: 1rem;
          margin-left: auto;
        }
        .tier-count { font-size: 0.85rem; font-weight: 600; }
        .tier-chevron {
          color: var(--text-muted); font-size: 1.2rem;
          transition: transform 0.2s ease;
          display: inline-block;
        }
        .tier-row-items { padding: 0 1rem 1rem; }
      `}</style>
    </div>
  )
}
