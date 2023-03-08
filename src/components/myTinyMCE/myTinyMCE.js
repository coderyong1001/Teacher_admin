/*
 * @Author: yuanhang 
 * @Date: 2019-11-07 10:31:17 
 * @Last Modified by: yuanhang
 * @Last Modified time: 2020-02-05 10:17:39
 */
// 自定义富文本
import React, { Component } from 'react'
import { Editor } from '@tinymce/tinymce-react'
import { API_URL, file_upload, apiCode } from '../../api/index'

class MyTinyMCE extends Component {
  state = {
    content: null,
    dataKey: 'MyTinyMCE',
  }
  static defaultProps = {
    dataKey: 'MyTinyMCE',
    dataTitle: '富文本标题',
    content: null,
    onRenew: () => console.log('MyTinyMCE组件回调函数')
  }
  componentDidMount () {
    const { content, dataKey } = this.props
    this.setState({ content, dataKey })
  }
  UNSAFE_componentWillReceiveProps (nextProps) {
    const { content } = nextProps
    this.setState({ content: content })
  }

  handleEditorChange = (content, editor) => {
    const { onRenew } = this.props
    this.setState({
      content: content
    })
    onRenew(content)
  }
  // handleEditorChange = (e) => {
  //   const { onRenew } = this.props
  //   let _content = e.target.getContent()
  //   this.setState({
  //     content: _content
  //   })
  //   onRenew(_content)
  // }
  render () {
    const { dataTitle } = this.props
    const { content, dataKey } = this.state
    return (
      <div className='MyTinyMCE'>
        <div className="ant-col ant-form-item-label"><label className="ant-form-item-required" title={dataTitle}>{dataTitle}</label></div>
        {/* <span>{dataTitle}</span> */}
        <br />
        <br />
        <Editor
          key={dataKey}
          apiKey='y26fybffb5wbha33sxrcal1mk9j7nctklx3j5kmvw1893u4d'
          init={{
            branding: false, // 隐藏右下角技术支持
            language_url: '/zh_CN.js',
            language: 'zh_CN',//注意大小写
            //启用菜单栏并显示如下项 [文件 编辑 插入 格式 表格]
            menubar: 'file edit insert view format table',
            // 配置每个菜单栏的子菜单项（如下是默认配置）
            menu: {
              file: { title: 'File', items: 'newdocument' },
              edit: { title: 'Edit', items: 'undo redo | cut copy paste pastetext | selectall' },
              insert: { title: 'Insert', items: 'link media | template hr | image' },
              view: { title: 'View', items: 'visualaid' },
              format: { title: 'Format', items: 'bold italic underline strikethrough superscript subscript | formats | removeformat' },
              table: { title: 'Table', items: 'inserttable tableprops deletetable | cell row column' },
            },
            height: 400,
            plugins: [
              'advlist autolink lists link image charmap print preview anchor',
              'searchreplace visualblocks code fullscreen',
              'insertdatetime media table paste code help wordcount'
            ],
            toolbar: [
              'undo redo | formatselect | bold italic forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | image'],
            images_upload_url: API_URL() + file_upload(),
            images_upload_handler: function (blobInfo, succFun, failFun) {
              var xhr, formData
              var file = blobInfo.blob()  //转化为易于理解的file对象
              xhr = new XMLHttpRequest()
              xhr.withCredentials = false
              xhr.open('POST', API_URL() + file_upload())
              xhr.onload = function () {
                var json = JSON.parse(xhr.responseText)
                if (xhr.status !== apiCode()) {
                  failFun('HTTP Error: ' + json.msg);
                  return;
                }

                if (!json || typeof json.data.file_url != 'string') {
                  failFun('Invalid JSON: ' + json.msg);
                  return;
                }
                succFun(json.data.file_url)
              }
              formData = new FormData()
              formData.append('file', file, file.name)//此处与源文档不一样
              xhr.send(formData)
            }
          }}
          // initialValue={content}
          value={content}
          // onChange={this.handleEditorChange}
          onEditorChange={this.handleEditorChange}
        />
      </div>
    );
  }
}

export default MyTinyMCE;