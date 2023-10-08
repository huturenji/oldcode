/*
* 参与秒杀活动的商品
* */
import { connect } from 'dva/index';
import React, { Component, Fragment } from 'react';
import { Form, Spin } from 'antd';
import {
    list_com_page_size_10,
    dragSldTableColumn,
    getTableNum,
    sldComLanguage,
    dateFormat,
    sldHandlePaginationData,
    sldtbaleOpeBtnText,
    sldLlineRtextAddGoodsAddMargin,
    getSldListGoodsImg80,
    sucTip,
    failTip,
    formItemLayoutModal,
    sldIconBtnBg,
    sldPopConfirmDiy,
    setSession,
    isEmpty,
    getAuthBtn
} from '@/utils/utils';
import global from '@/global.less';
import StandardTable from '@/components/StandardTable';
import Search from '@/components/Search/Search';
import SldModal from '@/components/SldModal/SldModal';
import AuthBtn from '@/components/AuthBtn';
import DotTag from '@/components/DotTag';

let btnAuth = getAuthBtn();
let pageSize = list_com_page_size_10;
//场次状态(商品状态:0-已下架,1-上架)
let stateTxtValue = { 0: "已下架", 1:'上架' }
//场次状态(1-未开始,2-进行中,3-已结束)
let stageTxtValue = { 1: "未开始", 2: "进行中", 3: "已结束" }
//场次状态(审核状态:1待审核,2审核通过,3拒绝)
let verifyStateTxtValue = { 0: "待店铺审核", 1: "待平台审核", 2: "审核通过",3:"审核拒绝" }
@connect(({ promotion }) => ({
    promotion
}))
@Form.create()
export default class JoinedGoodsList extends Component {
    goods_spec_columns = [
        {
            title: ' ',
            dataIndex: 'sku',
            align: 'center',
            width: 30,
            render: (text, record, index) => index + 1
        },
        {
            title: `${sldComLanguage('商品规格')}`,
            dataIndex: 'specValues',
            align: 'center',
            width: 200,
            render: (text) => <div style={{width:200,wordBreak:'normal',wordWrap:'break-word'}}>{text?text:`${sldComLanguage('默认')}`}</div>
        },
        {
            title: `${sldComLanguage('销售价(元)')}`,
            dataIndex: 'salePrice',
            align: 'center',
            width: 110
        },
        {
            title: `${sldComLanguage('划线价(元)')}`,
            dataIndex: 'markingPrice',
            align: 'center',
            width: 110
        },
        {
            title: `${sldComLanguage('商品库存')}`,
            dataIndex: 'skuStock',
            align: 'center',
            width: 100
        },
        {
            title: `${sldComLanguage('秒杀价(元)')}`,
            dataIndex: 'promotionPrice',
            align: 'center',
            width: 110
        },
        {
            title: `${sldComLanguage('秒杀库存')}`,
            dataIndex: 'promotionStock',
            align: 'center',
            width: 100
        },
        {
            title: `${sldComLanguage('限购数量')}`,
            dataIndex: 'upperLimit',
            align: 'center',
            width: 100,
            render: (text) => <div>{text?text:`${sldComLanguage('不限购')}`}</div>
        }
    ];

