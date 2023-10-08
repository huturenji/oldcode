
import { connect } from 'dva/index';
import React, { Component } from 'react';
import {
    Modal,Radio,Input 
} from 'antd';
import { isEmpty,failTip } from '@/utils/utils';
import styles from './index.less';

const { TextArea } = Input;

@connect(({ order }) => ({
    order
}))
export default class MarkModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            state:'',
            content:''
        };
    }

    componentDidMount() {
      
    }

    onChange =(e)=>{
        this.setState({
            state:e.target.value
        })
    }

    inputChange = ({ target: { value } })=>{
        this.setState({
            content:value
        })
    }

    sldConfirm = ()=>{
        const { state,content } = this.state
        if(isEmpty(state)){
            failTip('请选择数据')
            return false
        }
        this.props.confirm(state,content)
    }

    sldCancle = ()=>{
        this.props.cancle();
    }

    render() {
        const { modalVisible } = this.props;
        return (
            <Modal
                destroyOnClose
                onOk={this.sldConfirm}
                onCancel={this.sldCancle}
                visible={modalVisible}
                width='400px'
                title='标记'
            >
                <div className={`${styles.mark}`}>
                    <Radio.Group onChange={this.onChange}>
                        <Radio value={1}>待处理</Radio>
                        <Radio value={2}>处理中</Radio>
                        <Radio value={3}>处理完成</Radio>
                    </Radio.Group>
                    <div className={`${styles.remark}`}>
                        <span className={`${styles.label}`}>备注</span>
                        <TextArea autosize={{ minRows: 4, maxRows: 6 }} onChange={this.inputChange} placeholder="请输入备注" maxLength={200} />
                    </div>
                </div>
            </Modal>
        );
    }
}
