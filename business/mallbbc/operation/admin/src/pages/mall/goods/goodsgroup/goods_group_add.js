import { connect } from 'dva/index';
import React, { Component, Fragment } from 'react';
import { Form, Spin,Button,Popconfirm,Tabs,Upload,message } from 'antd';
import { Scrollbars } from 'react-custom-scrollbars';
import router from 'umi/router';
import XLSX from 'xlsx';
import {
    list_com_page_size_10,
    sldLlineRtextAddGoods,
    sldIconBtnBg,
    sldComLanguage,
    sldtbaleOpeBtnText,
    getSldListGoodsImg80,
    downLoad_front,
    failTip,
    sucTip,
    getAuthBtn,
    isRepeat,
    isNotEmpty,
    sldHandlePaginationData,
    sldPopConfirmDiy,
    isEmpty
} from '@/utils/utils';

import global from '@/global.less';
import styles from './css/product.less';

import SldSelMoreLeftRightGoods from '@/components/SldSelMoreLeftRightGoodsSku';
import StandardTable from '@/components/StandardTable';
import Search from '@/components/Search/Search';
import PoolModal from './poolModal';
import AuthBtn from '@/components/AuthBtn';


let btnAuth = getAuthBtn();
const { TabPane } = Tabs;

let pageSize = list_com_page_size_10;
@connect(({ goodsgroup }) => ({
    goodsgroup
}))
@Form.create()
export default class GoodsLabel extends Component {
    sele_more_goods = {
        info: [],//选择的商品数组
        ids: [],//选择的商品id数组
        min_num: 1,//最小数量，0为不限制
        max_num: 200//最多选择100个
    };
	
