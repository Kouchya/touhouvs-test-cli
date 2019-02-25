<template>
  <div id="app">
    <thvs-char v-if="status['char']" :chars="chars"></thvs-char>
  </div>
</template>

<script>
import ThvsChar from './components/thvs-char.vue'

import chars from './data/char.json'

export default {
  name: 'app',
  components: {
    ThvsChar
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
      this.serverInfo.self = chars[char]
      this.serverInfo.oppo = chars[oppo]
    })
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
