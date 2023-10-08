import { connect } from 'dva/index';
import React, { Component, Fragment } from 'react';
import { Form, Spin,Button,Input,Table,Row, Col } from 'antd';
import { Scrollbars } from 'react-custom-scrollbars';
import router from 'umi/router';
import {
    list_com_page_size_10,
    sldLlineRtextAddGoods,
    sldIconBtnBg,
    sldComLanguage,
    sldtbaleOpeBtnText,
    getSldListGoodsImg80,
    withIndex,
    failTip,
    trimBlank,
    isEmpty,
    sucTip
} from '@/utils/utils';

import global from '@/global.less';
import styles from './css/index.less';
import _styles from '@/assets/css/promotion.less';

import SelectGoodsPool from '@/components/selectGoodsPool';

const FormItem = Form.Item;

let pageSize = list_com_page_size_10;
@connect(({ exchange }) => ({
    exchange
}))
@Form.create()
export default class GoodsLabel extends Component {
    sele_more_goods = {
        info: [],//选择的商品数组
        ids: [],//选择的商品id数组
        min_num: 1,//最小数量，0为不限制
        max_num: 100//最多选择100个
    };
	
    constructor(props) {
        super(props);
        this.state = {
            initLoading: false,
            modalVisibleGoods: false,
            sle_more_title: '选择要生成兑换券的商品(最少选择1个)',//选择商品的标题
            selectedRows: [],
            selectedRowKeys: [],//selectedRows的key
            columns: [
                {
                    title: '序号',
                    dataIndex: 'index',
                    align: 'center',
                    width: 55
                },
                {
                    title: `${sldComLanguage('SKU')}`,
                    dataIndex: 'sku',
                    align: 'center',
                    width: 100
                },
                {
                    title: `${sldComLanguage('商品信息')}`,
                    dataIndex: 'skuName',
                    align: 'center',
                    width: 150,
                    render:(text, record) => (
                        <div className={`${styles.goods_info} ${global.com_flex_row_flex_start}`}>
                            <div className={styles.goods_img}>{getSldListGoodsImg80(record.mainImage)}</div>
                            <div className={`${global.com_flex_column_space_between} ${styles.goods_detail}`}>
                                <span className={styles.goods_name}>
                                    {record.skuName}
                                </span>
                            </div>
                        </div>
                    )
					
                },
                {
                    title: `${sldComLanguage('所属店铺')}`,
                    dataIndex: 'storeName',
                    align: 'center',
                    width: 100
                },
                {
                    title: `${sldComLanguage('商品价格(¥)')}`,
                    dataIndex: 'salePrice',
                    align: 'center',
                    width: 100
                },
                {
                    title: `${sldComLanguage('数量')}`,
                    dataIndex: 'num',
                    align: 'center',
                    width: 100
                },
                {
                    title: `${sldComLanguage('操作')}`,
                    align: 'center',
                    width: 100,
                    render: (text, record) => (
                        <Fragment>
                            {this.state.publishType==1?'删除':sldtbaleOpeBtnText(`${sldComLanguage('删除')}`, () => this.deletes(record.sku))}
                        </Fragment>
                    )
                }
            ],
            voucherName:'', // 兑换券名称
            orderSn:'', // 兑换券订单号
            type:'add', // add  edit  view
            title:'新增兑换券',
            publishType:'' // 1 订单导入 2 excle 3 sku搜索
        };
    }

    componentDidMount() {
        const {voucherId,orderSn,voucherName,publishType, type} = this.props.location.query
        let title = '新增兑换券'
        if(type=='edit'){
            title = '编辑兑换券'
        }else if(type=='view'){
            title = '查看'
        }
        this.setState({ voucherId,orderSn,voucherName,publishType,type,title },()=>{
            if (voucherId != undefined) {
                // 编辑
                this.get_orderVoucher_productList({voucherId});
            }
        }); 
    }