    constructor(props) {
        super(props);
        this.state = {
            initLoading: false, // 页面loading 
            modalVisibleGoods: false, // 选择商品弹窗
            poolModalVisible:false, //商品池管理弹出框
            sle_more_title: '选择商品(最少选择1个)',//选择商品的标题
            selectedRows: [],
            selectedRowKeys: [],//selectedRows的key
            search_data:[{
                type: 'input',
                label: `${sldComLanguage('商品sku')}`,
                name: 'sku',
                placeholder: `${sldComLanguage('请输入商品sku')}`
            }],
            pageParams: { pageSize: pageSize },// 分页条件
            formValues: {}, //搜索框条件
            columns: [
                // {
                //     title: '序号',
                //     dataIndex: 'index',
                //     align: 'center',
                //     width: 55
                // },
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
                    title: `${sldComLanguage('销售价')}`,
                    dataIndex: 'salePrice',
                    align: 'center',
                    width: 100
                },
                {
                    title: `${sldComLanguage('结算价')}`,
                    dataIndex: 'settlePrice',
                    align: 'center',
                    width: 100
                },
                {
                    title: `${sldComLanguage('参考价')}`,
                    dataIndex: 'supplierReferencePrice',
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
                        <AuthBtn eventKey={["delete_goods_group"]} btnAuth={btnAuth}>
                            <Fragment>
                                {sldPopConfirmDiy('leftBottom', `${sldComLanguage('删除后不可恢复，是否确定删除')}`, () => this.delSku(record.sku), `${sldComLanguage('确定')}`, `${sldComLanguage('取消')}`,
                                    sldtbaleOpeBtnText(`${sldComLanguage('删除')}`, () => null))}
                            </Fragment>
                        </AuthBtn>
                    )
                }
            ],
            viewcolumns: [
                // {
                //     title: '序号',
                //     dataIndex: 'index',
                //     align: 'center',
                //     width: 55
                // },
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
                    title: `${sldComLanguage('销售价')}`,
                    dataIndex: 'salePrice',
                    align: 'center',
                    width: 100
                },
                {
                    title: `${sldComLanguage('结算价')}`,
                    dataIndex: 'settlePrice',
                    align: 'center',
                    width: 100
                },
                {
                    title: `${sldComLanguage('参考价')}`,
                    dataIndex: 'supplierReferencePrice',
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
            title:'新增商品池',
            groupList:[], // 分组信息 
            curGroupId:'', // 当前的groupId
            uploading:false,
            data: {} //列表数据
        };
    }

    componentDidMount() {
        const {productPoolId,type} = this.props.location.query
        
        let title = '新增商品池'
        if(type=='edit'){
            title = '编辑商品池'
        }
        if(type=='view'){
            title = '查看'
        }
        this.setState({ type,productPoolId,title });

        // 新增情况下 新增了商品池后 productPoolId 绑定到URL上 避免刷新丢到
        if(type=='add'&&isEmpty(productPoolId)){
            this.setState({
                poolModalVisible:true
            })
        }
        // 获取分组信息
        if (isNotEmpty(productPoolId)) {
            this.getGroupList(productPoolId);
        } 
		
    }

	//根据商品池id查询分组信息
	getGroupList = (productPoolId) => {
	    this.setState({ initLoading: true });
	    const { dispatch } = this.props;
	    dispatch({
	        type: 'goodsgroup/productpool_getDetail',
	        payload: {productPoolId},
	        callback: (res) => {
	            this.setState({ initLoading: false });
	            if (res.state == 200) {
	                // eslint-disable-next-line no-shadow
	                const {productPoolName,productPoolId,groupResponses} = res.data
	                let curGroupId
	                if(isNotEmpty(groupResponses)){
	                    curGroupId = groupResponses[0].groupId
	                    // 默认获取第一组数据
	                    this.searchFormRef.props.form.resetFields()
	                    this.getGoodsList({pageSize,current:1,groupId:curGroupId})
	                }
	                this.setState({
	                    productPoolName,
	                    productPoolId,
	                    groupList:groupResponses,
	                    curGroupId,
	                    pageParams:{ pageSize,current:1 },
	                    formValues:{}
	                })
	            }else{
	                failTip(res.msg)
	            }
	        }
	    });
	};

	// 根据组id获取商品列表
	getGoodsList = (params) => {
	    if(isEmpty(params.groupId)){
	        failTip('请选择分组信息')
	        return 
	    }
	    this.setState({ initLoading: true });
	    const { dispatch } = this.props;
	    const { productPoolId } = this.state;
	    params.pageIndex = params.current||1;
	    params.productPoolId = productPoolId;
	    dispatch({
	        type: 'goodsgroup/productpool_getGoodsDetail',
	        payload: params,
	        callback: (res) => {
	            this.setState({ initLoading: false });
	            if (res.state == 200) {
	                if (res.data.list.length == 0 && params.current > 1) {
	                    params.current = params.current - 1;
	                    this.getGoodsList(params);
	                } else {
	                    this.setState({
	                        data: res.data
	                    });
	                }
	            }else{
	                failTip(res.msg)
	            }
	        }
	    });
	};

	// 根据组id获取商品列表
	addSkuList = (skuList) => {
	    this.setState({ initLoading: true });
	    const { dispatch } = this.props;
	    const {curGroupId} = this.state
	    if(isEmpty(curGroupId)){
	        failTip('分组信息不存在')
	        return
	    }
	    dispatch({
	        type: 'goodsgroup/productpool_addSku',
	        payload: {groupId:curGroupId,skuList},
	        callback: (res) => {
	            this.setState({ initLoading: false });
	            if (res.state == 200) {
	                const {coverSum} = res.data
	                sucTip(`${res.msg}${coverSum>0?`,${coverSum}条sku被覆盖`:''}`)
	                this.getGoodsList({ pageSize: pageSize,current:1,groupId:curGroupId});
	                this.setState({
	                    pageParams:{ pageSize,current:1 },
	                    formValues:{}
	                })
	            }else{
	                failTip(res.msg)
	            }
	        }
	    });
	};

	// 删除商品sku
	delSku = (sku) => {
	    this.setState({ initLoading: true });
	    const { dispatch } = this.props;
	    const {curGroupId,formValues} = this.state
	    dispatch({
	        type: 'goodsgroup/deleteSku',
	        payload: {groupId:curGroupId,sku},
	        callback: (res) => {
	            this.setState({ initLoading: false });
	            if (res.state == 200) {
	                this.getGoodsList({ pageSize: pageSize,current:1,groupId:curGroupId,...formValues});
	                this.setState({
	                    pageParams:{ pageSize,current:1 }
	                })
	            }
	        }
	    });
	};

	//搜索事件
	search = (data) => {
	    const { curGroupId } = this.state
	    const values = { ...data };
	    for(let i in values){
	        if(values[i] == ''){
	            delete values[i]
	        }
	    }
	    this.setState({
	        formValues: values,
	        pageParams: { pageSize: pageSize }
	    });
	    this.getGoodsList({ pageSize: pageSize,groupId:curGroupId, ...values });
	};
  
	//搜索重置事件
	seaReset = () => {
	    //搜索条件置为空
	    const { curGroupId } = this.state
	    this.setState({
	        formValues: {},
	        pageParams: { pageSize: pageSize }
	    });
	    this.getGoodsList({ pageSize: pageSize,groupId:curGroupId });
	};

	onRefSearch = (ref) => {
	    this.searchFormRef = ref;
	}

	handleTablePagination = (pagination, filtersArg, sorter, type = 'main') => {
	    const { formValues,curGroupId } = this.state;
	    if (type == 'main') {
	        const pageParams = sldHandlePaginationData(pagination, filtersArg, sorter, {});
	        pageSize = pageParams.pageSize;
	        this.setState({ pageParams });
	        this.getGoodsList({groupId:curGroupId,...pageParams,...formValues});
	    }
	};
	
	//打开商品弹窗
	showSeletGoods = () => {
	    this.setState({
	        modalVisibleGoods: true
	    });
	};

	//商品多选-回调事件
	seleGoods = (selectedRows, selectedRowKeys) => {
	    this.sele_more_goods.ids = [];
	    this.sele_more_goods.info = [];
	    this.setState({
	        selectedRows: selectedRowKeys,
	        selectedRowKeys: selectedRowKeys
	    });
	    this.sldHandleCancle();
	    this.addSkuList(selectedRowKeys);
	};
    
	//关闭商品弹窗
	sldHandleCancle = () => {
	    this.setState({
	        modalVisibleGoods: false
	    });
	};

	// 打开商品池
    showPool = ()=>{
        this.setState({
            poolModalVisible:true
        })
    }

    // 商品池管理 确认
    confirmPool = (productPoolId)=>{
        //避免刷新丢失数据，存在路由上
        router.replace(`/manage_product/goods_group_add?type=add&productPoolId=${productPoolId}`)
        this.getGroupList(productPoolId)
        this.setState({
            productPoolId,
            poolModalVisible:false
        })
    }

    // 商品池管理 取消
    canclePool = ()=>{
        this.setState({
            poolModalVisible:false
        })
    }
    
	// 切换分组
	changeGroup = (key)=>{
	    this.setState({
	        curGroupId:key
	    },()=>{
	        this.searchFormRef.props.form.resetFields() 
	        this.getGoodsList({groupId:key,pageSize: pageSize});
	    })
	}

	// start上传开始
	// 直接导模板
	downFile = () =>{
	    downLoad_front('1')
	}
	
	beforeUploadFun = (file,fileList)=>{
	    let that = this;
	    //限制上传文件的数量,只显示最近上传的1个文件，旧文件将被新的文件替换。
	    fileList = fileList.slice(-1);
	    const isExcle = file.name.split('.')[file.name.split('.').length-1] === 'xlsx';
	    if (!isExcle) {
	        message.error('请按模板上传xlsx文件!');
	        return false
	    }
	    const isLt10M = file.size / 1024 / 1024 < 10;
	    if (!isLt10M) {
	        message.error('上传文件需小于10MB!');
	        return false
	    }
	    var rABS = true;
	    const f = fileList[0];
	    var reader = new FileReader();
	    reader.onload = function(e){
	        var data = e.target.result;
	        if (!rABS) {data = new Uint8Array(data);}
	        var workbook = XLSX.read(data, {
	            type: rABS ? 'binary' : 'array'
	        });
	        // 假设我们的数据在第一个标签
	        var first_worksheet = workbook.Sheets[workbook.SheetNames[0]];
	        // XLSX自带了一个工具把导入的数据转成json
	        var jsonArr = XLSX.utils.sheet_to_json(first_worksheet, {header:1});
	        // 通过自定义的方法处理Json，比如加入state来展示
	        that.handleImpotedJson(jsonArr);
	    };
	    if (rABS) {reader.readAsBinaryString(f);} else {reader.readAsArrayBuffer(f);}
	    return false;
	}

	// eslint-disable-next-line react/sort-comp
	upProps = {
	    name: 'file', //发到后台的文件参数名
	    // action: `${serverUrl('/api/road/upload')}`,     // 传到后端的接口名,这里不传
	    headers: { Authorization: 'SID' }, // 
	    showUploadList: false,
	    beforeUpload: this.beforeUploadFun
	}

	handleImpotedJson = (jsonData)=>{
	    try {
	        if(!!jsonData.length && jsonData.length > 0){
	            // 整合商品详情的入参
	            let _skuList = [];
	            for(let index = 0; index < jsonData.length; index++) {
	                const ele = jsonData[index];
	                if(Array.isArray(ele)&&ele.length>0){
	                    if(index==0){
	                        if(ele[0]!='sku'){
	                            message.error('sku项错误,请按格式重新上传!');
	                            return false
	                        }
	                        if(ele[1]!='商品名称'){
	                            message.error('商品名称项错误,请按格式重新上传!');
	                            return false
	                        }
	                    }else{
	                        // sku
	                        if( ele[0] && (/^[A-Za-z0-9]+$/.test( ele[0] )) ){
	                            _skuList.push(ele[0])
	                        }else{
	                            message.error(`解析失败,请检查第${index+1}行sku数据`,5);
	                            return false;
	                        }
	                       
	                    }
	                }
	            }
	            if(_skuList.length==0){
	                message.error(`请导入数据!`);
	                return false
	            }
  
	            if(_skuList.length>10000){
	                message.error(`最多支持导入10000条数据`);
	                return false
	            }
	            if(isRepeat(_skuList)){
	                message.error(`sku数据项重复,请检查数据`);
	                return false
	            }
				
	            this.addSkuList(_skuList)
	        }else{
	            message.error('解析失败,请按格式上传!');
	        }
		
	    } catch (error) {
	        message.error('解析失败,请按格式上传!');
	    }
	}
	// end 上传结束

	editPool = () => {
	    const { productPoolId } = this.state;
	    router.replace(`/manage_product/goods_group_add?productPoolId=${productPoolId}&type=edit`);
	    this.setState({
	        type:'edit',
	        title:'编辑商品池'
	    })
	};

	delete = (productPoolId) => {
	    const { dispatch } = this.props;
	    dispatch({
	        type: 'goodsgroup/delete_productpool',
	        payload:{productPoolId} ,
	        callback: (res) => {
	            if (res.state == 200) {
	                setTimeout(()=>{
	                    router.push(`/manage_product/goods_group`);
	                },60)
	            }else{
	                failTip(res.msg)
	            }
	        }
	    });
	};


	render() {
	    const { columns,viewcolumns, initLoading,modalVisibleGoods,sle_more_title,type,
	        productPoolId,productPoolName,title,poolModalVisible,groupList,uploading,search_data,data,curGroupId } = this.state;
	    return (
	        <div className={global.common_page} style={{ flex: 1 }}>
	            <div className={global.flex_com_space_between}>
	                {sldLlineRtextAddGoods('#FA6F1E', `${sldComLanguage(title)}`)}
	                {sldIconBtnBg(() => this.props.history.goBack(), 'fanhui', `${sldComLanguage('返回上级页面')}`, '#fff', 7, 0, 15, 15, 5)}
	            </div>
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
	            <div className={`${styles['group_manage']}`}>
	                <div className={`${styles['group_tab']}`}>
	                    <Tabs activeKey={`${curGroupId}`} onChange={this.changeGroup}>
	                        {
	                            groupList.map((item)=><TabPane tab={`${item.groupName}`} key={item.groupId} />)
	                        }
	                    </Tabs>
	            	</div>
	                <AuthBtn eventKey={["add_goods_group","edit_goods_group"]} btnAuth={btnAuth}>
	                    <div className={`${styles['manage_btn']}`} onClick={()=>this.showPool()}>
							商品池管理
	                	</div>
	                </AuthBtn>
	            </div>
	            <div className={`${styles['search']}`}>
	                <div className={`${styles['addgoods']}`}>
	                    <AuthBtn eventKey={["add_goods_group","edit_goods_group"]} btnAuth={btnAuth}>
	                        {
	                            (type == 'add'||type == 'edit') && 
								<Fragment>
								    <Button onClick={() => this.showSeletGoods()} type='primary'>添加商品</Button>
								    <Button onClick={()=>{this.downFile()}} style={{marginRight:'10px',marginLeft:'20px'}}>下载模板</Button>
								    <Upload {...this.upProps} disabled={uploading} style={{marginRight:'10px'}}>
								        <Button loading={uploading}>批量导入</Button>
								    </Upload>
	                    		</Fragment>
	                        }
	                    </AuthBtn>
	                </div>
	                <div className={global.tableListForm}>
	                    <Search
	                        search_data={search_data}
	                        seaSubmit={(datas) => this.search(datas)}
	                        seaReset={() => this.seaReset()}
	                        onRef={this.onRefSearch}
	                    />
	                </div>
	            </div>
	            <Spin spinning={initLoading}>
	                <Scrollbars
	                    autoHeight
	                    autoHeightMax={document.body.clientHeight - 250}
	                >
	                    <StandardTable
	                        bordered={false}
	                        selectedRows={[]}
	                        data={data}
	                        rowKey="sku"
	                        isCheck={false}
	                        columns={type=='view'?viewcolumns:columns}
	                        onSelectRow={()=>{}}
	                        onChange={(pagination, filtersArg, sorter) => this.handleTablePagination(pagination, filtersArg, sorter, 'main')}
	                        resizeTable={() => {}}
	                        isColumnResize
	                        showScrollbar={false}
	                    />

	                    {
	                (type=='view') &&
					<div style={{marginTop:'10px',display:'flex',justifyContent:'center'}}>
	                        <AuthBtn eventKey={["edit_goods_group"]} btnAuth={btnAuth}> 
	                		<Button onClick={() => this.editPool(productPoolId,'edit')} style={{marginRight:'5px'}}>编辑</Button>
	                        </AuthBtn>
	                        <AuthBtn eventKey={["delete_goods_group"]} btnAuth={btnAuth}> 
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
	                </Scrollbars>		

	            </Spin>
	            
	           
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
	                showUpload={false}
	            />

				 {/*商品池管理modal框*/}
				 <PoolModal
	                modalVisible={poolModalVisible}
	                productPoolId={productPoolId}
	                cancle={this.canclePool}
	                confirm={this.confirmPool}
				 />
	        </div>
	    );
	}
}
