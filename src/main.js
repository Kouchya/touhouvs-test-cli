import Vue from 'vue'
import App from './App.vue'
import io from 'socket.io-client'

Vue.config.productionTip = false
Vue.prototype.$socket = io('http://localhost:9001')

new Vue({
  el: '#app',
  components: {
    App
  },
  render: h => h(App),
}).$mount('#app')
