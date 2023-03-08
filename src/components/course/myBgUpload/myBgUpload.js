import React from 'react'
import 'antd/dist/antd.css'
import { Upload, message, Button } from 'antd'
import { API_URL, file_upload } from '../../../api/index'

const App = (props) => {
  const { changeEditorImg } = props
  /***
	上传验证格式及大小
*/
  function beforeUpload(file) {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
    if (!isJpgOrPng) {
      message.error('只能上传JPG或PNG文件!')
      return false
    }
    return isJpgOrPng
  }

  //上传文件状态改变时
  async function onChange({ file }) {
    if (file.status === 'done') {
      await changeEditorImg(file.response.data.file_url)
      return
    } else if (file.status === 'error') {
      message.error('上传模板背景图失败，请重新上传！')
    }
  }

  //上传参数
  const file = {
    // customRequest: customRequest,//移除默认上传方式，自定义。
    showUploadList: false, // 不展示文件列表
    beforeUpload: beforeUpload,
    name: 'file',
    action: API_URL() + file_upload(),
    maxCount: 1,
    onChange: onChange,
  }
  return (
    <Upload {...file} className='Upload'>
      <Button size='large' style={{ background: '#9d9d9d', color: '#fff', border: '0' }}>
        上传模板
      </Button>
    </Upload>
  )
}

export default App
