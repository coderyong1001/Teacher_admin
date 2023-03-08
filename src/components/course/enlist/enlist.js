/*
 * @Author: yuanhang 
 * @Date: 2019-10-31 15:01:34 
 * @Last Modified by: yuanhang
 * @Last Modified time: 2020-05-21 11:13:09
 */
// 报名详情
import React, { Component } from 'react';
// utils
import { getUrlID } from '../../../utils/utils'
// 报名订单列表
import EntryList from './entryList/entryList'
// 人员列表
import Personnel from './personnel/personnel'
// 酒店信息表
import EnlistHotel from './enlistHotel/enlistHotel'
// 导入组件
import { Tabs } from 'antd';
// 标签页
const { TabPane } = Tabs

class Enlist extends Component {
  state = {
    course_id: null,
    PersonnelKey: null,
  }
  static defaultProps = {
    course_id: null,
  }
  componentDidMount() {
    let { course_id } = this.props
    course_id = course_id || getUrlID()
    this.setState({ course_id })
  }
  // 支付状态 文本框值变化时回调
  onChange = (value) => {
  }
  // 切换页
  callback = (key) => {
    if (key === '2') {
      this.setState({ PersonnelKey: null }, () => {
        this.setState({ PersonnelKey: 'PersonnelKe' })
      })
    }
  }
  render() {
    const { course_id, PersonnelKey } = this.state
    const { courseData } = this.props
    return (
      <div>
        <Tabs defaultActiveKey='1' onChange={this.callback}>
          <TabPane tab='订单查询' key='1'>
            {/* 订单查询 */}
            <EntryList course_id={course_id} />
          </TabPane>
          <TabPane tab='报名人员查询' key='2'>
            {/* 报名人员查询 */}
            <Personnel key={PersonnelKey} course_id={course_id} />
          </TabPane>
          {courseData && courseData.hotel_type === 3 && <TabPane tab='以酒店信息查询' key='3'>
            {/* 以酒店信息查询 */}
            <EnlistHotel course_id={course_id} />
          </TabPane>}
        </Tabs>
      </div>
    );
  }
}

export default Enlist;