/*
 * @Author: yuanhang 
 * @Date: 2019-10-31 15:39:05 
 * @Last Modified by: yuanhang
 * @Last Modified time: 2020-03-10 17:46:10
 */
// 报名订单列表
import React, { Component } from 'react';
// 引入css
import './index.css'
// 封装单选项
import MyRadio from '../../../radio/index'
// api
import { apiCode, getOrderList, getOStatistics, exportAPI, getOrderListMulti, postMultiReview } from '../../../../api/index'
// utils
import { getUrlID } from '../../../../utils/utils'
// 列表表格
import ListTable from '../listTable/listTable'
// 全局弹窗抽屉
import MyDrawer from '../../../myDrawer/myDrawer'
// 导出桌牌
import ExportCard from '../exportCard/exportCard'
// 导入组件
import { Tooltip, Row, Col, message, Input, Button, Pagination, Modal, Tag } from 'antd'
const { Search } = Input

let paymentMethod = [
  { value: -1, label: '全部' },
  { value: 0, label: '线上支付' },
  { value: 1, label: '线下支付（其他支付）' },
]

let paymentStatus = [
  { value: -1, label: '全部' },
  { value: 0, label: '已支付(已审核)' },
  { value: 1, label: '待支付（待审核）' },
  { value: 2, label: '订单取消' },
  { value: 3, label: '申请退款' },
  { value: 4, label: '已退款' },
]

