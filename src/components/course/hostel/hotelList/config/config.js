import React, { Component } from 'react';
import { InputNumber } from 'antd';

const ListName = { 1: '单人间', 2: '双人间', 3: '单人拼房' }

class List extends Component {
  state = {
    config: this.props.item.config || false,
    price: this.props.item.price || null,
  }
  static defaultProps = {
    onChange: () => console.log('List组件回调函数'),
  }
  UNSAFE_componentWillReceiveProps(nextProps) {
    // 获取到下标 获取到酒店列表
    const { item } = nextProps
    this.setState({ price: item.price, config: item.config })
  }
  toPrice = (value) => {
    this.setState({ price: value }, () => { this.onChange() });
  }
  onChange = () => {
    let { price } = this.state
    let { onChange, itemKey } = this.props
    if (price) {
      onChange({ config: itemKey, price })
    } else {
      onChange({ config: itemKey, price: null })
    }
  }
  render() {
    return (
      <div className="mb15">
        <span className='mr5 inlineBlock2' style={{ width: 75 }}>{this.props.name} :</span>
        <InputNumber
          formatter={value => `￥ ${value}`}
          step={0.01}
          precision={2}
          min={0}
          value={this.state.price}
          style={{ width: 200 }}
          placeholder="价格"
          onChange={this.toPrice} />
      </div>
    )
  }
}

class Config extends Component {
  state = {
    room_info: [
      { config: 1, price: null },
      { config: 2, price: null },
      { config: 3, price: null }
    ],
    default_data: [
      { config: 1, price: null },
      { config: 2, price: null },
      { config: 3, price: null }
    ]
  }
  static defaultProps = {
    onChange: () => console.log('Config组件回调函数'),
  }
  componentDidMount() {
    const { room_info } = this.props
    if (!room_info || room_info.length === 0) { return }
    let _obj = {}
    room_info.forEach(item => {
      _obj[item.config] = item.price
    });
    const { default_data } = this.state
    let _array = default_data.map(item => {
      if (_obj[item.config] || _obj[item.config] === 0) {
        item.price = _obj[item.config]
      }
      return item
    })
    this.setState({ room_info: _array })
  }
  UNSAFE_componentWillReceiveProps(nextProps) {
    // 获取到下标 获取到酒店列表
    const { room_info } = nextProps
    if (!room_info || room_info.length === 0) { return }
    let _obj = {}
    room_info.forEach(item => {
      _obj[item.config] = item.price
    });
    const { default_data } = this.state
    let _array = default_data.map(item => {
      if (_obj[item.config] || _obj[item.config] === 0) {
        item.price = _obj[item.config]
      }
      return item
    })
    this.setState({ room_info: _array })
  }
  toRoom = (value) => {
    const { room_info } = this.state
    let _array = room_info.map(item => {
      if (item.config === value.config) {
        item.price = value.price
      }
      return item
    })
    this.setState({ room_info: _array }, () => { this.onChange() })
  }
  onChange = () => {
    // 去掉空价格值或为选择值
    this.props.onChange(this.state.room_info);
  }
  render() {
    const { room_info } = this.state
    return (
      <div className='inlineBlock'>
        {room_info && room_info.map((item, index) => {
          return <List
            key={'room_info_list_' + index}
            item={item}
            itemKey={index + 1}
            name={ListName[index + 1]}
            onChange={this.toRoom}></List>
        })}
      </div>
    );
  }
}

export default Config;