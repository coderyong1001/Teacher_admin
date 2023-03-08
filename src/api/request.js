import Axios from 'axios'
import { EventSourcePolyfill } from 'event-source-polyfill'
import { message } from 'antd'
// import qs from 'qs';

// publicPath = '//static.dragonest.com/teacher-training/dev/'
// publicPath = '//static.dragonest.com/teacher-training/qa/'
// publicPath = '//static.dragonest.com/teacher-training/prod/'
let _url = ''
let ws = ''

const REACT_APP_ENV = process.env.REACT_APP_ENV
if (REACT_APP_ENV === 'start' || REACT_APP_ENV === 'dev') {
  _url = 'https://ccc-tt-api-dev.dev-test.mmxlr.com'
  ws = 'wss://ccc-pay-dev.dev-test.dragonest.com/ws'
}
if (REACT_APP_ENV === 'qa') {
  _url = 'https://ccc-tt-api-qa.dev-test.mmxlr.com'
  ws = 'wss://ccc-pay-qa.dev-test.dragonest.com/ws'
}
if (REACT_APP_ENV === 'pre') {
  _url = 'https://ccc-tt-api-pre.dev-test.mmxlr.com'
  ws = 'wss://ccc-pay-pre.dev-test.dragonest.com/ws'
}
if (REACT_APP_ENV === 'prod') {
  _url = 'https://teacher-api.cnccbm.org.cn'
  ws = 'wss://pay.cnccbm.org.cn/ws'
}

export function ENV_URL() {
  return _url
}
export function ENV_WS() {
  return ws
}

const token = localStorage.getItem('token')

// 设置接口全局配置
let request = Axios.create({
  baseURL: _url,
  timeout: 30000,
  // retry: 1, //重试次数
  // shouldRetry: (error) => true, //重试条件，默认只要是错误都需要重试
  headers: {
    'Content-Type': 'application/json',
  },
})

// 添加请求拦截器
request.interceptors.request.use(
  (config) => {
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    Promise.reject(error)
  }
)
//响应拦截器
request.interceptors.response.use(
  (config) => {
    return config
  },
  (err) => {
    try {
      return err
    } catch (e) {
      return e
    }
  }
)

function eventSource() {
  let eventSource = new EventSourcePolyfill(`${_url}/teacher_training/manager/course/certs/`, {
    headers: {
      Authorization: `Bearer ${token}`,
      // 'Content-Type': 'application/json',
    },
  })
  /*
   * open：订阅成功（和后端连接成功）
   */
  eventSource.addEventListener('open', function (e) {
    message.success('正在制作证书。')
  })
  /*
   * message：后端返回信息，格式可以和后端协商
   */
  eventSource.addEventListener('message', function (e) {
    console.log(e.data)
  })
  /*
   * error：错误（可能是断开，可能是后端返回的信息）
   */
  eventSource.addEventListener('error', function (err) {
    message.error('证书制作出错！', err)
    // 类似的返回信息验证，这里是实例
    err && err.status === 401 && console.log('not authorized')
  })
}

export { request, eventSource }
