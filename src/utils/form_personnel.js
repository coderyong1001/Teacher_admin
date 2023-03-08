/*
 * @Author: yuanhang 
 * @Date: 2019-10-24 15:19:00 
 * @Last Modified by: yuanhang
 * @Last Modified time: 2020-05-18 21:14:24
 */

// 基本信息 表单
// 注意日期格式接口返回值时要moment()
const FormDOM = [
  {
    label: '姓名',
    key: 'name',
    rules: [
      {
        required: true,
        message: '不能为空',
      },
    ],
    type: 'input',
  },
  {
    label: '性别',
    key: 'gender',
    option: [
      { value: 0, label: '男' },
      { value: 1, label: '女' },
    ],
    rules: [
      {
        required: true,
        message: '不能为空',
      },
    ],
    type: 'radio',
  },
  {
    label: '身份证号码',
    key: 'ID_number',
    rules: [
      {
        required: false,
        message: '不能为空',
      },
    ],
    type: 'input',
  },
  {
    span: 8,
    width: '100px',
    label: '省',
    key: 'province',
    initialValue: '北京市',
    valueKey: 'fullname',
    labelKey: 'fullname',
    rules: [
      {
        required: false,
        message: '不能为空',
      },
    ],
    option: [],
    type: 'select',
  },
  {
    span: 8,
    width: '100px',
    label: '市',
    key: 'city',
    valueKey: 'fullname',
    labelKey: 'fullname',
    rules: [
      {
        required: false,
        message: '不能为空',
      },
    ],
    option: [],
    type: 'select',
  },
  {
    span: 8,
    width: '100px',
    label: '区',
    key: 'district',
    valueKey: 'fullname',
    labelKey: 'fullname',
    rules: [
      {
        required: false,
        message: '不能为空',
      },
    ],
    option: [],
    type: 'select',
  },
  {
    label: '单位',
    rules: [
      {
        required: true,
        message: '不能为空',
      },
    ],
    key: 'company',
    type: 'input',
  },
  {
    label: '单位地址',
    key: 'address',
    type: 'input',
  },
  {
    label: '职务',
    key: 'job_title',
    type: 'input',
  },
  {
    label: '手机号',
    key: 'tel',
    rules: [
      {
        required: true,
        message: '不能为空',
      },
      {
        pattern: /^1(3|4|5|6|7|8|9)\d{9}$/,
        message: '请输入手机号码',
      }
    ],
    type: 'input',
  },
  {
    label: '最高学历毕业专业',
    key: 'profession',
    type: 'input',
  },
  {
    label: '参加工作年份',
    key: 'work_exp',
    format: "YYYY",
    showTime: false,
    type: 'datePickerYear',
  },
  {
    label: '备注',
    key: 'comment',
    type: 'input',
  },
]

export default FormDOM;
