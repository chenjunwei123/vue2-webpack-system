import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// import './plugins/element.js'
// 导入全局样式
import './assets/css/index.css'
// 导入阿里字体图标库
import './assets/fonts/iconfont.css'
// 导入axios
import axios from 'axios'
// 导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

// 导入NProgress
import NProgress from 'nprogress'
// import 'nprogress/nprogress.css'

Vue.use(VueQuillEditor)
// 设置axios的默认请求路径
axios.defaults.baseURL = 'https://lianghj.top:8888/api/private/v1/'
// axios请求拦截，需要携带token身份
axios.interceptors.request.use((config) => {
  // 在发送axios请求的request拦截器中展示进度条
  NProgress.start()
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
// 在request拦截器中隐藏进度条
axios.interceptors.response.use((config) => {
  NProgress.done()
  return config
})
// 将axios等效于VUE原型链中的$http
Vue.prototype.$http = axios

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
