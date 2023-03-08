import React, { Component } from 'react'
// 版本 关于我们
import Dev from './dev/index'
import Qa from './qa/index'
import Pre from './pre/index'
import Prod from './prod/index'


class Edition extends Component {
  state = {
    service: process.env.REACT_APP_ENV,
  }
  render () {
    const { service } = this.state
    return (
      <div>
        {service === 'dev' && <Dev />}
        {service === 'qa' && <Qa />}
        {service === 'pre' && <Pre />}
        {service === 'prod' && <Prod />}
      </div>
    );
  }
}

export default Edition;