/*
 * @Author: yuanhang 
 * @Date: 2020-01-19 16:07:58 
 * @Last Modified by: yuanhang
 * @Last Modified time: 2020-05-14 10:55:13
 */
import React, { Component } from 'react'
// api
import { apiCode, getCoursePlace } from '../../../../../api/index'
import { Select, Button, message } from 'antd'
const { Option } = Select

class Location extends Component {
  state = {
    coursePlace: [], // 地点
  }
  static defaultProps = {
    dataIndex: 0,
    location: [],
    onDelete: () => console.log('Location组件回调函数'),
    onChange: () => console.log('Location组件回调函数'),
  }
  componentDidMount() {
    this.toGetList()
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
  // 删除
  toDelete = () => {
    this.props.onDelete(this.props.dataIndex)
  }
  // 更新数据
  onChange = (value) => {
    this.props.onChange(value, this.props.dataIndex)
  }
  // 判断是否已有
  isLocation = (id) => {
    const { location } = this.props
    let arr = location || []
    let is = arr.indexOf(id) > -1
    return is
  }
  render() {
    const { coursePlace } = this.state
    const { dataIndex, location } = this.props
    let _val = location[dataIndex] || null
    return (
      <div className='mb10'>
        <span>地点{dataIndex + 1}：</span>
        <Select onChange={this.onChange} style={{ width: 120 }} value={_val} allowClear>
          {coursePlace && coursePlace.map(item => {
            return <Option key={item.id} value={item.id} disabled={this.isLocation(item.id)}>{item.name}</Option>
          })}
        </Select>
        {(dataIndex !== 0) && <Button className='ml15' type="danger" onClick={this.toDelete}>删除</Button>}
      </div>
    );
  }
}

export default Location