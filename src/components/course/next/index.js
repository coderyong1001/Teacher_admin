import React, { useState, useRef } from 'react'
import 'antd/dist/antd.css'
import './index.less'
import { Upload, message, Button, Spin, Progress } from 'antd'
import { certificate_upload, task_result } from '../../../api/index'
import { request, eventSource } from '../../../api/request'
import editorHtml from '../../../utils/editorHtml'
import { Base64 } from 'js-base64'
import { encode, decode } from 'js-base64'

let xlsFlie = null
const App = (props) => {
  //文件列表
  const [fileList, setFileList] = useState([])

  const { nextState, html, editorImg, course_id } = props
  const [state, setState] = useState(nextState)
  const [spin1, setSpin1] = useState(false)
  const [spin2, setSpin2] = useState(false)
  const [result, setResult] = useState(false)

  //发放预计时间
  const time_consume_ref = useRef({ times: 0 })
  //发放进度时间
  let [time_consume_progress, setTime_consume_progress] = useState(0)
  //发放结果
  let [data_num, setData_num] = useState(0)
  let [success_num, setSuccess_num] = useState(0)
  let [fail_num, setFail_num] = useState(0)
  let [reason, setReason] = useState('')

  /***
	上传验证格式及大小
*/
  function beforeUpload(file) {
    const suffix = file.name.split('.').pop()
    if (!['xls', 'xlsx'].includes(suffix)) {
      message.error('只能上传xlsx或xls文件!')
    }
    return false
  }

  function handleChange(info) {
    const isIncludes = ['xls', 'xlsx'].includes(info.file.name.split('.').pop())
    if (!info.fileList.length) {
      xlsFlie = null
    } else if (isIncludes) {
      xlsFlie = info.file
    }
    setFileList(
      info.fileList
        .filter((item) => {
          return isIncludes === true
        })
        .slice(-1)
    )
  }

  function customRequest({ file }) {}
  const file = {
    onChange: handleChange,
    customRequest: customRequest,
    maxCount: 1,
    // showUploadList: false, // 不展示文件列表
    beforeUpload: beforeUpload,
    fileList: fileList,
  }

  //转base64
  function htmlBase64(option) {
    const reader = new FileReader()
    reader.readAsDataURL(option)
    reader.onloadend = function (e) {
      return e.target.result
    }
  }
  //预览
  const preview = () => {
    if (!xlsFlie) {
      message.error(`请先导入表格！`)
      return
    }
    let formData = new FormData()
    let isPreview = true
    formData.append('file', xlsFlie)
    console.log(editorHtml(html, editorImg))
    formData.append(
      'course_data',
      `{"preview": "${isPreview}",
      "course_id": "${course_id}",
      "template": "${encode(editorHtml(html, editorImg))}"}`
    )
    setSpin1(true)
    request({
      method: 'post',
      url: certificate_upload(),
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      responseType: 'blob',
    }).then((res) => {
      if (res.status && res.status === 200) {
        message.success('成功！')
        let binaryData = new Blob([res.data], { type: 'application/pdf;charset=utf-8' })
        let url = window.URL.createObjectURL(binaryData)
        setSpin1(false)
        setTimeout(() => {
          window.open(url)
        }, 1000)
      } else {
        setSpin1(false)
        message.error(res.data.msg)
      }
    })
  }

  //发放
  const grant = () => {
    if (!xlsFlie) {
      message.error(`请先导入表格！`)
      return
    }
    let formData = new FormData()
    let isPreview = false
    formData.append('file', xlsFlie)
    formData.append(
      'course_data',
      `{"preview": "${isPreview}",
      "course_id": "${course_id}",
      "template": "${encode(editorHtml(html, editorImg))}"}`
    )
    setResult(false)
    setSpin2(true)
    request({
      method: 'post',
      url: certificate_upload(),
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }).then((res) => {
      if (res.status && res.status === 200) {
        message.success('上传成功，请等待证书制作！')
        time_consume_ref.current.times = res.data.data.time_consume
        poll(res.data.data.task_id)
      } else {
        setSpin2(false)
        message.error(res.data.msg)
      }
    })
  }

  //轮询接口
  const poll = (task_id) => {
    //证书发放预计时间
    const pollParams = {
      task_id: task_id,
    }
    const timer1 = setInterval(() => {
      request({
        method: 'get',
        url: task_result(),
        params: pollParams,
      }).then((res) => {
        if (res.status === 200 && res.data.data.status === 'SUCCESS') {
          clearInterval(timer1)
          clearInterval(timer2)
          setTime_consume_progress(time_consume_ref.current.times)
          setData_num(res.data.data.result.data.data_num || 0)
          setFail_num(res.data.data.result.data.fail_num || 0)
          setSuccess_num(res.data.data.result.data.success_num || 0)
          setReason(res.data.data.result.data.reason || '')
          setTimeout(() => {
            setSpin2(false)
            setTime_consume_progress(0)
          }, 500)
          message.success('证书发放完毕！')
          setResult(true)
        } else if (res.status !== 200) {
          clearInterval(timer1, timer2)
          message.error('证书发放失败，请重试！')
          setSpin2(false)
          setTime_consume_progress(0)
        }
      })
    }, 5000)
    const timer2 = setInterval(() => {
      if (time_consume_progress < time_consume_ref.current.times) {
        setTime_consume_progress((time_consume_progress += 1))
      }
    }, 1000)
  }
  return (
    <>
      {state && (
        <div className='next'>
          <div className='updata'>
            <div className='top'>
              <p className='title'>上传附件</p>
              <div
                onClick={() => {
                  setState(!state)
                }}
                className='closeBG'
              ></div>
            </div>
            <div className='content'>
              <Upload {...file} className='Upload'>
                <button className='updataFile'>选择文件</button>
              </Upload>
            </div>
            <div className='bottom'>
              <div className='bgSpin bgSpin2'>
                {spin1 && (
                  <div className='tip'>
                    <p>请稍等，切勿关闭浏览器窗口！</p>
                  </div>
                )}
                <Spin spinning={spin1}>
                  <button onClick={preview} className='btn'>
                    预览
                  </button>
                </Spin>
              </div>
              <button
                onClick={() => {
                  setState(!state)
                }}
                className='btn'
              >
                完成
              </button>
            </div>
          </div>
        </div>
      )}
      <Button
        onClick={() => {
          setState(!state)
        }}
        size='large'
        style={{ background: '#9d9d9d', color: '#fff', border: '0' }}
      >
        下一步
      </Button>
      <div className='bgSpin bgSpin1'>
        {spin2 && (
          <div className='tip'>
            <p>请稍等，切勿关闭浏览器窗口！</p>
            <Progress
              percent={Math.trunc((time_consume_progress / time_consume_ref.current.times) * 100)}
            />
          </div>
        )}
        <Spin spinning={spin2}>
          <Button
            onClick={grant}
            size='large'
            style={{ background: '#9d9d9d', color: '#fff', border: '0' }}
          >
            发放
          </Button>
        </Spin>
        {result && (
          <div className='result'>
            <span>总发放人数：{data_num}</span>
            <span>成功人数：{success_num}</span>
            <span>失败人数：{fail_num}</span>
            <div className='reason'>
              <p>失败原因：</p>
              <div className='overflow'>
                <p>{reason}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default App
