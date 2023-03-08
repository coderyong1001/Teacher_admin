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
import { ContentUtils } from 'braft-utils'
// 引入css
import './index.module.less'

// 编辑器工具栏控件列表
const controls = [
  'undo',
  'redo',
  'separator',
  'font-size',
  'line-height',
  'letter-spacing',
  'separator',
  'text-color',
  'bold',
  'italic',
  'underline',
  'strike-through',
  'separator',
  'superscript',
  'subscript',
  'remove-styles',
  'emoji',
  'separator',
  'text-indent',
  'text-align',
  'separator',
  'list-ul',
  'list-ol',
  'separator',
  'separator',
  'hr',
  'separator',
  'separator',
  'clear',
]

class MyComponent extends Component {
  render() {
    const listQ = ['Q1', 'Q2', 'Q3', 'Q4', 'Q5']
    const insertList = ['①', '②', '③', '④', '⑤']
    return (
      <div className='myComponent'>
        <div className='listQ'>
          <p className='des'>插入占位符</p>
          {listQ.map((item, index) => {
            return (
              <div
                className='buttonQ'
                onClick={() => {
                  this.props.insertQ(insertList[index])
                }}
                key={index}
              >
                {item ? item : ''}
              </div>
            )
          })}
        </div>
      </div>
    )
  }
}
class MyBraftEditor extends Component {
  state = {
    editorState: this.props.html,
    instance: null,
  }

  handleChange = (editorState) => {
    //获取文档中内容最后一个元素的所在高度
    let contentHeight = this.state.instance.getDraftInstance().editor.lastElementChild.clientHeight
    if (contentHeight > 588) {
      this.state.instance.undo() //撤销上一次输入
      return
    }
    console.log(editorState.toHTML())
    this.setState({ editorState: editorState })
    // 父组件传参
    this.props.changeHtml(editorState.toHTML())
  }
  insertQ = (value) => {
    this.setState({
      editorState: ContentUtils.insertText(this.state.editorState, value),
    })
  }
  onRef = (instance) => {
    this.setState({
      instance,
    })
  }
  componentDidMount() {
    setTimeout(() => {
      this.state.instance.getDraftInstance().focus()
    }, 0)
  }
  render() {
    // 自定义按钮 显示HTML
    const extendControls = [
      'separator',
      { key: 'my-component', type: 'component', component: <MyComponent insertQ={this.insertQ} /> },
    ]
    return (
      <div className='myBraftEditor'>
        <BraftEditor
          ref={this.onRef}
          defaultValue={BraftEditor.createEditorState(this.props.html)}
          value={this.state.editorState}
          onChange={this.handleChange}
          controls={controls}
          extendControls={extendControls}
          contentStyle={{
            backgroundImage: `url(${this.props.editorImg})`,
            backgroundSize: `100% 100%`,
          }}
        />
      </div>
    )
  }
}

export default MyBraftEditor
