/*
 * @Author: yuanhang
 * @Date: 2019-10-22 19:52:15
 * @Last Modified by: yuanhang
 * @Last Modified time: 2020-05-27 18:01:57
 */
import React, { Component } from "react";
// 引入css
import "./index.css";
// 引入公共类
import { formValidation, allIsEmpty } from "../../../utils/utils";
// api
import { apiCode, postCourse } from "../../../api/index";
// 布局
import Layouts from "../../../components/layouts/index";
// 住宿管理
import Hostel from "../../../components/course/hostel/hostel";
// 基础信息页
import Basics from "../../../components/course/basics/basics";
// 组件
import { Button, Tabs, message, Modal } from "antd";
// 标签页
const { TabPane } = Tabs;
class CourseNew extends Component {
  state = {
    btnLoading: false,
    activeKey: "1",
    visible: false,
    isResume: true,
    courseData: null,
    course_type: 2, // 默认线下
  };
  componentDidMount() {
    let newBasics = localStorage.getItem("newBasics");
    if (!newBasics) {
      return;
    }
    this.setState({ visible: true });
  }
  // 确定提示
  okModal = () => {
    this.setState({ visible: false, isResume: true }, () => {
      let newBasics = localStorage.getItem("newBasics");
      newBasics = JSON.parse(newBasics);
      if(newBasics.schedule){
        this.childBasics.toUpdate(newBasics);
      }
      let courseData = {
        recommend_hotel: newBasics.recommendHotel,
      };
      this.setState({ courseData });
    });
  };
  // 关闭提示
  hideModal = () => {
    this.setState({ visible: false, isResume: false });
  };
  // 拆分数组
  splitArray = (data) => {
    let _array = [];
    data.forEach((item) => {
      if (item.day_times) {
        let _day = item.day_times;
        _array = [..._array, ..._day];
      }
    });
    return _array;
  };
  setRange = (detail) => {
    if(!detail || detail.length === 0)return
    let _array = this.splitArray(detail);
    let _dateArray = _array.map((item) => {
      return item.course_date;
    });
    if (_dateArray.length === 0) {
      return;
    }
    let range_start = _dateArray[0];
    let range_end = _dateArray[0];
    _dateArray.forEach((item) => {
      let _date = new Date(item);
      let _start = new Date(range_start);
      let _end = new Date(range_end);
      if (_start > _date) {
        range_start = item;
      }
      if (_end < _date) {
        range_end = item;
      }
    });
    let _obj = {
      range_end: range_end,
      range_start: range_start,
    };
    return _obj;
  };
  callback = (key) => {
    this.setState({
      activeKey: key,
    });
    if (key === "2") {
      if (!this.childBasics) {
        return;
      }
      let _data = this.childBasics.toSuccess();
      let courseData = this.state.courseData;
      if (_data && _data.schedule && _data.schedule.detail) {
        let _obj = this.setRange(_data.schedule.detail);
        courseData = { ...courseData, ..._obj };
        this.setState({ courseData });
      }
    }
  };
  // 返回
  toReturn = () => {
    this.props.history.push("/course");
  };
  // 跳转 更新值
  setActiveKey = (activeKey, isStop) => {
    let { courseData } = this.state;
    // 切换页数前保存之前数据到 courseData
    switch (activeKey) {
      case "1":
        courseData = { ...courseData, ...this.childHostel.toSuccess() };
        break;
      case "2":
        courseData = { ...courseData, ...this.childBasics.toSuccess() };
        if (courseData && courseData.schedule) {
          let _obj = this.setRange(courseData.schedule.detail);
          courseData = { ...courseData, ..._obj };
        }
        break;
      default:
        break;
    }
    if (activeKey === "2" && !courseData.qr_code) {
      return message.warning("请上传课程二维码");
    }
    this.setState({
      courseData,
    });
    if (!isStop) {
      return courseData;
    }
    this.setState({
      activeKey: activeKey,
    });
  };
  // 得到子组件
  onBasicsRef = (ref) => {
    this.childBasics = ref;
  };
  onHostelRef = (ref) => {
    this.childHostel = ref;
  };
  // 提交
  toSubmit = () => {
    let { courseData } = this.state;
    if (this.childHostel) {
      courseData = this.childHostel.toSuccess();
      if (!courseData) {
        return;
      }
    } else {
      courseData = {
        hotel_type: 1,
        recommend_hotel: []
      }
    }
    courseData = { ...courseData, ...this.childBasics.toSuccess() };
    let conference = courseData.conference || [];
    if (!allIsEmpty(conference)) {
      return message.warning("请确定联系方式数据");
    }
    if (!courseData.qr_code) {
      return message.warning("请上传课程二维码");
    }
    let rules = formValidation(courseData);
    let _rulesTexts = rules
      .map((item) => {
        return item.label;
      })
      .join("；");
    // 有值标识验证未通过
    if (_rulesTexts.length > 0) {
      message.warning(_rulesTexts + "  不能为空");
      return;
    }
    if (courseData.desc==='<p></p>'){
      message.warning("课程简介 不能为空");
      return;
    }
    this.setState({ btnLoading: true });
    // 删除无用
    Object.keys(courseData).forEach((key) => {
      if (
        !courseData[key] &&
        courseData[key] !== 0 &&
        courseData[key] !== false
      ) {
        delete courseData[key];
      }
    });
    if (courseData && courseData.schedule) {
      let _obj = this.setRange(courseData.schedule.detail);
      courseData = { ...courseData, ..._obj };
    }
    delete courseData.apply_time;
    //添加外层参数
    if(!courseData.schedule_pic){
      courseData.schedule_pic = ''
    }
    if(!courseData.schedule.detail || courseData.schedule.detail.length === 0){
      courseData.range_start = courseData.schedule.range_start
      courseData.range_end = courseData.schedule.range_end
      courseData.course_start = courseData.schedule.range_start + ' 00:00'
      courseData.course_end = courseData.schedule.range_end + ' 23:59'
      courseData.schedule = {}
    }
    postCourse(courseData).then((res) => {
      // 为空退出
      if (!res) return;
      if (res.code === apiCode()) {
        message.info("提交成功");
        localStorage.removeItem("newBasics");
        this.toReturn();
        // loading
        this.setState({ btnLoading: false });
      } else {
        // loading
        this.setState({ btnLoading: false });
        let _msg = res.msg || "服务器错误";
        message.info("错误：" + _msg);
      }
    });
  };

