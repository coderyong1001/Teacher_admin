/*
 * @Author: yuanhang 
 * @Date: 2019-10-14 11:03:08 
 * @Last Modified by: yuanhang
 * @Last Modified time: 2020-06-03 17:39:52
 */
// 用户管理
import React, { Component } from 'react';
// api
import { apiCode, getUser, exportAPI, putUser, getUserID } from '../../api/index'
// 引入腾讯全部行政区划数据
import { districtList } from '../../utils/qq_district_list'
// 封装单选项
import MyRadio from '../../components/radio/index'
// 全局弹窗抽屉
import MyDrawer from '../../components/myDrawer/myDrawer'
import MyForm from '../../components/myForm/myForm'
// utils
import { formatDate, getDistrict, getDistrictList, setDOMJsDate, setInitialValue } from '../../utils/utils'
// 表单数据
import FormDOM from '../../utils/form_user'
// 布局
import Layouts from '../../components/layouts/index'
// 导入组件
import { Button, Input, Table, message, Select, Checkbox, Row, Col } from 'antd'
const { Search } = Input
const { Option } = Select

let genderCategory = { 0: '男', 1: '女' }

class User extends Component {
  state = {
    dataSource: [],
    defaultColumnsValue: [],
    scrollX: 2000,
    columns: [],
    defColumns: [
      { title: '省市', dataIndex: 'location', key: 'location', sorter: true, },
      { title: '单位', dataIndex: 'company', key: 'company', sorter: true, },
      { title: '单位地址', dataIndex: 'address', key: 'address', },
      { title: '姓名', dataIndex: 'name', key: 'name', sorter: true, },
      // { title: '出生日期', dataIndex: 'birth', key: 'birth', },
      { title: '身份证号码', dataIndex: 'ID_number', key: 'ID_number', },
      {
        title: '性别', width: 65, dataIndex: 'gender', key: 'gender', render: (text, record, index) => {
          return genderCategory[record.gender]
        }
      },
      { title: '最高学历毕业专业', dataIndex: 'profession', key: 'profession', },
      {
        title: '参加工作年份', dataIndex: 'work_exp', key: 'work_exp',
      },
      { title: '手机号', width: 120, dataIndex: 'tel', key: 'tel', },
      { title: '部门', dataIndex: 'department', key: 'department', },
      { title: '职务', dataIndex: 'job_title', key: 'job_title', },
      { title: '最后登录', dataIndex: 'last_active_time', key: 'last_active_time', }
    ],
    defId: [{
      title: '序号', dataIndex: 'data_num', key: 'data_num',
    }],
    defOperate: [{
      title: '操作', fixed: 'right', dataIndex: 'id', key: 'operate', width: 150, render: (text, record, index) => <span>
        {<Button type="link" onClick={this.toEdit.bind(this, record)}>编辑</Button>}
      </span>,
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
              <Button className='ml15' onClick={this.toExportUser} icon="download">导出</Button>
            </Col>
          </Row>
        </div>
      )
    }],
    genderList: [
      { value: -1, label: '全部' },
      { value: 0, label: '男' },
      { value: 1, label: '女' },
    ],
    gender: -1,
    pager: { page_size: 10, page_num: 1 },
    pagination: {
      showSizeChanger: true,
      current: 1,
      pageSize: 10,
    },
    loading: false,
    search: null,
    stateFormDOM: [],
    visibleMyDrawer: false,
    recordID: null,

    listOne: null,
    listTow: null,
    listThree: null,
    provincesList: null,
    province: null,

