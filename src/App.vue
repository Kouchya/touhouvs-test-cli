<template>
  <div id="app">
    <thvs-char v-if="status.char" :chars="chars"></thvs-char>
    <thvs-battle v-else-if="status.battle" :player="serverInfo.self" :oppo="serverInfo.oppo"></thvs-battle>
  </div>
</template>

<script>
import ThvsChar from './components/thvs-char.vue'
import ThvsBattle from './components/thvs-battle.vue'

import chars from './data/char.json'

export default {
  name: 'app',
  components: {
    ThvsChar,
    ThvsBattle
  },
  data () {
    return {
      chars: chars,
      status: {
        char: true,
        battle: false,
        end: false
      },
      serverInfo: {
        self: undefined,
        oppo: undefined
      }
    }
  },
  methods: {
    changeToStatus (status) {
      for (let key of Object.keys(this.status)) {
        this.status[key] = false
      }
      this.status[status] = true
    }
  },
  mounted () {
    this.$socket.on('char selected', (char, oppo) => {
      this.serverInfo.self = char
      this.serverInfo.oppo = oppo
      this.changeToStatus('battle')
    })

    this.$socket.on('highlight card', (selfcard, oppocard) => {
      if (selfcard !== undefined) {
        this.serverInfo.self.hasused.push(selfcard)
      }
      if (oppocard !== undefined) {
        this.serverInfo.oppo.hasused.push(oppocard)
      }
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
