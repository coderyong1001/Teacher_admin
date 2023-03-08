/*
 * @Author: yuanhang
 * @Date: 2019-10-31 14:34:23
 * @Last Modified by: yuanhang
 * @Last Modified time: 2020-05-27 18:01:57
 */
//课程编辑页
import React, { Component } from "react";
// 引入css
import "./index.css";
// 引入公共类
import { formValidation, getUrlSearch, allIsEmpty } from "../../../utils/utils";
// 布局
import Layouts from "../../../components/layouts/index";
// 住宿管理
import Hostel from "../../../components/course/hostel/hostel";
// 基础信息页
import Basics from "../../../components/course/basics/basics";
// 报名详情
import Enlist from "../../../components/course/enlist/enlist";
// 证书管理
import Certificate from "../../../components/course/certificate/certificate";
// 发票管理
import Invoice from "../../../components/course/invoice/invoice";
// 问卷管理
import Questionnaire from "../../../components/course/questionnaire/questionnaire";
// 签到管理
import Autograph from "../../../components/course/autograph/autograph";
// api
import {
  apiCode,
  getCourseID,
  putCourseID,
  putRecommendHotel,
} from "../../../api/index";
// 组件
import { message, Button, Tabs } from "antd";
// 标签页
const { TabPane } = Tabs;

class CourseEdit extends Component {
  state = {
    activeKey: "3",
    course_id: null,
    dataList: null,
    courseData: null,
    AutographKey: "AutographKey",
    btnLoading: false,
    course_type: 2,
    template:''
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
    if (key === "7") {
      let timestamp = new Date().getTime();
      this.setState({ AutographKey: "AutographKey" + timestamp });
    }
    if (key === "1") {
      this.getData();
    }
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
  componentWillMount() {
    this.setState(
      {
        course_id: this.props.match.params.id,
      },
      () => {
        this.getData();
      }
    );
    let _key = this.getUrlKey();
    if (!_key || _key !== "5") {
      return;
    }
    this.setActiveKey(_key);
  }
  UNSAFE_componentWillReceiveProps(nextProps) {
    // const { } = nextProps
  }
  getUrlKey = () => {
    let key = null;
    key = this.props.location.query
      ? this.props.location.query.key
      : getUrlSearch().key;
    return key;
  };
  // 获取数据 调用了子元素的this.props.form （注意：不要在 componentWillReceiveProps 内使用，否则会导致死循环）
  getData = () => {
    const { course_id } = this.state;
    getCourseID(course_id).then((res) => {
      // 为空退出
      if (!res) return;
      if (res.code === apiCode()) {
        if (res.data) {
          let _data = res.data;
          _data.apply_time = [_data.apply_start_time, _data.apply_end_time];
          // 基本信息页数据传入
          if (this.childBasics) {
            this.childBasics.toUpdate(res.data);
          }
          this.setState({ courseData: res.data, course_type: res.data.course_type, template:res.data.template });
        }
      } else {
        // loading
        this.setState({ loading: false });
        let _msg = res.msg || "服务器错误";
        message.info("错误：" + _msg);
      }
    });
  };
  // 得到子组件
  onBasicsRef = (ref) => {
    this.childBasics = ref;
  };
  onHostelRef = (ref) => {
    this.childHostel = ref;
  };
  onInvoiceRef = (ref) => {
    this.childInvoice = ref;
    let _key = this.getUrlKey();
    if (!_key || _key !== "5") {
      return;
    }
    this.childInvoice.onDrawerClose();
  };
  // 返回
  toReturn = () => {
    this.props.history.push("/course");
  };
  // 翻页
  setActiveKey = (activeKey) => {
    this.setState({
      activeKey: activeKey,
    });
  };
  // 提交
  submit = () => {
    let { courseData, course_id } = this.state;
    courseData = { ...courseData, ...this.childBasics.toSuccess() };
    let conference = courseData.conference || [];
    if (!allIsEmpty(conference)) {
      return message.warning("请确定联系方式数据");
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
    if (courseData && courseData.schedule && courseData.schedule.detail) {
      let _obj = this.setRange(courseData.schedule.detail);
      courseData = { ...courseData, ..._obj };
      this.setState({ courseData });
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
    putCourseID(courseData, course_id).then((res) => {
      // 为空退出
      if (!res) return;
      if (res.code === apiCode()) {
        message.info("提交成功");
        // this.toReturn()
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
  // 提交酒店
  submitHotel = () => {
    let { course_id } = this.state;
    let data = this.childHostel.toSuccess();
    // let hotelList = this.childHostel.getHotelList()
    // let data = { recommend_hotel: this.childHostel.toSuccess() }

    if (!data || data === {}) {
      return;
    }

    this.setState({ btnLoading: true });
    putRecommendHotel(data, course_id).then((res) => {
      // 为空退出
      if (!res) return;
      if (res.code === apiCode()) {
        message.info("提交成功");
        this.setState({ btnLoading: false });
      } else {
        this.setState({ btnLoading: false });
        let _msg = res.msg || "服务器错误";
        message.info("错误：" + _msg);
      }
    });
  };
  // 表单值格式化去首尾空格
  onChange = (e, key) => {
    let _data = e.target ? e.target.value : e
    if (key === 'course_type') {
      this.setState({
        course_type: _data
      })
    }
  }
  render() {
    const { courseData, activeKey, btnLoading, course_type } = this.state;
    const { AutographKey } = this.state;
    return (
      <Layouts pathname={this.props} history={this.props.history}>
        <div className="CourseNewTitle">
          <p className="title">
            {" "}
            课程编号：
            {courseData && courseData.course_num ? courseData.course_num : ""}
            <br /> 课程名称：
            {courseData && courseData.name ? courseData.name : ""}{" "}
          </p>
          <Button className="return" onClick={this.toReturn}>
            返回
          </Button>
        </div>
        <Tabs activeKey={activeKey} onChange={this.callback}>
          <TabPane tab="报名详情" key="3">
            <Enlist courseData={courseData} />
          </TabPane>
          <TabPane tab="发票管理" key="5">
            <Invoice onRef={this.onInvoiceRef} courseData={courseData} />
          </TabPane>
          <TabPane tab="签到管理" key="7">
            <Autograph key={AutographKey} />
          </TabPane>
          <TabPane tab="基本信息" key="1">
            {/* 基础信息页 */}
            <Basics onRef={this.onBasicsRef} onChange={this.onChange} />
            <div className="CourseNewBtnBox mt20">
              <Button type="primary" loading={btnLoading} onClick={this.submit}>
                提交
              </Button>
            </div>
          </TabPane>
          {course_type === 2 && (
            <TabPane tab="住宿管理" key="2">
              <Hostel onRef={this.onHostelRef} courseData={courseData} />
              <div className="CourseNewBtnBox mt20">
                <Button
                  type="primary"
                  loading={btnLoading}
                  onClick={this.submitHotel}
                >
                  提交
                </Button>
              </div>
            </TabPane>
          )}

          <TabPane tab="证书" key="4">
            <Certificate template={this.state.template} course_id = {this.state.course_id} courseData={courseData} />
          </TabPane>
          <TabPane tab="问卷管理" key="6">
            <Questionnaire />
          </TabPane>
        </Tabs>
      </Layouts>
    );
  }
}

export default CourseEdit;
