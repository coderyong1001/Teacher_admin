/*
 * @Author: yuanhang 
 * @Date: 2019-12-04 15:02:59 
 * @Last Modified by: yuanhang
 * @Last Modified time: 2020-05-28 11:18:01
 */
import React, { Component } from 'react';
// 导入组件
import { Card, Tag } from 'antd';
let paymentSorter = { 0: '线上支付', 1: '线下支付' }
let payment_status = { 0: '已支付', 1: '待支付', 2: '待审核', 3: '审核未通过', 4: '订单取消', 5: '退款审核中', 6: '退款已拒绝', 7: '已部分退款', 8: '已全部退款', 9: '订单已删除', 10: '审核已通过放款中' }
let paymentColor = { 0: 'green', 1: 'orange', 2: 'orange', 3: 'orange', 4: 'orange', 5: 'purple', 6: 'purple', 7: 'red', 8: 'red', 9: 'orange', 10: 'purple' }
class InvoiceDetails extends Component {
  state = {
    details: null,
  }
  static defaultProps = {
    details: null,
  }
  componentDidMount() {
    const { details } = this.props
    this.setState({ details })
  }
  UNSAFE_componentWillReceiveProps(nextProps) {
    const { details } = nextProps
    this.setState({ details })
  }
  render() {
    const { details } = this.state
    return (
      details ? (<Card>
        <p>订单编号： <Tag color="cyan">{details.order_number}</Tag></p>
        <p>报名者：{details.name}</p>
        <p>订单单价：<Tag color="gold">{details.price}元 ( 原价{parseFloat((details.amount / details.applicant_num).toFixed(2))} ) </Tag></p>
        <p>订单总价：<Tag color="gold">{details.real_amount}元 ( 原价{details.amount} ) </Tag></p>
        <p>报名人数：{details.applicant_num}</p>
        <p>时间：{details.create_time}</p>
        <p>支付状态：<Tag color={paymentColor[details.payment_method]}>{paymentSorter[details.payment_method]}（{payment_status[details.payment_status]}）</Tag></p>
      </Card>) : <Card></Card>
    )
  }
}

export default InvoiceDetails;