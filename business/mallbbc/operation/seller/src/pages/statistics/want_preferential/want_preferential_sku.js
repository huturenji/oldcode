import React, { Component } from 'react'
import { connect } from 'dva/index';
import { Spin, Tooltip } from 'antd';
import {
    dragSldTableColumn,
    list_com_page_size_10,
    sldComLanguage,
    deepCopy,
    sldHandlePaginationData,
    sldLlineRtextAddGoodsAddMargin,
    sldIconBtnBg,
    failTip,
    getAuthBtn
} from '@/utils/utils';
import global from '@/global.less';
import StandardTable from '@/components/StandardTable';
import Search from '@/components/Search/Search';
import styles from './want_preferential.less';
import AuthBtn from '@/components/AuthBtn';

let btnAuth = getAuthBtn();
let pageSizeNum = list_com_page_size_10;

@connect(({ statistics, project }) => ({
    statistics, project
}))
export default class WantPreferential extends Component {
    state = {
        search_height: 0,
        search_data: [
            {
                type: 'radio_button',
                label: `${sldComLanguage('')}`,
                name: 'lastDay',
                sel_data: [
                    { key: 3, name: `${sldComLanguage('近3天')}` },
                    { key: 7, name: `${sldComLanguage('近7天')}` },
                    { key: 15, name: `${sldComLanguage('近15天')}` },
                    { key: 30, name: `${sldComLanguage('近30天')}` }
                ]
            }
        ],// 筛选条件数组
        data: {},// 要优惠统计列表数据
        columns: [
            {
                title: `${sldComLanguage('店铺名称')}`,
                mainImage: '',
                dataIndex: 'storeName',
                align: 'left',
                width:200
            },
            {
                title: `${sldComLanguage('商品信息')}`,
                dataIndex: '',
                align: 'left',
                render: (text, record) => this.getGoodInfo(record)
            },
            {
                title: `${sldComLanguage('商品sku')}`,
                dataIndex: 'sku',
                align: 'left'
            },
            {
                title: `${sldComLanguage('要优惠用户数')}`,
                dataIndex: 'userCount',
                sorter: (a, b) => a.userCount - b.userCount,
                align: 'center',
                sortDirections: ['descend'],
                defaultSortOrder: 'descend'
            }
        ],// 表头数据
        loading: false,
        formValues: {}, // 搜索条件
        params: { pageSize: pageSizeNum }//分页搜索条件
    }

    componentDidMount() {
        const params = {sorts:[{direction:'DESC',field:'userCount'}],...this.state.params};
        this.get_list(params);
    }

    //获取数据列表
    get_list = (params) => {
        this.setState({ loading: true });
        const { dispatch } = this.props;

        dispatch({
            type: 'statistics/get_want_preferential_list',
            payload: { ...params },
            callback: (res) => {

                this.setState({ loading: false });
                if (res.state == 200) {
                    if (res.data.length == 0 && this.state.params.currentPage > 1) {
                        params.currentPage = params.currentPage - 1;
                        this.get_list(params);
                    } else {
                        const { list,pageCount, pageIndex, pageSize, total} = res.data
                        const data = {
                            list,
                            pagination:{
                                current:pageIndex,
                                pageCount,
                                pageIndex,
                                pageSize,
                                total
                            }
                        }
                        this.setState({
                            data: data
                        });
                    }
                }
            }
        });
    };


    // 获得商品信息
    getGoodInfo(goodInfo) {

        return <div className={styles.good_info_wrapper}>
            <img className={styles.good_img} src={goodInfo.mainImage} alt="" />
            <div className={styles.good_info}>
                <p className={styles.good_introduction}>{goodInfo.skuName}</p>
                {/* <p className={styles.good_introduction}>{goodInfo.goodInroduction}</p> */}
            </div>
        </div>
    }

    //表格拖动
    resizeTable = (index, size, type, data) => {
        //console.log(index, size, type, data);

        let datas = dragSldTableColumn(index, size, data);
        this.setState({ [type]: datas });
    }

    // 处理分页切换事件
    handleTablePagination = (pagination, filtersArg, sorter, type = 'main') => {
        if (Object.keys(sorter).length === 0){
            sorter.columnKey = "userCount";
            sorter.field = "userCount";
        }
        
        if (type == 'main') {
            const { formValues } = this.state;
            const params = sldHandlePaginationData(pagination, filtersArg, sorter, formValues,true);      
            pageSizeNum = params.pageSize;
            this.setState({
                params
            });
            this.get_list(params);
        }
    };

    //搜索事件
    search = (data) => {
        const values = { ...data };
        for (let i in values) {
            if (values[i] == '') {
                delete values[i]
            }
        }

        const {sorts} = this.state.params;
        const newParams = { pageSize:pageSizeNum,sorts, ...values };
        this.setState({
            formValues: values,
            params: newParams
        });

        this.get_list(newParams);
    };

    //搜索重置事件
    seaReset = () => {
        const { sorts } = this.state.params;
        const pageParams = { pageSize:pageSizeNum,sorts };
        //搜索条件置为空
        this.setState({
            formValues: {},
            params: pageParams
        });
        this.get_list(pageParams);
    };

    // 导出Excel
    handleSldExcel = () => {
        const { params, formValues,data } = this.state;
        if(data.list != undefined && data.list.length == 0){
            failTip('没有可导出的数据!');
            return 
        }
        let paramData = {
            ...params,
            ...formValues
        };
        paramData.fileName = `${sldComLanguage('要优惠导出')}`;
        const { dispatch } = this.props;
        this.setState({loading:true})
        dispatch({
            type: 'statistics/export_want_preferential_list',
            payload: paramData,
            callback: (res) => {
                // if(res.state!=undefined&&res.state != 89101001){
                //     failTip(res.msg);
                // }
                this.setState({loading:false})
            }
        })
    };

    render() {
        const { data, columns, loading, search_height, search_data } = this.state;
        return (
            <div className={global.common_page}>
                <AuthBtn btnAuth={btnAuth} eventKey={["want_preferential_export"]}>
                    <div className={global.flex_com_space_between} style={{ marginBottom: 10 ,justifyContent: 'right'}}>
                        <Tooltip title="单次支持最大的导出条数10000条"><span>{sldIconBtnBg(() => this.handleSldExcel(), 'ziyuan23', `${sldComLanguage('统计导出')}`, '#fff', 7, 0, 15, 15, 3)}</span></Tooltip>
                    </div>
                </AuthBtn>
                <div className={global.tableListForm} ref="search_part">
                    <Search
                        search_data={search_data}
                        seaSubmit={(datas) => this.search(datas)}
                        seaReset={() => this.seaReset()}
                    />
                </div>

                <Spin spinning={loading}>
                    <StandardTable
                        totalHeight={document.body.clientHeight - 180 - search_height - 45}
                        columns={columns}
                        data={data}
                        onChange={(pagination, filtersArg, sorter) => this.handleTablePagination(pagination, filtersArg, sorter, 'main')}
                    />
                </Spin>
            </div>
        )
    }
}
