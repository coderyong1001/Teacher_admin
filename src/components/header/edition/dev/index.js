import React, { Component } from 'react'
import { Card } from 'antd'

class Dev extends Component {
  render () {
    return (
      <div className="edition">
        <div>
          <Card className="mb15" style={{ width: '100%' }}>
            <p><span>后台版本：<strong>V0.1.3（plus）</strong></span></p>
            <p><span>更新时间：<strong>2020-5-26</strong></span></p>
            <p><span>更新详情：</span></p>
            <span>
              <div>1、实现了发票信息的自动填写与自动更新</div>
              <div>2、用户管理当中新增未注册用户的信息</div>
              <div>3、禁止重复报名，通过身份证号识别唯一报名信息</div>
              <div>4、问卷ID填写后可以自动生成问卷链接</div>
              <div>5、优化以酒店查询的数据显示方式</div>
              <div>6、修改酒店房型的填写方式，在住宿管理当中直接填写</div>
              <div>7、新增联系人记录保存的功能</div>
              <div>8、将导航管理与上课日程地点管理合并成一个地点库</div>
              <div>9、签到表当中新增未付款用户信息</div>
              <div>10、地点管理及酒店管理当中可以通过搜索地图自动填写地址</div>
            </span>
          </Card>
          <Card className="mb15" style={{ width: '100%' }}>
            <p><span>后台版本：<strong>V0.1.3</strong></span></p>
            <p><span>更新时间：<strong>2020-03-31</strong></span></p>
            <p><span>更新详情：</span></p>
            <span>
              <div>1、报名详情中，新增以酒店信息查询页面，可统计酒店预订信息</div>
              <div>2、后台报名时新增酒店预订的相关内容填写</div>
              <div>3、恢复线上支付渠道</div>
              <div>4、部分BUG修复</div>
            </span>
          </Card>
          <Card className="mb15" style={{ width: '100%' }}>
            <p><span>后台版本：<strong>V0.1.2</strong></span></p>
            <p><span>更新时间：<strong>2020-02-28</strong></span></p>
            <p><span>更新详情：</span></p>
            <span>
              <div>1、新增问卷星功能：在后台设置填写问卷星链接即可实现小程序跳转问卷星填写问卷</div>
              <div>2、住宿管理功能优化：现在可以选择不做安排、只做推荐、需要预定三种住宿情况</div>
              <div>3、签到管理新增全部签到功能</div>
              <div>4、课程退款功能优化，可以给每个用户单独退款不再按订单统一退款</div>
              <div>5、其他功能优化、BUG修复</div>
            </span>
          </Card>
          <Card className="mb15" style={{ width: '100%' }}>
            <p><span>后台版本：<strong>V0.1.1</strong></span></p>
            <p><span>更新时间：<strong>2020-02-11</strong></span></p>
            <p><span>更新详情：</span></p>
            <span>
              <div>1、优化发票模块</div>
              <div>2、优化及统一按钮样式</div>
              <div>3、新增更新日志</div>
              <div>4、修复若干2期BUG</div>
            </span>
          </Card>
        </div>
      </div>
    );
  }
}

export default Dev