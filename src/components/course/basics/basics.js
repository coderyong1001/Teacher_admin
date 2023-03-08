/*
 * @Author: yuanhang 
 * @Date: 2019-10-22 19:40:23 
 * @Last Modified by: yuanhang
 * @Last Modified time: 2020-05-21 15:41:09
 */
// 基础信息 新建与查看时复用
import React, { Component } from 'react'
// api
import { apiCode, getCoursePlace, getLocation } from '../../../api/index'
// 引入css
import './index.css'
// 工具类 renderForm 全局表单渲染
import { renderForm, formatDate } from '../../../utils/utils'
// 图片上传
import MyImgUpload from '../../../components/myImgUpload/myImgUpload'
// 文件上传
import MyFileUpload from '../../../components/myFileUpload/myFileUpload'
// 全局弹窗抽屉
import MyDrawer from '../../myDrawer/myDrawer'
// 联系方式
import Conference from './conference/conference'
// 地点表单
import PlaceForm from './placeForm/placeForm'
// 日程管理
import Schedule from './schedule/schedule'
// 表单配置
import FormDOM from '../../../utils/form_basics'
// 自定义富文本
// import MyTinyMCE from '../../myTinyMCE/myTinyMCE'
// 自定义富文本
import MyBraftEditor from '../../myBraftEditor/myBraftEditor'
// 组件
import { message, Row, Col, Form, Select, Input, Tag, Tooltip } from 'antd';
// 日期国际化配置
// import locale from 'antd/es/date-picker/locale/zh_CN';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');
// 选择器
const { Option } = Select;
const { TextArea } = Input;
let locationObj = {}

