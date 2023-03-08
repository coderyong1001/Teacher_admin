/*
 * @Author: yuanhang 
 * @Date: 2019-10-24 10:48:41 
 * @Last Modified by: yuanhang
 * @Last Modified time: 2019-10-30 10:54:50
 */
/*
* 全局腾讯地图
* use：
导入：
*/
// var TMap = window.TMap//取出window中的BMap对象
var qq = window.qq//取出window中的BMap对象
var geolocation = window.geolocation//定位
var map = null
var marker = null
var searchService = null
var poiText = ''
var regionText = ''
// 区域
export function setMapRegionText (val) {
  regionText = val
}
// 关键词
export function setMapPoiText (val) {
  poiText = val
}
export function toSearch () {
  if (map && searchService) {
    //根据输入的城市设置搜索范围
    searchService.setLocation(regionText);
    //根据输入的关键字在搜索范围内检索
    searchService.search(poiText);
  }
}
// 搜索成功
function searchComplete (results) {
  console.log('搜索成功 results', results);
}
// 搜索失败
function searchError () {
  alert("出错了。");
}
// 创建地图 获取定位坐标
export function newMap (x = 0, y = 0) {
  var center = new qq.maps.LatLng(x, y);
  //定义地图中心点坐标
  map = new qq.maps.Map(document.getElementById("container"), {
    center: center,
    zoom: 14
  });
  // 标点
  marker = new qq.maps.Marker({
    position: center,
    map: map
  });
  // 设置Poi检索服务
  // searchService = new qq.maps.SearchService({ complete: (results) => { searchComplete(results) }, error: searchError() })

  //设置Poi检索服务，用于本地检索、周边检索
  searchService = new qq.maps.SearchService({
    //检索成功的回调函数
    complete: function (results) {
      //设置回调函数参数
      // var pois = results.detail.pois;
      searchComplete(results);
    },
    //若服务请求失败，则运行以下函数
    error: function () {
      searchError();
    }
  });

  // 定位
  showPosition();
  function showPosition () {
    //定位
    geolocation.getLocation((position) => {
      console.log('定位成功');
      initMap(position);
      showClearWatch();
    }, () => {
      showErr();
    })
  }
  function showErr () {
    console.log('定位失败');
    showWatchPosition();
  }
  // 事件监听
  function showWatchPosition () {
    console.log('事件监听');
    geolocation.watchPosition(showPosition);
  };
  // 取消监听
  function showClearWatch () {
    console.log('取消监听');
    geolocation.clearWatch();
  };
}
// 初始化地图
export function initMap (position) {
  //panTo()将地图中心移动到指定的经纬度坐标。
  map.panTo(new qq.maps.LatLng(position.lat, position.lng));
  marker.setPosition(new qq.maps.LatLng(position.lat, position.lng));
  //添加监听事件   获取鼠标单击事件
  qq.maps.event.addListener(map, 'click', function (event) {
    var latLng = event.latLng,
      lat = latLng.getLat().toFixed(5),
      lng = latLng.getLng().toFixed(5);
    console.log('map  点击', latLng, lat, lng);
    marker.setPosition(event.latLng);
  });
  qq.maps.event.addListener(marker, 'click', function (event) {
    var latLng = event.latLng,
      lat = latLng.getLat().toFixed(5),
      lng = latLng.getLng().toFixed(5);
    console.log('marker  点击', latLng, lat, lng);
  });
}

export default newMap;