/*
*    操作记录组件
* */
import { connect } from 'dva/index';
import React, { Component } from 'react';
import {
    Timeline 
} from 'antd';
import {
    failTip
} from '@/utils/utils';
import styles from './index.less';

@connect(({ project }) => ({
    project
}))
export default class ReviewLog extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            data:[]
        };
    }


    componentDidMount() {
       
    }

    componentWillReceiveProps(nextProps) {
        const {type,params} = nextProps
        this.getLogList(type,params)
    }
    
    getLogList = (type,params)=>{
        const { dispatch } = this.props;
	    dispatch({
	        type,
	        payload: {...params},
	        callback: (res) => {
	            if (res.state == 200) {
	                if (res.data.behaviorVoList) {
	                   this.setState({
                            data:res.data.behaviorVoList
                        })
	                } else {
	                    failTip(res.msg)
	                }
	            }
	        }
	    });
    }

    updata = ()=>{
        const {type,params} = this.props 
        this.getLogList(type,params)
    }

    render() {
        const { data } = this.state;
        return (
            <div>
                <div className={`${styles.reviewlog}`}>操作记录</div>
                <Timeline style={{marginTop: 20}}>
                    {
                        data.map((item,index)=>{
                            const {userName,content,createTime,behaviorId} = item
                            return (
                                <Timeline.Item key={behaviorId}>
                                    <div className={`${styles.line_item}`}>
                                        <span className={`${styles.name}`}>{index+1}</span>
                                        <span className={`${styles.name}`}>{userName}</span>
                                        <span className={`${styles.content}`}>{content}</span>
                                        <span className={`${styles.time}`}>{createTime}</span>
                                    </div>
                                </Timeline.Item>
                            )
                        })
                    }
                </Timeline>
            </div>
        );
    }
}
