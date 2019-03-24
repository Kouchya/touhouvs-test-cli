const CardInfo = {
  punch: {
    dmg: 50,
    type: 'close',
    tag: 'p'
  },
  kick: {
    dmg: 60,
    type: 'close',
    tag: 'k'
  },
  spirit: {
    dmg: 80,
    type: 'remote',
    tag: 's'
  },
  throw: {
    dmg: 70,
    type: 'remote',
    tag: 't'
  },
  anger: {
    dmg: 100,
    type: 'remote',
    tag: 'a'
  },
  break: {
    dmg: 120,
    type: 'close',
    tag: 'b'
  },
  lvlup: {
    dmg: 0,
    type: 'lvlup',
    tag: 'l'
  },
  harden: {
    dmg: 0,
    type: 'defend',
    tag: 'h'
  },
  tackle: {
    dmg: 80,
    type: 'close',
    tag: 'c'
  },
  lure: {
    dmg: 0,
    type: 'defend',
    tag: 'u'
  },
  dream: {
    dmg: 0,
    type: 'special',
    tag: 'd'
  }
}

const SpellInfo = {
  'Musou Myoutama': {
    dmg: 320
  },
  'Musou Fuuin': {
    dmg: 480
  },
  'Musou Tensei': {
    dmg: 0
  },
  'Circle Seal': {
    dmg: 240
  },
  'Double Enchant': {
    dmg: 360
  },
  'Hakurei Bullet Enchant': {
    dmg: 480
  },
  'Subspace Cavity': {
    dmg: 280
  },
  'Subspace Cavity Teleport': {
    dmg: 420
  },
  'Dream Subspace Cavity': {
    dmg: 560
  },
  'Persuasion Needle': {
    dmg: 220
  },
  'Kishin Persuasion Needle': {
    dmg: 330
  },
  'Onmyou Persuasion Needle': {
    dmg: 440
  },
  'Stardust': {
    dmg: 340
  },
  'Stardust Fantasy': {
    dmg: 480
  },
  'Milky Way': {
    dmg: 560
  },
  'Witch Dash': {
    dmg: 280
  },
  'Witch Fantasy': {
    dmg: 420
  },
  'Meteorite': {
    dmg: 560
  },
  'Witch Bullet': {
    dmg: 240
  },
  'Witch Shoot': {
    dmg: 360
  },
  'Witch Starlight': {
    dmg: 480
  }
}

const CardNames = Object.keys(CardInfo)
const SpellNames = Object.keys(SpellInfo)

export {
  CardInfo,
  CardNames,
  SpellInfo,
  SpellNames
}