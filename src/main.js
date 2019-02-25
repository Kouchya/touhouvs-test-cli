import Vue from 'vue'
import App from './App.vue'
import io from 'socket.io-client'

Vue.config.productionTip = false
Vue.prototype.$socket = io('http://localhost:9001', {
  transports: ['websocket']
})
Vue.prototype.$socket.on('reconnect_attempt', () => {
  Vue.prototype.$socket.io.opts.transports = ['polling', 'websocket']
})

new Vue({
  el: '#app',
  components: {
    App
  },
  render: h => h(App),
}).$mount('#app')
