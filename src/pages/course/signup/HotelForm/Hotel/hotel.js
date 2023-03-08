import React, { Component } from 'react';
import { allIsEmpty } from '../../../../../utils/utils'
import HotelList from '../HotelList/hotelList'
// 组件
import { Button, message } from 'antd';

class Hotel extends Component {
  state = {
    hotel_info: [0],
  }
  componentDidMount() {
  }
  // 添加
  addHotel = () => {
    let hotel_info = [...this.state.hotel_info]
    // 为空判断
    if (!allIsEmpty(hotel_info)) {
      return message.warning('当前酒店信息不能有空值')
    }
    hotel_info.push(hotel_info.length + 1)
    this.setState({ hotel_info })
  }
  // 删除
  toDelete = (index) => {
    let hotel_info = [...this.state.hotel_info]
    hotel_info.splice(index, 1)
    this.setState({ hotel_info }, this.props.onChange(hotel_info))
  }
  onChange = (e) => {
    let hotel_info = [...this.state.hotel_info]
    hotel_info[e.index] = e.data
    this.setState({ hotel_info }, this.props.onChange(hotel_info))
  }
  render() {
    const { course_id } = this.props
    const { hotel_info } = this.state
    return (
      <div>
        {(hotel_info && hotel_info.map((item, index) => {
          return <HotelList key={'HotelList_' + index} itemIndex={index} course_id={course_id} hotel_info={hotel_info} onChange={this.onChange} onDelete={this.toDelete} />
        }))}
        <br />
        <Button type="primary" onClick={this.addHotel}>添加酒店</Button>
      </div>
    );
  }
}

export default Hotel;