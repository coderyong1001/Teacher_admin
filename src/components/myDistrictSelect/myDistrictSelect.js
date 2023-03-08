/*
 * @Author: yuanhang 
 * @Date: 2019-11-12 15:44:25 
 * @Last Modified by: yuanhang
 * @Last Modified time: 2019-11-14 21:11:56
 */
// 腾讯地区选择

import React, { Component } from 'react';
// 引入腾讯全部行政区划数据
import { districtList } from '../../utils/qq_district_list'
// 引入公共类
import { getDistrictList } from '../../utils/utils'
// 引入组件
import { Select } from 'antd';
const { Option } = Select;

class MyDistrictSelect extends Component {
  state = {
    district: null,
    regionText: '',
    location: null,
    listOne: null,
    listTow: null,
    listThree: null,
    listOneValue: '北京市',
    listTowValue: null,
    listThreeValue: null,
  };
  static defaultProps = {
    district: null,
    onReturnDate: () => console.log('MyDistrictSelect组件回调函数')
  }
  componentDidMount () {
    // 获取全部区域数据
    if (!districtList) return
    let listOne = districtList[0]
    this.setState({
      listOne: listOne,
    })
    // 初始化北京市数据
    let _OneKey = ''
    let _OneProps = {}
    listOne.forEach(item => {
      if (item.fullname === this.state.listOneValue) {
        _OneKey = item.id
        _OneProps['data-location'] = item.location
      }
    })
    this.onlistOne(this.state.listOneValue, { key: _OneKey, props: _OneProps }, true)
  }
  UNSAFE_componentWillReceiveProps (nextProps) {
    const { district } = nextProps
    if (!district) return
    let _district = district.split("-")
    // 设置下拉
    let listOne = districtList[0]
    let listTow = districtList[1]
    let listThree = districtList[2]
    let _OneKey = ''
    let _OneProps = {}
    listOne.forEach(item => {
      if (item.fullname === _district[0]) {
        _OneKey = item.id
        _OneProps['data-location'] = item.location
      }
    })
    let _TowKey = ''
    let _TowProps = {}
    listTow.forEach(item => {
      if (item.fullname === _district[1]) {
        _TowKey = item.id
        _TowProps['data-location'] = item.location
      }
    })

    let _ThreeKey = ''
    let _ThreeProps = {}
    listThree.forEach(item => {
      if (item.fullname === _district[2]) {
        _ThreeKey = item.id
        _ThreeProps['data-location'] = item.location
      }
    })
    this.onlistOne(_district[0], { key: _OneKey, props: _OneProps }, true)
    this.onlistTow(_district[1], { key: _TowKey, props: _TowProps }, true)
    this.onlistThree(_district[2], { key: _ThreeKey, props: _ThreeProps }, true)

  }
  /*
  * 地址一级下拉
  * onChange function(value, option:Option/Array<Option>)
  */
  onlistOne = (value, { key, props }, noRenew) => {
    this.setState({
      listOneValue: value,
      listTowValue: '',
      listThreeValue: '',
      regionText: value,
    }, () => {
      if (noRenew) return
      this.setDistrict()
    })
    if (!key) return
    /*
    * 获取二级菜单
    * key 地区id
    * props 内有data-id和key一致
    */
    let listTow = getDistrictList(key)
    this.setState({
      listTow: listTow,
      location: props['data-location']
    })
  }
  // 地址三级下拉
  onlistTow = (value, { key, props }, noRenew) => {
    this.setState({
      listTowValue: value,
      listThreeValue: '',
      regionText: value,
    }, () => {
      if (noRenew) return
      this.setDistrict()
    })
    if (!key) return
    // 获取三级菜单
    let listThree = getDistrictList(key, 2)
    this.setState({
      listThree: listThree,
      location: props['data-location']
    })
  }
  // 三级地区选择
  onlistThree = (value, { key, props }, noRenew) => {
    this.setState({
      listThreeValue: value,
      regionText: value,
      location: props['data-location']
    }, () => {
      if (noRenew) return
      this.setDistrict()
    })
  }
  // 更新district
  setDistrict = () => {
    const { listOneValue, listTowValue, listThreeValue, regionText, location } = this.state
    let _listTowValue = listTowValue ? '-' + listTowValue : ''
    let _listThreeValue = listThreeValue ? '-' + listThreeValue : ''
    let _value = listOneValue + _listTowValue + _listThreeValue
    this.setState({
      district: _value
    })
    const { onReturnDate } = this.props
    /*
    * district 拼接地区字符串
    * regionText 选择的区域
    * location 区域坐标
    */
    onReturnDate({
      district: _value,
      regionText: regionText,
      location: location,
    })
  }

  render () {
    const { listOneValue, listTowValue, listThreeValue, listOne, listTow, listThree } = this.state

    return (
      <div className='MyDistrictSelect' style={{ display: 'inline-block' }}>
        <Select getPopupContainer={triggerNode => triggerNode.parentNode} placeholder='请选择' style={{ width: 120 }} onChange={this.onlistOne} value={listOneValue} >
          {listOne && listOne.map(time => {
            return <Option key={time.id} value={time.fullname} data-id={time.id} data-location={time.location}>{time.fullname}</Option>
          })}
        </Select>
        <span className='mr15'></span>
        <Select getPopupContainer={triggerNode => triggerNode.parentNode} placeholder='请选择' style={{ width: 120 }} onChange={this.onlistTow} value={listTowValue} >
          {listTow && listTow.map(time => {
            return <Option key={time.id} value={time.fullname} data-id={time.id} data-location={time.location}>{time.fullname}</Option>
          })}
        </Select>
        <span className='mr15'></span>
        <Select getPopupContainer={triggerNode => triggerNode.parentNode} placeholder='请选择' style={{ width: 120 }} onChange={this.onlistThree} value={listThreeValue} >
          {listThree && listThree.map(time => {
            return <Option key={time.id} value={time.fullname} data-id={time.id} data-location={time.location}>{time.fullname}</Option>
          })}
        </Select>
      </div>
    );
  }
}

export default MyDistrictSelect;