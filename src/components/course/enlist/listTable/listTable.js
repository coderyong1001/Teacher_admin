/*
 * @Author: yuanhang 
 * @Date: 2019-10-31 16:28:06 
 * @Last Modified by: yuanhang
 * @Last Modified time: 2020-06-03 17:43:32
 */
// 列表表格
import React, { Component } from 'react';
import io from 'socket.io-client';
// 引入css
import './index.css'
// utils
import { numFormat, dislodgeEmpty } from '../../../../utils/utils'
// api
import { apiCode, apiWS, postSignupReview, postModifyAmount, postPay, postRefund, getOrderResult, postOrderListPayUser } from '../../../../api/index'
// 全局弹窗抽屉
import MyDrawer from '../../../myDrawer/myDrawer'
// 退款个人信息
import Refund from './refund/refund'
// 导入组件
import { Tag, Input, Modal, message, Button, Table, Row, Col, Select, InputNumber, Checkbox } from 'antd'
const { confirm } = Modal
const { Option } = Select
let genderCategory = { 0: '男', 1: '女' }

const ws = apiWS()

let timerOrder = undefined

let payment = { 0: '已支付', 1: '待支付', 2: '待审核', 3: '审核未通过', 4: '订单取消', 5: '退款审核中', 6: '退款已拒绝', 7: '已部分退款', 8: '已全部退款', 9: '订单已删除', 10: '审核已通过放款中' }
let paymentColor = { 0: 'green', 1: 'orange', 2: 'orange', 3: 'orange', 4: 'orange', 5: 'purple', 6: 'purple', 7: 'red', 8: 'red', 9: 'orange', 10: 'purple' }
let paymentMethod = { 0: '线上支付', 1: '线下支付' }

