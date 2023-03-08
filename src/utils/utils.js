/*
 * @Author: yuanhang 
 * @Date: 2019-10-24 19:15:41 
 * @Last Modified by: yuanhang
 * @Last Modified time: 2020-05-20 17:03:31
 */
// 通用工具类
import React from 'react';
// 引入腾讯全部行政区划数据
import { districtList } from './qq_district_list'
// 年份选择
import YearPicker from '../components/YearPicker/yearPicker'
// 组件
import { Input, InputNumber, Radio, Select, DatePicker } from 'antd'
// 日期国际化配置
import locale from 'antd/es/date-picker/locale/zh_CN'
import moment from 'moment'
import 'moment/locale/zh-cn'
moment.locale('zh-cn');
const { RangePicker } = DatePicker
// 选择器
const { Option } = Select;
const { TextArea } = Input;

// 全局表单key中文文本 
export const rulesText = {
  apply_end_time: {
    label: '报名结束时间',
    key: 'apply_end_time',
  },
  apply_start_time: {
    label: '报名开始时间',
    key: 'apply_start_time',
  },
  // apply_time: {
  //   label: '报名时间',
  //   key: 'apply_time',
  // },
  category: {
    label: '课程类别',
    key: 'category',
  },
  schedule: {
    label: '上课日程',
    key: 'schedule',
  },
  conference: {
    label: '联系方式',
    key: 'conference',
  },
  desc: {
    label: '课程简介',
    key: 'desc',
  },
  hidden: {
    label: '是否隐藏',
    key: 'hidden',
  },
  invoice_content: {
    label: '发票名目',
    key: 'invoice_content',
  },
  members: {
    label: '班级人数',
    key: 'members',
  },
  name: {
    label: '课程名称',
    key: 'name',
  },
  price: {
    label: '报名价格',
    key: 'price',
  },
  hotel_type: {
    label: '住宿信息',
    key: 'hotel_type',
  },
  // recommend_hotel: {
  //   label: '选择酒店',
  //   key: 'recommend_hotel',
  // },
}

