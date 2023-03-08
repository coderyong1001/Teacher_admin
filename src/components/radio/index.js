import React, { Component } from 'react'
// 输入框
import { Radio } from 'antd'

class MyRadio extends Component {
  state = {
    itemData: 'all',
  };
  static defaultProps = {
    label: null,
    itemLits: [],
    defaultValue: null,
    onChange: function () {
      console.log('必须写父级回调')
    }
  }
  componentDidMount() {
    const { itemLits, defaultValue } = this.props
    // 默认值的设置 父组件是否以后传值
    let _default = null
    if (defaultValue || defaultValue === 0 || defaultValue === -1 || defaultValue === null) {
      _default = defaultValue
    } else {
      _default = itemLits ? itemLits[0].value : null
    }
    this.setState({ itemData: _default })
  }
  UNSAFE_componentWillReceiveProps(nextProps) {
    const { itemLits, defaultValue } = nextProps
    // 默认值的设置 父组件是否以后传值
    let _default = null
    if (defaultValue || defaultValue === 0 || defaultValue === -1 || defaultValue === null) {
      _default = defaultValue
    } else {
      _default = itemLits ? itemLits[0].value : null
    }
    this.setState({ itemData: _default })
  }

  // 触发组件渲染 和 父组件回调
  setItemData = (event) => {
    const { onChange } = this.props
    this.setState({
      itemData: event.target.value
    })
    onChange(event.target.value)
  }
  render() {
    const { label, itemLits, labelWidth, } = this.props
    const { itemData } = this.state
    let { radioType } = this.props
    radioType = radioType || 'button' || 'radio'

    return (
      <div className='item'>
        {label && <span className='label' style={{ width: labelWidth }}>{label}</span>}
        <Radio.Group defaultValue={itemData} size="small" onChange={event => this.setItemData(event)} value={itemData}>
          {itemLits && itemLits.map((item) => {
            return ((radioType === 'button') ? <Radio.Button key={item.value} value={item.value} >{item.label}</Radio.Button> : <Radio key={item.value} value={item.value} >{item.label}</Radio>)
          })}
        </Radio.Group>
      </div>
    );
  }
}

export default MyRadio;