
import { connect } from 'dva/index';
import React, { Component } from 'react';
import {
    Modal,Table, Spin
} from 'antd';
import { Scrollbars } from 'react-custom-scrollbars';
import { sldLlineRtextAddGoodsAddMargin,failTip } from '@/utils/utils';
import _style from '../css/index.less';

@connect(({ sign_manage }) => ({
    sign_manage
}))
export default class ViewModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading:false,
            detail:{signRecordDetails:[]},
            columns: [
                {
                    title: '签到时间',
                    dataIndex: 'signRealTime',
                    align: 'center',
                    width: '20%'
                },
                {
                    title: '签到日期',
                    dataIndex: 'signDate',
                    align: 'center',
                    width: '20%'
                },
                {
                    title: '奖励内容',
                    dataIndex: 'prizeDetail',
                    align: 'center',
                    render: (text) => (
                        <div style={{whiteSpace:'pre-line'}}>
                            {text||'--'}
                        </div>
                    )
                },
                {
                    title: '奖励发放时间',
                    dataIndex: 'prizeTime',
                    align: 'center',
                    width: '20%'
                },
                {
                    title: '连续签到次数',
                    dataIndex: 'continueNum',
                    align: 'center',
                    width: '10%'
                },
                {
                    title: '累计签到次数',
                    dataIndex: 'signCount',
                    align: 'center',
                    width: '10%'
                }
            ]
        };
    }

    componentDidMount() {
        this.get_detail()
    }

    componentWillReceiveProps() {
        
    }

    get_detail = () => {
        const { dispatch , record,signActivityId } = this.props;
        const {memberId,companyId} = record
        this.setState({ loading: true });
        dispatch({
            type: 'sign_manage/getStatisticsDetail',
            payload: { signActivityId, memberId, companyId },
            callback: (res) => {
                this.setState({ loading: false });
                if (res.state == 200) {
                    this.setState({
                        detail:res.data
                    })
                }else{
                    failTip(res.msg)
                }
            }
        });
    };

    sldCancle = ()=>{
        this.props.cancle();
    }

    render() {
        const { modalVisible } = this.props;
        const { detail,columns,loading } = this.state;
    
        return (
            <Modal
                destroyOnClose
                visible={modalVisible}
                onCancel={this.sldCancle}
                footer={null}
                width='68%'
                title='详情'
                maskClosable={false}
            >
                <Spin spinning={loading}>
                    <div className={`${_style['user_sign']}`}>
                       
                        {sldLlineRtextAddGoodsAddMargin('#FA6F1E', `用户信息`, 0, 0, 10)}
                        <div className={`${_style['user_info']}`}>
                            <div className={`${_style['info_item']}`}><span>会员名：</span><span className={`${_style['scan_item']}`} data-content={`${detail.memberName}`}>{detail.memberName}</span></div>
                            <div className={`${_style['info_item']}`}><span>手机号：</span><span className={`${_style['scan_item']}`} data-content={`${detail.memberMobile}`}>{detail.memberMobile}</span></div>
                            <div className={`${_style['info_item']}`}><span>会员昵称：</span><span className={`${_style['scan_item']}`} data-content={`${detail.memberNickName}`}>{detail.memberNickName}</span></div>
                        </div>
                        {sldLlineRtextAddGoodsAddMargin('#FA6F1E', `签到明细`, 0, 0, 10)}
                        <div>
                            <Table
                                size="middle"
                                className='move-table'
                                columns={columns}
                                rowKey="signRealTime"
                                pagination={false}
                                scroll={{ y: 360 }}
                                dataSource={detail.signRecordDetails||[]}
                            />
                        </div>
                       
                    </div>
                </Spin>
            </Modal>
        );
    }
}
