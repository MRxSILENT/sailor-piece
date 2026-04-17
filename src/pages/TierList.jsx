import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import TierRow from '../components/TierRow'
import SearchBar from '../components/SearchBar'

const CATEGORIES = [
  { key: 'fruits',    label: '🍎 Fruits',    desc: 'Devil Fruits ranked by combat usefulness, mobility & damage' },
  { key: 'swords',    label: '⚔️ Swords',    desc: 'Weapons ranked by DPS, AoE coverage & endgame performance' },
  { key: 'melee',     label: '👊 Melee Specs', desc: 'Combat specs ranked by burst damage, AoE & skill efficiency' },
  { key: 'races',     label: '🧬 Races',      desc: 'Races ranked by stat bonuses & build synergy' },
  { key: 'traits',    label: '✨ Traits',     desc: 'Traits ranked by damage multipliers & cooldown reduction' },
  { key: 'runes',     label: '💎 Runes',      desc: 'Rune bonuses ranked by DPS & farming utility' },
  { key: 'clans',     label: '🏴 Clans',      desc: 'Clan passives ranked by combat power & resource bonuses' },
  { key: 'artifacts', label: '🏺 Artifacts',  desc: 'Artifact sets ranked by stat bonuses & farming location' },
]

const TIER_ORDER = ['S+', 'S', 'A', 'B', 'C', 'D']

function MetaBadge({ data }) {
  if (!data?.meta) return null
  return (
    <div className="meta-info-bar">
      <span className="meta-badge cyan">📅 Updated: {data.meta.lastUpdated}</span>
      <span className="meta-badge gold">🎮 {data.meta.season}</span>
      {data.meta.upcomingUpdate && (
        <span className="meta-badge purple">🔜 {data.meta.upcomingUpdate.split('(')[0].trim()}</span>
      )}
    </div>
  )
}

