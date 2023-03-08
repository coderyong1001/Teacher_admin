import React, { Component } from 'react';
// api
import { apiCode, getBookingInfo, getBookingHotels, exportAPI } from '../../../../api/index'
// utils
import { getUrlID } from '../../../../utils/utils'
// 封装单选项
import MyRadio from '../../../radio/index'
// 导入组件
import { Button, Table, message, Row, Col, Checkbox, Tag, } from 'antd'
import './index.css'

let mode_option = [
  { value: -1, label: '全部' },
  { value: 0, label: '线上支付' },
  { value: 1, label: '线下支付(其它支付)' },
]
let type_option = [
  { value: -1, label: '全部' },
  { value: 0, label: '已支付(已审核)' },
  { value: 1, label: '待支付（待审核）' },
  { value: 2, label: '订单取消' },
  { value: 3, label: '申请退款' },
  { value: 4, label: '已退款' },
]
let genderCategory = { 0: '男', 1: '女' }
let methodCategory = { 0: '线上', 1: '线下' }
let payment = { 0: '已支付', 1: '待支付', 2: '待审核', 3: '审核未通过', 4: '订单取消', 5: '退款审核中', 6: '退款已拒绝', 7: '已部分退款', 8: '已全部退款', 9: '订单已删除', 10: '审核已通过放款中' }
let paymentColor = { 0: 'green', 1: 'orange', 2: 'orange', 3: 'orange', 4: 'orange', 5: 'purple', 6: 'purple', 7: 'red', 8: 'red', 9: 'orange', 10: 'purple' }