class Basics extends Component {
  state = {
    visibleMyDrawer: false,
    value: 1,
    coursePlace: [], // 地点

    schedule: null, // 日程数据
    day_times: [], // 日程数据

    conference: [], // 联系方式
    logo: null, // logo
    qr_code: null,
    reference: [], // 课程资料

    desc: '', // 富文本
    course_type: 2, // 默认线下
    basicsTinyMCE: 'basicsTinyMCE', // 富文本key
    schedule_pic: '', //日程图片
    range_start: '',
    range_end: '',
  }
  static defaultProps = {
    onRef: () => console.log('Basics组件回调函数'),
    onChange: () => console.log('Basics组件回调函数'),
  }
  componentDidMount() {
    this.props.onRef(this)
    this.toGetList()
    this.toLocation()
  }
  // 获取数据更新
  toUpdate = (data) => {
    this.setState({
      schedule: data.schedule, // 日程数据
      conference: data.conference, // 联系方式
      logo: data.logo, // logo
      qr_code: data.qr_code,
      reference: data.reference, // 课程资料
      schedule_pic: data.schedule.schedule_pic? data.schedule.schedule_pic: data.schedule_pic || '',
      range_start: data.schedule.range_start? data.schedule.range_start: data.range_start || '',
      range_end: data.schedule.range_end? data.schedule.range_end: data.range_end || '',
    })
    let _obj = {}
    FormDOM.forEach(item => {
      if (!data[item.key]) { return }
      let val = data[item.key]
      if (item.type === 'datePicker') {
        val = moment(data[item.key], 'YYYY-MM-DD HH:mm:ss')
      }
      if (item.type === 'rangePicker') {
        val = [data[item.key][0] ? moment(data[item.key][0], 'YYYY-MM-DD HH:mm:ss') : null, data[item.key][1] ? moment(data[item.key][1], 'YYYY-MM-DD HH:mm:ss') : null]
      }
      // 时间格式的要转换一下
      _obj[item.key] = val
    })
    this.props.form.setFieldsValue(_obj)
    // this.props.form.setFieldsValue({ desc: data.desc })
    this.setState({ basicsTinyMCE: '' }, () => {
      this.setState({ basicsTinyMCE: 'basicsTinyMCE', desc: data.desc })
    })
    this.props.form.setFieldsValue({ place: data.place })
    this.props.form.setFieldsValue({ attention: data.attention })
    if (!data.schedule) {
      this.setState({ day_times: [] })
      return
    }
    if (data.schedule.detail){
      let _array = this.splitArray(data.schedule.detail)
      this.setState({ day_times: _array })
    }
  }
  // 提交
  toSuccess = () => {
    const { schedule, conference, logo, reference, qr_code, schedule_pic } = this.state
    let _data = {
      schedule: schedule,
      conference: conference,
      logo: logo,
      qr_code: qr_code,
      reference: reference,
      schedule_pic: schedule_pic
    }
    Object.assign(_data, this.props.form.getFieldsValue())
    _data.apply_start_time = (_data.apply_time && _data.apply_time[0]) ? formatDate(new Date(_data.apply_time[0]), "yyyy-MM-dd hh:mm:ss") : null
    _data.apply_end_time = (_data.apply_time && _data.apply_time[1]) ? formatDate(new Date(_data.apply_time[1]), "yyyy-MM-dd hh:mm:ss") : null
    return _data
  }
  // 日程数据
  onScheduleData = (data) => {
    let { onChange } = this.props
    if (data) {
      // message.info('成功')
    }
    this.setState({ schedule_pic: '' }, () => {
      this.setState({ schedule_pic: data.schedule_pic })
      onChange(data.schedule_pic, 'schedule_pic')
    })
    this.setState({ schedule: {} }, () => {
      this.setState({ schedule: data })
      onChange(data, 'schedule')
    })
    if (!data) {
      this.setState({ day_times: [] })
      return
    }
    if(data.detail){
      let _array = this.splitArray(data.detail)
      onChange(_array, 'day_times')
      this.setState({ day_times: [] }, () => {
        this.setState({ day_times: _array })
      })
    }
    // 更新上课地点
    this.toLocation()
  }
  // 拆分数组
  splitArray = (data) => {
    let _array = []
    data.forEach((item) => {
      if (item.day_times) {
        let _day = item.day_times
        _array = [..._array, ..._day]
      }
    })
    return _array
  }
  // 关闭抽屉
  onDrawerClose = () => {
    this.setState({ visibleMyDrawer: false })
  }
  // 联系方式
  onConference = (data) => {
    this.setState({
      conference: data
    })
    this.props.onChange(data, 'conference')
  }
  // 上传图片返回值
  onGetImgDate = (data, key) => {
    this.setState({
      [key]: data.file_url
    })
    this.props.onChange(data.file_url, key)
  }
  // 上传文件返回值
  onGetFileDate = (data) => {
    this.setState({
      reference: data
    })
    this.props.onChange(data, 'reference')
  }
  // 上课地点列表
  toLocation = () => {
    // 地点列表
    getLocation().then((res) => {
      // 为空退出
      if (!res) return
      if (res.code === apiCode()) {
        if (res.data && res.data.length > 0) {
          locationObj = {}
          res.data.forEach((item) => {
            locationObj[item.id] = item.name
          })
        }
      } else {
        let _msg = res.msg || '服务器错误'
        message.info('错误：' + _msg)
      }
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
  // 表单值格式化去首尾空格
  onChange = (e, key) => {
    let _data = e.target ? e.target.value : e
    if (!_data) { return _data }
    // 去首尾空格
    if (typeof (_data) == 'string' && _data) {
      _data = _data.replace(/(^\s*)|(\s*$)/g, "")
    }
    let { onChange } = this.props
    onChange(_data, key)
    if (key === 'apply_time') {
      _data = [e[0] ? moment(e[0], "YYYY-MM-DD HH:mm:ss") : null, e[1] ? moment(e[1], "YYYY-MM-DD HH:mm:ss") : null]
    }
    if (key === 'course_type') {
      this.setState({
        course_type: _data
      })
    }
    return _data
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const { coursePlace, logo, schedule, conference, reference, visibleMyDrawer, day_times, basicsTinyMCE, desc, qr_code, course_type, schedule_pic, range_start, range_end } = this.state

    return (
      <Form className="WrappedBasics ant-advanced-search-form">
        <Row gutter={24}>
          {FormDOM.map(item => {
            return (
              <Col span={item.span ? item.span : 12} key={item.key}>
                <Form.Item label={item.label} className={item.key}>
                  {getFieldDecorator(`${item.key}`, {
                    getValueFromEvent: (event, dateString) => {
                      if (item.type === 'datePicker' || item.type === 'rangePicker') {
                        return this.onChange(dateString, item.key)
                      }
                      return this.onChange(event, item.key)
                    },
                    initialValue: item.initialValue,
                    rules: item.rules
                  })(renderForm(item))}
                </Form.Item>
              </Col>)
          })}
          <Col span={24}>
            <div className="ant-col ant-form-item-label"><label className='importantSign' title="上课日程管理">上课日程管理</label></div>
            <MyDrawer onDrawerClose={this.onDrawerClose} visible={visibleMyDrawer} btnText='上课日程管理' titleText='上课日程管理' icon="setting" drawerWidt={700}>
              {/* 日程管理 */}
              <Schedule course_type={course_type} onScheduleData={this.onScheduleData} schedule={schedule} schedule_pic={schedule_pic} range_start={range_start} range_end={range_end} />
            </MyDrawer>
            <br />
            <br />
            <Col span={24}>
              {day_times && day_times.map((item, index) => {
                return <Tag style={{ width: '210px' }} className='mb10 txc' color="blue" key={'day_times_' + index}>
                  <div>第{index + 1}次课 {item.course_date} {item.start_time.slice(-5)} - {item.end_time.slice(-5)}</div>
                  {(item.location) && <Tooltip placement="top" title={locationObj[item.location[0]]}>
                    <div style={{ width: '210px', height: '0px', opacity: '0' }}>{typeof item.location[0]}</div>
                    <div style={{ width: '190px' }} className="ellipsis">{locationObj[item.location[0]]}</div>
                  </Tooltip>}
                </Tag>
              })}
            </Col>
            <br />
            <br />
          </Col>
          <Col span={24}>
            <Form.Item label='导航管理'>
              {getFieldDecorator(`place`, {
                getValueFromEvent: (event) => {
                  return this.onChange(event, 'place')
                },
              })(<Select getPopupContainer={triggerNode => triggerNode.parentNode} style={{ width: '200px' }} placeholder="请选择">
                {coursePlace && coursePlace.map(item => {
                  return <Option key={item.id} value={item.id}>{item.name}</Option>
                })}
              </Select>)}
              <span className='mr20'></span>
              {/* 通用抽屉弹窗 */}
              <MyDrawer key='course_place' btnText='导航管理' icon="setting" titleText='导航管理' drawerWidt={700}>
                {/* 地点选择组件 */}
                <PlaceForm coursePlace={coursePlace} onGetList={this.toGetList} />
              </MyDrawer>
            </Form.Item>
          </Col>
          <Col span={24}>
            {basicsTinyMCE && <Form.Item label='课程简介'>
              {getFieldDecorator(`desc`, {
                initialValue: desc,
                rules: [
                  { required: true, message: '请输入' }
                ],
                getValueFromEvent: (event) => {
                  return this.onChange(event, 'desc')
                },
              })(
                <MyBraftEditor dataKey={basicsTinyMCE} />
              )}
            </Form.Item>}
          </Col>
          <Col span={24}>
            <br />
            <div className="ant-col ant-form-item-label"><label className="ant-form-item-required" title="联系方式">联系方式</label></div>
            <Conference onReturnDate={this.onConference} conference={conference} />
          </Col>
          <Col span={24}>
            <br />
            <div className="ant-col ant-form-item-label"><label title="课程Logo">课程Logo</label></div>
            {/* 图片上传 */}
            <MyImgUpload onReturnDate={value => this.onGetImgDate(value, 'logo')} fileUrl={logo} />
            <p className='labelTips'>建议尺寸340*270或者尺寸更大的同比例图片</p>
          </Col>
          <Col span={24}>
            <br />
            <div className="ant-col ant-form-item-label"><label className="ant-form-item-required" title="课程Logo">课程群二维码</label></div>
            {/* 图片上传 */}
            <MyImgUpload onReturnDate={value => this.onGetImgDate(value, 'qr_code')} fileUrl={qr_code} />
            <p className='labelTips'>建议尺寸340*270或者尺寸更大的同比例图片</p>
          </Col>
          <Col span={16}>
            <br />
            <div className="ant-col ant-form-item-label"><label title="课程资料">课程资料</label></div>
            <MyFileUpload onReturnDate={this.onGetFileDate} fileList={reference} />
          </Col>
          <Col span={24}>
            <br />
            <Form.Item label='注意事项'>
              {getFieldDecorator(`attention`, {
                getValueFromEvent: (event) => {
                  return this.onChange(event, 'attention')
                },
              })(
                <TextArea rows={4} style={{ width: '300px' }} />
              )}
            </Form.Item>
          </Col>
        </Row>
      </Form>
    );
  }
}
const WrappedBasics = Form.create({ name: 'basics' })(Basics);
export default WrappedBasics;