import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { generateBuild } from '../utils/buildGenerator'
import { useFavorites } from '../utils/favorites'

const BUILD_TYPES = [
  { id: 'farming', label: 'Farming',    icon: '🌾', desc: 'Max drops & EXP efficiency' },
  { id: 'boss',    label: 'Boss Fight', icon: '🐉', desc: 'Burst damage for raid bosses' },
  { id: 'pvp',     label: 'PvP Meta',   icon: '⚔️', desc: 'Meta loadout for player combat' },
]

const TIER_COLORS = {
  'S+': '#ff9a3c', 'S': '#ff4757', 'A': '#ffd32a',
  'B': '#2ed573',  'C': '#1e90ff', 'D': '#747d8c'
}

const SLOT_CONFIG = [
  { key: 'fruit',  label: 'Devil Fruit',  cat: 'fruits',  icon: '🍎' },
  { key: 'sword',  label: 'Sword',        cat: 'swords',  icon: '⚔️' },
  { key: 'melee',  label: 'Melee Spec',   cat: 'melee',   icon: '👊' },
  { key: 'race',   label: 'Race',         cat: 'races',   icon: '🧬' },
  { key: 'trait',  label: 'Trait',        cat: 'traits',  icon: '✨' },
  { key: 'rune',   label: 'Rune',         cat: 'runes',   icon: '💎' },
  { key: 'clan',   label: 'Clan',         cat: 'clans',   icon: '🏴' },
]

function BuildSlot({ slotCfg, data }) {
  const { toggleFavorite, isFavorite } = useFavorites()
  const item = data
  if (!item) return (
    <div className="build-slot build-slot-empty">
      <span className="bs-icon">{slotCfg.icon}</span>
      <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Not found</span>
    </div>
  )
  const color = TIER_COLORS[item.tier] || '#747d8c'
  const fav = isFavorite(slotCfg.cat, item.name)
  return (
    <motion.div
      className="build-slot"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      style={{ borderColor: `${color}40` }}
    >
      <div className="bs-top">
        <span className="bs-category">{slotCfg.icon} {slotCfg.label}</span>
        <span className="bs-tier" style={{ background: `${color}22`, color, border: `1px solid ${color}55` }}>
          {item.tier}
        </span>
      </div>
      <div className="bs-name">
        <span>{item.emoji || '🔹'}</span>
        {item.name}
      </div>
      {item.description && <p className="bs-desc">{item.description.split('.')[0]}.</p>}
      {item.bonuses && <p className="bs-bonuses">{item.bonuses}</p>}
      {item.tags?.length > 0 && (
        <div className="flex gap-1" style={{ flexWrap: 'wrap', marginTop: '0.4rem' }}>
          {item.tags.map(t => <span key={t} className={`tag tag-${t}`}>{t}</span>)}
        </div>
      )}
      <button className={`bs-fav-btn ${fav ? 'active' : ''}`} onClick={() => toggleFavorite(slotCfg.cat, item)}>
        {fav ? '❤️ Saved' : '🤍 Save'}
      </button>
    </motion.div>
  )
}

function SynergyCard({ synergy }) {
  if (!synergy) return null
  return (
    <motion.div className="synergy-card" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
      <div className="syn-header">
        <span>⚡ Synergy Detected</span>
        <span className="syn-name">{synergy.name}</span>
        {synergy.rating && (
          <span className="syn-rating" style={{ color: TIER_COLORS[synergy.rating] }}>{synergy.rating}</span>
        )}
      </div>
      <p className="syn-desc">{synergy.description}</p>
      <div className="syn-items">
        {synergy.items.map(i => <span key={i} className="syn-item">{i}</span>)}
      </div>
    </motion.div>
  )
}