    constructor(props) {
        super(props);
        this.state = {
            operateData: [],
            view_spec_data: [{
                type: 'scroll_table',
                name: '',
                label: ``,
                width: 880,
                content: '',
                data: [],
                columns: this.goods_spec_columns,
                rowKey: 'sku'
            }],//查看规格
            initLoading: false,
            data: {},//列表数据
            selectedRows: [],
            selectedRowKeys: [],//selectedRows的key
            title: '',
            query: props.location.query,
            type: 'add',//'add'新增  'edit'编辑
            params: { pageSize: pageSize, pageIndex:1 },//搜索条件
            search_data: [{
                type: 'input',
                widthMode: 'fat',
                label: `${sldComLanguage('商品名称或SKU')}`,
                name: 'skuName',
                placeholder: `${sldComLanguage('请输入商品名称或SKU')}`
            }, {
                type: 'rangepicker',
                label: `${sldComLanguage('场次时间')}`,
                name: 'search_activity_time',
                placeholder1: `${sldComLanguage('开始时间')}`,
                placeholder2: `${sldComLanguage('结束时间')}`
            }, {
                type: 'select',
                mode: "multiple",
                width: 250,
                initialValue: [1, 2], 
                label: `${sldComLanguage('审核状态')}`,
                name: 'verifyStates',
                placeholder: `${sldComLanguage('请选择审核状态')}`,
                sel_data: [
                    { key: 1, name: '待平台审核' },
                    { key: 2, name: '审核通过' }
                ]
            }, {
                type: 'select',
                mode: "multiple",
                width: 250,
                initialValue: [1, 2],                
                label: `${sldComLanguage('参与状态')}`,
                name: 'states',
                placeholder: `${sldComLanguage('请选择参与状态')}`,
                sel_data: [
                    { key: 1, name: `${sldComLanguage('未开始')}` },
                    { key: 2, name: `${sldComLanguage('进行中')}` },
                    { key: 3, name: `${sldComLanguage('已结束')}` }
                ]
            }],
            formValues: {states: [1, 2],verifyStates:[1,2]},//搜索条件
            columns: [
                {
                    title: ' ',
                    dataIndex: 'sku',
                    align: 'center',
                    width: 30,
                    render: (text, record, index) => getTableNum(this.state.params, pageSize, index)
                },
                {
                    title: `${sldComLanguage('商品信息')}`,
                    dataIndex: 'mainImage',
                    align: 'center',
                    width: 250,
                    render: (text, record) => <div className={`${global.goods_info} ${global.com_flex_row_flex_start}`}>
                        <div className={global.goods_img}>{getSldListGoodsImg80(text)}</div>
                        <div className={`${global.com_flex_column_space_between} ${global.goods_detail}`}>
                            <span className={global.goods_name}>
                                {record.skuName}
                            </span>
                        </div>
                    </div>
                },
                {
                    title: `${sldComLanguage('商品sku')}`,
                    dataIndex: 'sku',
                    align: 'center',
                    width: 100
                },                
                // {
                //     title: `${sldComLanguage('参加场次')}`,
                //     dataIndex: 'stageName',
                //     align: 'center',
                //     width: 100
                // },
                {
                    title: `${sldComLanguage('场次时间')}`,
                    dataIndex: 'startTimeStr',
                    align: 'center',
                    width: 150,
                    render: function(text, record) {
                        return <div className={global.voucher_time_wrap}>
                            <p>{text}</p>
                            <p>~</p>
                            <p>{record.endTimeStr}</p>
                        </div>;
                    }
                },
                {
                    title: `${sldComLanguage('活动标签')}`,
                    dataIndex: 'labelName',
                    align: 'center',
                    width: 100
                },
                {
                    title: `${sldComLanguage('参与状态')}`,
                    dataIndex: 'stageState',
                    align: 'center',
                    width: 100,
                    render: (text) => {
                        switch(text) {
                        case 1:
                            return <DotTag type='normal'>未开始</DotTag>
                        case 2:
                            return <DotTag type='sucess'>进行中</DotTag>
                        case 3:
                            return <DotTag type='normal'>已结束</DotTag> 
                        default:
                            return ''
                        }
                    }
                },                
                {
                    title: `${sldComLanguage('商品状态')}`,
                    dataIndex: 'state',
                    align: 'center',
                    width: 100,
                    render: (text, record) => <div> {stateTxtValue[text]} </div>
                },
                {
                    title: `${sldComLanguage('审核状态')}`,
                    dataIndex: 'verifyState',
                    align: 'center',
                    width: 100,
                    render: (text) => {
                        switch(text) {
                        case 0:
                            return <DotTag type='pending'>待店铺审核</DotTag>
                        case 1:
                            return <DotTag type='pending'>待平台审核</DotTag>
                        case 2:
                            return <DotTag type='sucess'>审核通过</DotTag>
                        case 3:
                            return <DotTag type='failed'>审核拒绝</DotTag> 
                        default:
                            return ''
                        }
                    }
                },
                {
                    title: `${sldComLanguage('拒绝原因')}`,
                    dataIndex: 'remark',
                    align: 'center',
                    width: 100
                },
                {
                    title: `${sldComLanguage('操作')}`,
                    align: 'center',
                    width: 100,
                    render: (text, record) => (
                        <Fragment>
                            {sldtbaleOpeBtnText(`${sldComLanguage('查看')}`, () => this.viewSpec(record))}
                            <AuthBtn eventKey={['seckill_attend_edit']} btnAuth={btnAuth}>
                                {record.verifyState!=2&&
                            <Fragment>
                                <span className={global.splitLine} />
                                {/* {sldtbaleOpeBtnText(`${sldComLanguage('删除')}`, () => this.operate(record.sku, 'del'))} */}
                                <span className={global.splitLine} />
                                {/*删除后不可恢复，是否确定删除？*/}
                                {sldPopConfirmDiy('leftBottom', `${sldComLanguage('删除后不可恢复，是否确定删除')}`, () => this.operate([record.productId], 'del'), `${sldComLanguage('确定')}`, `${sldComLanguage('取消')}`,
                                    sldtbaleOpeBtnText(`${sldComLanguage('删除')}`, () => null))} 
                            </Fragment>
                                }
                            </AuthBtn>
                            {/* state字段 1-未进行， 2-进行中 3-已结束 */}
                            {/* {((record.state == 1 || record.state == 2) && record.verifyState == 2)&& */}
                            <AuthBtn eventKey={['seckill_attend_edit']} btnAuth={btnAuth}>
                                {record.verifyState == 2 &&
                                sldPopConfirmDiy('leftBottom', `${sldComLanguage('是否确定退出')}`, () => this.quitActivity(record), `${sldComLanguage('确定')}`, `${sldComLanguage('取消')}`,
                                    sldtbaleOpeBtnText(`${sldComLanguage('退出')}`, () => null))}
                            </AuthBtn>
                        </Fragment>
                    )
                }
            ]
        };
    }


