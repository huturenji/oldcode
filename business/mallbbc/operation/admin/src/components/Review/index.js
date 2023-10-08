/*
* 审核按钮组件
* */
import React, { Component } from 'react';
import {
    Modal,Button,Input
} from 'antd';
import {
    isEmpty,failTip 
} from '@/utils/utils';
import styles from './index.less';

const { confirm } = Modal;
const { TextArea } = Input;
export default class ReviewButton extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            reason:''
        };
    }


    componentDidMount() {
       
    }

    componentWillReceiveProps() {
        
    }

    refuse = ()=>{
    
        const {refuseTitle,refuseEvent } = this.props;
        let that = this
        confirm({
            centered: true,
            title: refuseTitle,
            content: <TextArea autosize={{ minRows: 4, maxRows: 6 }} onChange={this.inputChange} placeholder="请输入拒绝原因" maxLength={200} />,
            cancelText:'取消',
	        okText:'确定',
            className:`${styles.p20}`,
            onOk(destroy) {
                setTimeout(()=>{
                    const { reason } = that.state;
                    if(isEmpty(reason)){
                        failTip('请填写拒绝原因')
                    }else{
                        refuseEvent && refuseEvent(reason)
                        destroy()
                    }
                },500)
            },
            onCancel() {
                that.setState({
                    reason: ''
                });
               
            }
        });
    }

    success = ()=>{
        
        const {successTitle,successEvent } = this.props;
        confirm({
            centered: true,
            title: successTitle,
            content: '',
            cancelText:'取消',
	        okText:'确定',
            className:`${styles.p20}`,
            onOk() {
                successEvent && successEvent()
            },
            onCancel() {
                
            }
        });
    }

    inputChange = ({ target: { value } }) => {
        this.setState({
            reason:value
        })
    };

    render() {
        const {refuseText,successText,onlyrightshow } = this.props;
        return (
            <div className={`${styles.content}`}>
                {(!onlyrightshow) && <Button className={`${styles.refuse}`} onClick={this.refuse}>{refuseText||'审核拒绝'}</Button>}
                <Button className={`${styles.success}`} onClick={this.success} type='primary'>{successText}</Button>
            </div>

        );
    }
}
