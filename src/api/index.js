import Axios, { ENV_URL, ENV_WS } from './axios.js'
// token
// const token = localStorage.getItem("token")
// api全局匹配code
export function apiCode() {
  return 200
}
export function apiWS() {
  return ENV_WS()
}
// api全局匹配code
export function API_URL() {
  return ENV_URL()
}
// 发票信息(导入)
export function invoice_info_upload() {
  return '/teacher_training/manager/invoice_info/'
}
// 上传文件
export function file_upload() {
  return '/teacher_training/manager/file_upload/'
}
// 上传证书
export function certificate_upload() {
  return '/teacher_training/manager/course/certs/'
}
//证书制作轮询接口
export function task_result() {
  return '/teacher_training/manager/course/task_result/'
}
// 课程管理(后台报名-批量)
export function multi_commit() {
  return '/teacher_training/manager/signup/multi_commit/'
}

// api 地址
var ApiUrl = {
  post_export_manager: '/teacher_training/manager/export/invoice_info/', // 发票信息（导出）
  post_export_finance: '/teacher_training/manager/export/finance/', // 财务统计(导出)
  post_export_card: '/teacher_training/manager/export/card/', // 导出桌牌
  get_export_checkin: '/teacher_training/manager/export/checkin/', // 签到管理（导出）
  post_export_invoice: '/teacher_training/manager/export/invoice/', // 发票管理（导出）
  get_export_order_list: '/teacher_training/manager/export/order_list/', // 订单管理(导出订单)
  post_export_user_info: '/teacher_training/manager/export/user_info/', // 用户管理(导出)
  post_export_applicant: '/teacher_training/manager/export/applicant/', // 报名详情（导出）
  post_export_booking: '/teacher_training/manager/export/booking/', // 报名详情（以酒店信息查询）_导出
  get_excel_template: '/teacher_training/manager/excel_template/', // 模板下载 signup - 报名模板   invoice - 发票模板
  post_excel_invoice: '/teacher_training/manager/export/invoice/', // 发票信息下载

}

// api method 分流
export function toAPI(url, val, method, responseType) {
  responseType = responseType || ''
  method = method || 'get'
  switch (method) {
    case 'get':
    case 'GET':
      return Axios({
        url: url,
        method: 'get',
        params: val,
        responseType
      })
    case 'post':
    case 'POST':
      return Axios({
        url: url,
        method: 'POST',
        data: val,
        responseType
      })
    case 'put':
    case 'PUT':
      return Axios({
        url: url,
        method: 'PUT',
        data: val,
        responseType
      })
    case 'delete':
    case 'DELETE':
      return Axios({
        url: url,
        method: 'DELETE'
      })
    default:
      return Axios({
        url: url,
        method: 'get',
        params: val,
        responseType
      })
  }
}

// get方法
export function getAPI(apiName, val) {
  return toAPI(ApiUrl[apiName], val, 'get')
}
// POST方法
export function postAPI(apiName, val) {
  return toAPI(ApiUrl[apiName], val, 'POST')
}
// PUT方法
export function putAPI(apiName, val) {
  return toAPI(ApiUrl[apiName], val, 'PUT')
}
// DELETE方法
export function deleteAPI(apiName) {
  return toAPI(ApiUrl[apiName], 'DELETE')
}

