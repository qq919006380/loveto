import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ViewUI from 'view-design';
import axios from 'axios';
import 'view-design/dist/styles/iview.css';
Vue.use(ViewUI);
Vue.prototype.$axios = axios
Vue.prototype.$EventBus = new Vue()

if (process.env.NODE_ENV === "development") {
  var url = "http://localhost:8080";
} else if (process.env.NODE_ENV === "production") {
  var url = "http://47.244.164.231:8080";
}
Vue.prototype.GLOBAL_URL = url
 
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