// 判断渲染表单组件
export const renderForm = (data) => {
  let type = data.type
  let label = data.label
  let placeholder = data.placeholder
  let min = data.min
  let option = data.option
  let width = data.width
  let valueKey = data.valueKey
  let labelKey = data.labelKey
  let format = data.format
  let showTime = data.showTime
  let mode = data.mode
  let optionFilterProp = data.optionFilterProp
  let disabled = data.disabled
  let initialValue = data.initialValue
  switch (type) {
    case 'input':
      return (<Input style={{ width: width ? width : '200px' }} placeholder={placeholder ? placeholder : label} disabled={disabled ? disabled : false} allowClear />)
    case 'password':
      return (<Input.Password style={{ width: width ? width : '200px' }} placeholder={placeholder ? placeholder : label} disabled={disabled ? disabled : false} />)
    case 'textArea':
      return (<TextArea style={{ width: width ? width : '100%' }} placeholder={placeholder ? placeholder : label} disabled={disabled ? disabled : false} rows={4} />)
    case 'inputNumber':
      return (<InputNumber min={min} style={{ width: width ? width : '200px' }} placeholder={placeholder ? placeholder : label} disabled={disabled ? disabled : false} />)
    case 'radio':
      return (<Radio.Group disabled={disabled ? disabled : false}>
        {option && option.map(item => {
          return (<Radio key={valueKey ? item[valueKey] : item.value} value={valueKey ? item[valueKey] : item.value}>{item.label}</Radio>)
        })}
      </Radio.Group>)
    case 'select':
      return (<Select optionFilterProp={optionFilterProp ? optionFilterProp : null} mode={mode ? mode : null} getPopupContainer={triggerNode => triggerNode.parentNode} style={{ width: width ? width : '200px' }}>
        {option && option.map(item => {
          return (<Option key={valueKey ? item[valueKey] : item.value} value={valueKey ? item[valueKey] : item.value}>
            {labelKey ? item[labelKey] : item.label}
          </Option>)
        })}
      </Select>)
    case 'datePicker':
      return (<DatePicker
        getCalendarContainer={triggerNode => triggerNode.parentNode}
        locale={locale}
        format={format ? format : "YYYY-MM-DD HH:mm:ss"}
        showTime={{
          hideDisabledOptions: (showTime || showTime === false) ? showTime : true,
          defaultValue: moment('00:00:00', 'HH:mm:ss')
        }}
      />)
    case 'datePickerYear':
      return (<YearPicker initialValue={initialValue} />)
    case 'rangePicker':
      return (<RangePicker getCalendarContainer={triggerNode => triggerNode.parentNode} locale={locale} format={format ? format : "YYYY-MM-DD HH:mm:ss"} showTime={{ hideDisabledOptions: (showTime || showTime === false) ? showTime : true, defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')] }} />)
    default:
      break;
  }
}
// 修改DOM  JS
/*
* dom Array js 数据
* key string 表单对应key
* data Object 修改的值 {key：对应key ,val: 对应值} 具体值类型由dom数据决定
*/
export const setDOMJsDate = (dom, key, data) => {
  let _dom = dom.map((item) => {
    if (item.key === key) {
      item[data.key] = data.val
      return item
    }
    return item
  })
  return _dom
}
export const getDOMJsDate = (dom, key) => {
  let _dom = null
  dom.forEach((item) => {
    if (item.key === key) {
      _dom = item
    }
  })
  return _dom
}

// ant 表单组件 getFieldDecorator 用于和表单进行双向绑定的初始化数据设置
export const setInitialValue = (data, FormDOM) => {
  let _FormDOM = FormDOM
  _FormDOM = _FormDOM.map((item, index) => {
    let format = item.format
    format = format ? format : "YYYY-MM-DD HH:mm:ss"
    let _data = data[item.key]
    // 时间日期组件格式化
    if (_data && item.type === 'datePicker') {
      _data = moment(_data, format)
    }
    if (_data && item.type === 'rangePicker') {
      _data = [moment(_data[0], format), moment(_data[1], format)]
    }
    item.initialValue = _data
    return item
  })
  return _FormDOM
}
// 设置空值
export const setEmptyValue = (FormDOM) => {
  let _FormDOM = FormDOM
  _FormDOM = _FormDOM.map((item, index) => {
    if (item.type === 'select') {
      item.initialValue = []
      return item
    }
    item.initialValue = null
    return item
  })
  return _FormDOM
}


// 获取日期差
export const GetDateDiff = (startDate, endDate) => {
  var startTime = new Date(Date.parse(startDate.replace(/-/g, "/"))).getTime();
  var endTime = new Date(Date.parse(endDate.replace(/-/g, "/"))).getTime();
  var dates = Math.abs((startTime - endTime)) / (1000 * 60 * 60 * 24) + 1;
  return dates;
}
//时间加一天
export const addDate = (date, days) => {
  if (days === undefined || days === '') {
    days = 1
  }
  var _date = new Date(date)
  _date.setDate(_date.getDate() + days)
  var month = _date.getMonth() + 1
  var day = _date.getDate()
  return _date.getFullYear() + '-' + getFormatDate(month) + '-' + getFormatDate(day)
}
function getFormatDate(arg) {
  if (arg === undefined || arg === '') {
    return ''
  }
  var re = arg + ''
  if (re.length < 2) {
    re = '0' + re
  }
  return re
}
export const dyaTimes = {
  start_time: null,
  end_time: null,
  need_checkin: true,
  checkin_start: 30,
  checkin_end: 30,
  content: '',
}

// 获取日期间隔内的所有日期
export const getPanelList = (range_start, range_end) => {
  let _dateIndex = GetDateDiff(range_start, range_end)
  if (!_dateIndex) {
    return null
  }
  let panelList = []
  panelList[0] = {
    course_date: range_start,
    day_times: [dyaTimes]
  }
  for (let i = 0; i < _dateIndex; i++) {
    if (i !== 0) {
      panelList[i] = {
        course_date: addDate(panelList[i - 1].course_date),
        day_times: [dyaTimes]
      }
    }
  }
  return panelList
}
// 添加单个
export const getPanel = (date) => {
  let _data = {
    course_date: date,
    day_times: [dyaTimes]
  }
  return _data
}
/*
* 全国地点数据筛选
* id 地区数据id
* index 获取districtList下标的数据
*/
export const getDistrictList = (id, index) => {
  if (!index) index = 1
  // 如是获取2级数据 前2位
  let _startIndex = 2
  // 如是获取3级数据 前3位
  if (index === 2) {
    _startIndex = 4
  }

  if (id.substring(0, 3) === '500') {
    _startIndex = 3
  }

  let _id = id.substring(0, _startIndex);
  let _data = districtList[index]
  let _arr = []
  _data.forEach(item => {
    let _itemId = item.id.substring(0, _startIndex);
    if (_itemId === _id) {
      _arr.push(item)
    }
  })
  return _arr;
}
// 获取地点数据
export const getDistrict = (index) => {
  index = index || 0
  return districtList[index]
}

export const notempty = (array) => {
  var arr = [];
  array.forEach((val, index) => {
    if (val) {
      arr.push(val);
    }
  });
  return arr;
}
let regulation = {
  numberReg: /^[0-9]*$/,
  phoneReg: /^(13[0-9]{9})|(17[0-9]{9})|(19[0-9]{9})|(15[0-9]{9})|(18[0-9]{9})$/,
  idcardReg: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
}
// 验证规则
export const sortRules = (data, type) => {
  let _isSatisfy = true
  switch (type) {
    // 电话
    case 'phoneReg':
      let _numberReg = verifyRules(data, 'numberReg')
      let _phoneReg = verifyRules(data, 'phoneReg')
      let _length = data.length
      // 小于11位时判断是否为数字
      if (_length < 11) {
        return (_isSatisfy = _numberReg)
      } else if (_length === 11) {
        return (_isSatisfy = _phoneReg)
      } else {
        return (_isSatisfy = false)
      }
    default:
      break;
  }
  return _isSatisfy
}
// 验证规则
export const verifyRules = (data, type) => {
  let _reg = regulation[type]
  let _isSatisfy = true
  if (!_reg.test(data)) {
    return (_isSatisfy = false);
  }
  return _isSatisfy
}

// 表单验证
export const formValidation = (data) => {
  // data 不是对象返回null
  if (!(data.constructor === Object)) {
    return null
  }
  let rules = Object.keys(data).map(key => {
    // 0 和 false 也是有值的
    if ((!data[key] && data[key] !== 0 && data[key] !== false) || (data[key] instanceof Array && !(data[key].length > 0))) {
      if (!rulesText[key]) {
        console.log(key + '不在验证范围rulesText内');
      }
      return rulesText[key]
    }
    return null
  })
  rules = notempty(rules)
  return rules
}

// url参数
export const getUrlSearch = (search) => {
  search = search || window.location.search
  if (!search) { return {} }
  var params = {}
  var arr = search.split("?")
  var arr1 = arr[1].split("&")
  for (var i = 0; i < arr1.length; i++) {
    let arr2 = arr1[i].split('=')
    if (!arr2[1]) {
      params[arr2[0]] = 'true'
    } else if (params[arr2[0]]) {
      var arr3 = [params[arr2[0]]]
      arr3.push(arr2[1]); params[arr2[0]] = arr3
    } else {
      params[arr2[0]] = decodeURI(arr2[1])
    }
  }
  return params
}

// url /ID
export const getUrlID = (pathname) => {
  pathname = pathname || window.location.pathname
  let _arr = pathname.split("/")
  let _length = _arr.length - 1
  return _arr[_length]
}

export const formatDate = (date, fmt) => {
  var o = {
    "M+": date.getMonth() + 1,                 //月份 
    "d+": date.getDate(),                    //日 
    "h+": date.getHours(),                   //小时 
    "m+": date.getMinutes(),                 //分 
    "s+": date.getSeconds(),                 //秒 
    "q+": Math.floor((date.getMonth() + 3) / 3), //季度 
    "S": date.getMilliseconds()             //毫秒 
  }
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length))
  }
  for (var k in o) {
    if (new RegExp("(" + k + ")").test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)))
    }
  }
  return fmt
}
// 金额大写
export const getDX = (n) => {
  if (!/^(0|[1-9]\d*)(\.\d+)?$/.test(n))
    return "数据非法";
  var unit = "千百拾亿千百拾万千百拾元角分", str = "";
  n += "00";
  var p = n.indexOf('.');
  if (p >= 0)
    n = n.substring(0, p) + n.substr(p + 1, 2);
  unit = unit.substr(unit.length - n.length);
  for (var i = 0; i < n.length; i++)
    str += '零壹贰叁肆伍陆柒捌玖'.charAt(n.charAt(i)) + unit.charAt(i);
  return str.replace(/零(千|百|拾|角)/g, "零").replace(/(零)+/g, "零").replace(/零(万|亿|元)/g, "$1").replace(/(亿)万|壹(拾)/g, "$1$2").replace(/^元零?|零分/g, "").replace(/元$/g, "元整");
}

