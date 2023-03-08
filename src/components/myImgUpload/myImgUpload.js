/*
 * @Author: yuanhang 
 * @Date: 2019-11-11 17:18:31 
 * @Last Modified by: yuanhang
 * @Last Modified time: 2020-01-19 15:39:06
 */
// 图片上传
// css
import './index.css'
// api
import { apiCode, API_URL, file_upload } from '../../api/index'

import React, { Component } from 'react';
// 引入组件
import { Upload, Icon, message, Modal } from 'antd';

function getBase64 (img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

function beforeUpload (file) {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('限制格式 JPG/PNG');
  }
  const isLt500M = file.size / 1024 / 1024 < 500;
  if (!isLt500M) {
    message.error('超出500M');
  }
  return isJpgOrPng && isLt500M;
}

class MyImgUpload extends Component {
  state = {
    loading: false,
    showIcon: false,
    showModal: false,
    imageUrl: null,
    fileUrl: null,
    fileName: null,
  };
  static defaultProps = {
    onReturnDate: () => console.log('MyImgUpload组件回调函数')
  }

  componentDidMount () {
    const { fileUrl } = this.props
    this.setState({
      fileUrl: fileUrl
    })
  }
  UNSAFE_componentWillReceiveProps (nextProps) {
    const { fileUrl } = nextProps
    this.setState({
      fileUrl: fileUrl
    })
  }

  handleChange = info => {
    // 状态有：uploading done error removed
    if (info.file.status === 'uploading') {
      this.setState({ loading: true });
      return;
    }
    if (info.file.status === 'done') {
      // 上传成功
      getBase64(info.file.originFileObj, imageUrl => {
        let _res = info.file.response
        if (!_res) {
          message.error('上传接口返回数据异常');
          return
        }
        // code码api文件统一修改
        if (_res.code === apiCode()) {
          this.setState({
            imageUrl,
            loading: false,
            fileName: _res.data.file_name,
            fileUrl: _res.data.file_url,
          })
          const { onReturnDate } = this.props;
          onReturnDate(_res.data)
        } else {
          let _msg = _res.msg || '服务器错误'
          message.info('错误：' + _msg)
          this.setState({ loading: true });
          return
        }
      });
    }
  };
  // 阻止冒泡
  prevent = (e) => {
    e.stopPropagation();
  }
  // 显示展示图
  showImg = (e) => {
    this.setState({
      showModal: true
    })
  }
  // 隐藏展示图
  hideImg = (e) => {
    this.setState({
      showModal: false
    })
  }
  // 删除图片
  resetImg = (e) => {
    this.props.onReturnDate('')
    this.setState({
      fileUrl: null,
      imageUrl: null,
      fileName: null,
      loading: false,
      showIcon: false,
    })
  }
  // 进入
  handleMouseEnter = (e) => {
    this.setState({
      showIcon: true
    })
  }
  // 移出
  handleMouseLeave = (e) => {
    this.setState({
      showIcon: false
    })
  }
  render () {
    const { showModal, showIcon, fileUrl, fileName } = this.state

    const uploadButton = (
      <div>
        <Icon type={this.state.loading ? 'loading' : 'plus'} />
        <div className="ant-upload-text">上传</div>
      </div>
    );
    // 自定义按钮
    const IconButton = (
      <div className='btnBox' onClick={this.prevent} onMouseLeave={this.handleMouseLeave.bind(this)}>
        <div className='IconBtn'>
          {fileUrl && <a href={fileUrl} target="_blank" rel="noopener noreferrer">
            <Icon title='下载' style={{ fontSize: '20px', color: '#0066FF' }} type="vertical-align-bottom" />
          </a>}
          <span className='mr10'></span>
          <Icon title='展示图' style={{ fontSize: '20px', color: '#3399FF' }} type="file-image" onClick={this.showImg} />
          <span className='mr10'></span>
          <Icon title='删除' style={{ fontSize: '20px', color: '#FF0000' }} type="rest" onClick={this.resetImg} />
        </div>
      </div>
    );
    /*
    * name 发到后台的文件参数名
    * showUploadList 是否展示文件列表
    * action 上传的地址
    * beforeUpload 上传文件之前的钩子
    * onChange 上传文件改变时的状态 上传中、完成、失败都会调用这个函数。
    */
    return (
      <div className='MyImgUpload'>
        <Upload
          name="file"
          headers={{
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }}
          listType="picture-card"
          className="avatar-uploader"
          showUploadList={false}
          action={API_URL() + file_upload()}
          beforeUpload={beforeUpload}
          onChange={this.handleChange}
        >
          {fileUrl ? <img onMouseEnter={this.handleMouseEnter.bind(this)} src={fileUrl} alt={fileName ? fileName : 'avatar'} style={{ width: '100%' }} /> : uploadButton}
          {(fileUrl && showIcon) && IconButton}
        </Upload>
        <Modal visible={showModal} footer={null} onCancel={this.hideImg}>
          {fileName && <p>图片名称：{fileName}</p>}
          <p>图片地址：<a href={fileUrl} target="_blank" rel="noopener noreferrer">{fileUrl}</a></p>
          <img alt={fileName ? fileName : 'avatar'} style={{ width: '100%' }} src={fileUrl} />
        </Modal>
      </div>
    );
  }
}
export default MyImgUpload;