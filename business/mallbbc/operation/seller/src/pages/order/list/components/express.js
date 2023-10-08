
import { connect } from 'dva/index';
import React, { Component } from 'react';
import {
    Modal
} from 'antd';

import { isNotEmpty,failTip,formItemLayoutModal } from '@/utils/utils';
import SldModal from '@/components/SldModal/SldModal';
import styles from './index.less';

const { info } = Modal;
@connect(({ order }) => ({
    order
}))
export default class Express extends Component {

    constructor(props) {
        super(props);
        this.state = {
            operateData:[],
            showLoading:false
        };
    }

    componentDidMount() {
      
    }

    componentWillReceiveProps(nextProps) {
        const {expressParam:{order,type},modalVisible} = nextProps
        if(isNotEmpty(order)&&modalVisible){
            this.get_flow(order,type)
        }
    }

    get_flow = (orderSn,type) => {
        const { dispatch } = this.props;
        let { operateData, order_detail } = this.state;
        order_detail = {}
        if(type=='BBC'){
            if(order_detail.deliverType == 1){
                //无需物流
                info({
                    width: 470,
                    title: '该订单是自行配送，您可以联系配送人了解具体进度',
                    content: <div>
                        <p>配送人姓名：{order_detail.deliverName}</p>
                        <p>配送人手机号：{order_detail.deliverMobile}</p>
                    </div>
                });
            }else{
               
            }
            this.setState({
                showLoading:true
            })
            dispatch({
                type: 'order/get_flow',
                payload: { orderSn },
                callback: res => {
                    this.setState({
                        showLoading:false
                    })
                    if (res.state == 200) {
                        if(res.data.traces.length==0){
                            res.data.traces[0] = {
                                tracesResult:{
                                    expressName: "",
                                    expressNumber: "",
                                    routeList:[],
                                    type:'0'
                                }
                            }
                        }
                        // 数组形式 取第一项
                        const [{tracesResult}] = res.data.traces

                        // 无需物流
                        if(tracesResult.type==1){
                            //无需物流
                            info({
                                width: 470,
                                title: '该订单是自行配送，您可以联系配送人了解具体进度',
                                content: <div>
                                    <p>配送人姓名：{tracesResult.expressName}</p>
                                    <p>配送人手机号：{tracesResult.expressNumber}</p>
                                </div>
                            });
                        }else{
                            operateData.push({
                                type: 'show_express',
                                content: tracesResult
                            });
                            this.setState({
                                operateData: operateData
                            });
                        }
                    } else {
                        failTip(res.msg);
                    }
                }
            });
        }else if(type=='VOP'){
            dispatch({
                type: 'order/getTraceBySupplierOrderSn',
                payload: { supplierOrderSn:orderSn },
                callback: res => {
                    if (res.state == 200) {
                        if(res.data.wayBills){
                            const [expressInfo] = res.data.wayBills
                            const {carrier,logisticsTracks} = expressInfo
                            let routeList = logisticsTracks.reverse().map((item)=>{
                                const {content,msgTime,operator} = item
                                return {acceptStation:`${content} ${operator}`,acceptTime:msgTime}
                            })
                            let tracesResult = {
                                expressName:carrier,
                                routeList
                            }
                            operateData.push({
                                type: 'show_express',
                                content: tracesResult
                            });
                            this.setState({
                                operateData: operateData
                            });
                        }
                    } else {
                        failTip(res.msg);
                    }
                }
            });

        }
        
  
    };

    sldHandleCancle = ()=>{
        this.props.cancle();
        this.setState({
            operateData: []
        });
    }

    render() {
        const { modalVisible } = this.props;
        const { operateData,showLoading } = this.state;
        return (
            <SldModal
                title='物流信息'
                submiting={false}
                show_foot={false}
                width={700}
                autoHeightMin={300}
                modalVisible={modalVisible}
                sldHandleConfirm={()=>null}
                sldHandleCancle={this.sldHandleCancle}
                formItemLayoutModal={formItemLayoutModal}
                content={operateData}
                showLoading={showLoading}
            />
        )
    }
}
