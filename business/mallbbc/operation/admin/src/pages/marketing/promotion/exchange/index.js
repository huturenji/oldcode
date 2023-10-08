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
    failTip,
    sldIconBtn,
    getAuthBtn
} from '@/utils/utils';
import global from '@/global.less';

import Search from '@/components/Search/Search';
import StandardTable from '@/components/StandardTable';
import AuthBtn from '@/components/AuthBtn';
import DotTag from '@/components/DotTag';

let btnAuth = getAuthBtn();
let pageSize = list_com_page_size_10;
let stateValue = {'1':'生效中', '4':'已失效', '5':'待审核','6':'审核拒绝'}
@connect(({ exchange }) => ({
    exchange
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
                label: `${sldComLanguage('兑换券名称')}`,
                name: 'voucherName',
                placeholder: `${sldComLanguage('请输入兑换券名称')}`
            },{
                type: 'input',
                label: `${sldComLanguage('兑换券订单号')}`,
                name: 'orderSn',
                placeholder: `${sldComLanguage('请输入兑换券订单号')}`,
                width:260
            },
			{
				type: 'select',
				width: 250,
				initialValue: [],                    
				label: `${sldComLanguage('兑换券状态')}`,
				name: 'state',
				placeholder: `${sldComLanguage('请输入兑换券状态')}`,
				sel_data: [
					{ key: 1, name: `${sldComLanguage('生效中')}` },
					{ key: 4, name: `${sldComLanguage('已失效')}` },
					{ key: 5, name: `${sldComLanguage('待审核')}` },
					{ key: 6, name: `${sldComLanguage('审核拒绝')}` },
				]
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
                    title: `${sldComLanguage('兑换券名称')}`,
                    dataIndex: 'voucherName',
                    align: 'center',
                    width: 100
                },
                {
                    title: `${sldComLanguage('兑换券订单号')}`,
                    dataIndex: 'orderSn',
                    align: 'center',
                    width: 150,
                    render:(text)=> text||'--'
                },
                {
                    title: `状态`,
                    dataIndex: 'state',
                    align: 'center',
                    width: 150,
                    render: (text) => {
                        switch(text) {
                        case 1:
                            return <DotTag type='sucess'>生效中</DotTag>
                        case 4:
                            return <DotTag type='normal'>已失效</DotTag>
                        case 5:
                            return <DotTag type='pending'>待审核</DotTag>
                        case 6:
                            return <DotTag type='failed'>审核拒绝</DotTag> 
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
                            <AuthBtn eventKey={['view_voucher']} btnAuth={btnAuth}>
                                {sldtbaleOpeBtnText(`${sldComLanguage('查看')}`, () => this.view(record,'view'))}
                            </AuthBtn>
                            <AuthBtn eventKey={["audit_voucher"]} btnAuth={btnAuth}>
                                {record.state==5 && sldtbaleOpeBtnText(`${sldComLanguage('审核')}`, () => this.view(record,'audit'))}
                            </AuthBtn>
                            <AuthBtn eventKey={["edit_voucher"]} btnAuth={btnAuth}>
                                {record.state==6 && sldtbaleOpeBtnText(`${sldComLanguage('编辑')}`, () => this.toAdd(record,'edit'))}
                            </AuthBtn>
                        </Fragment>
                    )
                }
            ]
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
	        type: 'exchange/get_orderVoucher_list',
	        payload: params,
	        callback: (res) => {
	            this.setState({ initLoading: false });
	            if (res.state == 200) {
	                if (res.data.list.length == 0 && this.state.params.current > 1) {
	                    params.current = params.current - 1;
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

	view = (record,type) => {
	    router.push(`/marketing_promotion/exchange_coupon_view?voucherId=${record.voucherId}&orderSn=${record.orderSn}&voucherName=${record.voucherName}&type=${type}`);
	};

	toAdd = (record,type)=>{
	    let paramString = ''
	    if(record){
	        // 编辑
	        paramString = `voucherId=${record.voucherId}&orderSn=${record.orderSn}&voucherName=${record.voucherName}&publishType=${record.publishType}&type=${type}`
	    }else{
	        // 新增
	        paramString = `type=${type}`
	    }
	    router.push(`/marketing_promotion/exchange_coupon_add?${paramString}`);
	}

	exportTxt = (voucherId) => {
	    const { dispatch } = this.props;
	    dispatch({
	        type: 'exchange/exportTxt',
	        payload: {voucherId,fileName:'凭证'},
	        callback: (res) => {
	            if(res.state!=undefined&&res.state == 89101001){
					
	            }
	        }
	    })
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

	render() {
	    const { selectedRows, columns, initLoading, data,search_data } = this.state;
	    return (
	        <AuthBtn eventKey={['view_voucher']} btnAuth={btnAuth} showPage>
	            <div className={global.common_page} style={{ flex: 1 }}>
	                {sldLlineRtextAddGoodsAddMargin('#FA6F1E', `${sldComLanguage('兑换劵')}`, 0, 0, 10)}
	                <div className={global.tableListForm}>
	                    <Search
	                        search_data={search_data}
	                        seaSubmit={(datas) => this.search(datas)}
	                        seaReset={() => this.seaReset()}
	                    />
	                </div>
	                <div className={global.operate_bg}>
	                    <AuthBtn eventKey={['add_voucher']} btnAuth={btnAuth}>
	                        {sldIconBtn(() => this.toAdd(null,'add'), `${sldComLanguage('新增兑换劵')}`, 7, 7)}
	                    </AuthBtn>
	                </div>
	                <Spin spinning={initLoading}>
	                    {/*标准表格-start*/}
	                    <StandardTable
							bordered={false}
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
	            </div>
	        </AuthBtn>
	    );
	}
}
