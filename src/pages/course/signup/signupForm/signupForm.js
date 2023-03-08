/*
 * @Author: yuanhang 
 * @Date: 2019-10-22 19:40:23 
 * @Last Modified by: yuanhang
 * @Last Modified time: 2020-05-20 10:39:00
 */
// 基础信息 新建与查看时复用
import React, { Component } from 'react';
// 引入css
import './index.css'
// 工具类 renderForm 全局表单渲染
import { renderForm, getDistrict, getDistrictList, setDOMJsDate } from '../../../../utils/utils'
// 表单配置
import FormDOM from '../../../../utils/form_signup'
// 组件
import { Row, Col, Form, } from 'antd';

class SignupForm extends Component {
  state = {
    DOMdata: null,
    listOne: null,
    listTow: null,
    listThree: null,
  }
  static defaultProps = {
    onRef: () => console.log('Basics组件回调函数')
  }
  componentDidMount () {
    // 设置下拉
    let listOne = getDistrict()
    // let listTow = getDistrict(1)
    // let listThree = getDistrict(2)
    // this.setState({ listOne, listTow, listThree })
    this.setState({ listOne }, () => {
      setDOMJsDate(FormDOM, 'province', { key: 'option', val: getDistrict() })
      this.onChange('北京市', 'province')
    })
    this.props.onRef(this)
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
  /*
  * 监听 getValueFromEvent function(..args) => onChange
  * 因循环渲染表单 getValueFromEvent内只有event 外包一层传入了对应的key
  */
  onChange = (e, key) => {
    // 循环渲染 event的值不同组件会有不同 如有新组件值报错可以传入对应type进行判断
    let _data = e.target ? e.target.value : e
    // 省选择时触发
    if (key === 'province') {
      let { listOne } = this.state
      let id = this.getID(listOne, e)
      let listTow = getDistrictList(id)
      this.setState({ listTow })
      setDOMJsDate(FormDOM, 'city', { key: 'option', val: listTow })
      this.props.form.setFieldsValue({ city: null, district: null })
    }
    // 市选择时触发
    if (key === 'city') {
      let { listTow } = this.state
      let id = this.getID(listTow, e)
      let listThree = getDistrictList(id, 2)
      this.setState({ listThree })
      setDOMJsDate(FormDOM, 'district', { key: 'option', val: listThree })
      this.props.form.setFieldsValue({ district: null })
    }
    // 区选择时触发
    if (key === 'district') {
    }
    return _data
  }
  // 获取id
  getID = (array, fullname) => {
    let id = null
    array.forEach(item => {
      if (item.fullname === fullname) {
        return id = item.id
      }
    });
    return id
  }
  render () {
    const { getFieldDecorator } = this.props.form

    return (
      <Form className="ant-advanced-search-form">
        <Row gutter={24}>
          {FormDOM && FormDOM.map(item => {
            return (
              <Col span={item.span ? item.span : 12} key={item.key}>
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
const WrappedSignup = Form.create({ name: 'signup_form' })(SignupForm);
export default WrappedSignup;