/*
 * @Author: yuanhang 
 * @Date: 2019-10-30 10:35:53 
 * @Last Modified by: yuanhang
 * @Last Modified time: 2020-05-28 13:42:29
 */
// 腾讯地图
import React, { Component } from 'react';
// 引入腾讯地图区域选择
import MyDistrictSelect from '../myDistrictSelect/myDistrictSelect'
// 引入css
import './index.css'
// 引入组件
import { Input, Select } from 'antd'
const { Option } = Select;

// var TMap = window.TMap//取出window中的BMap对象
var qq = window.qq//取出window中的BMap对象
// var geolocation = window.geolocation//定位
var map = null//地图
var marker = null//标点
var searchService = null//搜索

class MyTMap extends Component {
  state = {
    regionText: '北京市',
    keyword: null,
    poiText: null,
    filteredOptions: null,
    district: null,
  };
  static defaultProps = {
    dataKey: 'myMap',
    onMyMapVal: () => console.log('MyTMap组件回调函数')
  }
  componentDidMount() {
    this.newMap()

  }
  UNSAFE_componentWillReceiveProps(nextProps) {
    // 更新地图和下拉数据
    const { fixedPoint, district } = nextProps
    this.setState({
      district: district
    })
    this.fixedPoint(fixedPoint)
  }
  // 点击搜索
  toSearch = () => {
    if (map && searchService) {
      //根据输入的城市设置搜索范围
      searchService.setLocation(this.state.regionText);
      //根据输入的关键字在搜索范围内检索
      searchService.search(this.state.poiText);
    }
  }
  // 更改时搜索
  handleChange = selectedItems => {
    this.setState({ selectedItems });
  };
  // 初始化地图
  initMap = (position) => {
    const { onMyMapVal } = this.props
    //panTo()将地图中心移动到指定的经纬度坐标。
    map.panTo(new qq.maps.LatLng(position.lat, position.lng));
    marker.setPosition(new qq.maps.LatLng(position.lat, position.lng));
    //添加监听事件   获取鼠标单击事件
    qq.maps.event.addListener(map, 'click', function (event) {
      var latLng = event.latLng
      marker.setPosition(latLng)
      onMyMapVal({ latLng: latLng })
    });
    qq.maps.event.addListener(marker, 'click', function (event) {
    });
  }
  // 创建地图 获取定位坐标
  newMap = (x = 39.90469, y = 116.40717) => {
    const { dataKey } = this.props
    let vm = this
    var center = new qq.maps.LatLng(x, y);
    //定义地图中心点坐标
    map = new qq.maps.Map(document.getElementById(dataKey), {
      center: center,
      zoom: 14
    });
    // 标点
    marker = new qq.maps.Marker({
      position: center,
      map: map
    });
    //设置Poi检索服务，用于本地检索、周边检索
    searchService = new qq.maps.SearchService({
      //检索成功的回调函数
      complete: function (results) {
        //设置回调函数参数
        // var pois = results.detail.pois;
        vm.searchComplete(results);
      },
      //若服务请求失败，则运行以下函数
      error: function () {
        vm.searchError();
      }
    });
    vm.initMap({ lat: x, lng: y })
  }
  // 地图区域
  setRegionText = (event) => {
    this.setState({
      regionText: event.target.value
    })
  }
  // 地图关键词
  setKeyword = (event) => {
    this.setState({
      keyword: event.target.value,
    })
    this.onSearch(event.target.value)
  }
  // 下拉选项
  setPoiText = (value) => {
    this.setState({
      poiText: value
    })
  }
  // 搜索成功
  searchComplete = (results) => {
    if (results && results.detail && results.detail.pois) {
      this.setState({
        filteredOptions: results.detail.pois,
      })
    }
  }
  // 搜索失败
  searchError = () => {
    console.log('搜索失败');
  }
  // 输入触发搜索
  onSearch = (val) => {
    if (!val) {
      return
    }
    if (map && searchService) {
      //根据输入的城市设置搜索范围
      searchService.setLocation(this.state.regionText);
      //根据输入的关键字在搜索范围内检索
      searchService.search(val);
      searchService.setPageCapacity(50);
    }
  }
  // 定点
  fixedPoint = (val) => {
    if (!val) return
    //panTo()将地图中心移动到指定的经纬度坐标。
    map.panTo(new qq.maps.LatLng(val.lat, val.lng));
    marker.setPosition(new qq.maps.LatLng(val.lat, val.lng));
  }
  // 选中时调用
  onSelect = (value) => {
    const { onMyMapVal } = this.props
    const { district } = this.state
    let _latLng = value.latLng
    map.panTo(new qq.maps.LatLng(_latLng.lat, _latLng.lng))
    marker.setPosition(new qq.maps.LatLng(_latLng.lat, _latLng.lng))

    let _district = district.split("-");
    let _address = value.address
    _district.forEach(item => {
      _address = _address.replace(item, "");
    })
    value.address = _address
    value.phone = value.phone.replace(/;/g, ",")
    let _data = {
      latLng: _latLng,
      district: district,
      poiText: value
    }
    onMyMapVal(_data)
  }
  // 获取区域选择数据
  getDistrictDate = ({ district, regionText, location }) => {
    this.setState({
      district: district,
      regionText: regionText,
    })
    // 标点
    this.fixedPoint(location)
    const { onMyMapVal } = this.props
    onMyMapVal({ latLng: location, district: district })
  }
  render() {
    const { keyword, poiText, filteredOptions, district } = this.state
    const { dataKey } = this.props
    return (
      <div className='MyTMap'>
        <span className='label form-label'>地图定位</span>
        <MyDistrictSelect onReturnDate={this.getDistrictDate} district={district} />
        <br />
        <br />
        <span style={{ marginLeft: 120 }}></span>
        <Input placeholder="关键词" style={{ width: '150px', margin: '0 15px 15px 0' }} onChange={event => this.setKeyword(event)} value={keyword} />
        <Select getPopupContainer={triggerNode => triggerNode.parentNode} placeholder="搜索" allowClear style={{ width: '300px', margin: '0 15px 15px 0' }} onChange={this.setPoiText} value={poiText} >
          {filteredOptions && filteredOptions.map(item => (
            <Option key={item.id} value={item.id} onClick={this.onSelect.bind(this, item)}>
              {item.name}
            </Option>
          ))}
        </Select>
        <div id={dataKey}
          style={{
            width: '100%',
            height: '450px'
          }}>
        </div>

      </div >
    );
  }
}

export default MyTMap;