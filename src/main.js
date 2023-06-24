import 'buefy/dist/buefy.css'

import App from './App.vue'
import Buefy from 'buefy'
import Vue from 'vue'
import router from './router'
import { setupDb } from './utils/db_utils'

Vue.config.productionTip = false
Vue.use(Buefy)
setupDb()

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
