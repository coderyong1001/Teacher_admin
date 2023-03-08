/*
 * @Author: yuanhang 
 * @Date: 2019-11-01 13:41:46 
 * @Last Modified by: yuanhang
 * @Last Modified time: 2020-05-14 14:52:27
 */
// 问卷管理
import React, { Component } from 'react';
// utils
import { getUrlID } from '../../../utils/utils'
// api
import { apiCode, uploadQuestionnaire, getQuestionnaireID } from '../../../api/index'
// 导入组件
import { Row, Col, message, Input } from 'antd';
const { Search } = Input;

class Questionnaire extends Component {
  state = {
    course_id: null,
    link: null,
    questionnaire_link: null,
  }
  componentDidMount() {
    let { course_id } = this.props
    course_id = course_id || getUrlID()
    if (course_id) {
      this.setState({ course_id })
    }
    this.getID()
  }
  getID = () => {
    let { course_id } = this.props
    course_id = course_id || getUrlID()
    getQuestionnaireID(course_id).then((res) => {
      // 为空退出
      if (!res) return
      if (res.code === apiCode()) {
        this.setState({ link: res.data.questionnaire_link })
      } else {
        let _msg = res.msg || '服务器错误'
        message.info('错误：' + _msg)
      }
    })
  }
  // 上传
  toUpload = (link) => {
    let { course_id } = this.props
    course_id = course_id || getUrlID()
    this.setState({ link })
    uploadQuestionnaire({ link }, course_id).then((res) => {
      // 为空退出
      if (!res) return
      if (res.code === apiCode()) {
        message.info('提示：' + res.msg)
      } else {
        let _msg = res.msg || '服务器错误'
        message.info('错误：' + _msg)
      }
    })
  }
  render() {
    const { link } = this.state

    return (
      <div className='Questionnaire'>
        <Row gutter={12}>
          <Col span={12}>
            <p className='fs-20 fw-7'>上传问卷ID</p>
            <Search
              style={{ width: '400px' }}
              placeholder="上传问卷ID"
              enterButton="上传"
              onSearch={this.toUpload}
            />
          </Col>
          <Col span={12}>
            <p className='fs-20 fw-7'>登录问卷星</p>
            {!link && <p className='fs-20 fw-7'><a href='https://www.wjx.cn/' target='_blank' rel="noopener noreferrer">https://www.wjx.cn/</a></p>}
            {link && <p className='fs-20 fw-7'><a href={`https://www.wjx.cn/jq/${link}.aspx`} target='_blank' rel="noopener noreferrer">{`https://www.wjx.cn/jq/${link}.aspx`}</a></p>}
          </Col>
        </Row>

      </div>
    )
  }
}

export default Questionnaire;