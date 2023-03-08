/*
 * @Author: yuanhang 
 * @Date: 2019-11-21 14:39:57 
 * @Last Modified by: yuanhang
 * @Last Modified time: 2020-06-03 17:42:49
 */
// 报名
import axios from 'axios'
import React, { Component } from 'react'
import io from 'socket.io-client'
// 单个报名表单
import SignupForm from './signupForm/signupForm'
// 单个报名表单
import HotelForm from './HotelForm/hotelForm'
// 单个报名表单
import MyDrawer from '../../../components/myDrawer/myDrawer'
// 工具类
import { formatDate, allIsEmpty } from '../../../utils/utils'
// api
import { apiCode, apiWS, exportAPI, API_URL, multi_commit, postSingleCommit, postOrder, postPay, getOrderResult, } from '../../../api/index'
// 组件
import { Modal, message, Button, Collapse, Select, InputNumber, Radio, Upload, Input, Switch } from 'antd'
const { Option } = Select
// 折叠面板
const { Panel } = Collapse
const { confirm } = Modal

const ws = apiWS()

let timerOrder = null

function beforeUpload(file) {
  // const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  // if (!isJpgOrPng) {
  //   message.error('限制格式 JPG/PNG');
  // }
  const isLt500M = file.size / 1024 / 1024 < 500;
  if (!isLt500M) {
    message.error('超出500M')
  }
  // return isJpgOrPng && isLt500M;
  return isLt500M;
}

class SignUp extends Component {
  state = {
    loading: false,
    defineLoading: false,
    course_id: null,
    fileList: [],
    // showModal: true,
    showModal: false,
    result_code: null,
    qr_code_base64: null,

    visibleMyDrawer: false,
    dataList: null,

    discount: 1,  // 折扣
    real_price: null,  // 实际单价
    real_amount: null,  // 实际支付
    payment_method: 1, // 0 - 微信支付 1 - 线下支付 2 - 其他
    custom_amount: 0, // 临时自定义价格

    CollapseKey: ['1'],
    order_id: null,
    hotelSwitch: false,
    accommodation: {},
    ButtonSeconds: 0,
  };
  static defaultProps = {
    onDrawerClose: () => {
      console.log('父级未挂载onDrawerClose');
    }
  }
  componentDidMount() {
    const { courseId } = this.props
    this.setState({ course_id: courseId })
  }
  UNSAFE_componentWillReceiveProps(nextProps) {
    const { courseId } = nextProps
    this.setState({ course_id: courseId })
  }
  componentWillUnmount() {
    this.setState({ qr_code_base64: null, ButtonSeconds: 0, order_id: null })
    if (window.socket) {
      window.socket.close()
      window.socket = null
    }
  }

