//商品动销报表模块
import { connect } from 'dva/index';
import React, { Component } from 'react';
import { Form, Tabs } from 'antd';
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
import StatisticsReportGoodsSalingByDay from './goods_saling_by_day';
import StatisticsReportGoodsSalingByGoods from './goods_saling_by_goods';

const TabPane = Tabs.TabPane;
@connect(({ statistics }) => ({
    statistics
}))
@Form.create()

export default class StatisticsReportGoodsSaling extends Component {
    constructor(props) {
        super(props);
        this.state = {
            export_params: {
                day: statDateSearchParams(),
                goods:statDateSearchParams()
            },//导出的筛选条件
            active_key: 'day'//当前tab
        };
    }

    componentDidMount() {
    }

  onRefDay = (ref) => {
      this.childDay = ref;
  }

  onRefGoods = (ref) => {
      this.childGoods = ref;
  }

  handleSldExcel = () => {
      const { export_params, active_key } = this.state;
      let dataList = {}
      if(active_key == 'day'){
          dataList = this.childDay.state.data
      }else{
          dataList = this.childGoods.state.data
      }
      if(dataList.list != undefined && dataList.list.length == 0){
          failTip('没有可导出的数据!');
          return 
      }
      let paramData = {
          ...export_params[active_key]
      };
      paramData.fileName = `${sldComLanguage('商品报表导出')}`;
      const { dispatch } = this.props;
      this.setState({ initLoading: true });
      let dis_type = 'statistics/export_goods_saling_report_by_day';
      if (active_key == 'goods') {
          dis_type = 'statistics/export_goods_saling_report_by_goods';
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

  render() {
      return (
          <div style={{ margin: '10px 0', paddingBottom: 10, width: '100%' }} className={`${stat.common_table_item}`}>
              <div className={`${stat.label_panel} ${global.flex_row_between_center}`}>
                  {sldLlineRtextAddMargin('#FA6F1E', `${sldComLanguage('商品报表')}`, 10, 0, 0)}
                  {hasAuth("goods_export") && sldIconBtnBg(() => this.handleSldExcel(), 'ziyuan23', `${sldComLanguage('导出报表')}`, '#fff', 7, 10, 15, 15, 3)}
              </div>
              <div className={`${stat.stat_common_table}`} style={{ paddingLeft: 10, marginTop: 10 }}>
                  <Tabs type="card" defaultActiveKey="day" animated={false} onTabClick={this.onHandleTabClick}>
                      <TabPane tab={`${sldComLanguage('按天')}`} key="day">
                          <StatisticsReportGoodsSalingByDay updateExportParam={(e) => this.updateExportParam(e, 'day')} onRef={this.onRefDay} />
                      </TabPane>
                      <TabPane tab={`${sldComLanguage('按商品')}`} key="goods">
                          <StatisticsReportGoodsSalingByGoods updateExportParam={(e) => this.updateExportParam(e, 'goods')} onRef={this.onRefGoods} />
                      </TabPane>
                  </Tabs>
              </div>
          </div>
      );
  }
}
