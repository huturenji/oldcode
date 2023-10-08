import { connect } from 'dva/index';
import React, { Component, Fragment } from 'react';
import { Form, Spin } from 'antd';
import Link from 'umi/link';
import { Scrollbars } from 'react-custom-scrollbars';
import {
    list_com_page_size_10,
    dragSldTableColumn,
    sldHandlePaginationData,
    getTableNum,
    sldComLanguage,
    sldtbaleOpeBtnText
} from '@/utils/utils';
import global from '@/global.less';
import StandardTable from '@/components/StandardTable';
import Search from '@/components/Search/Search';
import ReviewLog from '@/components/ReviewLog';
import DotTag from '@/components/DotTag';

let pageSize = list_com_page_size_10;
//场次状态(1-未开始,2-进行中,3-已结束)
let stateTxtValue = { 1: "未开始", 2: "进行中", 3: "已结束" }
@connect(({ seckill }) => ({
    seckill
}))
@Form.create()
export default class SeckillDetailLists extends Component {
    constructor(props) {
        super(props);
        this.state = {
            search_con: '',
            initLoading: false,
            submiting: false,
            data: {},//列表数据
            selectedRows: [],
            selectedRowKeys: [],//selectedRows的key
            title: '',
            type: 'add',//'add'新增  'edit'编辑
            params: { pageSize: pageSize, pageIndex:1 },//搜索条件
            formValues: {states: [1, 2]},//搜索条件
            search_data: [{
                type: 'input',
                label: `${sldComLanguage('活动场次')}`,
                name: 'stageName',
                placeholder: `${sldComLanguage('请输入活动场次')}`
            },{
                type: 'select',
                mode: "multiple",
                width: 250,
                initialValue: [1, 2],                
                label: `${sldComLanguage('场次状态')}`,
                name: 'states',
                placeholder: `${sldComLanguage('请选择场次状态')}`,
                sel_data: [
                    { key: 1, name: `${sldComLanguage('未开始')}` },
                    { key: 2, name: `${sldComLanguage('进行中')}` },
                    { key: 3, name: `${sldComLanguage('已结束')}` }
                ]
            }],
            columns: [
                {
                    title: ' ',
                    dataIndex: 'stageId',
                    align: 'center',
                    width: 55,
                    render: (text, record, index) => getTableNum(this.state.params, pageSize, index)
                },
                {
                    title: `${sldComLanguage('活动场次')}`,
                    dataIndex: 'stageName',
                    align: 'center',
                    width: 100
                },
                {
                    title: `${sldComLanguage('参加商品数量')}`,
                    dataIndex: 'productCount',
                    align: 'center',
                    width: 100
                },{
                    title: `${sldComLanguage('场次状态')}`,
                    dataIndex: 'state',
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
                    title: `${sldComLanguage('操作')}`,
                    align: 'center',
                    width: 100,
                    render: (text, record) => (
                        <Fragment>
                            <Link to={{
                                pathname: '/marketing_promotion/seckill_goods_list',
                                query: {
                                    id: record.stageId
                                }
                            }}
                            >
                                {sldtbaleOpeBtnText(`${sldComLanguage('查看商品')}`,() => null)}
                            </Link>
                        </Fragment>
                    )
                }
            ]
        };
    }

    componentDidMount() {
        //初始化取值，需要state [1, 2]
        this.get_list({ pageSize: pageSize, pageIndex:1, ...this.state.formValues });
    }

	//获取数据列表
	get_list = (params) => {
	    this.setState({ initLoading: true });
	    const { dispatch } = this.props;
	    dispatch({
	        type: 'seckill/get_detail_lists',
	        payload: {...params,promotionId:this.props.query},
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
          formValues: {states: [1, 2]},
          params: { pageSize: pageSize, pageIndex:1 }
      });
      this.get_list({ pageSize: pageSize , pageIndex:1, states: [1, 2]});
  };

  render() {
      const { selectedRows, columns, initLoading, data,search_data } = this.state;
      return (
          <div className={global.common_page} style={{ flex: 1,paddingTop:0 }}>
              <div className={global.tableListForm}>
                  <Search
                      search_data={search_data}
                      seaSubmit={(datas) => this.search(datas)}
                      seaReset={() => this.seaReset()}
                  />
              </div>
              <Scrollbars
                  autoHeight
                  autoHeightMin={100}
                  autoHeightMax={document.body.clientHeight - 200}
              >
                  <Spin spinning={initLoading}>
                      {/*标准表格-start*/}
                      <StandardTable
                          selectedRows={selectedRows}
                          data={data}
                          rowKey="stageId"
                          isCheck={false}
                          columns={columns}
                          onSelectRow={this.handleSelectRows}
                          onChange={(pagination, filtersArg, sorter) => this.handleTablePagination(pagination, filtersArg, sorter, 'main')}
                          onSldHandleSeleRow={this.onSldHandleSeleRow}
                          resizeTable={(index, size) => this.resizeTable(index, size, 'columns', columns)}
                          isColumnResize
                          showScrollbar={false}
                      />
                      {/*标准表格-end*/}

                  </Spin>
                  <ReviewLog type='project/listRecord' params={{businessId:this.props.query}} />
              </Scrollbars>
          </div>

      );
  }
}
