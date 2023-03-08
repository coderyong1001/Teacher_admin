/*
 * @Author: yuanhang 
 * @Date: 2019-11-15 11:34:32 
 * @Last Modified by: yuanhang
 * @Last Modified time: 2020-05-20 11:29:19
 */
// 联系人管理
import React, { Component } from 'react';
// 引入公共类
import { sortRules } from '../../../../../utils/utils'
// api
import { apiCode, getLiaison, postLiaison, putLiaison, deleteLiaison } from '../../../../../api/index'

// 引入组件
import { message, Select, Input, Button, Modal } from 'antd';
const { Option } = Select;
const { confirm } = Modal;

class ContactsAdd extends Component {
  state = {
    id: null,
    name: null,
    tel: null,
    short_tel: null,
    dataList: null,
  };
  static defaultProps = {
  }
  componentDidMount() {
    // const { } = this.props
    this.getList()
  }
  UNSAFE_componentWillReceiveProps(nextProps) {
    // const { } = nextProps
  }
  getList = () => {
    getLiaison().then((res) => {
      // 为空退出
      if (!res) return
      if (res.code === apiCode()) {
        let dataList = res.data
        this.setState({ dataList })
        this.toReset()
      } else {
        let _msg = res.msg || '服务器错误'
        message.info('错误：' + _msg)
      }
    })
  }
  toReset = () => {
    this.setState({
      id: null,
      name: null,
      tel: null,
      short_tel: null,
    });
  }
  // 设置id
  setID = (id) => {
    if (!id) {
      this.toReset()
      return
    }
    this.setState({ id });
  }
  // 获取选项
  onSelect = (id, item) => {
    if (item && item.props) {
      let props = item.props || {}
      let name = props.dataname || null
      let tel = props.datatel || null
      let short_tel = props.datashort_tel || null
      this.setState({ name, tel, short_tel });
    }
  }
  // 名称备注
  setName = (e) => {
    let _data = e.target.value
    this.setState({ name: _data });
  }
  inputOnBlur = (e) => {
    let _data = e.target.value
    // 去首尾空格
    if (typeof (_data) == 'string' && _data) {
      _data = _data.replace(/(^\s*)|(\s*$)/g, "")
    }
    this.setState({ name: _data })
  }
  // 手机号
  setTel = (e) => {
    let _phoneReg = sortRules(e.target.value, 'phoneReg')
    // phoneReg验证未通过 return后就不执行数据更新
    if (!_phoneReg) {
      message.warning('请输入正确的手机号码')
      return
    }
    let _data = e.target.value
    this.setState({ tel: _data });
  }
  //座机号
  setShort_tel= (e) => {
    let _data = e.target.value
    this.setState({ short_tel: _data });
  }
  // 修改
  toRevise = () => {
    let { id, name, tel, short_tel } = this.state
    if (!id) { return }
    if (!name) { return }
    if (!tel) { return }
    if (!short_tel) { return }
    putLiaison({ name, tel, short_tel }, id).then((res) => {
      // 为空退出
      if (!res) return
      if (res.code === apiCode()) {
        message.info('修改成功')
      } else {
        let _msg = res.msg || '服务器错误'
        message.info('错误：' + _msg)
      }
    })
  }
  // 删除
  toDelete = () => {
    let vm = this
    let { id } = this.state
    confirm({
      title: '删除提示',
      content: `是否删除 ${this.state.name}?`,
      onOk() {
        deleteLiaison(id).then((res) => {
          // 为空退出
          if (!res) return
          if (res.code === apiCode()) {
            message.info('删除成功')
            vm.getList()
          } else {
            let _msg = res.msg || '服务器错误'
            message.info('错误：' + _msg)
          }
        })
      },
      onCancel() { },
    });
  }
  // 新建
  toNew = () => {
    let { name, tel, short_tel } = this.state
    if (!name) { return message.info('请输入联系人') }
    if (!tel) { return message.info('请输入电话号码') }
    if (!short_tel) { return message.info('请输入座机号码') }
    postLiaison({ name, tel, short_tel }).then((res) => {
      // 为空退出
      if (!res) return
      if (res.code === apiCode()) {
        message.info('新建成功')
        this.getList()
      } else {
        let _msg = res.msg || '服务器错误'
        message.info('错误：' + _msg)
      }
    })
  }
  render() {
    const { id, name, tel, short_tel, dataList } = this.state
    return (
      <div className='ContactsAdd'>
        <span className='mr10 inlineBlock2' style={{ width: 80 }}>联系人 :</span>
        <Select style={{ width: 360 }} placeholder="请选择" allowClear onChange={this.setID} onSelect={this.onSelect} onDeselect={this.onDeselect} onSearch={this.onSearch} value={id} >
          {dataList && dataList.map((item) => {
            return <Option key={item.id} value={item.id} dataname={item.name} datatel={item.tel} datashort_tel={item.short_tel}>{`联系人：${item.name || ''} ；电话：${item.tel || ''} ；座机电话：${item.short_tel || ''}。`}</Option>
          })}
        </Select>
        <br />
        <br />
        <span className='mr10 inlineBlock2 importantSign' style={{ width: 80 }}>联系人 :</span>
        <Input placeholder="联系人" onChange={this.setName} onBlur={this.inputOnBlur} value={name} style={{ width: 200 }} />
        <br />
        <br />
        <span className='mr10 inlineBlock2 importantSign' style={{ width: 80 }}>电话 :</span>
        <Input placeholder="电话" maxLength={11} onChange={this.setTel} value={tel} style={{ width: 200 }} />
        <br />
        <br />
        <span className='mr10 inlineBlock2 importantSign' style={{ width: 80 }}>座机电话 :</span>
        <Input placeholder="座机电话" maxLength={11} onChange={this.setShort_tel} value={short_tel} style={{ width: 200 }} />
        <div className='mt15 txc'>
          {(id || id === 0) && <Button onClick={this.toRevise} type="primary">修改</Button>}
          {(id || id === 0) && <Button onClick={this.toDelete} type="danger" className='ml15'>删除</Button>}
          {(!id && id !== 0) && <Button onClick={this.toNew} type="primary">新建</Button>}
        </div>
      </div>
    );
  }
}

export default ContactsAdd;