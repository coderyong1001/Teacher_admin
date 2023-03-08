/*
 * @Author: yuanhang 
 * @Date: 2019-10-14 11:03:03 
 * @Last Modified by: yuanhang
 * @Last Modified time: 2020-05-20 10:39:53
 */
import React, { Component } from 'react';
// 布局
import Layouts from '../../components/layouts/index'

class Index extends Component {
  state = { visible: false };
  
  render () {
    return (
      <Layouts pathname={this.props}  history ={this.props.history}>
        index
      </Layouts>
      // <div>index</div>
    );
  }
}

export default Index;