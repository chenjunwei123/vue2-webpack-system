import Vue from 'vue'
import VueRouter from 'vue-router'

// 实现路由的懒加载----组件懒加载也可以通过这种方法实现
const Login = () => import('../components/Login')
const Home = () => import('../components/Home')
// const Welcome = () => import('../components/Welcome')
// const User = () => import('../components/user/User')
// const Rights = () => import('../components/power/Rights')
// const Roles = () => import('../components/power/Roles')
// const Cate = () => import('../components/goods/Cate')
// const Params = () => import('../components/goods/Params')
// const GoodsList = () => import('../components/goods/List')
// const Add = () => import('../components/goods/Add')
// const Orders = () => import('../components/Orders/orders')
// const Reports = () => import('../components/report/report')

Vue.use(VueRouter)

// 分布式动态路由
// 这里定义home组件下的子路由
const routeList = []
function importAll (r) {
  r.keys().forEach((key) => routeList.push(r(key).default))
}
importAll(require.context('./', true, /\.router\.js/))

console.log(routeList)
const routes = [
  {
    path: '/', name: 'login', redirect: '/login'
  },
  {
    path: '/login', component: Login
  },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [
      ...routeList
      // {
      //   path: '/welcome', component: Welcome
      // },
      // {
      //   path: '/users', component: User
      // },
      // {
      //   path: '/rights', component: Rights
      // },
      // {
      //   path: '/roles', component: Roles
      // },
      // {
      //   path: '/categories', component: Cate
      // },
      // {
      //   path: '/params', component: Params
      // },
      // {
      //   path: '/goods', component: GoodsList
      // },
      // { path: '/goods/add', component: Add },
      // { path: '/orders', component: Orders },
      // { path: '/reports', component: Reports }
    ]
  }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, _, next) => {
  // to表示将要访问的路径
  // from 表示从哪个路径跳转而来
  // next是一个函数表示放行
  // next()  next('/login')强制跳转
  if (to.path === '/login') return next()

  const tokenstr = window.sessionStorage.getItem('token')
  // 可以校验token合法性,这里只查询token是否存在
  if (!tokenstr) return next('/login')
  next()
})

export default router
