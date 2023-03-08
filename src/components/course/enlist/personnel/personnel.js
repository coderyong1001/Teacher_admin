/*
 * @Author: yuanhang 
 * @Date: 2019-10-31 17:37:17 
 * @Last Modified by: yuanhang
 * @Last Modified time: 2020-05-22 09:54:30
 */
// 人员列表
import React, { Component } from 'react';
// 引入
import './index.css'
// api
import { apiCode, getApplicant, postApplicant, exportAPI } from '../../../../api/index'
// 全局弹窗抽屉
import MyDrawer from '../../../myDrawer/myDrawer'
// 表单
import MyForm from '../../../myForm/myForm'
// 导出桌牌
import ExportCard from '../exportCard/exportCard'
// utils
import { getUrlID, setInitialValue, formatDate, getDistrict, getDistrictList, setDOMJsDate } from '../../../../utils/utils'
// 表单数据
import FormDOM from '../../../../utils/form_personnel'
// 导入组件
import { Button, Table, message, Row, Col, Checkbox, Tag } from 'antd'
let genderCategory = { 0: '男', 1: '女' }
let methodCategory = { 0: '线上', 1: '线下' }
let deleteCategory = { 0: '已支付', 1: '待支付', 2: '待审核', 3: '审核未通过', 4: '订单取消', 5: '退款审核中', 6: '退款已拒绝', 7: '已部分退款', 8: '已全部退款', 9: '订单已删除', 10: '审核已通过放款中' }
let paymentColor = { 0: 'green', 1: 'orange', 2: 'orange', 3: 'orange', 4: 'orange', 5: 'purple', 6: 'purple', 7: 'red', 8: 'red', 9: 'orange', 10: 'purple' }

