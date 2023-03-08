/*
 * @Author: yuanhang
 * @Date: 2019-11-06 11:20:55
 * @Last Modified by: yuanhang
 * @Last Modified time: 2020-02-05 15:44:42
 */
import React, { Component, Fragment } from "react";
// 引入地点选择
import Location from "../location/location";
// 组件
import { Input, Radio, TimePicker, Button } from "antd";
// 日期
import moment from "moment";
import "moment/locale/zh-cn";
moment.locale("zh-cn");
// 多行文本
const { TextArea } = Input;
function checkTime(i) {
  if (i < 10) {
    i = "0" + i;
  }
  return i;
}
const format = "HH:mm";

class DisposeList extends Component {
  state = {
    course_date: null,

    start_time: null,
    end_time: null,
    need_checkin: true,
    checkin_start: 30,
    checkin_end: 30,
    content: "",
    location: [],
    locationList: ["location"],
    startvalue: null,
    endvalue: null,
  };
  static defaultProps = {
    course_date: null,
    dyaData: {
      start_time: null,
      end_time: null,
      need_checkin: true,
      checkin_start: 30,
      checkin_end: 30,
      content: "",
      location: [],
    },
    dayIndex: 0,
    panelIndex: 0,
    onDyaRenew: () => console.log("DisposeList组件回调函数"),
  };
  componentDidMount() {
    const { dyaData, courseDate } = this.props;
    let { locationList } = this.state;
    let location = dyaData.location || [];
    if (location.length > 0) {
      location.forEach((item, index) => {
        if (index !== 0) {
          locationList.push("location");
        }
      });
    }
    this.setState({
      locationList,
      course_date: courseDate,
      start_time: dyaData.start_time,
      end_time: dyaData.end_time,
      need_checkin: dyaData.need_checkin,
      checkin_start: dyaData.checkin_start,
      checkin_end: dyaData.checkin_end,
      content: dyaData.content,
      location: location,
      startvalue: dyaData.start_time ? dyaData.start_time.slice(-5) : null,
      endvalue: dyaData.end_time ? dyaData.end_time.slice(-5) : null,
    });
  }

