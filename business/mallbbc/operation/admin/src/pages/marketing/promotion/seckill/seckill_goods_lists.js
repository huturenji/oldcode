/*
* 秒杀活动商品列表
* */
import { connect } from 'dva/index';
import React, { Component, Fragment } from 'react';
import { Form, Spin } from 'antd';
import {
    list_com_page_size_10,
    dragSldTableColumn,
    sldHandlePaginationData,
    getTableNum,
    sldComLanguage,
    sldtbaleOpeBtnText,
    sldLlineRtextAddGoods,
    sldIconBtnBg,
    getSldListGoodsImg80,
    formItemLayoutModal,
    failTip,
    getAuthBtn
} from '@/utils/utils';
import global from '@/global.less';
import StandardTable from '@/components/StandardTable';
import Search from '@/components/Search/Search';
import SldModal from '@/components/SldModal/SldModal';
import DotTag from '@/components/DotTag';
import AuthBtn from '@/components/AuthBtn';

let btnAuth = getAuthBtn();
let pageSize = list_com_page_size_10;
let verifyStateValue = { 0: "待店铺审核", 1: "待平台审核", 2: "审核通过",3:"审核拒绝" }
@connect(({ seckill }) => ({
    seckill
}))
@Form.create()
export default class SeckillGoodsLists extends Component {
    goods_spec_columns = [
        {
            title: ' ',
            dataIndex: 'productId',
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
            title: `${sldComLanguage('商品库存')}`,
            dataIndex: 'skuStock',
            align: 'center',
            width: 100
        },
        {
            title: `${sldComLanguage('划线价(元)')}`,
            dataIndex: 'markingPrice',
            align: 'center',
            width: 110
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
            query: props.location.query,
            search_con: '',
            initLoading: false,
            submiting: false,
            modalVisible: false,
            data: {},//列表数据
            selectedRows: [],
            selectedRowKeys: [],//selectedRows的key
            title: '',
            type: 'add',//'add'新增  'edit'编辑
            params: { pageSize: pageSize, pageIndex:1 },//搜索条件
            formValues: {},//搜索条件
            sendParams:{}, //排序后更新列表搜索条件
            search_data: [{
                type: 'input',
                label: `${sldComLanguage('店铺名称')}`,
                name: 'storeName',
                placeholder: `${sldComLanguage('请输入店铺名称')}`
            },{
                type: 'input',
                widthMode:'fat',
                label: `${sldComLanguage('商品名称或SKU')}`,
                name: 'skuName',
                placeholder: `${sldComLanguage('请输入商品名称或SKU')}`
            }],
            columns: [
                {
                    title: ' ',
                    dataIndex: 'sku',
                    align: 'center',
                    width: 55,
                    render: (text, record, index) => getTableNum(this.state.params, pageSize, index)
                },            
                {
                    title: `${sldComLanguage('商品图片')}`,
                    dataIndex: 'mainImage',
                    align: 'center',
                    width: 100,
                    render: (text) => getSldListGoodsImg80(text)
                },
                {
                    title: `${sldComLanguage('商品名称')}`,
                    dataIndex: 'skuName',
                    align: 'center',
                    width: 100
                },
                {
                    title: '商品SKU',
                    dataIndex: 'sku',
                    align: 'center',
                    width: 55
                },                   
                {
                    title: `${sldComLanguage('店铺名称')}`,
                    dataIndex: 'storeName',
                    align: 'center',
                    width: 100
                },
                {
                    title: `审核状态`,
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
                    title: `${sldComLanguage('活动标签')}`,
                    dataIndex: 'labelName',
                    align: 'center',
                    width: 100
                },
                {
                    title: `${sldComLanguage('操作')}`,
                    align: 'center',
                    width: 100,
                    render: (text, record,index) => {
                        this.getlistState()
                        const { data } = this.state;
                        let total = data?.pagination?.total || index
                        return (
                            <Fragment>
                                <AuthBtn eventKey={["sort_seckill_goods"]} btnAuth={btnAuth}>
                                    { this.state.listItemstate==3||getTableNum(this.state.params, pageSize, index)==1?
                                        null:
                                        <span style={{cursor:'pointer', marginRight:'4px',color:'red'}} onClick={()=>this.changeSort(1,record)}>置顶</span>
                                    }
                                    { this.state.listItemstate==3||getTableNum(this.state.params, pageSize, index)==1?
                                        null:
                                        <span style={{cursor:'pointer', marginRight:'4px',color:'green'}} onClick={()=>this.changeSort(2,record)}>上移</span>
                                    }
                                    { this.state.listItemstate==3||getTableNum(this.state.params, pageSize, index)==total?
                                        null:
                                        <span style={{cursor:'pointer', marginRight:'8px',color:'blue'}} onClick={()=>this.changeSort(3,record)}>下移</span>
                                    }
                                </AuthBtn>
                                
                                <AuthBtn eventKey={["view_seckill"]} btnAuth={btnAuth}>
                                    {sldtbaleOpeBtnText(`${sldComLanguage('查看SKU')}`, () => this.viewSpec(record))}{/*查看sku*/}
                                </AuthBtn>
                                
                            </Fragment>
                        )
                    }
                }
            ],
            operateData:[],//查看规格数据
            view_spec_data: [{
                type: 'scroll_table',
                name: '',
                label: ``,
                width: 880,
                content: '',
                data: [],
                columns: this.goods_spec_columns,
                rowKey: 'id'
            }],//查看规格
            listItemstate:''//列表数据状态
        };
    }
   
