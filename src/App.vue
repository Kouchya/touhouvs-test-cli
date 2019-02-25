<template>
  <div id="app">
    <msgbox></msgbox>
    <inputbar :messages="messages"></inputbar>
  </div>
</template>

<script>
import msgbox from './components/msgbox.vue'
import inputbar from './components/inputbar.vue'

export default {
  name: 'app',
  components: {
    msgbox,
    inputbar
  },
  data () {
    return {
      messages: []
    }
  },
  mounted () {
    this.$socket.on('chat message', msg => {
      this.messages.push(msg)
      window.scrollTo(0, document.body.scrollHeight)
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
