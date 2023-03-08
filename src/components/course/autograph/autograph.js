/*
 * @Author: yuanhang 
 * @Date: 2019-11-01 13:41:46 
 * @Last Modified by: yuanhang
 * @Last Modified time: 2020-05-20 10:39:03
 */
// 签到管理
import React, { Component } from 'react';
// 引入css
import './index.css'
// utils
import { getUrlID } from '../../../utils/utils'
// api
import { apiCode, getSchedules, getCheckin, postCheck, postCheckAll, exportAPI } from '../../../api/index'
// 导入组件
import { Button, Table, message } from 'antd'
let statusCategory = { 1: '未开始', 2: '已结束', 3: '签到中', 4: '无需签到' }

class Autograph extends Component {
  state = {
    schedulesList: [],
    course_id: null,
    schedule_id: null,
    pager: { page_size: 10, page_num: 1 },
    pagination: {
      showSizeChanger: true,
      current: 1,
      pageSize: 10,
    },
    dataSource: [],
    columns: [
      { title: '序号', dataIndex: 'applicant_num', key: 'applicant_num', },
      { title: '省市', dataIndex: 'province', key: 'province', },
      { title: '单位', dataIndex: 'company', key: 'company', },
      { title: '姓名', dataIndex: 'name', key: 'name', },
      { title: '手机', dataIndex: 'tel', key: 'tel', },
      { title: '支付方式', dataIndex: 'payment', key: 'payment' },
    ],
    loading: false,
  }
  componentDidMount () {
    let { course_id } = this.props
    course_id = course_id || getUrlID()
    if (course_id) {
      this.setState({ course_id }, () => {
        this.getList()
      })
      getSchedules({ course_id }).then((res) => {
        // 为空退出
        if (!res) return
        if (res.code === apiCode()) {
          this.setState({ schedulesList: res.data })
          let _array = res.data.map((item, index) => {
            let _record = {
              id: item.id,
              title: `${item.start_time} (${statusCategory[item.status]})`,
            }
            return {
              id: item.id,
              title: `${item.start_time} (${statusCategory[item.status]})`,
              dataIndex: 'checkin_info_data_' + index,
              key: 'checkin_info_data_' + index,
              width: 170,
              render: (text, record, index2) => <span>{(record['checkin_info_data_' + index] === 3) && <Button onClick={this.toCheck.bind(this, _record, record)}>签到</Button>}{record['checkin_info_data_' + index] === 1 && '无需签到'}{record['checkin_info_data_' + index] === 2 && '已签到'}</span>,
              filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
                <div className="custom-filter-dropdown txc" style={{ width: 150, padding: 12 }} >
                  <Button onClick={this.toAllCheck.bind(this, _record)}>全部签到</Button>
                </div>
              )
            }
          })
          let _columns = [...this.state.columns, ..._array]

          this.setState({ columns: _columns })

        } else {
          let _msg = res.msg || '服务器错误'
          message.info('错误：' + _msg)
        }
      })
    }
  }
  // 签到管理(签到人员列表)
  getList () {
    const { course_id, pager } = this.state
    let _data = { course_id }
    Object.assign(_data, pager)
    this.setState({ loading: true })
    getCheckin(_data).then(res => {
      // 为空退出
      if (!res) return
      if (res.code === apiCode()) {
        const pagination = { ...this.state.pagination };
        pagination.total = res.data.pager.count ? res.data.pager.count : 0
        let _data = res.data.list.map((item) => {
          if (item.checkin_info) {
            item.checkin_info.forEach((val, index) => {
              item['checkin_info_data_' + index] = val
            })
          }
          return item
        })

        this.setState({
          pager: res.data.pager,
          pagination,
          dataSource: _data,
        })
        this.setState({ loading: false })

      } else {
        let _msg = res.msg || '服务器错误'
        message.info('错误：' + _msg)
        this.setState({ loading: false })
      }
    })
  }
  // 全部签到
  toAllCheck = (record) => {
    postCheckAll({ schedule_id: record.id }).then((res) => {
      // 为空退出
      if (!res) return
      if (res.code === apiCode()) {
        message.info('签到成功')
        this.getList()
      } else {
        let _msg = res.msg || '服务器错误'
        message.info('错误：' + _msg)
        this.setState({ loading: false })
      }
    })
  }
  // 签到
  toCheck = (record1, record2) => {
    postCheck({ schedule_id: record1.id, applicant_id: record2.id }).then((res) => {
      // 为空退出
      if (!res) return
      if (res.code === apiCode()) {
        message.info('签到成功')
        this.getList()
      } else {
        let _msg = res.msg || '服务器错误'
        message.info('错误：' + _msg)
      }
    })
  }
  // 	分页、排序、筛选变化时触发
  handleTableChange = (pagination, filters, sorter) => {
    // 获取配置分页信息
    const _pagination = { ...this.state.pagination }
    // 获取组件内分页
    _pagination.current = pagination.current
    _pagination.pageSize = pagination.pageSize
    _pagination.total = pagination.total
    const _pager = { ...this.state.pager }
    _pager.page_num = pagination.current
    _pager.page_size = pagination.pageSize
    this.setState({
      pagination: _pagination,
      pager: _pager,
    }, () => {
      this.getList()
    })
  }
  // 导出
  toCheckinExport = () => {
    let { course_id } = this.props
    let { schedule_id } = this.state
    course_id = course_id || getUrlID()
    // token
    const token = localStorage.getItem("token")
    exportAPI('get_export_checkin', { course_id, schedule_id, token }, '签到管理', 'xls')
  }
  render () {
    const { dataSource, columns, pagination, loading } = this.state
    return (
      <div className='Autograph'>
        <div className='mb15 txr'>
          <Button className='ml15' onClick={this.toCheckinExport} icon="download">导出签到表</Button>
        </div>
        <Table className='table' rowKey={record => record.id} loading={loading} dataSource={dataSource} columns={columns} onChange={this.handleTableChange} pagination={pagination} />
      </div>
    );
  }
}

export default Autograph;