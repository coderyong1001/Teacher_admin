/*
 * @Author: yuanhang 
 * @Date: 2019-11-15 11:34:32 
 * @Last Modified by: yuanhang
 * @Last Modified time: 2020-05-20 11:30:13
 */
// 联系人列表
import React, { Component } from 'react';

// api
import { apiCode, getLiaison } from '../../../../../api/index'
// 姓名 手机号
// import TelList from './telList'
// 引入组件
import { Button, Input, message, Select } from 'antd';

const { Option } = Select;

class ContactsList extends Component {
  state = {
    dataindex: 0,
    typeData: null,
    contacts: [],
    contactsOption: [],
    dataList: null,
  };
  static defaultProps = {
    dataindex: 0,
    onReturnDate: () => console.log('ContactsList组件回调函数'),
    onDeleteDate: () => console.log('ContactsList组件回调函数'),
  }
  componentDidMount() {
    const { dataindex, listData } = this.props
    this.setState({ dataindex: dataindex })
    if (listData) {
      let contactsOption = listData.contacts.map((item) => {
        return item.id
      })
      this.setState({ department: listData.department, contacts: listData.contacts, contactsOption })
    }
    this.getList()
  }
  UNSAFE_componentWillReceiveProps(nextProps) {
    const { dataindex, listData } = nextProps
    this.setState({ dataindex: dataindex })
    if (listData) {
      let contactsOption = listData.contacts.map((item) => {
        return item.id
      })
      this.setState({ department: listData.department, contacts: listData.contacts, contactsOption })
    }
  }
  getList = () => {
    getLiaison().then((res) => {
      // 为空退出
      if (!res) return
      if (res.code === apiCode()) {
        let dataList = res.data
        this.setState({ dataList })
      } else {
        let _msg = res.msg || '服务器错误'
        message.info('错误：' + _msg)
      }
    })
  }
  // 更新数据
  onReturnDate = () => {
    const { onReturnDate } = this.props
    const { department, contacts, dataindex } = this.state
    let _data = { department: department, contacts: contacts }
    onReturnDate(dataindex, _data)
  }
  // 模块名称
  setType = (e) => {
    let _data = e.target.value
    this.setState({ department: _data }, () => { this.onReturnDate() })
  }
  inputOnBlur = (e) => {
    let _data = e.target.value
    // 去首尾空格
    if (typeof (_data) == 'string' && _data) {
      _data = _data.replace(/(^\s*)|(\s*$)/g, "")
    }
    this.setState({ department: _data }, () => { this.onReturnDate() })
  }
  // 删除
  onDeleteDate = () => {
    const { onDeleteDate } = this.props
    onDeleteDate(this.state.dataindex)
  }
  // 展开下拉菜单的回调
  onDropdownVisibleChange = (open) => {
    if (open) {
      this.getList()
    }
  }
  onSelect = (value, option) => {
    // 选择
    if (!option.props) {
      return message.info('获取数据失败')
    }
    let { datatel, dataname, data_short_tel } = option.props
    if (!datatel) {
      return message.info('获取数据失败')
    }
    if (!dataname) {
      return message.info('获取数据失败')
    }
    let _obj = {
      id: value,
      name: dataname,
      tel: datatel,
      short_tel:data_short_tel
    }
    const { contacts, contactsOption } = this.state
    let _contacts = [...contacts]
    let _Option = [...contactsOption]
    _contacts.push(_obj)
    _Option.push(value)
    this.setState({ contacts: _contacts, contactsOption: _Option }, () => { this.onReturnDate() })

  }
  onDeselect = (value) => {
    // 删除
    const { contacts, contactsOption } = this.state
    let _contacts = [...contacts]
    let _Option = [...contactsOption]
    let _index = null
    let _index2 = null
    _contacts.forEach((item, index) => {
      if (item.id === value) {
        _index = index
      }
    })
    _Option.forEach((item, index) => {
      if (item === value) {
        _index2 = index
      }
    })
    if ((!_index && _index !== 0) || (!_index2 && _index2 !== 0)) {
      return message.info('未匹配id')
    }
    _contacts.splice(_index, 1)
    _Option.splice(_index2, 1)
    this.setState({ contacts: _contacts, contactsOption: _Option }, () => { this.onReturnDate() })
  }
  render() {
    const { dataindex, department, dataList, contactsOption } = this.state

    return (
      <div className='ContactsList inlineBlock' style={{ borderBottom: '1px dashed #d9d9d9', width: '100%' }}>
        <div style={{ paddingTop: '3.5px' }}>
          <span className='ml15 mr15'>联系部门</span>
          <Input placeholder="请输入" style={{ width: 200 }} onChange={this.setType} onBlur={this.inputOnBlur} value={department} />
          <span className='mr15'></span>
          {dataindex !== 0 && <Button className='mr15' type="danger" onClick={this.onDeleteDate}>删除</Button>}
          <br />
          <br />
          <span className='ml15 mr15'>联系人</span>
          <Select style={{ width: 500 }} mode="multiple" placeholder="请选择" onDropdownVisibleChange={this.onDropdownVisibleChange} onSelect={this.onSelect} onDeselect={this.onDeselect} value={contactsOption}>
            {dataList && dataList.map((item) => {
              return <Option key={item.id} value={item.id} dataname={item.name} datatel={item.tel} data_short_tel={item.short_tel}>{`联系人：${item.name} ；电话：${item.tel} ；座机电话：${item.short_tel?item.short_tel:''}。`}</Option>
            })}
          </Select>
        </div>
        <br />
      </div>
    );
  }
}

export default ContactsList;