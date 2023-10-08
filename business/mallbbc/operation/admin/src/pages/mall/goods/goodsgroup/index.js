import { connect } from 'dva/index';
import React, { Component, Fragment } from 'react';
import { Form, Spin } from 'antd';
import router from 'umi/router';
import {
    list_com_page_size_10,
    dragSldTableColumn,
    sldHandlePaginationData,
    sldLlineRtextAddGoodsAddMargin,
    getTableNum,
    sldComLanguage,
    sldtbaleOpeBtnText,
    sldPopConfirmDiy,
    failTip,
    sldIconBtn,
    sldIconBtnNo,
    getAuthBtn
} from '@/utils/utils';
import global from '@/global.less';

import Search from '@/components/Search/Search';
import StandardTable from '@/components/StandardTable';
import AuthBtn from '@/components/AuthBtn';


let btnAuth = getAuthBtn();
let pageSize = list_com_page_size_10;
@connect(({ goodsgroup }) => ({
    goodsgroup
}))
@Form.create()
export default class GoodsLabel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            initLoading: false,
            data: {},//列表数据
            selectedRows: [],
            selectedRowKeys: [],//selectedRows的key
            params: { pageSize: pageSize },//搜索条件
            formValues: {},//搜索条件
            search_data: [{
                type: 'input',
                label: `${sldComLanguage('商品池名称')}`,
                name: 'productPoolName',
                placeholder: `${sldComLanguage('请输入商品池名称')}`
            },{
                type: 'input',
                label: `${sldComLanguage('商品池ID')}`,
                name: 'productPoolId',
                placeholder: `${sldComLanguage('请输入商品池ID')}`
            }
            ],
            columns: [
                {
                    title: '序号',
                    dataIndex: '',
                    align: 'center',
                    width: 55,
                    render: (text, record, index) => getTableNum(this.state.params, pageSize, index)
                },
                {
                    title: `${sldComLanguage('商品池名称')}`,
                    dataIndex: 'productPoolName',
                    align: 'center',
                    width: 100
                },
                {
                    title: `${sldComLanguage('商品池ID')}`,
                    dataIndex: 'productPoolId',
                    align: 'center',
                    width: 150
                },
                {
                    title: `${sldComLanguage('操作')}`,
                    align: 'center',
                    width: 100,
                    render: (text, record) => (
                        <Fragment>
                            {sldtbaleOpeBtnText(`${sldComLanguage('详情')}`, () => this.edit(record.productPoolId,'view'))}
                            <span className={global.splitLine} />
                            <AuthBtn eventKey={["edit_goods_group"]} btnAuth={btnAuth}> 
                                {sldtbaleOpeBtnText(`${sldComLanguage('编辑')}`, () => this.edit(record.productPoolId,'edit'))}
                                <span className={global.splitLine} />
                            </AuthBtn>
                            <AuthBtn eventKey={["delete_goods_group"]} btnAuth={btnAuth}> 
                                {sldPopConfirmDiy('leftBottom', `${sldComLanguage('删除后不可恢复，是否确定删除')}`, () => this.delete(record.productPoolId), `${sldComLanguage('确定')}`, `${sldComLanguage('取消')}`,
                                    sldtbaleOpeBtnText(`${sldComLanguage('删除')}`, () => null))}
                            </AuthBtn>
                        </Fragment>
                    )
                }
            ],
            showAdd:false
        };
    }

    componentDidMount() {
	    this.get_list({ pageSize: pageSize });
    }


	//获取数据列表
	get_list = (params) => {
	    this.setState({ initLoading: true });
	    const { dispatch } = this.props;
	    params.pageIndex = params.current||1;
	    dispatch({
	        type: 'goodsgroup/getPage',
	        payload: params,
	        callback: (res) => {
	            this.setState({ initLoading: false });
	            if (res.state == 200) {
	                if (res.data.list.length == 0 && this.state.params.current > 1) {
	                    params.current = params.current - 1;
	                    this.get_list(params);
	                } else {
	                    const {total} = res.data.pagination
	                    this.setState({
	                        data: res.data,
	                        showAdd:total>=10?false:true
	                    });
	                }
	            }else{
	                failTip(res.msg)
	                this.setState({
	                    showAdd:false
	                });
	            }
	        }
	    });
	};

	edit = (productPoolId,type) => {
	    router.push(`/manage_product/goods_group_add?productPoolId=${productPoolId}&type=${type}`);
	};

	delete = (productPoolId) => {
	    const { dispatch } = this.props;
	    const { params } = this.state;
	    dispatch({
	        type: 'goodsgroup/delete_productpool',
	        payload:{productPoolId} ,
	        callback: (res) => {
	            if (res.state == 200) {
	                this.get_list(params);
	            }else{
	                failTip(res.msg)
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
	        this.setState({ params });
	        this.get_list(params);
	    }
	};

	//表格拖动
	resizeTable = (index, size, type, data) => {
	    let datas = dragSldTableColumn(index, size, data);
	    this.setState({ [type]: datas });
	};


	//搜索
	search = (data) => {
	    const values = { ...data };
	    for (let i in values) {
	        if (values[i] == '') {
	            delete values[i];
	        }
	    }
	    this.setState({
	        formValues: values,
	        params: { pageSize: pageSize }
	    });
	    this.get_list({ pageSize: pageSize,...values });
	};

	//搜索重置事件
	seaReset = () => {
	    //搜索条件置为空
	    this.setState({
	        formValues: {},
	        params: { pageSize: pageSize }
	    });
	    this.get_list({ pageSize: pageSize });
	};

	toAdd = ()=>{
	    router.push('/manage_product/goods_group_add?type=add');
	}

	render() {
	    const { selectedRows, columns, initLoading, data,search_data,showAdd } = this.state;
	    return (
	        <div className={global.common_page} style={{ flex: 1 }}>
	            {sldLlineRtextAddGoodsAddMargin('#FA6F1E', `${sldComLanguage('自定义商品池')}`, 0, 0, 10)}
	            <AuthBtn eventKey={["view_goods_group"]} btnAuth={btnAuth} showPage>

	            <div className={global.tableListForm}>
	                <Search
	                    search_data={search_data}
	                    seaSubmit={(datas) => this.search(datas)}
	                    seaReset={() => this.seaReset()}
	                />
	            </div>
	            <div className={global.operate_bg}>
	                    <AuthBtn eventKey={["add_goods_group"]} btnAuth={btnAuth}> 
	                		{sldIconBtn(() => this.toAdd(), `${sldComLanguage('新增商品池')}`, 7, 7)}
	                    </AuthBtn>
	            </div>
	            <Spin spinning={initLoading}>
	                {/*标准表格-start*/}
	                <StandardTable
	                    totalHeight={document.body.clientHeight-220}
	                    selectedRows={selectedRows}
	                    data={data}
	                    rowKey="labelId"
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
	            </AuthBtn>
	        </div>
	    );
	}
}
