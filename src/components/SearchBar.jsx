import { useState, useRef } from 'react'
import { motion } from 'framer-motion'

export default function SearchBar({ value, onChange, placeholder = 'Search items...' }) {
  const [focused, setFocused] = useState(false)
  const inputRef = useRef(null)

  return (
    <motion.div
      className="search-bar-wrap"
      animate={{ boxShadow: focused
        ? '0 0 0 2px rgba(245,166,35,0.35), 0 4px 20px rgba(0,0,0,0.3)'
        : '0 2px 10px rgba(0,0,0,0.2)'
      }}
      transition={{ duration: 0.2 }}
    >
      <span className="search-icon">🔍</span>
      <input
        ref={inputRef}
        type="text"
        className="search-input"
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
      {value && (
        <button className="search-clear" onClick={() => { onChange(''); inputRef.current?.focus() }}>
          ✕
        </button>
      )}

      <style>{`
        .search-bar-wrap {
          display: flex; align-items: center; gap: 0.75rem;
          background: var(--bg-surface);
          border: 1px solid rgba(245,166,35,0.2);
          border-radius: var(--radius-md);
          padding: 0.65rem 1rem;
        }
        .search-icon { font-size: 1rem; flex-shrink: 0; }
        .search-input {
          flex: 1; background: none; border: none; outline: none;
          color: var(--text-primary);
          font-family: 'Rajdhani', sans-serif;
          font-size: 1rem; font-weight: 500;
        }
        .search-input::placeholder { color: var(--text-muted); }
        .search-clear {
          background: none; border: none; cursor: pointer;
          color: var(--text-muted); font-size: 0.85rem;
          padding: 2px 6px; border-radius: 4px;
          transition: all 0.15s;
        }
        .search-clear:hover { color: var(--text-primary); background: rgba(255,255,255,0.08); }
      `}</style>
    </motion.div>
  )
}
