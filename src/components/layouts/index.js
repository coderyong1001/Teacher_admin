/*
 * @Author: yuanhang 
 * @Date: 2019-10-15 16:33:18 
 * @Last Modified by: yuanhang
 * @Last Modified time: 2020-05-20 10:39:12
 */
import React, { Component } from 'react';
import { Link } from "react-router-dom";

// 菜单配置
import { menus } from '../../router/index'
// 头部
import MyHeader from '../header/index'
import MyFooter from '../footer/index'
// 引入css
import './index.css'
// 布局
import { Layout, Menu, Icon } from 'antd';
const { Header, Content, Footer, Sider } = Layout;

class Layouts extends Component {
  render () {
    // 判断左侧菜单 pathname
    const { pathname } = this.props
    let _pathname = pathname && pathname.parent ? pathname.parent : pathname.location.pathname

    return (
      <Layout className='LayoutsBox'>
        <Sider className='Sider'>
          <div className="logo">师资培训部报名<br />后台管理系统({process.env.REACT_APP_ENV})</div>
          <Menu theme="dark" mode="inline" defaultSelectedKeys={[_pathname]}>
            {menus && menus.map(item => {
              return (
                <Menu.Item key={item.path}>
                  <Link to={item.path}>
                    <Icon type={item.icon} />
                    <span className="nav-text">{item.name}</span>
                  </Link>
                </Menu.Item>
              )
            })}
          </Menu>
        </Sider>
        <Layout className='layout'>
          <Header className='Header'><MyHeader history={pathname.history} /></Header>
          <Content className='Content'>
            <div>
              {/* 插槽 */}
              {this.props.children}
            </div>
          </Content>
          <Footer className='Footer'><MyFooter /></Footer>
        </Layout>
      </Layout>
    );
  }
}

export default Layouts;