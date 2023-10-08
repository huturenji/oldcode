import { connect } from 'dva/index';
import React, { Component } from 'react';
import { Form, Spin, Empty, Pagination,Button } from 'antd';
import { Scrollbars } from 'react-custom-scrollbars';
import {
    dragSldTableColumn,
    list_com_page_size_10,
    list_com_page_num_1,
    sldLlineRtextAddGoods,
    getAuthBtn
} from '@/utils/utils';
import global from '@/global.less';
import order from './css/index.less';
import Search from '@/components/Search/Search';
import AuthBtn from '@/components/AuthBtn';


let btnAuth = getAuthBtn();
let pageSize = list_com_page_size_10;
let pageNum = list_com_page_num_1;
let sthis = '';
// eslint-disable-next-line no-shadow
@connect(({ order }) => ({
    order
}))
@Form.create()
export default class Order_lists extends Component {
    constructor(props) {
        super(props);
        sthis = this;
        this.state = {
            viewAuth:"view_channel_config",            
            search_height:0,
            loading: false,
            data: {},
            selectedRows: [],
            selectedRowKeys: [],//selectedRows的key
            title: '',
            params: { pageSize: pageSize,pageNum:pageNum },//搜索条件
            curData: {},//编辑的数据
            search_data: [{
                type: 'input',
                label: `${('渠道名称')}`,//渠道名称
                name: 'searchKeys',
                placeholder: `${('请输入渠道名称')}`//请输入会员名称
            }],
            formValues: {},//搜索条件
            operateData: [], //弹框操作数据
            modalVisible: false,
            modalTitle: '',
            submiting: false,
            show_foot: true,
            modal_width: 700,
            modalItem: {},
            demodalVisible: false,
            expressList: [],
            deliverType: '',
            resList: [] // 取消原因数据
        };
    }

