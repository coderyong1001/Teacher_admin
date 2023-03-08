/*
 * @Author: yuanhang 
 * @Date: 2019-10-14 11:02:47 
 * @Last Modified by: yuanhang
 * @Last Modified time: 2019-11-23 19:13:01
 */
import React from 'react';
import { Route, Redirect } from "react-router-dom";
// 渲染当前组件
export const RouteWithSubRoutes = route => (
  <Route
    path={route.path}
    exact={route.exact}
    render={props => {
      if (props.match.path !== '/login') {
        // token
        const token = localStorage.getItem("token")
        if (!token) {
          return <Redirect path='/login' to='/login'></Redirect>
        }
      }
      return (
        route && (route.Redirect ? (<Redirect path={route.path} exact={route.exact} to={{ pathname: route.Redirect }}></Redirect>) :
          (<route.component parent={route.parent} {...props} />))
      )
    }}
  />
);

// 循环渲染当前路由数组中一维数组中的组件
export const RenderRoutes = ({ routes }) => { return (routes.map((route, i) => <RouteWithSubRoutes key={i} {...route} />)) };

