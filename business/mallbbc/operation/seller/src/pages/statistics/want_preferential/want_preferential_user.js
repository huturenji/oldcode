import React, { Component } from 'react'
import { connect } from 'dva/index';
import { Spin, Tooltip } from 'antd';
import moment from 'moment';
import {
    dragSldTableColumn,
    list_com_page_size_10,
    sldComLanguage,
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
import SldStatDate from '@/components/SldStatDate';
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
                type: 'input',
                label: `${sldComLanguage('关键字')}`,
                name: 'searchKey',
                placeholder: `${sldComLanguage('请输入商品名称/会员昵称')}`,
                widthMode:'fat'
            }
        ],// 筛选条件数组
        data: {},// 要优惠统计列表数据
        columns: [
            {
                title: `${sldComLanguage('最后操作时间')}`,
                dataIndex: 'createTime',
                sorter: (a, b) => a.createTime - b.createTime,
                align: 'center',
                sortDirections: ['descend'],
                defaultSortOrder: 'descend',
                width: 150
            },
            {
                title: `${sldComLanguage('店铺名称')}`,
                mainImage: '',
                dataIndex: 'storeName',
                align: 'left',
                width: 180
            },
            {
                title: `${sldComLanguage('会员ID')}`,
                mainImage: '',
                dataIndex: 'memberId',
                align: 'left',
                width: 180
            },
            {
                title: `${sldComLanguage('会员昵称')}`,
                mainImage: '',
                dataIndex: 'userName',
                align: 'left',
                width: 180
            },
            {
                title: `${sldComLanguage('手机号')}`,
                mainImage: '',
                dataIndex: 'phone',
                align: 'left',
                width: 150
            },
            {
                title: `${sldComLanguage('商品信息')}`,
                dataIndex: 'skuName',
                align: 'left',
                render: (text, record) => this.getGoodInfo(record)
            },
            {
                title: `${sldComLanguage('商品sku')}`,
                dataIndex: 'sku',
                align: 'left',
                width: 150
            },
            {
                title: `${sldComLanguage('历史点击次数')}`,
                mainImage: '',
                dataIndex: 'clickCount',
                align: 'left',
                width: 120
            }
        ],// 表头数据
        loading: false,
        formValues: {}, // 搜索条件
        params: { pageSize: pageSizeNum },//分页搜索条件
        dateCondition: {
            startTime: `${moment().format('YYYY-MM-DD')} 00:00:00`,
            endTime: `${moment().format('YYYY-MM-DD')} 23:59:59:999`
        }, // 日期搜索条件
        dateRangeArray: [
            { label: '今天', value: "today" },
            { label: '近7天', value: "lastest_seven_day" },
            { label: '近15天', value: "lastest_fifteen_day" },
            { label: '近30天', value: "lastest_month" }
        ],
        defaultDateValue:"today", // 默认日期选中值
        dateSelectType: ['diy'] // 日期选择面板可选时间类型
    }

    componentDidMount() {
        const params = {sorts:[{direction:'DESC',field:'createTime'}],...this.state.params,...this.state.dateCondition};
        this.get_list(params);
    }

    //获取数据列表
    get_list = (params) => {
        this.setState({ loading: true });
        const { dispatch } = this.props;

        dispatch({
            type: 'statistics/get_want_preferential_user_list',
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
            sorter.columnKey = "createTime";
            sorter.field = "createTime";
        }
        
        if (type == 'main') {
            const { formValues } = this.state;
            const params = sldHandlePaginationData(pagination, filtersArg, sorter, formValues,true);      
            pageSizeNum = params.pageSize;
            this.setState({
                params
            });
            this.get_list({...params,...this.state.dateCondition});
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
        const { dateCondition } = this.state;
        const newParams = { pageSize:pageSizeNum,sorts, ...values, ...dateCondition };
        this.setState({
            formValues: values,
            params: newParams
        });

        this.get_list(newParams);
    };

    //搜索重置事件
    seaReset = () => {
        const { sorts } = this.state.params;
        const initDateValue = {
            startTime:`${moment().format('YYYY-MM-DD')} 00:00:00`,
            endTime:`${moment().format('YYYY-MM-DD')} 23:59:59:999`
        }
        const pageParams = { pageSize:pageSizeNum,sorts,...initDateValue };
        //搜索条件置为空
        this.setState({
            formValues: {},
            params: pageParams,
            defaultDateValue:'today',
            dateCondition:initDateValue
        });
        this.get_list(pageParams);
    };

    // 导出Excel
    handleSldExcel = () => {
        const { params, formValues,data,dateCondition } = this.state;
        if(data.list != undefined && data.list.length == 0){
            failTip('没有可导出的数据!');
            return 
        }
        let paramData = {
            ...params,
            ...formValues,
            ...dateCondition
        };
        paramData.fileName = `${sldComLanguage('要优惠导出')}`;
        const { dispatch } = this.props;
        this.setState({loading:true})
        dispatch({
            type: 'statistics/export_want_preferential_user_list',
            payload: paramData,
            callback: (res) => {
                // if(res.state!=undefined&&res.state != 89101001){
                //     failTip(res.msg);
                // }
                this.setState({loading:false})
            }
        })
    };

    //时间筛选器返回的时间数据
    updateSelectDate = (date,e) => {        
        this.setState({
            defaultDateValue:e ? e.target.value : '',
            dateCondition: {
                startTime: date.startTime,
                endTime: date.endTime
            }
        })   
    }

    render() {
        const { data, columns, loading, search_height, search_data, dateRangeArray,defaultDateValue,dateSelectType } = this.state;
        return (
            <div className={global.common_page}>
                <AuthBtn btnAuth={btnAuth} eventKey={["want_preferential_export"]}>
                    <div className={global.flex_com_space_between} style={{ marginBottom: 10 ,justifyContent: 'right'}}>
                        <Tooltip title="单次支持最大的导出条数10000条"><span>{sldIconBtnBg(() => this.handleSldExcel(), 'ziyuan23', `${sldComLanguage('统计导出')}`, '#fff', 7, 0, 15, 15, 3)}</span></Tooltip>
                    </div>
                </AuthBtn>
                <div className={global.tableListForm} ref="search_part" style={{ display: 'flex' }}>
                    <Search
                        search_data={search_data}
                        seaSubmit={(datas) => this.search(datas)}
                        seaReset={() => this.seaReset()}
                    />
                    <SldStatDate
                        idIndex="_want_preferential_view"
                        dateRangeArray={dateRangeArray}
                        updateSelectDate={(date,e) => this.updateSelectDate(date,e)}
                        defaultDateValue={defaultDateValue}
                        dateSelectType={dateSelectType}
                        diyDateMinValue={-90}
                        diyDateMaxFlag="today"
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
