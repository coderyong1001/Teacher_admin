/*
 * @Author: yuanhang 
 * @Date: 2019-11-11 17:18:31 
 * @Last Modified by: yuanhang
 * @Last Modified time: 2020-06-02 10:47:55
 */
// 文件上传
// api
import { API_URL, file_upload } from '../../api/index'
// 引入css
import './index.css'

import React, { Component } from 'react';
// 引入组件
import { Upload, Button, message } from 'antd';
let beforeType = null
function beforeUpload(file) {
  const isLt500M = file.size / 1024 / 1024 < 500;
  if (!isLt500M) {
    message.error('超出500M')
  }
  if (beforeType === 'img') {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
    if (!isJpgOrPng) {
      message.error('限制格式 JPG/PNG');
    }
    return isJpgOrPng && isLt500M
  }
  return isLt500M;
}

class myFileUpload extends Component {
  state = {
    fileList: [],
  };
  static defaultProps = {
    action: file_upload(),
    isSingle: false,
    method: 'POST',
    dataName: 'file',
    btnName: '上传',
    verifyType: null,
    fileList: [],
    onReturnDate: () => console.log('MyImgUpload组件回调函数')
  }
  componentDidMount() {
    const { fileList } = this.props
    if (!fileList || !(fileList instanceof Array)) { return }
    let _fileList = fileList.map((item, index) => {
      return { uid: -(index + 1), status: 'done', name: item.file_name, url: item.file_url }
    })
    this.setState({ fileList: _fileList })
  }
  UNSAFE_componentWillReceiveProps(nextProps) {
    const { fileList } = nextProps
    if (!fileList || !(fileList instanceof Array)) { return }
    let _fileList = fileList.map((item, index) => {
      return { uid: -(index + 1), name: item.file_name, url: item.file_url }
    })
    this.setState({ fileList: _fileList })
  }
  // 改变时
  onChange = ({ file, fileList, event }) => {
    if (file && !file.status) {
      this.setState({ fileList: [] })
      return
    }
    if (file.status !== 'done' && file.status !== 'removed' && file.status !== 'error') {
      let { isSingle } = this.props
      let _fileList = isSingle ? fileList.slice(-1) : fileList
      this.setState({ fileList: _fileList })
      return
    }
    // 上传成功和删除时触发
    if (file.status === 'done' || file.status === 'removed') {
      const { onReturnDate } = this.props
      this.setState({ fileList }, () => {
        let _arr = fileList.map(item => {
          // 是否有response
          if (item.response) { return item.response.data }
          return { file_name: item.name, file_url: item.url }
        })
        onReturnDate(_arr, file.response)
      })
    }
    if (file.status === 'error') {
      let item = fileList[0]
      let res = item.response
      let _msg = res.msg || '服务器错误'
      message.info('错误：' + _msg)
      // loading
      this.setState({ loading: false })
      this.setState({ fileList: [] })
    }
  }
  render() {
    const { fileList } = this.state
    const { action, method, btnName, verifyType, dataName } = this.props
    beforeType = verifyType
    /*
    * name 发到后台的文件参数名
    * action 上传的地址
    * beforeUpload 上传文件之前的钩子
    * onChange 上传文件改变时的状态 上传中、完成、失败都会调用这个函数。
    */
    return (
      <div className='myFileUpload'>
        <Upload
          name={dataName || "file"}
          headers={{
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }}
          method={method}
          fileList={fileList}
          action={API_URL() + action}
          onChange={this.onChange}
          beforeUpload={beforeUpload}>
          <Button icon="upload">{btnName}</Button>
        </Upload>
      </div>
    );
  }
}
export default myFileUpload;