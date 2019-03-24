class Char {
  constructor(name, basehp, sc) {
    this.name = name
    this.hp = this.basehp = basehp
    this.sc = sc
    this.handcards = []
    this.uselimit = 3
    this.use = []
    this.hasused = [] // Array of card names
    this.card = undefined
    this.conds = {}
    this.lvl = {num: 1, round: -1}
  }

  sufferDamage(dmg, results) {
    this.hp -= dmg
    results.push({
      'content': 'damage',
      'args': {
        'player': this.name,
        'num': dmg
      }
    })
    if (this.hp < 0) {
      this.hp = 0
    }
    results.push({
      'content': 'damage-result',
      'args': {
        'player': this.name,
        'num': this.hp
      }
    })
  }

  setCond(cond, args, results) {
    args.player = this.name
    this.conds[cond] = args
    if (results) {
      results.push({
        content: 'set-cond-' + cond,
        args
      })
    }
  }

  levelUp(num, round, results) {
    this.lvl.num += num
    this.lvl.round = round
    if (this.lvl.num > 3) {
      this.lvl.num = 3
    }
    if (results) {
      results.push({
        content: 'lvlup',
        args: {
          player: this.name,
          num: num
        }
      })
      results.push({
        content: 'lvlchange-result',
        args: {
          player: this.name,
          num: this.lvl.num
        }
      })
    }
  }

  levelDown(num, results) {
    this.lvl.num -= num
    if (this.lvl.num <= 1) {
      this.lvl.num = 1
      this.lvl.round = -1
    }
    if (results) {
      results.push({
        content: 'lvldown',
        args: {
          player: this.name,
          num: num
        }
      })
      results.push({
        content: 'lvlchange-result',
        args: {
          player: this.name,
          num: this.lvl.num
        }
      })
    }
  }
}

class Reimu extends Char {
  constructor() {
    super(
      'Reimu',
      3000,
      [
        {
          name: [
            'Musou Myoutama',
            'Musou Fuuin',
            'Musou Tensei'
          ],
          group: /^sstcb/
        },
        {
          name: [
            'Circle Seal',
            'Double Enchant',
            'Hakurei Bullet Enchant'
          ],
          group: /^ssbh/
        },
        {
          name: [
            'Subspace Cavity',
            'Subspace Cavity Teleport',
            'Dream Subspace Cavity'
          ],
          group: /^ukb/
        },
        {
          name: [
            'Persuasion Needle',
            'Kishin Persuasion Needle',
            'Onmyou Persuasion Needle'
          ],
          group: /^sp/
        }
      ]
    )
  }
}

class Marisa extends Char {
  constructor() {
    super(
      'Marisa',
      2400,
      [
        {
          name: [
            'Stardust',
            'Stardust Fantasy',
            'Milky Way'
          ],
          group: /^llcb/
        },
        {
          name: [
            'Witch Dash',
            'Witch Fantasy',
            'Meteorite'
          ],
          group: /^lac/
        },
        {
          name: [
            'Witch Bullet',
            'Witch Shoot',
            'Witch Starlight'
          ],
          group: /^sb/
        }
      ]
    )
  }
}

export default {
  Reimu,
  Marisa
}