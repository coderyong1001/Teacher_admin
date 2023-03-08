import React, { Component } from 'react';
// api
import { apiCode, getInvoiceInfo } from '../../../../../api/index'
// 导入组件
import { Table, message, Input, Button } from 'antd';
const { Search } = Input

class InvoiceList extends Component {
  state = {
    columns: [
      { title: '省市', dataIndex: 'province', key: 'province', },
      { title: '抬头', dataIndex: 'title', key: 'title', },
      { title: '税号', dataIndex: 'tax_number', key: 'tax_number', },
      { title: '地址及电话', dataIndex: 'addr_tel', key: 'addr_tel', },
      { title: '开户行及账号', dataIndex: 'bank_account', key: 'bank_account', },
      { title: '邮箱', dataIndex: 'email', key: 'email', },
    ],
    dataSource: [],
    pager: { page_size: 10, page_num: 1 },
    pagination: {
      showSizeChanger: true,
      current: 1,
      pageSize: 10,
    },
    search: null,
    selectedRows: null,
  }
  static defaultProps = {
    onRef: () => console.log('Basics组件回调函数'),
    onInvoiceData: () => console.log('InvoiceList组件回调函数'),
  }
  componentDidMount() {
    this.props.onRef(this)
    this.getList()
  }
  // 父级搜索
  toSonSearch = (tax_number) => {
    this.setState({ search: tax_number, selectedRows: null }, () => {
      this.toSearch()
    })
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
  rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      this.setState({ selectedRows })
    }
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
    this.setState({ selectedRows: null, pager: { page_size: 10, page_num: 1 }, pagination: { showSizeChanger: true, current: 1, pageSize: 10, } }, () => {
      this.getList()
    })
  }
  // 提交
  toSubmit = () => {
    let { selectedRows } = this.state;
    this.props.onInvoiceData(selectedRows[0]);
  }
  render() {
    let { dataSource, columns, pagination, search, selectedRows } = this.state
    return (
      <div>
        <Search style={{ width: '200px' }} placeholder='搜索' onChange={this.setSearch} onBlur={this.inputOnBlur} value={search} onSearch={value => this.toSearch(value)} enterButton />
        <br />
        <br />
        <Table
          rowKey={record => record.id}
          rowSelection={{
            type: 'radio',
            ...this.rowSelection,
          }}
          scroll={{ x: 1500 }}
          columns={columns}
          dataSource={dataSource}
          onChange={this.handleTableChange}
          pagination={pagination}
        />
        <div className='txc'>
          <Button type="primary" onClick={this.toSubmit} disabled={!selectedRows}>选择发票</Button>
        </div>
      </div>
    );
  }
}

export default InvoiceList;