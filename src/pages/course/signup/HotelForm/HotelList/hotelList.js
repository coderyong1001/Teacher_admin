import React, { Component } from 'react';
// api
import { apiCode, getHotel, getCourseID } from '../../../../../api/index'
// 封装单选项
import MyRadio from '../../../../../components/radio/index'
// 组件
import { message, Input, InputNumber, DatePicker, Button } from 'antd';
// 日期国际化配置
import moment from 'moment'
import 'moment/locale/zh-cn'
moment.locale('zh-cn');
const { RangePicker } = DatePicker

class HotelList extends Component {
  state = {
    hotel_list: null,
    configMethod: null,
    hotel_id: null,
    name: null,
    checkin: null,
    checkout: null,
    config: null,
    room_list: null,
    room_obj: null,
    price: null,
    num: 1,
    range_start: null,
    range_end: null,
  }
  componentDidMount() {
    this.getData()
  }
  // 获取酒店
  getData = async () => {
    const { course_id } = this.props
    // 获取订单信息 酒店id
    const resB = await getCourseID(course_id)
    if (!resB || resB.code !== apiCode()) { return message.info('酒店id拉取失败') }
    let recommend_hotel = resB.data.recommend_hotel
    if (recommend_hotel.length === 0 || toString(recommend_hotel) === '[]') { return message.info('订单未添加酒店') }
    // 获取酒店列表
    const resA = await getHotel()
    if (!resA || resA.code !== apiCode()) { return message.info('酒店列表拉取失败') }
    let data = resA.data
    let data_obj = {}
    data.forEach(item => {
      data_obj[item.id] = item
    })
    let hotel_list = recommend_hotel.map((item) => {
      let _obj = { ...data_obj[item.hotel_id], ...{ value: item.hotel_id, label: data_obj[item.hotel_id].name, room_info: item.room_info } }
      return _obj
    })
    let hotel_obj = {}
    hotel_list.forEach(item => {
      hotel_obj[item.id] = item
    })
    let range_start = resB.data.range_start
    let range_end = resB.data.range_end

    this.setState({ hotel_list, hotel_obj, range_start, range_end }, () => {
      this.setHotel(hotel_list[0].id)
    })
  }
  setRoom_info = (data) => {
    if (!data) { return }
    const room_info = data.room_info
    let room_list = []
    room_info.forEach(item => {
      item = { ...item, ...{ value: item.config, label: `${this.getRoom_name(item.config)} (${item.price}元)` } }
      delete (item.config)
      room_list.push(item)
      if (item.value === 3) {
        item = { ...item, ...{ value: 4, label: `${this.getRoom_name(4)} (${item.price}元)` } }
        room_list.push(item)
      }
    })
    let room_obj = {}
    room_list.forEach(item => {
      room_obj[item.value] = item
    })
    // let price = room_obj[room_list[0].value].price
    this.setState({ room_list, room_obj })
  }
  getRoom_name = (config) => {
    switch (config) {
      case 1:
        return '单人间'
      case 2:
        return '双人间'
      case 3:
        return '单男'
      case 4:
        return '单女'
      default:
        break;
    }
  }
  setHotel = (hotel_id) => {
    const { hotel_obj } = this.state
    this.setRoom_info(hotel_obj[hotel_id])
    this.setState({ hotel_id, name: hotel_obj[hotel_id].name }, () => {
      // let config = hotel_obj[hotel_id].room_info[0].config
      // this.setConfig(config)
    })
  }
  setConfig = (config) => {
    const { hotel_info } = this.props

    let _obj = {}
    hotel_info.forEach(item => {
      if (!item instanceof Object) { return }
      if (!_obj[item.hotel_id]) { _obj[item.hotel_id] = [] }
      _obj[item.hotel_id].push(item.config)
    })
    const { room_obj, hotel_id } = this.state
    if (_obj[hotel_id] && _obj[hotel_id].indexOf(config) > -1) {
      message.info('此就酒点下已选择此房间，不能重复选择')
      this.setState({ config: null, price: null }, () => { this.onChange() })
      return
    }

    let price = room_obj[config].price
    this.setState({ config, price }, () => { this.onChange() })
  }
  // 日期
  onDate = (dates, dateStrings) => {
    this.setState({ checkin: dateStrings[0], checkout: dateStrings[1] }, () => { this.onChange() })
  }
  // 数量
  setNum = (num) => {
    // let num = e.target.value
    this.setState({ num }, () => { this.onChange() })
  }
  onChange = () => {
    let { hotel_id, name, checkin, checkout, config, price, num } = this.state
    this.props.onChange({ index: this.props.itemIndex, data: { hotel_id, name, checkin, checkout, config, price, num } })
  }
  // 删除
  toDelete = () => {
    this.props.onDelete(this.props.itemIndex)
  }
  // 添加日程限制范围
  disabledDate = (current) => {
    const { range_start, range_end } = this.state
    let range_start_tomo = new Date((new Date(range_start + ' 00:00:00') / 1000 - 86400 * 10) * 1000)
    let range_end_tomo = new Date((new Date(range_end + ' 23:59:59') / 1000 + 86400 * 10) * 1000)
    return current < moment(range_start_tomo) || current > moment(range_end_tomo)
  }
  render() {
    let { hotel_list, room_list, hotel_id, config, price, num } = this.state
    return (
      <div>
        <br />
        {(this.props.itemIndex > 0) && <div className='txr'>
          <Button type="danger" onClick={this.toDelete}>删除</Button>
        </div>}
        {hotel_list && <MyRadio label={'选择酒店：'} itemLits={hotel_list} onChange={this.setHotel} defaultValue={hotel_id} />}
        <span className='label'>时间：</span>
        <RangePicker getCalendarContainer={triggerNode => triggerNode.parentNode} format={"YYYY-MM-DD"}
          onChange={this.onDate} disabledDate={this.disabledDate} />
        <br />
        {room_list && <MyRadio label={'房间选择：'} itemLits={room_list} onChange={this.setConfig} defaultValue={config} />}
        <span className='label'>房间价格：</span>
        <Input style={{ width: 200 }} value={price} disabled />
        <br />
        <span className='label'>数量：</span>
        <InputNumber min={1} placeholder="请输入" style={{ width: 200 }} onChange={this.setNum} value={num} />
      </div>
    );
  }
}

export default HotelList;