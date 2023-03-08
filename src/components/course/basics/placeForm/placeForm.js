/*
 * @Author: yuanhang 
 * @Date: 2019-10-28 14:05:16 
 * @Last Modified by: yuanhang
 * @Last Modified time: 2020-06-02 09:40:06
 */
// 地点管理表单
import React, { Component } from 'react';
// api
import {
  apiCode,
  postCoursePlace, // 导航地址(新建)
  putCoursePlace,  // 导航地址（修改）
  deleteCoursePlace, // 导航地址（删除）
  postLocation, // 上课地点(新建)
  putLocation, // 上课地点（修改）
  deleteLocation, // 导航地址（删除）
} from '../../../../api/index'
// 引入css
import './index.css'
// 引入腾讯地图
import MyTMap from '../../../myTMap/myTMap'
// 引入组件
import { message, Select, Row, Col, Button, Input } from 'antd';
const { Option } = Select;
const { TextArea } = Input;

class PlaceForm extends Component {
  state = {
    btnLoading: false,
    selectValue: null,

    itemId: null,
    name: null,
    district: null,
    address: null,
    longitude: null,
    latitude: null,

    TMapKey: 'PlaceFormMap',
  };
  static defaultProps = {
    coursePlace: [],
    isLocation: false,
    onGetList: () => console.log('PlaceForm组件回调函数')
  }
  componentDidMount() {
    // const { coursePlace } = this.props
    let timestamp = new Date().getTime()
    this.setState({ TMapKey: 'PlaceFormMap' + timestamp })

  }
  UNSAFE_componentWillReceiveProps(nextProps) {
    // const { coursePlace } = nextProps
  }
  // 获取表单数据
  setListData = (item) => {
    // 设置值
    this.setState({
      itemId: item.id,
      selectValue: item.id,
      name: item.name,
      address: item.address,
      district: item.district,
      longitude: item.longitude,
      latitude: item.latitude,
    })
  }
  // 名称备注
  setName = (e) => {
    let _data = e.target.value
    this.setState({ name: _data });
  }
  inputNameOnBlur = (e) => {
    let _data = e.target.value
    // 去首尾空格
    if (typeof (_data) == 'string' && _data) {
      _data = _data.replace(/(^\s*)|(\s*$)/g, "")
    }
    this.setState({ name: _data });
  }
  // 详细地址
  setAddress = (e) => {
    let _data = e.target.value
    this.setState({ address: _data });
  }
  inputAddressOnBlur = (e) => {
    let _data = e.target.value
    // 去首尾空格
    if (typeof (_data) == 'string' && _data) {
      _data = _data.replace(/(^\s*)|(\s*$)/g, "")
    }
    this.setState({ address: _data });
  }
  // 获取地图坐标
  onMyMapVal = (val) => {
    const { latLng, district, poiText } = val
    if (!val) return
    if (!latLng) return
    this.setState({
      latitude: latLng.lat.toFixed(5),
      longitude: latLng.lng.toFixed(5),
    })
    if (!district) return
    this.setState({
      district: district
    })
    if (!poiText) return
    this.setState({
      name: poiText.name || this.state.name
    })
    this.setState({
      address: poiText.address || this.state.address
    })
  }
  // 清除
  cleanUp = () => {
    // 设置值
    this.setState({
      itemId: null,
      selectValue: null,
      name: null,
      address: null,
      district: '北京市',
      latitude: 39.90469,
      longitude: 116.40717,
    })
  }
  // 新建
  toPOST = () => {
    const { name, district, address, longitude, latitude } = this.state
    if (!name) { return message.info('请输入名称备注') }
    if (!address) { return message.info('请输入详细地址') }
    if (!district) { return message.info('请选择地址') }
    let _array = district.split("-")
    if (!_array[0]) { return message.info('请选择地址') }
    if (!_array[1]) { return message.info('请选择地址') }
    if (!_array[2]) { return message.info('请选择地址') }
    if (!latitude) { return message.info('请选择地图定位') }

    let _data = {
      name: name,
      district: district,
      address: address,
      longitude: longitude,
      latitude: latitude
    }
    this.setState({
      btnLoading: true
    })

    let ApiObject = this.props.isLocation ? postLocation : postCoursePlace
    ApiObject(_data).then((res) => {
      // 为空退出
      if (!res) return
      if (res.code === apiCode()) {
        message.info('新建成功')
        const { onGetList } = this.props
        onGetList()
        this.setState({
          btnLoading: false
        })
      } else {
        this.setState({
          btnLoading: false
        })
        let _msg = res.msg || '服务器错误'
        message.info('错误：' + _msg)
      }
    })
  }
  // 修改
  toPUT = () => {
    const { itemId, name, district, address, longitude, latitude } = this.state
    if (!name) { return message.info('请输入名称备注') }
    if (!address) { return message.info('请输入详细地址') }
    if (!district) { return message.info('请选择地址') }
    let _array = district.split("-")
    if (!_array[0]) { return message.info('请选择地址') }
    if (!_array[1]) { return message.info('请选择地址') }
    if (!_array[2]) { return message.info('请选择地址') }
    if (!latitude) { return message.info('请选择地图定位') }

    let _data = {
      name: name,
      district: district,
      address: address,
      longitude: longitude,
      latitude: latitude
    }
    this.setState({
      btnLoading: true
    })

    let ApiObject = this.props.isLocation ? putLocation : putCoursePlace
    // 地址（修改）
    ApiObject(_data, itemId).then((res) => {
      // 为空退出
      if (!res) return
      if (res.code === apiCode()) {
        message.info('修改成功')
        const { onGetList } = this.props
        onGetList()
        this.setState({
          btnLoading: false
        })
      } else {
        this.setState({
          btnLoading: false
        })
        let _msg = res.msg || '服务器错误'
        message.info('错误：' + _msg)
      }
    })
  }
  // 删除
  toDelete = () => {
    this.setState({
      btnLoading: true
    })
    const { itemId } = this.state

    let ApiObject = this.props.isLocation ? deleteLocation : deleteCoursePlace
    ApiObject(itemId).then((res) => {
      // 为空退出
      if (!res) return
      if (res.code === apiCode()) {
        message.info('删除成功')

        const { onGetList } = this.props
        onGetList()

        this.cleanUp()
        this.setState({
          btnLoading: false
        })
      } else {
        this.setState({
          btnLoading: false
        })
        let _msg = res.msg || '服务器错误'
        message.info('错误：' + _msg)
      }
    })
  }
  // 展开下拉菜单的回调
  onDropdownVisibleChange = (open) => {
    if (open) {
      const { onGetList } = this.props
      onGetList()
    }
  }
  render() {
    const { itemId, TMapKey, btnLoading, selectValue, name, address, latitude, longitude, district } = this.state
    const { coursePlace } = this.props
    return (
      <div className='PlaceForm'>
        <Row gutter={24}>
          <Col span={12}>
            <Select getPopupContainer={triggerNode => triggerNode.parentNode} style={{ width: '300px' }} placeholder="请选择" value={selectValue} onDropdownVisibleChange={this.onDropdownVisibleChange}>
              {coursePlace && coursePlace.map(item => {
                return <Option key={item.id} value={item.id} data-item={item} onClick={this.setListData.bind(this, item)}>{item.name}</Option>
              })}
            </Select>
          </Col>
          <Col span={12}>
            <Button type="primary" loading={btnLoading} onClick={this.cleanUp} >清除</Button>
          </Col>
          <Col span={24} className='time mt15 mb50'>
            {/* 地图 */}
            <MyTMap dataKey={TMapKey} onMyMapVal={this.onMyMapVal} fixedPoint={{ lat: latitude, lng: longitude }} district={district} />
          </Col>
          <Col span={24} className='time mb15'>
            <span className='label form-label'>名称备注</span>
            <Input className='input' placeholder="名称备注" style={{ width: '450px' }} onChange={this.setName} onBlur={this.inputNameOnBlur} value={name} />
          </Col>
          <Col span={24} className='time mb15'>
            <span className='label form-label'>详细地址</span>
            <TextArea placeholder="详细地址" rows={4} style={{ width: '450px' }} onChange={this.setAddress} value={address} onBlur={this.inputAddressOnBlur} />
            <br />
            <p className='labelTips'>（自动获取地址信息，均由腾讯地图提供，仅供参考，若信息有误可自行修改）</p>
          </Col>
          <Col span={24}>
            {!itemId && <div style={{ width: '100%', textAlign: "center" }}>
              <Button onClick={this.toPOST} loading={btnLoading} icon="plus">添加</Button>
            </div>}
            {itemId && <div style={{ width: '100%', textAlign: "center" }}>
              <Button type="primary" onClick={this.toPUT} loading={btnLoading}>修改</Button>
              <span className='mr15'></span>
              <Button type="danger" onClick={this.toDelete} loading={btnLoading}>删除</Button>
            </div>}
          </Col>
        </Row>
      </div>
    );
  }
}

export default PlaceForm;