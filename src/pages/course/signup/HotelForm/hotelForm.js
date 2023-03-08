import React, { Component } from 'react';
import { allIsEmpty } from '../../../../utils/utils'
import Hotel from './Hotel/hotel'
// 组件
import { Button, Form, Input, message } from 'antd';

class hotelForm extends Component {
  state = {
    note: null,
  }
  // 获取表单值
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
  // 提交
  onSubmit = () => {
    let data = this.toSuccess()
    if (!allIsEmpty(data.hotel_info)) {
      return message.warning('当前酒店信息不能有空值')
    }
    message.info('添加酒店成功')
    this.props.onChange(data)
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const { course_id } = this.props
    return (
      <div>
        <Form className="login-form">
          <Form.Item label="酒店">
            {getFieldDecorator('hotel_info', {})(
              // 酒店信息
              <Hotel course_id={course_id} />
            )}
          </Form.Item>
          <Form.Item label="备注">
            {getFieldDecorator('note', {})(
              <Input placeholder="请输入备注" style={{ width: 300 }} />
            )}
          </Form.Item>
        </Form>
        <div className='txc mt15'>
          <Button type="primary" onClick={this.onSubmit}>保存</Button>
        </div>
      </div>
    );
  }
}

const HotelFormBox = Form.create({ name: 'hotelForm' })(hotelForm);
export default HotelFormBox;