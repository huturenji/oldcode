
import { connect } from 'dva/index';
import React, { Component } from 'react';
import {
    Modal,Avatar,Button,Spin
} from 'antd';
import { isNotEmpty,failTip } from '@/utils/utils';
import styles from './index.less';

@connect(({ order }) => ({
    order
}))
export default class MemberInfoModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading:false,
            member_detail:{}
        };
    }

    componentDidMount() {
      
    }

    componentWillReceiveProps(nextProps) {
        const {memberId,modalVisible} = nextProps
        if(isNotEmpty(memberId)&&modalVisible){
            this.get_member_detail(memberId)
        }
    }

    // 会员详情
  get_member_detail =(memberId)=>{
      const { dispatch } = this.props
      this.setState({
          loading:true
      })
      let param = {memberId}
      dispatch({
          type:'order/get_member_detail',
          payload:param,
          callback:(res)=>{
              if(res.state == 200){
                  this.setState({
                      member_detail:res.data,
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

    render() {
        const { modalVisible } = this.props;
        const { member_detail,loading } = this.state;
        return (
            <Modal
                destroyOnClose
                onOk={this.sldConfirm}
                onCancel={this.sldCancle}
                visible={modalVisible}
                width='400px'
                title='会员信息'
                footer={[
                    <Button key="back" onClick={()=>this.sldConfirm()} type="primary">确定</Button>
                ]}
            >
                <Spin spinning={loading}>
                    <div className={`${styles.member}`}>
                        <Avatar src={member_detail.memberAvatar} size="large" />
                        <div className={`${styles.info}`}>
                            <div className={`${styles.item}`}>
                                <span className={`${styles.lable}`}>会员名</span>
                                <span className={`${styles.right}`}>{member_detail.memberName}</span>
                            </div>
                            <div className={`${styles.item}`}>
                                <span className={`${styles.lable}`}>真实姓名</span>
                                <span className={`${styles.right}`}>{member_detail.memberTrueName||'--'}</span>
                            </div>
                            <div className={`${styles.item}`}>
                                <span className={`${styles.lable}`}>手机号</span>
                                <span className={`${styles.right}`}>{member_detail.memberMobile}</span>
                            </div>
                            <div className={`${styles.item}`}>
                                <span className={`${styles.lable}`}>昵称</span>
                                <span className={`${styles.right}`}>{member_detail.memberNickName}</span>
                            </div>
                            <div className={`${styles.item}`}>
                                <span className={`${styles.lable}`}>性别</span>
                                <span className={`${styles.right}`}>{member_detail.genderValue}</span>
                            </div>
                            <div className={`${styles.item}`}>
                                <span className={`${styles.lable}`}>生日</span>
                                <span className={`${styles.right}`}>{member_detail.memberBirthday||'--'}</span>
                            </div>
                        </div>
                    </div>
                </Spin>
            </Modal>
        );
    }
}
