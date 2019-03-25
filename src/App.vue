<template>
  <div id="app">
    <thvs-char v-if="status.char" :chars="chars"></thvs-char>
    <thvs-battle v-else-if="status.battle" :player="serverInfo.self" :oppo="serverInfo.oppo" :info="consoleLog"></thvs-battle>
  </div>
</template>

<script>
import ThvsChar from './components/thvs-char.vue'
import ThvsBattle from './components/thvs-battle.vue'

import charlist from './data/char.json'
import chars from './logic/char.js'
import card from './logic/card.js'
import { consumeList } from './util.js'

export default {
  name: 'app',
  components: {
    ThvsChar,
    ThvsBattle
  },
  data () {
    return {
      chars: charlist,
      status: {
        char: true,
        battle: false,
        end: false
      },
      serverInfo: {
        self: undefined,
        oppo: undefined
      },
      consoleLog: ''
    }
  },
  methods: {
    changeToStatus (status) {
      if (this.status[status]) {
        return
      }

      for (let key of Object.keys(this.status)) {
        this.status[key] = false
      }
      this.status[status] = true
    },
    displayResults (results) {
      consumeList({
        interval: 1500,
        list: results,
        onItem: result => {
          let args = result.args
          for (const key in args) {
            if (key.startsWith('player')) {
              args[key] = this.$t(`char['${args[key]}'].name`)
            } else if (key.startsWith('card')) {
              args[key] = this.$t(`card['${args[key]}'].name`)
            } else if (key === 'subcards') {
              args[key] = args[key].map(card => {
                return this.$t(`card['${card.name}'].name`) + `(${card.atk}/${card.dfs})`
              }).reduce((str, name) => str + name + ' + ', '')
              args[key] = args[key].substring(0, args[key].length - 3)
            }
          }
          this.consoleLog += this.$t(`result['${result.content}']`, args) + '\n'
        },
        onFinish: () => {
          this.consoleLog += '\n'
          this.$socket.emit('roundend')
        }
      })
    }
  },
  mounted () {
    this.$socket.on('char selected', (plyrname, opponame) => {
      let plyr = new chars[plyrname]()
      let oppo = new chars[opponame]()
      this.serverInfo.self = plyr
      this.serverInfo.oppo = oppo
      /* for (let i = 0; i < 7; i++) {
        plyr.handcards.push(new card.Card())
      } */
      plyr.handcards.push(new card.Card('spirit'))
      plyr.handcards.push(new card.Card('punch'))
      plyr.handcards.push(new card.Card('break'))
      plyr.handcards.push(new card.Card('lvlup'))
      for (let i = 0; i < 3; i++) {
        plyr.handcards.push(new card.Card())
      }
      this.$socket.emit('handcards', plyr.handcards.map(card => {
        return card.serialize()
      }))
    })

    this.$socket.on('oppo handcards', handcards => {
      for (const hc of handcards) {
        this.serverInfo.oppo.handcards.push(new card.Card(hc.name, hc.atk, hc.dfs))
      }
      this.$socket.emit('oppo recv')
    })

    this.$socket.on('battle', () => {
      this.changeToStatus('battle')
    })

    this.$socket.on('op prohibit', () => {
      this.operable = false
    })

    this.$socket.on('chosen cards', (selfuse, oppouse) => {
      let plyrstr = selfuse.reduce((str, index) => {
        return str + this.serverInfo.self.handcards[index].tag
      }, '')
      let plyrrawcards = selfuse.map(index => {
        return this.serverInfo.self.handcards[index]
      })

      let oppostr = oppouse.reduce((str, index) => {
        return str + this.serverInfo.oppo.handcards[index].tag
      }, '')
      let opporawcards = oppouse.map(index => {
        return this.serverInfo.oppo.handcards[index]
      })

      let results = []
      while (plyrstr.length > 0 || oppostr.length > 0) {
        let plyrcard, oppocard

        let self_match = false
        for (let sc of this.serverInfo.self.sc) {
          let res = sc.group.exec(plyrstr)
          if (res !== null) {
            self_match = true
            plyrstr = plyrstr.substring(res[0].length)
            let group = plyrrawcards.splice(0, res[0].length)
            let name = sc.name[this.serverInfo.self.lvl.num - 1]
            let atk = group.reduce((sum, card) => {
              return sum + card.atk
            }, 0)
            let dfs = group.reduce((sum, card) => {
              return sum + card.dfs
            }, 0)
            plyrcard = new card.Card(name, atk, dfs, group.map(card => {
              return { name: card.name, atk: card.atk, dfs: card.dfs }
            }))
            break
          }
        }
        if (!self_match) {
          plyrstr = plyrstr.substring(1)
          plyrcard = plyrrawcards.shift()
        }

        let oppo_match = false
        for (let sc of this.serverInfo.oppo.sc) {
          let res = sc.group.exec(oppostr)
          if (res !== null) {
            oppo_match = true
            oppostr = oppostr.substring(res[0].length)
            let group = opporawcards.splice(0, res[0].length)
            let name = sc.name[this.serverInfo.oppo.lvl.num - 1]
            let atk = group.reduce((sum, card) => {
              return sum + card.atk
            }, 0)
            let dfs = group.reduce((sum, card) => {
              return sum + card.dfs
            }, 0)
            oppocard = new card.Card(name, atk, dfs, group.map(card => {
              return { name: card.name, atk: card.atk, dfs: card.dfs }
            }))
            break
          }
        }
        if (!oppo_match) {
          oppostr = oppostr.substring(1)
          oppocard = opporawcards.shift()
        }

        this.serverInfo.self.card = plyrcard
        this.serverInfo.oppo.card = oppocard

        if (plyrcard !== undefined) {
          this.serverInfo.self.hasused = plyrcard.subcards
        }
        if (oppocard !== undefined) {
          this.serverInfo.oppo.hasused = oppocard.subcards
        }

        if (plyrcard !== undefined) {
          let args = {
            'player': this.serverInfo.self.name,
            'card': plyrcard.name,
            'atk': plyrcard.atk,
            'dfs': plyrcard.dfs
          }
          let content = 'use-card'
          if (plyrcard.isSpell) {
            args.subcards = plyrcard.subcards
            content = 'use-spell'
          }
          results.push({ content, args })
        }
        if (oppocard !== undefined) {
          let args = {
            'player': this.serverInfo.oppo.name,
            'card': oppocard.name,
            'atk': oppocard.atk,
            'dfs': oppocard.dfs
          }
          let content = 'use-card'
          if (oppocard.isSpell) {
            args.subcards = oppocard.subcards
            content = 'use-spell'
          }
          results.push({ content, args })
        }

        let attacker, defender
        let mode = 'normal' // if not normal, then nobody moves
        if (plyrcard === undefined) {
          if (oppocard.getType() !== 'defend') {
            attacker = this.serverInfo.oppo
            defender = this.serverInfo.self
          }
        } else if (oppocard === undefined) {
          if (plyrcard.getType() !== 'defend') {
            attacker = this.serverInfo.self
            defender = this.serverInfo.oppo
          }
        } else if (plyrcard.getType() === 'defend') {
          if (oppocard.getType() !== 'defend') {
            attacker = this.serverInfo.oppo
            defender = this.serverInfo.self
          }
        } else if (oppocard.getType() === 'defend') {
          if (plyrcard.getType() !== 'defend') {
            attacker = this.serverInfo.self
            defender = this.serverInfo.oppo
          }
        } else if (plyrcard.atk > oppocard.atk) {
          attacker = this.serverInfo.self
          defender = this.serverInfo.oppo
        } else if (plyrcard.atk < oppocard.atk) {
          attacker = this.serverInfo.oppo
          defender = this.serverInfo.self
        } else {
          mode = 'tied'
        }

        if (mode === 'tied') {
          // nobody moves
          results.push({
            'content': 'tied',
            'args': {}
          })
        } else if (mode === 'normal') {
          // Fight!
          results.push({
            'content': 'use-hint',
            'args': {
              'player': attacker.name,
              'card': attacker.card.name,
              'atk': attacker.card.atk,
              'dfs': attacker.card.dfs
            }
          })
          let factor = 1
          if (defender.card !== undefined) {
            if (attacker.card.atk / defender.card.dfs >= 2 || (attacker.card.name === 'break' && defender.card !== undefined && defender.card.name === 'harden')) {
              factor = 2 // critical hit
              results.push({
                'content': 'critical',
                'args': {}
              })
            } else if (attacker.card.atk / defender.card.dfs <= 0.5) {
              factor = 0.5 // anti-critical
              results.push({
                'content': 'anti-critical',
                'args': {}
              })
            } else {
              factor += (attacker.card.atk - defender.card.dfs) / 10
            }
          }

          let dmg = Math.floor(attacker.card.getBaseDamage() * factor)

          if (defender.card !== undefined && ['close', 'remote'].includes(attacker.card.getType())) {
            if (defender.card.name === 'harden' && attacker.card.name !== 'break') {
              if (defender.card.dfs < attacker.card.atk) {
                dmg /= 2
                results.push({
                  'content': 'weak-harden',
                  'args': {
                    'player': defender.name
                  }
                })
              } else if (defender.card.dfs >= attacker.card.atk) {
                dmg = 0
                results.push({
                  'content': 'strong-harden',
                  'args': {
                    'player': defender.name
                  }
                })
              }
            } else if (defender.card.name === 'lure' && attacker.card.getType() === 'close') {
              dmg = 0
              results.push({
                'content': 'lure',
                'args': {
                  'player': defender.name
                }
              })
              attacker.sufferDamage(attacker.card.getBaseDamage(), results)
              attacker.card.doEffect(defender, attacker, results)
              continue
            }
          }

          if (dmg > 0) {
            defender.sufferDamage(dmg, results)
          }

          attacker.card.doEffect(attacker, defender, results)
          if (defender.card !== undefined && defender.card.name === 'lvlup') {
            results.push({
              'content': 'use-hint',
              'args': {
                'player': defender.name,
                'card': 'lvlup',
                'atk': defender.card.atk,
                'dfs': defender.card.dfs
              }
            })
            defender.card.doEffect(defender, attacker, results)
          }
        }
      }
      results.push({
        'content': 'roundend',
        'args': {}
      })
      this.displayResults(results)
    })
  }
}
</script>

<style>
#app {
  margin-top: 1em;
}

.tac {
  text-align: center;
}

.vam {
  vertical-align: middle;
}
</style>
