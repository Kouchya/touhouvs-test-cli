const CardInfo = {
  punch: {
    dmg: 50,
    type: 'close'
  },
  kick: {
    dmg: 60,
    type: 'close'
  },
  spirit: {
    dmg: 80,
    type: 'remote'
  },
  throw: {
    dmg: 70,
    type: 'remote'
  },
  anger: {
    dmg: 100,
    type: 'remote'
  },
  break: {
    dmg: 120,
    type: 'close'
  },
  lvlup: {
    dmg: 0,
    type: 'lvlup'
  },
  harden: {
    dmg: 0,
    type: 'defend'
  },
  tackle: {
    dmg: 80,
    type: 'close'
  },
  lure: {
    dmg: 0,
    type: 'defend'
  },
  dream: {
    dmg: 0,
    type: 'special'
  }
}

const CardNames = Object.keys(CardInfo)

class Card {
  constructor(name, atk, dfs) {
    this.name = name ? name : CardNames[Math.floor(Math.random() * CardNames.length)]
    this.atk = atk ? atk : Math.floor(Math.random() * 10 + 1)
    this.dfs = dfs ? dfs : Math.floor(Math.random() * 10 + 1)
  }

  serialize() {
    return {
      name: this.name,
      atk: this.atk,
      dfs: this.dfs
    }
  }

  getBaseDamage() {
    return CardInfo[this.name].dmg
  }

  getType() {
    return CardInfo[this.name].type
  }

  doEffect(owner, oppo) {
    // do card effects
    if (this.name === 'break') {
      if (oppo.card !== undefined && oppo.card.name === 'harden') {
        oppo.setCond('blocked', {round: 1, num: 2})
      }
    } else if (this.name === 'lvlup') {
      owner.levelUp(1)
    } else if (this.name === 'tackle') {
      if (oppo.card !== undefined && oppo.card.name === 'harden') {
        oppo.levelDown(1)
      }
    }
  }
}

export default {
  Card
}