// 金额加点
export const numFormat = (num) => {
  var c = (num.toString().indexOf('.') !== -1) ? num.toLocaleString() : num.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')
  return c
}

// 多层级为空判断
export const allIsEmpty = (data) => {
  if (!data && data !== false && data !== 0) { return false }
  // 判断数组
  if (data.constructor === Array) {
    let ending = data.map(item => {
      return allIsEmpty(item)
    })
    let _is = (ending.indexOf(false) > -1) ? false : true
    return _is
  }
  // 判断对象
  if (data.constructor === Object) {
    let ending = Object.keys(data).map(key => {
      return allIsEmpty(data[key])
    })
    let _is = (ending.indexOf(false) > -1) ? false : true
    return _is
  }
  return true
}

// 多层级为空判断
export const setDecimal = (text) => {
  let _length = text.length
  if (_length > 6) {
    text = text.slice(0, 6) + "..."
  }
  return text
}
// 去空
export const dislodgeEmpty = (data) => {
  let val = null
  if (data.constructor === Array) {
    val = []
    if (data.length > 0) {
      val = data.filter(function (el) {
        return el !== null
      })
    }
    return val
  }
  if (data.constructor === Object) {
    Object.keys(data).forEach(key => {
      if (!data[key] && data[key] !== 0 && data[key] !== false) {
        delete data[key]
      }
    })
    return data
  }
  return val
}