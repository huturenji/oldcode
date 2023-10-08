import React, { Component } from 'react';
import { connect } from 'dva/index';
import { Form} from 'antd';
import { Scrollbars } from 'react-custom-scrollbars';
import global from '@/global.less';
import styles from '../common/css/index.less';
import { sld_com_empty_arrar_2 } from '@/utils/util_data';
import {
    getSession,
    removeSession,
    guid
} from '@/utils/utils';

@connect(({ mdecorate }) => ({
    mdecorate
}))
@Form.create()

// 优惠券组件
export default class Coupon extends Component {
    constructor(props){
        super(props)
        this.state={
            initData:{
                props : {
                    isShowStyle:false,
                    tabBackImage : {
                        ifShowTabBackImage:true,// 是否显示TAB背景图
                        ifScrollTop:true,
                        imgInfo:{
                            img: '',//图片绝对地址
                            img_path: '',//图片相对地址
                            width: '100%',
                            height: 40,
                            uuid: guid()
                        },
                        scrollTopImgInfo:{
                            img: '',//图片绝对地址
                            img_path: '',//图片相对地址
                            width: '100%',
                            height: 40,
                            uuid: guid()
                        }
                    },
                    couponBackTopImage : {
                        ifShowCouponBackTopImage:true,// 是否显示优惠券背景顶部图
                        imgInfo:{
                            img: '',//图片绝对地址
                            img_path: '',//图片相对地址
                            width: '100%',
                            height: 40,
                            uuid: guid()
                        }
                    },            
                    couponBackImage : {
                        ifShowCouponBackImage:true,// 是否显示优惠券背景图
                        imgInfo:{
                            img: '',//图片绝对地址
                            img_path: '',//图片相对地址
                            width: '100%',
                            height: 40,
                            uuid: guid()
                        }
                    },
                    couponBottomImage : {
                        ifShowCouponBottomImage:true,// 是否显示优惠券底部图
                        imgInfo:{
                            img: '',//图片绝对地址
                            img_path: '',//图片相对地址
                            width: '100%',
                            height: 40,
                            uuid: guid()
                        }
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
                data : []
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
        const {data} = this.props
        const con = (<div
            className={`${styles.tablan_wrap} ${global.flex_column_start_start}`}
        >
            <Scrollbars
                autoHide
                autowidth="true"
                autowidthmin={355}
                style={{ height: 44 }}
            >
                <div
                    className={`${styles.tablan_top}`}
                    style={{display:'flex'}}
                >
                    {data.data.length === 0 ?
                        sld_com_empty_arrar_2.map((item, index) => <div
                            key={index}
                            className={`${styles.item} ${global.flex_column_between_center}`}
                        >

                            <div className={`${styles.tab_name_part} ${global.flex_column_between_center}`}>
                                <span className={styles.tab_name}>全部</span>
                            </div>
                        </div>)
                        : data.data.map((item, index) => <div
                            key={index}
                            className={`${styles.item} ${global.flex_column_between_center}`}
                        >
                            <div className={`${styles.tab_name_part} ${global.flex_column_between_center}`}>
                                <span className={styles.tab_name}>{item.title}</span>
                            </div>
                        </div>)
                    }
                </div>
            </Scrollbars>
            
            <img
                style={{ width: '100%', height: 250, marginBottom: 5 }}
                src={require('@/assets/img/decorate/coupon/coupon.png')}
            />
            
        </div>)
        return con;
    }
}