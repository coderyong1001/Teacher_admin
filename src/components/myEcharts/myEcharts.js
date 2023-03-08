/*
 * @Author: yuanhang 
 * @Date: 2019-11-04 14:02:14 
 * @Last Modified by: yuanhang
 * @Last Modified time: 2020-01-11 11:21:16
 */
// 图标
import React, { Component } from 'react';
// 引入 ECharts 主模块
import echarts from 'echarts/lib/echarts';
// 引入柱状图
import 'echarts/lib/chart/bar';
import 'echarts/lib/chart/line';
// 引入提示框和标题组件
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
class MyEcharts extends Component {

  static defaultProps = {
    dataKey: 'MyEcharts',
    chartOption: {},
    ECwidth: 950,
    ECheight: 500,
  }
  componentDidMount () {
    this.initEC()
  }
  UNSAFE_componentWillReceiveProps () {
    // this.initEC()
  }
  // 更新图表
  initEC = () => {
    const { chartOption, dataKey } = this.props
    let _Axis = chartOption.Axis
    let _data = chartOption.series
    let _chartOption = {
      title: { text: chartOption.title },
      tooltip: {},
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: _Axis
      },
      yAxis: { type: 'value' },
      series: [{
        name: '',
        type: 'line',
        data: _data
      }]
    }
    var myChart = null;
    // 基于准备好的dom，初始化echarts实例
    myChart = echarts.init(document.getElementById(dataKey))
    // 绘制图表
    myChart.setOption(_chartOption)
  }
  render () {
    const { ECwidth, ECheight, dataKey } = this.props
    return (
      <div className='MyEcharts'>
        <div style={{ width: ECwidth, height: ECheight, margin: '0 auto' }} id={dataKey}></div>
      </div >
    );
  }
}

export default MyEcharts;