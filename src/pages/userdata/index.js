/*
 * @Author: yuanhang 
 * @Date: 2019-10-14 11:03:08 
 * @Last Modified by: yuanhang
 * @Last Modified time: 2020-05-13 15:33:04
 */
import React, { Component } from 'react';
// 工具类
import { numFormat } from '../../utils/utils'
// api
import { apiCode, getManagerData } from '../../api/index'
// 引入自定义 ECharts组件
import MyEcharts from '../../components/myEcharts/myEcharts'
// 布局
import Layouts from '../../components/layouts/index'
// 引入
import { DatePicker, Button, Card, Col, Row, message } from 'antd'
import moment from 'moment'
import 'moment/locale/zh-cn'
moment.locale('zh-cn')
const { RangePicker } = DatePicker

class UserData extends Component {
  state = {
    dataKey: null,
    CardKey: null,
    chartOption: null,

    start: null,
    end: null,
    info_type: null,
    manager_data: null,
  }
  componentDidMount() {
    this.getData()
  }
  // 更换表图数据
  otEC = (val) => {
    let { chartOption } = this.state
    let _chartOption = { ...chartOption }
    switch (val) {
      case 'total_user':
        _chartOption.title = "累计用户"
        break;
      case 'daily_new':
        _chartOption.title = "每日新增"
        break;
      case 'daily_active':
        _chartOption.title = "日活跃用户"
        break;
      case 'monthly_active':
        _chartOption.title = "月活跃用户"
        break;
      default:
        break;
    }
    this.setState({ chartOption: _chartOption, CardKey: val, start: null, end: null }, () => {
      this.getData(val)
    })
  }
  // 重置
  showDrawer = () => {
    this.setState({
      start: null,
      end: null,
      info_type: null,
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
  getData = (info) => {
    let { start, end, info_type, chartOption } = this.state
    info_type = info || info_type
    getManagerData({ start, end, info_type }).then((res) => {
      // 为空退出
      if (!res) return
      if (res.code === apiCode()) {
        let _chartOption = { ...chartOption }
        let _data = {
          title: _chartOption.title || '累计用户',
          Axis: this.formatAxis(res.data.dates),
          series: res.data.numbers,
        }
        let timestamp = new Date().getTime()
        this.setState({ manager_data: res.data, chartOption: null, dataKey: 'MyEcharts' + timestamp }, () => {
          this.setState({ chartOption: _data, })
        })
      } else {
        let _msg = res.msg || '服务器错误'
        message.info('错误：' + _msg)
      }
    })
  }
  formatAxis = (dates) => {
    const { CardKey } = this.state
    if (CardKey === 'monthly_active') {
      dates = dates.map(item => {
        let _array = item.split('-')
        return (_array[0] + '-' + _array[1])
      })
    }
    return dates
  }
  // 不可选日期
  disabledDate = (current) => {
    return current > moment()
  }
  render() {
    const { dataKey, chartOption, manager_data, start, end } = this.state
    let _range_start = start ? moment(start, "YYYY-MM-DD") : null
    let _range_end = end ? moment(end, "YYYY-MM-DD") : null
    return (
      <Layouts pathname={this.props}>
        <Row gutter={24} className='mb30'>
          <Col span={6}>
            <Card title="累计用户" onClick={this.otEC.bind(this, 'total_user')} className='pointer'>
              {manager_data && <span>{numFormat(manager_data.total_user)}</span>}
            </Card>
          </Col>
          <Col span={6}>
            <Card title="每日新增" onClick={this.otEC.bind(this, 'daily_new')} className='pointer'>
              {manager_data && <span>{numFormat(manager_data.daily_new)}</span>}
            </Card>
          </Col>
          <Col span={6}>
            <Card title="日活跃用户" onClick={this.otEC.bind(this, 'daily_active')} className='pointer'>
              {manager_data && <span>{numFormat(manager_data.daily_active)}</span>}
            </Card>
          </Col>
          <Col span={6}>
            <Card title="月活跃用户" onClick={this.otEC.bind(this, 'monthly_active')} className='pointer'>
              {manager_data && <span>{numFormat(manager_data.monthly_active)}</span>}
            </Card>
          </Col>
        </Row>
        <Row gutter={24} className='mb30'>
          <Col span={24}>
            <span className='mr15'>起止时间</span>
            <RangePicker
              getCalendarContainer={triggerNode => triggerNode.parentNode}
              format={"YYYY-MM-DD"}
              value={[_range_start, _range_end]}
              disabledDate={this.disabledDate}
              onChange={this.onChange}
            />
            <Button style={{ marginLeft: '15px' }} onClick={this.showDrawer} icon="reload">重新统计</Button>
          </Col>
        </Row>
        {chartOption && <MyEcharts dataKey={dataKey} chartOption={chartOption} ECwidth={1000} />}
      </Layouts>
    );
  }
}

export default UserData;