/*
 * @Author: yuanhang 
 * @Date: 2019-10-24 15:19:00 
 * @Last Modified by: yuanhang
 * @Last Modified time: 2020-05-06 09:41:30
 */

// 基本信息 表单
// 注意日期格式接口返回值时要moment()
const FormDOM = [
  {
    span: 12,
    label: '发票类型',
    key: 'type',
    initialValue: 0,
    rules: [
      {
        required: true,
        message: '不能为空',
      },
    ],
    option: [
      { value: 0, label: '普通发票' },
      { value: 1, label: '专用发票' },
    ],
    type: 'radio',
  },
  {
    span: 12,
    label: '抬头类型',
    key: 'title_type',
    initialValue: 0,
    rules: [
      {
        required: true,
        message: '不能为空',
      },
    ],
    option: [
      { value: 0, label: '单位' },
      { value: 1, label: '个人' },
    ],
    type: 'radio',
  },
  {
    span: 12,
    label: '发票材质',
    key: 'paper_elec',
    initialValue: 0,
    rules: [
      {
        required: true,
        message: '不能为空',
      },
    ],
    option: [
      { value: 0, label: '电子发票' },
      { value: 1, label: '纸质发票' },
    ],
    type: 'radio',
  },
  {
    span: 12,
    label: '发票抬头',
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
    placeholder:'若无税号，请填无或无税号',
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
    width: '100px',
    label: '省',
    key: 'province',
    initialValue: '北京市',
    valueKey: 'fullname',
    labelKey: 'fullname',
    rules: [
      {
        required: true,
        message: '不能为空',
      },
    ],
    option: [],
    type: 'select',
  },
  {
    span: 12,
    width: '100px',
    label: '市',
    key: 'city',
    valueKey: 'fullname',
    labelKey: 'fullname',
    rules: [
      {
        required: true,
        message: '不能为空',
      },
    ],
    option: [],
    type: 'select',
  },
  {
    span: 12,
    label: '地址及电话',
    key: 'addr_tel',
    rules: [
      {
        required: false,
        message: '不能为空',
      },
    ],
    type: 'input',
  },
  {
    span: 12,
    label: '开户行及账号',
    key: 'bank_account',
    rules: [
      {
        required: false,
        message: '不能为空',
      },
    ],
    type: 'input',
  },
  {
    span: 12,
    label: '发票接收邮箱',
    key: 'email',
    rules: [
      {
        required: true,
        message: '不能为空',
      },
      {
        type: 'email',
        message: '请注意邮箱格式',
      },
    ],
    type: 'input',
  },
  {
    width: '400px',
    label: '选择订单',
    key: 'orders',
    valueKey: 'id',
    labelKey: 'customize',
    optionFilterProp: 'children',
    mode: 'multiple',
    option: [],
    rules: [
      {
        required: true,
        message: '不能为空',
      },
    ],
    type: 'select',
  },

]

export default FormDOM;