export default function AIBuilder() {
  const [data,       setData]       = useState(null)
  const [buildType,  setBuildType]  = useState('pvp')
  const [build,      setBuild]      = useState(null)
  const [generating, setGenerating] = useState(false)
  const [generated,  setGenerated]  = useState(false)

  useEffect(() => {
    fetch('/data.json').then(r => r.json()).then(setData)
  }, [])

  const handleGenerate = () => {
    if (!data) return
    setGenerating(true); setBuild(null)
    setTimeout(() => {
      setBuild(generateBuild(data, buildType))
      setGenerating(false); setGenerated(true)
    }, 1000)
  }

  const ratingColor = build ? (TIER_COLORS[build.overallRating] || '#747d8c') : '#747d8c'

  return (
    <motion.div
      className="page builder-page"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
    >
      <h1 className="section-title">AI Build Generator</h1>
      <p className="section-subtitle">
        Rule-based optimizer using live tier data — 7 slots: Fruit, Sword, Melee, Race, Trait, Rune & Clan
      </p>

      {/* Build type */}
      <div className="build-type-grid">
        {BUILD_TYPES.map(bt => (
          <button
            key={bt.id}
            className={`build-type-btn ${buildType === bt.id ? 'active' : ''}`}
            onClick={() => { setBuildType(bt.id); setBuild(null); setGenerated(false) }}
          >
            <span className="bt-icon">{bt.icon}</span>
            <span className="bt-label">{bt.label}</span>
            <span className="bt-desc">{bt.desc}</span>
          </button>
        ))}
      </div>

      {/* Generate */}
      <div className="generate-section">
        <motion.button
          className={`btn btn-primary generate-btn ${generating ? 'loading' : ''}`}
          onClick={handleGenerate}
          disabled={!data || generating}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          {generating
            ? <><span className="spinner-dot" /> Analyzing meta...</>
            : <>{generated ? '🔄 Regenerate' : '⚡ Generate'} {BUILD_TYPES.find(b => b.id === buildType)?.label} Build</>
          }
        </motion.button>
        {!data && <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.5rem' }}>Loading game data...</p>}
      </div>

      {/* Output */}
      <AnimatePresence mode="wait">
        {generating && (
          <motion.div key="loading" className="build-loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="build-loading-bar" />
            <p>Scoring all items across 7 categories against {BUILD_TYPES.find(b=>b.id===buildType)?.label.toLowerCase()} meta...</p>
          </motion.div>
        )}

        {build && !generating && (
          <motion.div key="result" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>

            {/* Header row */}
            <div className="build-result-header">
              <div>
                <h2 className="build-result-title">
                  {BUILD_TYPES.find(b=>b.id===build.type)?.icon}{' '}
                  {BUILD_TYPES.find(b=>b.id===build.type)?.label} Build
                </h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: 480 }}>{build.description}</p>
              </div>
              <div className="build-rating" style={{ background: `${ratingColor}18`, border: `2px solid ${ratingColor}`, color: ratingColor }}>
                <span className="build-rating-label">Rating</span>
                <span className="build-rating-value">{build.overallRating}</span>
              </div>
            </div>

            {/* 7-slot grid */}
            <div className="build-slots-grid">
              {SLOT_CONFIG.map((slot) => (
                <BuildSlot key={slot.key} slotCfg={slot} data={build[slot.key]} />
              ))}
            </div>

            <SynergyCard synergy={build.synergy} />

            <motion.div className="pro-tip" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
              <span className="pro-tip-label">💡 Pro Tip</span>
              <p>{build.tip}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .builder-page { max-width: 960px; }
        .build-type-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 0.75rem; margin-bottom: 1.5rem; }
        .build-type-btn {
          display: flex; flex-direction: column; align-items: center;
          gap: 0.35rem; padding: 1.2rem 0.75rem;
          background: var(--bg-surface);
          border: 2px solid var(--border-dim);
          border-radius: var(--radius-md);
          cursor: pointer; transition: all 0.2s; text-align: center;
        }
        .build-type-btn:hover { border-color: rgba(245,166,35,0.3); background: var(--bg-card); }
        .build-type-btn.active { border-color: var(--accent-gold); background: rgba(245,166,35,0.08); animation: pulse-glow 2s ease-in-out infinite; }
        .bt-icon { font-size: 1.8rem; }
        .bt-label { font-family: 'Pirata One', cursive; font-size: 1.15rem; color: var(--text-primary); }
        .bt-desc  { font-size: 0.75rem; color: var(--text-muted); }

        .generate-section { text-align: center; margin-bottom: 2rem; }
        .generate-btn { font-size: 1.05rem; padding: 0.8rem 2.2rem; gap: 0.6rem; }
        .spinner-dot {
          width: 10px; height: 10px;
          border: 2px solid rgba(0,0,0,0.3); border-top-color: #000;
          border-radius: 50%; display: inline-block;
          animation: spin 0.6s linear infinite;
        }

        .build-loading { text-align: center; padding: 2rem; color: var(--text-muted); }
        .build-loading-bar {
          height: 3px; border-radius: 2px; margin-bottom: 1rem;
          background: linear-gradient(90deg, transparent, var(--accent-gold), transparent);
          background-size: 200% 100%; animation: shimmer 1.2s ease infinite;
        }

        .build-result-header {
          display: flex; align-items: flex-start; justify-content: space-between;
          gap: 1rem; margin-bottom: 1.5rem; flex-wrap: wrap;
        }
        .build-result-title { font-size: 1.7rem; color: var(--accent-gold); margin-bottom: 0.4rem; }
        .build-rating {
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          width: 68px; height: 68px; border-radius: var(--radius-md); flex-shrink: 0;
        }
        .build-rating-label { font-size: 0.6rem; font-weight: 800; letter-spacing: 0.1em; text-transform: uppercase; }
        .build-rating-value { font-family: 'Pirata One', cursive; font-size: 1.7rem; line-height: 1; }

        .build-slots-grid {
          display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 0.85rem; margin-bottom: 1.25rem;
        }
        .build-slot {
          background: var(--bg-card); border: 1px solid var(--border-dim);
          border-radius: var(--radius-md); padding: 1rem; transition: border-color 0.2s;
        }
        .build-slot:hover { border-color: rgba(245,166,35,0.3); }
        .build-slot-empty {
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          gap: 0.4rem; min-height: 90px; opacity: 0.5;
        }
        .bs-icon { font-size: 1.4rem; }
        .bs-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.5rem; }
        .bs-category { font-size: 0.75rem; color: var(--text-muted); font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; }
        .bs-tier { padding: 0.15rem 0.45rem; border-radius: 4px; font-size: 0.7rem; font-weight: 800; }
        .bs-name { font-size: 1.05rem; font-weight: 700; display: flex; align-items: center; gap: 0.4rem; margin-bottom: 0.35rem; }
        .bs-desc { font-size: 0.78rem; color: var(--text-muted); line-height: 1.4; }
        .bs-bonuses { font-size: 0.72rem; color: var(--accent-cyan); font-family: 'JetBrains Mono', monospace; margin-top: 0.25rem; }
        .bs-fav-btn {
          margin-top: 0.7rem; width: 100%;
          background: rgba(255,255,255,0.04); border: 1px solid var(--border-dim);
          color: var(--text-muted); border-radius: 5px; padding: 0.3rem 0.7rem;
          font-size: 0.78rem; font-weight: 600; cursor: pointer;
          transition: all 0.2s; font-family: 'Rajdhani', sans-serif;
        }
        .bs-fav-btn:hover, .bs-fav-btn.active { background: rgba(255,71,87,0.1); border-color: rgba(255,71,87,0.35); color: #ff4757; }

        .synergy-card {
          background: linear-gradient(135deg, rgba(168,85,247,0.07), rgba(0,212,255,0.04));
          border: 1px solid rgba(168,85,247,0.25);
          border-radius: var(--radius-md); padding: 1.2rem; margin-bottom: 1rem;
        }
        .syn-header { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.5rem; flex-wrap: wrap; }
        .syn-header > span:first-child { font-weight: 700; color: var(--accent-cyan); }
        .syn-name { color: var(--accent-gold); font-family: 'Pirata One', cursive; font-size: 1.05rem; }
        .syn-rating { font-weight: 900; font-family: 'Pirata One', cursive; font-size: 1rem; }
        .syn-desc { color: var(--text-secondary); font-size: 0.88rem; margin-bottom: 0.7rem; }
        .syn-items { display: flex; flex-wrap: wrap; gap: 0.35rem; }
        .syn-item {
          background: rgba(255,255,255,0.06); border: 1px solid var(--border-dim);
          border-radius: 5px; padding: 0.2rem 0.55rem; font-size: 0.78rem; color: var(--text-secondary);
        }

        .pro-tip {
          background: rgba(0,212,255,0.05); border: 1px solid rgba(0,212,255,0.2);
          border-radius: var(--radius-md); padding: 1rem 1.2rem;
          display: flex; gap: 0.75rem; align-items: flex-start;
        }
        .pro-tip-label { color: var(--accent-cyan); font-weight: 700; font-size: 0.82rem; text-transform: uppercase; letter-spacing: 0.05em; flex-shrink: 0; }
        .pro-tip p { color: var(--text-secondary); font-size: 0.88rem; line-height: 1.5; }

        @media (max-width: 600px) {
          .build-type-grid { grid-template-columns: 1fr; }
          .build-slots-grid { grid-template-columns: 1fr 1fr; }
        }
      `}</style>
    </motion.div>
  )
}
