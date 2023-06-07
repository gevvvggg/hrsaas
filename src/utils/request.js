import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import { getTimeStamp } from '@/utils/auth'
import router from '@/router'
// import { getToken } from '@/utils/auth'
const TimeOut = 3600
// create an axios instance
// 就是promise 示例 用于请求的
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})
function IsCheckTimeOut() {
  var currentTime = Date.now() // 当前时间戳
  var timeStamp = getTimeStamp() // 缓存时间戳
  return (currentTime - timeStamp) / 1000 > TimeOut
}
// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent
    // 这个并没有执行
    if (store.getters.token) {
      if (IsCheckTimeOut()) {
        store.dispatch('user/logout')
        router.push('/login')
        return Promise.reject(new Error('token过期了'))
      }
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers['Authorization'] = `Bearer ${store.getters.token}`
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  // 起码链接到了服务器
  response => {
    const res = response.data
    console.log(res)
    // 通过res.sunccess判断哪没拿到数据
    const { success, message, data } = res
    if (success) {
      return data
    } else {
      Message.error(message)
      return Promise.reject(new Error(message))
    }
    // 本地保存token
    // state.user 模块下的state token 也需要保存token
    // if the custom code is not 20000, it is judged as an error.
  },
  error => {
    if (error.response && error.response.data && error.response.data.code === '10002') {
      store.dispatch('user/logout')
      router.push('/login')
      // return Promise.reject(new Error('token过期了'))
    } else {
      console.log('err' + error) // for debug
      Message({
        message: error.message,
        type: 'error',
        duration: 5 * 1000
      })
    }
    return Promise.reject(error)
  }
)

// 已经是一个promise对象了
export default service
