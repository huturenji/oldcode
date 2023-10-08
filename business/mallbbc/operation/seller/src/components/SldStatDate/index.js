/*
* 统计里通用的时间选择器
* idIndex 每个id后面会追加一个idIndex，防止组件之间混乱
* @zjf-2021-06-30
* */
import { connect } from 'dva/index';
import moment from 'moment';
import React, { Component } from 'react';
import { Form, Radio } from 'antd';
import {
    sldTsvg, formatMonthOrDay
} from '@/utils/utils';
import global from '@/global.less';
import stat from '@/assets/css/stat.less';

let sthis = '';
@connect(({ sldsetting }) => ({
    sldsetting
}))
@Form.create()

export default class SldStatDate extends Component {
    isFirstShowDateSelectModal = false;//是否第一次刚显示时间选择面板

    constructor(props) {
        super(props);
        sthis = this;
        this.state = {
            dateSelectModal: false,//是否展示时间选择面板
            seleDateType: 'day',//时间选择面板左侧时间类型
            seleDateShowDetailTime: props.diyDateMaxFlag == 'today'?moment().format('YYYY/MM/DD'):moment().subtract(1, 'days').format('YYYY/MM/DD'),//时间筛选器显示具体时间
            currentStartTime: moment().startOf('day'),
            left: 0,
            right: 'auto',
            top: 35,
            bottom: 'auto',
            showFlag: false
        };
    }

    /**
     * 监听props变化
     * @param {*} nextProps 最新属性对象
     */
    componentWillReceiveProps(nextProps){
        let seleDateShowDetailTime = '';
        if(this.props.defaultDateValue !== nextProps.defaultDateValue) {            
            switch (nextProps.defaultDateValue) {
            case 'yesterday':
                seleDateShowDetailTime = moment().subtract(1, 'days').format('YYYY/MM/DD');
                break;
            case 'lastest_seven_day':
                seleDateShowDetailTime = nextProps.diyDateMaxFlag == 'today'?`${moment().subtract(6, 'days').format('YYYY/MM/DD') }-${ moment().format('YYYY/MM/DD')}`:`${moment().subtract(6, 'days').format('YYYY/MM/DD') }-${ moment().subtract(1, 'days').format('YYYY/MM/DD')}`;
                break;
            case 'lastest_month':
                seleDateShowDetailTime = nextProps.diyDateMaxFlag == 'today'?`${moment().subtract(29, 'days').format('YYYY/MM/DD') }-${ moment().format('YYYY/MM/DD')}`:`${moment().subtract(29, 'days').format('YYYY/MM/DD') }-${moment().subtract(1, 'days').format('YYYY/MM/DD')}`;
                break;
            case 'today':
                seleDateShowDetailTime = moment().format('YYYY/MM/DD');
                break;
            case 'lastest_fifteen_day':
                seleDateShowDetailTime = nextProps.diyDateMaxFlag == 'today'?`${moment().subtract(14, 'days').format('YYYY/MM/DD') }-${ moment().format('YYYY/MM/DD')}`:`${moment().subtract(14, 'days').format('YYYY/MM/DD') }-${ moment().subtract(1, 'days').format('YYYY/MM/DD')}`;
                break;
            default:
                break;
            }
            if(seleDateShowDetailTime){
                this.setState({
                    seleDateShowDetailTime
                });
            }
        }
    }

    hideDateSelectModal = (e) => {
        let { dateSelectModal } = this.state;
        if (!(e.path != undefined && e.path[0] != undefined && (e.path[0].value == 'diy_select_day' || (e.path[0].className != undefined && e.path[0].className.indexOf('date_select_modal_flag') > -1)))) {
            if (dateSelectModal) {this.setState({ dateSelectModal: false },()=>{this.isFirstShowDateSelectModal = false;});}
        }
    };
  

  //laydate选择完的时间格式化为以/分隔的时间
  formatLaydateSelDate = (date) => `${date.year}/${formatMonthOrDay(date.month)}/${formatMonthOrDay(date.date)}`;

  //laydate选择完的时间格式化为以-分隔的时间
  formatLaydateSelDateTwo = (date) => `${date.year}-${formatMonthOrDay(date.month)}-${formatMonthOrDay(date.date)}`;

