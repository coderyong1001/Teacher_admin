/*
 * @Author: yuanhang 
 * @Date: 2019-11-01 13:41:46 
 * @Last Modified by: yuanhang
 * @Last Modified time: 2020-05-20 17:29:23
 */
// 发票管理
import React, { Component } from 'react';
// 全局弹窗抽屉
import MyDrawer from '../../myDrawer/myDrawer'
// 封装单选项
import MyRadio from '../../radio/index'
// 新建发票表单
import NewInvoice from './newInvoice/newInvoice'
// utils
import { getUrlID, getDX } from '../../../utils/utils'
// api
import { apiCode, getInvoice, putReview, getInvoiceID, exportAPI } from '../../../api/index'
// 导入组件
import { Tag, Row, Col, Modal, Input, Button, Table, message, Checkbox } from 'antd';
const { Search } = Input

let paper_elec_state = [
  { value: null, label: '全部' },
  { value: 0, label: '电子发票' },
  { value: 1, label: '纸质发票' },
]
let status_state = [
  { value: null, label: '全部' },
  { value: 0, label: '待审核' },
  { value: 1, label: '已开出' },
]
let typeCategory = { 0: '普通发票', 1: '专用发票' }
let elecCategory = { 0: '电子发票', 1: '纸质发票' }
let statusCategory = { 0: '待审核', 1: '已开出', 2: '已取消' }
let invoiceContent = { 1: '培训费', 2: '会议费', 3: '活动费' }
let payment_method = { 0: '线上支付', 1: '线下支付' }
let payment_status = { 0: '已支付', 1: '待支付', 2: '待审核', 3: '审核未通过', 4: '订单取消', 5: '退款审核中', 6: '退款已拒绝', 7: '已部分退款', 8: '已全部退款', 9: '订单已删除', 10: '审核已通过放款中' }
let paymentColor = { 0: 'green', 1: 'orange', 2: 'orange', 3: 'orange', 4: 'orange', 5: 'purple', 6: 'purple', 7: 'red', 8: 'red', 9: 'orange', 10: 'purple' }

class Invoice extends Component {
  state = {
    dataSource: [],
    defaultColumnsValue: [],
    default_key_lists:["province", "people", "amount", "title", "tax_number", "apply_user", "tel", "type", "invoice_content", "comment"],
    scrollX: 2700,
    columns: [],
    defColumns: [
      { title: '申请时间', width: 110, dataIndex: 'create_time', key: 'create_time', },
      { title: '省市', dataIndex: 'province', key: 'province', },
      { title: '申请人', width: 90, dataIndex: 'apply_user', key: 'apply_user', },
      { title: '申请人电话', width: 140, dataIndex: 'tel', key: 'tel', },
      {
        title: '发票材质', width: 90, dataIndex: 'paper_elec', key: 'paper_elec', render: (text, record, index) => {
          return elecCategory[record.paper_elec]
        }
      },
      { title: '邮箱', width: 180, dataIndex: 'email', key: 'email', },
      {
        title: '发票类型', width: 90, dataIndex: 'type', key: 'type', render: (text, record, index) => {
          return typeCategory[record.type]
        }
      },
      { title: '抬头', dataIndex: 'title', key: 'title', },
      { title: '税号', dataIndex: 'tax_number', key: 'tax_number', },
      { title: '地址及电话', dataIndex: 'addr_tel', key: 'addr_tel', },
      { title: '开户行及账号', width: 180, dataIndex: 'bank_account', key: 'bank_account', },
      { title: '开票人数', dataIndex: 'people', key: 'people', },
      { title: '金额(元)', dataIndex: 'amount', key: 'amount', },
      {
        title: '发票状态', dataIndex: 'status', key: 'status', render: (text, record, index) => {
          return statusCategory[record.status]
        }
      },
    ],
    defId: [
      { title: '发票编号', width: 100, dataIndex: 'invoice_num', key: 'invoice_num', },
      {
        title: '订单号', width: 250, dataIndex: 'orders_info', key: 'orders_info', render: (text, record, index) => <span>{
          (record.orders_info && record.orders_info.order_number) && record.orders_info.order_number.map((item, index) => {
            return <Tag style={{ margin: (index === 0) ? '0' : '5px 0 0 0' }} key={item} color={paymentColor[record.orders_info.payment_status[index]]}>{item} - {payment_method[record.orders_info.payment_method[index]]} ({payment_status[record.orders_info.payment_status[index]]}) </Tag>
          })
        }</span>
      },
    ],
    defOperate: [{
      title: '操作', fixed: 'right', dataIndex: 'id', key: 'operate', width: 250, render: (text, record, index) => <span>
        {(record.status === 0) && <Button className='mr15' type="link" onClick={this.toExamine.bind(this, record.id)}>审核</Button>}
        <Button type="link" onClick={this.toCheck.bind(this, record.id)}>查看</Button>
      </span>,
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div className="custom-filter-dropdown" style={{ width: 300, padding: 12 }} >
          <Row gutter={12}>
            <Checkbox.Group value={this.state.defaultColumnsValue} onChange={this.onColumnsChange()}>
              {this.state.defColumns.map((item, index) => {
                return <Col key={item.key} span={12}>
                  <Checkbox value={item.key}>{item.title}</Checkbox>
                </Col>
              })}
            </Checkbox.Group>
            <Col span={24} className='txc'>
              <Button onClick={this.toColumnsReset} icon="check">全选</Button>
              <Button className='ml15' onClick={this.toInvoiceExport} icon="download">导出</Button>
            </Col>
          </Row>
        </div>
      )
    }],
    course_id: null,
    pager: { page_size: 10, page_num: 1 },
    pagination: {
      showSizeChanger: true,
      current: 1,
      pageSize: 10,
      total:0
    },
    search: null,
    paper_elec: null,
    status: null,

