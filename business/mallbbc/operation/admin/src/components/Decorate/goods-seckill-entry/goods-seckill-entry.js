
import React, { Component } from 'react';
import { connect } from 'dva/index';
import { Form} from 'antd';
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
export default class SeckillEntry extends Component {
    constructor(props){
        super(props)
        this.state={
            initData:{
                props : {
                    isShowStyle:false,
                    show_style : "noImg",//展示风格    noImg 无图  haveImg 有图
                    seckillType : 'vop',//活动类型    vop  vop秒杀活动 
                    borderRadius:'0',
                    leftText:{
                        img: '',//图片绝对地址
                        img_path: '',//图片相对地址
                        title:'',
                        url: '', //链接值
                        url_type: '',//链接类型
                        width: '100%',
                        height: '100%'
                    },
                    rightText: {
                        img: '',//图片绝对地址
                        img_path: '',//图片相对地址
                        title:'',
                        url: '', //链接值
                        url_type: '',//链接类型
                        width: '100%',
                        height: '100%'
                    },
                    rightImg: {
                        img: '',//图片绝对地址
                        img_path: '',//图片相对地址
                        title:'',
                        url: '', //链接值
                        url_type: '',//链接类型
                        width: '100%',
                        height: '100%'
                    },
                    linkdata: {
                        url: '', //链接值
                        url_type: ''//链接类型
                    }
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
                data : [
                    {
                        vopdata:{
                            url: '', //链接值
                            url_type: ''//链接类型
                        },
                        uniondata:{
                            storeId:'',//数据来源
                            recommendId:''//推广位id
                        }
                    }
                ]
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
	    const con = (<div
	        className={`${styles.tablan_wrap} ${global.flex_column_start_start}`}
	    >
            <div style={{padding:10,width:'100%'}} className={`${styles.hotSale_text} ${global.flex_com_space_between}`}>
                <div className={`${styles.hotSale_left}`} style={{width:!data.props.leftText.title&&data.props.leftText.img?60:'',height:20,background:`url(${(!data.props.leftText.title&&data.props.leftText.img)?data.props.leftText.img:''}) center/100% 100% no-repeat`}}>{data.props.leftText.title?data.props.leftText.title:(data.props.leftText.img?'':'文字描述/图片')}</div>
                <div style={{border:"1px solid #ff4819",borderRadius:"5px"}} className={`${global.flex_row_start_start}`}>
                    <div>11点场|</div><div>抢购中</div>
                </div>
                <div className={`${styles.hotSale_right}`} style={{width:!data.props.rightText.title&&data.props.rightText.img?60:'',height:20,background:`url(${(!data.props.rightText.title&&data.props.rightText.img)?data.props.rightText.img:''}) center/100% 100% no-repeat`}}>{data.props.rightText.title?data.props.rightText.title:(data.props.rightText.img?'':'文字描述/图片')}</div>
            </div>
	        <img
	            style={{ width: '100%', height: 150, marginBottom: 5 }}
	            src={require('@/assets/img/decorate/goodsseckillentry/goods-entry.png')}
	        />
            
	    </div>)
	    return con;
    }
}
