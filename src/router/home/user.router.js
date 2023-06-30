export default {
  path: '/users',
  component: () => import('../../components/user/User')
}
// 设置axios的默认请求路径
// axios.defaults.baseURL = 'https://lianghj.top:8888/api/private/v1/'
// // axios请求拦截，需要携带token身份
// axios.interceptors.request.use((config) => {
//   // 在发送axios请求的request拦截器中展示进度条
//   NProgress.start()
//   config.headers.Authorization = window.sessionStorage.getItem('token')
//   return config
// })
// // 在request拦截器中隐藏进度条
// axios.interceptors.response.use((config) => {
//   NProgress.done()
//   return config
// })
// 将axios等效于VUE原型链中的$http
