/*
 * @Author: yuanhang 
 * @Date: 2019-10-18 15:31:19 
 * @Last Modified by: yuanhang
 * @Last Modified time: 2020-03-30 10:29:48
 */
// 头部
import React, { Component } from 'react';
import MyForm from '../myForm/myForm'
// api
import { apiCode, postPassword } from '../../api/index'
// 表单数据
import FormDOM from '../../utils/form_password'
// 版本 更新日志
import Edition from './edition/edition'
// Dropdown 下拉菜单
import { Menu, Dropdown, Icon, Modal, message } from 'antd';
import './index.css'
const { confirm } = Modal;

class Header extends Component {
  state = {
    name: '更新日志',
    service: process.env.REACT_APP_ENV,
    isVisible: false,
    showEdition: false,
  }
  // 退出事件
  signOut = (e) => {
    let vm = this;
    confirm({
      centered: true,
      title: '退出确认',
      content: '是否退出？',
      okType: 'danger',
      okText: '确认',
      cancelText: '取消',
      onOk () {
        localStorage.removeItem("token")
        localStorage.removeItem("user_id")
        localStorage.removeItem("user_name")
        vm.props.history.push('/login')
      },
      onCancel () {
      },
    });
  }
  // 得到子组件
  MyForm = (ref) => {
    this.childForm = ref
  }
  // 修改密码确定
  handleOk = () => {
    let _data = this.childForm.toSuccess()
    if (!_data) { return false }
    console.log('_data', _data)
    postPassword(_data).then((res) => {
      // 为空退出
      if (!res) return
      if (res.code === apiCode()) {
        message.info('成功')
        localStorage.removeItem("token")
        localStorage.removeItem("user_id")
        localStorage.removeItem("user_name")
        this.props.history.push('/login')
      } else {
        let _msg = res.msg || '服务器错误'
        message.info('错误：' + _msg)
      }
    })
  }
  // 修改密码取消
  handleCancel = () => {
    this.setState({ isVisible: !this.state.isVisible })
  }
  // 版本
  toEdition = () => {
    let { showEdition } = this.state
    this.setState({ showEdition: !showEdition })
  }
  menu = (
    <Menu>
      <Menu.Item key="0" onClick={this.handleCancel}>修改密码</Menu.Item>
      <Menu.Item key="2" onClick={this.toEdition}>更新日志</Menu.Item>
      <Menu.Item key="1" onClick={this.signOut}>退出</Menu.Item>
    </Menu>
  );
  render () {
    const { name, service } = this.state
    const date = new Date()
    let timestamp = date.getTime()
    return (
      <div className="header">
        <div className="date">{date.getFullYear()}年{date.getMonth() + 1}月{date.getDate()}日</div>
        <div className="admin">
          <Dropdown overlay={this.menu} trigger={['click']}>
            <span style={{ cursor: 'pointer', color: '#0088cc', fontWeight: 700 }}>
              管理员 {localStorage.getItem("user_id")} <Icon type="down" />
            </span>
          </Dropdown>
        </div>
        <Modal
          centered
          title="修改密码"
          width='430px'
          visible={this.state.isVisible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <MyForm key={timestamp} onChange={this.onChange} onRef={this.MyForm} FormDOM={FormDOM} layoutSpan={8} />
        </Modal>
        <Modal
          centered
          // title="更新日志"
          title={name + ' (' + service + ') '}
          width='600px'
          footer={null}
          visible={this.state.showEdition}
          onCancel={this.toEdition}>
          <Edition className="edition"/>
        </Modal>
      </div>
    );
  }
}

export default Header;