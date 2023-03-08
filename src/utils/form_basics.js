/*
 * @Author: yuanhang 
 * @Date: 2019-10-24 15:19:00 
 * @Last Modified by: yuanhang
 * @Last Modified time: 2020-05-20 17:36:13
 */

// 基本信息 表单
// 注意日期格式接口返回值时要moment()
const FormDOM = [
  {
    label: '课程名称',
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
    label: '报名价格',
    min: 0,
    key: 'price',
    initialValue: 0,
    rules: [
      {
        required: true,
        message: '不能为空,免费输入0',
      },
      {
        pattern: /^\d+(\.\d{0,2})?$/,
        message: '数字并保留小数点后2位',
      }
    ],
    type: 'inputNumber',
  },
  {
    label: '班级人数',
    min: 1,
    key: 'members',
    initialValue: 1,
    rules: [
      {
        required: true,
        message: '不能为空',
      },
    ],
    type: 'inputNumber',
  },
  {
    label: '是否隐藏',
    key: 'hidden',
    initialValue: false,
    rules: [
      {
        required: true,
        message: '不能为空',
      },
    ],
    option: [
      { value: true, label: '是' },
      { value: false, label: '否' },
    ],
    type: 'radio',
  },
  {
    label: '课程类别',
    key: 'category',
    initialValue: 1,
    rules: [
      {
        required: true,
        message: '不能为空',
      },
    ],
    option: [
      { value: 1, label: '培训' },
      { value: 2, label: '会议' },
      { value: 3, label: '活动' },
    ],
    type: 'select',
  },
  {
    label: '课程类型',
    key: 'course_type',
    initialValue: 2,
    rules: [
      {
        required: true,
        message: '不能为空',
      },
    ],
    option: [
      { value: 1, label: '线上课程' },
      { value: 2, label: '线下课程' },
    ],
    type: 'select',
  },
  {
    label: '报名时间',
    key: 'apply_time',
    format: "YYYY-MM-DD HH:mm:ss",
    showTime: true,
    rules: [
      {
        required: true,
        message: '不能为空',
      },
    ],
    type: 'rangePicker',
  },
  {
    label: '发票名目',
    key: 'invoice_content',
    initialValue: 1,
    rules: [
      {
        required: true,
        message: '不能为空',
      },
    ],
    option: [
      { value: 1, label: '培训费' },
      { value: 2, label: '会议费' },
      { value: 3, label: '活动费' },
    ],
    type: 'select',
  },
]

export default FormDOM;