  callback = (key) => {
    this.setState({ CollapseKey: key })
  }
  // 得到子组件
  onSignupRef = (ref) => {
    this.childSignup = ref
  }
  // 下载模版
  download = () => {
    exportAPI('get_excel_template', { name: 'signup' }, '批量报名模板', 'xls')
  }
  // 提交接口
  toSingleCommit = (_data) => {
    postSingleCommit(_data).then((res) => {
      // 为空退出
      if (!res) return
      if (res.code === apiCode()) {
        // loading
        this.setState({ loading: false })
        this.setState({ dataList: res.data }, () => { this.setState({ visibleMyDrawer: true, real_amount: this.formatFloating(this.state.dataList.amount), real_price: this.formatFloating(this.state.dataList.price), custom_amount: this.state.dataList.price }) })
      } else {
        // loading
        this.setState({ loading: false })
        let _msg = res.msg || '服务器错误'
        message.info('错误：' + _msg)
      }
    })
  }
  // 确定提交
  showConfirm = (_data) => {
    let vm = this
    confirm({
      title: '确定提交?',
      content: '您尚未填写酒店预订信息，是否确定无需住宿？',
      onOk() {
        vm.toSingleCommit(_data)
      },
      onCancel() {
        // loading
        vm.setState({ loading: false })
      },
    });
  }
  // 单个提交
  toSingle = () => {
    let _data = this.childSignup.toSuccess()
    if (!_data) { return }
    // loading
    this.setState({ loading: true })
    _data.course_id = this.state.course_id
    _data.birth = _data.birth ? parseFloat(formatDate(new Date(_data.birth), "yyyy")) : ''
    _data.work_exp = _data.work_exp ? parseFloat(formatDate(new Date(_data.work_exp), "yyyy")) : ''

    for (var key in _data) {
      if (_data[key] === null || !_data[key]) {
        delete _data[key]
      }
    }
    // 判断是否有酒店信息数据
    if (this.state.hotelSwitch && JSON.stringify(this.state.accommodation) === '{}') {
      message.info('您添加了酒店信息，但未提交保存，请先保存酒店信息')
      this.setState({ loading: false })
      return
    }
    // 判断是否有设置预定酒店且未填写信息
    if (this.props.hotel_type === 3 && (!this.state.hotelSwitch || JSON.stringify(this.state.accommodation) === '{}')) {
      this.showConfirm(_data)
      return
    }
    this.toSingleCommit(_data)
  }
  // 课程管理(后台报名-批量)
  onUploadChange = ({ file, fileList }) => {
    // 只取最后一个值
    fileList = fileList.slice(-1)
    if (file.status !== 'done' && file.status !== 'removed' && file.status !== 'error') {
      this.setState({ fileList })
      return
    }
    // 上传成功和删除时触发
    if (file.status === 'done' || file.status === 'removed') {
      if (!fileList || fileList.length === 0) {
        this.setState({ fileList: [] })
        return
      }
      let item = fileList[0]
      let res = item.response
      // loading
      this.setState({ loading: true })

      if (!res) {
        this.setState({ fileList: [] })
        return
      }
      if (res.code === apiCode()) {
        message.info('上传成功')
        // loading
        this.setState({ loading: false })
        this.setState({ dataList: res.data }, () => { this.setState({ visibleMyDrawer: true, real_amount: this.formatFloating(this.state.dataList.amount), real_price: this.formatFloating(this.state.dataList.price), custom_amount: this.state.dataList.price }) })
      } else {
        let _msg = res.msg || '服务器错误'
        message.info('错误：' + _msg)
        // loading
        this.setState({ loading: false })
        this.setState({ fileList: [] })
      }
    }
    if (file.status === 'error') {
      let item = fileList[0]
      let res = item.response
      let _msg = res.msg || '服务器错误'
      message.info('错误：' + _msg)
      // loading
      this.setState({ loading: false })
      this.setState({ fileList: [] })
    }
  }
  toClose = () => {
    this.setState({ qr_code_base64: null })
    this.setState({ order_id: null })
  }
  // 关闭抽屉
  onDrawerClose = () => {
    this.noOrderResult()
    this.setState({ discount: 1, custom_amount: 0, visibleMyDrawer: false })
    this.toClose()
  }
  // 格式化
  formatFloating = (floating) => {
    if (!floating) { return 0 }
    return parseFloat((floating).toFixed(2))
  }
  // 折扣选择
  selectChange = (value) => {
    // 单价
    let _price = this.formatFloating(this.state.dataList.price * value)
    // 总价
    let _amount = this.formatFloating(this.state.dataList.applicant_num * _price)

    this.setState({ custom_amount: this.state.dataList.price, discount: value, real_amount: _amount, real_price: _price })
  }
  // 自定义价格
  numberChange = (value) => {
    if (value > this.state.dataList.price) { value = this.state.dataList.price }
    // 单价
    let _price = null
    if (!(typeof value === 'string')) {
      value = this.formatFloating(value)
      _price = value
    }
    if (value === 0) {
      this.setState({ discount: 0 })
    }
    // 总价
    let _amount = this.formatFloating(this.state.dataList.applicant_num * _price)
    this.setState({ custom_amount: value })
    this.setState({ real_amount: _amount, real_price: _price })
  }
  // 自定义价格
  methodChange = (e) => {
    this.setState({ payment_method: e.target.value })
  }
  // 取消状态判断
  noOrderResult = () => {
    clearTimeout(timerOrder)
    timerOrder = null
  }
  // 支付状态判断
  toOrderResult = () => {
    const { order_id } = this.state
    this.setState({ defineLoading: true })
    getOrderResult({ order_id }).then((res) => {
      if (res.code === 400 || res.code === 20034 || res.code === 23333) {
        message.info('支付未成功')
      }
      if (res.code === 24444) {
        message.success('成功')
        this.toInvoice()
        this.props.onDrawerClose()
      }
      this.setState({ defineLoading: false })
    })
  }
  toInvoice = () => {
    this.setState({ ButtonSeconds: 0 })
    this.noOrderResult()
    let vm = this
    confirm({
      title: '开发票提示',
      content: '报名完成，立即去开发票吗？',
      onOk() {
        vm.props.history.push({ pathname: `/course/edit/${vm.props.courseId}?key=5`, query: { key: '5' } });
      },
      onCancel() {
        vm.hideImg()
        vm.setState({ visibleMyDrawer: false })
        // vm.props.onDrawerClose()
      },
    });
  }
  // 模块名称
  setPpayUser = (e) => {
    let _data = e.target.value
    this.setState({ pay_user: _data })
  }
  inputOnBlur = (e) => {
    let _data = e.target.value
    // 去首尾空格
    if (typeof (_data) == 'string' && _data) {
      _data = _data.replace(/(^\s*)|(\s*$)/g, "")
    }
    this.setState({ pay_user: _data })
  }
  // 提交订单 
  toOrderSingle = () => {
    // loading
    const { course_id, dataList, discount, real_price, real_amount, payment_method, pay_user, hotelSwitch, accommodation } = this.state
    let _data = {
      course_id,
      applicant_info: dataList.applicant_info,
      amount: dataList.amount,
      discount,
      real_amount,
      payment_method,
      pay_user: pay_user,
      price: real_price,
    }
    _data.real_amount = parseFloat(_data.real_amount)
    if (!pay_user && _data.real_amount !== 0) {
      // return message.error('支付人必填')
    }
    if (_data.real_amount === 0) {
      delete (_data.pay_user)
    }
    if (hotelSwitch) {
      if (!allIsEmpty(accommodation.hotel_info)) {
        return message.warning('当前酒店信息不能有空值')
      }
      _data.accommodation = accommodation
    }
    this.setState({ loading: true })
    postOrder(_data).then((res) => {
      // 为空退出
      if (!res) return
      if (res.code === apiCode()) {
        this.setState({ order_id: res.data.order_id }, () => {
          if (_data.payment_method === 0) { this.onPay() }
          this.setState({ loading: false })
        })
        if (this.state.payment_method !== 0) {
          // message.success('成功')
          // this.setState({ visibleMyDrawer: false })
          this.toInvoice()
          // loading
          this.setState({ loading: false })
          return
        }
      } else {
        // loading
        this.setState({ loading: false })
        let _msg = res.msg || '服务器错误'
        message.info('错误：' + _msg)
      }
    })
  }
  // 倒计时
  toSeconds = (seconds) => {
    let vm = this
    this.setState({ ButtonSeconds: seconds })
    if (seconds > 1) {
      seconds--
      this.setState({})
      timerOrder = setTimeout(function () {
        vm.toSeconds(seconds)
      }, 1000);
    } else {
      // 读秒归0 清空二维码
      this.setState({ ButtonSeconds: 0, qr_code_base64: null, loading: false })
    }
  }
  // 去支付
  onPay = () => {
    this.setState({ loading: true, qr_code_base64: null })
    // return
    let _data = {}
    _data.order_id = this.state.order_id
    _data.pay_type = 'UnionPay_Third_QrCode'
    _data.return_url = window.location.href
    postPay(_data).then((res) => {
      // 为空退出
      if (!res) return
      if (res.code === apiCode()) {
        // 倒计时
        this.toSeconds(60)

        let _data = res.data
        this.setState({ showModal: true, qr_code_base64: _data.qr_code_base64 })
        // this.toOrderResult()
        if (!window.socket) {
          window.socket = io(ws, { transports: ["websocket"] })
        }
        window.socket.emit('ping-status', `{"token":"${_data.token}"}`);
        window.socket.on('event', data => {
          var dataObj = JSON.parse(data);
          let result_code = dataObj.result_code
          // console.log('dataObj', dataObj, ' result_code', result_code);
          this.setState({ result_code })
        });
        this.setState({ loading: false })
      } else {
        let _msg = res.msg || '服务器错误'
        message.info('错误：' + _msg)
        this.setState({ loading: false })
      }
    })
  }
  // 关闭付款码
  hideImg = () => {
    // this.noOrderResult()
    this.setState({ showModal: false })
    // loading
    this.setState({ loading: false })
    console.log('window.socket', window.socket)
    if (window.socket) {
      window.socket.close()
      window.socket = null
    }
  }
  // 是否显示酒店
  onSwitch = (checked) => {
    this.setState({ hotelSwitch: checked })
  }
  //  酒店
  onChangeHotelForm = (data) => {
    this.setState({ accommodation: data, CollapseKey: ['2'] })
  }
  customRequest = (data) => {
    const param = new FormData()
    param.append(data.filename, data.file)
    param.append('course_id', data.data.course_id)
    axios({
      method:'post',
      url:data.action,
      responseType:'text',
      headers: {
        ...data.headers,
        'Content-Type': 'multipart/form-data'
      },
      data: param
    }).then(res => {
      // 长整型溢出用字符串处理
      const { responseText } = res.request
      if (res.data.code === 200 && responseText) {
        const regex = /"ID_number":(.+?),/g;
        const arr = responseText.match(regex).map(item => item.match(/"ID_number":(.+?),/)[1]);
        const resData = res.data.data
        resData.applicant_info.forEach((item, index) => {
          item.ID_number = arr[index]
        });
        data.onSuccess({ code: 200, data: resData }, data.file)
      } else {
        data.onSuccess(res)
      }
    }).catch(e => {
      if (e.response.data && e.response.data.data) {
        data.onSuccess(e.response.data)
      }
    })
  }
  render() {
    let { loading, course_id, fileList, discount, real_price, real_amount, payment_method, custom_amount, visibleMyDrawer, dataList, showModal, qr_code_base64, pay_user, hotelSwitch, CollapseKey, order_id, ButtonSeconds, result_code, defineLoading } = this.state
    if (real_amount === 0 && payment_method === 0) {
      payment_method = 1
    }

    return (
      <div className='SignUp'>
        <Collapse activeKey={CollapseKey} onChange={this.callback}>
          {/* <Collapse defaultActiveKey={['1', '2', '3']} onChange={this.callback}> */}
          {this.props.hotel_type === 3 && <Panel header="酒店信息" key="1">
            <div className="ant-advanced-search-form">
              <span className='label'>是否添加酒店：</span>
              <Switch disabled={this.props.hotel_type !== 3} onChange={this.onSwitch} checked={hotelSwitch} />
              <br />
              {hotelSwitch && <HotelForm course_id={course_id} onChange={this.onChangeHotelForm} />}
            </div>
          </Panel>}
          <Panel header="单个报名" key="2">
            {/* 单个报名表单 */}
            <SignupForm onRef={this.onSignupRef} />
            <br />
            <div className='txc'>
              <Button loading={loading} type="primary" onClick={this.toSingle}>提交</Button>
            </div>
            <br />
          </Panel>
          <Panel header="批量报名" key="3">
            <br />
            <p style={{ width: '60%', margin: '0 auto' }}>注意：批量报名只需按照Excel表格模板填写对应报名人员信息，然后上传对应的文件即可完成</p>
            <br />
            <Button onClick={this.download} icon="download">下载模版</Button>
            <br />
            <br />
            <Upload
              name="excel"
              data={{ course_id: course_id }}
              headers={{
                Authorization: `Bearer ${localStorage.getItem("token")}`
              }}
              customRequest={this.customRequest}
              fileList={fileList}
              action={API_URL() + multi_commit()}
              onChange={this.onUploadChange}
              beforeUpload={beforeUpload}>
              <Button icon="upload">上传</Button>
            </Upload>

          </Panel>
        </Collapse>

        {/* 订单确认 */}
        <MyDrawer onDrawerClose={this.onDrawerClose} titleText='确定订单' drawerWidt={500} visible={visibleMyDrawer}>
          {dataList && <div>课程名称：{dataList.course_name}</div>}
          <br />
          {dataList && <div>报名人数：{dataList.applicant_num}</div>}
          <br />
          {dataList && <div>{dataList.name_list.map((item, index) => {
            return <span className='mr15' key={index}>{item}</span>
          })}</div>}
          <br />
          {dataList && <div>课程单价：¥{dataList.price}</div>}
          <br />
          {dataList && <div>总价：¥{dataList.amount}</div>}
          <br />
          <div>单价折扣：
          <Select getPopupContainer={triggerNode => triggerNode.parentNode} onChange={this.selectChange} value={discount} style={{ width: 120 }}>
              <Option value={1}>自定义价格</Option>
              <Option value={0.9}>9折</Option>
              <Option value={0.8}>8折</Option>
              <Option value={0.7}>7折</Option>
              <Option value={0.6}>6折</Option>
              <Option value={0.5}>5折</Option>
              <Option value={0}>免费</Option>
            </Select>
          </div>
          <br />
          {discount === 1 && <div>自定义单价：<InputNumber min={0} value={custom_amount} onChange={this.numberChange} /><br /><br /></div>}
          {(real_amount !== 0) && <div><label>支付人： </label><Input style={{ width: 150 }} placeholder="支付人" value={pay_user} onChange={this.setPpayUser} onBlur={this.inputOnBlur} /><br /><br /></div>}
          <div style={{ color: '#f5222d' }}>修改后单价价格：¥{real_price}</div>
          <div style={{ color: '#f5222d' }}>实际支付价格：¥{real_amount}</div>
          <br />
          {!order_id && <div>支付方式：<Radio.Group onChange={this.methodChange} value={payment_method}>
            <Radio value={0} disabled={real_amount === 0}>微信支付</Radio>
            <Radio value={1}>线下支付</Radio>
            {/* <Radio value={2}>其它支付</Radio> */}
          </Radio.Group>
          </div>}
          <br />
          <div className='txc'>
            {!order_id && <Button loading={loading} type="primary" onClick={this.toOrderSingle}>提交</Button>}
            {order_id && <Button className="mt15 mb15" loading={loading} type="primary" onClick={this.onPay} disabled={ButtonSeconds > 0}>{ButtonSeconds > 0 ? ButtonSeconds + 's' : '支付'}</Button>}
          </div>
        </MyDrawer>
        {/* 图片展示 */}
        <Modal visible={showModal} centered width={300} footer={null} onCancel={this.hideImg}>
          {qr_code_base64 && <img alt='qr_code_base64'
            style={{ width: 255, height: 255 }} src={qr_code_base64} />}
          {!qr_code_base64 && <div style={{ width: 255, height: 255 }} className='fs-16 txc'>
            <br />
            <br />
            <br />
            <br />
            <span>请刷新二维码</span>
          </div>}
          <div>
            <p className='txc' style={{ color: 'red', minHeight: '21px' }}>{ButtonSeconds > 0 ? `二维码有效期 ${ButtonSeconds} s` : ''}</p>
          </div>
          <div className='txc'>
            <Button style={{ width: 103 }} className="mt15 mb15 mr15" loading={loading} type="primary" onClick={this.onPay} disabled={ButtonSeconds > 0}>刷新二维码</Button>
            <Button className="mt15 mb15" type="primary" onClick={this.toOrderResult} disabled={result_code !== '0000'} loading={defineLoading}>支付完成</Button>
          </div>
        </Modal>
      </div>
    );
  }
}

export default SignUp;