class EntryList extends Component {
  state = {
    course_id: null,
    statistics: null,
    pager: { page_size: 10, page_num: 1 },
    pager_count: 0,
    search: null,
    payment_status: null,
    payment_method: null,
    dataList: [],
    toMulti: false, // 判断是否批量审核
    ordersRecord: {},  // 批量审核订单id
    orders: [],  // 批量审核订单id
    loading: {},
    visibleExportCard: false,
  }
  static defaultProps = {
    course_id: null,
  }
  componentDidMount() {
    let { course_id } = this.props
    course_id = course_id || getUrlID()
    this.setState({ course_id }, () => {
      this.getList({ course_id: course_id })
      this.toStatistics({ course_id: course_id })
    })
  }
  // 获取数据
  getList = (data) => {
    const { pager, course_id, search, payment_status, payment_method, toMulti } = this.state
    data = data || { course_id, search, payment_status, payment_method }
    Object.assign(data, pager)
    // 判断 批量审核状态 切换API  getOrderListMulti是批量审核列表接口  getOrderList是正常订单接口
    let ApiObject = toMulti ? getOrderListMulti : getOrderList
    // 如果是批量删除 筛选项
    if (toMulti) {
      delete data.search
    }
    this.setLoading('ListTable')
    ApiObject(data).then(res => {
      // 为空退出
      if (!res) return
      if (res.code === apiCode()) {
        let _pager = {
          page_size: res.data.pager.page_size,
          page_num: res.data.pager.page_num
        }
        this.setState({ dataList: res.data.list, pager: _pager, pager_count: res.data.pager.count })

        this.cutLoading('ListTable')
      } else {
        this.cutLoading('ListTable')
        let _msg = res.msg || '服务器错误'
        message.info('错误：' + _msg)
      }
    })
  }
  // 获取数据
  toStatistics = (data) => {
    getOStatistics(data).then(res => {
      // 为空退出
      if (!res) return
      if (res.code === apiCode()) {
        this.setState({ statistics: res.data })
      } else {
        let _msg = res.msg || '服务器错误'
        message.info('错误：' + _msg)
      }
    })
  }
  // 搜索
  setSearch = (e) => {
    this.setState({ search: e.target.value })
  }
  // 搜索
  onSearch = () => {
    // 先取消批量状态
    this.setState({ toMulti: false, pager: { page_size: 10, page_num: 1 } }, () => {
      this.getList()
    })
  }
  // 支付状态
  setPaymentStatus = (value) => {
    this.setState({ pager: { page_size: 10, page_num: 1 }, payment_status: value, toMulti: false }, () => { this.getList() })
  }
  // 支付方式
  setPaymentMethod = (value) => {
    this.setState({ pager: { page_size: 10, page_num: 1 }, payment_method: value, toMulti: false }, () => { this.getList() })
  }
  // 重置
  onReset = (e, isMulti) => {
    // 判断批量
    this.setState({
      toMulti: isMulti || false,
      search: null,
      payment_status: null,
      payment_method: null,
      ordersRecord: {},
      orders: [],
      pager: { page_size: 10, page_num: 1 },
    }, () => { this.getList() })
  }
  // 翻页
  onPaginationChange = (page, pageSize) => {
    let _page = { ...this.state.pager }
    _page.page_num = page
    _page.page_size = pageSize
    this.setState({ pager: _page }, () => { this.getList() })
  }
  // 设置每页条数
  onShowSizeChange = (current, pageSize) => {
    let _page = { ...this.state.pager }
    _page.page_num = 1
    _page.page_size = pageSize
    this.setState({ pager: _page }, () => { this.getList() })
  }
  // 导出订单
  toOrderListExport = () => {
    let { course_id } = this.props
    course_id = course_id || getUrlID()
    // token
    const token = localStorage.getItem("token")
    exportAPI('get_export_order_list', { course_id, token }, '订单信息表', 'xls')
  }
  // 关闭抽屉
  onDrawerExportCard = () => {
    this.setState({ visibleExportCard: !this.state.visibleExportCard })
  }
  // 获取审核订单
  toOrderListMulti = () => {
    // 增加批量状态 接口拿值还是 getList
    this.onReset(null, true)
  }
  // 设置loading  automatic 自动停止
  setLoading = (type, automatic) => {
    let { loading } = this.state
    loading[type] = true
    this.setState({ loading }, () => {
      if (!automatic) { return }
      setTimeout(() => {
        loading[type] = false
        this.setState({ loading })
      }, 300)
    })
  }
  cutLoading = (type) => {
    let { loading } = this.state
    loading[type] = false
    this.setState({ loading })
  }
  // 获取批量审核id 
  onMulti = (checked, record) => {
    let { ordersRecord } = this.state
    if (checked) {
      ordersRecord[record.order_id] = record
    } else {
      delete ordersRecord[record.order_id]
    }
    let orders = Object.keys(ordersRecord)
    this.setState({ ordersRecord, orders })
  }
  // 重置
  toMultiReset = () => {
    this.setState({ ordersRecord: {}, orders: [] })
    this.setLoading('multiReset', true)
    this.setLoading('ListTable', true)
  }
  // 全选
  toAllMulti = () => {
    let { dataList } = this.state
    let ordersRecord = {}
    dataList.forEach((item) => {
      ordersRecord[item.order_id] = item
    })
    let orders = Object.keys(ordersRecord)
    this.setState({ ordersRecord, orders })
    this.setLoading('allMulti', true)
    this.setLoading('ListTable', true)
  }
  // 批量审核
  toMultiReview = () => {
    const { ordersRecord } = this.state
    let vm = this
    if (Object.keys(ordersRecord).length === 0) {
      return Modal.info({ icon: false, title: '确定审核', content: '请选择订单' })
    }
    let _width = Object.keys(ordersRecord).length > 1 ? 650 : 350
    let _span = Object.keys(ordersRecord).length > 1 ? 12 : 24
    Modal.confirm({
      icon: false,
      title: '确定审核',
      width: _width,
      centered: true,
      okText: '确认',
      content: <Row gutter={12}>
        {ordersRecord && Object.keys(ordersRecord).map(key => {
          return <Col span={_span} key={key}><Tag color="blue">订单号：{ordersRecord[key].order_number} ； 付款人：{ordersRecord[key].pay_user}</Tag>
          </Col>
        })}
      </Row>,
      onOk() {
        vm.goMultiReview()
      },
      onCancel() { },
    })
  }
  goMultiReview = () => {
    let { course_id } = this.props
    course_id = course_id || getUrlID()
    const { orders } = this.state
    postMultiReview({ orders, course_id }).then(res => {
      // 为空退出
      if (!res) return
      if (res.code === apiCode()) {
        message.info('批量审核成功')
        // 重新获取批量审核列表
        this.toOrderListMulti()
      } else {
        this.setLoading('ListTable', true)
        let _msg = res.msg || '服务器错误'
        message.info('错误：' + _msg)
      }
    })
  }
  render() {
    let { search, payment_status, payment_method, dataList, pager, pager_count, statistics, toMulti, ordersRecord, loading, visibleExportCard, course_id } = this.state

    return (
      <div className='EntryList'>
        <Row gutter={24}>
          <Col span={16}>
            <Search className='input' placeholder="输入订单编号或者姓名" style={{ width: 300 }} onChange={this.setSearch} value={search} onSearch={value => this.onSearch(value)} enterButton />
            {/* <Button className='ml15' icon="search" onClick={this.onSearch}>搜索</Button> */}
            <Button className='ml15' icon="reload" onClick={this.onReset} >重置</Button>
            <br />
            <MyRadio label={'支付方式：'} itemLits={paymentMethod} onChange={this.setPaymentMethod} defaultValue={payment_method} />
            <MyRadio label={'支付状态：'} itemLits={paymentStatus} onChange={this.setPaymentStatus} defaultValue={payment_status} />
          </Col>
          {/* <Col span={16}>
          </Col> */}
          <Col span={8}>
            <Col className='txr mb10' span={24}>
              <Button onClick={this.onDrawerExportCard} icon="download">导出桌牌</Button>
              <Button className='ml15' onClick={this.toOrderListExport} icon="download">导出订单</Button>
            </Col>
            <br />
            <Col className='txr mb10' span={24}>
              {toMulti && <Button type="danger" className='ml15' onClick={this.onReset}>取消</Button>}
              {toMulti && <Button type="primary" className='ml15' onClick={this.toMultiReview}>确定审核</Button>}
              {!toMulti && <Button type="primary" className='ml15' onClick={this.toOrderListMulti}>批量审核</Button>}
            </Col>
            {toMulti && <Col className='txr mb10' span={24}>
              <Tooltip placement="bottom" title='只全选当前页的数据内容'>
                <Button className='ml15' onClick={this.toAllMulti} loading={loading.allMulti} icon="check">全选</Button>
              </Tooltip>
              <Tooltip placement="bottom" title='清空批量选择状态，不改变翻页'>
                <Button className='ml15' onClick={this.toMultiReset} loading={loading.multiReset} icon="delete">清空</Button>
              </Tooltip>
            </Col>}
          </Col>
        </Row>
        {/* 列表表格 */}
        {
          dataList && dataList.map((item, index) => {
            return <ListTable loading={loading.ListTable} showHeader={index === 0} key={item.order_id} dataList={item} onRenew={this.getList} onMulti={this.onMulti} showMulti={toMulti} selectMulti={ordersRecord[item.order_id]} />
          })
        }
        <br />
        <br />
        <Row gutter={24}>
          <Col span={12}>
            {statistics && <div className='statistics'>
              <span>订单数量：{statistics.total_no}</span>
              <span>已支付订单：{statistics.paid_no}</span>
              <span>退款订单：{statistics.refund_no}</span>
              <span>总订单金额：¥{statistics.total_amount}</span>
              <span>实际收入：¥{statistics.real_revenue}</span>
              <span>减免累计：¥{statistics.discount_amount}</span>
              <span>退款累计：¥{statistics.refund_amount}</span>
              <span>总订单人数：{statistics.total_people}</span>
              <span>成功报名人数：{statistics.success_people}</span>
              <span>退款人数：{statistics.refund_people}</span>
            </div>}
          </Col>
          <Col span={12}>
            {/* 翻页 */}
            <Pagination
              className="txr"
              showSizeChanger
              onShowSizeChange={this.onShowSizeChange}
              onChange={this.onPaginationChange}
              current={pager.page_num}
              total={pager_count}
            />
          </Col>
        </Row>
        {/* 导出桌牌 */}
        <MyDrawer onDrawerClose={this.onDrawerExportCard} titleText='导出桌牌' drawerWidt={580} visible={visibleExportCard}>
          <ExportCard course_id={course_id} />
        </MyDrawer>
      </div >
    );
  }
}

export default EntryList;