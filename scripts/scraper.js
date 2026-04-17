/**
 * Sailor Piece Hub – Data Scraper
 * Scrapes tier list data and updates public/data.json
 * Usage: node scripts/scraper.js
 * Deps:  npm install axios cheerio (devDependencies)
 */

import axios from 'axios'
import * as cheerio from 'cheerio'
import { readFileSync, writeFileSync, existsSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname  = dirname(__filename)

const TARGET_URL = 'https://beebom.com/sailor-piece-tier-list/'
const DATA_PATH  = join(__dirname, '../public/data.json')

const TIER_ALIASES = {
  's+': 'S+', 'ss': 'S+', 'splus': 'S+', 'godly': 'S+',
  's': 'S',
  'a': 'A',
  'b': 'B',
  'c': 'C',
  'd': 'D', 'f': 'D',
}

const EMOJI_MAP = {
  Light: '✨', Atomic: '⚛️', Void: '🌌', Dragon: '🐉', Magma: '🌋',
  Buddha: '🔱', Gravity: '🌑', Ice: '❄️', Quake: '💥', Sand: '🏜️',
  Flame: '🔥', Rubber: '🎈', Smoke: '💨', Dark: '🌑', Phoenix: '🦅',
  Bomb: '💣', Spring: '🌀', Spin: '🌪️', Chop: '🔪', Slip: '🧊',
  'Ame no Habakiri': '⚔️', Enma: '🗡️', Yoru: '⚔️', Shusui: '🗡️',
  'Six Powers': '🌀', 'Death Step': '💀', 'Dark Step': '🌑',
  "Conqueror's Haki": '👑', Awakening: '🌠',
  'Observation Haki': '👁️', 'Armament Haki': '🛡️',
}

function normalizeTier(raw) {
  const key = raw
    .toLowerCase()
    .replace(/\s+tier\s*$/i, '')
    .replace(/[^a-z+]/g, '')
    .trim()
  return TIER_ALIASES[key] || null
}

function cleanItemName(raw) {
  return raw
    .replace(/\(.*?\)/g, '')
    .replace(/\[.*?\]/g, '')
    .replace(/fruit|sword|trait|spec/gi, '')
    .replace(/[\n\r\t]+/g, ' ')
    .trim()
    .replace(/\s+/g, ' ')
}

function inferTags(name, tier) {
  const tags = []
  const n = name.toLowerCase()
  if (['light','buddha','magma','flame','sand','armament'].some(k => n.includes(k))) tags.push('farming')
  if (['light','quake','atomic','void','gravity','ice','enma','yoru','death step','six powers'].some(k => n.includes(k))) tags.push('pvp')
  if (['atomic','void','dragon','quake','superhuman','ame no'].some(k => n.includes(k))) tags.push('boss')
  if (['light','six powers','sky walk'].some(k => n.includes(k))) tags.push('speed')
  if (['atomic','quake','buddha','magma'].some(k => n.includes(k))) tags.push('aoe')
  if ((tier === 'S+' || tier === 'S') && tags.length === 0) tags.push('pvp')
  return [...new Set(tags)]
}

async function scrape() {
  console.log('🏴‍☠️  Sailor Piece Hub Scraper')
  console.log(`🌐 Fetching: ${TARGET_URL}\n`)

  let html
  try {
    const res = await axios.get(TARGET_URL, {
      timeout: 20000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Cache-Control': 'no-cache',
      }
    })
    html = res.data
    console.log(`✅ Page fetched (${Math.round(html.length / 1024)}KB)`)
  } catch (err) {
    console.error('❌ Fetch failed:', err.message)
    if (err.response) console.error('   Status:', err.response.status)
    console.log('\n⚠️  Keeping existing data.json unchanged')
    process.exit(0)
  }

  const $ = cheerio.load(html)
  const scraped = { fruits: {}, swords: {}, traits: {}, specs: {} }
  let currentCategory = 'fruits'
  let currentTier = null
  let itemsFound = 0

  const TIER_WEIGHTS = { 'S+': 6, S: 5, A: 4, B: 3, C: 2, D: 1 }

  // --- Walk the DOM ---
  $('h1, h2, h3, h4, h5, ul, ol, table').each((_, el) => {
    const tag = el.tagName.toLowerCase()
    const text = $(el).text().trim()

    if (['h1','h2','h3','h4','h5'].includes(tag)) {
      const lower = text.toLowerCase()

      // Detect category
      if (lower.includes('fruit'))  currentCategory = 'fruits'
      else if (lower.includes('sword'))  currentCategory = 'swords'
      else if (lower.includes('trait'))  currentCategory = 'traits'
      else if (lower.includes('spec') || lower.includes('fighting style') || lower.includes('combat style')) currentCategory = 'specs'

      // Detect tier
      const tier = normalizeTier(text)
      if (tier) currentTier = tier
      return
    }

    // --- Tables ---
    if (tag === 'table') {
      $(el).find('tr').each((_, row) => {
        const cells = $(row).find('td, th')
          .map((_, td) => $(td).text().trim())
          .get()
        if (cells.length < 2) return

        const tier = normalizeTier(cells[0])
        if (!tier) return

        cells.slice(1).join(', ').split(/[,;•\n]+/).forEach(raw => {
          const name = cleanItemName(raw)
          if (name.length < 2 || name.length > 50) return
          if (!scraped[currentCategory][tier]) scraped[currentCategory][tier] = []
          if (!scraped[currentCategory][tier].some(i => i.name === name)) {
            scraped[currentCategory][tier].push({
              name,
              emoji: EMOJI_MAP[name] || '🔹',
              description: '',
              tags: inferTags(name, tier)
            })
            itemsFound++
          }
        })
      })
      return
    }

    // --- Lists ---
    if ((tag === 'ul' || tag === 'ol') && currentTier) {
      $(el).find('> li').each((_, li) => {
        const raw = $(li).clone().children('ul,ol').remove().end().text().trim()
        const name = cleanItemName(raw)
        if (name.length < 2 || name.length > 50) return
        if (!scraped[currentCategory][currentTier]) scraped[currentCategory][currentTier] = []
        if (!scraped[currentCategory][currentTier].some(i => i.name === name)) {
          scraped[currentCategory][currentTier].push({
            name,
            emoji: EMOJI_MAP[name] || '🔹',
            description: '',
            tags: inferTags(name, currentTier)
          })
          itemsFound++
        }
      })
    }
  })

  console.log(`\n📦 Scraped ${itemsFound} raw items`)

  // --- Merge with existing data ---
  let existing = {}
  if (existsSync(DATA_PATH)) {
    try {
      existing = JSON.parse(readFileSync(DATA_PATH, 'utf-8'))
      console.log('📂 Loaded existing data.json')
    } catch {
      console.log('⚠️  Existing data.json is malformed, will overwrite')
    }
  }

  const merged = { ...existing }
  let categoriesUpdated = 0

  for (const [cat, tiers] of Object.entries(scraped)) {
    const count = Object.values(tiers).flat().length
    if (count >= 2) {
      // Sort tiers by weight within each category
      const sortedTiers = Object.fromEntries(
        Object.entries(tiers).sort(([a], [b]) => (TIER_WEIGHTS[b] || 0) - (TIER_WEIGHTS[a] || 0))
      )
      merged[cat] = sortedTiers
      categoriesUpdated++
      console.log(`✅ ${cat}: ${count} items across ${Object.keys(tiers).length} tiers`)
    } else {
      console.log(`⏭️  ${cat}: not enough data scraped (${count}), keeping existing`)
    }
  }

  // Update meta
  merged.meta = {
    ...(existing.meta || {}),
    lastUpdated: new Date().toISOString().split('T')[0],
    scrapedFrom: TARGET_URL,
    itemsScraped: itemsFound,
    categoriesUpdated,
    autoUpdated: true,
  }

  writeFileSync(DATA_PATH, JSON.stringify(merged, null, 2))

  console.log(`\n✨ data.json written → ${DATA_PATH}`)
  console.log(`📅 Date: ${merged.meta.lastUpdated}`)
  console.log(`📊 Categories updated: ${categoriesUpdated}/4`)

  if (itemsFound === 0) {
    console.log('\n⚠️  No items scraped — the page structure may have changed.')
    console.log('   Edit scripts/scraper.js selectors to match the current site layout.')
  }

  console.log('\n🏴‍☠️  Done!')
}

scrape().catch(err => {
  console.error('\n💀 Fatal scraper error:', err.message)
  process.exit(1)
})