  //日期面板类型选择
  selectDateType = (e, type) => {
      //   e.stopPropagation();
      let { seleDateType } = this.state;
      let { diyDateMinValue, diyDateMaxFlag} = this.props;
      if (seleDateType == type && !this.isFirstShowDateSelectModal) {return false;}
      const { idIndex } = this.props;
      this.setState({ seleDateType: type });
      let _this = this;
      let callbackTime = { startTime: '', endTime: '' };
      let today = new Date();
      //获取上一月份
      let maxMonth = `${today.getFullYear() }-${ today.getMonth()}`;
      //获取上一周的最后一天
      today.setTime(today.getTime() - (today.getDay()) * 24 * 60 * 60 * 1000);
      let lastWeekEndDate = `${today.getFullYear() }-${ today.getMonth() + 1 }-${ today.getDate()}`;

      /* global layui */
      if (type == 'day') {
      //自然日选择器
          layui.use('laydate', () => {
              let laydate = layui.laydate;
              laydate.render({
                  elem: `#day${idIndex}` //指定元素
                  , position: 'static'
                  , theme: '#FF7324'
                  , value: diyDateMaxFlag=='today'?moment().format('YYYY-MM-DD'):moment().subtract(1, 'days').format('YYYY-MM-DD')
                  , showBottom: false
                  , min: '1900-1-1'
                  , max: diyDateMaxFlag=='today'?moment().format('YYYY-MM-DD'):moment().subtract(1, 'days').format('YYYY-MM-DD')
                  , isPreview: false //禁用面板左下角选择值的预览，默认 true
                  , done: function(value, date) {
                      //点击日期、清空、现在、确定均会触发。回调返回三个参数，分别代表：生成的值、日期时间对象、结束的日期时间对象
                      //转换为上面要显示的时间并关闭弹层
                      // value //得到日期生成的值，如：2017-08-18
                      // date //得到日期时间对象：{year: 2017, month: 8, date: 18, hours: 0, minutes: 0, seconds: 0}
                      // endDate //得结束的日期时间对象，开启范围选择（range: true）才会返回。对象成员同上。
                      _this.setState({
                          seleDateShowDetailTime: sthis.formatLaydateSelDate(date),
                          dateSelectModal: false
                      });
                      callbackTime.startTime = `${sthis.formatLaydateSelDateTwo(date) } 00:00:00`;
                      callbackTime.endTime = `${sthis.formatLaydateSelDateTwo(date) } 23:59:59:999`;
                      _this.props.updateSelectDate(callbackTime);
                  }
                  // eslint-disable-next-line no-unused-vars
                  , change: function(value, date, endDate) {
                      //年月日时间被切换时都会触发。回调返回三个参数，分别代表：生成的值、日期时间对象、结束的日期时间对象
                      //主要更新选择限制
                      // value //得到日期生成的值，如：2017-08-18
                      // date //得到日期时间对象：{year: 2017, month: 8, date: 18, hours: 0, minutes: 0, seconds: 0}
                      // endDate //得结束的日期时间对象，开启范围选择（range: true）才会返回。对象成员同上。
                  }
              });
          });
      } else if (type == 'week') {
      //自然周选择器
          layui.use('laydate', () => {
              let laydate = layui.laydate;
              laydate.render({
                  elem: `#week${idIndex}` //指定元素
                  , position: 'static'
                  , theme: '#FF7324'
                  , value: lastWeekEndDate
                  , max: lastWeekEndDate
                  , showBottom: false
                  , isPreview: false //禁用面板左下角选择值的预览，默认 true
                  , done: function(value, date) {
                      //点击日期、清空、现在、确定均会触发。回调返回三个参数，分别代表：生成的值、日期时间对象、结束的日期时间对象
                      //转换为上面要显示的时间并关闭弹层
                      // value //得到日期生成的值，如：2017-08-18
                      // date //得到日期时间对象：{year: 2017, month: 8, date: 18, hours: 0, minutes: 0, seconds: 0}
                      // endDate //得结束的日期时间对象，开启范围选择（range: true）才会返回。对象成员同上。
                      let showTime = `${moment(sthis.formatLaydateSelDateTwo(date)).startOf('week').format('YYYY/MM/DD') }-${ moment(sthis.formatLaydateSelDateTwo(date)).endOf('week').format('YYYY/MM/DD')}`;
                      _this.setState({
                          seleDateShowDetailTime: showTime,
                          dateSelectModal: false
                      }, () => {
                          this.isFirstShowDateSelectModal = false;
                      });
                      callbackTime.startTime = `${moment(sthis.formatLaydateSelDateTwo(date)).startOf('week').format('YYYY-MM-DD') } 00:00:00`;
                      callbackTime.endTime = `${moment(sthis.formatLaydateSelDateTwo(date)).endOf('week').format('YYYY-MM-DD') } 23:59:59:999`;
                      _this.props.updateSelectDate(callbackTime);
                  }
                  , change: function() {
                      //年月日时间被切换时都会触发。回调返回三个参数，分别代表：生成的值、日期时间对象、结束的日期时间对象
                      //主要更新选择限制
                      // value //得到日期生成的值，如：2017-08-18
                      // date //得到日期时间对象：{year: 2017, month: 8, date: 18, hours: 0, minutes: 0, seconds: 0}
                      // endDate //得结束的日期时间对象，开启范围选择（range: true）才会返回。对象成员同上。
                  }
              });
          });
      } else if (type == 'month') {
      //自然月选择器
          layui.use('laydate', () => {
              let laydate = layui.laydate;
              laydate.render({
                  elem: `#month${idIndex}` //指定元素
                  , type: 'month'
                  , position: 'static'
                  , theme: '#FF7324'
                  , value: maxMonth
                  , max: today.setDate(0) //上个月的最后一天
                  , showBottom: false
                  , isPreview: false //禁用面板左下角选择值的预览，默认 true
                  , done: function(value, date) {
                      //点击日期、清空、现在、确定均会触发。回调返回三个参数，分别代表：生成的值、日期时间对象、结束的日期时间对象
                      //转换为上面要显示的时间并关闭弹层
                      // value //得到日期生成的值，如：2017-08-18
                      // date //得到日期时间对象：{year: 2017, month: 8, date: 18, hours: 0, minutes: 0, seconds: 0}
                      // endDate //得结束的日期时间对象，开启范围选择（range: true）才会返回。对象成员同上。
                      _this.setState({
                          seleDateShowDetailTime: `${date.year}/${formatMonthOrDay(date.month)}`,
                          dateSelectModal: false
                      }, () => {
                          this.isFirstShowDateSelectModal = false;
                      });
                      callbackTime.startTime = `${moment(`${date.year}-${formatMonthOrDay(date.month)}-01`).startOf('month').format('YYYY-MM-DD') } 00:00:00`;
                      callbackTime.endTime = `${moment(`${date.year}-${formatMonthOrDay(date.month)}-01`).endOf('month').format('YYYY-MM-DD') } 23:59:59:999`;
                      _this.props.updateSelectDate(callbackTime);
                  }
                  , change: function() {
                      //年月日时间被切换时都会触发。回调返回三个参数，分别代表：生成的值、日期时间对象、结束的日期时间对象
                      //主要更新选择限制
                      // value //得到日期生成的值，如：2017-08-18
                      // date //得到日期时间对象：{year: 2017, month: 8, date: 18, hours: 0, minutes: 0, seconds: 0}
                      // endDate //得结束的日期时间对象，开启范围选择（range: true）才会返回。对象成员同上。
                  }
              });
          });
      } else if (type == 'year') {
      //自然年选择器
          layui.use('laydate', () => {
              let laydate = layui.laydate;
              laydate.render({
                  elem: `#year${idIndex}` //指定元素
                  , type: 'year'
                  , position: 'static'
                  , theme: '#FF7324'
                  , max: `${(today.getFullYear() - 1).toString() }-12-31`
                  , value: (today.getFullYear() - 1).toString()
                  , showBottom: false
                  , isPreview: false //禁用面板左下角选择值的预览，默认 true
                  , done: function(value, date) {
                      //点击日期、清空、现在、确定均会触发。回调返回三个参数，分别代表：生成的值、日期时间对象、结束的日期时间对象
                      //转换为上面要显示的时间并关闭弹层
                      // value //得到日期生成的值，如：2017-08-18
                      // date //得到日期时间对象：{year: 2017, month: 8, date: 18, hours: 0, minutes: 0, seconds: 0}
                      // endDate //得结束的日期时间对象，开启范围选择（range: true）才会返回。对象成员同上。
                      _this.setState({
                          seleDateShowDetailTime: date.year,
                          dateSelectModal: false
                      }, () => {
                          this.isFirstShowDateSelectModal = false;
                      });
                      callbackTime.startTime = `${moment(`${date.year}-01-01`).startOf('year').format('YYYY-MM-DD') } 00:00:00`;
                      callbackTime.endTime = `${moment(`${date.year}-01-01`).endOf('year').format('YYYY-MM-DD') } 23:59:59:999`;
                      _this.props.updateSelectDate(callbackTime);
                  }
                  , change: function() {
                      //年月日时间被切换时都会触发。回调返回三个参数，分别代表：生成的值、日期时间对象、结束的日期时间对象
                      //主要更新选择限制
                      // value //得到日期生成的值，如：2017-08-18
                      // date //得到日期时间对象：{year: 2017, month: 8, date: 18, hours: 0, minutes: 0, seconds: 0}
                      // endDate //得结束的日期时间对象，开启范围选择（range: true）才会返回。对象成员同上。
                  }
              });
          });
      } else if (type == 'diy') {
      //自定义选择器
          layui.use('laydate', () => {
              let laydate = layui.laydate;
              let valueRange = `${moment().subtract(-diyDateMinValue, 'days').format('YYYY-MM-DD')} - ${moment().format('YYYY-MM-DD')}`
              laydate.render({
                  elem: `#diy${idIndex}` //指定元素
                  , range: true
                  , position: 'static'
                  , theme: '#FF7324'
                  , value: valueRange
                  , min: diyDateMinValue || -365
                  , max: diyDateMaxFlag=='today'?moment().format('YYYY-MM-DD'):moment().subtract(1, 'days').format('YYYY-MM-DD')
                  , btns: ['cancle', 'confirm']
                  , isPreview: false //禁用面板左下角选择值的预览，默认 true
                  , done: function(value, date, endDate) {
                      //点击日期、清空、现在、确定均会触发。回调返回三个参数，分别代表：生成的值、日期时间对象、结束的日期时间对象
                      //转换为上面要显示的时间并关闭弹层
                      // value //得到日期生成的值，如：2017-08-18
                      // date //得到日期时间对象：{year: 2017, month: 8, date: 18, hours: 0, minutes: 0, seconds: 0}
                      // endDate //得结束的日期时间对象，开启范围选择（range: true）才会返回。对象成员同上。
                      if (value) {
                          _this.setState({
                              seleDateShowDetailTime: `${sthis.formatLaydateSelDate(date) }-${ sthis.formatLaydateSelDate(endDate)}`,
                              dateSelectModal: false
                          }, () => {
                              this.isFirstShowDateSelectModal = false;
                          });
                          callbackTime.startTime = `${sthis.formatLaydateSelDateTwo(date) } 00:00:00`;
                          callbackTime.endTime = `${sthis.formatLaydateSelDateTwo(endDate) } 23:59:59:999`;
                          _this.props.updateSelectDate(callbackTime);
                      } else {
                          //取消按钮不做处理，只是隐藏时间选择器
                          _this.setState({
                              dateSelectModal: false
                          }, () => {
                              this.isFirstShowDateSelectModal = false;
                          });
                      }
                  }
                  , change: function() {
                      //年月日时间被切换时都会触发。回调返回三个参数，分别代表：生成的值、日期时间对象、结束的日期时间对象
                      //主要更新选择限制
                      // value //得到日期生成的值，如：2017-08-18
                      // date //得到日期时间对象：{year: 2017, month: 8, date: 18, hours: 0, minutes: 0, seconds: 0}
                      // endDate //得结束的日期时间对象，开启范围选择（range: true）才会返回。对象成员同上。
                  }
              });
          });
      }
      this.isFirstShowDateSelectModal = false;
  };