// 导出 封装
export function exportAPI(apiName, val, itemName, type, blobType) {
  var method = apiName.substring(0, 3) === 'get' ? 'get' : 'post'
  itemName = itemName || '导出'
  type = type || 'doc' || 'xls'
  blobType = blobType || type === 'doc' ? 'application/msword;charset=utf-8' : 'application/vnd.ms-excel'
  // 记得 responseType: 'blob'
  toAPI(ApiUrl[apiName], val, method, 'blob').then((res) => {
    // 为空退出
    if (!res) return
    let blob = new Blob([res], { type: blobType })
    if (window.navigator.msSaveOrOpenBlob) {
      //兼容ie
      window.navigator.msSaveBlob(blob, itemName + '.' + type)
    } else {
      const link = document.createElement('a')
      link.style.display = 'none'
      link.href = URL.createObjectURL(blob)
      link.setAttribute('download', itemName + '.' + type)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  })
}

// 导出桌牌（名字列表）
export function getApplicantNames(params) {
  return Axios({
    url: '/teacher_training/manager/applicant/names/',
    method: 'get',
    params
  })
}


// 登录
export function Login(data) {
  return Axios({
    url: '/teacher_training/manager/login/',
    method: 'post',
    data
  })
}

//  财务统计
export function getFinance(params) {
  return Axios({
    url: '/teacher_training/manager/finance/statistics/',
    method: 'get',
    params
  })
}

//  财务统计(课程)
export function getFinanceCourses(params) {
  return Axios({
    url: '/teacher_training/manager/finance/courses/',
    method: 'get',
    params
  })
}

// 财务统计(汇总数据)
export function postFinanceSumInfo(data) {
  return Axios({
    url: '/teacher_training/manager/finance/sum_info/',
    method: 'post',
    data
  })
}

// 财务统计（生成报表）
export function postFinanceCharts(data) {
  return Axios({
    url: '/teacher_training/manager/finance/charts/',
    method: 'post',
    data
  })
}

//  问卷上传
export function uploadQuestionnaire(data, id) {
  return Axios({
    url: '/teacher_training/manager/course/' + id + '/upload_questionnaire/',
    method: 'PUT',
    data
  })
}

//  问卷链接获取
export function getQuestionnaireID(id) {
  return Axios({
    url: '/teacher_training/manager/course/' + id + '/questionnaire/',
    method: 'get',
  })
}


//  课程管理（查看）
export function getCourseID(id) {
  return Axios({
    url: '/teacher_training/manager/course/' + id + '/',
    method: 'get',
  })
}
//  课程基本信息(修改)
export function putCourseID(data, id) {
  return Axios({
    url: '/teacher_training/manager/course/' + id + '/',
    method: 'PUT',
    data
  })
}

//  课程(显示隐藏)
export function putCourseHide(data, id) {
  return Axios({
    url: '/teacher_training/manager/course/' + id + '/hide/',
    method: 'PUT',
    data
  })
}

//  课程管理（酒店管理）
export function putRecommendHotel(data, id) {
  return Axios({
    url: '/teacher_training/manager/course/' + id + '/recommend_hotel/',
    method: 'PUT',
    data
  })
}

//  课程管理（课程列表）
export function getCourse(params) {
  return Axios({
    url: '/teacher_training/manager/course/',
    method: 'get',
    params
  })
}
//  课程管理（后台创建）
export function postCourse(data) {
  return Axios({
    url: '/teacher_training/manager/course/',
    method: 'POST',
    data
  })
}
// 酒店管理(列表)
export function getHotel(params) {
  return Axios({
    url: '/teacher_training/manager/hotel/',
    method: 'get',
    params
  })
}

// 酒店管理（修改）
export function putHotel(data, id) {
  return Axios({
    url: '/teacher_training/manager/hotel/' + id + '/',
    method: 'PUT',
    data
  })
}

// 酒店管理（删除）
export function deleteHotel(id) {
  return Axios({
    url: '/teacher_training/manager/hotel/' + id + '/',
    method: 'DELETE',
  })
}

// 酒店管理(新增酒店)
export function postHotel(data, id) {
  return Axios({
    url: '/teacher_training/manager/hotel/',
    method: 'POST',
    data
  })
}

// 导航地址（列表）
export function getCoursePlace(params) {
  return Axios({
    url: '/teacher_training/manager/course_place/',
    method: 'get',
    params
  })
}

// 导航地址(新建)
export function postCoursePlace(data) {
  return Axios({
    url: '/teacher_training/manager/course_place/',
    method: 'POST',
    data
  })
}

// 导航地址（修改）
export function putCoursePlace(data, id) {
  return Axios({
    url: '/teacher_training/manager/course_place/' + id + '/',
    method: 'PUT',
    data
  })
}
// 导航地址（删除）
export function deleteCoursePlace(id) {
  return Axios({
    url: '/teacher_training/manager/course_place/' + id + '/',
    method: 'DELETE',
  })
}

// 上课地点(新建)
export function postLocation(data) {
  return Axios({
    url: '/teacher_training/manager/course_place/',
    method: 'POST',
    data
  })
}
// 上课地点（修改）
export function putLocation(data, id) {
  return Axios({
    url: '/teacher_training/manager/course_place/' + id + '/',
    method: 'PUT',
    data
  })
}
// 上课地点（列表）
export function getLocation(params) {
  return Axios({
    url: '/teacher_training/manager/course_place/',
    method: 'get',
    params
  })
}

// 上课地址（删除）
export function deleteLocation(id) {
  return Axios({
    url: '/teacher_training/manager/course_place/' + id + '/',
    method: 'DELETE',
  })
}

// 课程管理(后台报名-单个)
export function postSingleCommit(params) {
  let data = params
  return Axios({
    url: '/teacher_training/manager/signup/single_commit/',
    method: 'POST',
    data
  })
}

// 课程管理(提交订单)
export function postOrder(params) {
  let data = params
  return Axios({
    url: '/teacher_training/manager/order/',
    method: 'POST',
    data
  })
}

// 课程管理(提交订单)
export function postPay(data) {
  return Axios({
    url: '/teacher_training/manager/order/pay/',
    method: 'POST',
    data
  })
}

// 证书管理
export function putUploadCertificate(data, id) {
  return Axios({
    url: '/teacher_training/manager/course/' + id + '/upload_certificate/',
    method: 'PUT',
    data
  })
}

// 签到管理(获取签到次数)
export function getSchedules(params) {
  return Axios({
    url: '/teacher_training/manager/checkin/schedules/',
    method: 'GET',
    params
  })
}

// 签到管理(签到人员列表)
export function getCheckin(params) {
  return Axios({
    url: '/teacher_training/manager/checkin/',
    method: 'GET',
    params
  })
}

// 签到管理（签到）
export function postCheck(data) {
  return Axios({
    url: '/teacher_training/manager/checkin/check/',
    method: 'POST',
    data
  })
}

// 签到管理（签到）
export function postCheckAll(data) {
  return Axios({
    url: '/teacher_training/manager/checkin/check_all/',
    method: 'POST',
    data
  })
}

// 报名详情（订单列表）
export function getOrderList(params) {
  return Axios({
    url: '/teacher_training/manager/order_list/',
    method: 'GET',
    params
  })
}

// 报名详情（统计信息）
export function getOStatistics(params) {
  return Axios({
    url: '/teacher_training/manager/order_list/statistics/',
    method: 'GET',
    params
  })
}

// 报名详情（以酒店信息查询 - 获取日期、酒店名称）
export function getBookingInfo(params) {
  return Axios({
    url: '/teacher_training/manager/booking/info/',
    method: 'GET',
    params
  })
}

// 报名详情（以酒店信息查询）
export function postBookingHotels(data) {
  return Axios({
    url: '/teacher_training/manager/booking/hotels/',
    method: 'POST',
    data
  })
}

// 报名详情（以酒店信息查询）
export function getBookingHotels(params) {
  return Axios({
    url: '/teacher_training/manager/booking/',
    method: 'GET',
    params
  })
}


// 订单审核（报名审核）
export function postSignupReview(data) {
  return Axios({
    url: '/teacher_training/manager/order_list/signup_review/',
    method: 'POST',
    data
  })
}

// 订单管理(修改价格)
export function postModifyAmount(data) {
  return Axios({
    url: '/teacher_training/manager/order_list/modify_amount/',
    method: 'POST',
    data
  })
}

// 订单管理（退款）
export function postRefund(data) {
  return Axios({
    url: '/teacher_training/manager/order_list/refund/',
    method: 'POST',
    data
  })
}

// 订单管理（批量审核订单）
export function getOrderListMulti(params) {
  return Axios({
    url: '/teacher_training/manager/order_list/multi/',
    method: 'GET',
    params
  })
}
// 订单管理（批量审核)
export function postMultiReview(data) {
  return Axios({
    url: '/teacher_training/manager/order_list/multi_review/',
    method: 'POST',
    data
  })
}
// 订单管理(修改支付人信息)
export function postOrderListPayUser(data) {
  return Axios({
    url: '/teacher_training/manager/order_list/pay_user/',
    method: 'POST',
    data
  })
}

// 报名详情（人员列表）
export function getApplicant(params) {
  return Axios({
    url: '/teacher_training/manager/applicant/',
    method: 'GET',
    params
  })
}

// 报名详情（人员修改）
export function postApplicant(data, id) {
  return Axios({
    url: '/teacher_training/manager/applicant/' + id + '/',
    method: 'PUT',
    data
  })
}

// 发票管理（发票列表）
export function getInvoice(params) {
  return Axios({
    url: '/teacher_training/manager/invoice/',
    method: 'GET',
    params
  })
}

// 发票管理(发票详情)
export function getInvoiceID(params, id) {
  return Axios({
    url: '/teacher_training/manager/invoice/' + id + '/',
    method: 'GET',
    params
  })
}

// 发票管理(发票审核)
export function putReview(data) {
  return Axios({
    url: '/teacher_training/manager/invoice/review/',
    method: 'PUT',
    data
  })
}

// 发票管理（新建发票）
export function postInvoice(data) {
  return Axios({
    url: '/teacher_training/manager/invoice/',
    method: 'POST',
    data
  })
}

// 发票管理（订单列表）
export function getInvoiceOrders(params) {
  return Axios({
    url: '/teacher_training/manager/invoice/orders/',
    method: 'GET',
    params
  })
}

// 用户管理
export function getUser(params) {
  return Axios({
    url: '/teacher_training/manager/user/',
    method: 'GET',
    params
  })
}

// 用户管理（查看单个信息）
export function getUserID(id) {
  return Axios({
    url: '/teacher_training/manager/user/' + id + '/',
    method: 'GET',
  })
}

// 用户管理（编辑）
export function putUser(data, id) {
  return Axios({
    url: '/teacher_training/manager/user/' + id + '/',
    method: 'PUT',
    data
  })
}

// 用户管理
export function getManagerData(params) {
  return Axios({
    url: '/teacher_training/manager/data/',
    method: 'GET',
    params
  })
}

// 支付结果查询
export function getOrderResult(params) {
  return Axios({
    url: '/teacher_training/manager/order/result/',
    method: 'GET',
    params
  })
}

// 发票信息（列表）
export function getInvoiceInfo(params) {
  return Axios({
    url: '/teacher_training/manager/invoice_info/',
    method: 'GET',
    params
  })
}

// 发票信息（列表）
export function getInvoiceInfoID(id) {
  return Axios({
    url: '/teacher_training/manager/invoice_info/' + id + '/',
    method: 'GET',
  })
}

// 发票信息(修改)
export function putInvoiceInfoID(data, id) {
  return Axios({
    url: '/teacher_training/manager/invoice_info/' + id + '/',
    method: 'PUT',
    data
  })
}

// 发票信息(删除)
export function deleteInvoiceInfoID(id) {
  return Axios({
    url: '/teacher_training/manager/invoice_info/' + id + '/',
    method: 'DELETE',
  })
}

// 修改密码
export function postPassword(data) {
  return Axios({
    url: '/teacher_training/manager/password/',
    method: 'POST',
    data
  })
}

// 联系人管理(列表)
export function getLiaison() {
  return Axios({
    url: '/teacher_training/manager/conference/',
    method: 'GET',
  })
}

// 联系人管理(详情)
export function getLiaisonId(id) {
  return Axios({
    url: '/teacher_training/manager/conference/' + id + '/',
    method: 'GET',
  })
}

// 联系人管理(新建)
export function postLiaison(data) {
  return Axios({
    url: '/teacher_training/manager/conference/',
    method: 'POST',
    data
  })
}

// 联系人管理(修改)
export function putLiaison(data, id) {
  return Axios({
    url: '/teacher_training/manager/conference/' + id + '/',
    method: 'PUT',
    data
  })
}

// 联系人管理(删除)
export function deleteLiaison(id) {
  return Axios({
    url: '/teacher_training/manager/conference/' + id + '/',
    method: 'DELETE',
  })
}

function getArguments(data) {
  let url, val, method, responseType
  method = method || 'get'
  responseType = responseType || ''
  if (data.length > 0) {
    url = data[0]
  }
  if (data.length >= 2) {
    switch (data[1]) {
      case 'get':
      case 'GET':
      case 'post':
      case 'POST':
      case 'put':
      case 'PUT':
      case 'delete':
      case 'DELETE':
        method = data[1]
        break;
      default:
        val = data[1]
    }
  }
  if (data.length >= 3) {
    method = data[2]
  }
  if (data.length >= 4) {
    responseType = data[3]
  }
  return { url, val, method, responseType }
}

//  异步
export function apiPromise() {
  let data = [...arguments]
  let { url, val, method, responseType } = getArguments(data)
  return new Promise((resolve) => {
    toAPI(url, val, method, responseType)
      .then(res => {
        // 为空退出
        if (!res) resolve(null)
        const code = res.code
        const data = res.data
        if (code === apiCode()) {
          // Vue.prototype.$message.success(res.msg)
          resolve(data)
        } else {
          const _msg = res.msg || '服务器错误'
          console.error(`${_msg}`);
          resolve(null)
        }
      })
      .catch(error => {
        resolve(null)
        console.error(`网络异常：apiName:${url},api:${url}请求失败；${error}`);
      })
  })
}