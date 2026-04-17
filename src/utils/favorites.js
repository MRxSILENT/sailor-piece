import { useState, useEffect, useCallback } from 'react'

const STORAGE_KEY = 'sailorpiece_favorites'

export function useFavorites() {
  const [favorites, setFavorites] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      return stored ? JSON.parse(stored) : {}
    } catch {
      return {}
    }
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites))
  }, [favorites])

  const toggleFavorite = useCallback((category, item) => {
    setFavorites(prev => {
      const catItems = prev[category] || []
      const exists = catItems.some(i => i.name === item.name)
      const updated = exists
        ? catItems.filter(i => i.name !== item.name)
        : [...catItems, item]
      return { ...prev, [category]: updated }
    })
  }, [])

  const isFavorite = useCallback((category, itemName) => {
    return (favorites[category] || []).some(i => i.name === itemName)
  }, [favorites])

  const clearFavorites = useCallback(() => {
    setFavorites({})
  }, [])

  const removeFavorite = useCallback((category, itemName) => {
    setFavorites(prev => ({
      ...prev,
      [category]: (prev[category] || []).filter(i => i.name !== itemName)
    }))
  }, [])

  return { favorites, toggleFavorite, isFavorite, clearFavorites, removeFavorite }
}
