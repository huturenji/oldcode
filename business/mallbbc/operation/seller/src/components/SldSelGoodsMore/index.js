import { connect } from 'dva/index';
import React, { Component, Fragment } from 'react';
import {
	 Form, Spin, Modal
} from 'antd';
import {
    failTip,
    sldPopConfirm,
    list_com_page_size_7,
    getTableNum,
    getSldEmptyH,
    sldtbaleOpeBtn,
    sldHandlePaginationData,
    dragSldTableColumn
} from '@/utils/utils';
import global from '@/global.less';
import StandardTable from '@/components/StandardTable';
import Search from '@/components/Search/Search';

let pageSize = list_com_page_size_7;
@connect(({ pc_home,project }) => ({
    pc_home,
    project
}))
@Form.create()
export default class SldSelGoodsMore extends Component {
	init_flag = true;
	
	constructor(props) {
	    super(props);
	    this.state = {
	        selectedRows: [],
	        selectedRowKeys: [],//selectedRows的key
	        modalVisible: false,
	        loading: false,
	        data: {},
	        title: '',
	        params: { pageSize: pageSize },//搜索条件
	        search_data: [{
	            type: 'input',
	            label: `商品名称`,
	            name: 'goodsName',
	            placeholder: `请输入商品名称`
	        }
	        ],
	        sel_columns: [
	            {
	                title: ' ',
	                dataIndex: 'goodsId',
	                align: 'center',
	                width: 55,
	                render: (text, record, index) => getTableNum({}, pageSize, index)
	            },
	            {
	                title: `商品图片`,
	                dataIndex: 'mainImgUrl',
	                align: 'center',
	                width: 70,
	                render: (text) => (
	                    <div className={global.goods_modal_img}><img src={text} /></div>
	                )
	            },
	            {
	                title: `商品名称`,
	                dataIndex: 'goodsName',
	                align: 'center',
	                width: 200
	            },
	            {
	                title: `价格(元)`,//价格
	                dataIndex: 'goodsPrice',
	                align: 'center',
	                width: 100
	            },
	            {
	                title: `操作`,//操作
	                align: 'center',
	                width: 60,
	                render: (text, record) => sldPopConfirm('leftBottom', `删除后不可恢复，是否确定删除`, () => this.delSelGoods(record.id), `确定`, `取消`, sldtbaleOpeBtn('删除', 'shanchu2', null), 0, 0, '#1890ff')

	            }
	        ],
	        columns: [
	            {
	                title: ' ',
	                dataIndex: 'goodsId',
	                align: 'center',
	                width: 55,
	                render: (text, record, index) => getTableNum(this.state.params, pageSize, index)
	            },
	            {
	                title: `商品图片`,
	                dataIndex: 'mainImgUrl',
	                align: 'center',
	                width: 70,
	                render: (text) => (
	                    <div className={global.goods_modal_img}><img src={text} /></div>
	                )
	            },
	            {
	                title: `商品名称`,
	                dataIndex: 'goodsName',
	                align: 'center',
	                width: 200
	            }, {
	                title: `库存`,
	                dataIndex: 'goodsStock',
	                align: 'center',
	                width: 100
	            },
	            {
	                title: `价格(元)`,
	                dataIndex: 'goodsPrice',
	                align: 'center',
	                width: 100
	            },
	            {
	                title: `商品状态`,
	                dataIndex: 'stateValue',
	                align: 'center',
	                width: 100
	            }, {
	                title: `发布时间`,
	                align: 'center',
	                dataIndex: 'createTime',
	                width: 150
	            }
	        ],
	        formValues: {}//搜索条件
	    };
	}

	componentDidMount() {

	}

	componentWillReceiveProps(nextProps) {
	    this.get_list({ pageSize: pageSize });
	    this.setState({
	        selectedRows: [...nextProps.selectedRows],
	        selectedRowKeys: [...nextProps.selectedRowKeys]
	    });
	}

	componentWillUnmount() {

	}

