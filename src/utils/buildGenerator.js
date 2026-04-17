/**
 * Sailor Piece Hub — AI Build Generator v3
 * Updated with real wiki data: Fruits, Swords, Melee Specs, Races, Traits, Runes, Clans
 */

const TIER_WEIGHTS = { 'S+': 100, 'S': 80, 'A': 60, 'B': 40, 'C': 20, 'D': 5 }

const BUILD_RULES = {
  farming: {
    fruitTags:  ['farming', 'aoe', 'speed'],
    swordTags:  ['farming'],
    meleeTags:  ['farming', 'aoe'],
    raceTags:   ['farming'],
    traitTags:  ['farming'],
    runeTags:   ['farming'],
    clanTags:   ['farming'],
    priorityNames: ['Kitsune Fruit', 'Light Fruit', 'Shadow', 'Rimuru', 'Kitsune', 'Fortune Rune', 'Radiant Rune', 'Monarch', 'Emperor'],
    description: 'Max drop rate and EXP efficiency. Kitsune Lucky Multiplier + Fortune/Radiant Runes stack for the highest rare drop chance in the game.',
    tip: 'Stack Kitsune Race + Fortune Rune + Monarch Clan for triple luck stacking. Use Abyssal Empress for AFK farming.',
    icon: '🌾'
  },
  boss: {
    fruitTags:  ['boss', 'pvp', 'aoe'],
    swordTags:  ['boss', 'pvp'],
    meleeTags:  ['boss', 'pvp'],
    raceTags:   ['boss'],
    traitTags:  ['boss'],
    runeTags:   ['boss'],
    clanTags:   ['boss'],
    priorityNames: ['Shadow Monarch', 'Ice Queen', 'Atomic', 'Dragon Fruit', 'Moon Slayer', 'Havoc Rune', 'Frostbane', 'Emperor', 'Celestial'],
    description: 'Maximum burst for raid bosses. Shadow Monarch damage + Havoc Rune 82% boost + Frostbane stacking passive = fastest boss kills.',
    tip: 'Use Conqueror\'s Haki for AoE stun on pull. Frostbane clan stacks damage — the longer the fight, the stronger you get.',
    icon: '🐉'
  },
  pvp: {
    fruitTags:  ['pvp', 'speed'],
    swordTags:  ['pvp', 'boss'],
    meleeTags:  ['pvp'],
    raceTags:   ['pvp'],
    traitTags:  ['pvp', 'boss'],
    runeTags:   ['pvp'],
    clanTags:   ['pvp'],
    priorityNames: ['Light Fruit', 'Ice Queen', 'Yamato', 'Moon Slayer', 'Emperor', 'Swordblessed', 'Havoc Rune', 'Alter', 'Upper', 'Warlord', 'SwordBlessed'],
    description: 'Meta PvP loadout — Light speed + Emperor cooldowns + top DPS sword + Alter/Upper stacking clan passives.',
    tip: 'Emperor Trait cuts cooldowns dramatically — spam skills faster than enemies can dodge. Light Fruit flight makes you impossible to lock down.',
    icon: '⚔️'
  }
}

function scoreItem(item, tierKey, buildType, tagKey) {
  const rule = BUILD_RULES[buildType]
  const relevantTags = rule[tagKey] || []
  let score = TIER_WEIGHTS[tierKey] || 0
  const matchedTags = (item.tags || []).filter(t => relevantTags.includes(t))
  score += matchedTags.length * 18
  if (rule.priorityNames.some(n => item.name.toLowerCase().includes(n.toLowerCase()))) score += 32
  return score
}

function getBestItem(categoryData, buildType, tagKey) {
  if (!categoryData) return null
  let best = null
  let bestScore = -1
  for (const [tier, items] of Object.entries(categoryData)) {
    for (const item of (items || [])) {
      const score = scoreItem(item, tier, buildType, tagKey)
      if (score > bestScore) { bestScore = score; best = { ...item, tier, score } }
    }
  }
  return best
}

function findSynergy(data, buildType, picks) {
  if (!data.synergies) return null
  const pickNames = picks.filter(Boolean).map(p => p.name)
  const matching = (data.synergies || [])
    .filter(syn => syn.type === buildType)
    .map(syn => ({ ...syn, overlap: syn.items.filter(n => pickNames.some(p => p.includes(n) || n.includes(p))).length }))
    .sort((a, b) => b.overlap - a.overlap)
  return matching[0]?.overlap >= 1 ? matching[0] : data.synergies.find(s => s.type === buildType) || null
}

export function generateBuild(data, buildType) {
  if (!data || !BUILD_RULES[buildType]) return { error: 'Invalid build type or missing data' }
  const rule = BUILD_RULES[buildType]

  const fruit  = getBestItem(data.fruits,    buildType, 'fruitTags')
  const sword  = getBestItem(data.swords,    buildType, 'swordTags')
  const melee  = getBestItem(data.melee,     buildType, 'meleeTags')
  const race   = getBestItem(data.races,     buildType, 'raceTags')
  const trait  = getBestItem(data.traits,    buildType, 'traitTags')
  const rune   = getBestItem(data.runes,     buildType, 'runeTags')
  const clan   = getBestItem(data.clans,     buildType, 'clanTags')

  const picks = [fruit, sword, melee, race, trait, rune, clan]
  const synergy = findSynergy(data, buildType, picks)

  const avgScore = picks.filter(Boolean).reduce((s, i) => s + (i.score || 0), 0) / picks.filter(Boolean).length
  let rating = 'S+'
  if (avgScore < 80) rating = 'S'
  if (avgScore < 60) rating = 'A'
  if (avgScore < 40) rating = 'B'

  return {
    type: buildType,
    icon: rule.icon,
    fruit, sword, melee, race, trait, rune, clan,
    synergy,
    overallRating: rating,
    description: rule.description,
    tip: rule.tip,
    generatedAt: new Date().toISOString(),
  }
}

export function getAllBuildTypes() {
  return Object.keys(BUILD_RULES).map(k => ({
    id: k,
    label: k.charAt(0).toUpperCase() + k.slice(1),
    icon: BUILD_RULES[k].icon,
    desc: BUILD_RULES[k].description.split('.')[0] + '.'
  }))
}
