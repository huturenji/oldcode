
import { connect } from 'dva/index';
import React, { Component } from 'react';
import {
    Modal,Button,Spin
} from 'antd';
import { isNotEmpty,failTip } from '@/utils/utils';
import styles from './index.less';

@connect(({ order }) => ({
    order
}))
export default class VopModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            orderDetailResponse:{},
            supplierOrderResponse:{},
            loading:false
        };
    }

    componentDidMount() {
      
    }

    componentWillReceiveProps(nextProps) {
        const {supplierOrderSn,modalVisible} = nextProps
        if(isNotEmpty(supplierOrderSn)&&modalVisible){
            this.get_member_detail(supplierOrderSn)
        }
    }

    // 穿透
  get_member_detail =(supplierOrderSn)=>{
      const { dispatch } = this.props
      this.setState({
          loading:true
      })
      let param = {supplierOrderSn}
      dispatch({
          type:'order/penetrate',
          payload:param,
          callback:(res)=>{
              if(res.state == 200){
                  const {orderDetailResponse,supplierOrderResponse} = res.data
                  this.setState({
                      orderDetailResponse:orderDetailResponse||{},
                      supplierOrderResponse:supplierOrderResponse||{},
                      loading:false
                  })
              }else{
                  failTip(res.msg)
                  this.setState({
                      loading:false
                  })
              }
          }
      })
  };

    sldConfirm = ()=>{
        this.props.confirm()
    }

    sldCancle = ()=>{
        this.props.cancle();
    }

    showExpress = (orderNo)=>{
        this.props.showExpress({order:orderNo,type:'VOP'});
    }

    render() {
        const { modalVisible } = this.props;
        const { orderDetailResponse,orderDetailResponse:{subOrders},supplierOrderResponse,loading } = this.state;
        return (
            <Modal
                destroyOnClose
                onOk={this.sldConfirm}
                onCancel={this.sldCancle}
                visible={modalVisible}
                zIndex={500}
                width='600px'
                title='穿透'
                footer={[
                    <Button key="back" onClick={()=>this.sldConfirm()} type="primary">确定</Button>
                ]}
            >
                <Spin spinning={loading}>
                    <div className={`${styles.vop}`}>
                        <div>
                            <div className={`${styles.title}`}>VOP信息</div>
                            <div className={`${styles.info}`}>
                                <span className={`${styles.lable}`}>平台(父)订单号:</span>
                                <span className={`${styles.value}`}>{orderDetailResponse.orderNo}</span>
                                <span className={`${styles.lable}`}>订单状态:</span>
                                <span className={`${styles.value}`}>{orderDetailResponse.showState}</span>
                            </div>
                            {
                                subOrders && subOrders.map((item)=>(
                                    <div className={`${styles.info}`} key={item.subOrderNo}>
                                        <span className={`${styles.lable}`}>子订单号:</span>
                                        <span className={`${styles.value}`}>{item.subOrderNo}</span>
                                        <span className={`${styles.lable}`}>订单状态:</span>
                                        <span className={`${styles.value}`}>{item.showState}</span>
                                    </div>
                                ))
                            }
                        
                        </div>
                        <div>
                            <div className={`${styles.title}`}>
                            供应商信息
                                {
                                    subOrders && subOrders[0] && <span className={`${styles.flow}`} onClick={()=>this.showExpress(subOrders[0].subOrderNo)}>查看物流</span>
                                }
                            </div>
                            <div className={`${styles.info}`}>
                                <span className={`${styles.lable}`}>供应商订单号:</span>
                                <span className={`${styles.value}`}>{supplierOrderResponse.supplierOrderNo}</span>
                                <span className={`${styles.lable}`}>订单状态:</span>
                                <span className={`${styles.value}`}>{supplierOrderResponse.showState}</span>
                            </div>
                        </div>
                    </div>
                </Spin>
                
            </Modal>
        );
    }
}