    componentDidMount() {
        this.get_list({ pageSize: pageSize, pageIndex:1 });
    }

    // 获取列表数据状态===state=3/2/1
    getlistState=()=>{
        let listItemstate = this.state.data.list.map((item)=>item.state).filter((item, index,self)=>self.indexOf(item)===index).toString()
        this.state.listItemstate=listItemstate
        return listItemstate
    }

  // 查看规格
  viewSpec = (val) => {
      const { dispatch } = this.props;
      let {operateData,view_spec_data,query} = this.state;
      //   dispatch({
      //       type: 'seckill/get_seckill_goods_sku_lists',
      //       payload: {pageSize:list_com_page_more,sku:val.sku,stageId:query.id,stageSkuId:val.stageSkuId},
      //       callback: (res) => {
      //           if (res.state == 200) {
      //               operateData = JSON.parse(JSON.stringify(view_spec_data));
      //               operateData[0].columns = this.goods_spec_columns;
      //               operateData[0].data = res.data.list;
      //               this.setState({
      //                   modalVisible: true,
      //                   operateData
      //               });
      //           }else{
      //               failTip(res.msg);
      //               return false;
      //           }
      //       }
      //   });

      operateData = JSON.parse(JSON.stringify(view_spec_data));
      operateData[0].columns = this.goods_spec_columns;
      operateData[0].data = [val];
      this.setState({
          modalVisible: true,
          operateData
      });

  };

	//获取数据列表
	get_list = (params) => {
	    this.setState({ initLoading: true });
	    const { dispatch } = this.props;
	    const {query} = this.state;
	    let sendParams = {...params,stageId:query.id}
	    this.setState({
	        sendParams: sendParams
	    });
	    dispatch({
	        type: 'seckill/get_seckill_goods_lists',
	        payload: sendParams,
	        callback: (res) => {
	            this.setState({ initLoading: false });
	            if (res.state == 200) {
	                if (res.data.list.length == 0 && this.state.params.current > 1) {
	                    params.current = params.current - 1;
	                    params.pageIndex = params.current 
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


	sldHandleCancle = () => {
	    this.setState({ modalVisible: false });
	};

  //搜索事件
  search = (data) => {
      const values = { ...data };
      for(let i in values){
          if(values[i] == ''){
              delete values[i]
          }
      }
      this.setState({
          formValues: values,
          params: { pageSize: pageSize, pageIndex:1 }
      });
      this.get_list({ pageSize: pageSize, ...values, pageIndex:1 });
  };

  //搜索重置事件
  seaReset = () => {
      //搜索条件置为空
      this.setState({
          formValues: {},
          params: { pageSize: pageSize, pageIndex:1 }
      });
      this.get_list({ pageSize: pageSize, pageIndex:1 });
  };

  //排序处理
  changeSort = (sortType,record)=>{
      const { dispatch } = this.props;
      const { sendParams } = this.state;
      dispatch({
          type: 'seckill/refreshSort',
          payload: {sortType,promotionIdBindProductId :record.productId },
          callback: (res) => {
              if (res.state == 200) {
                  this.get_list(sendParams);
              }else{
                  failTip(res.msg)
              }
          }
      });

  }

  render() {
      const { selectedRows, columns, initLoading, data,search_data ,modalVisible,operateData} = this.state;
      return (
          <div className={global.common_page} style={{ flex: 1 }}>
              <div className={global.flex_com_space_between}>
                  {sldLlineRtextAddGoods('#FA6F1E', `${sldComLanguage('活动商品')}`)}
                  {sldIconBtnBg(() => this.props.history.goBack(), 'fanhui', `${sldComLanguage('返回上级页面')}`, '#fff', 7, 0, 15, 15, 5)}
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
                      selectedRows={selectedRows}
                      data={data}
                      rowKey="id"
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
                  width={900}
                  title={`${sldComLanguage('查看商品SKU')}`}
                  submiting={false}
                  modalVisible={modalVisible}
                  sldHandleConfirm={(val) => this.sldHandleConfirm(val)}
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
