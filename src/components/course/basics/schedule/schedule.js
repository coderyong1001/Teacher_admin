/*
 * @Author: yuanhang 
 * @Date: 2019-11-05 17:24:56 
 * @Last Modified by: yuanhang
 * @Last Modified time: 2020-05-14 10:54:10
 */
// 日程管理
import React, { Component } from 'react';
// 配置列表
import DisposeList from './disposeList/disposeList'
// 全局弹窗抽屉
import MyDrawer from '../../../myDrawer/myDrawer'
// 地点表单
import PlaceForm from '../placeForm/placeForm'
// api
import { apiCode, getCoursePlace } from '../../../../api/index'
// 工具类
import { getPanel, dyaTimes } from '../../../../utils/utils'
// 组件
import { Button, Row, Col, DatePicker, Collapse, message } from 'antd';
import MyImgUpload from '../../../../components/myImgUpload/myImgUpload'
// 日期
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');
const dateFormat = 'YYYY-MM-DD';
// 手风琴组件
const { Panel } = Collapse;
const { RangePicker } = DatePicker;

class Schedule extends Component {
  state = {
    coursePlace: [], // 地点
    range_start: null,
    range_end: null,
    detail: null,
    addDate: null,
    schedule_pic: ''
  }
  static defaultProps = {
    onScheduleData: () => console.log('Schedule组件回调函数')
  }
  componentDidMount() {
    const { schedule, schedule_pic, range_start, range_end } = this.props
    if (!schedule) { return }
    this.setState({
      range_start: schedule.range_start? schedule.range_start: range_start || '',
      range_end: schedule.range_end? schedule.range_end: range_end || '',
      detail: schedule.detail,
      schedule_pic: schedule.schedule_pic? schedule.schedule_pic: schedule_pic || ''
    })
  }
  UNSAFE_componentWillReceiveProps(nextProps) {
    const { schedule } = nextProps
    if (!schedule) { return }
    this.setState({
      range_start: schedule.range_start,
      range_end: schedule.range_end,
      detail: schedule.detail,
    })
  }
  // 地点列表
  toGetList = () => {
    // 地点列表
    getCoursePlace().then((res) => {
      // 为空退出
      if (!res) return
      if (res.code === apiCode()) {
        if (res.data && res.data.length > 0) {
          this.setState({
            coursePlace: res.data
          }, () => {
          })
        }
      } else {
        let _msg = res.msg || '服务器错误'
        message.info('错误：' + _msg)
      }
    })
  }
  // 日期范围
  dateRange = (date, dateString) => {
    this.setState({ range_start: dateString[0], range_end: dateString[1], detail: null })
  }
  // 选择添加日程日期
  onToAddDate = (dates, dateStrings) => {
    let { range_start, range_end } = this.state
    // 判断起止时间
    if (!range_start || !range_end) {
      message.info('请选择起止时间')
      this.setState({ addDate: null })
      return
    }
    // 判断是否超出范围
    if (((new Date(dateStrings)).getTime() < (new Date(range_start)).getTime()) || ((new Date(dateStrings)).getTime() > (new Date(range_end)).getTime())) {
      message.info('超出选择范围')
      this.setState({ addDate: null })
      return
    }
    this.setState({ addDate: dateStrings })
  }
  // 添加日程
  onToAdd = () => {
    let { range_start, range_end } = this.state
    // 判断起止时间
    if (!range_start || !range_end) {
      message.info('请选择起止时间')
      this.setState({ addDate: null })
      return
    }
    let { addDate, detail } = this.state
    if (!addDate) {
      message.info('请选要添加日程时间')
      return
    }
    // 为空直接加入
    if (!detail || detail.length === 0) {
      this.setState({ detail: [getPanel(addDate)] })
      return
    }
    // 有值判断 1是否包含 2确定index
    let _index = null

    // 是否包含
    detail.forEach((item, index) => {
      if (item.course_date === addDate) {
        _index = index
        return false
      }
    })
    // 不包含 确定顺序
    if (_index !== 0 && !_index) {
      let _afterIndex = null
      detail.forEach((item, index) => {
        if ((new Date(item.course_date)).getTime() > (new Date(addDate)).getTime()) {
          if (_afterIndex || _afterIndex === 0) {
            return
          }
          _afterIndex = index
        }
      })
      if (_afterIndex !== 0 && !_afterIndex) {
        let _detail = [...detail]
        let _data = getPanel(addDate)
        _detail.push(_data)
        this.setState({ detail: _detail })
        return
      }
      let _detail = [...detail]
      let _data = getPanel(addDate)
      _detail.splice(_afterIndex, 0, _data)
      this.setState({ detail: _detail })
      return
    }
    message.info('已添加' + addDate + '当天日程')
  }
  // 删除
  onDelete = (index) => {
    const { detail } = this.state
    let _detail = [...detail]
    _detail.splice(index, 1)
    this.setState({
      detail: _detail,
    })
  }
  // 添加数据
  onDyaItem = (index) => {
    let _data = dyaTimes;
    const { detail } = this.state
    let _detail = detail
    _detail[index].day_times.push(_data)
    this.setState({
      detail: _detail,
    })
  }
  // 更新日程
  onDyaRenew = (data, index, dayIndex) => {
    const { detail } = this.state
    let _detail = detail
    _detail[index].day_times[dayIndex] = data
    this.setState({
      detail: _detail,
    })
  }
  // 删除
  onDyaDanger = (index, dayIndex) => {
    const { detail } = this.state
    let _detail = detail
    _detail[index].day_times.splice(dayIndex, 1)
    this.setState({
      detail: _detail,
    })
  }
  // 上传图片返回值
  onGetImgDate = (data, key) => {
    this.setState({
      [key]: data.file_url || ''
    })
    // this.props.onChange(data.file_url, key)
  }
  // 提交
  onSubmit = () => {
    const { onScheduleData } = this.props
    const { detail, range_start, range_end, schedule_pic } = this.state
    let _obj = null
    let _istime = true
    let tips = null
    if (detail) {
      detail.forEach(son => {
        son.day_times.forEach(item => {
          if (!item.start_time) {
            tips = son.course_date + '  开始时间未填'
            return _istime = false
          }
          if (!item.end_time) {
            tips = son.course_date + '  结束时间未填'
            return _istime = false
          }
        })
      })
    }
    if (!_istime) {
      message.warning(tips)
      return
    }
    if (!range_start || !range_end){
      message.warning('请选择起止时间！')
      return
    }
    if ((!detail || detail.length === 0) && !schedule_pic){
      message.warning('请添加日程或上传图片！')
      return
    }
    if (_istime) {
      _obj = { detail, range_start, range_end, schedule_pic }
    }
    onScheduleData(_obj)
  }
  // 添加日程限制范围
  disabledDate = (current) => {
    const { range_start, range_end } = this.state
    return current < moment(new Date(range_start + ' 00:00:00')) || current > moment(new Date(range_end + ' 23:59:59'))
  }
  render() {
    const { detail, range_start, range_end, addDate, coursePlace, schedule_pic } = this.state
    let _range_start = range_start ? moment(range_start, dateFormat) : null
    let _range_end = range_end ? moment(range_end, dateFormat) : null
    let _addDate = addDate ? moment(addDate, dateFormat) : null
    const { course_type } = this.props;

    return (
      <div>
        <Row gutter={24}>
          <Col span={24}>
            <span className='mr15 importantSign'>起止时间</span>
            <RangePicker getCalendarContainer={triggerNode => triggerNode.parentNode} format={dateFormat} onChange={this.dateRange} value={[_range_start, _range_end]} />
            <br />
            <br />
          </Col>
          <Col span={24}>
            <span className='mr15'>添加日程</span>
            <DatePicker onChange={this.onToAddDate} value={_addDate} disabledDate={this.disabledDate} />
            <Button className='ml15 mr15' onClick={this.onToAdd} icon="plus">添加</Button>
            {/* 通用抽屉弹窗 */}
            <MyDrawer key='location' icon="setting" btnText='地点管理' titleText='地点管理' drawerWidt={700}>
              {/* 地点选择组件 */}
              <PlaceForm coursePlace={coursePlace} onGetList={this.toGetList} isLocation={true} />
            </MyDrawer>
            <br />
            <br />
          </Col>
          <Col span={24}>
            {detail && detail.length > 0 && <Collapse accordion>
              {detail && detail.length > 0 && detail.map((item, index) => {
                return <Panel header={item.course_date} key={'schedule_' + index}>
                  {/* 配置列表 */}
                  {item.day_times && item.day_times.map((dya, dayIndex) => {
                    return <DisposeList course_type={course_type} dyaData={dya} dayIndex={dayIndex} courseDate={item.course_date} panelIndex={index} key={'dya' + item.course_date} onDyaRenew={this.onDyaRenew} onDyaDanger={this.onDyaDanger} />
                  })}
                  <Button className='mr15' type="danger" onClick={this.onDelete.bind(this, index)}>删除当天</Button>
                  <Button onClick={this.onDyaItem.bind(this, index)} icon="plus">添加</Button>
                </Panel>
              })}
            </Collapse>}
          </Col>
          <Col span={24} style={{paddingTop : '20px'}}>
            <span className='mr15'>上传图片</span>
            <MyImgUpload onReturnDate={value => this.onGetImgDate(value, 'schedule_pic')} fileUrl={schedule_pic} />
            <br />
            <br />
          </Col>
          {/* {((detail && detail.length > 0) || schedule_pic) && <Col span={24}> */}
          {<Col span={24}>
            <br />
            <br />
            <br />
            <div style={{ width: '100%', textAlign: 'center' }}>
              <Button type="primary" onClick={this.onSubmit}>提交</Button>
            </div>
          </Col>}
        </Row>
      </div>
    );
  }
}

export default Schedule;