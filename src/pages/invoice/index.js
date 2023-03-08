/*
 * @Author: yuanhang 
 * @Date: 2019-12-20 17:56:30 
 * @Last Modified by: yuanhang
 * @Last Modified t
 * ime: 2019-12-23 15:49:24
 */
import React, { Component } from 'react'
// 引入css
import './index.css'
// 全局弹窗抽屉
import MyDrawer from '../../components/myDrawer/myDrawer'
// 上传
import MyFileUpload from '../../components/myFileUpload/myFileUpload'
// 通用表单
import MyForm from '../../components/myForm/myForm'

// 表单配置
import FormDOM from '../../utils/form_invoice_revise'
// 表单配置
import { setInitialValue } from '../../utils/utils'
// api
import { apiCode, getInvoiceInfo, getInvoiceInfoID, putInvoiceInfoID, deleteInvoiceInfoID, invoice_info_upload, exportAPI } from '../../api/index'
// 布局
import Layouts from '../../components/layouts/index'

// 导入组件
import { Button, Input, message, Table, Row, Col, Checkbox, Modal } from 'antd'
const { Search } = Input
const { confirm } = Modal;

class Invoice extends Component {
  state = {
    fileList: [],
    visibleMyDrawer: null,
    pager: { page_size: 10, page_num: 1 },
    pagination: {
      showSizeChanger: true,
      current: 1,
      pageSize: 10,
    },
    search: null,
    dataSource: [],

    defaultColumnsValue: [],
    scrollX: 1500,
    columns: [],
    defColumns: [
      { title: '省市', dataIndex: 'province', key: 'province', },
      { title: '抬头', dataIndex: 'title', key: 'title', },
      { title: '税号', dataIndex: 'tax_number', key: 'tax_number', },
      { title: '地址及电话', dataIndex: 'addr_tel', key: 'addr_tel', },
      { title: '开户行及账号', dataIndex: 'bank_account', key: 'bank_account', },
    ],
    defId: [],
    defOperate: [{
      title: '管理操作', fixed: 'right', dataIndex: 'id', key: 'operation', width: 250, render: (text, record, index) => <span>
        <Button type="link" className='mr15' onClick={this.toRevise.bind(this, record.id)}>修改</Button>
        <Button type="link" onClick={this.toDelete.bind(this, record)}>删除</Button>
      </span>,
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div className="custom-filter-dropdown" style={{ width: 300, padding: 12 }} >
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
              <Button className='ml15' onClick={this.toExport} icon="download">导出</Button>
            </Col>
          </Row>
        </div>
      )
    }],
    recordID: null,
    stateFormDOM: null,

  }
  componentDidMount() {
    // 初始化表格
    let columns = [...this.state.defId, ...this.state.defColumns, ...this.state.defOperate]
    this.setState({ columns })
    // 生成表头key数组
    this.setColumnsValue()

    this.getList()

  }
  // 生成表头key数组
  setColumnsValue = () => {
    let defaultColumnsValue = this.state.defColumns.map(item => {
      return item.key
    })
    let index = defaultColumnsValue.indexOf('email')
    defaultColumnsValue.splice(index, 1)
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
    let series = 208
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
    let _scrollX = (1500 - seriesX)
    this.setState({ columns, scrollX: _scrollX })
  }
  // 列表改变
  onColumnsChange = (checkedValues) => (checkedValues) => {
    if (checkedValues.length === 0) { return message.info('至少保留一项参数') }
    this.setColumns(checkedValues)
  }
  // 获取数据
  getList = (data) => {
    let { search, pager } = this.state
    let _data = data || { search }
    Object.assign(_data, pager)
    _data = { ..._data, ...{ search } }
    this.setState({ loading: true })
    getInvoiceInfo(_data).then((res) => {
      // 为空退出
      if (!res) return
      if (res.code === apiCode()) {
        const pagination = { ...this.state.pagination };
        pagination.total = res.data.pager.count ? res.data.pager.count : 0
        this.setState({
          pager: res.data.pager,
          pagination,
          dataSource: res.data.list,
        })
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
    this.setState({ visibleMyDrawer: !this.state.visibleMyDrawer })
  }
  // 更新数据
  onRenewInvoice = () => {
    this.onDrawerClose()
    // 重置内容
    this.toReset()
  }
  // 搜索
  setSearch = (e) => {
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
  // 搜索
  toSearch = () => {
    let { search } = this.state
    if (!search) { return }
    this.setState({ pager: { page_size: 10, page_num: 1 }, pagination: { showSizeChanger: true, current: 1, pageSize: 10, } }, () => {
      this.getList()
    })
  }
  // 重置
  toReset = () => {
    let pager = { page_size: 10, page_num: 1 }
    let pagination = { showSizeChanger: true, current: 1, pageSize: 10, }
    this.setState({ search: null, pager, pagination }, () => {
      this.getList()
    })
  }
  // 导出发票信息
  toExport = () => {
    let { defaultColumnsValue } = this.state
    exportAPI('post_export_manager', { key_lists: defaultColumnsValue }, '发票信息表', 'xls')
  }
  // 修改
  toRevise = (id) => {
    getInvoiceInfoID(id).then((res) => {
      // 为空退出
      if (!res) return
      if (res.code === apiCode()) {
        let stateFormDOM = setInitialValue(res.data, FormDOM)
        this.setState({ stateFormDOM, recordID: id, visibleMyDrawer: !this.state.visibleMyDrawer })
      } else {
        let _msg = res.msg || '服务器错误'
        message.info('错误：' + _msg)
        this.setState({ loading: false })
      }
    })
  }
  // 删除
  toDelete = ({ id, title }) => {
    if (!id && !title) { return }
    let vm = this
    confirm({
      title: '删除确认',
      content: `是否删除${title}？`,
      onOk() {
        deleteInvoiceInfoID(id).then((res) => {
          // 为空退出
          if (!res) return
          if (res.code === apiCode()) {
            message.info(`删除成功${title}`)
            vm.toReset()
          } else {
            let _msg = res.msg || '服务器错误'
            message.info('错误：' + _msg)
            vm.setState({ loading: false })
          }
        })
      },
      onCancel() { },
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
    }, () => { this.getList() })
  }
  // 得到子组件
  MyForm = (ref) => {
    this.childForm = ref
  }
  // 确定修改
  confirmRevision = () => {
    let data = this.childForm.toSuccess()
    if (!data) { return }
    Object.keys(data).forEach(key => {
      if (!data[key] && data[key] !== 0 && data[key] !== false) {
        delete data[key]
      }
    })
    putInvoiceInfoID(data, this.state.recordID).then((res) => {
      // 为空退出
      if (!res) return
      if (res.code === apiCode()) {
        let _msg = res.msg || '修改成功'
        message.info(_msg)
        this.onDrawerClose()
        this.toReset()
      } else {
        let _msg = res.msg || '服务器错误'
        message.info('错误：' + _msg)
      }
    })

  }
  // 下载模版
  download = () => {
    exportAPI('get_excel_template', { name: 'invoice' }, '发票导入模板', 'xls')
  }
  // 导入返回值
  onGetFileDate = (data, response) => {
    if (response && response.msg) {
      message.info(response.msg)
    }
    let _data = data.slice(-1)
    this.setState({
      fileList: _data
    })
    if (!_data || _data.length === 0) { return }
    this.getList()
  }
  render() {
    let { search, dataSource, columns, pagination, visibleMyDrawer, stateFormDOM, recordID, fileList, scrollX } = this.state
    return (
      <Layouts pathname={this.props}>
        <Row gutter={24}>
          <Col span={24} className='mb15'>
            <Search style={{ width: '200px' }} placeholder='搜索' onChange={this.setSearch} onBlur={this.inputOnBlur} value={search} onSearch={value => this.toSearch(value)} enterButton />
            {/* <Button className='ml15' type="primary" onClick={this.toSearch} icon="search">搜索</Button> */}
            <Button className='ml15' onClick={this.toReset} icon="reload">重置</Button>
          </Col>
          <Col span={24} className='txr mb15'>
            {/* <Button className='ml15' type="primary" onClick={this.toExport}>导出发票信息</Button> */}
            <MyFileUpload onReturnDate={this.onGetFileDate} fileList={fileList} btnName='导入发票信息' dataName='excel' action={invoice_info_upload()} isSingle={true} />
            <Button className='ml15' onClick={this.download} icon="download">模版下载</Button>
          </Col>
          <Col span={24} className='txr mb15'>
            {/* <MyFileUpload onReturnDate={this.onGetFileDate} fileList={fileList} btnName='导入发票信息' dataName='excel' action={invoice_info_upload()} isSingle={true} /> */}
          </Col>
          <Col span={24}>
            <Table rowKey={record => record.id} dataSource={dataSource} columns={columns} scroll={{ x: scrollX }} onChange={this.handleTableChange} pagination={pagination} />
          </Col>
        </Row>
        {/* 修改 */}
        <MyDrawer onDrawerClose={this.onDrawerClose} titleText='修改' drawerWidt={750} visible={visibleMyDrawer}>
          <div className='Invoice'>
            {/* 修改 */}
            {stateFormDOM && <MyForm key={recordID} onRef={this.MyForm} FormDOM={stateFormDOM} onChange={this.onChange}></MyForm>}
          </div>
          <br />
          <Button className='ml15' type="primary" onClick={this.confirmRevision}>确定修改</Button>
        </MyDrawer>
      </Layouts>
    );
  }
}

export default Invoice;