    componentDidMount() {
        const { query } = this.state;
        if (query.id != undefined && query.id > 0) {
            //初始化取值，需要state [1, 2]
            this.get_list({ pageSize: pageSize, pageIndex:1, ...this.state.formValues });
        }
    }

  //退出活动
  quitActivity = (item) => {
      this.setState({ initLoading: true });
      const { params } = this.state;
      const { dispatch } = this.props;
      dispatch({
          type: 'promotion/quit_seckill_activit_good',
          payload: { 
              promotionIdBindProductId : item.productId
          },
          callback: (res) => {
              this.setState({ initLoading: false });
              if (res.state == 200) {   
                  failTip('退出成功')
                  this.get_list({ pageSize: pageSize,...params , pageIndex:1 });
              }else{
                  failTip(res.msg)
              }
          }
      });
  }

  //获取数据列表
  get_list = (params) => {
      this.setState({ initLoading: true });
      const { dispatch } = this.props;
      const { query } = this.state;
      dispatch({
          type: 'promotion/get_joined_seckill_goods',
          payload: { ...params,promotionId:query.id },
          callback: (res) => {
              this.setState({ initLoading: false });
              if (res.state == 200) {
                  if (res.data.list.length == 0 && this.state.params.current > 1) {
                      params.current = params.current - 1;
                      params.pageIndex = params.current
                      this.get_list(params);
                  } else {
                      res.data.list.forEach((item,index)=>{
                          item.key = index;
                      });
                      this.setState({
                          data: res.data
                      });
                  }
              }
          }
      });
  };

  // 查看规格
  viewSpec = (val) => {
      let { view_spec_data,operateData,query } = this.state;
      operateData = JSON.parse(JSON.stringify(view_spec_data));
      operateData[0].columns = this.goods_spec_columns;

      operateData[0].data = [val];
      this.setState({
          modalVisible: true,
          show_foot:false,
          title:`${sldComLanguage('查看规格')}`,
          modal_width:900,
          operateData
      });      
  };

  handleSelectRows = (rows, rowkeys) => {
      this.setState({
          selectedRows: rows,
          selectedRowKeys: rowkeys
      });
  };

  handleTablePagination = (pagination, filtersArg, sorter, type = 'main') => {
      const { formValues } = this.state;
      if (type == 'main') {
          const params = sldHandlePaginationData(pagination, filtersArg, sorter, formValues);
          pageSize = params.pageSize;
          params.pageIndex = params.current
          this.setState({ params });
          this.get_list(params);
      }
  };

