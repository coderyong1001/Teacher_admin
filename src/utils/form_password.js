/*
 * @Author: yuanhang 
 * @Date: 2019-10-24 15:19:00 
 * @Last Modified by: yuanhang
 * @Last Modified time: 2019-12-27 11:54:29
 */

// 用户管理编辑 表单
// 注意日期格式接口返回值时要moment()
const FormDOM = [
  {
    label: '原来的密码',
    key: 'old_password',
    rules: [
      {
        required: true,
        message: '不能为空',
      },
    ],
    type: 'password',
  },
  {
    label: '新密码',
    key: 'new_password',
    rules: [
      {
        required: true,
        message: '不能为空',
      },
    ],
    type: 'password',
  },
  {
    label: '确认新密码',
    key: 'repassword',
    rules: [
      {
        required: true,
        message: '不能为空',
      },
    ],
    type: 'password',
  },
]

export default FormDOM;
