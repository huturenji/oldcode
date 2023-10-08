import { connect } from 'dva/index';
import React, { Component } from 'react';
import { Form, Button, Spin,Modal } from 'antd';
import router from 'umi/router';
import { Scrollbars } from 'react-custom-scrollbars';
import {
    list_com_page_size_10,
    dragSldTableColumn,
    sldHandlePaginationData,
    sldLlineRtextAddGoodsAddMargin,
    getTableNum,
    sldComLanguage,
    getSldListGoodsImg80,
    sldIconBtnBg,
    failTip,
    sucTip,
    getAuthBtn
} from '@/utils/utils';
import global from '@/global.less';
import styles from './css/index.less';

import StandardTable from '@/components/StandardTable';
import ReviewButton from '@/components/Review';
import ReviewLog from '@/components/ReviewLog';
import AuthBtn from '@/components/AuthBtn';

const { confirm } = Modal;
let btnAuth = getAuthBtn();
let pageSize = list_com_page_size_10;
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
            columns: [
                {
                    title: '序号',
                    dataIndex: '',
                    align: 'center',
                    width: 25,
                    render: (text, record, index) => getTableNum(this.state.params, pageSize, index)
                },
                {
                    title: `${sldComLanguage('SKU')}`,
                    dataIndex: 'sku',
                    align: 'center',
                    width: 60
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
                    width: 80
                },
                {
                    title: `${sldComLanguage('商品价格(¥)')}`,
                    dataIndex: 'salePrice',
                    align: 'center',
                    width: 60
                },
                {
                    title: `${sldComLanguage('可兑换/已兑换/已失效/总量')}`,
                    dataIndex: 'voucherCode',
                    align: 'center',
                    width: 150,
                    render:(text, record) => {
                        const {notUsedNumber,usedNumber,invalidNumber,total} = record
                        return (
                            <div>
                                {`${notUsedNumber}/${usedNumber}/${invalidNumber}/${total}`}
                            </div>
                        )
                    }
                }
            ],
            orderSn:"",
            voucherName:"",
            isDisabled:true, // 默认不可点击
            voucherState:''
        };
    }

    componentDidMount() {
        const {voucherId,orderSn,voucherName,type} = this.props.location.query
        this.setState({
            voucherId,
            orderSn,
            voucherName,
            type
        },()=>{
            this.get_status()
	    	this.get_list({ pageSize: pageSize });
        })
        
    }


	//获取数据列表
	get_list = (params) => {
	    this.setState({ initLoading: true });
	    const { dispatch } = this.props;
	    const {voucherId} = this.state
	    params.pageIndex = params.current||1;
	    params.voucherId = voucherId
	    dispatch({
	        type: 'exchange/get_orderVoucher_productList',
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

	exportTxt = (orderSn) => {
	    const { dispatch } = this.props;
	    dispatch({
	        type: 'exchange/exportTxt',
	        payload: {orderSn,fileName:'兑换码'},
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

	exportTxt = () => {
	    const { dispatch } = this.props;
	    const {voucherId} = this.state
	    dispatch({
	        type: 'exchange/exportTxt',
	        payload: {voucherId,fileName:'凭证'},
	        callback: (res) => {
	            if(res.state!=undefined&&res.state == 89101001){
					
	            }
	        }
	    })
	};

	// 失效兑换劵
	voucherInvalid = () => {
	    const { dispatch } = this.props;
	    const { voucherId } = this.state;
	    dispatch({
	        type: 'exchange/voucher_invalid',
	        payload:{voucherId} ,
	        callback: (res) => {
	            if (res.state == 200) {
	                // setTimeout(()=>{
	                //     router.push(`/marketing_promotion/exchange_coupon`);
	                // },60)
	                sucTip(res.msg)
	                this.get_status()
	            }else{
	                failTip(res.msg)
	            }
	        }
	    });
	};

	// 获取订单状态，失效状态下 失效按钮不可点击  没有订单号的订单有bug 需要服务端提供接口来查询
	get_status = () => {
	    const { dispatch } = this.props;
	    const { voucherId } = this.state
	    let params = {
	        voucherId
	    }
	    dispatch({
	        type: 'exchange/voucher_detail',
	        payload: params,
	        callback: (res) => {
	            if (res.state == 200) {
	                const {state} = res.data
	                this.setState({
	                    isDisabled:(state==4||state==5||state==6)?true:false,
	                    voucherState:state
	                })
	            }
	        }
	    });
	};

	  showConfirm = () => {
	    let that = this
	    confirm({
	        title: '温馨提示',
	        content: '当前操作将导致未兑换的商品全部不可兑换',
	        cancelText:'取消',
	        okText:'知道了',
	        className:`${styles.p20}`,
	        onOk() {
	          that.showConfirm1()
			  console.log('OK');
	        },
	        onCancel() {
			  console.log('Cancel');
	        }
		  });
	  };

	  showConfirm1 = () => {
	      let that = this
	    confirm({
	        title: '该兑换券是否确认失效',
	        content: '',
	        cancelText:'取消',
	        okText:'确定',
	        className:`${styles.p20}`,
	        onOk() {
	          that.voucherInvalid()
			  console.log('OK');
	        },
	        onCancel() {
			  console.log('Cancel');
	        }
		  });
	  };

	refuseEvent = (remark)=>{
	    this.voucherApprove({passed:false,remark})
	}
  
	successEvent = ()=>{
	    this.voucherApprove({passed:true})
	}

	voucherApprove = (param)=>{
	    const { voucherId } = this.state;
	    const { dispatch } = this.props;
	    param.voucherId = voucherId
	    dispatch({
	        type: 'exchange/voucher_approve',
	        payload: param,
	        callback: (res) => {
	            if (res.state == 200) {
	                sucTip(res.msg);
	                setTimeout(() => {
	                    this.props.history.goBack();
	                }, 500);
	            } else {
	                failTip(res.msg);
	            }
	        }
	    });
	}


	  render() {
	    const { selectedRows, columns, initLoading, data,voucherName,orderSn,isDisabled,type,voucherState } = this.state;
	    return (
	        <div className={global.common_page} style={{ flex: 1 }}>
	            <div className={global.flex_com_space_between}>
	                {sldLlineRtextAddGoodsAddMargin('#FA6F1E', `${sldComLanguage('详情')}`, 0, 0, 10)}
	            	{sldIconBtnBg(() => this.props.history.goBack(), 'fanhui', `${sldComLanguage('返回上级页面')}`, '#fff', 7, 0, 15, 15, 5)}
	            </div>
	            <div style={{marginBottom:'10px'}}>
	                <div>
	                    <span style={{display:'inline-block',width:'100px',textAlign:'right',marginRight:'10px'}}>兑换券名称:</span>
	                    <span>{voucherName}</span>
	                </div>
	                <div>
	                    <span style={{display:'inline-block',width:'100px',textAlign:'right',marginRight:'10px'}}>兑换券订单号:</span>
	                    <span>{orderSn||'--'}</span>
	                </div>
	            </div>
	            <Scrollbars
	                autoHeight
	                autoHeightMin={100}
	                autoHeightMax={document.body.clientHeight - 200}
	            >
	            <Spin spinning={initLoading}>
	                {/*标准表格-start*/}
	                <StandardTable
	                    totalHeight="auto"
	                    selectedRows={selectedRows}
	                    data={data}
	                    rowKey="sku"
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
	            <ReviewLog type='project/voucher_listRecord' params={{voucherId :this.props.location.query.voucherId}} />
	            <div style={{marginTop:'10px',display:'flex',justifyContent:'center'}}>
	                <AuthBtn eventKey={['export_voucher_goods']} btnAuth={btnAuth}>
	                    {type == 'view' && <Button onClick={() => this.exportTxt()} style={{marginRight:'15px'}} disabled={voucherState!=1}>导出</Button>}
	                </AuthBtn>
	                <AuthBtn eventKey={['invalid_voucher']} btnAuth={btnAuth}>
	                    {type == 'view' && <Button disabled={isDisabled} onClick={this.showConfirm}>失效</Button>}
	                </AuthBtn>
	                
	                {
	                    type == 'audit' && 
						<ReviewButton 
	                      refuseText='审核拒绝'
	                      refuseTitle='确定拒绝该条兑换券么?'
	                      refuseEvent={this.refuseEvent}
	                      successText='审核通过'
	                      successTitle='确定通过该条兑换券么?'
	                      successEvent={this.successEvent}
						/>
	                }
	            </div>
	            </Scrollbars>
	        </div>
	    );
	  }
}
