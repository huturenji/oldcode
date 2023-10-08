import React, { Component } from 'react';
import { connect } from 'dva/index';
import { Form} from 'antd';
// eslint-disable-next-line no-unused-vars
import global from '@/global.less';
import styles from '../common/css/index.less';
import {
    getSession,
    removeSession
} from '@/utils/utils';

@connect(({ mdecorate }) => ({
    mdecorate
}))
@Form.create()
// 公告组件
export default class Notice extends Component {
    constructor(props){
        super(props)
        this.state={
            initData:{
                props : {
                    isShowStyle:false,
                    show_style : 'one'//公告展示风格
                },
                styles:[{
                    padding:['','','',''],
                    margin:['','','',''],
                    background:{
                        color:'',//背景颜色
                        img:'',//背景图
                        opacity:'100',//背景透明度
                        scroll:true//固定模式
                    }
                }],
                data : [{
                    text : '',//公告内容
                    url : '',//公告连接
                    url_type : '',//公告连接类型
                    info : ''//用于存放额外信息
                }]
            }
        }
    }

    componentWillMount() {
        this.initData()
    }

    componentWillReceiveProps (nextProps){
        let {data} = nextProps
        if(getSession(`${data.name}_${data.id}`)){
            this.compChangeData()
            removeSession(`${data.name}_${data.id}`)
        }
    }

    //初始化数据
    initData = ()=>{
        let {initData} = this.state
        let {data,handleCurSelData} = this.props
        if(data.props.firstInit) {
            data.props = {...data.props, ...initData.props}
            data.styles = initData.styles
            data.data = initData.data
            data.children = initData.children
            data.props.firstInit = false
        }
        handleCurSelData(data)
    }

    //保存装修时改变数据
    compChangeData=()=>{
    }

    render() {
        const { data } = this.props;
        let con = null;
        //公告风格一
        con = <div
            className={styles.gonggao}

        >
            <img className={styles.left_img_1} src={require('@/assets/img/decorate/notice/left_icon_1.png')} />
            {/* eslint-disable-next-line jsx-a11y/no-distracting-elements */}
            <marquee className={`${styles.show_style_1}`}><span className={styles.left_img_1_text}>{data.data[0].text ? data.data[0].text : '公告：请填写内容,将会在手机上滚动显示!!!'}</span>
            </marquee>
            <span className={styles.more_text_1}>更多</span>
        </div>;
        return con;
    }
}