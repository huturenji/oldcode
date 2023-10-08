import { connect } from 'dva/index';
import React, { Component } from 'react';
import { Form, Spin, Empty, Pagination, Button } from 'antd';
import { Scrollbars } from 'react-custom-scrollbars';
import router from 'umi/router';
import moment from 'moment';
import {
    dragSldTableColumn,
    list_com_page_size_10,
    list_com_page_num_1,
    dateTimeFormat,
    failTip,
    sucTip,
    getAuthBtn
} from '@/utils/utils';
import global from '@/global.less';
import order from './css/advert.less';
import Search from '@/components/Search/Search';
import DotTag from '@/components/DotTag';
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
            search_height: 0,
            loading: false,
            data: {},
            params: { pageSize: pageSize, pageNum: pageNum },//搜索条件
            search_data: [{
                type: 'input',
                label: `${('推送标题')}`,//渠道名称
                name: 'title',
                width:'244px',
                placeholder: `${('请输入推送标题')}`//请输入会员名称
            }],
            formValues: {},//搜索条件
            stateEnum:{//状态枚举
                0:{text:'已推送',canCancel: false},
                1:{text:'未推送',canCancel: true},
                2:{text:'已取消',canCancel: false}
            }
        };
    }

    componentDidMount() {
        this.get_list({ pageSize: pageSize, pageNum: pageNum });
        this.resize();
        window.addEventListener('resize', this.resize, { passive: true });
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.resize);
    }

    resize = () => {
        const { search_height } = this.state;
        if (this.refs.search_part != undefined) {
            if (this.refs.search_part.clientHeight != search_height) {
                this.setState({ search_height: this.refs.search_part.clientHeight })
            }
        }
    }

    //获取数据列表
    get_list = (params) => {
        this.setState({ loading: true });
        const { dispatch } = this.props;
        dispatch({
            type: 'advert/get_list',
            payload: { ...params },
            callback: (res) => {
                this.setState({ loading: false });
                if (res.state == 200) {
                    if (params.pageNum > 1 && res.data.records.length == 0 && this.state.params.pageNum > 1) {
                        params.pageNum = params.pageNum - 1;
                        this.get_list(params);
                    } else {
                        this.setState({
                            data: res.data
                        });
                    }
                } else {
                    failTip(res.msg);
                }
            }
        });
    };

    //搜索事件
    search = (data) => {
        let { params } = this.state;
        const values = { ...data };
        for (let i in values) {
            if (values[i] == '') {
                delete values[i]
            }
        }
        this.setState({
            formValues: values
        });
        let search = { params: { ...values } }
        this.get_list({ ...params, ...search });
    };

    //搜索重置事件
    seaReset = () => {
        //搜索条件置为空
        this.setState({
            formValues: {},
            data: {},
            params: { pageSize: pageSize, pageNum: pageNum }
        });
        this.get_list({ pageSize: pageSize, pageNum: pageNum });
    };

    //表格拖动
    resizeTable = (index, size, type, data) => {
        let datas = dragSldTableColumn(index, size, data);
        this.setState({ [type]: datas });
    };

    //改变每页的数量
    // eslint-disable-next-line no-shadow
    onShowSizeChange = (pageNum, pageSizeNew) => {
        let { params, formValues } = this.state;
        params.pageSize = pageSizeNew;
        pageSize = params.pageSize;
        let curParams = { ...params, ...formValues }
        this.setState({ params }, () => {
            this.get_list(curParams);
        });
    };

    //改变页码
    // eslint-disable-next-line no-shadow
    onPageChange = (page, pageSize) => {
        const { formValues } = this.state;
        let curParams = { pageSize: pageSize, pageNum: page, ...formValues }
        this.setState({ params: curParams });
        this.get_list(curParams);
    };

    //格式化时间
    dateTimeFormat = (time, format = dateTimeFormat) => moment(time).format(format);

    showStatus = (status) => {
        const {stateEnum} = this.state 
        switch (status){
        case 0: return <DotTag type='sucess'>{stateEnum[status].text}</DotTag>
        case 1: return <DotTag type="pending">{stateEnum[status].text} </DotTag>
        case 2: return <DotTag type="normal">{stateEnum[status].text} </DotTag>
        default: return <DotTag type="normal">{stateEnum[status].text} </DotTag>
        }                    
    }

    //跳转到新增
    toAdd() {
        let urlObj = {
            pathname: '/sysset_notice_set/advert_to_add'
        }
        router.push(urlObj)
    }
    
    // 跳转到查看
    toView(item) {
        let urlObj = {
            pathname: '/sysset_notice_set/advert_to_view'
        }
        let query = {};
        if (!!item) {
            query['id'] = item.id;
            urlObj['query'] = query;
        }
        router.push(urlObj)
    }

    //取消推送
    toCancel(item) {
        this.setState({ loading: true });
        const { dispatch } = this.props;
        dispatch({
            type: 'advert/cancel',
            payload: { id:item.id },
            callback: (res) => {
                this.setState({ loading: false });
                if (res.state == 200) {
                    sucTip(`已取消`);
                    this.get_list({ pageSize: pageSize, pageNum: pageNum });
                } else {
                    failTip(res.msg);
                }
            }
        });
    }

    render() {
        const { search_data, data, loading, params, search_height, stateEnum } = this.state;
        return (
            <div
                className={`${global.common_page}`}
                style={{ flex: 1, flexDirection: 'column', overflow: 'hidden' }}
            >
                <div className={global.flex_com_space_between} style={{ marginBottom: 10 }}>
                    <AuthBtn eventKey={['add_adv_push']} btnAuth={btnAuth}>
                        <Button type="primary" onClick={() => this.toAdd()}>新建推送</Button>
                    </AuthBtn>
                </div>
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
                                <li className={`${order.width_30} ${order.center}`}>ID</li>
                                <li className={`${order.width_30} ${order.center}`}>推送标题</li>
                                <li className={`${order.width_30} ${order.center}`}>推送渠道</li>
                                <li className={`${order.width_30} ${order.center}`}>推送时间</li>
                                <li className={`${order.width_30} ${order.center}`}>状态</li>
                                <li className={`${order.width_30} ${order.center}`}>操作</li>
                            </ul>
                            <div className={order.order_content}>
                                {data.records != undefined && data.records.length == 0 &&
                                    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                                }
                                <Scrollbars
                                    autoHeight
                                    autoHeightMax={document.body.clientHeight - 500 - search_height}
                                >
                                    {data.records != undefined && data.records.length > 0 && data.records.map((item, index) => <div className={order.item} key={index}>
                                        <div className={`${order.order_goods_part} ${global.flex_row_start_center}`}>
                                            <div className={`${order.order_state} ${order.width_30} ${order.center}`}>{item.id}</div>
                                            <div className={`${order.order_state} ${order.width_30} ${order.center}`}>{item.title}</div>
                                            <div className={`${order.order_state} ${order.width_30} ${order.center}`}>{`${item.pushChannel.pushChannelName}(${item.pushChannel.pushChannelId})`}</div>
                                            <div className={`${order.order_state} ${order.width_30} ${order.center}`}>{item.pushTime}</div>
                                            <div className={`${order.order_state} ${order.width_30} ${order.center}`}>{this.showStatus(item.status)}</div>
                                            <div className={`${order.operate} ${order.width_30} ${order.center} ${global.flex_row_center_center}`}>
                                                {stateEnum[item.status].canCancel && 
                                                <AuthBtn eventKey={['delete_adv_push']} btnAuth={btnAuth}>
                                                    <div className={`${order.operate_btn} ${order.cursorP} ${order.mr10}`} onClick={() => { sthis.toCancel(item) }}>
                                                    取消
                                                    </div>
                                                </AuthBtn>
                                                }
                                                <div className={`${order.operate_btn} ${order.cursorP}`} onClick={() => { sthis.toView(item) }} style={{marginLeft:'8px'}}>
                                                    查看
                                                </div>
                                            </div>
                                        </div>
                                    </div>)
                                    }
                                </Scrollbars>
                            </div>
                            <div className={order.pagination}>
                                {data.records != undefined && data.records.length > 0 &&
                                    <Pagination
                                        size="small"
                                        showSizeChanger
                                        showQuickJumper
                                        current={data.current}
                                        pageSize={params.pageSize}
                                        onShowSizeChange={this.onShowSizeChange}
                                        onChange={this.onPageChange}
                                        defaultCurrent={data.current}
                                        total={data.total}
                                    />
                                }
                            </div>
                        </div>
                        {/*标准表格-end*/}
                    </Spin>
                </div>
            </div>
        );
    }
}
