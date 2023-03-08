/*
 * @Author: yuanhang 
 * @Date: 2019-12-03 15:39:36 
 * @Last Modified by: yuanhang
 * @Last Modified time: 2020-06-11 15:11:07
 */
// 新建发票表单
import React, { Component } from 'react';
// 引入
import './index.css'

// utils
import { 
  getUrlID, setDOMJsDate, getDOMJsDate, setInitialValue, setEmptyValue, getDistrict, getDistrictList 
} from '../../../../utils/utils'

// 表单
import MyForm from '../../../myForm/myForm'
// 表单配置
import FormDOM from '../../../../utils/form_invoice'
// 表单配置
import InvoiceDetails from '../invoiceDetails/invoiceDetails'
// 表单配置
import SeveralData from '../severalData/inedx'
// 全局弹窗抽屉
import MyDrawer from '../../../myDrawer/myDrawer'
// 发票信息数据
import InvoiceList from './invoiceList/index'
// api
import { apiCode, getInvoiceOrders, postInvoice, apiPromise } from '../../../../api/index'
// 导入组件
import { Row, Col, message, Button, Card, Icon, Checkbox, Modal } from 'antd';

const { confirm } = Modal


class NewInvoice extends Component {
  state = {
    stateFormDOM: null,
    stateFormKey: 'stateFormKey',
    ordersList: {},
    detailsList: [],  // 订单列表

    detailsOption: null,
    detailsCheck: [],
    checkAmount: [],
    checkedValues: [],
    detailsModel: {
      detail_amount: 0,
      price_info: [{ price: null, num: null, order_id: null }],
    },
    invoice_number: null,
    details: [],        // 返回数据
    detailsNumber: [],  // 发票列表
    visibleMyDrawer: false,
    selectedRows: null,
    loading: false,
    tax_number: null,
    listOne: null,
    listTow: null,
    listThree: null,
  }
  static defaultProps = {
    course_id: null,
    onRef: () => console.log('NewInvoice组件回调函数'),
    onRenew: () => console.log('NewInvoice组件回调函数'),
  }
  componentDidMount() {
    let stateFormDOM = FormDOM
    this.setState({ stateFormDOM, detailsList: [] })
    this.getOrders()
    let listOne = getDistrict()
    this.setState({ listOne }, () => {
      setDOMJsDate(FormDOM, 'province', { key: 'option', val: getDistrict() })
      this.onChange('北京市', 'province')
    })
  }
  UNSAFE_componentWillReceiveProps() {
    let stateFormDOM = setEmptyValue(FormDOM)
    this.setState({ stateFormDOM })
    this.setState({ detailsList: [] })
    this.getOrders()
  }
  // 得到子组件
  onInvoiceList = (ref) => {
    this.invoiceListForm = ref
  }
  // 得到子组件
  MyForm = (ref) => {
    this.childForm = ref
  }
  // 获取订单list
  getOrders = () => {
    let { course_id } = this.props
    course_id = course_id || getUrlID()
    getInvoiceOrders({ course_id }).then((res) => {
      // 为空退出
      if (!res) return
      if (res.code === apiCode()) {
        if (res.data) {
          let _DOM = this.state.stateFormDOM || FormDOM
          let _list = res.data
          // list 没有数据就结束
          if (!_list) { return }
          let _obj = {}
          _list = _list.map((item) => {
            item.customize = `${item.order_number}  ${item.name}  ${item.real_amount}元`
            _obj[item.id] = item
            return item
          })

          let stateFormDOM = setDOMJsDate(_DOM, 'orders', { key: 'option', val: _list })

          let timestamp = new Date().getTime()
          this.setState({ stateFormDOM, stateFormKey: 'stateFormKey' + timestamp, ordersList: _obj })
        }
      } else {
        let _msg = res.msg || '服务器错误'
        message.info('错误：' + _msg)
      }
    })
  }
  // 表单值修改触发
  onChange = (e, key) => {
    let _data = e.target ? e.target.value : e
    // 电子发票 切换必填 邮箱
    if (key === 'paper_elec') {
      let _rulesModel = getDOMJsDate(FormDOM, 'email')
      _rulesModel.rules[0].required = (_data === 0)
      setDOMJsDate(FormDOM, 'email', { key: 'rules', val: _rulesModel.rules })
      this.childForm.toResetFields(['email'])
    }
    // 发票类型type 切换必填
    // 抬头类型title_type 切换必填 发票材质 发票抬头 税号 地址 电话 开户行 账号
    if (key === 'type') {
      let _array = ['addr_tel', 'bank_account']
      _array.forEach(item => {
        let _rulesModel = getDOMJsDate(FormDOM, item)
        _rulesModel.rules[0].required = (_data === 1)
        setDOMJsDate(FormDOM, item, { key: 'rules', val: _rulesModel.rules })
      })
      this.childForm.toResetFields(_array)
      // 选择为专用发票时
      if (_data === 1) {
        setDOMJsDate(FormDOM, 'title_type', { key: 'disabled', val: true })
      } else {
        setDOMJsDate(FormDOM, 'title_type', { key: 'disabled', val: false })
      }
      this.childForm.toSetValue({ title_type: 0 })
    }
    if (key === 'orders') {
      let { ordersList } = this.state
      let detailsList = []
      _data.forEach((item) => {
        if (item || item === 0 || item === false) {
          detailsList.push(ordersList[item])
        }
      })

      // let Option1 = this.getOption(detailsList) || []
      let Option2 = this.getDataList(detailsList) || []
      let detailsOption = Option2

      this.setState({ detailsOption, detailsList, details: [] })
    }
    // 省选择时触发
    if (key === 'province') {
      let { listOne } = this.state
      let id = this.getID(listOne, e)
      let listTow = getDistrictList(id)
      this.setState({ listTow })
      setDOMJsDate(FormDOM, 'city', { key: 'option', val: listTow })
    }
    // 市选择时触发
    if (key === 'city') {
      let { listTow } = this.state
      let id = this.getID(listTow, e)
      let listThree = getDistrictList(id, 2)
      this.setState({ listThree })
      setDOMJsDate(FormDOM, 'district', { key: 'option', val: listThree })
    }
    return _data
  }
  // 获取id
  getID = (array, fullname) => {
    let id = null
    array.forEach(item => {
      if (item.fullname === fullname) {
        return id = item.id
      }
    });
    return id
  }
  getDataList = (list) => {
    let array = []
    if (list.length === 0 || toString(list) === '[]') { return array }
    list.forEach(item => {
      // 如果为空返回所有
      if (!(item.price_verify_info.length === 0 || toString(item.price_verify_info) === '[]')) {
        item.price_verify_info.forEach((order, index) => {
          for (let i = 1; i <= order.applicant_num; i++) {
            let len = array.length
            array.push({
              id: len,
              order_id: order.order_id || order.id,
              price: order.price
            })
          }
        })
      }
    })
    return array
  }
  // 获取下拉选项
  getOption = (list) => {
    let array = []
    if (list.length === 0 || toString(list) === '[]') { return array }
    list.forEach(item => {
      // 如果为空返回所有
      if (item.price_verify_info.length === 0 || toString(item.price_verify_info) === '[]') {
      } else {
        item.price_verify_info.forEach((order, index) => {
          array.push(order)
        })
      }
    })
    return array
  }
  // 税号校验
  toVerification = async () => {
    this.setState({ loading: true })
    let vm = this
    let _data = vm.childForm.toSuccess()
    if (!_data) { return vm.setState({ loading: false }) }
    let search = await apiPromise('/teacher_training/manager/invoice/template/', { search: _data.tax_number })
    if (search && (search.length >= 1)) {
      vm.setState({ loading: false })
      confirm({
        centered: true,
        title: '查验提示',
        okText: '确认提交',
        cancelText: '去查验',
        content: '该税号与发票信息库中的税号重复，是否确认提交',
        onOk() {
          vm.toSubmit()
        },
        onCancel() {
          vm.setState({ visibleMyDrawer: true })
          if (vm.invoiceListForm) {
            vm.invoiceListForm.toSonSearch(_data.tax_number)
          }
        }
      });
      return
    }
    vm.setState({ loading: false })
    vm.toSubmit()
  }
  // 提交  开发票
  toSubmit = () => {
    this.setState({ loading: false })
    let _data = this.childForm.toSuccess()
    if (!_data) { return }
    let { course_id, onRenew } = this.props
    course_id = Number(course_id) || Number(getUrlID())
    let details = JSON.parse(JSON.stringify([...this.state.details])) || []
    if (details.length === 0 || toString(details) === '[]') { return message.info('请选择发票') }
    // 发票金额
    let checkAmount = details.map(item => {
      let amount = 0
      item.forEach(val => {
        amount = amount + val.price
      })
      return amount
    })
    let amount = 0
    checkAmount.forEach(price => {
      amount = amount + price
    })
    // 合并发票 
    let _details = []
    details.forEach((order, index) => {
      order = order.map(item => {
        delete item['id']
        return JSON.stringify(item)
      })
      let cache = []
      let number = []
      order.forEach(item => {
        let _in = cache.indexOf(item)
        let _len = cache.length
        if (_in === -1) {
          number[_len] = 1
          cache.push(item)
          return
        }
        number[_in] = number[_in] + 1
      })
      let price_info = cache.map((item, index2) => {
        item = JSON.parse(item)
        item['num'] = number[index2]
        return item
      })
      _details.push({
        detail_amount: checkAmount[index],
        price_info
      })
    })
    let invoice_info = {
      invoice_number: _details.length,
      details: _details
    }
    let _obj = { amount, course_id, invoice_info }
    _data = { ..._data, ..._obj }
    // 父级基本信息内容 发票名目传入
    _data = { ..._data, ...{ invoice_content: this.props.courseData.invoice_content } }

    Object.keys(_data).forEach(key => {
      if (!_data[key] && _data[key] !== 0 && _data[key] !== false) {
        delete _data[key]
      }
    })
    postInvoice(_data).then((res) => {
      // 为空退出
      if (!res) return
      if (res.code === apiCode()) {
        message.info('成功')
        // 父组件关闭
        onRenew();
        // 重置
        this.toResetFields()
      } else {
        let _msg = res.msg || '服务器错误'
        message.info('错误：' + _msg)
      }
    })
  }
  // 重置
  toResetFields = () => {
    this.childForm.toResetFields()
    this.onChange(0, 'paper_elec')
    this.onChange(0, 'title_type')
    this.onChange([], 'orders')
  }
  // 删除
  toDelete = (index) => {
    let { detailsOption, details } = this.state
    details[index].forEach(item => {
      detailsOption.push(item)
    })
    details.splice(index, 1)
    this.setState({ details, detailsOption })
  }
  // 删除标签
  onDefault = (item, index) => {
    let { detailsOption, details } = this.state
    detailsOption.push(item)
    let data = details[index]
    var _in = data.indexOf(item)
    if (_in > -1) {
      data.splice(_in, 1)
    }
    if (data.length === 0 || toString(data) === '[]') {
      details.splice(index, 1)
    }

    this.setState({ details, detailsOption })
  }
  // 添加单价
  toAdd = () => {
    const { detailsCheck, detailsOption } = this.state
    if (detailsCheck.length === 0 || toString(detailsCheck) === '[]') { return message.info('未选择订单') }
    let details = [...this.state.details]
    details.push(detailsCheck)
    // 差集
    let difference = detailsOption.concat(detailsCheck).filter(v => detailsOption.includes(v) && !detailsCheck.includes(v))
    this.setState({ details, detailsCheck: [], checkedValues: [], detailsOption: difference })
  }
  // 获取选择
  onDetailsCheck = (checkedValues) => {
    const { detailsOption } = this.state
    let _obj = {}
    detailsOption.forEach(item => {
      _obj[item.id] = item
    })
    let detailsCheck = checkedValues.map(id => {
      return _obj[id]
    })
    this.setState({ detailsCheck, checkedValues })
  }
  // 关闭抽屉
  onDrawerClose = () => {
    this.setState({ visibleMyDrawer: false })
  }
  // 获取发票数据 
  onInvoiceData = (selectedRows) => {
    this.onDrawerClose()
    let { title, tax_number, addr_tel, bank_account, email } = selectedRows
    let stateFormDOM = setInitialValue({ title, tax_number, addr_tel, bank_account, email }, FormDOM)

    let timestamp = new Date().getTime()
    this.setState({ selectedRows, stateFormDOM, stateFormKey: 'stateFormKey' + timestamp })
    this.setState({ detailsList: [], details: [] })
  }
  render() {
    const { stateFormKey, stateFormDOM, detailsList, detailsOption, visibleMyDrawer } = this.state
    let { details, checkedValues } = this.state
    // 发票金额
    let checkAmount = details.map(item => {
      let amount = 0
      item.forEach(val => {
        amount = amount + val.price
      })
      return amount
    })
    let amount = 0
    checkAmount.forEach(price => {
      amount = amount + price
    })
    return (
      <div className='NewInvoice'>
        <div>
          <label className='label' title="获取发票信息">获取发票信息</label>
          {/* 获取发票信息 */}
          <MyDrawer onDrawerClose={this.onDrawerClose} titleText='获取发票信息' btnText='获取发票信息' drawerWidt={1000} visible={visibleMyDrawer}>
            {/* 发票信息 */}
            <InvoiceList onRef={this.onInvoiceList} tax_number={this.state.tax_number} onInvoiceData={this.onInvoiceData}></InvoiceList>
          </MyDrawer>
        </div>
        <br />
        {stateFormDOM && <MyForm key={stateFormKey} onRef={this.MyForm} FormDOM={stateFormDOM} onChange={this.onChange}></MyForm>}
        <br />
        <Row gutter={24}>
          {detailsList && detailsList.map((item) => {
            return <Col key={item.id} span={12} className='mb15'>
              <InvoiceDetails details={item} />
            </Col>
          })}
          {(detailsList && detailsList.length > 0) && <Col span={24} >
            <p style={{ fontSize: 16 }}>开票信息：</p>
            {(detailsOption.length > 0) && <Card className='mb10' title='金额选项'>
              <Checkbox.Group style={{ width: '100%' }} onChange={this.onDetailsCheck} value={checkedValues}>
                <Row>
                  {detailsOption && detailsOption.map(item => {
                    return <Col key={item.id} span={6} className='mb10'>
                      <Checkbox value={item.id}>{item.price}</Checkbox>
                    </Col>
                  })}
                </Row>
              </Checkbox.Group>
            </Card>}
            {details && details.map((item, index) => {
              return <Card key={'SeveralData_' + index} title={"发票" + (index + 1) + "信息（金额：" + checkAmount[index] + "元）"} className='mb15' extra={<Icon onClick={this.toDelete.bind(this, index)} style={{ cursor: 'pointer' }} type="close" />}>
                <SeveralData details={details[index]} onDefault={this.onDefault} itemIndex={index} />
              </Card>
            })}
            {(detailsOption.length > 0) && <Button onClick={this.toAdd} icon="plus">添加发票</Button>}
          </Col>}
          <Col span={24} >
            <br />
            <br />
            <Col span={12}>
              <p style={{ height: '32px', lineHeight: '32px' }} className="txr">总金额：{amount}</p>
            </Col>
            <Col span={12} className="txl">
              <Button type="primary" loading={this.state.loading} onClick={this.toVerification}>开发票</Button>
            </Col>
          </Col>
        </Row>
      </div >
    );
  }
}

export default NewInvoice;