export default function TierList() {
  const [data,        setData]       = useState(null)
  const [loading,     setLoading]    = useState(true)
  const [error,       setError]      = useState(null)
  const [activeTab,   setActiveTab]  = useState('fruits')
  const [search,      setSearch]     = useState('')
  const [tierFilter,  setTierFilter] = useState('all')

  useEffect(() => {
    fetch('/data.json')
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false) })
      .catch(e => { setError(e.message); setLoading(false) })
  }, [])

  if (loading) return (
    <div className="page flex-center" style={{ minHeight: '60vh' }}>
      <div style={{ textAlign: 'center' }}>
        <div className="spinner-ring" style={{ margin: '0 auto 1rem' }} />
        <p style={{ color: 'var(--text-muted)' }}>Loading tier data...</p>
      </div>
    </div>
  )

  if (error) return (
    <div className="page">
      <div className="empty-state">
        <span className="emoji">⚠️</span>
        <p>Failed to load: {error}</p>
      </div>
    </div>
  )

  const currentCat  = CATEGORIES.find(c => c.key === activeTab)
  const categoryData = data?.[activeTab] || {}
  const tiers = TIER_ORDER.filter(t =>
    tierFilter === 'all' ? categoryData[t] : categoryData[t] && t === tierFilter
  )
  const totalItems = Object.values(categoryData).flat().length

  return (
    <motion.div
      className="page"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
    >
      <div className="tl-header">
        <div>
          <h1 className="section-title">Tier Lists</h1>
          <p className="section-subtitle">{currentCat?.desc} — {totalItems} items</p>
        </div>
        <MetaBadge data={data} />
      </div>

      {/* Category tabs — scrollable on mobile */}
      <div className="cat-tabs-wrap">
        <div className="cat-tabs">
          {CATEGORIES.map(cat => {
            const count = Object.values(data?.[cat.key] || {}).flat().length
            return (
              <button
                key={cat.key}
                className={`cat-tab ${activeTab === cat.key ? 'active' : ''}`}
                onClick={() => { setActiveTab(cat.key); setSearch(''); setTierFilter('all') }}
              >
                {cat.label}
                {count > 0 && (
                  <span className="cat-tab-count">{count}</span>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Controls */}
      <div className="tl-controls">
        <SearchBar value={search} onChange={setSearch} placeholder={`Search ${activeTab}...`} />
        <select className="input" style={{ maxWidth: 160, flexShrink: 0 }} value={tierFilter} onChange={e => setTierFilter(e.target.value)}>
          <option value="all">All Tiers</option>
          {TIER_ORDER.map(t => <option key={t} value={t}>Tier {t}</option>)}
        </select>
      </div>

      {/* Tier rows */}
      <div style={{ marginTop: '1.5rem' }}>
        <AnimatePresence mode="wait">
          <motion.div key={activeTab} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
            {tiers.length === 0 ? (
              <div className="empty-state">
                <span className="emoji">🔍</span>
                <p>No items match your search</p>
                <button className="btn btn-ghost mt-2" onClick={() => { setSearch(''); setTierFilter('all') }}>Clear Filters</button>
              </div>
            ) : (
              tiers.map(tier => (
                <TierRow
                  key={tier}
                  tier={tier}
                  items={categoryData[tier] || []}
                  category={activeTab}
                  searchQuery={search}
                />
              ))
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Game meta info strip */}
      {data?.gameMeta && activeTab === 'fruits' && (
        <motion.div className="game-meta-strip card" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
          <h3 style={{ color: 'var(--accent-gold)', marginBottom: '0.75rem', fontSize: '1.2rem' }}>📖 Game Info</h3>
          <div className="game-meta-grid">
            <div className="gm-item"><span className="gm-label">Max Level</span><span className="gm-val">{data.gameMeta.maxLevel.toLocaleString()}</span></div>
            <div className="gm-item"><span className="gm-label">Fruit Spawn</span><span className="gm-val">Every 60 min</span></div>
            <div className="gm-item"><span className="gm-label">Fruit Despawn</span><span className="gm-val">After 20 min</span></div>
            <div className="gm-item"><span className="gm-label">Haki Types</span><span className="gm-val">{data.gameMeta.hakiTypes.length}</span></div>
          </div>
          {data.gameMeta.activeCodes?.length > 0 && (
            <div style={{ marginTop: '0.75rem' }}>
              <span className="gm-label" style={{ marginBottom: '0.4rem', display: 'block' }}>🎁 Active Codes ({data.gameMeta.codeRewards})</span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {data.gameMeta.activeCodes.map(code => (
                  <span key={code} className="code-chip">{code}</span>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      )}

      <style>{`
        .tl-header {
          display: flex; align-items: flex-start;
          justify-content: space-between; gap: 1rem;
          margin-bottom: 1.25rem; flex-wrap: wrap;
        }
        .meta-info-bar { display: flex; flex-wrap: wrap; gap: 0.5rem; align-items: center; }
        .meta-badge {
          padding: 0.25rem 0.7rem;
          border-radius: 20px;
          font-size: 0.75rem; font-weight: 700;
          letter-spacing: 0.04em;
        }
        .meta-badge.cyan  { background: rgba(0,212,255,0.1);   border: 1px solid rgba(0,212,255,0.25);   color: var(--accent-cyan); }
        .meta-badge.gold  { background: rgba(245,166,35,0.1);  border: 1px solid rgba(245,166,35,0.25);  color: var(--accent-gold); }
        .meta-badge.purple{ background: rgba(168,85,247,0.1);  border: 1px solid rgba(168,85,247,0.25);  color: #c084fc; }

        .cat-tabs-wrap { overflow-x: auto; margin-bottom: 1.25rem; padding-bottom: 4px; }
        .cat-tabs-wrap::-webkit-scrollbar { height: 3px; }
        .cat-tabs { display: flex; gap: 0.4rem; width: max-content; }
        .cat-tab {
          display: flex; align-items: center; gap: 0.4rem;
          padding: 0.55rem 1rem;
          background: var(--bg-surface);
          border: 1px solid var(--border-dim);
          border-radius: var(--radius-md);
          color: var(--text-secondary);
          font-family: 'Rajdhani', sans-serif;
          font-weight: 700; font-size: 0.9rem;
          cursor: pointer; transition: all 0.2s;
          white-space: nowrap;
        }
        .cat-tab:hover { color: var(--text-primary); border-color: rgba(245,166,35,0.2); }
        .cat-tab.active { background: rgba(245,166,35,0.1); border-color: var(--accent-gold); color: var(--accent-gold); }
        .cat-tab-count {
          background: rgba(255,255,255,0.08); border-radius: 4px;
          padding: 1px 5px; font-size: 0.72rem; color: var(--text-muted);
        }
        .cat-tab.active .cat-tab-count { background: rgba(245,166,35,0.2); color: var(--accent-gold); }

        .tl-controls { display: flex; gap: 0.75rem; align-items: stretch; }
        .tl-controls > *:first-child { flex: 1; }

        .game-meta-strip { margin-top: 2rem; }
        .game-meta-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(140px,1fr)); gap: 0.75rem; }
        .gm-item { display: flex; flex-direction: column; gap: 2px; }
        .gm-label { font-size: 0.72rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.07em; font-weight: 700; }
        .gm-val { font-size: 1rem; font-weight: 700; color: var(--text-primary); }
        .code-chip {
          background: rgba(0,212,255,0.08); border: 1px solid rgba(0,212,255,0.2);
          border-radius: 5px; padding: 0.2rem 0.6rem;
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.72rem; color: var(--accent-cyan);
          cursor: pointer; transition: all 0.15s;
          user-select: all;
        }
        .code-chip:hover { background: rgba(0,212,255,0.15); }

        @media (max-width: 600px) {
          .tl-controls { flex-direction: column; }
          .tl-header { flex-direction: column; }
        }
      `}</style>
    </motion.div>
  )
}
