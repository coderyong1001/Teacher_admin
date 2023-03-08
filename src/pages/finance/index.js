/*
 * @Author: yuanhang 
 * @Date: 2019-10-14 11:03:08 
 * @Last Modified by: yuanhang
 * @Last Modified time: 2020-05-07 14:43:42
 */
// 财务统计
import React, { Component } from 'react'
// 引入公共类
import { numFormat } from '../../utils/utils'

// api
import { apiCode, getFinance, getFinanceCourses, postFinanceSumInfo, postFinanceCharts, exportAPI } from '../../api/index'
// 布局
import Layouts from '../../components/layouts/index'

import { DatePicker, Button, message, Row, Col, Card, Select, Table } from 'antd'
import moment from 'moment'
import 'moment/locale/zh-cn'
moment.locale('zh-cn')
const { Option } = Select
const { RangePicker } = DatePicker
const { Column, ColumnGroup } = Table

const categoryOption = [{ value: -1, label: '全部' }, { value: 1, label: '培训' }, { value: 2, label: '会议' }, { value: 3, label: '活动' }]

class Finance extends Component {
  state = {
    start: null,
    end: null,
    finance: null,

    courses_start: null,
    courses_end: null,
    category: -1,
    coursesList: null,
    listData: [],

    financeCharts: null,
    financeSumInfo: null,
  }
  componentDidMount() {
    this.getData()
  }
  // 重置
  showDrawer = () => {
    this.setState({
      start: null,
      end: null,
    }, () => { this.getData() })
  }
  // 日期选择
  onChange = (dates, dateStrings) => {
    this.setState({
      start: dateStrings[0] ? dateStrings[0] + ' 00:00:00' : null,
      end: dateStrings[1] ? dateStrings[1] + ' 23:59:59' : null,
    }, () => { this.getData() })
  }
  // 获取数据
  getData = () => {
    let { start, end } = this.state
    getFinance({ start, end }).then((res) => {
      // 为空退出
      if (!res) return
      if (res.code === apiCode()) {
        this.setState({ finance: res.data })
      } else {
        let _msg = res.msg || '服务器错误'
        message.info('错误：' + _msg)
      }
    })
  }
  // 财务详表范围选择
  onFinanceChange = (dates, dateStrings) => {
    this.setState({
      courses_start: dateStrings[0] ? `${dateStrings[0]} 00:00:00` : null,
      courses_end: dateStrings[1] ? `${dateStrings[1]} 23:59:59` : null,
    }, () => { this.getcourses() })
  }
  // 课程类别选择
  onCategoryChange = (value) => {
    this.setState({ category: value }, () => { this.getcourses() })
  }
  // 获取财务统计(课程)
  getcourses = () => {
    let { courses_start, courses_end, category } = this.state
    this.setState({ coursesList: null, listData: [], financeCharts: [] })
    // 为空退出
    if ((!courses_start && !courses_end) || !category) {
      return
    }
    getFinanceCourses({ start: courses_start, end: courses_end, category }).then((res) => {
      // 为空退出
      if (!res) return
      if (res.code === apiCode()) {
        this.setState({ coursesList: res.data })
      } else {
        let _msg = res.msg || '服务器错误'
        message.info('错误：' + _msg)
      }
    })
  }
  // 课程选择
  onListDataChange = (value) => {
    this.setState({ listData: value })
  }
  // 确定生成
  toCreate = () => {
    let { listData } = this.state
    if (!listData || listData.length === 0) { return }
    let data = { courses: listData }

    postFinanceCharts(data).then((res) => {
      // 为空退出
      if (!res) return
      if (res.code === apiCode()) {
        // 设置ID
        if (res.data && res.data.length > 0) {
          res.data = res.data.map((item, index) => {
            item.recordId = index
            return item
          })
        }
        this.setState({ financeCharts: res.data })
      } else {
        let _msg = res.msg || '服务器错误'
        message.info('错误：' + _msg)
      }
    })
    postFinanceSumInfo(data).then((res) => {
      // 为空退出
      if (!res) return
      if (res.code === apiCode()) {
        this.setState({ financeSumInfo: res.data })
      } else {
        let _msg = res.msg || '服务器错误'
        message.info('错误：' + _msg)
      }
    })
  }
  // 导出
  toExport = () => {
    let { courses_start, courses_end, listData } = this.state
    // 为空退出
    if ((!courses_start && !courses_end) || (!listData || listData.length === 0)) {
      return
    }
    exportAPI('post_export_finance', { start: courses_start, end: courses_end, courses: listData }, '财务详表', 'xls')
  }
  disabledDate = (current) => {
    return current > moment().endOf('day');
  }
  render() {
    let { finance, start, end, category, coursesList, listData, financeSumInfo, financeCharts } = this.state
    let _range_start = start ? moment(start, 'YYYY-MM-DD') : null
    let _range_end = end ? moment(end, 'YYYY-MM-DD') : null
    let _obj = {};
    // 判断汇总合并
    let length = financeCharts ? financeCharts.length : 0
    let temp = []
    if (financeCharts && financeCharts.length > 0 && financeSumInfo) {
      _obj = {
        name: '汇总',
        category: '汇总',
        recordId: length,
        applicant_nums: financeSumInfo.sum_applicant_nums,
        refund_nums: financeSumInfo.sum_refund_nums,
        real_nums: financeSumInfo.sum_real_nums,
        total_amount: financeSumInfo.sum_total_amount,
        refund_amount: financeSumInfo.sum_refund_amount,
        discount_amount: financeSumInfo.sum_discount_amount,
        real_revenue: financeSumInfo.sum_real_revenue,
      }
      let is_obj = true
      financeCharts.forEach(item => {
        if (item.name === '汇总') {
          is_obj = false
        }
      })
      if (is_obj) {
        temp.push(_obj)
        length = temp ? temp.length : 0
      }
    }
    if (financeCharts && financeCharts.length) {
      temp.push(...financeCharts)
    }
    const dataSource = temp

    return (
      <Layouts pathname={this.props}>
        <div className='Finance'>
          <span className='mr15'>起止时间</span>
          <RangePicker
            getCalendarContainer={triggerNode => triggerNode.parentNode}
            format="YYYY-MM-DD"
            value={[_range_start, _range_end]}
            onChange={this.onChange}
          />
          <Button style={{ marginLeft: '15px' }} onClick={this.showDrawer} icon="reload">重新统计</Button>
          <br />
          <br />
          {finance && <Row gutter={30}>
            <Col span={8}>
              <Card className='tag-cyan'>
                <p className='txc' style={{ fontSize: '16px' }}>课程数量</p>
                <p className='txc' style={{ fontSize: '24px' }}>{finance.course_nums ? numFormat(finance.course_nums) : 0}门</p>
              </Card>
            </Col>
            <Col span={8}>
              <Card className='tag-blue'>
                <p className='txc' style={{ fontSize: '16px' }}>总报名人次</p>
                <p className='txc' style={{ fontSize: '24px' }}>{finance.applicant_nums ? numFormat(finance.applicant_nums) : 0}人次</p>
              </Card>
            </Col>
            <Col span={8}>
              <Card className='tag-geekblue'>
                <p className='txc' style={{ fontSize: '16px' }}>订单总额</p>
                <p className='txc' style={{ fontSize: '24px' }}>￥ {finance.total_revenue ? numFormat(finance.total_revenue) : 0}</p>
              </Card>
            </Col>
            <Col span={24} className='mt30'></Col>
            <Col span={8}>
              <Card className='tag-blue'>
                <p className='txc' style={{ fontSize: '16px' }}>总退款</p>
                <p className='txc' style={{ fontSize: '24px' }}>￥ {finance.refund_amount ? numFormat(finance.refund_amount) : 0}</p>
              </Card>
            </Col>
            <Col span={8}>
              <Card className='tag-geekblue'>
                <p className='txc' style={{ fontSize: '16px' }}>总优惠</p>
                <p className='txc' style={{ fontSize: '24px' }}>￥ {finance.discount_amount ? numFormat(finance.discount_amount) : 0}</p>
              </Card>
            </Col>
            <Col span={8}>
              <Card className='tag-cyan'>
                <p className='txc' style={{ fontSize: '16px' }}>实际收入</p>
                <p className='txc' style={{ fontSize: '24px' }}>￥ {finance.real_revenue ? numFormat(finance.real_revenue) : 0}</p>
              </Card>
            </Col>
          </Row>}
          <Row gutter={24}>
            <Col span={24}>
              <br />
              <p style={{ fontSize: '24px' }}>财务详表</p>
              <span className='mr15'>时间范围</span>
              <RangePicker
                getCalendarContainer={triggerNode => triggerNode.parentNode}
                format="YYYY-MM-DD"
                disabledDate={this.disabledDate}
                onChange={this.onFinanceChange}
              />
              <span className='ml15 mr15'>课程类别选择</span>
              <Select value={category} onChange={this.onCategoryChange} style={{ width: 120 }}>
                {categoryOption && categoryOption.map(item => {
                  return <Option key={'categoryOption' + item.value} value={item.value}>{item.label}</Option>
                })}
              </Select>
              <Button className='ml15' type="primary" onClick={this.toCreate}>确定生成</Button>
              <Button className='ml15' onClick={this.toExport} icon="download">导出财务详情</Button>
            </Col>
            <Col span={24}>
              <br />
              <span className='mr15'>课程选择</span>
              <Select mode="multiple" value={listData} onChange={this.onListDataChange} style={{ width: 334 }}>
                {coursesList && coursesList.map(item => {
                  return <Option key={'coursesList' + item.id} value={item.id}>{item.name}</Option>
                })}
              </Select>
            </Col>
            <Col span={24}>
              <br />
              <Table rowKey={record => record.recordId} bordered pagination={false} dataSource={dataSource} >
                <Column title="课程名称" dataIndex="name" key="name" align='center' render={(value, row, index) => {
                  const obj = { children: value, props: {}, }
                  if (index === (length - 1)) { obj.props.colSpan = 2 }
                  return obj
                }} />
                <Column title="课程类别" dataIndex="category" key="category" align='center' render={(value, row, index) => {
                  const obj = { children: value, props: {}, }
                  if (index === (length - 1)) { obj.props.colSpan = 0 }
                  return obj
                }} />
                <ColumnGroup title="人次">
                  <Column title="报名人次" dataIndex="applicant_nums" key="applicant_nums" align='center' />
                  <Column title="退费人次" dataIndex="refund_nums" key="refund_nums" align='center' />
                  <Column title="实际参加人次" dataIndex="real_nums" key="real_nums" align='center' />
                </ColumnGroup>
                <ColumnGroup title="金额">
                  <Column title="订单总额" dataIndex="total_amount" key="total_amount" align='center' />
                  <Column title="退费总额" dataIndex="refund_amount" key="refund_amount" align='center' />
                  <Column title="优惠金额" dataIndex="discount_amount" key="discount_amount" align='center' />
                  <Column title="实际收入" dataIndex="real_revenue" key="real_revenue" align='center' />
                </ColumnGroup>
              </Table>

            </Col>
            <Col span={24}>
              <br />
            </Col>
          </Row>
        </div>
      </Layouts >
    );
  }
}

export default Finance;