class Personnel extends Component {
  state = {
    dataSource: [],
    defaultColumnsValue: [],
    scrollX: 2000,
    columns: [],
    defColumns: [
      { title: '省市', dataIndex: 'location', key: 'location', },
      { title: '单位', dataIndex: 'company', key: 'company', },
      { title: '单位地址', dataIndex: 'address', key: 'address', },
      { title: '姓名', dataIndex: 'name', key: 'name', },
      {
        title: '性别', dataIndex: 'gender', key: 'gender', render: (text, record, index) => {
          return genderCategory[record.gender]
        }
      },
      // { title: '出生年份', dataIndex: 'birth', key: 'birth', },
      { title: '证件号码', dataIndex: 'ID_number', key: 'ID_number', },
      { title: '部门', dataIndex: 'department', key: 'department', },
      { title: '职务', dataIndex: 'job_title', key: 'job_title', },
      { title: '最高学历毕业专业', dataIndex: 'profession', key: 'profession', },
      { title: '参加工作年份', dataIndex: 'work_exp', key: 'work_exp', },
      { title: '手机', dataIndex: 'tel', key: 'tel', },
      {
        title: '支付方式', dataIndex: 'pay_method', key: 'pay_method', render: (text, record, index) => {
          return <Tag className="mr0" color={paymentColor[record.payment_status]}>{methodCategory[record.payment_method]}（{deleteCategory[record.payment_status]}）</Tag>
        }
      },
      { title: '备注', dataIndex: 'comment', key: 'comment', },
    ],
    defId: [{
      title: '序号', dataIndex: 'applicant_num', key: 'applicant_num',
    }],
    defOperate: [{
      title: '操作', fixed: 'right', dataIndex: 'id', key: 'operate', width: 150, render: (text, record, index) => <span>
        <Button type="link" onClick={this.toEdit.bind(this, record)}>编辑</Button>
      </span>,
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div className="custom-filter-dropdown" style={{ width: 350, padding: 12 }} >
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
    course_id: null,
    pager: { page_size: 10, page_num: 1 },
    pagination: {
      showSizeChanger: true,
      current: 1,
      pageSize: 10,
    },
    visibleMyDrawer: false,
    stateFormDOM: [],
    recordID: null,
    loading: false,

    listOne: null,
    listTow: null,
    listThree: null,

    userIdData: null,
    visibleExportCard: false,
  }
  componentDidMount() {
    let { course_id } = this.props
    course_id = course_id || getUrlID()
    this.setState({ course_id }, () => {
      this.getList({ course_id: course_id })
    })
    // 初始化表格
    let columns = [...this.state.defId, ...this.state.defColumns, ...this.state.defOperate]
    this.setState({ columns })
    // 生成表头key数组
    this.setColumnsValue()
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
    let series = 150
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
  // 列表改变
  onColumnsChange = (checkedValues) => (checkedValues) => {
    if (checkedValues.length === 0) { return message.info('至少保留一项参数') }
    this.setColumns(checkedValues)
  }
  // 获取id
  getID = (array, fullname) => {
    let id = null
    array.forEach(item => {
      if (item.fullname === fullname) {
        return id = item.id
      }
    });
    return id
  }
  // 表单值改变监听
  onChange = (e, key, city, district) => {
    let _data = e.target ? e.target.value : e
    // 省选择时触发
    let listTow = null
    if (key === 'province') {
      let { listOne } = this.state
      let id = this.getID(listOne, e)
      listTow = getDistrictList(id)
      this.setState({ listTow })
      setDOMJsDate(FormDOM, 'city', { key: 'option', val: listTow })
      // 是否有下级数据
      this.childForm.toSetValue({ city: city || null, district: district || null })
      // 执行下级
      key = city ? 'city' : 'province'
    }
    // 市选择时触发
    if (key === 'city') {
      listTow = listTow || this.state.listTow
      let id = this.getID(listTow, city || e)
      let listThree = getDistrictList(id, 2)
      this.setState({ listThree })
      setDOMJsDate(FormDOM, 'district', { key: 'option', val: listThree })
      this.childForm.toSetValue({ district: district || null })
    }

    return _data
  }
  // 获取数据
  getList = (data) => {
    const { pager, course_id } = this.state
    data = data || { course_id }
    Object.assign(data, pager)
    this.setState({ loading: true })
    getApplicant(data).then(res => {
      // 为空退出
      if (!res) return
      if (res.code === apiCode()) {
        let _pagination = { ...this.state.pagination }
        _pagination.total = res.data.pager.count
        this.setState({ dataSource: res.data.list, pagination: _pagination })
        this.setState({ loading: false })
      } else {
        let _msg = res.msg || '服务器错误'
        message.info('错误：' + _msg)
        this.setState({ loading: false })
      }
    })
  }
  // 关闭抽屉
  onDrawerClose = () => {
    this.setState({ visibleMyDrawer: false })
  }
  // 关闭抽屉
  onDrawerExportCard = () => {
    this.setState({ visibleExportCard: !this.state.visibleExportCard })
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
  // 得到子组件
  MyForm = (ref) => {
    this.childForm = ref
    // 设置下拉
    let listOne = getDistrict()
    this.setState({ listOne }, () => {
      setDOMJsDate(FormDOM, 'province', { key: 'option', val: getDistrict() })
      // 获取编辑数据
      const { userIdData } = this.state

      // 填充数据
      let _province = userIdData.province || '北京市'
      this.onChange(_province, 'province', userIdData.city, userIdData.district)
    })
  }
  // 编辑
  toEdit = (record) => {
    let stateFormDOM = setInitialValue(record, FormDOM)
    this.setState({ userIdData: record, stateFormDOM, recordID: record.id }, () => {
      this.setState({ visibleMyDrawer: true })
    })
  }
  // 修改
  onModify = () => {
    // 获取表单数据
    let _data = this.childForm.toSuccess()
    if (_data.birth) {
      _data.birth = formatDate(new Date(_data.birth), 'yyyy')
    }
    if (_data.work_exp) {
      _data.work_exp = formatDate(new Date(_data.work_exp), 'yyyy')
    } else {
      delete _data.work_exp
    }
    Object.keys(_data).forEach(key => {
      if (!_data[key] && _data[key] !== 0 && _data[key] !== false) {
        delete _data[key]
      }
    })
    this.setState({ loading: true })
    postApplicant(_data, this.state.recordID).then((res) => {
      // 为空退出
      if (!res) return
      if (res.code === apiCode()) {
        message.info(res.msg)
        this.setState({ loading: false })
        this.onDrawerClose()
        this.getList()
      } else {
        let _msg = res.msg || '服务器错误'
        message.info('错误：' + _msg)
        this.setState({ loading: false })
      }
    })
  }
  // 导出表格
  toApplicantExport = () => {
    let { defaultColumnsValue } = this.state
    let { course_id } = this.props
    course_id = course_id || getUrlID()
    exportAPI('post_export_applicant', { course_id: course_id, key_lists: defaultColumnsValue }, '报名人员详情表', 'xls')
  }
  render() {
    const { dataSource, columns, pagination, visibleMyDrawer, stateFormDOM, recordID, loading, scrollX, visibleExportCard } = this.state
    let { course_id } = this.props
    return (
      <div className='Personnel'>
        <div className='btn mb15'>
          <Button className='ml15' onClick={this.onDrawerExportCard} icon="download">导出桌牌</Button>
        </div>
        <Table scroll={{ x: scrollX }} rowKey={record => record.id} dataSource={dataSource} columns={columns} onChange={this.handleTableChange} pagination={pagination} />
        {/* 修改金额 */}
        <MyDrawer onDrawerClose={this.onDrawerClose} titleText='编辑' drawerWidt={580} visible={visibleMyDrawer}>
          <MyForm key={recordID} onRef={this.MyForm} FormDOM={stateFormDOM} onChange={this.onChange} />
          <div className='mt15 txc'>
            <Button type="primary" onClick={this.onModify} loading={loading}>修改</Button>
          </div>
        </MyDrawer>
        {/* 导出桌牌 */}
        <MyDrawer onDrawerClose={this.onDrawerExportCard} titleText='导出桌牌' drawerWidt={580} visible={visibleExportCard}>
          <ExportCard course_id={course_id} />
        </MyDrawer>
      </div>
    );
  }
}

export default Personnel;