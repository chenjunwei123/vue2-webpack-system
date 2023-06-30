import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
// 导入全局样式
import './assets/css/index.css'
// 导入阿里字体图标库
import './assets/fonts/iconfont.css'
// 导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
// 导入axios
import axios from './api/axios.js'
// 导入防抖节流函数
import { antiShake } from './api/antiShake.js'
import { throttle } from './api/throttle.js'
// 导入动态背景插件
import VueParticles from 'vue-particles'
Vue.use(VueParticles)
Vue.use(VueQuillEditor)

// 将axios等效于VUE原型链中的$http
Vue.prototype.$http = axios
// console.log(axios)
Vue.prototype.$antiShake = antiShake
Vue.prototype.$throttle = throttle

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
