import React, { Component } from 'react';
import { Tag } from 'antd';

class SeveralData extends Component {
  state = {

  }
  static defaultProps = {
    onDefault: () => console.log('SeveralData组件回调函数')
  }
  componentDidMount() {
  }
  preventDefault = (e) => {
    e.preventDefault()
  }
  onDefault = (item) => {
    this.props.onDefault(item, this.props.itemIndex)
  }
  render() {
    let { details } = this.props
    return (
      <div>
        {details && details.map(item => {
          return <Tag color="cyan" className='mb15' key={item.id} closable onClose={this.preventDefault} onClick={this.onDefault.bind(this, item)}>{item.price}</Tag>
        })}
      </div>
    );
  }
}

export default SeveralData;