	//获取数据列表 编辑反查
	get_orderVoucher_productList = (params) => {
	    this.setState({ initLoading: true });
	    const { dispatch } = this.props;
	    const {publishType,orderSn} = this.state
	    params.pageIndex = params.current||1;
	    params.pageSize = 1000
	    dispatch({
	        type: 'exchange/get_orderVoucher_productList',
	        payload: params,
	        callback: (res) => {
	            this.setState({ initLoading: false });
	            if (res.state == 200) {
	                let arrRows = [] 
	                let arrKeys = []
	                res.data.list.forEach((item)=>{
	                    const {sku,skuName,mainImage,storeName,salePrice,number} = item
	                    arrRows.push({
	                        sku,
	                        skuName,
	                        mainImage,
	                        storeName,
	                        salePrice,
	                        num:number
	                    })
	                    arrKeys.push(sku)
	                })

	                this.seleGoods(arrRows,arrKeys,orderSn,publishType)

	            }
	        }
	    });
	};

	//商品多选-回调事件
	seleGoods = (selectedRows, selectedRowKeys,orderSn,publishType) => {
	    this.sele_more_goods.ids = [...selectedRowKeys];
	    this.sele_more_goods.info = JSON.parse(JSON.stringify(selectedRows));
	    this.setState({
	        selectedRows: withIndex(selectedRows,{current:1,pageSize:selectedRows.length}),
	        selectedRowKeys: selectedRowKeys,
	        orderSn,
	        publishType
	    });
	    this.sldHandleCancle();
	};

	sldHandleCancle = () => {
	    this.setState({
	        modalVisibleGoods: false
	    });
	};

	selectGoods = () => {
	    this.setState({
	        modalVisibleGoods: true
	    });
	};

	deletes =(sku) => {
	    let { selectedRows, selectedRowKeys } = this.state;
	    selectedRows = selectedRows.filter(item => item.sku != sku);
	    selectedRowKeys = selectedRowKeys.filter(item => item != sku);
	    this.sele_more_goods.ids = [...selectedRowKeys];
	    this.sele_more_goods.info = JSON.parse(JSON.stringify(selectedRows));
	    this.setState({
	        selectedRows: selectedRows,
	        selectedRowKeys: selectedRowKeys
	    });
	};

	save=()=>{
	    const { dispatch } = this.props;
	    const { selectedRows,type,orderSn,publishType,voucherId } = this.state
	    this.props.form.validateFieldsAndScroll((err, values)=>{
	        if (!err) {
	            let voucherProductVOList = []
	            selectedRows.forEach((item)=>{
	                voucherProductVOList.push({
	                    "sku": item.sku,
	                    "number":item.num
	                })
	            })
	            if(voucherProductVOList.length==0){
	                failTip('请选择商品!')
	                return false
	            }
	            if(publishType==1&&isEmpty(orderSn)){
	                failTip('订单号必填!')
	                return false
	            }
	            const params = {
	                voucherName:values.voucherName,
	                orderSn:trimBlank(orderSn),
	                publishType:publishType,
	                voucherProductVOList

	            }
	            let dis_type = ''
	            if(type=='add'){
	                dis_type = 'exchange/get_orderVoucher_add'
	            }else{
	                dis_type = 'exchange/voucher_update'
	                params.voucherId = voucherId
	            }
	            dispatch({
	                type: dis_type,
	                payload: params,
	                callback: (res) => {
	                    if (res.state == 200) {
	                        sucTip(res.msg)
	                        setTimeout(()=>{
	                            router.push(`/marketing_promotion/exchange_coupon`);
	                        },60)	
	                    }else{
	                        failTip(res.msg)
	                    }
	                }
	            });
	        }
	    })
	    

	}