    componentDidMount() {
        this.get_list({ pageSize: pageSize,pageNum:pageNum });
        this.resize();
        window.addEventListener('resize', this.resize, { passive: true });
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.resize);
    }

  resize = () =>{
      const {search_height} = this.state;
      if(this.refs.search_part!=undefined){
          if(this.refs.search_part.clientHeight != search_height){
              this.setState({search_height:this.refs.search_part.clientHeight})
          }
      }
  }

  //获取数据列表
  get_list = (params) => {
      this.setState({ loading: true });
      const { dispatch } = this.props;
      dispatch({
          type: 'maintaince_channel/maintenance_list',
          payload: { ...params },
          callback: (res) => {
              this.setState({ loading: false });
              if (res.state == 200) {
                  if (params.pageNum > 1 && res.data.channelInfos.length == 0 && this.state.params.pageNum > 1) {
                      params.pageNum = params.pageNum - 1;
                      this.get_list(params);
                  } else {
                      this.setState({
                          data: res.data
                      });
                  }
              }
          }
      });
  };

  handleSelectRows = (rows, rowkeys) => {
      this.setState({
          selectedRows: rows,
          selectedRowKeys: rowkeys
      });
  };

  //搜索事件
  search = (data) => {
      let { params } = this.state;
      const values = { ...data };
      for(let i in values){
          if(values[i] == ''){
              delete values[i]
          }
      }
      this.setState({
          formValues: values
      });
      this.get_list({ ...params, ...values });
  };

  //搜索重置事件
  seaReset = () => {
      //搜索条件置为空
      this.setState({
          formValues: {},
          data:{},
          params: { pageSize: pageSize,pageNum:pageNum }
      });
      this.get_list({ pageSize: pageSize,pageNum:pageNum });
  };

  //表格拖动
  resizeTable = (index, size, type, data) => {
      let datas = dragSldTableColumn(index, size, data);
      this.setState({ [type]: datas });
  };

  //改变每页的数量
  // eslint-disable-next-line no-shadow
  onShowSizeChange = (pageNum, pageSizeNew) => {
      let { params,formValues } = this.state;
      params.pageSize = pageSizeNew;
      pageSize = params.pageSize;
      let curParams = { ...params, ...formValues }
      this.setState({ params },()=>{
          this.get_list(curParams);
      });
  };

  //改变页码
  // eslint-disable-next-line no-shadow
  onPageChange = (page, pageSize) => {
      const { formValues } = this.state;
      let curParams = { pageSize: pageSize, pageNum: page, ...formValues }
      this.setState({ params: curParams});
      this.get_list(curParams);
  };

  //跳钻到新增、编辑、详情页面
  toAdd(item){
      let urlObj = {
          pathname:'/mtc_channel/list_to_add'
      }  
      let query = {};
      if(!!item){
          query['id'] = item.channelId;
          urlObj['query'] = query;
      }
      this.props.history.push(urlObj)
  }

  render() {
      const { search_data, data, loading, params,search_height, viewAuth } = this.state;
      return (
          <div
              className={`${global.common_page}`}
              style={{ flex: 1, flexDirection: 'column', overflow: 'hidden' }}
          >
              <div className={global.flex_com_space_between} style={{ marginBottom: 10 }}>
                  {sldLlineRtextAddGoods('#FA6F1E', `${('运维管理 / 渠道配置')}`)}
                  <AuthBtn eventKey={["add_channel_config"]} btnAuth={btnAuth}>
                      <AuthBtn eventKey={[viewAuth]} btnAuth={btnAuth}>
                          <Button type="primary" onClick={() => this.toAdd()}>新建渠道</Button>
                      </AuthBtn>
                  </AuthBtn>                  
              </div>
              <AuthBtn eventKey={[viewAuth]} btnAuth={btnAuth} showPage>
                  <div style={{ position: 'relative' }}>
                      <div className={global.tableListForm} ref="search_part">
                          <Search
                              search_data={search_data}
                              seaSubmit={(datas) => this.search(datas)}
                              seaReset={() => this.seaReset()}
                          />
                      </div>
                      <Spin spinning={loading}>
                          {/*标准表格-start*/}
                          <div className={order.order_list}>
                              <ul className={`${order.header} ${order.nopadding}`}>
                                  <li className={`${order.width_30} ${order.center}`}>渠道ID</li>
                                  <li className={`${order.width_30} ${order.center}`}>渠道名称</li>
                                  <li className={`${order.width_30} ${order.center}`}>操作</li>
                              </ul>
                              <div className={order.order_content}>
                                  {data.channelInfos != undefined && data.channelInfos.length == 0 &&
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                                  }
                                  <Scrollbars
                                      autoHeight
                                      autoHeightMax={document.body.clientHeight - 272-search_height}
                                  >
                                      {data.channelInfos != undefined && data.channelInfos.length > 0 && data.channelInfos.map((item, index) => <div className={order.item} key={index}>
                                          <div className={`${order.order_goods_part} ${global.flex_row_start_center}`}>
                                              <div
                                                  className={`${order.order_state} ${order.width_30} ${order.center}`}
                                              >{item.channelId}</div>
                                              <div
                                                  className={`${order.order_state} ${order.width_30} ${order.center}`}
                                              >{item.channelName}</div>
                                              <div className={`${order.operate} ${order.width_30} ${order.center} ${global.flex_row_center_center}`}>
                                                  <div className={`${order.operate_btn} ${order.cursorP}`} onClick={()=>{sthis.toAdd(item)}}>
                                                  查看详情
                                                  </div>
                                              </div>
                                          </div>
                                      </div>)
                                      }
                                  </Scrollbars>
                              </div>
                              <div className={order.pagination}>
                                  {data.channelInfos != undefined && data.channelInfos.length > 0 &&
                <Pagination
                    size="small"
                    showSizeChanger
                    showQuickJumper
                    current={data.pageNum}
                    pageSize={params.pageSize}
                    onShowSizeChange={this.onShowSizeChange}
                    onChange={this.onPageChange}
                    defaultCurrent={data.pageNum}
                    total={data.total}
                />
                                  }
                              </div>
                          </div>
                          {/*标准表格-end*/}
                      </Spin>
                  </div>
              </AuthBtn>
          </div>
      );
  }
}
