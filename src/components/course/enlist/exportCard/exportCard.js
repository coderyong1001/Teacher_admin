/*
 * @Author: yuanhang 
 * @Date: 2020-03-03 13:51:56 
 * @Last Modified by: yuanhang
 * @Last Modified time: 2020-05-20 10:39:14
 */
import React, { Component } from 'react';
// api
import { apiCode, exportAPI, getApplicantNames } from '../../../../api/index'
// 工具类
import { setDecimal } from '../../../../utils/utils'
// 导入组件
import { Icon, message, Row, Col, Input, Tag, Tooltip, Button } from 'antd'

const { Search } = Input;

class ExportCard extends Component {
  state = {
    nameList: [],
    names: [],
    name: '',
  }
  componentDidMount () {
    this.getList()
  }
  // 获取名称列表
  getList = () => {
    let { course_id } = this.props
    getApplicantNames({ course_id }).then((res) => {
      // 为空退出
      if (!res) return
      if (res.code === apiCode()) {
        this.setState({ nameList: res.data, names: [...res.data] })
      } else {
        // loading
        this.setState({ loading: false })
        let _msg = res.msg || '服务器错误'
        message.info('错误：' + _msg)
      }
    })
  }
  // 删除Tag
  deleteTag = (name, index) => {
    let names = [...this.state.names]
    names.splice(index, 1)
    this.setState({ names })
  }
  // 重置
  toReset = () => {
    let names = [...this.state.nameList]
    this.setState({ names })
  }
  // 全部删除
  toAllDelete = () => {
    this.setState({ names: [] })
  }
  // 设置名称
  setName = (e) => {
    let value = e.target.value
    this.setState({ name: value })
  }
  // 添加名称
  addName = (value) => {
    let names = [...this.state.names]
    names.push(value)
    this.setState({ name: '', names })
  }
  // 下载
  toDownload = () => {
    let names = [...this.state.names] || []
    exportAPI('post_export_card', { names },'桌牌表','doc')
  }

  render () {
    const { names, name } = this.state

    return (
      <div>
        <p className="fs-16">桌牌名单：</p>
        <Row gutter={12} style={{ minHeight: 100 }}>
          {names && names.map((item, index) => {
            return <Col key={item + '_' + index} span={6}>
              <Tooltip placement="top" title={item}>
                <Tag style={{ width: '120px', height: '30px', 'lineHeight': '30px', position: "relative" }} className='fs-14 txc'>{setDecimal(item)}<Icon style={{ position: 'absolute', top: 0, right: 0, color: '#FF0000' }} type="close" onClick={this.deleteTag.bind(this, item, index)} /></Tag>
              </Tooltip>
            </Col>
          })}
        </Row>
        <br />
        <p className="fs-16 txl">操作：</p>
        <div>
          <Search
            className="mr10"
            style={{ width: '250px' }}
            placeholder="输入名称"
            enterButton="添加"
            value={name}
            onChange={this.setName}
            onSearch={this.addName}
          />
          <Button className="mr10" onClick={this.toReset}>重置名单</Button>
          <Button type="danger" onClick={this.toAllDelete}>全部删除</Button>
        </div>
        <br />
        <br />
        <div className="txc">
          <Button disabled={names.length <= 0} type="primary" onClick={this.toDownload}>下载</Button>
        </div>
      </div>
    );
  }
}

export default ExportCard;