import { connect } from 'dva/index';
import React, { Component } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import {
    Form, Spin, Modal
} from 'antd';
import {
    failTip,
    list_com_page_size_10,
    isEmptyObject,
    getTableNum,
    sldComLanguage,
    sldHandlePaginationData,
    dragSldTableColumn,
    getSldComImg,
    getStorage
} from '@/utils/utils';
import global from '@/global.less';
import StandardTable from '@/components/StandardTable';
import Search from '@/components/Search/Search';

const storeId = getStorage('storeId');
let pageSize = list_com_page_size_10;
// eslint-disable-next-line no-unused-vars
let sthis = '';
@connect(({ pc_home, project }) => ({
    pc_home,
    project
}))
@Form.create()
export default class SldSelGoodsSingleDiy extends Component {


    init_flag = true;

    goods_columns = [
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
            render: (text) => getSldComImg(text, 200, 200, 35, 35)
        },
        {
            title: `${sldComLanguage('商品名称')}`,
            dataIndex: 'skuName',
            align: 'center',
            width: 200
        },
        {
            title: `${sldComLanguage('商品价格(元)')}`,
            dataIndex: 'salePrice',
            align: 'center',
            width: 100
        },
        {
            title: `${sldComLanguage('销量')}`,//销量
            dataIndex: 'saleNum',
            align: 'center',
            width: 100
        }
    ];

    voucher_columns = [
        {
            title: ' ',
            dataIndex: 'couponId',
            align: 'center',
            width: 55,
            render: (text, record, index) => getTableNum(this.state.params, pageSize, index)
        },
        {
            title: `${sldComLanguage('优惠券名称')}`,//优惠券名称
            dataIndex: 'couponName',
            align: 'center',
            width: 100
        },
        {
            title: `${sldComLanguage('优惠券类型')}`,//优惠券类型
            dataIndex: 'couponTypeValue',
            align: 'center',
            width: 100
        },
        {
            title: `${sldComLanguage('优惠券状态')}`,//优惠券状态
            dataIndex: 'stateValue',
            align: 'center',
            width: 100
        },
        {
            title: `${sldComLanguage('优惠券内容')}`,//优惠券内容
            dataIndex: 'couponContent',
            align: 'center',
            width: 150
        },
        {
            title: `${sldComLanguage('未领取数量')}`,//未领取数量
            dataIndex: 'remainNum',
            align: 'center',
            width: 100
            // render: (text, record, index) => record.publishNum * 1 - record.receivedNum * 1,
        }
    ];

    freightCoupon_columns = [
        {
            title: ' ',
            dataIndex: 'id',
            align: 'center',
            width: 55,
            render: (text, record, index) => getTableNum(this.state.params, pageSize, index)
        },
        {
            title: `${sldComLanguage('运费券名称')}`,//优惠券名称
            dataIndex: 'couponName',
            align: 'center',
            width: 100
        },
        {
            title: `${sldComLanguage('运费券ID')}`,//优惠券ID
            dataIndex: 'couponId',
            align: 'center',
            width: 100
        },
        {
            title: `${sldComLanguage('发行总量')}`,//优惠券内容
            dataIndex: 'publishNum',
            align: 'center',
            width: 150
        },
        {
            title: `${sldComLanguage('使用时间')}`,//使用时间
            dataIndex: 'effectiveStart',
            align: 'center',
            width: 100,
            render: function (text, record) {
                let res = '';
                if (record.cycle) {
                    res = `${sldComLanguage('领取后')}${record.cycle}${sldComLanguage('天内')}`;
                } else {
                    res = <div className={global.voucher_time_wrap}>
                        <p>{text}</p>
                        <p>~</p>
                        <p>{record.effectiveEnd}</p>
                    </div>;
                }
                return res;
            }
        },
        {
            title: `${sldComLanguage('获取方式')}`,//获取方式
            dataIndex: 'publishTypeValue',
            align: 'center',
            width: 100
        },
        {
            title: `${sldComLanguage('活动状态')}`,//活动状态
            dataIndex: 'stateValue',
            align: 'center',
            width: 100
        }
    ];

    consumerCoupon_columns = [
        {
            title: ' ',
            dataIndex: 'id',
            align: 'center',
            width: 55,
            render: (text, record, index) => getTableNum(this.state.params, pageSize, index)
        },
        {
            title: `${sldComLanguage('消费券名称')}`,//优惠券名称
            dataIndex: 'couponName',
            align: 'center',
            width: 100
        },
        {
            title: `${sldComLanguage('消费券ID')}`,//优惠券ID
            dataIndex: 'couponId',
            align: 'center',
            width: 100
        },
        {
            title: `${sldComLanguage('发行总量')}`,//优惠券内容
            dataIndex: 'publishNum',
            align: 'center',
            width: 80
        },
        {
            title: `${sldComLanguage('已领取/已使用/已过期')}`,
            dataIndex: 'expiredNum',
            align: 'center',
            width: 150,
            render: (text, record) =>
                <div>{record.receivedNum}/{record.usedNum}/{record.expiredNum}</div>


        },
        {
            title: `${sldComLanguage('使用时间')}`,//使用时间
            dataIndex: 'effectiveStart',
            align: 'center',
            width: 200,
            render: function (text, record) {
                let res = '';
                if (record.cycle) {
                    res = `${sldComLanguage('领取后')}${record.cycle}${sldComLanguage('天内')}`;
                } else {
                    res = <div className={global.voucher_time_wrap}>
                        <p>{text}</p>
                        <p>~</p>
                        <p>{record.effectiveEnd}</p>
                    </div>;
                }
                return res;
            }
        },
        {
            title: `${sldComLanguage('获取方式')}`,//获取方式
            dataIndex: 'publishTypeValue',
            align: 'center',
            width: 100
        },
        {
            title: `${sldComLanguage('活动状态')}`,//活动状态
            dataIndex: 'stateValue',
            align: 'center',
            width: 100
        }
    ];

    redPacket_columns = [
        {
            title: ' ',
            dataIndex: 'id',
            align: 'center',
            width: 55,
            render: (text, record, index) => getTableNum(this.state.params, pageSize, index)
        },
        {
            title: '红包名称',
            dataIndex: 'couponName',
            align: 'center',
            width: 100
        },
        {
            title: '红包ID',
            dataIndex: 'couponId',
            align: 'center',
            width: 100
        },
        {
            title: '红包类型',
            dataIndex: 'couponTypeValue',
            align: 'center',
            width: 100
        },
        {
            title: '单个红包金额',
            dataIndex: 'couponContent',
            align: 'center',
            width: 100
        },
        {
            title: '红包总金额',
            dataIndex: 'publishAmount',
            align: 'center',
            width: 100
        },
        {
            title: `${sldComLanguage('已经领/已使用/发布数')}`,
            dataIndex: 'publishNum',
            align: 'center',
            width: 150,
            render: (text, record) => <div>{record.receivedNum}/{record.usedNum}/{record.publishNum}</div>
        },
        {
            title: `${sldComLanguage('活动时间')}`,//活动时间
            dataIndex: 'publishStartTime',
            align: 'center',
            width: 100,
            render: function (text, record) {
                return <div className={global.voucher_time_wrap}>
                    <p>{text}</p>
                    <p>~</p>
                    <p>{record.publishEndTime}</p>
                </div>;
            }
        },
        {
            title: `${sldComLanguage('使用时间')}`,//使用时间
            dataIndex: 'effectiveStart',
            align: 'center',
            width: 100,
            render: function (text, record) {
                let res = '';
                if (record.cycle) {
                    res = `${sldComLanguage('领取后')}${record.cycle}${sldComLanguage('天内')}`;
                } else {
                    res = <div className={global.voucher_time_wrap}>
                        <p>{text}</p>
                        <p>~</p>
                        <p>{record.effectiveEnd}</p>
                    </div>;
                }
                return res;
            }
        },
        {
            title: `${sldComLanguage('获取方式')}`,//获取方式
            dataIndex: 'publishTypeValue',
            align: 'center',
            width: 100
        },
        {
            title: `${sldComLanguage('适用渠道')}`,//适用渠道
            dataIndex: 'channelName',
            align: 'center',
            width: 100
        },
        {
            title: `${sldComLanguage('活动状态')}`,//活动状态
            dataIndex: 'stateValue',
            align: 'center',
            width: 100
        }
    ];

    tax_columns = [
        {
            title: `${sldComLanguage('商品税务编码')}`,
            dataIndex: 'code',
            align: 'center',
            width: 100
        },
        {
            title: `${sldComLanguage('一级分类')}`,
            dataIndex: 'primaryClassification',
            align: 'center',
            width: 100
        },
        {
            title: `${sldComLanguage('二级分类')}`,
            dataIndex: 'secondaryClassification',
            align: 'center',
            width: 100
        },
        {
            title: `${sldComLanguage('税率')}`,
            dataIndex: 'rate',
            align: 'center',
            width: 150
        },
        {
            title: `${sldComLanguage('使用比例')}`,
            dataIndex: 'recommendScore',
            align: 'center',
            width: 100
        }
    ];

    cat_columns = [
        {
            title: `${sldComLanguage('分类名称')}`,
            align: 'left',
            dataIndex: 'categoryName',
            width: 250
        }
    ];

    topic_columns_mobile = [
        {
            title: ' ',
            dataIndex: 'decoId',
            align: 'center',
            width: 30,
            render: (text, record, index) => getTableNum(this.state.params, pageSize, index)
        }, {
            title: `${sldComLanguage('专题名称')}`,
            align: 'center',
            dataIndex: 'name',
            width: 200
        }, {
            title: `${sldComLanguage('创建时间')}`,
            align: 'center',
            dataIndex: 'createTime',
            width: 150
        },
        {
            title: `${sldComLanguage('修改时间')}`,
            dataIndex: 'updateTime',
            align: 'center',
            width: 150
        }
    ];

    topic_columns_pc = [
        {
            title: ' ',
            dataIndex: 'decoId',
            align: 'center',
            width: 30,
            render: (text, record, index) => getTableNum(this.state.params, pageSize, index)
        }, {
            title: `${sldComLanguage('专题名称')}`,
            align: 'center',
            dataIndex: 'decoName',
            width: 200
        }, {
            title: `${sldComLanguage('创建时间')}`,
            align: 'center',
            dataIndex: 'createTime',
            width: 150
        },
        {
            title: `${sldComLanguage('修改时间')}`,
            dataIndex: 'updateTime',
            align: 'center',
            width: 150
        }
    ];

    //秒杀数据列
    seckill_columns = [
        {
            title: ' ',
            dataIndex: 'id',
            align: 'center',
            width: 55,
            render: (text, record, index) => getTableNum(this.state.params, pageSize, index)
        }, {
            title: `${sldComLanguage('活动名称')}`,//活动名称
            dataIndex: 'promotionName',
            align: 'center',
            width: 100
        }, {
            title: `${sldComLanguage('活动时间')}`,//活动时间
            dataIndex: 'startTime',
            align: 'center',
            width: 200,
            render: (text, record) => `${text}~${record.endTime}`
        }, {
            title: `${sldComLanguage('活动状态')}`,//活动状态
            dataIndex: 'state',
            align: 'center',
            width: 100,
            render: function(text, record) {
                if(record.state=='1'){
                    return '未开始'
                }
                if(record.state=='2'){
                    return '进行中'
                } 
            }
        }
    ];

    //一起买数据
    buytogether_columns = [
        {
            title: `${sldComLanguage('活动名称')}`,//活动名称
            dataIndex: 'promotionName',
            align: 'center',
            width: 200
        }, {
            title: `${sldComLanguage('活动日期')}`,//活动时间
            dataIndex: 'startTime',
            align: 'center',
            width: 200,
            render: function (text, record) {
                let startIndex = record.startTime.indexOf(' ')
                let start = record.startTime.substring(0,startIndex)
                let endIndex = record.endTime.indexOf(' ')
                let end = record.endTime.substring(0,endIndex)
                return `${start}—${end}`
            }
        }, {
            title: `${sldComLanguage('活动场次')}`,//活动时间
            dataIndex: 'stageHourTimeList',
            align: 'center',
            width: 200,
            render: (text, record) => `${record.stageHourTimeList.join(',')}`
        }, {
            title: `${sldComLanguage('活动时长')}`,//活动时间
            dataIndex: 'duration',
            align: 'center',
            width: 200,
            render: (text, record) => `${record.duration}小时`
        }, {
            title: `${sldComLanguage('活动状态')}`,//活动状态
            dataIndex: 'stateValue',
            align: 'center',
            width: 100
        }
    ];

    // 签到活动数据
    signin_columns = [
        {
            title: `${sldComLanguage('活动名称')}`,//活动名称
            dataIndex: 'signActivityName',
            align: 'center',
            width: 200
        }, {
            title: `${sldComLanguage('活动日期')}`,//活动时间
            dataIndex: 'startTime',
            align: 'center',
            width: 200,
            render: function (text, record) {
                let startIndex = record.startTime.indexOf(' ')
                let start = record.startTime.substring(0,startIndex)
                let endIndex = record.endTime.indexOf(' ')
                let end = record.endTime.substring(0,endIndex)
                return `${start}—${end}`
            }
        }, {
            title: `${sldComLanguage('活动状态')}`,//活动状态
            dataIndex: 'stateValue',
            align: 'center',
            width: 100
        }
    ]

    rowKey = '';//table 行唯一标识

    constructor(props) {
        super(props);
        sthis = this;
        this.state = {
            modalTableSeleData: {},
            expandedRowKeys: [],
            link_type: props.link_type,//链接类型，goods
            modalVisible: false,//是否展示modal框
            width: 900,//modal框宽带
            modaltitle: `${sldComLanguage('选择器')}`,
            params: { pageSize: pageSize },//搜索条件
            search_data: [{
                type: 'input',
                label: `${sldComLanguage('商品名称')}`,
                name: 'skuName',
                placeholder: `${sldComLanguage('请输入商品名称')}`
            }],//筛选器
            loading: false,
            data: {},//表格的数据
            selectedRows: [],
            selectedRowKeys: [],
            columns: [],
            sldpagination: true,//是否展示分页
            couponOrigin: 'admin'
        };

    }

    componentDidMount() {
        if (this.props.link_type != '') {
            this.get_list({ pageSize: pageSize });
        }
    }

    componentWillReceiveProps(nextProps) {
        const { ifDecorateUse } = nextProps;
        let { columns, modaltitle, sldpagination, params } = this.state;
        let newParams = { ...params };
        if (nextProps.link_type == 'goods' || nextProps.link_type == 'category' || nextProps.link_type == 'topic' || nextProps.link_type == 'seckill' || nextProps.link_type == 'tax' || nextProps.link_type == 'voucher' || nextProps.link_type == 'buytogether' || nextProps.link_type == 'buyeveryday' || nextProps.link_type == 'signin' || nextProps.link_type == 'signCoupon' || nextProps.link_type == 'redPacket' || nextProps.link_type == 'freightCoupon' || nextProps.link_type == 'consumerCoupon') {

            let search_data = [];// 搜索条件数组

            if (nextProps.link_type == 'goods') {
                columns = this.goods_columns;
                modaltitle = `${sldComLanguage('选择商品')}`;
                search_data = [{
                    type: 'input',
                    label: `${sldComLanguage('商品名称')}`,
                    name: 'skuName',
                    placeholder: `${sldComLanguage('请输入商品名称')}`
                }];//筛选器
                sldpagination = true;
                this.rowKey = 'sku';
            } else if (nextProps.link_type == 'category') {
                columns = this.cat_columns;
                modaltitle = `${sldComLanguage('选择分类')}`;
                search_data = [];
                sldpagination = false;
                this.rowKey = 'categoryId';
            } else if (nextProps.link_type == 'topic') {
                if (nextProps.client == 'mobile') {
                    //移动端装修
                    columns = this.topic_columns_mobile;
                    search_data = [{
                        type: 'input',
                        label: `${sldComLanguage('专题名称')}`,
                        name: 'name',
                        placeholder: `${sldComLanguage('请输入专题名称')}`
                    }];//筛选器
                } else {
                    //PC装修
                    columns = this.topic_columns_pc;
                    search_data = [{
                        type: 'input',
                        label: `${sldComLanguage('专题名称')}`,
                        name: 'decoName',
                        placeholder: `${sldComLanguage('请输入专题名称')}`
                    }];//筛选器
                }
                modaltitle = `${sldComLanguage('请选择专题')}`;
                sldpagination = true;
                this.rowKey = 'decoId';

            } else if (nextProps.link_type == 'tax') {
                columns = this.tax_columns;
                modaltitle = `${sldComLanguage('商品查询')}`;
                search_data = [{
                    type: 'input',
                    label: `${sldComLanguage('商品名称')}`,
                    name: 'skuName',
                    placeholder: `${sldComLanguage('请输入商品名称')}`,
                    initValue: nextProps.skuName
                }];//筛选器
                sldpagination = false;
                this.rowKey = 'code';
            } else if (nextProps.link_type == 'seckill') {
                columns = this.seckill_columns;
                modaltitle = `${sldComLanguage('选择秒杀活动')}`;//选择秒杀活动
                search_data = [{
                    type: 'input',
                    label: `活动名称`,//活动名称
                    name: 'promotionName',
                    placeholder: `${sldComLanguage('请输入活动名称')}`//请输入活动名称
                }, {
                    type: 'select',
                    label: `活动状态`,
                    name: 'state',
                    placeholder: `${sldComLanguage('请选择活动状态')}`,
                    sel_data: [
                        { key: '', name: `${sldComLanguage('全部')}` },
                        { key: '1', name: `${sldComLanguage('未开始')}` },
                        { key: '2', name: `${sldComLanguage('进行中')}` }
                    ]
                }];//筛选器
                modaltitle = `${sldComLanguage('选择秒杀活动')}`;
                sldpagination = true;
                this.rowKey = 'promotionId';
            } else if (nextProps.link_type == 'buyeveryday') {
                columns = this.buyeveryday_columns;
                newParams.states = [1, 2];
                search_data = [{
                    type: 'input',
                    label: `活动名称`,//活动名称
                    name: 'promotionName',
                    placeholder: `${sldComLanguage('请输入活动名称')}`//请输入活动名称
                }, {
                    type: 'select',
                    label: `活动状态`,
                    name: 'states',
                    placeholder: `${sldComLanguage('请选择活动状态')}`,
                    sel_data: [
                        { key: [1, 2], name: `${sldComLanguage('全部')}` },
                        { key: [1], name: `${sldComLanguage('未开始')}` },
                        { key: [2], name: `${sldComLanguage('进行中')}` }
                    ]
                }];//筛选器
                modaltitle = `${sldComLanguage('选择天天专场活动')}`;
                sldpagination = true;
                this.rowKey = 'promotionId';
            } else if (nextProps.link_type == 'buytogether') {
                columns = this.buytogether_columns;
                newParams.states = [1, 2];
                modaltitle = `${sldComLanguage('选择一起买活动')}`;//选择秒杀活动
                search_data = [{
                    type: 'input',
                    label: `活动名称`,//活动名称
                    name: 'promotionName',
                    placeholder: `${sldComLanguage('请输入活动名称')}`//请输入活动名称
                }, {
                    type: 'select',
                    mode: "multiple",
                    width: 250,
                    initialValue: [1, 2],
                    label: `活动状态`,
                    name: 'states',
                    placeholder: `${sldComLanguage('请选择活动状态')}`,
                    sel_data: [
                        { key: 1, name: `${sldComLanguage('未开始')}` },
                        { key: 2, name: `${sldComLanguage('进行中')}` }
                    ]
                }];//筛选器
                modaltitle = `${sldComLanguage('选择一起买活动')}`;
                sldpagination = true;
                this.rowKey = 'promotionId';
            } else if (nextProps.link_type == 'voucher') {
                columns = this.voucher_columns;
                if(ifDecorateUse){
                    // 添加初始查询条件
                    newParams.systemType = 'seller';
                    newParams.publishType = 1;
                    newParams.states = ['4','1'];
                }
                modaltitle = `${sldComLanguage('选择优惠券')}`;//选择优惠券
                search_data = [{
                    type: 'input',
                    label: `${sldComLanguage('优惠券名称')}`,//优惠券名称
                    name: 'couponName',
                    placeholder: `${sldComLanguage('请输入优惠券名称')}`//请输入优惠券名称
                }];//筛选器
                const voucherStateFilter = {
                    type: 'select',
                    label: `${sldComLanguage('优惠券状态')}`,
                    name: 'state',
                    placeholder: `${sldComLanguage('请选择优惠券状态')}`,
                    sel_data: [
                        { key: '', name: `${sldComLanguage('全部')}` },
                        { key: '4', name:`${sldComLanguage('进行中')}` }
                    ]
                };
                if(ifDecorateUse){
                    voucherStateFilter.sel_data.splice(1,0,{ key: '1', name: `${sldComLanguage('未开始')}` })
                    search_data.push({
                        type: 'select',
                        label: `${sldComLanguage('优惠券类型')}`,
                        name: 'couponType',
                        placeholder: `${sldComLanguage('请选择优惠券类型')}`,
                        sel_data: [
                            { key: '', name: `${sldComLanguage('全部')}` },
                            { key: '1', name: `${sldComLanguage('满减券')}` },
                            { key: '2', name: `${sldComLanguage('折扣券')}` },
                            { key: '3', name: `${sldComLanguage('随机金额券')}` }
                        ]
                    })
                }
                search_data.push(voucherStateFilter)
                sldpagination = true;
                this.rowKey = 'couponId';
            } else if (nextProps.link_type == 'freightCoupon') {
                newParams.stateList = ['4', '1'];
                newParams.publishType = 1;
                // 获取签到活动列表
                columns = this.freightCoupon_columns;
                modaltitle = `${sldComLanguage('选择运费券')}`;//选择秒杀活动
                search_data = [{
                    type: 'input',
                    label: `运费券名称`,//活动名称
                    name: 'couponName',
                    placeholder: `${sldComLanguage('请输入运费券名称')}`//请输入活动名称
                }];//筛选器
                sldpagination = true;
                this.rowKey = 'couponId';
            } else if (nextProps.link_type == 'consumerCoupon') {
                newParams.states = ['8'];
                newParams.publishType = 1;
                // 获取签到活动列表
                columns = this.consumerCoupon_columns;
                modaltitle = `${sldComLanguage('选择消费券')}`;//选择秒杀活动
                search_data = [{
                    type: 'input',
                    label: `消费券名称`,//活动名称
                    name: 'couponName',
                    placeholder: `${sldComLanguage('请输入消费券名称')}`//请输入活动名称
                }];//筛选器
                sldpagination = true;
                this.rowKey = 'couponId';
            } else if (nextProps.link_type == 'signin') {
                newParams.stateList = ['5'];

                // 获取签到活动列表
                columns = this.signin_columns;
                modaltitle = `${sldComLanguage('选择签到活动')}`;//选择秒杀活动
                search_data = [{
                    type: 'input',
                    label: `活动名称`,//活动名称
                    name: 'signActivityName',
                    placeholder: `${sldComLanguage('请输入活动名称')}`//请输入活动名称
                }];//筛选器
                sldpagination = true;
                this.rowKey = 'signActivityId';
            } else if (nextProps.link_type == 'signCoupon') {
                // 获取签到  活动赠送优惠券
                columns = this.voucher_columns;
                modaltitle = `选择平台优惠券`;
                search_data = [{
                    type: 'input',
                    label: `优惠券名称`,
                    name: 'couponName',
                    placeholder: `${sldComLanguage('请输入优惠券名称')}`
                }];//筛选器
                sldpagination = true;
                this.rowKey = 'couponId';
            } else if (nextProps.link_type == 'redPacket') {
                // 获取签到  赠送红包
                columns = this.redPacket_columns;
                modaltitle = `选择平台红包`;
                search_data = [{
                    type: 'input',
                    label: `红包名称`,
                    name: 'couponName',
                    placeholder: `${sldComLanguage('请输入红包名称')}`
                }];//筛选器
                sldpagination = true;
                this.rowKey = 'couponId';
            }
            this.setState({
                search_data,
                link_type: nextProps.link_type,
                modalVisible: true,
                columns,
                modaltitle,
                sldpagination,
                selectedRowKeys: nextProps.link_type == 'voucher' || nextProps.link_type == 'consumerCoupon' || nextProps.link_type == 'freightCoupon' ? nextProps.selectedRowKeys : [],
                selectedRows: nextProps.link_type == 'voucher' || nextProps.link_type == 'consumerCoupon' || nextProps.link_type == 'freightCoupon' ? nextProps.selectedRows : [],
                modalTableSeleData: nextProps.link_type == 'voucher' || nextProps.link_type == 'consumerCoupon' || nextProps.link_type == 'freightCoupon' ? nextProps.selectedRows : [],
                params: newParams
            }, () => {
                let param = { pageSize: pageSize };
                if (nextProps.link_type == 'category') {
                    param.categoryId = 0;
                }
                if (nextProps.link_type == 'tax') {
                    param.skuName = nextProps.skuName;
                }
                param = {...param,...this.state.params}
                this.get_list(param)
            });
        }
    }

    componentWillUnmount() {

    }

    //获取数据列表
    get_list = (params, grade = '') => {
        this.setState({ loading: true });
        const { dispatch, ifDecorateUse } = this.props;
        let { link_type, data, expandedRowKeys } = this.state;
        let dis_type = '';
        let new_params = { ...params };
        if (link_type == 'goods') {
            //获取商品数据
            dis_type = 'project/get_search_by_keyword';
            // new_params.state = 3;//在售状态
            new_params.pageIndex = params.current || 1
            new_params.keyword = params.skuName
            new_params.storeId = storeId
        } else if (link_type == 'category') {
            //获取分类数据
            dis_type = 'project/get_cate_list_by_id';
            new_params = params;
        } else if (link_type == 'voucher') {
            //获取优惠券数据
            dis_type = ifDecorateUse ? 'project/get_voucher_list' : 'project/get_voucher_send_list';
            new_params = params;
            //   new_params.pageSize = 10
        } else if (link_type == 'topic') {
            if (this.props.client != undefined && this.props.client == 'mobile') {
                //移动端专题
                dis_type = 'project/get_diy_page_lists';
                new_params.type = 'topic';
            } else {
                //获取PC专题列表，启用状态
                dis_type = 'project/get_pc_diy_page_list';
                new_params.decoType = 'topic';
                new_params.isEnable = 1;//只获取启用状态
            }

        } else if (link_type == 'seckill') {
            //获取秒杀活动
            dis_type = 'project/get_all_seckill_list';
            if(params.state){
                params.states = [params.state]
                delete params['state']
            }else {
                params.states = [1,2]
            }                 
            params.pageIndex = params.current || 1
                        
            new_params = params;
        } else if (link_type == 'tax') {
            const { skuName } = params
            if (!skuName) {
                failTip('请填写商品名称');
                this.setState({ loading: false });
                return false
            }
            dis_type = 'project/getGoodsTaxCode';
            new_params = params;
            new_params.pageSize = 20
        }
        else if (link_type == 'buytogether') {
            //获取秒杀活动
            dis_type = 'project/get_buytogether_list';
            new_params = params;
            new_params.pageIndex = params.current || 1;
            new_params.pageSize = pageSize;
        } 
        // else if (link_type == 'buyeveryday') {
        //     //获取秒杀活动
        //     dis_type = 'project/get_buyeveryday_list';
        //     new_params.pageIndex = params.current || 1;
        //     new_params.pageSize = pageSize;
        // } 
        else if (link_type == 'signin') {
            dis_type = 'project/get_singin_lists';
            new_params.pageIndex = params.current || 1;
            new_params.pageSize = pageSize;
            new_params.systemType = 'seller'
        } 
        // else if (link_type == 'signCoupon') {
        //     dis_type = 'project/get_voucher_list';
        //     new_params.pageIndex = params.current || 1;
        //     new_params.pageSize = pageSize;
        // } else if (link_type == 'freightCoupon') {
        //     dis_type = 'project/get_freightcoupon_lists';
        //     new_params.pageIndex = params.current || 1;
        //     new_params.pageSize = pageSize;
        // } 
        else if (link_type == 'consumerCoupon') {
            dis_type = 'project/get_conscoupon_lists';
            new_params.current = params.current || 1;
            new_params.pageSize = pageSize;
        }
        // else if (link_type == 'redPacket') {
        //     dis_type = 'project/get_redpacket_lists';
        //     new_params.pageIndex = params.current || 1;
        //     new_params.pageSize = pageSize;
        // }
        
        dispatch({
            type: dis_type,
            payload: new_params,
            callback: (res) => {
                this.setState({ loading: false });
                if (res.state == 200) {
                    if (link_type == 'goods' || link_type == 'topic' || link_type == 'consumerCoupon' || link_type == 'buytogether' || link_type == 'seckill') {
                        data = res.data;
                    } else if (link_type == 'voucher') {
                        data = res.data
                        data.list = res.data.list.filter(item => item.remainNum != 0)
                    } else if (link_type == 'category') {
                        //id为0直接赋值
                        if (grade != '') {
                            for (let i = 0; i < data.list.length; i++) {
                                if (grade == 1) {
                                    if (data.list[i].categoryId == params.categoryId) {
                                        data.list[i].children = res.data.list;
                                        break;
                                    }
                                } else if (data.list[i].children != undefined) {
                                    for (let j = 0; j < data.list[i].children.length; j++) {
                                        if (data.list[i].children[j].categoryId == params.categoryId) {
                                            data.list[i].children[j].children = res.data.list;
                                            break;
                                        }
                                    }
                                }
                            }
                        } else {
                            data.list = res.data.list;
                        }
                    } else if (link_type == 'tax') {
                        data.list = res.data.list
                    }
                    this.setState({
                        data,
                        expandedRowKeys: grade == '' ? [] : expandedRowKeys
                    });
                }
            }
        });
    };

    handleSelectRows = (rows, rowkeys) => {
        const { link_type } = this.props;
        //针对翻页无法保存选择的行数据处理
        let { selectedRows, selectedRowKeys, couponOrigin } = this.state;
        let pre_sele_rows_keyarray = [];
        for (let i = 0; i < selectedRows.length; i++) {
            pre_sele_rows_keyarray.push(selectedRows[i][this.rowKey]);
        }
        //去掉的话要删掉行数据
        for (let i = 0; i < selectedRowKeys.length; i++) {
            if (rowkeys.indexOf(selectedRowKeys[i]) == -1) {
                selectedRows = selectedRows.filter(item => item[this.rowKey] != selectedRowKeys[i]);
            }
        }
        //没有的话追加行数据
        for (let i = 0; i < rowkeys.length; i++) {
            if (pre_sele_rows_keyarray.indexOf(rowkeys[i]) == -1) {
                let cur_row = rows.filter(item => item[this.rowKey] == rowkeys[i])[0];
                selectedRows.push(cur_row);
            }
        }
        this.setState({
            selectedRows: selectedRows,
            selectedRowKeys: rowkeys
        });

        if (link_type == 'voucher') {

            const finalCouponData = selectedRows.map(item => {
                const { couponId, couponName, couponType, couponContent, couponTypeValue, effectiveStart, effectiveEnd, publishValue, limitQuota, cycle, publishNum, receivedNum, description, randomMin, randomMax, promotionType } = item;
                return {
                    couponId,
                    couponName,
                    couponType,
                    couponContent,
                    couponTypeValue,
                    effectiveStart,
                    effectiveEnd,
                    publishValue,
                    limitQuota,
                    cycle,
                    couponOrigin,
                    publishNum,
                    receivedNum,
                    description,
                    randomMin,
                    randomMax,
                    promotionType
                }
            })

            this.setState({
                modalTableSeleData: finalCouponData
            });
        }
        if (['consumerCoupon','buytogether'].includes(link_type)) {
            this.setState({
                modalTableSeleData: selectedRows
            });
        }
    };

    //搜索事件
    search = (data) => {
        const { ifDecorateUse } = this.props;
        const values = { ...data };
        const { params } = this.state;
        let newParams = { ...params };
        if (this.props.link_type === 'voucher' && ifDecorateUse) {
            newParams.systemType = this.state.couponOrigin;
            newParams.publishType = 1;
            if(values.state){
                values.states = [`${values.state}`]
            }else {
                values.states = ['1','4']
            }   
            newParams.states = values.states
        }
        if(this.props.link_type === 'buytogether'){
            newParams.states = values.states ? values.states : [1,2];
        }
        if(this.props.link_type === 'buyeveryday'){
            newParams.states = values.states ? values.states : [1,2];
        }
        this.setState({
            formValues: data,
            params: newParams
        },()=>{
            this.get_list({ ...values, ...this.state.params });
        });
        
    };

    //搜索重置事件
    seaReset = (data) => {
        //搜索条件置为默认值 空
        this.setState({
            formValues: data || {},
            selectedKeys: [' '],
            params: { pageSize: pageSize }
        });
        this.get_list({ pageSize: pageSize, ...data });
    };

    sldConfirm = () => {
        let { modalTableSeleData } = this.state;
        if (!isEmptyObject(modalTableSeleData)) {
            this.setState({
                modalVisible: false,
                link_type: '',
                params: { pageSize: pageSize }
            });
            this.props.seleSku(modalTableSeleData);
        } else {
            failTip(`${sldComLanguage('请选择数据')}`);
        }
    };

    //关闭modal之后重置数据
    closeReset = () => {
        this.init_flag = true;
    };

    //取消事件
    sldCancle = () => {
        this.props.sldHandleCancle && this.props.sldHandleCancle();
        this.setState({
            modalVisible: false,
            link_type: '',
            params: { pageSize: pageSize }
        });
    };

    //选中单行的操作
    onSldHandleSeleRow = (record) => {
        let { modalTableSeleData, link_type } = this.state;

        modalTableSeleData = {};
        //剔除无用数据
        if (link_type == 'goods') {
            modalTableSeleData.sku = record.sku;
            modalTableSeleData.skuName = record.skuName;
            modalTableSeleData.salePrice = record.salePrice;
            modalTableSeleData.saleNum = record.saleNum;
            modalTableSeleData.mainImage = record.mainImage;
            // modalTableSeleData.defaultProductId = record.productId;
        } else if (link_type == 'topic') {
            if (this.props.client == 'mobile') {
                modalTableSeleData.id = record.decoId;
                modalTableSeleData.name = record.name;
            } else {
                modalTableSeleData.decoId = record.decoId;
                modalTableSeleData.decoName = record.decoName;
            }
        } else if (link_type == 'category') {
            modalTableSeleData.categoryId = record.categoryId;
            modalTableSeleData.categoryName = record.categoryName;
            modalTableSeleData.grade = record.grade;
            modalTableSeleData.pid = record.pid;
        } else if (link_type == 'seckill') {
            modalTableSeleData.promotionId = record.promotionId;
            modalTableSeleData.promotionName = record.promotionName;
        } else if (link_type == 'voucher') {
            modalTableSeleData.couponId = record.couponId;
            modalTableSeleData.couponName = record.couponName;
        } else if (link_type == 'tax') {
            modalTableSeleData.taxCode = record.code;
            modalTableSeleData.taxRate = record.rate;
        }
        this.setState({
            modalTableSeleData
        });
    };

    onExpand = (expanded, record) => {
        let { expandedRowKeys } = this.state;
        if (expanded) {
            expandedRowKeys.push(record.categoryId);
            this.get_list({ categoryId: record.categoryId }, record.grade);
        } else {
            expandedRowKeys = expandedRowKeys.filter(item => item != record.categoryId);
        }
        this.setState({ expandedRowKeys });
    };

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

            if (this.props.link_type === 'category') {
                params.categoryId = 0
            }

            if (this.props.link_type === 'voucher') {
                params.systemType = this.state.couponOrigin;
                params.publishType = 1;
                params.states = params.states || ['4', '1'];

            }

            if (this.props.link_type === 'signin') {
                params.stateList = params.states || ['5'];
            }

            if (this.props.link_type === 'consumerCoupon') {
                params.states = params.states || ['8'];
                params.publishType= 1;
            }

            this.setState({
                params: params
            });
            this.get_list(params);
        }
    };

    // 重置优惠券面板优惠券类型选中状态和表格列
    resetCouponTypeRadio = () => {
        const couponTableColumns = deepCopy(this.voucher_columns);
        if (couponTableColumns.some(item => item.dataIndex === 'storeName')) {
            couponTableColumns.splice(1, 1);
        }
        this.setState({
            couponOrigin: 'admin',
            voucher_columns: couponTableColumns
        })
    }


    render() {
        const { link_type, ifMultiSelected } = this.props;
        const { modalVisible, modaltitle, width, data, columns, search_data, loading, sldpagination, expandedRowKeys, selectedRows, selectedRowKeys } = this.state;
        return (
            <Modal
                destroyOnClose
                onOk={this.sldConfirm}
                afterClose={this.closeReset}
                onCancel={this.sldCancle}
                visible={modalVisible}
                width={width}
                title={modaltitle}
            >

                <div style={{ display: 'flex', flexDirection: 'row' }}>
                    <div className={global.common_page} style={{ flex: 1 }}>
                        {link_type != 'category' &&
                            <div className={global.tableListForm}>
                                <div style={{ position: 'relative' }}>
                                    <Search
                                        search_data={search_data}
                                        top={0}
                                        seaSubmit={(data1) => this.search(data1)}
                                        seaReset={(data2) => this.seaReset(data2)}
                                    />
                                </div>
                            </div>
                        }
                        <Scrollbars
                            autoHeight
                            autoHeightMin={50}
                            autoHeightMax={document.body.clientHeight - 300}
                        >
                            <Spin spinning={loading}>
                                {/*标准表格-start*/}
                                <StandardTable
                                    showScrollbar={false}
                                    expandedRowKeys={expandedRowKeys}
                                    selectedRows={['voucher', 'buytogether', 'consumerCoupon', 'signin'].includes(link_type) ? selectedRows : []}
                                    selectedRowKeys={['voucher', 'buytogether', 'consumerCoupon', 'signin'].includes(link_type) ? selectedRowKeys : []}
                                    data={data}
                                    rowKey={this.rowKey}
                                    isCheck={['consumerCoupon', 'buytogether', 'signin'].includes(link_type) || (link_type ==='voucher'&& ifMultiSelected) ? true : false}
                                    columns={columns}
                                    onSldHandleSeleRow={this.onSldHandleSeleRow}
                                    onSelectRow={this.handleSelectRows}
                                    flag_show_sele_data
                                    sldpagination={sldpagination}
                                    sel_type={['buytogether', 'signin'].includes(link_type) ? 'radio' : 'checkbox'}
                                    onExpand={this.onExpand}
                                    onChange={(pagination, filtersArg, sorter) => this.handleTablePagination(pagination, filtersArg, sorter, 'main')}
                                    resizeTable={(index, size) => this.resizeTable(index, size, 'columns', columns)}
                                    isColumnResize
                                />
                                {/*标准表格-end*/}
                            </Spin>
                        </Scrollbars>
                    </div>
                </div>
            </Modal>
        );
    }
}
