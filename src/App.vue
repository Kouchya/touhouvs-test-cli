<template>
  <div id="app">
    <thvs-char v-if="status.char" :chars="chars"></thvs-char>
    <thvs-battle v-else-if="status.battle" :player="serverInfo.self" :oppo="serverInfo.oppo" :info="consoleLog"></thvs-battle>
    <thvs-end v-else-if="status.end" :player="serverInfo.self"></thvs-end>
  </div>
</template>

<script>
import ThvsChar from './components/thvs-char.vue'
import ThvsBattle from './components/thvs-battle.vue'
import ThvsEnd from './components/thvs-end.vue'

import charlist from './data/char.json'
import { consumeList } from './util.js'

export default {
  name: 'app',
  components: {
    ThvsChar,
    ThvsBattle,
    ThvsEnd
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
    }
  },
  mounted () {
    this.$socket.on('battle', (plyr, oppo) => {
      this.serverInfo.self = plyr
      this.serverInfo.oppo = oppo
      this.changeToStatus('battle')
    })

    this.$socket.on('op prohibit', () => {
      this.operable = false
    })

    this.$socket.on('result', results => {
      consumeList({
        interval: 1500,
        list: results,
        onItem: result => {
          if (result.content === 'hpchange-result') {
            let player
            if (this.serverInfo.self.name === result.args.player) {
              player = this.serverInfo.self
            } else if (this.serverInfo.oppo.name === result.args.player) {
              player = this.serverInfo.oppo
            }
            player.hp = result.args.num
          } else if (result.content === 'lvlchange-result') {
            let player
            if (this.serverInfo.self.name === result.args.player) {
              player = this.serverInfo.self
            } else if (this.serverInfo.oppo.name === result.args.player) {
              player = this.serverInfo.oppo
            }
            player.lvl = result.args.num
          }

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
            } else if (key === 'cond') {
              args[key] = this.$t(`cond['${args[key]}']`)
            }
          }
          this.consoleLog += this.$t(`result['${result.content}']`, args) + '\n'
        },
        onFinish: () => {
          this.consoleLog += '\n'
          this.$socket.emit('roundend')
        }
      })
    })

    this.$socket.on('gameover', (selfwin, oppowin) => {
      this.serverInfo.self.win = selfwin
      this.serverInfo.oppo.win = oppowin
      this.changeToStatus('end')
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
