import { connect } from 'dva/index';
import React, { Component, Fragment } from 'react';
import { Form, Spin,Button,Input,Table,Popconfirm } from 'antd';
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
    sucTip,
    getAuthBtn
} from '@/utils/utils';

import global from '@/global.less';
import styles from './css/product.less';
import promotion from '@/assets/css/promotion.less';

import SldSelMoreLeftRightGoods from '@/components/SldSelMoreLeftRightGoodsSku';
import AuthBtn from '@/components/AuthBtn';


let btnAuth = getAuthBtn();
const FormItem = Form.Item;

let pageSize = list_com_page_size_10;
@connect(({ pool }) => ({
    pool
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
            sle_more_title: '选择商品(最少选择1个)',//选择商品的标题
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
                    title: `${sldComLanguage('状态')}`,
                    dataIndex: 'state',
                    align: 'center',
                    width: 100,
                    render:(text) => (
                        <div>
                            {text==1?'可售':'不可售'}
                        </div>
                    )
                },
                {
                    title: `${sldComLanguage('操作')}`,
                    align: 'center',
                    dataIndex: 'operate',
                    width: 100,
                    render: (text, record) => (
                        <Fragment>
                            {/* {sldPopConfirmDiy('leftBottom', `${sldComLanguage('删除后不可恢复，是否确定删除')}`, () => this.delete(record.sku), `${sldComLanguage('确定')}`, `${sldComLanguage('取消')}`,
                                sldtbaleOpeBtnText(`${sldComLanguage('删除')}`, () => null))} */}
                            {sldtbaleOpeBtnText(`${sldComLanguage('删除')}`, () => this.deletes(record.sku))}
                        </Fragment>
                    )
                }
            ],
            viewcolumns: [
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
                    title: `${sldComLanguage('状态')}`,
                    dataIndex: 'state',
                    align: 'center',
                    width: 100,
                    render:(text) => (
                        <div>
                            {text==1?'可售':'不可售'}
                        </div>
                    )
                }
            ],
            productPoolName:'', // 商品池名称
            productPoolId:'', // 商品池id
            type:'add', // add  edit  view
            title:'新增商品池'
        };
    }

    componentDidMount() {
        const {productPoolId,type} = this.props.location.query
        if (productPoolId != undefined) {
            this.productpool_getDetail({productPoolId});
        }
        let title = '新增商品池'
        if(type=='edit'){
            title = '编辑商品池'
        }else if(type=='view'){
            title = '查看'
        }
        this.setState({ type,productPoolId,title }); 
		
    }


	//获取数据列表
	productpool_getDetail = (params) => {
	    this.setState({ initLoading: true });
	    const { dispatch } = this.props;
	    params.pageIndex = params.current||1;
	    params.pageSize = 200
	    dispatch({
	        type: 'pool/productpool_getDetail',
	        payload: params,
	        callback: (res) => {
	            this.setState({ initLoading: false });
	            if (res.state == 200) {
	                const {id,productPoolName,pages} = res.data
	                const {list} = pages
	                let selectedRowKeys = []
	                list.forEach((item)=>{
	                    selectedRowKeys.push(item.sku)
	                })
	                this.seleGoods(list,selectedRowKeys)
	                this.setState({
	                    productPoolName:productPoolName,
	                    productPoolId:id
	                })
	            }
	        }
	    });
	};

	//商品多选-回调事件
	seleGoods = (selectedRows, selectedRowKeys) => {
	    this.sele_more_goods.ids = [...selectedRowKeys];
	    this.sele_more_goods.info = JSON.parse(JSON.stringify(selectedRows));
	    this.setState({
	        selectedRows: withIndex(selectedRows,{current:1,pageSize:selectedRows.length}),
	        selectedRowKeys: selectedRowKeys
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

	changeName = (e)=>{
	    this.setState({
	        productPoolName: e
	    });
	}

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
	    const { selectedRows,type,productPoolId } = this.state
	    this.props.form.validateFieldsAndScroll((err, values)=>{
	        if (!err) {
	            let items = []
	            selectedRows.forEach((item)=>{
	                items.push({
	                    "mainImage": item.mainImage,
	                    "sku": item.sku,
	                    "skuName": item.skuName,
	                    "storeId": item.storeId
	                })
	            })
	            if(items.length==0){
	                failTip('请选择商品!')
	                return false
	            }
	            if(items.length>100){
	                failTip('最大选择100个商品!')
	                return false
	            }
	            const params = {
	                productPoolName:values.productPoolName,
	                items

	            }
	            let dis_type = ''
	            if(type=='add'){
	                dis_type = 'pool/productpool_add'
	            }else{
	                dis_type = 'pool/productpool_edit'
	                params.productPoolId = productPoolId
	            }
	            dispatch({
	                type: dis_type,
	                payload: params,
	                callback: (res) => {
	                    if (res.state == 200) {
	                        sucTip('保存成功')
	                        setTimeout(()=>{
	                            router.push(`/manage_product/goods_pool`);
	                        },60)	
	                    }else{
	                        failTip(res.msg)
	                    }
	                }
	            });
	        }
	    })
	    

	}

	edit = () => {
	    this.setState({
	        type:'edit'
	    })
	};

	delete = (productPoolId) => {
	    const { dispatch } = this.props;
	    dispatch({
	        type: 'pool/delete_productpool',
	        payload:{productPoolId:productPoolId} ,
	        callback: (res) => {
	            if (res.state == 200) {
	                setTimeout(()=>{
	                    router.push(`/manage_product/goods_pool`);
	                },60)
	            }
	        }
	    });
	};


	render() {
	    const { selectedRows, columns,viewcolumns, initLoading,modalVisibleGoods,sle_more_title,type,productPoolId,productPoolName,title } = this.state;
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
	                    <div className={`${promotion.item} ${global.flex_row_start_start}`} style={{alignItems:'center'}}>
	                        <div className={`${promotion.left}`} style={{marginTop:'-6px',width:'120px'}}>
	                            <span style={{ color: 'red' }}>*</span>{sldComLanguage('商品池名称')}
	                        </div>
	                        <div className={`${promotion.right}`}>
	                            <FormItem
	                                style={{ width: 500 }}
	                            >
	                                {getFieldDecorator('productPoolName', {
	                                    initialValue: productPoolName?productPoolName:'',
	                                    rules:[{
	                                        required: true,
	                                        whitespace: true,
	                                        message: `${sldComLanguage('请输入商品池名称')}`
	                                    }]
	                                })(
	                                    <Input maxLength={30} style={{ width: 400 }} placeholder={`${sldComLanguage('请输入商品池名称')}`} />
	                                )}
	                            </FormItem>
	                        </div>
	                    </div>
	                    <div className={`${promotion.item} ${global.flex_row_start_start}`} style={{alignItems:'center'}}>
	                        <div className={`${promotion.left}`} style={{marginTop:'-6px',width:'120px'}}>
	                            <span style={{ color: 'red' }}>*</span>{sldComLanguage('商品添加')}
	                        </div>
	                        <div className={`${promotion.right}`}>
	                            <FormItem
	                                style={{ width: 500 }}
	                            >
	                                {getFieldDecorator('skus', {
	                                    initialValue: ''
	                                })(
	                                    <Button onClick={() => this.selectGoods()} type='primary'>添加商品</Button>
	                                )}
	                            </FormItem>
	                        </div>
	                    </div>
	                </Form>
	            </div>
	                :
	                <div style={{marginBottom:'10px'}}>
	                    <div>
	                        <span style={{display:'inline-block',width:'80px'}}>商品池名称</span>
	                        <span>{productPoolName}</span>
	                    </div>
	                    <div>
	                        <span style={{display:'inline-block',width:'80px'}}>商品池ID</span>
	                        <span>{productPoolId}</span>
	                    </div>
	                </div>
	            }
	            <Spin spinning={initLoading}>
	                <Scrollbars
	                    autoHeight
	                    autoHeightMax={document.body.clientHeight - 250}
	                >
	                    <Table
	                    rowKey="sku"
	                    pagination={{showSizeChanger:true}}
	                    columns={type=='view'?viewcolumns:columns}
	                    dataSource={selectedRows}
	                    size="small"
	                    />
	                </Scrollbars>		
	                
	                {/*标准表格-end*/}

	            </Spin>
	            {
	                (type=='add'||type=='edit')?
	                <div style={{marginTop:'10px'}}>
	                	<Button onClick={() => this.save()} style={{marginLeft:'50%',transform: 'translateX(-50%)'}} type='primary'>保存</Button>
	            	</div>
	                    :
	                <div style={{marginTop:'10px',display:'flex',justifyContent:'center'}}>
	                        <AuthBtn eventKey={["edit_goods_pool"]} btnAuth={btnAuth}> 
	                		<Button onClick={() => this.edit(productPoolId,'edit')} style={{marginRight:'5px'}}>编辑</Button>
	                        </AuthBtn>
	                        <AuthBtn eventKey={["delete_goods_pool"]} btnAuth={btnAuth}> 
	                        <Popconfirm
	                            title="确定删除?"
	                            onConfirm={()=>this.delete(productPoolId)}
	                            onCancel={()=>{}}
	                            okText="确定"
	                            cancelText="取消"
	                        >
	                            <Button>删除</Button>
	                        </Popconfirm>
	                        </AuthBtn>
	                	
	            	</div>
	            }
	           
	            {/*商品多选的modal框-start*/}
	            <SldSelMoreLeftRightGoods 
	                selectedRows={this.sele_more_goods.info}
	                selectedRowKeys={this.sele_more_goods.ids}
	                modalVisible={modalVisibleGoods} 
	                width={1000}
	                height={document.body.clientHeight - 400}
	                sldHandleSeleMoreModalCancle={this.sldHandleCancle} 
	                seleSvideo={this.seleGoods}
	                title={sle_more_title} 
	                extra={this.sele_more_goods}
	            />
	        </div>
	    );
	}
}
