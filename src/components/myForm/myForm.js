/*
 * @Author: yuanhang 
 * @Date: 2019-10-22 19:40:23 
 * @Last Modified by: yuanhang
 * @Last Modified time: 2020-05-20 16:22:56
 */
// 基础信息 新建与查看时复用
import React, { Component } from 'react';

// 工具类 renderForm 全局表单渲染
import { renderForm } from '../../utils/utils'
// 组件
import { Row, Col, Form, } from 'antd';
let name = 'my_form'
class myForm extends Component {
  state = {
    FormDOM: [],
  }
  static defaultProps = {
    layoutSpan: null,
    FormDOM: [],
    createName: 'my_form',
    onRef: () => console.log('myForm组件回调函数'),
    onChange: (e, key) => {
      console.log('myForm组件回调函数')
      let _data = e.target ? e.target.value : e
      return _data
    },
  }
  componentDidMount () {
    let { FormDOM, createName } = this.props
    this.setState({ FormDOM })
    name = createName
    this.props.onRef(this)
  }
  // 重置
  toResetFields = (array) => {
    array = array || []
    this.props.form.resetFields(array)
  }
  // 提交
  toSuccess = () => {
    let data = ''
    this.props.form.validateFields((err, values) => {
      if (!err) {
        data = values
        return data
      }
    })
    return data
  }
  // 设置Fields值
  toSetValue = (data) => {
    this.props.form.setFieldsValue(data)
  }
  // 表单值修改触发
  onChange = (e, key) => {
    let { onChange } = this.props
    // 循环渲染 event的值不同组件会有不同 如有新组件值报错可以传入对应type进行判断
    let _data = e.target ? e.target.value : e
    _data = onChange(e, key)
    return _data
  }
  render () {
    const { getFieldDecorator } = this.props.form;
    const { FormDOM } = this.state
    let { layoutSpan } = this.props
    let labelCol = null
    let wrapperCol = null
    if (layoutSpan) {
      labelCol = { span: layoutSpan }
      wrapperCol = { span: layoutSpan }
    }
    return (
      <Form labelCol={labelCol} wrapperCol={wrapperCol} className="ant-advanced-search-form">
        <Row gutter={24}>
          {FormDOM && FormDOM.map(item => {
            return (
              <Col span={item.span ? item.span : 24} key={item.key}>
                <Form.Item label={item.label ? item.label : ''}>
                  {getFieldDecorator(`${item.key}`, {
                    getValueFromEvent: (event) => {
                      return this.onChange(event, item.key)
                    },
                    initialValue: item.initialValue,
                    rules: item.rules
                  })(renderForm(item))}
                </Form.Item>
              </Col>)
          })}
        </Row>
      </Form>
    );
  }
}
const WrappedSignup = Form.create({ name: name })(myForm);
export default WrappedSignup;