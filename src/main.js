import Vue from 'vue'
import VueI18n from 'vue-i18n'
import App from './App.vue'
import io from 'socket.io-client'
import 'bootstrap/dist/css/bootstrap.css'
import langSet from './locale.generated.json'

Vue.use(VueI18n)
Vue.config.productionTip = false
Vue.prototype.$socket = io('http://localhost:9001', {
  transports: ['websocket']
})
Vue.prototype.$socket.on('reconnect_attempt', () => {
  Vue.prototype.$socket.io.opts.transports = ['polling', 'websocket']
})

const i18n = new VueI18n({
  locale: 'zh_cn',
  messages: langSet
})

new Vue({
  i18n,
  el: '#app',
  components: {
    App
  },
  render: h => h(App),
}).$mount('#app')