class EnlistHotel extends Component {
  state = {
    hotel_id: -1,
    payment_method: -1,
    payment_status: -1,
    scrollX: 2000,
    dataSource: [],
    defaultColumnsValue: [],
    columns: [],
    defColumns: [
      { title: '订单号', dataIndex: 'order_number', key: 'order_number', },
      { title: '发起人', dataIndex: 'create_user', key: 'create_user', },
      {
        title: '支付状态', dataIndex: 'pay_status', key: 'pay_status', render: (text, record, index) => {
          return <Tag className="mr0" color={paymentColor[record.payment_status]}>{methodCategory[record.payment_method]}（{payment[record.payment_status]}）</Tag>
        }
      },
      { title: '报名人数', dataIndex: 'applicant_number', key: 'applicant_number', },
      { title: '发起人单位', dataIndex: 'user_company', key: 'user_company', },
    ],
    defId: [{
      title: 'id', dataIndex: 'id', width: 100, key: 'id',
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div className="custom-filter-dropdown" style={{ width: 240, padding: 12 }} >
          <Row gutter={12}>
            <Checkbox.Group value={this.state.defaultColumnsValue} onChange={this.onColumnsChange()}>
              {this.state.defColumns.map((item, index) => {
                return <Col key={item.key} span={12}>
                  <Checkbox value={item.key}>{item.title}</Checkbox>
                </Col>
              })}
            </Checkbox.Group>
            <Col span={24} className='txc'>
              <Button onClick={this.toColumnsReset} icon="check">全选</Button>
              <Button className='ml15' onClick={this.toApplicantExport} icon="download">导出</Button>
            </Col>
          </Row>
        </div>
      )
    }],
    defOperate: [
      {
        title: () => {
          return '双人间' + ((this.state.hotel_list && this.state.hotel_list[this.state.hotel_id] && this.state.hotel_list[this.state.hotel_id][2]) ? ' (￥' + this.state.hotel_list[this.state.hotel_id][2] + ')' : '')
        }, children: [
          {
            title: '住宿时间',
            dataIndex: 'doubleDate',
            key: 'doubleDate',
            render: (text, record, index) => {
              return ((record && record.room_info_obj && record.room_info_obj[2]) ? <div>
                <span>入住{record.room_info_obj[2].checkin}</span>
                <br />
                <span>离店{record.room_info_obj[2].checkout}</span>
              </div> : '')
            }
          },
          {
            title: '数量',
            dataIndex: 'double', key: 'double',
            render: (text, record, index) => {
              return ((record && record.room_info_obj && record.room_info_obj[2]) ? <div>
                {record.room_info_obj[2].num}
              </div> : '')
            }
          },
        ]
      },
      {
        title: () => {
          return '单人间' + ((this.state.hotel_list && this.state.hotel_list[this.state.hotel_id] && this.state.hotel_list[this.state.hotel_id][1]) ? ' (￥' + this.state.hotel_list[this.state.hotel_id][1] + ')' : '')
        }, children: [
          {
            title: '住宿时间',
            dataIndex: 'singleDate',
            key: 'singleDate',
            render: (text, record, index) => {
              return ((record && record.room_info_obj && record.room_info_obj[1]) ? <div>
                <span>入住{record.room_info_obj[1].checkin}</span>
                <br />
                <span>离店{record.room_info_obj[1].checkout}</span>
              </div> : '')
            }
          },
          {
            title: '数量',
            dataIndex: 'single', key: 'single',
            render: (text, record, index) => {
              return ((record && record.room_info_obj && record.room_info_obj[1]) ? <div>
                {record.room_info_obj[1].num}
              </div> : '')
            }
          },
        ]
      },
      {
        title: () => {
          return '单男' + ((this.state.hotel_list && this.state.hotel_list[this.state.hotel_id] && this.state.hotel_list[this.state.hotel_id][3]) ? ' (￥' + this.state.hotel_list[this.state.hotel_id][3] + ')' : '')
        }, children: [
          {
            title: '住宿时间',
            dataIndex: 'manDate',
            key: 'manDate',
            render: (text, record, index) => {
              return ((record && record.room_info_obj && record.room_info_obj[3]) ? <div>
                <span>入住{record.room_info_obj[3].checkin}</span>
                <br />
                <span>离店{record.room_info_obj[3].checkout}</span>
              </div> : '')
            }
          },
          {
            title: '数量',
            dataIndex: 'man', key: 'man',
            render: (text, record, index) => {
              return ((record && record.room_info_obj && record.room_info_obj[3]) ? <div>
                {record.room_info_obj[3].num}
              </div> : '')
            }
          },
        ]
      },
      {
        title: () => {
          return '单女' + ((this.state.hotel_list && this.state.hotel_list[this.state.hotel_id] && this.state.hotel_list[this.state.hotel_id][4]) ? ' (￥' + this.state.hotel_list[this.state.hotel_id][4] + ')' : '')
        }, children: [
          {
            title: '住宿时间',
            dataIndex: 'womanDate',
            key: 'womanDate',
            render: (text, record, index) => {
              return ((record && record.room_info_obj && record.room_info_obj[4]) ? <div>
                <span>入住{record.room_info_obj[4].checkin}</span>
                <br />
                <span>离店{record.room_info_obj[4].checkout}</span>
              </div> : '')
            }
          },
          {
            title: '数量',
            dataIndex: 'woman', key: 'woman',
            render: (text, record, index) => {
              return ((record && record.room_info_obj && record.room_info_obj[4]) ? <div>
                {record.room_info_obj[4].num}
              </div> : '')
            }
          },
        ]
      },
      {
        title: '备注', dataIndex: 'hotel_note', key: 'hotel_note'
      }],
    expandedColumns: [
      { title: '省市', dataIndex: 'province', key: 'province', },
      { title: '单位', dataIndex: 'company', key: 'company', },
      { title: '名字', dataIndex: 'name', key: 'name', },
      {
        title: '性别', dataIndex: 'gender', key: 'gender', render: (text, record, index) => {
          return genderCategory[record.gender]
        }
      },
      { title: '部门', dataIndex: 'department', key: 'department', },
      { title: '职务', dataIndex: 'job_title', key: 'job_title', },
      { title: '手机号码', dataIndex: 'tel', key: 'tel', },
      {
        title: '状态', dataIndex: 'refund_status', key: 'refund_status', render: (text, record, index) => {
          return <Tag className="mr0" color={paymentColor[record.refund_status]}>{payment[record.refund_status]}</Tag>
        }
      },],
    hotel_option: [{ value: -1, label: '全部' }],
    pager: { page_size: 10, page_num: 1 },
    pagination: {
      showSizeChanger: true,
      current: 1,
      pageSize: 10,
    },
  }
  componentDidMount() {
    // 初始化表格
    let columns = [...this.state.defId, ...this.state.defColumns, ...this.state.defOperate]
    this.setState({ columns })
    this.setColumnsValue()
    // 获取 获取日期、酒店名称
    this.getInfo()
  }
  // 获取 获取日期、酒店名称
  getInfo = () => {
    let { course_id } = this.props
    course_id = course_id || getUrlID()
    getBookingInfo({ course_id }).then(res => {
      // 为空退出
      if (!res) return
      if (res.code === apiCode()) {
        let data = res.data
        if (!data || data.length === 0) return
        // 酒店
        let hotel_option = [{ value: -1, label: '未选住宿' }]
        let hotel_list = {}
        data.forEach(item => {
          hotel_option.push({ value: item.hotel_id, label: item.name })
          let _room_info = {}
          item.room_info.forEach(info => {
            _room_info[info.config] = info.price
          })
          hotel_list[item.hotel_id] = _room_info
        })
        let hotel_id = data[0].hotel_id ? data[0].hotel_id : -1
        this.setState({ hotel_list, hotel_option, hotel_id }, () => {
          if (hotel_id === -1) { return message.info('暂无住宿') }
          this.getList()
        })
      } else {
        let _msg = res.msg || '服务器错误'
        message.info('错误：' + _msg)
      }
    })
  }
  setRoomInfo = (config) => {
    switch (config) {
      case 1:
        return 'single'
      case 2:
        return 'double'
      case 3:
        return 'man'
      case 4:
        return 'woman'
      default:
        break;
    }
  }
  // 获取列表
  getList = () => {
    let { hotel_id, payment_method, payment_status, pager } = this.state
    let { course_id } = this.props
    course_id = course_id || getUrlID()

    let data = {
      course_id,
      hotel_id,
      payment_method,
      payment_status,
      page_size: pager.page_size,
      page_num: pager.page_num,
    }
    getBookingHotels(data).then(res => {
      // 为空退出
      if (!res) return
      if (res.code === apiCode()) {
        let data = res.data
        let _pagination = { ...this.state.pagination }
        _pagination.total = data.pager.componentDidMount

        let dataSource = data.list.map(item => {
          let room_info_obj = {}
          item.room_info.forEach(info => {
            room_info_obj[info.config] = info
          })
          if (!item.room_info_obj) { item.room_info_obj = {} }
          item.room_info_obj = room_info_obj
          return item
        })
        this.setState({ dataSource, pagination: _pagination, })
      } else {
        let _msg = res.msg || '服务器错误'
        message.info('错误：' + _msg)
      }
    })
  }
  toList = () => {
    this.setState({
      pager: { page_size: 10, page_num: 1 }, pagination: { showSizeChanger: true, current: 1, pageSize: 10, }
    }, () => {
      this.getList()
    })
  }
  setHotel_option = (value) => {
    this.setState({ hotel_id: value }, () => {
      // if (value !== -1) {
      //   message.info('暂无预定信息')
      //   this.setState({ dataSource: [] })
      //   return
      // }
      this.toList()
    })
  }
  setMode_option = (value) => {
    this.setState({ payment_method: value, }, () => {
      this.toList()
    })
  }
  setType_option = (value) => {
    this.setState({ payment_status: value, }, () => {
      this.toList()
    })
  }

  onColumnsChange = (checkedValues) => (checkedValues) => {
    this.setColumns(checkedValues)
  }
  // 生成表头key数组
  setColumnsValue = () => {
    let defaultColumnsValue = this.state.defColumns.map(item => {
      return item.key
    })
    this.setState({ defaultColumnsValue })
  }
  // 重置
  toColumnsReset = () => {
    let defaultColumnsValue = this.state.defColumns.map(item => {
      return item.key
    })
    this.setColumns(defaultColumnsValue)
    this.setColumnsValue()
  }
  // 设置表格
  setColumns = (checkedValues) => {
    const { defId, defColumns, defOperate } = this.state
    let series = 30
    this.setState({ defaultColumnsValue: checkedValues })
    // 先拿表头
    let columns = []
    columns = [...columns, ...defId]
    // 筛选内容
    defColumns.forEach((r, index) => {
      checkedValues.forEach(rs => {
        if (r.key === rs) {
          columns.push(r)
        }
      })
    })
    columns = [...columns, ...defOperate]
    // 动态宽度
    let seriesX = series * (defColumns.length - (columns.length - 2))
    let _scrollX = (2000 - seriesX)
    this.setState({ columns, scrollX: _scrollX })
  }
  toApplicantExport = () => {
    let { hotel_id, payment_method, payment_status, defaultColumnsValue } = this.state
    let { course_id } = this.props
    course_id = course_id || getUrlID()
    exportAPI('post_export_booking', { course_id, hotel_id, payment_method, payment_status, key_lists: defaultColumnsValue }, '酒店信息查询', 'xls')
  }

  // 嵌套表格
  expandedRowRender = (record, ) => {
    return <Table rowKey={record => record.id} dataSource={record.applicant_info ? record.applicant_info : []} columns={this.state.expandedColumns} pagination={false} />
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
    }, () => { this.getList() })
  }
  render() {
    const { hotel_id, payment_method, payment_status, columns, scrollX, dataSource, hotel_option, pagination } = this.state

    return (
      <div>
        <Button type="primary" className='exportBtn' onClick={this.toApplicantExport}> 导出 </Button>
        <MyRadio label={'酒店选择：'} itemLits={hotel_option} onChange={this.setHotel_option} defaultValue={hotel_id} />
        <MyRadio label={'支付方式：'} itemLits={mode_option} onChange={this.setMode_option} defaultValue={payment_method} />
        <MyRadio label={'支付状态：'} itemLits={type_option} onChange={this.setType_option} defaultValue={payment_status} />
        {/* 列表 */}
        <Table bordered scroll={{ x: scrollX }} rowKey={record => record.id} columns={columns} dataSource={dataSource} expandedRowRender={this.expandedRowRender} onChange={this.handleTableChange} pagination={pagination}></Table>

      </div>
    );
  }
}

export default EnlistHotel;