    visibleModal: false,
    invoice_id: null,
    invoiceData: null,
    visibleCheck: false,

    visibleMyDrawer: false,

  }
  static defaultProps = {
    onRef: () => console.log('Invoice组件回调函数'),
  }
  componentDidMount() {
    this.props.onRef(this)
    let { course_id } = this.props
    course_id = course_id || getUrlID()
    if (course_id) {
      this.setState({ course_id })
      this.getList({ course_id })
    }
    // 初始化表格
    let columns = [...this.state.defId, ...this.state.defColumns, ...this.state.defOperate]
    this.setState({ columns })
    // 生成表头key数组
    this.setColumnsValue()
  }
  // 生成表头key数组
  setColumnsValue = () => {
    let defaultColumnsValue = this.state.defColumns.map(item => {
      return item.key
    })
    this.setState({ defaultColumnsValue })
  }
  // 重置
  toColumnsReset = () => {
    let defaultColumnsValue = this.state.defColumns.map(item => {
      return item.key
    })
    this.setColumns(defaultColumnsValue)
    this.setColumnsValue()
  }
  // 设置表格
  setColumns = (checkedValues) => {
    const { defId, defColumns, defOperate } = this.state
    let series = 150
    this.setState({ defaultColumnsValue: checkedValues })
    // 先拿表头
    let columns = []
    columns = [...columns, ...defId]
    // 筛选内容
    defColumns.forEach((r, index) => {
      checkedValues.forEach(rs => {
        if (r.key === rs) {
          columns.push(r)
        }
      })
    })
    columns = [...columns, ...defOperate]
    // 动态宽度
    let seriesX = series * (defColumns.length - (columns.length - 2))
    let _scrollX = (2700 - seriesX)
    this.setState({ columns, scrollX: _scrollX })
  }
  // 列表改变
  onColumnsChange = (checkedValues) => (checkedValues) => {
    if (checkedValues.length === 0) { return message.info('至少保留一项参数') }
    this.setColumns(checkedValues)
  }
  // 获取数据
  getList = (data) => {
    const { pager, course_id, search, paper_elec, status } = this.state
    data = data || { course_id, search, paper_elec, status }
    Object.assign(data, pager)
    if (data.paper_elec === -1) { data.paper_elec = null }
    if (data.status === -1) { data.status = null }
    getInvoice(data).then((res) => {
      // 为空退出
      if (!res) return
      if (res.code === apiCode()) {
        const pagination_total = res.data.pager.count;
        const _pagination = { ...this.state.pagination };
        _pagination.total = pagination_total ;
        this.setState({ dataSource: res.data.list ,pagination: _pagination,});
      } else {
        let _msg = res.msg || '服务器错误'
        message.info('错误：' + _msg)
      }
    })
  }
  // 	分页、排序、筛选变化时触发
  handleTableChange = (pagination, filters, sorter) => {
    let { course_id } = this.state
    // 获取配置分页信息
    const _pagination = { ...this.state.pagination }
    // 获取组件内分页
    _pagination.current = pagination.current
    _pagination.pageSize = pagination.pageSize
    _pagination.total = pagination.total
    const _pager = { ...this.state.pager }
    _pager.page_num = pagination.current
    _pager.page_size = pagination.pageSize
    this.setState({
      pagination: _pagination,
      pager: _pager,
    }, () => { this.getList({ course_id }) })
  }
  // 审核
  toExamine = (id) => {
    this.setState({ invoice_id: id }, () => { this.ModalCancel() })
  }
  // 查看
  toCheck = (id) => {
    let { course_id } = this.state
    getInvoiceID({ course_id }, id).then((res) => {
      // 为空退出
      if (!res) return
      if (res.code === apiCode()) {
        let _data = res.data
        _data.amountDX = getDX(_data.amount)
        this.setState({ invoiceData: _data })
        this.hideCheck()
      } else {
        let _msg = res.msg || '服务器错误'
        message.info('错误：' + _msg)
      }
    })
  }
  // 报名
  hideCheck = () => {
    this.setState({ visibleCheck: !this.state.visibleCheck })
  }
  // 搜索
  setSearch = (e) => {
    let _data = e.target ? e.target.value : e
    this.setState({ search: _data })
  }
  inputOnBlur = (e) => {
    let _data = e.target.value
    // 去首尾空格
    if (typeof (_data) == 'string' && _data) {
      _data = _data.replace(/(^\s*)|(\s*$)/g, "")
    }
    this.setState({ search: _data })
  }
  // 搜索
  onSearch = () => {
    let vm = this
    this.setState({ pager: { page_size: 10, page_num: 1 } }, () => { vm.getList() })
  }
  // 重置
  onReset = () => {
    this.setState({
      search: null,
      paper_elec: null,
      status: null,
      pager: { page_size: 10, page_num: 1 },
      pagination: {
        showSizeChanger: true,
        current: 1,
        pageSize: 10,
      },
    }, () => { this.getList() })
  }
  // 发票选择
  onInvoiceChange = (value) => {
    this.setState({
      paper_elec: value, pager: { page_size: 10, page_num: 1 }, pagination: {
        showSizeChanger: true,
        current: 1,
        pageSize: 10,
      },
    }, () => { this.getList() })
  }
  // 状态
  onStateChange = (value) => {
    this.setState({
      status: value, pager: { page_size: 10, page_num: 1 }, pagination: {
        showSizeChanger: true,
        current: 1,
        pageSize: 10,
      },
    }, () => { this.getList() })
  }
  // 审核弹窗切换
  ModalCancel = () => {
    this.setState({ visibleModal: !this.state.visibleModal })
  }
  // 确定审核
  onSignupReview = () => {
    const { invoice_id } = this.state
    message.info('审核' + invoice_id)
    putReview({ invoice_id }).then((res) => {
      // 为空退出
      if (!res) return
      if (res.code === apiCode()) {
        message.info(res.msg)
        this.ModalCancel()
        this.getList()
      } else {
        let _msg = res.msg || '服务器错误'
        message.info('错误：' + _msg)
      }
    })
  }
  // 关闭抽屉
  onDrawerClose = () => {
    this.setState({ visibleMyDrawer: !this.state.visibleMyDrawer })
  }
  // 更新数据
  onRenewInvoice = () => {
    this.onDrawerClose()
    // 重置内容
    this.onReset()
  }
  // 导出发票申请表
  toInvoiceExport = () => {
    let { default_key_lists, paper_elec, status } = this.state
    let { course_id } = this.props
    course_id = course_id || getUrlID()
    exportAPI('post_export_invoice', { course_id, paper_elec, status, key_lists: default_key_lists }, '发票信息', 'xls')
  }
  render() {
    const { dataSource, columns, pagination, search, paper_elec, status, invoiceData, visibleMyDrawer, scrollX } = this.state
    return (
      <div className='Invoice'>
        <div className='search mb15'>
          <Search className='input' placeholder="输入订单编号或者发票抬头" style={{ width: 300 }} onChange={this.setSearch} onBlur={this.inputOnBlur} value={search} onSearch={value => this.onSearch(value)} enterButton />
          {/* <Button type="primary" className='ml15' icon="search" onClick={this.onSearch}>搜索</Button> */}
          <Button className='ml15' onClick={this.onReset} icon="reload">重置</Button>
          <Button type="primary" className='ml15' onClick={this.onDrawerClose}>新建发票</Button>
          <Button type="primary" className='ml15' onClick={this.toInvoiceExport}>导出发票</Button>
          <br />
          <br />
          <MyRadio label={'发票材质：'} itemLits={paper_elec_state} onChange={this.onInvoiceChange} defaultValue={paper_elec} />
          <MyRadio label={'状态：'} itemLits={status_state} onChange={this.onStateChange} defaultValue={status} />
        </div>
        {/* scroll={{ x: 2700 }} */}
        <Table scroll={{ x: scrollX }} className='table' rowKey={record => record.invoice_num} dataSource={dataSource} columns={columns} onChange={this.handleTableChange} pagination={pagination} />
        {/* 显示审核 */}
        <Modal
          title="审核提示"
          width={300}
          centered
          visible={this.state.visibleModal}
          onOk={this.onSignupReview}
          onCancel={this.ModalCancel}>
          <p>是否通过审核</p>
        </Modal>
        {/* 查看 */}
        <Modal
          width={700}
          centered
          footer={null}
          onCancel={this.hideCheck}
          visible={this.state.visibleCheck}>
          {invoiceData && <Row gutter={2} style={{ fontSize: '16px' }}>
            <Col span={24} ><p className="txc" style={{ fontSize: '18px' }}>中国儿童中心开具增值税专用发票所需信息</p></Col>
            <Col span={24} ><p>部门：师资培训部</p></Col>
            <Col span={24} ><p>付款单位信息</p></Col>
            <Col span={24} >
              <Col span={6} className="txc" >单位名称</Col>
              <Col span={18} >
                {invoiceData.title}
              </Col>
            </Col>
            <Col span={24} >
              <Col span={6} className="txc" >税务登记证号</Col>
              <Col span={18} >
                {invoiceData.tax_number}
              </Col>
            </Col>
            <Col span={24} >
              <Col span={6} className="txc" >地址及电话</Col>
              <Col span={18} >
                {invoiceData.addr_tel}
              </Col>
            </Col>
            <Col span={24} >
              <Col span={6} className="txc" >开户行及账号</Col>
              <Col span={18} >
                {invoiceData.bank_account}
              </Col>
            </Col>
            <Col span={24} >
              <Col span={6} className="txc" >发票内容</Col>
              <Col span={18} >
                {invoiceContent[invoiceData.invoice_content]}
              </Col>
            </Col>
            <Col span={24} >
              <Col span={6} className="txc" >开票金额</Col>
              <Col span={12} >（大写） {invoiceData.amountDX}</Col>
              <Col span={6} className="txc" >（小写）￥{invoiceData.amount}</Col>
            </Col>
          </Row>}
        </Modal>
        {/* 新建 */}
        <MyDrawer onDrawerClose={this.onDrawerClose} titleText='新建发票' drawerWidt={800} visible={visibleMyDrawer}>
          {/* 新建表单 */}
          <NewInvoice onRenew={this.onRenewInvoice} courseData={this.props.courseData} />
        </MyDrawer>
      </div>
    )
  }
}

export default Invoice;