
import React, { Component } from 'react';
import {
    Modal
} from 'antd';
import {day_hour} from '@/utils/util_data';
import global from '@/global.less';
import styles from './reviewModal.less';

import ReviewButton from '@/components/Review';

export default class reView extends Component {

    constructor(props) {
        super(props);
        this.state = {
           
        };
    }

    componentDidMount() {
       
    }

    componentWillReceiveProps() {
        
    }

    componentWillUnmount() {
    
    }

    refuseEvent = (reason)=>{
        this.props.refuseEvent(reason)
    }

    successEvent = ()=>{
        this.props.successEvent()
    }
    
    cancle = ()=>{
        this.props.cancle()
    }

    render() {
        const { modalVisible,record } = this.props;
        return (
            <Modal
                destroyOnClose
                onOk={this.sldConfirm}
                onCancel={this.cancle}
                visible={modalVisible}
                width='600px'
                title='审核'
                footer={
                    <ReviewButton 
                        refuseText='审核拒绝'
                        refuseTitle='确定拒绝该条活动么?'
                        refuseEvent={this.refuseEvent}
                        successText='审核通过'
                        successTitle='确定通过该条活动么?'
                        successEvent={this.successEvent}
                    />}
            >
                <div className={`${styles.container}`}>
                    <div className={`${styles.item}`}>
                        <div className={`${styles.lable}`}>
                            <span className={`${styles.attention}`}>*</span>专场名称 :
                        </div>
                        <div className={`${styles.content}`}>
                            {record.promotionName}
                        </div>
                    </div>
                    <div className={`${styles.item}`}>
                        <div className={`${styles.lable}`}>
                            <span className={`${styles.attention}`}>*</span>专场日期 :
                        </div>
                        <div className={`${styles.content}`}>
                            {record.promotionTime}
                        </div>
                    </div>
                    <div className={`${styles.item}`}>
                        <div className={`${styles.lable}`}>
                            <span className={`${styles.attention}`}>*</span>活动开始时间 :
                        </div>
                        <div className={`${styles.content}`}>
                            {record.promotionStartTime}
                        </div>
                    </div>
                    <div className={`${styles.item}`}>
                        <div className={`${styles.lable}`}>
                            <span className={`${styles.attention}`}>*</span>title图片 :
                        </div>
                        <div className={`${styles.content}`} style={{ width: '100px', height: '100px' }}>
                            <img className={global.show_img} src={record.titleUrl} />
                        </div>
                    </div>
                    <div className={`${styles.item}`}>
                        <div className={`${styles.lable}`}>
                            <span className={`${styles.attention}`}>*</span>banner图片 :
                        </div>
                        <div className={`${styles.content}`} style={{ width: '100px', height: '100px' }}>
                            <img className={global.show_img} src={record.bannerUrl} />
                        </div>
                    </div>
                    <div className={`${styles.item}`}>
                        <div className={`${styles.lable}`}>
                            <span className={`${styles.attention}`}>*</span>是否展示banner :
                        </div>
                        <div className={`${styles.content}`}>
                            {record.isShowBanner ? "显示":"不显示"}
                        </div>
                    </div>
                </div>
            </Modal>
        );
    }
}