  // 设置本地
  setlocal = (data, key) => {
    let { isResume } = this.state;
    if (!data && data !== 0) {
      return;
    }
    // 如果是点击的取消 那再改变值时就取消本地保存
    if (!isResume) {
      localStorage.removeItem("newBasics");
    }
    let newBasics = localStorage.getItem("newBasics");
    if (!newBasics) {
      newBasics = {};
      newBasics[key] = data;
      localStorage.setItem("newBasics", JSON.stringify(newBasics));
      return;
    }
    newBasics = JSON.parse(newBasics);
    let _obj = {};
    _obj[key] = data;
    const temp = {..._obj}
    newBasics.schedule_pic = temp.schedule?.schedule_pic
    newBasics = { ...newBasics, ..._obj };
    localStorage.setItem("newBasics", JSON.stringify(newBasics));
    if (key === "course_type") {
      this.setState({
        course_type: data,
      });
    }
  };
  render() {
    const { activeKey, btnLoading, courseData, course_type } = this.state;
    return (
      <Layouts pathname={this.props} history={this.props.history}>
        <div className="CourseNewTitle">
          <p className="title"></p>
          <Button className="return" onClick={this.toReturn}>
            返回
          </Button>
        </div>
        <Tabs activeKey={activeKey} onChange={this.callback}>
          <TabPane tab="基本信息" key="1">
            {/* 基础信息页 */}
            <Basics onRef={this.onBasicsRef} onChange={this.setlocal} />
            <div className="CourseNewBtnBox mt20">
              {course_type === 2 ? (
                <Button onClick={this.setActiveKey.bind(this, "2", true)}>
                  下一页
                </Button>
              ) : (
                <Button
                  className="ml15"
                  type="primary"
                  onClick={this.toSubmit}
                  loading={btnLoading}
                >
                  提交
                </Button>
              )}
            </div>
          </TabPane>
          {course_type === 2 && (
            <TabPane tab="住宿管理" key="2">
              <Hostel
                onRef={this.onHostelRef}
                onChange={this.setlocal}
                courseData={courseData}
              />
              <div className="CourseNewBtnBox mt20">
                <Button
                  onClick={this.setActiveKey.bind(this, "1", true)}
                  loading={btnLoading}
                >
                  上一页
                </Button>
                <Button
                  className="ml15"
                  type="primary"
                  onClick={this.toSubmit}
                  loading={btnLoading}
                >
                  提交
                </Button>
              </div>
            </TabPane>
          )}
        </Tabs>

        <Modal
          width={300}
          centered
          maskClosable={false}
          title="提示"
          visible={this.state.visible}
          onOk={this.okModal}
          onCancel={this.hideModal}
          okText="确认"
          cancelText="取消"
        >
          <p>是否恢复未完成编辑？</p>
        </Modal>
      </Layouts>
    );
  }
}

export default CourseNew;
