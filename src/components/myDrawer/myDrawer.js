/*
 * @Author: yuanhang 
 * @Date: 2019-10-28 11:12:57 
 * @Last Modified by: yuanhang
 * @Last Modified time: 2020-02-05 15:39:40
 */
// 抽屉
import React, { Component } from 'react';

// 引入css
import './index.css'
// 组件
import { Button, Drawer } from 'antd';


class MyDrawer extends Component {
  state = {
    // visible: true,
    visible: false,
    hideBtn: false,
  };
  static defaultProps = {
    DrawerId: null,
    btnText: null,
    titleText: null,
    drawerWidt: 200,
    visible: null,
    onDrawerClose: () => console.log('MyDrawer组件回调函数')
  }
  componentDidMount () {
    const { visible } = this.props
    this.getfatherVisible(visible)
  }
  UNSAFE_componentWillReceiveProps (nextProps) {
    const { visible } = nextProps
    this.getfatherVisible(visible)
  }
  getfatherVisible = (visible) => {
    if (!visible && visible !== false) { return }
    this.setState({
      visible: visible,
    })
  }
  showDrawer = () => {
    this.setState({
      visible: true,
      DrawerId: null,
    }, () => {
      let timestamp = new Date().getTime()
      this.setState({ DrawerId: 'Drawer_' + timestamp })
    })
  };

  onClose = () => {
    this.setState({
      visible: false,
    });
    const { onDrawerClose } = this.props
    onDrawerClose()
  };
  render () {
    const { btnText, titleText, drawerWidt, icon, type } = this.props

    return (
      <div className={`MyDrawer ${btnText ? '' : 'hideMyDrawer'}`}>
        {btnText && <Button type={type ? type : ""} icon={icon} onClick={this.showDrawer}>{btnText}</Button>}
        <Drawer
          key={this.state.DrawerId}
          title={titleText}
          onClose={this.onClose}
          visible={this.state.visible}
          width={drawerWidt}>
          {/* 插槽 */}
          {this.props.children}
        </Drawer>
      </div>
    );
  }
}

export default MyDrawer;