class ListTable extends Component {
  state = {
    pay_user: null,
    visibleModal: false,
    visibleMyDrawer: false,
    dataList: [],
    dataSource: [],
    columns: [
      { title: '订单编号', dataIndex: 'order_number', key: 'order_number', width: 160 },
      { title: '报名时间', dataIndex: 'create_time', key: 'create_time', width: 180 },
      {
        title: '单价', dataIndex: 'price', key: 'price', width: 150, render: (text, record, index) => {
          return ((record.price === record.old_price) ? '￥' + numFormat(record.old_price) : < div >
            <p><s>{'￥' + numFormat(record.old_price)}</s></p>
            <p style={{ margin: '0' }}>{'￥' + numFormat(record.price)}</p>
          </div >)
        }
      },
      { title: '人数', dataIndex: 'applicant_num', key: 'applicant_num', width: 100 },
      {
        title: '订单发起人', dataIndex: 'create_user', key: 'create_user', width: 180, render: (text, record, index) => {
          return <div>
            <p>发起人：{record.create_user || '无'}</p>
            <p style={{ margin: '0' }}>支付人：{record.pay_user || '无'}</p>
          </div>
        }
      },
      {
        title: '订单状态', dataIndex: 'payment_status', key: 'payment_status', width: 165, render: (text, record, index) => {
          return <div>{(record.payment_status === 2 && this.state.showMulti) && <Checkbox className="mr5" checked={this.state.selectMulti} onChange={(e) => { this.toMultiple(e, record) }}></Checkbox>}
            <Tag className="mr0" color={paymentColor[record.payment_status]}>{payment[record.payment_status]}（{paymentMethod[record.payment_method]}）</Tag>
          </div>
        }
      },
      {
        title: '总金额', dataIndex: 'amount', key: 'amount', width: 150, render: (text, record, index) => {
          return <span>{'￥' + numFormat(record.real_amount)}</span>
        }
      },
      { title: '备注', dataIndex: 'comment', key: 'comment', width: 160 },
    ],
    expandedColumns: [
      { title: '省市', dataIndex: 'province', key: 'province', },
      { title: '单位', dataIndex: 'company', key: 'company', },
      { title: '名字', dataIndex: 'name', key: 'name', },
      {
        title: '性别', dataIndex: 'gender', key: 'gender', render: (text, record, index) => {
          return genderCategory[record.gender]
        }
      },
      { title: '部门', dataIndex: 'department', key: 'department', },
      { title: '职务', dataIndex: 'job_title', key: 'job_title', },
      { title: '手机号码', dataIndex: 'tel', key: 'tel', },
      {
        title: '状态', dataIndex: 'refund_status', key: 'refund_status', render: (text, record, index) => {
          return <Tag className="mr0" color={paymentColor[record.refund_status]}>{payment[record.refund_status]}</Tag>
        }
      },
    ],

    discount: 1,  // 折扣
    real_amount: null,  // 实际支付
    custom_amount: 0, // 临时自定义价格
    custom_price: 0, // 临时单价
    showModal: false,
    qr_code_base64: null,
    showRefund: null,

    showVoucherModal: false,
    voucherUrl: null,
    showMulti: false,

    selectMulti: false,
    loading: false,

    applicantsGroup: [],
    applicants: [],
    allApplicants: 0,

    PaymentStatus: 0, // 付款状态
  }
  static defaultProps = {
    loading: false,
    defineLoading: false,
    result_code: null,
    ButtonSeconds: 0,
    showMulti: false,
    selectMulti: false,
    bordered: false,
    showHeader: true,
    dataSource: [],
    onRenew: () => console.log('ListTable组件回调函数'),
    onMulti: () => console.log('ListTable组件回调函数'),
  }
  componentDidMount() {
    const { loading, dataList, showMulti, selectMulti } = this.props
    this.setState({ loading, dataList, dataSource: [dataList], showMulti, selectMulti: selectMulti ? true : false })
  }
  UNSAFE_componentWillReceiveProps(nextProps) {
    const { loading, dataList, showMulti, selectMulti } = nextProps
    this.setState({ loading, dataList, dataSource: [dataList], showMulti, selectMulti: selectMulti ? true : false })
  }
  componentWillUnmount() {
    this.setState({ qr_code_base64: null, ButtonSeconds: 0, order_id: null })
    if (window.socket) {
      window.socket.close()
      window.socket = null
    }
  }
  // 审核通过后修改支付人
  toOrderListPayUser = () => {
    let vm = this

    Modal.confirm({
      icon: false,
      title: '修改支付人',
      centered: true,
      maskClosable: true,
      okText: '确认',
      content: <div><Input placeholder="支付人" defaultValue={vm.state.dataList.pay_user} onChange={this.setPayUser} /></div>,
      onOk() {
        vm.goOrderListPayUser()
      },
      onCancel() { },
    })
  }
  goOrderListPayUser = () => {
    const { dataList, pay_user } = this.state
    let order_id = dataList.order_id
    postOrderListPayUser({ order_id, pay_user: pay_user }).then(res => {
      // 为空退出
      if (!res) return
      if (res.code === apiCode()) {
        message.info('修改成功')
        this.setState({ pay_user: null })
        // 父组件更新数据
        this.props.onRenew()
      } else {
        let _msg = res.msg || '服务器错误'
        message.info('错误：' + _msg)
      }
    })
  }
  // 关闭抽屉
  onDrawerClose = () => {
    this.setState({ visibleMyDrawer: false })
  }
  // 显示修改金额
  showMyDrawer = () => {
    this.setState({ visibleMyDrawer: true, custom_amount: this.state.dataList.price, custom_price: this.state.dataList.price, real_amount: this.state.dataList.price })
  }
  // 格式化
  formatFloating = (floating) => {
    if (!floating) { return 0 }
    return parseFloat((floating).toFixed(2))
  }
  // 折扣选择
  selectChange = (value) => {
    // 单价折扣
    let _old_price = this.formatFloating(this.state.dataList.old_price * value)
    this.setState({ custom_amount: _old_price, discount: value })
    // 实际支付
    let _amount = this.formatFloating(_old_price * this.state.dataList.applicant_num)
    this.setState({ custom_price: _old_price, real_amount: _amount })
  }
  // 自定义价格
  numberChange = (value) => {
    if (value > this.state.dataList._old_price) { value = this.state.dataList._old_price }
    if (!(typeof value === 'string')) {
      value = this.formatFloating(value)
    }
    this.setState({ custom_amount: value })
    if (value === 0) {
      this.setState({ discount: 0 })
    }
    if (!value && value !== 0) {
      return
    }
    let _price = value
    let _amount = this.formatFloating(_price * this.state.dataList.applicant_num)
    this.setState({ custom_price: _price, real_amount: _amount })
  }
  // onModifyConfirm
  onModifyConfirm = () => {
    let vm = this
    confirm({
      title: '修改提示',
      content: '是否修改金额？',
      okText: '确认',
      cancelText: '取消',
      onOk() {
        vm.onModifyAmount()
      },
      onCancel() {
      },
    });
  }
  // 修改金额
  onModifyAmount = () => {
    let { dataList, discount, real_amount, custom_price } = this.state
    if ((dataList.amount - real_amount) < 0) { return message.info('当前价格大于订单原价格') }
    real_amount = parseFloat(real_amount)

    postModifyAmount({ order_id: dataList.order_id, discount, real_amount, price: custom_price }).then((res) => {
      // 为空退出
      if (!res) return
      if (res.code === apiCode()) {
        message.info(res.msg)
        this.setState({ visibleMyDrawer: false })
        // 父组件更新数据
        this.props.onRenew()
      } else {
        let _msg = res.msg || '服务器错误'
        message.info('错误：' + _msg)
      }
    })
  }
  // 弹窗
  ModalCancel = () => {
    this.setState({ visibleModal: !this.state.visibleModal, pay_user: null })
  }
  // 确定审核
  onSignupReview = () => {
    const { dataList } = this.props
    let _data = { order_id: dataList.order_id }
    // 如果实际支付为0 不传入支付人
    if (dataList.real_amount !== 0) {
      const { pay_user } = this.state
      if (!pay_user && (dataList.source === 0 && dataList.payment_method === 1)) {
        // return message.info('支付人姓名必填')
      }
      if (pay_user) {
        _data.pay_user = pay_user
      }
    }
    postSignupReview(_data).then((res) => {
      // 为空退出
      if (!res) return
      if (res.code === apiCode()) {
        message.info(res.msg)
        this.ModalCancel()
        // 父组件更新数据
        this.props.onRenew()
      } else {
        let _msg = res.msg || '服务器错误'
        message.info('错误：' + _msg)
      }
    })
  }
  // 关闭付款码
  hideImg = () => {
    this.noOrderResult()
    this.setState({ showModal: false })
    if (window.socket) {
      window.socket.close()
      window.socket = null
    }
    // 父组件更新数据
    this.props.onRenew()
  }
  // 取消状态判断
  noOrderResult = () => {
    clearTimeout(timerOrder)
    timerOrder = undefined
  }
  // 支付状态判断
  toOrderResult = () => {
    const order_id = this.state.dataList.order_id
    this.setState({ defineLoading: true })
    getOrderResult({ order_id }).then((res) => {
      if (res.code === 400 || res.code === 20034 || res.code === 23333) {
        // timerOrder = setTimeout(() => {
        //   this.toOrderResult()
        // }, 3000)
        message.info('支付未成功')
      }
      if (res.code === 24444) {
        message.success('成功')
        this.hideImg()
      }
      this.setState({ defineLoading: false })
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
    let _data = {}
    _data.order_id = this.state.dataList.order_id
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
          console.log('dataObj', dataObj, ' result_code', result_code)
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
  // 显示退款钱初始数据
  initialRefund = (PaymentStatus) => {
    // 付款状态
    this.setState({ PaymentStatus })

    const { dataList } = this.state
    let initial_array = []
    // 获取已支付 和 线上退款申请
    if (dataList && dataList.refund_info) {
      initial_array = dataList.refund_info.map((item) => {
        return ((item.refund_status === PaymentStatus)) ? item : null
      });
    }
    // 去空
    initial_array = dislodgeEmpty(initial_array)
    // 默认值
    let defaultValue = initial_array.map((item) => {
      return item.refund_status === PaymentStatus ? item.id : null
    })
    defaultValue = dislodgeEmpty(defaultValue)
    let applicants = initial_array.map(item => {
      return {
        id: item.id,
        amount: dataList.price
      }
    })
    this.setState({ applicantsGroup: defaultValue, allApplicants: (defaultValue.length * dataList.price).toFixed(2), applicants })
    // 打开侧边栏
    this.toShowRefund()
  }
  // 显示退款
  toShowRefund = () => {
    if (!this.state.showRefund) {
      this.childRefund = []
    }
    this.setState({ showRefund: !this.state.showRefund })
  }
  // 退款
  toRefund = () => {
    let { dataList, applicants, applicantsGroup } = this.state
    let { order_id, refund_info } = dataList
    let vm = this

    let applicants_obj = {}
    let refund_info_obj = {}
    applicants.forEach((item) => {
      applicants_obj[item.id] = item
    })
    refund_info.forEach((item) => {
      refund_info_obj[item.id] = item
    })
    let _applicants = applicantsGroup.map(id => {
      return applicants_obj[id]
    })
    Modal.confirm({
      icon: false,
      title: '确认退款',
      centered: true,
      maskClosable: true,
      okText: '确认',
      content: <div>
        {applicantsGroup && applicantsGroup.map(id => {
          return <p className='fs-14' key={id}><span className='mr15'>退款人：{refund_info_obj[id].name}</span><span>退款金额：{applicants_obj[id].amount}</span></p>
        })}
      </div>,
      onOk() {
        postRefund({ order_id, applicants: _applicants }).then((res) => {
          // 为空退出
          if (!res) return
          if (res.code === apiCode()) {
            message.info(res.msg)
            vm.toShowRefund()
            // 父组件更新数据
            vm.props.onRenew()
          } else {
            let _msg = res.msg || '服务器错误'
            message.info('错误：' + _msg)
          }
        })
      },
      onCancel() { },
    })
  }
  // 显示支付凭证
  showVoucher = (url) => {
    this.setState({ voucherUrl: url })
    this.hideVoucherImg()
  }
  // 显示隐藏 支付凭证
  hideVoucherImg = () => {
    this.setState({ showVoucherModal: !this.state.showVoucherModal })
  }
  // 嵌套表格
  expandedRowRender = (record, index, indent, expanded) => {
    return <Table rowKey={record => record.id} dataSource={(record.applicant_info && record.applicant_info.constructor === Array) ? record.applicant_info : []} columns={this.state.expandedColumns} pagination={false} />
  }
  // 设置支付人姓名
  setPayUser = (e) => {
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
  // 多个审核
  toMultiple = (e, record) => {
    this.props.onMulti(e.target.checked, record)
  }
  // 获取子集
  MyRefund = (id, ref) => {
    if (!this.childRefund) {
      this.childRefund = []
    }
    this.childRefund[id] = ref
  }
  setApplicantsGroup = (checkedValues) => {
    this.setState({ applicantsGroup: checkedValues })
    let allApplicants = 0
    checkedValues.forEach(id => {
      allApplicants = this.childRefund[id].state.amount + allApplicants
    })
    this.setState({ allApplicants: allApplicants.toFixed(2) })
  }
  // 退款数据
  getRefund = (val) => {
    let { applicants, applicantsGroup } = this.state
    let _applicants = [...applicants]
    _applicants = _applicants.map(item => {
      return item.id === val.id ? val : item
    })
    let _obj = {}
    _applicants.forEach((item) => {
      _obj[item.id] = item
    })
    let _arr = applicantsGroup.map(id => {
      return _obj[id]
    })
    let allApplicants = 0
    _arr.forEach(item => {
      if (typeof item.amount !== 'number') {
        item.amount = 0
      }
      allApplicants = item.amount + allApplicants
    })
    this.setState({ applicants: _applicants, allApplicants: allApplicants.toFixed(2) })
  }
  render() {
    const { loading, pay_user, custom_price, visibleMyDrawer, dataList, dataSource, columns, discount, custom_amount, real_amount, showModal, qr_code_base64, showRefund, showVoucherModal, voucherUrl, allApplicants, applicantsGroup, PaymentStatus, ButtonSeconds, defineLoading } = this.state
    const { bordered, showHeader } = this.props
    return (
      <div className='ListTable'>
        {dataSource && <Table bordered={bordered} showHeader={showHeader} loading={loading} rowKey={record => record.order_id} dataSource={dataSource} columns={columns} pagination={false} expandedRowRender={this.expandedRowRender} />}
        <div className='ListTableBtnBox'>
          <br />
          <Row gutter={24} >
            <Col span={12} >
              {/* 线上 退款申请中 */}
              {(dataList && (dataList.source === 0 && dataList.payment_method === 1)) && <span className='mr15 payment_3'>支付凭证: {(dataList.voucher && dataList.voucher.constructor === Array) ? (dataList.voucher.map((item, index) => {
                return <img className='voucherImg' src={item} key={'voucher' + index} alt='voucher' onClick={this.showVoucher.bind(this, item)} />
              })) : '未上传'}</span>}
            </Col>
            <Col className='txr' span={12} >
              {/* 已退款 */}
              {(dataList && (dataList.payment_status === 7 || dataList.payment_status === 8)) && <span className='payment_3 mr15'>退款金额: {dataList.refund_amount}  ; 退款时间: {dataList.modify_time}</span>}
              {/* 选择线上支付未成功时 才有去支付按钮 */}
              {(dataList && dataList.payment_status === 1 && dataList.payment_method === 0) && <Button className='mr15' type="primary" onClick={this.onPay}>去支付</Button>}
              {/* 未支付 未审核 */}
              {(dataList && (dataList.payment_status === 1 || dataList.payment_status === 2)) && <Button className='mr15' type="primary" onClick={this.showMyDrawer}>修改金额</Button>}
              {/* 未审核 */}
              {(dataList && dataList.payment_status === 2) && <Button className='mr15' type="primary" onClick={this.ModalCancel}>确定审核</Button>}
              {/* 线上 退款申请中 */}
              {(dataList && dataList.payment_status === 5) && <span className='mr15 payment_3'>申请退款: {dataList.modify_time}</span>}
              {/* 退款审核中 || 部分退款并没有退完 */}
              {(dataList && dataList.payment_status === 5 && <span>
                <Button onClick={this.initialRefund.bind(this, 5)} className='mr15' >审核退款</Button>
              </span>)}
              {/* 线下 已支付 */}
              {(dataList && dataList.payment_status === 0 && dataList.payment_method === 1 && dataList.real_amount !== 0) && <Button onClick={this.toOrderListPayUser} className='mr15' >修改支付人</Button>}
              {/* 线下 已支付 */}
              {(dataList && (dataList.payment_status === 0 || (dataList.payment_status === 7 && dataList.able_refund))) && <Button onClick={this.initialRefund.bind(this, 0)} className='mr15' >退款</Button>}
            </Col>
          </Row>
          <br />
        </div>
        <div style={{ background: '#fafafa', }}>
          <br />
        </div>
        {/* 显示隐藏 */}
        <Modal
          title="隐藏提示"
          width={300}
          centered
          visible={this.state.visibleModal}
          onOk={this.onSignupReview}
          onCancel={this.ModalCancel}>
          <p className='txc' style={{ fontSize: '16px' }}>是否通过审核</p>
          {(dataList.source === 0 && dataList.payment_method === 1 && dataList.real_amount !== 0) && <div>
            <p>支付人姓名：</p>
            <Input placeholder="支付人姓名" onChange={this.setPayUser} onBlur={this.inputOnBlur} value={pay_user} />
          </div>}
        </Modal>
        {/* 修改金额 */}
        <MyDrawer onDrawerClose={this.onDrawerClose} titleText='修改金额' drawerWidt={500} visible={visibleMyDrawer}>
          {dataList && <Row style={{ fontSize: '16px' }} gutter={8} >
            <Col span={12} >
              <span className='mr20'>折扣：  </span> <Select getPopupContainer={triggerNode => triggerNode.parentNode} onChange={this.selectChange} value={discount} style={{ width: 120 }}>
                <Option value={1}>自定义价格</Option>
                <Option value={0.9}>9折</Option>
                <Option value={0.8}>8折</Option>
                <Option value={0.7}>7折</Option>
                <Option value={0.6}>6折</Option>
                <Option value={0.5}>5折</Option>
                <Option value={0}>免费</Option>
              </Select>
            </Col>
            {discount === 1 && <Col span={12} >
              <span className='mr10'>自定义单价：</span>
              <InputNumber min={0} value={custom_amount} onChange={this.numberChange} />
            </Col>}
            <Col span={24}></Col>
            <Col span={12} className='mt15' >
              <span className='mr15'>当前课程单价: <Tag color="cyan">¥ {dataList.price}</Tag></span>
            </Col>
            <Col span={12} className='mt15' >
              <span className='mr15'>修改后单价: <Tag color="volcano">¥ {custom_price}</Tag></span>
            </Col>
            <Col span={24} className='mt15' >
              <span className='mr15'>报名人数: {dataList.applicant_num}</span>
            </Col>
            <Col span={12} className='mt15' >
              <span className='mr15'>当前订单价格: <Tag color="cyan">¥ {dataList.amount}</Tag></span>
            </Col>
            <Col span={12} className='mt15' >
              <span>实际支付: <Tag color="volcano">¥ {real_amount}</Tag></span>
            </Col>
            <Col span={12} className='mt15' >
              <span>优惠价格: <Tag color="magenta">¥ {(dataList.amount - real_amount).toFixed(2)}</Tag></span>
            </Col>
          </Row>}
          <div className='mt15 txc'>
            <Button className='mr15' type="primary" onClick={this.onModifyConfirm}>修改</Button>
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
            <Button className="mt15 mb15" type="primary" onClick={this.toOrderResult} loading={defineLoading}>支付完成</Button>
          </div>
        </Modal>
        {/* 支付凭证 图片展示 */}
        <Modal visible={showVoucherModal} centered width='60%' footer={null} onCancel={this.hideVoucherImg}>
          <img alt='VoucherModal'
            style={{ width: '100%' }} src={voucherUrl} />
        </Modal>
        {/* 退款 */}
        <MyDrawer visible={showRefund} onDrawerClose={this.toShowRefund} drawerWidt={600} titleText='退款'>
          <Checkbox.Group value={applicantsGroup} style={{ width: '100%' }} onChange={this.setApplicantsGroup}>
            {(dataList && dataList.refund_info) && dataList.refund_info.map((item, index) => {
              return (item.refund_status === PaymentStatus) ? <div key={item.id}> <Checkbox value={item.id} style={{ margin: 0 }}></Checkbox>
                <Refund onRef={this.MyRefund} itemData={item} price={dataList.price} onChange={this.getRefund} applicantsGroup={applicantsGroup} />
              </div> : <div key={item.id}></div>
            })}
          </Checkbox.Group>,
          <div className="txc mt15 mb15">
            <p className="txc fs-20">退款总金额 {allApplicants}</p>
            <Button disabled={applicantsGroup && applicantsGroup.toString() !== '[]' && applicantsGroup.length === 0} className='mr15' type="primary" onClick={this.toRefund}>确定退款</Button>
          </div>
        </MyDrawer>
      </div>
    );
  }
}

export default ListTable;