	//获取数据列表
	get_list = (params) => {
	    this.setState({ loading: true });
	    const { dispatch } = this.props;
	    let dis_type = '';
	    let new_params = { ...params };
	    dis_type = 'project/get_goods_spu_lists';
	    new_params.state = 2;
	    dispatch({
	        type: dis_type,
	        payload: new_params,
	        callback: (res) => {
	            this.setState({ loading: false });
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


	handleSelectRows = (rows, rowkeys) => {
	    //针对翻页无法保存选择的行数据处理
	    let { selectedRows, selectedRowKeys } = this.state;
	    let pre_sele_rows_keyarray = [];
	    for(let i=0;i<selectedRows.length;i++){
	        pre_sele_rows_keyarray.push(selectedRows[i].goodsId);
	    }
	    //去掉的话要删掉行数据
	    for(let i=0;i<selectedRowKeys.length;i++){
	        if (rowkeys.indexOf(selectedRowKeys[i]) == -1) {
	            selectedRows = selectedRows.filter(item => item.goodsId != selectedRowKeys[i]);
	        }
	    }
	    //没有的话追加行数据
	    for(let i=0;i<rowkeys.length;i++){
	        if (pre_sele_rows_keyarray.indexOf(rowkeys[i]) == -1) {
	            let cur_row = rows.filter(item => item.goodsId == rowkeys[i])[0];
	            selectedRows.push(cur_row);
	        }
	    }
	    this.setState({
	        selectedRows: selectedRows,
	        selectedRowKeys: rowkeys
	    });
	};

	//删除选中的商品
	delSelGoods = (id) => {
	    let { selectedRows, selectedRowKeys } = this.state;
	    selectedRows = selectedRows.filter(item => item.id != id);
	    selectedRowKeys = selectedRowKeys.filter(item => item != id);
	    this.setState({
	        selectedRows: selectedRows,
	        selectedRowKeys: selectedRowKeys
	    });
	}


	//表格列拖动
	resizeTable = (index, size, type, data) => {
	    let datas = dragSldTableColumn(index, size, data);
	    this.setState({ [type]: datas });
	};

	handleTablePagination = (pagination, filtersArg, sorter, type = 'main') => {
	    if (type == 'main') {
	        const { formValues } = this.state;
	        const params = sldHandlePaginationData(pagination, filtersArg, sorter, formValues);
	        pageSize = params.pageSize;
	        this.setState({
	            params: params
	        });
	        this.get_list(params);
	    }
	};


	//搜索事件
	search = (data) => {
	    this.setState({
	        formValues: data,
	        params: { pageSize: pageSize }
	    });
	    this.get_list({ pageSize: pageSize, ...data });
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

	//取消事件
	sldCancle = () => {
	    this.setState({
	        selectedRows: [],
	        selectedRowKeys: [],//selectedRows的key
	        params:{pageSize:pageSize}
	    });
	    this.props.sldHandleAddSkuModalCancle();
	};

	sldConfirm = () => {
	    let { selectedRows, selectedRowKeys } = this.state;
	    if (selectedRowKeys.length > 0) {
	        if (this.props.extra.min_num != undefined && this.props.extra.min_num > 0 && selectedRowKeys.length < this.props.extra.min_num) {
	            failTip(`该模块至少需要选择${this.props.extra.min_num}个商品`);
	            return false;
	        }
	        if (this.props.extra.total_num > 0 && selectedRowKeys.length != this.props.extra.total_num) {
	            failTip(`该模块需要选择${this.props.extra.total_num}个商品`);
	            return false;
	        }
	        let tmp_rows = [];
	        for(let i=0;i<selectedRows.length;i++){
	            tmp_rows.push({
	                goodsId: selectedRows[i].goodsId,
	                goodsName: selectedRows[i].goodsName,
	                goodsPrice: selectedRows[i].goodsPrice,
	                goodsStock: selectedRows[i].goodsStock,
	                mainImgUrl: selectedRows[i].mainImgUrl,
	                stateValue: selectedRows[i].stateValue
	            });
	        }
	        this.props.seleSku(tmp_rows, selectedRowKeys);
	        this.props.sldHandleAddSkuModalCancle();
	    } else {
	        failTip(`请选择商品`);
	    }
	    this.setState({params:{pageSize:pageSize}})
	};

	//关闭modal之后重置数据
	closeReset = () => {
	    this.init_flag = true;
	};

	render() {
	    const { modalAddSkuIsShow, width, modaltitle } = this.props;
	    const { selectedRows, search_data, data, loading, selectedRowKeys,sel_columns,columns } = this.state;
	    return (
	        <Modal
	            destroyOnClose
				   onOk={this.sldConfirm}
				   afterClose={this.closeReset}
				   onCancel={this.sldCancle}
	            visible={modalAddSkuIsShow}
	            width={width}
	            title={modaltitle}
	        >
	            <div style={{ display: 'flex', flexDirection: 'row' }}>
	                <div className={global.common_page} style={{ flex: 1 }}>
	                    {/*标准表格-start*/}
	                    {selectedRows.length>0&&
							<Fragment>
							    <StandardTable
							        totalHeight={200}
							        selectedRows={[]}
							        selectedRowKeys={[]}
							        data={{list:selectedRows}}
							        rowKey="goodsId"
							        isCheck={false}
							        columns={sel_columns}
							        onSldHandleSeleRow={null}
							        onSelectRow={null}
							        onChange={null}
							        sldpagination={false}
							    />
							    {getSldEmptyH(10)}
							</Fragment>
	                    }
	                    {/*标准表格-end*/}

	                    <div className={global.tableListForm}>
	                        <div style={{ position: 'relative' }}>
	                            <Search
	                                search_data={search_data}
	                                top={0}
	                                seaSubmit={(data1) => this.search(data1)}
	                                seaReset={() => this.seaReset()}
	                            />
	                        </div>
	                    </div>
	                    <Spin spinning={loading}>
	                        {/*标准表格-start*/}
	                        <StandardTable
	                            selectedRows={selectedRows}
	                            selectedRowKeys={selectedRowKeys}
	                            data={data}
	                            rowKey="goodsId"
	                            isCheck
	                            columns={columns}
	                            onSelectRow={this.handleSelectRows}
	                            flag_show_sele_data
	                            onChange={(pagination, filtersArg, sorter) => this.handleTablePagination(pagination, filtersArg, sorter, 'main')}
	                            resizeTable={(index, size) => this.resizeTable(index, size, 'columns', columns)}
	                            isColumnResize
	                        />
	                        {/*标准表格-end*/}
	                    </Spin>
	                </div>
	            </div>

	        </Modal>
	    );
	}
}
