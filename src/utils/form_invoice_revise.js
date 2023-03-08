/*
 * @Author: yuanhang 
 * @Date: 2019-10-24 15:19:00 
 * @Last Modified by: yuanhang
 * @Last Modified time: 2020-06-03 17:31:33
 */

// 基本信息 表单
// 注意日期格式接口返回值时要moment()
const FormDOM = [
  {
    span: 12,
    label: '省市',
    key: 'province',
    rules: [
      {
        required: true,
        message: '不能为空',
      },
    ],
    type: 'input',
  },
  {
    span: 12,
    label: '抬头',
    key: 'title',
    rules: [
      {
        required: true,
        message: '不能为空',
      },
    ],
    type: 'input',
  },
  {
    span: 12,
    label: '税号',
    key: 'tax_number',
    rules: [
      {
        required: true,
        pattern:/^(([0-9a-zA-Z]{1,})|([\u65e0]{1})|([\u65e0][\u7a0e][\u53f7]{1}))$/,
        message: '若无税号，请填无或无税号',
      },
    ],
    type: 'input',
  },
  {
    span: 12,
    label: '地址及电话',
    key: 'addr_tel',
    type: 'input',
  },
  {
    span: 12,
    label: '开户行及账号',
    key: 'bank_account',
    type: 'input',
  }
]

export default FormDOM;
