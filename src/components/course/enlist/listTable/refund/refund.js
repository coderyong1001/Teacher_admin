import React, { Component } from 'react'

import { Input, InputNumber, Button } from 'antd'

class Refund extends Component {
  state = {
    amount: "",
    isDisabled: false,
  }
  static defaultProps = {
    onRef: () => console.log('Refund组件回调函数'),
    onChange: () => console.log('Refund组件回调函数')
  }

  componentDidMount() {
    const { itemData, price, applicantsGroup } = this.props
    let amount = itemData.refund_amount || price
    let isDisabled = !(applicantsGroup.indexOf(itemData.id) > -1)
    this.setState({ amount, isDisabled }, () => {
      this.props.onRef(itemData.id, this)
    })
  }
  UNSAFE_componentWillReceiveProps(nextProps) {
    const { itemData, applicantsGroup } = nextProps
    let isDisabled = !(applicantsGroup.indexOf(itemData.id) > -1)
    this.setState({ isDisabled })
  }

  // 全额
  toPrice = () => {
    this.setState({ amount: this.props.price }, () => {
      this.toPropsChange()
    })
  }
  // 退款金额
  setAmount = (value) => {
    this.setState({ amount: value }, () => {
      this.toPropsChange()
    });
  }
  // 获取数据
  getData = () => {
    this.props.onRef(this.props.itemData.id, this)
    return {
      id: this.props.itemData.id,
      amount: this.state.amount,
    }
  }
  //  返回父组件值
  toPropsChange = () => {
    this.props.onChange(this.getData())
  }
  render() {
    const { itemData, price } = this.props
    const { amount, isDisabled } = this.state
    return (
      <div className="ml10 mb15" style={{ height: "24px", display: "inline-block" }}>
        <span className="mr10" >退款人:</span>
        <Input className="mr10" style={{ width: "150px" }} size="small" disabled defaultValue={itemData.name} />
        <span className="mr10" >退款金额:</span>
        <InputNumber disabled={isDisabled} max={price} min={0.01} precision={2} className="mr10" style={{ width: "150px" }} size="small" value={amount} onChange={this.setAmount} />
        <Button disabled={isDisabled} onClick={this.toPrice} size="small">全额</Button>
      </div>
    );
  }
}

export default Refund;