	render() {
	    const { selectedRows, columns, initLoading,modalVisibleGoods,sle_more_title,type,orderSn,voucherName,title,publishType } = this.state;
	    let {
	        form: { getFieldDecorator }
	    } = this.props;
	    return (
	        <div className={global.common_page} style={{ flex: 1 }}>
	            <div className={global.flex_com_space_between}>
	                {sldLlineRtextAddGoods('#FA6F1E', `${sldComLanguage(title)}`)}
	                {sldIconBtnBg(() => this.props.history.goBack(), 'fanhui', `${sldComLanguage('返回上级页面')}`, '#fff', 7, 0, 15, 15, 5)}
	            </div>
	            {	(type == 'add'||type=='edit')?
	            <div style={{marginBottom:'10px'}}>
	                <Form layout="inline">
	                    <div className={`${_styles.item} ${global.flex_row_start_start}`} style={{alignItems:'center'}}>
	                        <div className={`${_styles.left} ${styles.text}`} style={{marginTop:'-6px',width:'120px'}}>
	                            <span style={{ color: 'red' }}>*</span>{sldComLanguage('兑换劵名称')}
	                        </div>
	                        <div className={`${_styles.right}`}>
	                            <FormItem
	                                style={{ width: 500 }}
	                            >
	                                {getFieldDecorator('voucherName', {
	                                    initialValue: voucherName?voucherName:'',
	                                    rules:[{
	                                        required: true,
	                                        whitespace: true,
	                                        message: `${sldComLanguage('请输入兑换劵名称')}`
	                                    }]
	                                })(
	                                    <Input maxLength={30} style={{ width: 400 }} placeholder={`${sldComLanguage('请输入兑换劵名称')}`} />
	                                )}
	                            </FormItem>
	                        </div>
	                    </div>

	                    <div className={`${_styles.item} ${global.flex_row_start_start}`} style={{alignItems:'center'}}>
	                        <div className={`${_styles.left} ${styles.text}`} style={{marginTop:'-6px',width:'120px'}}>
	                            <span style={{ color: 'red' }}>*</span>{sldComLanguage('商品添加')}
	                        </div>
	                        <div className={`${_styles.right}`}>
	                            <FormItem
	                                style={{ width: 500 }}
	                            >
	                                {getFieldDecorator('skus', {
	                                    initialValue: ''
	                                })(
	                                    <Button onClick={() => this.selectGoods()} disabled={type=='edit' && publishType==1}>添加商品</Button>
	                                )}
	                            </FormItem>
	                        </div>
	                    </div>
	                </Form>
	            </div>
	                :
	            <Row style={{marginBottom:'10px'}}>
	                    <Col span={2}>兑换券名称</Col>
	                    <Col span={22}>{voucherName}</Col>
	                    <Col span={2}>兑换券ID</Col>
	                    <Col span={22}>{orderSn}</Col>
					
	            </Row>
	            }
	            <Spin spinning={initLoading}>
	                <Scrollbars
	                    autoHeight
	                    autoHeightMax={document.body.clientHeight - 270}
	                >
	                    <Table
	                    rowKey="sku"
	                    pagination={{showSizeChanger:true}}
	                    columns={columns}
	                    dataSource={selectedRows}
	                    size="small"
	                    />
	                </Scrollbars>		
	                
	                {/*标准表格-end*/}

	            </Spin>
	            {
	                <div style={{marginTop:'10px',display:'flex',justifyContent:'center'}}>
	                    <Button onClick={() => this.save()} type='primary'>提交审核</Button>
	            	</div>
	            }
	           
	            {/*商品多选的modal框-start*/}
	            <SelectGoodsPool 
	                selectedRows={this.sele_more_goods.info}
	                selectedRowKeys={this.sele_more_goods.ids}
	                modalVisible={modalVisibleGoods} 
	                width={1000}
	                height={document.body.clientHeight - 400}
	                sldHandleSeleMoreModalCancle={this.sldHandleCancle} 
	                seleSvideo={this.seleGoods}
	                title={sle_more_title} 
	                extra={this.sele_more_goods}
	                publishType={publishType}
	                
	            />
	        </div>
	    );
	}
}
