import React, { Component } from 'react';
import { DatePicker } from 'antd';
import moment from 'moment'
import 'moment/locale/zh-cn'
moment.locale('zh-cn');

class YearPicker extends Component {

  state = {
    isopen: false,
    time: null
  }
  componentWillMount () {
    const { initialValue } = this.props
    if (!initialValue) { return }
    this.setState({ time: moment(initialValue, 'YYYY') })
  }

  render () {
    const { isopen, time } = this.state
    return (
      <div>
        <DatePicker
          value={time}
          open={isopen}
          mode="year"
          placeholder="请选择年份"
          format="YYYY"
          onOpenChange={(status) => {
            if (status) {
              this.setState({ isopen: true })
            } else {
              this.setState({ isopen: false })
            }
          }}
          onPanelChange={(value) => {
            this.setState({
              time: value,
              isopen: false
            })
            // getFieldDecorator 包裹 调用父组件onChange传值  注意是返回的moment格式
            this.props.onChange(value.format('YYYY'))
          }}
          onChange={() => {
            this.setState({ time: null })
          }}
        />
      </div>
    );
  }
}

export default YearPicker;