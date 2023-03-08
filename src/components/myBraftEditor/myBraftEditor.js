/*
 * @Author: yuanhang 
 * @Date: 2019-11-07 10:31:17 
 * @Last Modified by: yuanhang
 * @Last Modified time: 2020-03-04 16:01:46
 */
// 自定义富文本
import React, { Component } from 'react'
import 'braft-editor/dist/index.css'
import BraftEditor from 'braft-editor'
// 引入css
import './index.css'

import { API_URL, file_upload } from '../../api/index'
import { Button } from 'antd';

// 不显示加粗控件、斜体控件和下划线控件
const excludeControls = ['emoji', 'blockquote', 'code']
// 多媒体上传
const accepts = {
  image: 'image/png,image/jpeg,image/gif,image/webp,image/apng,image/svg',
  video: false,
  audio: false,
}
// 多媒体外链
const externals = {
  image: 'image/png,image/jpeg,image/gif,image/webp,image/apng,image/svg',
  video: 'video/mp4',
  audio: false,
}


class MyBraftEditor extends Component {

  state = {
    editorState: BraftEditor.createEditorState('<p></p>'), // 设置编辑器初始内容
    outputHTML: '<p></p>',
    isOutput: false,
  }

  static defaultProps = {
    onRenew: () => console.log('MyBraftEditor组件回调函数'),
    onRef: () => console.log('MyBraftEditor组件回调函数'),
  }

  componentWillMount () {
    let { value, initialValue } = this.props
    value = value || initialValue
    this.setState({
      editorState: BraftEditor.createEditorState(value),
      outputHTML: value
    })
  }

  handleChange = (editorState) => {
    this.setState({
      editorState: editorState,
      outputHTML: editorState.toHTML()
    })
    // 父组件传参
    this.props.onChange(editorState.toHTML())
  }
  // 上传
  myUploadFn = (param) => {
    const serverURL = API_URL() + file_upload()
    const xhr = new XMLHttpRequest()
    const fd = new FormData()

    const successFn = (response) => {
      const responseText = JSON.parse(xhr.responseText)
      // 假设服务端直接返回文件上传后的地址
      // 上传成功后调用param.success并传入上传后的文件地址
      param.success({
        url: responseText.data.file_url,
        meta: {
          id: param.id,
          title: param.file.name,
          alt: param.file.name,
          loop: true, // 指定音视频是否循环播放
          autoPlay: true, // 指定音视频是否自动播放
          controls: true, // 指定音视频是否显示控制栏
          poster: responseText.data.file_url, // 指定视频播放器的封面
        }
      })
    }

    const progressFn = (event) => {
      // 上传进度发生变化时调用param.progress
      param.progress(event.loaded / event.total * 100)
    }

    const errorFn = (response) => {
      // 上传发生错误时调用param.error
      param.error({
        msg: '上传发生错误'
      })
    }

    xhr.upload.addEventListener("progress", progressFn, false)
    xhr.addEventListener("load", successFn, false)
    xhr.addEventListener("error", errorFn, false)
    xhr.addEventListener("abort", errorFn, false)

    fd.append('file', param.file)
    xhr.open('POST', serverURL, true)
    xhr.send(fd)
  }
  // 自定义按钮 显示HTML
  extendControls = [
    'separator',
    {
      key: 'button-html', // 控件唯一标识，必传
      type: 'button',
      title: '显示HTML', // 指定鼠标悬停提示文案
      className: 'button-html', // 指定按钮的样式名
      html: null, // 指定在按钮中渲染的html字符串
      text: 'HTML', // 指定按钮文字，此处可传入jsx，若已指定html，则text不会显示
      onClick: () => {
        this.toOutput()
      },
    }
  ]
  toOutput = () => {
    this.setState({ isOutput: !this.state.isOutput })
  }
  render () {
    const { editorState, outputHTML, isOutput } = this.state

    return (
      <div className='MyBraftEditor'>

        <div className="editor-wrapper-content">
          <div className="editor-wrapper">
            <BraftEditor
              value={editorState}
              onChange={this.handleChange}
              excludeControls={excludeControls}
              media={{ uploadFn: this.myUploadFn, accepts: accepts, externals: externals }}
              extendControls={this.extendControls}
            />
          </div>
          {isOutput && <div className="output-content">
            <Button className="output-content-btn" type="link" onClick={this.toOutput}>返回</Button>
            <h5>输出内容</h5>
            <p>{outputHTML}</p>
          </div>}
        </div>
      </div>
    );
  }
}

export default MyBraftEditor;