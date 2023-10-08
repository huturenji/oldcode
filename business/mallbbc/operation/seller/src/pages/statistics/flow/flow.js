//流量报表模块
import { connect } from 'dva/index';
import React, { Component } from 'react';
import { Form } from 'antd';
import {
    sldLlineRtextAddMargin,
    sldComLanguage,
    sldIconBtnBg,
    failTip,
    hasAuth
} from '@/utils/utils';
import {
    statDateSearchParams
} from '@/utils/util_data';
import global from '@/global.less';
import stat from '@/assets/css/stat.less';
import StatisticsReportFlowByDay from './flow_by_day';

@connect(({ statistics }) => ({
    statistics
}))
@Form.create()

export default class StatisticsReportFlow extends Component {
    constructor(props) {
        super(props);
        this.state = {
            export_params: {
                day: statDateSearchParams(),
                store: statDateSearchParams()
            },//导出的筛选条件
            active_key: 'day'//当前tab
        };
    }

    componentDidMount() {
    }

  onRefDay = (ref) => {
      this.childDay = ref;
  }

  handleSldExcel = () => {
      const { export_params, active_key } = this.state;
      let dataList = {}
      if(active_key == 'day'){
          dataList = this.childDay.state.data
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

  render() {
      return (
          <div style={{ margin: '10px 0', paddingBottom: 10, width: '100%' }} className={`${stat.common_table_item}`}>
              <div className={`${stat.label_panel} ${global.flex_row_between_center}`}>
                  {sldLlineRtextAddMargin('#FA6F1E', `${sldComLanguage('流量报表')}`, 10, 0, 0)}
                  {hasAuth("flow_export") && sldIconBtnBg(() => this.handleSldExcel(), 'ziyuan23', `${sldComLanguage('导出报表')}`, '#fff', 7, 10, 15, 15, 3)}
              </div>
              <div className={`${stat.stat_common_table}`} style={{ paddingLeft: 10, marginTop: 10 }}>
                  <StatisticsReportFlowByDay updateExportParam={(e) => this.updateExportParam(e, 'day')} onRef={this.onRefDay} />
              </div>
          </div>
      );
  }
}