  //日期tab切换
  handleDataSelect = (e) => {
      //   e.stopPropagation();
      const { diyDateMaxFlag } = this.props;
      let { seleDateShowDetailTime, dateSelectModal, seleDateType } = this.state;
      let callbackTime = { startTime: '', endTime: '' };
      if (e.target.value == 'yesterday') {
      //选择昨日
          seleDateShowDetailTime = moment().subtract(1, 'days').format('YYYY/MM/DD');
          dateSelectModal = false;
          seleDateType = 'day';
          callbackTime.startTime = `${moment().subtract(1, 'days').format('YYYY-MM-DD') } 00:00:00`;
          callbackTime.endTime = `${moment().subtract(1, 'days').format('YYYY-MM-DD') } 23:59:59:999`;
      } else if (e.target.value == 'lastest_seven_day') {
      //选择近7天
          seleDateShowDetailTime = diyDateMaxFlag=='today'?`${moment().subtract(6, 'days').format('YYYY/MM/DD') }-${ moment().format('YYYY/MM/DD')}`:`${moment().subtract(7, 'days').format('YYYY/MM/DD') }-${ moment().subtract(1, 'days').format('YYYY/MM/DD')}`;
          dateSelectModal = false;
          seleDateType = 'day';
          callbackTime.startTime = diyDateMaxFlag=='today'?`${moment().subtract(6, 'days').format('YYYY-MM-DD') } 00:00:00`:`${moment().subtract(7, 'days').format('YYYY-MM-DD') } 00:00:00`;
          callbackTime.endTime = diyDateMaxFlag=='today'?`${moment().format('YYYY-MM-DD') } 23:59:59:999`:`${moment().subtract(1, 'days').format('YYYY-MM-DD') } 23:59:59:999`;
      } else if (e.target.value == 'lastest_month') {
          //选择近30天
          seleDateShowDetailTime = diyDateMaxFlag=='today'?`${moment().subtract(29, 'days').format('YYYY/MM/DD') }-${ moment().format('YYYY/MM/DD')}`:`${moment().subtract(30, 'days').format('YYYY/MM/DD') }-${ moment().subtract(1, 'days').format('YYYY/MM/DD')}`;
          dateSelectModal = false;
          seleDateType = 'day';
          callbackTime.startTime = diyDateMaxFlag=='today'?`${moment().subtract(29, 'days').format('YYYY-MM-DD') } 00:00:00`:`${moment().subtract(30, 'days').format('YYYY-MM-DD') } 00:00:00`;
          callbackTime.endTime = diyDateMaxFlag=='today'?`${moment().format('YYYY-MM-DD') } 23:59:59:999`:`${moment().subtract(1, 'days').format('YYYY-MM-DD') } 23:59:59:999`;
      } else if (e.target.value == 'today') {
          // 今天
          seleDateShowDetailTime = moment().format('YYYY/MM/DD');
          dateSelectModal = false;
          seleDateType = 'day';
          callbackTime.startTime = `${moment().format('YYYY-MM-DD') } 00:00:00`;
          callbackTime.endTime = `${moment().format('YYYY-MM-DD') } 23:59:59:999`;
      } else if (e.target.value == 'lastest_fifteen_day') {
          // 选择近15天
          seleDateShowDetailTime = diyDateMaxFlag=='today'?`${moment().subtract(14, 'days').format('YYYY/MM/DD') }-${ moment().format('YYYY/MM/DD')}`:`${moment().subtract(15, 'days').format('YYYY/MM/DD') }-${ moment().subtract(1, 'days').format('YYYY/MM/DD')}`;
          dateSelectModal = false;
          seleDateType = 'day';
          callbackTime.startTime = diyDateMaxFlag=='today'?`${moment().subtract(14, 'days').format('YYYY-MM-DD') } 00:00:00`:`${moment().subtract(15, 'days').format('YYYY-MM-DD') } 00:00:00`;
          callbackTime.endTime = diyDateMaxFlag=='today'?`${moment().format('YYYY-MM-DD') } 23:59:59:999`:`${moment().subtract(1, 'days').format('YYYY-MM-DD') } 23:59:59:999`;
      }
      this.props.updateSelectDate(callbackTime,e);
      this.setState({
          seleDateShowDetailTime,
          dateSelectModal,
          seleDateType
      }, () => {
          this.isFirstShowDateSelectModal = false;
      });
  };

