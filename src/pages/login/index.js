/*
 * @Author: yuanhang 
 * @Date: 2019-10-14 11:03:08 
 * @Last Modified by: yuanhang
 * @Last Modified time: 2020-05-20 10:38:43
 */
import React from 'react';
import './index.css'
// api
import { apiCode, Login } from '../../api/index'
// 表单
import { message, Form, Icon, Input, Button, Checkbox } from 'antd';


class NormalLoginForm extends React.Component {
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        
        let { password, remember, username } = values
        // 跳转首页
        Login({ password, username }).then((res) => {
          // 为空退出
          if (!res) return
          if (res.code === apiCode()) {
            // 记住用户名
            if (remember) {
              localStorage.setItem("loginDate", new Date())
              localStorage.setItem("username", username)
            }
            localStorage.setItem("token", res.data.token)
            localStorage.setItem("user_id", res.data.user_id)
            localStorage.setItem("user_name", res.data.user_name)
            message.info('登录成功')
            this.props.history.push('/')
          } else {
            let _msg = res.msg || '服务器错误'
            message.info('错误：' + _msg)
          }
        })
      } else {
        //处理错误
      }
    });
  }
  componentDidMount() {

  }
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div className='LoginBox'>
        <div className='LoginForm'>
          <div className='title'>师资培训部报名后台管理系统</div>
          <Form onSubmit={this.handleSubmit} className="login-form">
            <Form.Item>
              {getFieldDecorator('username', {
                rules: [{ required: true, message: '请输入您的用户名' }],
              })(
                <Input
                  prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  placeholder="用户名"
                />,
              )}
            </Form.Item>
            <Form.Item>
              {getFieldDecorator('password', {
                rules: [{ required: true, message: '请输入您的密码' }],
              })(
                <Input
                  prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  type="password"
                  placeholder="密码"
                />,
              )}
            </Form.Item>
            <Form.Item>
              {getFieldDecorator('remember', {
                valuePropName: 'checked',
                initialValue: false,
              })(<Checkbox>记住用户名</Checkbox>)}
              <Button type="primary" htmlType="submit" className="login-form-button">
                登  录
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    );
  }
}

const WrappedNormalLoginForm = Form.create({ name: 'normal_login' })(NormalLoginForm);
// ReactDOM.render(<WrappedNormalLoginForm />, mountNode);

// const Login = Form.create()(MyLoginForm);
export default WrappedNormalLoginForm;