    userIdData: null,
  }
  componentDidMount() {
    // 初始化表格
    let columns = [...this.state.defId, ...this.state.defColumns, ...this.state.defOperate]
    this.setState({ columns })
    // 生成表头key数组
    this.setColumnsValue()
    this.getList()
    // 获取全部区域数据
    if (!districtList) return
    let provincesList = districtList[0]
    this.setState({ provincesList })
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
  // 获取数据
  getList = (data) => {
    const { pager, search, gender, province } = this.state
    let _genderValue = gender === -1 ? null : gender
    data = data || { search, gender: _genderValue, province }
    Object.assign(data, pager)
    data = { ...data, ...{ search, gender: _genderValue, province } }
    this.setState({ loading: true })
    getUser(data).then((res) => {
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
  // 搜索
  setSearchValue = (e) => {
    let _data = e.target ? e.target.value : e
    this.setState({ search: _data })
  }
  inputOnBlur = (e) => {
    let _data = e.target ? e.target.value : e
    // 去首尾空格
    if (typeof (_data) == 'string' && _data) {
      _data = _data.replace(/(^\s*)|(\s*$)/g, "")
    }
    this.setState({ search: _data })
  }
  // 重置
  toReset = () => {
    this.setState({
      search: null,
      pager: { page_size: 10, page_num: 1 },
      pagination: {
        showSizeChanger: true,
        current: 1,
        pageSize: 10,
      }
    }, () => { this.getList() })
  }
  // 搜索
  toSearch = () => {
    this.setState({
      pager: { page_size: 10, page_num: 1 },
      pagination: {
        showSizeChanger: true,
        current: 1,
        pageSize: 10,
      }
    }, () => { this.getList() })
  }
  // 导出
  toExportUser = () => {
    let { gender, province, defaultColumnsValue } = this.state
    let data = {
      gender_filter: gender === -1 ? 2 : gender,
      province_filter: province,
      key_lists: defaultColumnsValue,
    }
    Object.keys(data).forEach(key => {
      if (data[key] !== 0 && !data[key]) {
        delete data[key]
      }
    })
    exportAPI('post_export_user_info', data, '用户管理表', 'xls')
  }
  // 	分页、排序、筛选变化时触发
  handleTableChange = (pagination, filters, sorter) => {
    // 获取配置分页信息
    let _pagination = { ...this.state.pagination }
    // 获取组件内分页
    _pagination.current = pagination.current;
    _pagination.pageSize = pagination.pageSize;
    _pagination.total = pagination.total;
    let pager = { page_size: pagination.pageSize, page_num: pagination.current }
    this.setState({
      pagination: _pagination,
      pager: pager,
    }, () => {
      let _data = this.getSorter(sorter)
      this.getList(_data)
    })
  }
  // 获取排序数据
  getSorter = (sorter) => {
    if (!sorter.order) {
      return {}
    }
    return {
      ordering: sorter.order === "descend" ? "desc" : "asc",
      ordering_field: sorter.field === "location" ? "province" : sorter.field
    }
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
  // 关闭抽屉
  onDrawerClose = () => {
    this.setState({ visibleMyDrawer: false })
  }
  // 编辑
  toEdit = (record) => {
    getUserID(record.id).then((res) => {
      // 为空退出
      if (!res) return
      if (res.code === apiCode()) {
        let _data = res.data
        if (!_data) { return message.info('查看信息获取异常') }
        let stateFormDOM = setInitialValue(_data, FormDOM)
        this.setState({ userIdData: _data, stateFormDOM, recordID: record.id }, () => {
          this.setState({ visibleMyDrawer: true })
        })
      } else {
        let _msg = res.msg || '服务器错误'
        message.info('错误：' + _msg)
        this.setState({ loading: false })
      }
    })
  }
  // 修改
  onModify = () => {
    // 获取表单数据
    let _data = {}
    _data = { ...this.childForm.toSuccess() }
    if (!_data || !Object.keys(_data).length) { return }
    if (_data.work_exp) {
      _data.work_exp = formatDate(new Date(`${_data.work_exp}`), 'yyyy')
    } else {
      delete _data.work_exp
    }
    this.setState({ loading: true })
    putUser(_data, this.state.recordID).then((res) => {
      // 为空退出
      if (!res) return
      if (res.code === apiCode()) {
        message.info('成功')
        this.setState({ loading: false })
        this.setState({ visibleMyDrawer: false }, () => {
          this.getList()
        })
      } else {
        let _msg = res.msg || '服务器错误'
        message.info('错误：' + _msg)
        this.setState({ loading: false })
      }
    })
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
    // 区选择时触发
    if (key === 'district') {
    }
    return _data
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
  // 性别筛选
  setGenderValue = (value) => {
    this.setState({
      gender: value,
      pager: { page_size: 10, page_num: 1 },
      pagination: {
        showSizeChanger: true,
        current: 1,
        pageSize: 10,
      }
    }, () => {
      this.toSearch()
    })
  }
  // 省份赛选
  provincesChange = (value) => {
    this.setState({
      province: value,
      pager: { page_size: 10, page_num: 1 },
      pagination: {
        showSizeChanger: true,
        current: 1,
        pageSize: 10,
      }
    }, () => {
      this.toSearch()
    })
  }
  render() {
    const { scrollX, dataSource, columns, search, pagination, visibleMyDrawer, stateFormDOM, loading, genderList, gender, provincesList, province, recordID } = this.state
    return (
      <Layouts pathname={this.props}>
        <div className='search mb15'>
          <Search className='input' placeholder="输入单位名称、地址、姓名、职教专业、手机号" style={{ width: 400 }} onChange={this.setSearchValue} onBlur={this.inputOnBlur} value={search} onSearch={value => this.toSearch(value)} enterButton />
          {/* <Button type="primary" className='ml15' onClick={this.toSearch} icon="search">搜索</Button> */}
          <Button className='ml15' onClick={this.toReset} icon="reload">重置</Button>
          {/* <Button className='ml15' onClick={this.toExportUser} icon="download">导出</Button> */}
        </div>
        <div className='search mb15'>
          <MyRadio label={'性别：'} itemLits={genderList} onChange={this.setGenderValue} defaultValue={gender} />
          <span className='label'>省市：</span>
          <Select getPopupContainer={triggerNode => triggerNode.parentNode} onChange={this.provincesChange} value={province} style={{ width: 120 }}>
            <Option value={null}>全部</Option>
            {provincesList && provincesList.map(item => {
              return <Option key={item.id} value={item.name}>{item.name}</Option>
            })}
          </Select>
        </div>
        {dataSource && <Table scroll={{ x: scrollX }} className='table' rowKey={record => record.id} dataSource={dataSource} pagination={pagination} columns={columns} onChange={this.handleTableChange} />}
        <MyDrawer onDrawerClose={this.onDrawerClose} titleText='编辑' drawerWidt={600} visible={visibleMyDrawer}>
          <MyForm key={recordID} onChange={this.onChange} onRef={this.MyForm} FormDOM={stateFormDOM} />
          <br />
          <p style={{ color: 'red' }}>*注意：修改手机号之后需要用户在72小时之内用新手机登录一次小程序，否则会自动回复成修改前状态</p>
          <div className='mt15 txc'>
            <Button type="primary" onClick={this.onModify} loading={loading}>修改</Button>
          </div>
        </MyDrawer>
      </Layouts>
    );
  }
}

export default User;