  //表格拖动
  resizeTable = (index, size, type, data) => {
      let datas = dragSldTableColumn(index, size, data);
      this.setState({ [type]: datas });
  };

  //操作  type: del 删除
  operate = (id, type) => {
      const { params,query } = this.state;
      const { dispatch } = this.props;
      let param_data = {};
      let dis_type = '';
      if (type == 'del') {
          dis_type = 'promotion/del_seckill_goods';
          param_data.ids = id;
      }
      this.setState({ submiting: true });
      dispatch({
          type: dis_type,
          payload: param_data,
          callback: (res) => {
              if (res.state == 200) {
                  sucTip(res.msg);
                  this.get_list(params);
                  this.setState({
                      modalVisible: false
                  });
              } else {
                  failTip(res.msg);
              }
              this.setState({ submiting: false });
          }
      });
  };

  //搜索事件
  search = (data) => {
      const values = { ...data };
      //活动时间处理
      if (values.search_activity_time) {
          values.startTime = values.search_activity_time[0] ? `${values.search_activity_time[0].format(dateFormat) } 00:00:00` : '';
          values.endTime = values.search_activity_time[1] ? `${values.search_activity_time[1].format(dateFormat) } 23:59:59` : '';
          delete values.search_activity_time;
      }

      for (let i in values) {
          if (values[i] == '') {
              delete values[i];
          }
      }
      if(isEmpty(values.verifyStates)){
          values.verifyStates = [1,2]
      }
      this.setState({
          formValues: values,
          params: { pageSize: pageSize , pageIndex:1}
      });
      this.get_list({ pageSize: pageSize, ...values , pageIndex:1});
  };

  //搜索重置事件
  seaReset = () => {
      //搜索条件置为空
      this.setState({
          formValues: {states: [1, 2],verifyStates:[1,2]},
          params: { pageSize: pageSize, pageIndex:1 }
      });
      this.get_list({ pageSize: pageSize, pageIndex:1, states: [1, 2],verifyStates:[1,2] });
  };

  sldHandleCancle = () => {
      this.setState({ modalVisible: false });
  };

  render() {
      const { selectedRows, search_data, columns, initLoading, data,modal_width,title,submiting,modalVisible,operateData } = this.state;
      return (
          <div className={global.common_page}>
              <div className={global.flex_com_space_between}>
                  {sldLlineRtextAddGoodsAddMargin('#69A2F2', `${sldComLanguage('秒杀活动商品')}`, 0, 0, 10)}
                  {sldIconBtnBg(() => {setSession('seckill_detail_back',4); this.props.history.goBack()}, 'fanhui', `${sldComLanguage('返回上级页面')}`, '#fff', 7, 0, 15, 15, 5)}
              </div>
              <div className={global.tableListForm}>
                  <Search
                      search_data={search_data}
                      seaSubmit={(datas) => this.search(datas)}
                      seaReset={() => this.seaReset()}
                  />
              </div>
              <Spin spinning={initLoading}>
                  {/*标准表格-start*/}
                  <StandardTable
                      totalHeight={document.body.clientHeight - 160}
                      bordered={false}
                      selectedRows={selectedRows}
                      data={data}
                      rowKey="key"
                      isCheck={false}
                      columns={columns}
                      onSelectRow={this.handleSelectRows}
                      onChange={(pagination, filtersArg, sorter) => this.handleTablePagination(pagination, filtersArg, sorter, 'main')}
                      onSldHandleSeleRow={this.onSldHandleSeleRow}
                      resizeTable={(index, size) => this.resizeTable(index, size, 'columns', columns)}
                      isColumnResize
                  />
                  {/*标准表格-end*/}
              </Spin>
              { /*新增/编辑对话框-start*/}
              <SldModal
                  width={modal_width}
                  title={title}
                  submiting={submiting}
                  modalVisible={modalVisible}
                  sldHandleConfirm={null}
                  sldHandleCancle={this.sldHandleCancle}
                  formItemLayoutModal={formItemLayoutModal}
                  content={operateData}
                  show_foot={false}
              />
              { /*新增/编辑对话框-end*/}
          </div>

      );
  }
}
