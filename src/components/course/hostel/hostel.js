/*
 * @Author: yuanhang 
 * @Date: 2019-10-31 10:40:22 
 * @Last Modified by: yuanhang
 * @Last Modified time: 2020-05-20 11:27:42
 */
// 住宿管理
import React, { Component } from 'react'
// 引入css
import './index.css'
// 全局弹窗抽屉
import MyDrawer from '../../myDrawer/myDrawer'
// 全局弹窗抽屉
import HotelFoem from './hotelFoem/hotelFoem'
// 封装单选项
import MyRadio from '../../../components/radio/index'
// api
import { apiCode, getHotel } from '../../../api/index'
// 引入酒店关联列表项
import HostelList from './hotelList/hotelList'
// 导入组件
import { Button, message, Input, DatePicker } from 'antd'
// 日期
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');

const { TextArea } = Input
const { RangePicker } = DatePicker;


class Hostel extends Component {
  state = {
    hotelList: null,
    recommend_hotel: [],
    default_data: {
      hotel_id: null,
      room_info: [
        { config: 1, price: null },
        { config: 2, price: null },
        { config: 3, price: null }
      ]
    },
    hotelTypeList: [
      { value: 1, label: '不做安排' },
      { value: 2, label: '只做推荐' },
      { value: 3, label: '需要预定' }
    ],
    hotel_type: 1,
    hotel_hint: null,
    range_start: null,
    range_end: null,
    hotel_start: null,
    hotel_end: null
  }
  static defaultProps = {
    courseData: null,
    onRef: () => console.log('Hostel组件回调函数'),
    onChange: () => console.log('Hostel组件回调函数'),
  }
  componentDidMount() {
    const { courseData, onRef } = this.props
    const { default_data } = this.state
    let _hotel_data = { ...default_data }
    onRef(this)
    this.onGetList()
    if (!courseData) {
      this.setState({ recommend_hotel: [_hotel_data] || [] })
      return
    }
    this.setState({
      recommend_hotel: courseData.recommend_hotel || [],
      hotel_type: courseData.hotel_type || 1,
      hotel_hint: courseData.hotel_hint || null,
      range_start: courseData.range_start,
      range_end: courseData.range_end,
      hotel_start: courseData.hotel_start,
      hotel_end: courseData.hotel_end,
    }, () => {
      if (courseData && courseData.recommend_hotel) {
        courseData.recommend_hotel.forEach((item, index) => {
          if (index !== 0) {
            // this.addHostel()
          }
        })
      }
    })
  }
  // 获取数据更新
  toUpdate = (data) => {

  }
  getHotelList = () => {
    const { hotelList } = this.state
    return hotelList
  }
  // 提交
  toSuccess = () => {
    const { recommend_hotel, hotel_type, hotel_hint, hotel_start, hotel_end } = this.state
    let _data = {
      recommend_hotel: recommend_hotel,
      hotel_type,
      hotel_hint
    }
    if (hotel_type === 1) {
      _data.recommend_hotel = []
      _data.hotel_hint = ''
    }
    if (hotel_type === 2) {
      _data.hotel_hint = ''
      let _recommend_hotel = [...recommend_hotel]
      if (!_recommend_hotel || _recommend_hotel.length === 0) {
        message.info('未选择酒店')
        return _data = null
      }
      let _array = _recommend_hotel.map(item => {
        return { hotel_id: item.hotel_id }
      })
      _data.recommend_hotel = _array
    }
    if (hotel_type === 3) {
      let _recommend_hotel = [...recommend_hotel]
      if (!hotel_hint) {
        message.info('未填写住宿提醒')
        return _data = null
      }
      if (!hotel_start || !hotel_end) {
        message.info('未填选推荐住宿时间')
        return _data = null
      }
      _data.hotel_start = hotel_start
      _data.hotel_end = hotel_end

      if (_recommend_hotel.length === 0) {
        message.info('未选择酒店')
        return _data = null
      }
      // 删除空价格
      let _array = _recommend_hotel.map(item => {
        let room_info = []
        item.room_info.forEach(val => {
          if (val.price || val.price === 0) {
            room_info.push(val)
          }
        })
        return {
          hotel_id: item.hotel_id,
          room_info: room_info
        }
      })
      _array.forEach((item) => {
        if (!item.hotel_id) {
          message.info('未选择酒店')
          return _data = null
        }
        if (item.room_info.length === 0) {
          message.info('未填选房间信息')
          return _data = null
        }
      })
      if (!_data) {
        return _data
      }
      _data.recommend_hotel = _array
    }
    return _data
  }
  // 添加酒店
  addHostel = () => {
    const { recommend_hotel, default_data, hotel_type } = this.state
    let _recommend_hotel = [...recommend_hotel]
    // 不可大于3个
    if (_recommend_hotel.length >= 3) { return }
    // 是否有空
    if (_recommend_hotel.length > 0 && hotel_type === 3) {
      let _array = _recommend_hotel.map(item => {
        return this.isEmpty(item)
      })
      if (_array.indexOf(false) !== -1) {
        return message.info('请填选之前数据后才可新增')
      }
    }

    let _default_data = { ...default_data }
    _recommend_hotel.push(_default_data)
    this.setState({ recommend_hotel: _recommend_hotel }, () => {
      this.toProhibit()
    })
  }
  isEmpty = (data) => {
    let _is = false
    if ((!data.hotel_id && data.hotel_id !== 0) || !data.room_info) { return _is }
    data.room_info.forEach(item => {
      if (item.price && (data.hotel_id || data.hotel_id === 0)) {
        return _is = true
      }
    })
    return _is
  }
  // 获取酒店列表
  onGetList = () => {
    // 地点列表
    getHotel().then((res) => {
      // 为空退出
      if (!res) return
      if (res.code === apiCode()) {
        if (res.data && res.data.length > 0) {
          this.setState({
            hotelList: res.data
          }, () => {
            this.toProhibit()
          })
        }
      } else {
        let _msg = res.msg || '服务器错误'
        message.info('错误：' + _msg)
      }
    })
  }
  // 子组件填充数据
  onAddHotel = (data, index) => {
    const { recommend_hotel } = this.state
    let _recommend_hotel = [...recommend_hotel]

    if (!_recommend_hotel[index]) {
      _recommend_hotel[index].push(data)
    }
    _recommend_hotel[index] = data

    this.setState({ recommend_hotel: _recommend_hotel }, () => {
      this.toProhibit()
    })
  }
  // 删除
  onDeleteHotel = (index, id) => {
    const { recommend_hotel } = this.state
    let _recommend_hotel = [...recommend_hotel]
    if (!_recommend_hotel[index]) {
      return
    }
    _recommend_hotel.splice(index, 1)
    this.setState({ recommend_hotel: _recommend_hotel }, () => {
      this.toProhibit()
    })
  }
  // 触发后禁用已选ID选项
  toProhibit = () => {
    const { hotelList, recommend_hotel } = this.state
    if (!hotelList) { return }
    let id_array = recommend_hotel.map(item => {
      return item.hotel_id
    })
    let _data_array = hotelList.map(item => {
      if (id_array.indexOf(item.id) > -1) {
        item.disabled = true
      } else {
        item.disabled = false
      }
      return item
    })
    this.setState({
      hotelList: _data_array
    })
  }
  // 住宿安排
  setHotelTypeValue = (value) => {
    this.setState({ hotel_type: value })
  }
  // 住宿提醒
  setHotelHint = (e) => {
    let _data = e.target.value
    this.setState({ hotel_hint: _data })
  }
  inputOnBlur = (e) => {
    let _data = e.target.value
    // 去首尾空格
    if (typeof (_data) == 'string' && _data) {
      _data = _data.replace(/(^\s*)|(\s*$)/g, "")
    }
    this.setState({ hotel_hint: _data })
  }
  // 添加日期时间现在限制范围
  disabledDate = (current) => {
    const { range_start, range_end } = this.state
    let range_start_tomo = new Date((new Date(range_start + ' 00:00:00') / 1000 - 86400 * 10) * 1000)
    let range_end_tomo = new Date((new Date(range_end + ' 23:59:59') / 1000 + 86400 * 10) * 1000)
    return current < moment(range_start_tomo) || current > moment(range_end_tomo)
  }
  // 日期
  onDate = (dates, dateStrings) => {
    this.setState({ hotel_start: dateStrings[0], hotel_end: dateStrings[1] }, () => { })
  }
  render() {
    const { hotelList, recommend_hotel, hotelTypeList, hotel_type, hotel_hint, hotel_start, hotel_end } = this.state
    // 限制添加个数
    let _addBtn = recommend_hotel ? recommend_hotel.length > 2 : false
    let _hotel_start = hotel_start ? moment(hotel_start, "YYYY-MM-DD") : null
    let _hotel_end = hotel_end ? moment(hotel_end, "YYYY-MM-DD") : null
    return (
      <div className='Hostel'>
        <MyRadio label={'住宿安排：'} itemLits={hotelTypeList} onChange={this.setHotelTypeValue} defaultValue={hotel_type} radioType={'radio'} />
        {(hotel_type > 2) && <div>
          <span className='hotel_hint label' style={{ width: 102 }}>推荐住宿时间</span><RangePicker getCalendarContainer={triggerNode => triggerNode.parentNode} format={"YYYY-MM-DD"}
            onChange={this.onDate} disabledDate={this.disabledDate} value={[_hotel_start, _hotel_end]} />
        </div>}
        {(hotel_type > 2) && <div>
          <br /><span className='hotel_hint label'>住宿提醒</span>
          <TextArea style={{ width: '400px' }} rows={4} onChange={this.setHotelHint} onBlur={this.inputOnBlur} value={hotel_hint} />
          <br />
          <br />
        </div>}
        {(hotel_type > 1) && <div >
          {recommend_hotel && recommend_hotel.map((time, index) => {
            return <HostelList
              key={'recommend_hotel_' + index}
              dataIndex={index} hotelList={hotelList} onAddHotel={this.onAddHotel}
              onDeleteHotel={this.onDeleteHotel}
              onGetList={this.onGetList}
              room_info={time.room_info}
              nowID={time.hotel_id}
              hotel_type={hotel_type} />
          })}
          <br />
          {/* 通用抽屉弹窗 */}
          <MyDrawer btnText='酒店管理' titleText='酒店管理' icon="setting" drawerWidt={700}>
            {/* 酒店管理组件 */}
            <HotelFoem hotelList={hotelList} onGetList={this.onGetList} />
          </MyDrawer>
          <span className='mr15'></span>
          <Button onClick={this.addHostel} disabled={_addBtn} icon="plus">添加酒店</Button>
        </div>}
      </div>
    );
  }
}

export default Hostel;