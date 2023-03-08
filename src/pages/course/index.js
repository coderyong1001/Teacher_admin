/*
 * @Author: yuanhang 
 * @Date: 2019-10-14 11:03:08 
 * @Last Modified by: yuanhang
 * @Last Modified time: 2020-05-27 18:58:48
 */
import React, { Component } from 'react';
// 布局
import Layouts from '../../components/layouts/index'
// 引入css
import './index.css'
// 封装单选项
import MyRadio from '../../components/radio/index'
// 报名
import SignUp from './signup/index'
// 全局弹窗抽屉
import MyDrawer from '../../components/myDrawer/myDrawer'
// api
import { apiCode, getCourse, putCourseHide } from '../../api/index'
// 输入框
import { Input, Button, message, Table, Divider, Modal, Tag, Tooltip } from 'antd';
const { Search } = Input;

let renderCategory = { 1: '培训', 2: '会议', 3: '活动' }
let renderStatus = { 2: '未开始', 1: '报名中', 3: '已结束' }
let switchHide = { 0: null, 1: 0, 2: 1 }
let orderingSorter = { ascend: 'create_time', descend: '-create_time' }
let magentaStatus = { 2: 'volcano', 1: 'green', 3: '#cccccc' }

class Course extends Component {
  state = {
    columns: [],
    dataList: [],
    pager: {
      page_num: 1,
      page_size: 10
    },
    ModalData: null,
    visibleModal: false,
    modalText: '',
    visibleMyDrawer: false,
    MyDrawerID: null,
    searchValue: null,
    categoryValue: null,
    signUpValue: null,
    hideValue: null,
    hotel_type: null,
    loading: false,
    pagination: {
      showSizeChanger: true,
      current: 1,
      pageSize: 10,
    },
    categoryList: [
      { value: -1, label: '全部' },
      { value: 1, label: '培训' },
      { value: 2, label: '会议' },
      { value: 3, label: '活动' },
    ],
    signUpList: [
      { value: -1, label: '全部' },
      { value: 3, label: '已结束' },
      { value: 1, label: '报名中' },
      { value: 2, label: '未开始' },
    ],
    hideList: [
      { value: 0, label: '全部' },
      { value: 1, label: '正常' },
      { value: 2, label: '隐藏' },
    ],
  };
  // 
  componentDidMount() {
    let _columns = [
      { title: '课程编号', dataIndex: 'course_num', key: 'course_num', width: 200 },
      { title: '创建时间', dataIndex: 'create_time', key: 'create_time', sorter: true, width: 200 },
      {
        title: '课程名称', dataIndex: 'name', key: 'name', width: 200, render: (text, record, index) => <Tooltip placement="topLeft" title={'查看课程 ' + record.name}>
          <span style={{ color: '#1890ff', cursor: 'pointer' }} onClick={this.toDetails.bind(this, record.id)}>{record.name}</span>
        </Tooltip>
      },
      {
        title: '当前状态', dataIndex: 'status', key: 'status', width: 90, render: (text, record, index) => <Tag color={magentaStatus[record.status]}>{renderStatus[record.status]}</Tag>
      },
      { title: '是否隐藏', dataIndex: 'hidden', key: 'hidden', render: hidden => hidden ? <Tag color='#cccccc'>隐藏</Tag> : <Tag color='green'>正常</Tag>, width: 100 },
      {
        title: '类别', dataIndex: 'category', key: 'category', width: 135, render: (text, record, index) => {
          return renderCategory[record.category]
        }
      },
      { title: '报名价格', dataIndex: 'price', key: 'price', render: (text, record, index) => <span>{record.price}/人</span> },
      { title: '报名人数', dataIndex: 'enrollment', key: 'enrollment', width: 110, render: (text, record, index) => <span style={{ color: (record.enrollment < record.members) ? '#52c41a' : '#ff4d4f' }}>{record.enrollment}/{record.members}</span> },
      { title: '报名开始时间', dataIndex: 'apply_start_time', key: 'apply_start_time' },
      { title: '报名结束时间', dataIndex: 'apply_end_time', key: 'apply_end_time' },
      {
        title: '管理操作', fixed: 'right', dataIndex: 'id', key: 'operation', width: 250, render: (text, record, index) => <span>
          <Button type="link" onClick={this.toDetails.bind(this, record.id)}>查看</Button>
          <Divider type="vertical" />
          <Button type="link" onClick={this.toShow.bind(this, record)}>{record.hidden ? '显示' : '隐藏'}</Button>
          <Divider type="vertical" />
          <Button type="link" onClick={this.toSignUp.bind(this, record.id, record.hotel_type)}>报名</Button>
        </span>
      },
    ];
    this.setState({
      columns: _columns,
    }, () => {
      this.fetch()
    })
  }
  // 获取数据
  fetch = (params) => {
    let { searchValue, categoryValue, signUpValue, hideValue, pagination, pager } = this.state
    params = params || pager
    let _data = {
      category: categoryValue === -1 ? null : categoryValue,
      time_status: signUpValue === -1 ? null : signUpValue,
      hidden: switchHide[hideValue],
      search: searchValue,
      page_num: pagination.current,
      page_size: pagination.pageSize,
    }
    params = { ...params, ..._data }
    if (params.count) {
      params.count = null
    }
    // loading
    this.setState({ loading: true })
    getCourse(params).then((res) => {
      // 为空退出
      if (!res) return
      if (res.code === apiCode()) {
        const pagination = { ...this.state.pagination }
        pagination.total = res.data.pager.count ? res.data.pager.count : 0
        this.setState({
          dataList: res.data.list,
          pager: res.data.pager,
          pagination,
        }, () => {
          // loading
          this.setState({ loading: false })
        })
      } else {
        // loading
        this.setState({ loading: false })
        let _msg = res.msg || '服务器错误'
        message.info('错误：' + _msg)
      }
    })
  }
  // 	分页、排序、筛选变化时触发
  handleTableChange = (pagination, filters, sorter) => {
    // 获取配置分页信息
    const pager = { ...this.state.pagination }
    // 获取组件内分页
    pager.current = pagination.current;
    pager.pageSize = pagination.pageSize;
    pager.total = pagination.total;
    this.setState({
      pagination: pager,
    }, () => {
      let _ordering = orderingSorter[sorter.order]
      this.fetch({
        ordering: _ordering,
      })
    })
  }
  // 触发搜素 onSearch	点击搜索或按下回车键时的回调	function(value, event)
  toSearch = (value) => {
    // message.info(`value: ${value}`);
    // message.info(`searchValue: ${this.state.searchValue}`);
    let { pagination, pager } = this.state
    pager.page_num = 1
    pagination.current = 1
    this.setState({ pager, pagination })
    this.fetch()
  }
  // onChange	输入框内容变化时的回调	function(e)  绑定value值前需要添加onChange
  setSearchValue = (event) => {
    this.setState({ searchValue: event.target.value })
  }
  // 重置
  reset = () => {
    // 回调里面再进行接口请求
    this.setState({
      searchValue: null,
      categoryValue: -1,
      signUpValue: -1,
      hideValue: 0,
    }, () => {
      this.toSearch()
    })
  }
  // 新建课程
  toNew = () => {
    this.props.history.push('/course/new');
  }
  // 类别
  setCategoryValue = (value) => {
    this.setState({
      categoryValue: value,
    }, () => {
      this.toSearch()
    })
  }
  // 当前状态
  setSignUpValue = (value) => {
    this.setState({
      signUpValue: value,
    }, () => {
      this.toSearch()
    })
  }
  // 是否隐藏
  setHideValue = (value) => {
    this.setState({
      hideValue: value,
    }, () => {
      this.toSearch()
    })
  }
  // 查询
  toDetails = (id) => {
    this.props.history.push('/course/edit/' + id);
  }
  // 显示
  toShow = (record) => {
    if (!record) {
      message.info('表格record值未拿到')
      return
    }
    let _text = record.hidden ? '是否显示？' : '是否隐藏？'
    this.setState({
      visibleModal: true,
      modalText: _text,
      ModalData: record
    })
  }
  // 设置
  ModalOk = () => {
    // loading
    this.setState({ loading: true })
    const { ModalData } = this.state
    if (!ModalData) {
      message.info('表格ModalData值未拿到')
      return
    }

    putCourseHide({ hidden: !ModalData.hidden }, ModalData.id).then((res) => {
      // 为空退出
      if (!res) return
      if (res.code === apiCode()) {
        message.success(res.msg)
        this.setState({ visibleModal: false, loading: false })
        this.fetch()
      } else {
        // loading
        this.setState({ visibleModal: false, loading: false })
        let _msg = res.msg || '服务器错误'
        message.info('错误：' + _msg)
      }
    })
  }
  // 关闭弹窗
  ModalCancel = () => {
    this.setState({ visibleModal: false })
  }
  // 关闭抽屉
  onDrawerClose = () => {
    this.setState({ visibleMyDrawer: false })
  }
  toSignUp = (id, hotel_type) => {
    this.setState({
      hotel_type,
      MyDrawerID: id,
      visibleMyDrawer: true
    })
  }
  render() {
    let { searchValue, categoryList, signUpList, hideList, columns, dataList, pagination, loading, categoryValue, signUpValue, hideValue, MyDrawerID, visibleMyDrawer, hotel_type } = this.state
    return (
      <Layouts pathname={this.props} history={this.props.history}>
        {/* 新建按钮 */}
        <Button className='toNew' type="primary" onClick={this.toNew}>新建课程</Button>
        {/* 搜索框 */}
        <span className='label'>关键字：</span>
        <Search style={{ width: 300 }} placeholder="搜索" onSearch={value => this.toSearch(value)} enterButton onChange={event => this.setSearchValue(event)} value={searchValue} />
        {/* 重置按钮 */}
        <Button loading={loading} className='ml15' onClick={this.reset} icon="reload">重置</Button>
        <MyRadio label={'类别：'} itemLits={categoryList} onChange={this.setCategoryValue} defaultValue={categoryValue} />
        <MyRadio label={'当前状态：'} itemLits={signUpList} onChange={this.setSignUpValue} defaultValue={signUpValue} />
        <MyRadio label={'是否隐藏：'} itemLits={hideList} onChange={this.setHideValue} defaultValue={hideValue} />
        {/* rowKey 需要设置 唯一 */}
        <Table rowKey={record => record.id} style={{ textAlign: 'center' }} columns={columns} dataSource={dataList} onChange={this.handleTableChange} scroll={{ x: 1800 }} pagination={pagination} loading={loading} />
        {/* 显示隐藏 */}
        <Modal
          title="隐藏提示"
          width={300}
          centered
          visible={this.state.visibleModal}
          onOk={this.ModalOk}
          okButtonProps={{ loading: loading }}
          onCancel={this.ModalCancel}>
          <p>{this.state.modalText}</p>
        </Modal>
        {/* 报名 */}
        <MyDrawer onDrawerClose={this.onDrawerClose} titleText='报名' drawerWidt={850} visible={visibleMyDrawer}>
          <SignUp key={MyDrawerID} courseId={MyDrawerID} hotel_type={hotel_type} history={this.props.history}/>
        </MyDrawer>
      </Layouts>
    );
  }
}

export default Course;