  //显示时间选择面板
  showDateSelectModal = (e) => {
      //   e.stopPropagation();
      let datePosition = this.refs.sld_stat_data_type.getBoundingClientRect();
      let screen = document.body;
      let _this = this;
      let { seleDateType, dateSelectModal, left, right, top, bottom } = this.state;
      let dateShowWidth = seleDateType == 'diy' ? 370 : 90;
      let dateShowHeight = seleDateType == 'diy' ? 365 : 320;
      if (screen.clientWidth != undefined && datePosition.right != undefined && screen.clientWidth * 1 - datePosition.right * 1 < dateShowWidth) {
          right = 0;
          left = 'auto';
      } else {
          right = 'auto';
          left = 0;
      }
      if (screen.clientHeight != undefined && datePosition.bottom != undefined && screen.clientHeight * 1 - datePosition.bottom * 1 < dateShowHeight) {
          bottom = 35;
          top = 'auto';
      } else {
          bottom = 'auto';
          top = 35;
      }
      this.setState({
          dateSelectModal: true,
          right,
          left,
          bottom,
          top
      }, () => {
          this.isFirstShowDateSelectModal = true;
          if (!dateSelectModal) {
              _this.selectDateType(e, seleDateType);
          }
      });
  };


  render() {
      const { seleDateType, seleDateShowDetailTime, dateSelectModal, left, right, bottom } = this.state;
      const { idIndex,dateRangeArray,defaultDateValue,dateSelectType } = this.props;
      const dateArr = dateRangeArray || 
          [
              {label:'昨日',value:"yesterday"},
              {label:'近7天',value:"lastest_seven_day"},
              {label:'近30天',value:"lastest_month"}
          ];
      return (
          <div className={`${stat.date_part}`} ref="sld_stat_data_type">
              <Radio.Group size="small" onChange={(e) => this.handleDataSelect(e)} value={defaultDateValue}>
                  {
                      dateArr.map(item => <Radio.Button value={item.value}>{ item.label }</Radio.Button>)
                  }
                  <Radio.Button value="diy_select_day">
                      <div
                          onClick={(e) => this.showDateSelectModal(e)}
                          className={`${global.flex_row_between_center}`}
                          style={{ width: 167 }}
                      >
                          <span 
                              style={{
                                  display: 'inline-block',
                                  marginRight: 10
                              }}
                          >{seleDateShowDetailTime}</span>{sldTsvg('rili', '#C8C9CC', 18, 18)}
                      </div>
                  </Radio.Button>
              </Radio.Group>
              {dateSelectModal == true &&
              <div className={stat.date_container}>
                  <div
                      className={stat.date_picker_mask}
                      onClick={(e) => this.hideDateSelectModal(e)}
                  />
                  <div
                      className={`${stat.date_select_modal} ${global.flex_row_start_start} ${stat.date_select_modal_flag}`}
                      style={{ height: seleDateType == 'diy' ? 350 : 309, left: left, right: right, top: '10px', bottom: bottom }}
                  >
                      <div
                          className={`${stat.left} ${global.flex_column_start_center} ${stat.date_select_modal_flag}`}
                          style={{ height: seleDateType == 'diy' ? 308 : 288 }}
                      >
                          {
                              (!dateSelectType || dateSelectType.includes('day')) &&
                            <a
                                className={`${global.flex_row_center_center} ${seleDateType == 'day' ? stat.selected : null} ${stat.date_select_modal_flag}`}
                                onClick={(e) => this.selectDateType(e, 'day')}
                            >自然日</a>
                          }
                          {
                              (!dateSelectType || dateSelectType.includes('week')) &&
                            <a
                                className={`${global.flex_row_center_center} ${seleDateType == 'week' ? stat.selected : null} ${stat.date_select_modal_flag}`}
                                onClick={(e) => this.selectDateType(e, 'week')}
                            >自然周</a>
                          }

                          {
                              (!dateSelectType || dateSelectType.includes('month')) &&
                            <a
                                className={`${global.flex_row_center_center} ${seleDateType == 'month' ? stat.selected : null} ${stat.date_select_modal_flag}`}
                                onClick={(e) => this.selectDateType(e, 'month')}
                            >自然月</a>
                          }

                          {
                              (!dateSelectType || dateSelectType.includes('year')) &&
                            <a
                                className={`${global.flex_row_center_center} ${seleDateType == 'year' ? stat.selected : null} ${stat.date_select_modal_flag}`}
                                onClick={(e) => this.selectDateType(e, 'year')}
                            >自然年</a>
                          }

                          {
                              (!dateSelectType || dateSelectType.includes('diy')) &&
                            <a
                                className={`${global.flex_row_center_center} ${seleDateType == 'diy' ? stat.selected : null} ${stat.date_select_modal_flag}`}
                                onClick={(e) => this.selectDateType(e, 'diy')}
                            >自定义</a>
                          }
                      </div>
                      {seleDateType == 'day' && <div id={`day${idIndex}`} />}
                      {seleDateType == 'week' && <div id={`week${idIndex}`} />}
                      {seleDateType == 'month' && <div id={`month${idIndex}`} />}
                      {seleDateType == 'year' && <div id={`year${idIndex}`} />}
                      {seleDateType == 'diy' && <div id={`diy${idIndex}`} />}
                  </div>
              </div>
              }
          </div>
      );
  }
}
