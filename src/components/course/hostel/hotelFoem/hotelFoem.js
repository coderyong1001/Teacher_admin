/*
 * @Author: yuanhang 
 * @Date: 2019-10-31 11:29:20 
 * @Last Modified by: yuanhang
 * @Last Modified time: 2020-06-02 09:38:44
 */
// 酒店管理表单
import React, { Component } from 'react';
// api
import { apiCode, postHotel, putHotel, deleteHotel } from '../../../../api/index'
// 引入css
import './index.css'
// 图片上传
import MyImgUpload from '../../../../components/myImgUpload/myImgUpload'
// 引入腾讯地图
import MyTMap from '../../../myTMap/myTMap'
// 导入组件
import { message, Input, Select, Row, Col, Button } from 'antd';
const { Option } = Select;
const { TextArea } = Input;

class hotelFoem extends Component {
  state = {
    hotelList: null,

    selectValue: null,

    itemId: null,
    name: null,
    tel: null,
    config: [],
    district: '北京市',
    address: null,
    latitude: 39.90469,
    longitude: 116.40717,
    picture: null,
    btnLoading: false,
  };
  static defaultProps = {
    onAddHotelID: () => console.log('hotelFoem组件回调函数'),
    onGetList: () => console.log('hotelFoem组件回调函数'),
  }
  componentDidMount() {
    // 获取到酒店列表
    const { hotelList } = this.props
    if (!hotelList) return
    this.setState({
      hotelList: hotelList
    })
  }
  UNSAFE_componentWillReceiveProps(nextProps) {
    // 获取到下标 获取到酒店列表
    const { hotelList } = nextProps
    this.setState({
      hotelList: hotelList,
    })
  }
  // 名称备注
  setName = (e) => {
    let _data = e.target.value
    this.setState({ name: _data })
  }
  inputNameOnBlur = (e) => {
    let _data = e.target.value
    // 去首尾空格
    if (typeof (_data) == 'string' && _data) {
      _data = _data.replace(/(^\s*)|(\s*$)/g, "")
    }
    this.setState({ name: _data });
  }
  // 电话
  setTel = (e) => {
    this.setState({ tel: e.target.value });
  }
  // 详细地址
  setAddress = (e) => {
    let _data = e.target.value
    this.setState({ address: _data })
  }
  inputAddressOnBlur = (e) => {
    let _data = e.target.value
    // 去首尾空格
    if (typeof (_data) == 'string' && _data) {
      _data = _data.replace(/(^\s*)|(\s*$)/g, "")
    }
    this.setState({ address: _data });
  }
  // 上传图片返回值
  onGetImgDate = (data) => {
    this.setState({ picture: data.file_url })
  }
  // 获取表单数据
  setListData = (item) => {
    // 设置值
    this.setState({
      itemId: item.id,
      selectValue: item.id,
      name: item.name,
      tel: item.tel,
      address: item.address,
      district: item.district,
      longitude: item.longitude,
      latitude: item.latitude,
      picture: item.picture
    })
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
      address: poiText.address || this.state.address
    })
    this.setState({
      tel: poiText.phone || this.state.tel
    })
    this.setState({
      name: poiText.name || this.state.name
    })

  }
  // 清除
  cleanUp = () => {
    // 设置值
    this.setState({
      selectValue: null,
      itemId: null,
      name: null,
      tel: null,
      district: '北京市',
      address: null,
      latitude: 39.90469,
      longitude: 116.40717,
      picture: null,
      btnLoading: false,
    })

  }
  // 添加
  toPOST = () => {
    const { name, tel, district, address, latitude, longitude, picture } = this.state
    if (!name) { return message.info('请输入名称备注') }
    if (!address) { return message.info('请输入详细地址') }
    if (!district) { return message.info('请选择地址') }
    let _array = district.split("-")
    if (!_array[0]) { return message.info('请选择地址') }
    if (!_array[1]) { return message.info('请选择地址') }
    if (!_array[2]) { return message.info('请选择地址') }
    if (!latitude) { return message.info('请选择地图定位') }
    if (!picture) { return message.info('请上传酒店图片') }

    let _data = {
      name: name,
      tel: tel,
      district: district,
      address: address,
      longitude: longitude,
      latitude: latitude,
      picture: picture,
    }
    if (!_data.tel || _data.tel === ' ') {
      delete _data['tel']
    }
    this.setState({
      btnLoading: true
    })
    postHotel(_data).then((res) => {
      // 为空退出
      if (!res) return
      if (res.code === apiCode()) {
        message.info('添加成功')
        const { onGetList } = this.props
        onGetList()
        this.setState({
          btnLoading: false
        }, () => {
          this.cleanUp()
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
    const { itemId, name, tel, district, address, latitude, longitude, picture } = this.state
    if (!name) { return message.info('请输入名称备注') }
    if (!address) { return message.info('请输入详细地址') }
    if (!district) { return message.info('请选择地址') }
    let _array = district.split("-")
    if (!_array[0]) { return message.info('请选择地址') }
    if (!_array[1]) { return message.info('请选择地址') }
    if (!_array[2]) { return message.info('请选择地址') }
    if (!latitude) { return message.info('请选择地图定位') }
    if (!picture) { return message.info('请上传酒店图片') }

    this.setState({
      btnLoading: true
    })
    let _data = {
      name: name,
      tel: tel,
      district: district,
      address: address,
      longitude: longitude,
      latitude: latitude,
      picture: picture,
    }
    if (!_data.tel || _data.tel === ' ') {
      delete _data['tel']
    }
    putHotel(_data, itemId).then((res) => {
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
    deleteHotel(itemId).then((res) => {
      // 为空退出
      if (!res) return
      if (res.code === apiCode()) {
        message.info('删除成功')
        const { onGetList } = this.props
        onGetList()
        this.setState({
          btnLoading: false
        }, () => {
          this.cleanUp()
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
  render() {
    const { btnLoading, itemId, hotelList, selectValue, name, tel, address, latitude, longitude, picture, district } = this.state

    return (
      <div className='hotelFoem'>
        <Row gutter={24}>
          <Col span={24} className='mb15'>
            <Select getPopupContainer={triggerNode => triggerNode.parentNode} style={{ width: 450 }} placeholder="选择酒店" value={selectValue} >
              {hotelList && hotelList.map(item => {
                return <Option key={item.id} value={item.id} onClick={this.setListData.bind(this, item)}>{item.name}</Option>
              })}
            </Select>
            <Button className='ml15' type="primary" loading={btnLoading} onClick={this.cleanUp} >清除</Button>
          </Col>
          <Col span={24} className='mb15'>
            <Col span={24} className='mb15'>
              {/* 地图 */}
              <MyTMap dataKey='hotelFoemMap' onMyMapVal={this.onMyMapVal} fixedPoint={{ lat: latitude, lng: longitude }} district={district} />
            </Col>
            <span className='label form-label'>酒店名称</span>
            <Input className='input' placeholder="酒店名称" style={{ width: 450 }} onChange={this.setName} onBlur={this.inputNameOnBlur} value={name} />
          </Col>
          <Col span={24} className='mb15'>
            <span className='label'>酒店电话</span>
            <Input className='input' placeholder="酒店电话" style={{ width: 450 }} onChange={this.setTel} value={tel} />
            <br />
            <p className='labelTips'>多个电话号码请以 , 号隔开，谢谢</p>
          </Col>
          <Col span={24} className='mb15'>
            <span className='label form-label'>详细地址</span>
            <TextArea placeholder="详细地址" style={{ width: 450 }} rows={4} onChange={this.setAddress} onBlur={this.inputAddressOnBlur} value={address} />
            <br />
            <p className='labelTips'>（自动获取地址信息，均由腾讯地图提供，仅供参考，若信息有误可自行修改）</p>
          </Col>
          <Col span={24} className='mb15'>
            <span className='label form-label'>酒店图片</span>
            {/* 图片上传 */}
            <MyImgUpload onReturnDate={this.onGetImgDate} fileUrl={picture} />
          </Col>
          <Col span={24} className='mb15'>
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
      </div >
    );
  }
}

export default hotelFoem;