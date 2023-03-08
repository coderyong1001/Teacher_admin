/*
 * @Author: yuanhang 
 * @Date: 2019-11-01 11:05:52 
 * @Last Modified by: yuanhang
 * @Last Modified time: 2020-02-05 16:46:29
 */
// 证书管理
import React, { Component } from 'react';
// 引入css
import './index.less'
// api
import { apiCode, putUploadCertificate } from '../../../api/index'
// 文件上传
import MyBgUpload from '../myBgUpload/myBgUpload'
import Next from '../next/index.js'
// 组件
import { message, Form, Button } from 'antd';

//自定义富文本
import CertificateEditor from '../certificateEditor'

class Certificate extends Component {
  constructor(props) {
		super(props)
 
		this.quill = React.createRef()  //1.创建一个ref的引用，并且可以通过this.myRef属性去进行访问
		this.state = {
      dataID: '',
      fileList: [], // 课程资料
      editorImg:'',
      html:'',
      excel:'',
      nextState:false,
      course_id:props.course_id
    }
	}
  
  

  static defaultProps = {
    courseData: null,
  }
  //下载并解析模板
  analysisHtml(){
    if(this.props.template){
      fetch(this.props.template, {method: 'GET'}).then(res => res.text()).then((res)=>{
        this.setState({editorImg:res.slice(res.indexOf('hidden; background-image: url(')+30,res.indexOf('); background-size')),html:this.transformationHtml(res.slice(res.indexOf('no-repeat; ">')+13,res.indexOf('</div><script>')))})
      })
    }
    return 
  }
  //
  transformationHtml(value){
    value = value.replace(/({{q1}}|{{q2}}|{{q3}}|{{q4}}|⑤)/gi, function (matchStr, p) {
      return {
        '{{q1}}': '①',
        '{{q2}}': '②',
        '{{q3}}': '③',
        '{{q4}}': '④',
        '{{q5}}': '⑤',
      }[p] //
    })
    return value
  }
  componentDidMount () {
    const { courseData } = this.props
    this.analysisHtml()
    if (!courseData) { return }
    if (courseData && courseData.template) {
      this.setState({ fileList: [{ file_name: "当前模版", file_url: courseData.template }] })
    }
    this.setState({
      dataID: courseData.id
    })
  }
  // 上传文件返回值
  onGetFileDate = (data) => {

    let _data = data.slice(-1)
    this.setState({
      fileList: _data
    })
    if (!_data || _data.length === 0) { return }
    putUploadCertificate({ file_url: _data[0].file_url }, this.state.dataID).then((res) => {
      // 为空退出
      if (!res) return
      if (res.code === apiCode()) {
        message.info('提交成功')
      } else {
        let _msg = res.msg || '服务器错误'
        message.info('错误：' + _msg)
      }
    })
  }


  //设置editorImg地址
  changeEditorImg =(event)=>{
    this.setState({editorImg: event});
  }
  //设置Html文件
  changeHtml =(event)=>{
    this.setState({html: event});
  }

  render () {
    return (
      <div className='Certificate mt30'>
        {!this.state.editorImg && 
        <div className='defStyle'>
          <p className='tip'>请先上传模板图片！</p>
        </div>}
        {this.state.editorImg && 
        <div className='content'>
          <CertificateEditor editorImg={this.state.editorImg} html={this.state.html} changeHtml={this.changeHtml}></CertificateEditor>
        </div>}
        <div className='myBgUpload'>
          <MyBgUpload changeEditorImg={this.changeEditorImg}/>
          {this.state.editorImg && 
            <>
              <Next
              course_id={this.state.course_id}
              editorImg={this.state.editorImg}
              nextState={this.nextState}
              html={this.state.html}/>
            </>}
        </div>
      </div>
    );
  }
}

export default Certificate;