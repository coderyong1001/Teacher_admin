import Axios from 'axios';
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

// 设置接口全局配置
let instance = Axios.create({
  baseURL: _url,
  timeout: 30000,
  retry: 1,//重试次数
  shouldRetry: (error) => true,//重试条件，默认只要是错误都需要重试
  headers: {
    'Content-Type': 'application/json'
  },
})

// 添加请求拦截器
instance.interceptors.request.use(config => {
  // let _params = config.params;

  // token
  const token = localStorage.getItem("token")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config;
}, error => {
  //NProgress.done();
  Promise.reject(error);
})

instance.interceptors.response.use(config => {
  // 请求成功
  let response = config.data
  if (response && (response.code === 400)) {
    // alert(`${response.msg ? response.msg : '参数错误'}`)
    return response
  }
  if (response && (response.code === 500)) {
    // alert(`${response.msg ? response.msg : '服务器错误'}`)
    return response
  }
  if (response && (response.code === 401 || response.code === 403)) {
    localStorage.removeItem("token")
    localStorage.removeItem("user_id")
    localStorage.removeItem("user_name")
    alert('登录信息失效，请重新登录')
    window.location.href = '/login'
    return
  }

  if (response) {
    return response
  } else {
    console.log('api 空数据', response);
    return
  }
}, (err) => {
  try{
 // var config = err.config
 let response = err.response.data
 if (response && (response.code === 400)) {
   // alert(`${response.msg ? response.msg : '参数错误'}`)
   return response
 }
 if (response && (response.code === 500)) {
   // alert(`${response.msg ? response.msg : '服务器错误'}`)
   return response
 }
 if (response && (response.code === 401 || response.code === 403)) {
   localStorage.removeItem("token")
   localStorage.removeItem("user_id")
   localStorage.removeItem("user_name")
   alert('登录信息失效，请重新登录')
   window.location.href = '/login'
   return response || err
 }
 console.error('错误信息', response)
 return response || err
  }catch(e){
    return e
  }
 
})

export default instance
