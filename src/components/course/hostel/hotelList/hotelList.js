/*
 * @Author: yuanhang 
 * @Date: 2019-10-31 10:56:08 
 * @Last Modified by: yuanhang
 * @Last Modified time: 2020-05-20 15:33:24
 */
// 酒店管理列表项
import React, { Component } from 'react';
// 引入css
import './index.css'
// 房间配置
import Config from './config/config'
// 导入组件
import { Row, Col, Select, Button } from 'antd';
const { Option } = Select;

class HotelList extends Component {
  state = {
    nowID: null,
    PastID: null,
    hotelList: null,
    dataIndex: null,
    listData: null,
    room_info: [
      { config: 1, price: null },
      { config: 2, price: null },
      { config: 3, price: null }
    ],
  };

  static defaultProps = {
    hotel_type: 3,
    onAddHotel: () => console.log('HotelList组件回调函数'),
    onDeleteHotel: () => console.log('HotelList组件回调函数'),
    onGetList: () => console.log('HotelList组件回调函数'),
  }
  componentDidMount() {
    // 获取到酒店列表
    const { hotelList, dataIndex, nowID, room_info } = this.props
    this.setState({
      dataIndex: dataIndex,
    })
    if (!hotelList) return
    let _listData = null
    hotelList.forEach(item => {
      if (item.id === nowID) {
        return _listData = item
      }
    })
    this.setState({
      hotelList: hotelList,
      nowID: nowID,
      listData: _listData,
      room_info
    })
  }
  UNSAFE_componentWillReceiveProps(nextProps) {
    // 获取到下标 获取到酒店列表
    const { dataIndex, hotelList, nowID, room_info } = nextProps
    this.setState({
      dataIndex: dataIndex,
    })
    if (!hotelList) return
    let _listData = null
    hotelList.forEach(item => {
      if (item.id === nowID) {
        return _listData = item
      }
    })
    this.setState({
      hotelList: hotelList,
      nowID: nowID,
      listData: _listData,
      room_info
    })
  }
  // 更新下拉酒店数据
  onGetList = () => {
    const { onGetList } = this.props
    onGetList()
  }
  // 删除
  onDeleteHotel = () => {
    const { onDeleteHotel } = this.props
    const { dataIndex, listData } = this.state
    if (!dataIndex && dataIndex !== 0) return
    let _id = null
    if (listData && listData.id) { _id = listData.id }
    onDeleteHotel(dataIndex, _id)
  }
  // 设置列表数据 触发父组件id更改
  setListData = (item) => {
    const { listData, room_info } = this.state
    // 选中相同值时不触发
    if (listData && listData.id === item.id) return
    // 保存过去ID
    let _PastID = null
    if (listData && listData.id) {
      _PastID = listData.id
      this.setState({
        PastID: _PastID,
      })
    }
    this.setState({
      nowID: item.id,
    })
    // 触发父组件id更改
    this.props.onAddHotel({ hotel_id: item.id, room_info }, this.props.dataIndex)
  }
  onChange = (room_info) => {
    const { nowID } = this.state
    this.setState({ room_info }, () => { this.props.onAddHotel({ hotel_id: nowID, room_info }, this.props.dataIndex) })
  }
  render() {
    const { nowID, hotelList, room_info, listData } = this.state
    const { hotel_type } = this.props
    return (
      <div className='HotelList mb15'>
        <Row>
          <Col span={12}>
            <div className='item'>
              <p className='label'>选择酒店</p>
              <Select getPopupContainer={triggerNode => triggerNode.parentNode} style={{ width: 250 }} placeholder="选择酒店" value={nowID}>
                {hotelList && hotelList.map(item => {
                  return <Option key={item.id} value={item.id} disabled={item.disabled ? item.disabled : false} onClick={this.setListData.bind(this, item)}>{item.name}</Option>
                })}
              </Select>
              <Button className='ml15' type="danger" onClick={this.onDeleteHotel}>删除</Button>
            </div>
            <div className='item synopsis'>
              <p className='label'>酒店位置</p>
              <p className='text'>{listData ? listData.district : ''}</p>
            </div>
            <div className='item synopsis'>
              <p className='label'>前台电话</p>
              <p className='text'>{listData ? listData.tel : '暂无'}</p>
            </div>
            {(hotel_type === 3) && <div className='item synopsis'>
              <p className='label'>住宿标准</p>
              <Config room_info={room_info} onChange={this.onChange}></Config>
            </div>}
          </Col>
          <Col span={12}>
            <div className='item'>
              <p className='label'>酒店图片</p>
              <img style={{ width: 200, height: 200, minWidth: 200, minHeight: 200 }} src={listData ? listData.picture : ''} alt={listData ? listData.name : ''} />
            </div>
          </Col>
        </Row>
        <br />
      </div>
    );
  }
}

export default HotelList;