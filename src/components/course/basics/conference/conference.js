/*
 * @Author: yuanhang 
 * @Date: 2019-11-15 10:16:49 
 * @Last Modified by: yuanhang
 * @Last Modified time: 2020-05-22 14:00:23
 */
// 联系方式
import React, { Component } from 'react';
// 引入公共类
// import { allIsEmpty } from '../../../../utils/utils'
// 联系人列表
import ContactsList from './contactsList/contactsList'
// 全局弹窗抽屉
import MyDrawer from '../../../myDrawer/myDrawer'
// 联系人管理
import ContactsAdd from './contactsList/contactsAdd'

// 引入组件
import { Button } from 'antd';

class Conference extends Component {
  state = {
    conference: [],
    mainModel: {
      department: '',
      contacts: []
    }
  };
  static defaultProps = {
    onReturnDate: () => console.log('MyImgUpload组件回调函数')
  }
  componentDidMount() {
    const { conference } = this.props
    if (conference && conference.length > 0) { return }
    // this.setState({ conference: conference }, () => {
    //   this.addConference()
    // })
  }
  UNSAFE_componentWillReceiveProps(nextProps) {
    const { conference } = nextProps
    this.setState({ conference: conference })
  }
  // 更新数据
  onReturnDate = () => {
    this.props.onReturnDate(this.state.conference)
  }
  // 删除
  onDeleteDate = (index) => {
    const { conference } = this.state
    let _conference = conference
    _conference.splice(index, 1);
    this.setState({ conference: _conference }, () => { this.onReturnDate() })
  }
  // 更新子元素数据
  onContactsList = (index, data) => {
    const { conference } = this.state
    let _conference = JSON.parse(JSON.stringify(conference))
    _conference[index] = data
    this.setState({ conference: _conference }, () => { this.onReturnDate() })
  }
  // 添加数据
  addConference = () => {
    const { conference, mainModel } = this.state
    let _mainModel = JSON.parse(JSON.stringify(mainModel))
    let _conference = conference || []
    // if (!allIsEmpty(_conference)) { return message.warning('尚有未填选的联系内容') }
    _conference.push(_mainModel)
    this.setState({ conference: _conference }, () => { this.onReturnDate() })
  }
  render() {
    const { conference } = this.state
    return (
      <div className='Conference inlineBlock' style={{ padding: '24px', border: '1px solid #d9d9d9', borderRadius: ' 6px', }}>
        {conference && conference.map((item, index) => {
          return <div className='mb15' key={'conference' + index}>
            <ContactsList listData={item} dataindex={index} onDeleteDate={this.onDeleteDate} onReturnDate={this.onContactsList} />
          </div>
        })}
        <Button className='mr15' onClick={this.addConference} icon="plus">添加部门</Button>
        {/* <Button className='ml15' onClick={this.toLiaison} icon="usergroup-add">联系人管理</Button> */}
        {/* 通用抽屉弹窗 */}
        <MyDrawer btnText='联系人管理' titleText='联系人管理' icon="usergroup-add" drawerWidt={500}>
          <ContactsAdd></ContactsAdd>
        </MyDrawer>
      </div >
    );
  }
}

export default Conference;