  // 更新
  dyaRenew = () => {
    const { panelIndex, dayIndex, onDyaRenew } = this.props;
    const {
      course_date,
      start_time,
      end_time,
      need_checkin,
      checkin_start,
      checkin_end,
      content,
    } = this.state;
    let { location } = this.state;
    if (location) {
      let arr = [];
      location.forEach((item) => {
        if (item !== null && item !== "" && item !== undefined) {
          arr.push(item);
        }
      });
      location = arr;
    }
    let _dyaData = {
      course_date,
      start_time,
      end_time,
      need_checkin,
      checkin_start,
      checkin_end,
      content,
      location,
    };
    onDyaRenew(_dyaData, panelIndex, dayIndex);
  };
  // 删除
  onDanger = () => {
    const { panelIndex, dayIndex, onDyaDanger } = this.props;
    onDyaDanger(panelIndex, dayIndex);
  };
  // 上课开始时间
  onStartTime = (val) => {
    const { course_date } = this.state;
    if (!val) {
      this.setState(
        {
          start_time: val,
          startvalue: val,
        },
        () => {
          this.dyaRenew();
        }
      );
      return;
    }
    if (val && !val["_d"]) {
      this.setState(
        {
          start_time: val,
          startvalue: val,
        },
        () => {
          this.dyaRenew();
        }
      );
      return;
    }
    let _d = new Date(val["_d"]);
    let _data = checkTime(_d.getHours()) + ":" + checkTime(_d.getMinutes());
    // let _data = checkTime(_d.getHours()) + ':' + checkTime(_d.getMinutes()) + ':' + checkTime(_d.getSeconds())
    this.setState(
      {
        start_time: course_date + " " + _data,
        startvalue: val,
      },
      () => {
        this.dyaRenew();
      }
    );
  };
  // 上课结束时间
  onEndTime = (val) => {
    const { course_date } = this.state;
    if (!val) {
      this.setState(
        {
          end_time: val,
          endvalue: val,
        },
        () => {
          this.dyaRenew();
        }
      );
      return;
    }
    if (val && !val["_d"]) {
      this.setState(
        {
          end_time: val,
          endvalue: val,
        },
        () => {
          this.dyaRenew();
        }
      );
      return;
    }
    let _d = new Date(val["_d"]);
    let _data = checkTime(_d.getHours()) + ":" + checkTime(_d.getMinutes());
    // let _data = checkTime(_d.getHours()) + ':' + checkTime(_d.getMinutes()) + ':' + checkTime(_d.getSeconds())
    this.setState(
      {
        end_time: course_date + " " + _data,
        endvalue: val,
      },
      () => {
        this.dyaRenew();
      }
    );
  };
  // 日程内容
  onContentChange = (val) => {
    this.setState(
      {
        content: val.target.value,
      },
      () => {
        this.dyaRenew();
      }
    );
  };
  // 是否需要签到
  onCheckinChange = (val) => {
    this.setState(
      {
        need_checkin: val.target.value,
      },
      () => {
        this.dyaRenew();
      }
    );
  };
  // 签到开启时间
  onCheckinStart = (val) => {
    this.setState(
      {
        checkin_start: val.target.value,
      },
      () => {
        this.dyaRenew();
      }
    );
  };
  // 签到结束时间
  onCheckinEnd = (val) => {
    this.setState(
      {
        checkin_end: val.target.value,
      },
      () => {
        this.dyaRenew();
      }
    );
  };
  // 设置上课地点
  setLocation = (value, index) => {
    let { location } = this.state;
    if (!location) {
      location = [];
    }
    location[index] = value;
    this.setState({ location }, () => {
      this.dyaRenew();
    });
  };
  // 添加地点
  AddLocation = () => {
    let { locationList, location } = this.state;
    let length = locationList.length;
    if (length >= 3) {
      return;
    }
    if (!location || !location[length - 1]) {
      return;
    }
    locationList.push("location");
    this.setState({ locationList });
  };
  // 删除
  toDelete = (index) => {
    let { locationList, location } = this.state;
    locationList.splice(index, 1);
    location.splice(index, 1);
    this.setState({ locationList, location }, () => {
      this.dyaRenew();
    });
  };
  render() {
    let {
      startvalue,
      endvalue,
      content,
      need_checkin,
      checkin_start,
      checkin_end,
      location,
      locationList,
    } = this.state;
    const { dayIndex, panelIndex, course_type } = this.props;

    startvalue = startvalue ? moment(startvalue, "HH:mm") : null;
    endvalue = endvalue ? moment(endvalue, "HH:mm") : null;
    return (
      <div>
        <span className="mr15">上课开始时间</span>
        <TimePicker
          getCalendarContainer={(triggerNode) => triggerNode.parentNode}
          onChange={this.onStartTime}
          value={startvalue}
          defaultValue={moment("00:00", format)}
          format={format}
          id={"start_time_" + dayIndex + "_" + panelIndex}
        />
        <span className="mr15"></span>
        <span className="mr15">上课结束时间</span>
        <TimePicker
          getCalendarContainer={(triggerNode) => triggerNode.parentNode}
          onChange={this.onEndTime}
          value={endvalue}
          defaultValue={moment("00:00", format)}
          format={format}
          id={"end_time" + dayIndex + "_" + panelIndex}
        />
        <span className="mr15"></span>
        {dayIndex !== 0 && (
          <Button onClick={this.onDanger} type="danger">
            删除课程
          </Button>
        )}
        <br />
        <br />
        {course_type === 2 && (
          <Fragment>
            <span>上课地点</span>
            <Button
              className="ml20"
              onClick={this.AddLocation}
              disabled={locationList.length >= 3}
              icon="plus"
            >
              添加地点
            </Button>
            <br />
            <br />
          </Fragment>
        )}

        {locationList && course_type === 2 &&
          locationList.map((item, index) => {
            return (
              <Location
                key={"Location_" + index}
                dataIndex={index}
                location={location}
                onChange={this.setLocation}
                onDelete={this.toDelete}
              />
            );
          })}

        <span>日程安排</span>
        <br />
        <br />
        <TextArea rows={4} onChange={this.onContentChange} value={content} />
        <br />
        <br />
        <span className="mr15">是否需要签到</span>
        <Radio.Group onChange={this.onCheckinChange} value={need_checkin}>
          <Radio value={true}>需要</Radio>
          <Radio value={false}>不需要</Radio>
        </Radio.Group>
        <br />
        <br />
        {need_checkin && <span className="mr15">签到开启时间</span>}
        {need_checkin && (
          <Radio.Group onChange={this.onCheckinStart} value={checkin_start}>
            <Radio value={30}>提前30分钟</Radio>
            <Radio value={60}>提前1小时</Radio>
            <Radio value={1}>当日开始前</Radio>
          </Radio.Group>
        )}
        {need_checkin && <br />}
        {need_checkin && <br />}
        {need_checkin && <span className="mr15">签到结束时间</span>}
        {need_checkin && (
          <Radio.Group onChange={this.onCheckinEnd} value={checkin_end}>
            <Radio value={30}>上课30分钟</Radio>
            <Radio value={60}>上课1小时</Radio>
            <Radio value={1}>当日结束</Radio>
          </Radio.Group>
        )}
        {need_checkin && <br />}
        {need_checkin && <br />}
      </div>
    );
  }
}

export default DisposeList;
