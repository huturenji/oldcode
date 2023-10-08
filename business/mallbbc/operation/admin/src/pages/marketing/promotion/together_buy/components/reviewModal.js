
import React, { Component } from 'react';
import {
    Modal
} from 'antd';
import moment from 'moment';
import {day_hour} from '@/utils/util_data';
import {dateFormat} from '@/utils/utils';
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
                            <span className={`${styles.attention}`}>*</span>活动名称 :
                        </div>
                        <div className={`${styles.content}`}>
                            {record.promotionName}
                        </div>
                    </div>
                    <div className={`${styles.item}`}>
                        <div className={`${styles.lable}`}>
                            <span className={`${styles.attention}`}>*</span>活动日期 :
                        </div>
                        <div className={`${styles.content}`}>
                            {`${moment(record.startTime).format(dateFormat)}~${moment(record.endTime).format(dateFormat)}`}
                        </div>
                    </div>
                    <div className={`${styles.item}`}>
                        <div className={`${styles.lable}`}>
                            <span className={`${styles.attention}`}>*</span>活动场次 :
                        </div>
                        <div className={`${styles.content}`}>
                            <div className={`${global.flex_row_start_start} ${styles.seckill_time_wrap}`} style={{flexWrap:'wrap'}}>
                                {day_hour().map((item,index1)=>(
                                    <div 
                                        className={`${styles.seckill_time_item} ${global.flex_row_center_center}`} 
                                        style={{borderTopWidth:index1<8?1:0,background:(record.stageHourTimeList && record.stageHourTimeList.indexOf(item)>-1)?'#FF7F40':'#fff',color:'#333',fontWeight:'500'}}
                                    >
                                        {item}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className={`${styles.item}`}>
                        <div className={`${styles.lable}`}>
                        <span className={`${styles.attention}`}>*</span>场次时长 :
                        </div>
                        <div className={`${styles.content}`}>
                            {`${record.duration}小时`}
                        </div>
                    </div>                    
                </div>
            </Modal>
        );
    }
}
