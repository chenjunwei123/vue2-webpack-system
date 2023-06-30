import axios from 'axios'
import qs from 'qs'
import { MessageBox } from 'element-ui'
// 导入NProgress
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
// 设置axios的默认请求路径
axios.defaults.baseURL = 'https://lianghj.top:8888/api/private/v1/'
axios.interceptors.request.use(
  config => {
    // 在发送axios请求的request拦截器中展示进度条
    NProgress.start()
    // 这里的config包含每次请求的内容
    const token = window.sessionStorage.getItem('token')
    if (token) {
    // 添加headers
      config.headers.Authorization = token
      config.headers['content-type'] = 'application/x-www-form-urlencoded;charset=UTF-8'
    } else {}
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

axios.interceptors.response.use(
  response => {
    if (response.status === 200 || response.status === 201) {
      NProgress.done()
      return Promise.resolve(response)
    } else {
      return Promise.reject(response)
    }
  },
  error => {
    MessageBox(JSON.stringify(error), '请求异常', {
      confirmButtonText: '确定',
      callback: action => {}
    })
  }
)
export default {
  post (url, data) {
    return new Promise((resolve, reject) => {
      axios({
        method: 'post',
        url,
        data: qs.stringify(data)
      })
        .then(res => {
          resolve(res)
        })
        .catch(err => {
          reject(err)
        })
    })
  },

  get (url, data) {
    return new Promise((resolve, reject) => {
      axios({
        method: 'get',
        url,
        // 后续改写，由于data是一个对象，这里拓展
        ...data
      })
        .then(res => {
          // 后续改写，组件所发请求全部采用收到的数据，而不是res中的meta
          resolve(res)
        })
        .catch(err => {
          reject(err)
        })
    })
  },

  put (url, data) {
    return new Promise((resolve, reject) => {
      axios({
        method: 'put',
        url,
        data: qs.stringify(data)
      })
        .then(res => {
          resolve(res)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  delete (url, data) {
    return new Promise((resolve, reject) => {
      axios({
        method: 'delete',
        url,
        data: qs.stringify(data)
      })
        .then(res => {
          resolve(res)
        })
        .catch(err => {
          reject(err)
        })
    })
  }
}
