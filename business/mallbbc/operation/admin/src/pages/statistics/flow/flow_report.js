//流量报表模块
import moment from 'moment';
import { connect } from 'dva/index';
import React, { Component } from 'react';
import { Form, Tabs } from 'antd';
import {
    sldLlineRtextAddGoodsAddMargin,
    sldComLanguage,
    sldIconBtnBg,
    failTip,
    getAuthBtn
} from '@/utils/utils';
import global from '@/global.less';
import stat from '@/assets/css/stat.less';
import StatisticsReportFlowByDay from './flow_by_day';
import StatisticsReportFlowByStore from './flow_by_store';
import AuthBtn from '@/components/AuthBtn';


let btnAuth = getAuthBtn();
const TabPane = Tabs.TabPane;
@connect(({ statistics }) => ({
    statistics
}))
@Form.create()

export default class StatisticsReportFlow extends Component {
    constructor(props) {
        super(props);
        this.state = {
            export_params: {
                day: {
                    startTime: (`${moment().subtract(1, 'days').format('YYYY-MM-DD') } 00:00:00`),
                    endTime: (`${moment().subtract(1, 'days').format('YYYY-MM-DD') } 23:59:59:999`)
                }, store: {
                    startTime: (`${moment().subtract(1, 'days').format('YYYY-MM-DD') } 00:00:00`),
                    endTime: (`${moment().subtract(1, 'days').format('YYYY-MM-DD') } 23:59:59:999`)
                }
            },//导出的筛选条件
            active_key: 'day'//当前tab
        };
    }

    componentDidMount() {
        btnAuth = getAuthBtn();
    }

  onRefDay = (ref) => {
      this.childDay = ref;
  }

  onRefStore = (ref) => {
      this.childStore = ref;
  }

  handleSldExcel = () => {
      const { export_params, active_key } = this.state;
      let dataList = {}
      if(active_key == 'day'){
          dataList = this.childDay.state.data
      }else{
          dataList = this.childStore.state.data
      }
      if(dataList.list != undefined && dataList.list.length == 0){
          failTip('没有可导出的数据!');
          return 
      }
      let paramData = {
          ...export_params[active_key]
      };
      paramData.fileName = `${sldComLanguage('流量报表导出')}`;
      const { dispatch } = this.props;
      this.setState({ initLoading: true });
      let dis_type = 'statistics/export_trade_report_by_day';
      if (active_key == 'store') {
          dis_type = 'statistics/export_trade_report_by_store';
      }
      dispatch({
          type: dis_type,
          payload: paramData,
          callback: (res) => {
              if (res.state != undefined && res.state == 255) {
                  failTip(res.msg);
              }
              this.setState({ initLoading: false });
          }
      });
  };

  onHandleTabClick = (e) => {
      this.setState({ active_key: e });
  };

  //更新导出的参数
  updateExportParam = (params, type) => {
      let { export_params } = this.state;
      export_params[type] = { ...export_params[type], ...params };
      this.setState({ export_params });
  };

  getBtnAuthExport = () =>{
      const { active_key } = this.state;
      if(active_key == 'day'){
          return ['export_flow_by_day']
      } 
      if(active_key == 'store'){
          return ['export_flow_by_store']
      }
      return []
  }

  render() {
      return (
          <div style={{ margin: '10px 0', paddingBottom: 10, width: '100%' }} className={`${stat.common_table_item}`}>
              <div className={`${stat.label_panel} ${global.flex_row_between_center}`}>
                  {sldLlineRtextAddGoodsAddMargin('#FA6F1E', `${sldComLanguage('流量报表')}`, 10, 0, 0)}
                  <AuthBtn eventKey={this.getBtnAuthExport()} btnAuth={btnAuth}>
                      {sldIconBtnBg(() => this.handleSldExcel(), 'ziyuan23', `${sldComLanguage('导出报表')}`, '#fff', 7, 10, 15, 15, 3)}
                  </AuthBtn>
              </div>
              <div className={`${stat.stat_common_table}`} style={{ paddingLeft: 10, marginTop: 10 }}>
                  <Tabs type="card" defaultActiveKey="day" animated={false} onTabClick={this.onHandleTabClick}>
                      <TabPane tab={`${sldComLanguage('按天')}`} key="day">
                          <StatisticsReportFlowByDay updateExportParam={(e) => this.updateExportParam(e, 'day')} onRef={this.onRefDay} />
                      </TabPane>
                      <TabPane tab={`${sldComLanguage('按店铺')}`} key="store">
                          <StatisticsReportFlowByStore updateExportParam={(e) => this.updateExportParam(e, 'store')} onRef={this.onRefStore} />
                      </TabPane>
                  </Tabs>
              </div>
          </div>
      );
  }
}
