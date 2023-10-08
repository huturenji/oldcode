import React, { Component } from 'react';
import { connect } from 'dva/index';
import { Form } from 'antd';
import { sld_com_empty_arrar_4 } from '@/utils/util_data';
import {
    getSession,
    removeSession
} from '@/utils/utils';

import global from '@/global.less';
import styles from '../common/css/index.less';


// 商品分类组件（原tab切换）
@connect(({ mdecorate }) => ({
    mdecorate
}))
@Form.create()
export default class Advertise extends Component {
    constructor(props){
        super(props)
        this.state={
            initData:{
                props : {
                    isShowStyle: false
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
                        imglist:[
                            {
                                img: '',//图片绝对地址
                                img_path: '',//图片相对地址
                                title: '',//图片标题
                                url: '', //链接值
                                url_type: '',//链接类型
                                info: '',//用于存放额外信息
                                width: '100%',
                                height: '100%'
                            }
                        ],
                        children:[]
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
        const {data} = this.props
        const con =
            <div
                className={`${styles.zidingyi_wrap} `} 
            >
                {data.data[0].children && data.data[0].children.length>0?
                    <div>
                        <div className={`${styles.item_warp} ${global.flex_com_row_start_start}`} style={{ overflowX: 'auto' }}>
                            {data.data[0].children.slice(0,1).map((item, index) => <div
                                key={index}
                                className={`${styles.item} ${global.flex_com_row_center}`}
                                style={{ flexDirection: 'column', paddingTop: 17, width: 80, marginRight: 5 }}
                            >

                                <img
                                    style={{ width: 40, height: 40, marginBottom: 5 }}
                                    src={item.img ? item.img : require('@/assets/img/decorate/nav_default.png')}
                                />
                                <div className={`${global.flex_com_column_space_betweent_center}`}><span className={`${styles.nav_text_title}`}>￥{item.title ? item.title : '活动价'}</span><span className={`${styles.nav_text_price}`}>￥{item.price ? item.price : '现价'}</span></div>
                            </div>)}
                        </div>
                    </div>:
                
                    <div className={`${styles.zidingyi_item} ${global.flex_com_row_space_around_center}`} style={{ paddingTop: 30, height: 150, backgroundImage: `url(${require('@/assets/img/decorate/1632969720109622.png')})` }}>
                        <div className={`${styles.zidingyi_top_left}`} style={{ backgroundImage: `url(${require('@/assets/img/decorate/1632969720109622.png')})` }}>文字或图片</div>
                        <div className={`${styles.zidingyi_top_right}`} style={{ backgroundImage: `url(${require('@/assets/img/decorate/1632969720109622.png')})` }}>文字或图片</div>
                        {
                            sld_com_empty_arrar_4.map((item, index) => <div
                                key={index}
                                className={`${styles.item} ${global.flex_com_row_center}`}
                                style={{ flexDirection: 'column' }}
                            >

                                <img
                                    style={{ width: 40, height: 40, marginBottom: 5 }}
                                    src={item.img ? item.img : require('@/assets/img/decorate/nav_default.png')}
                                />
                                <span className={`${styles.nav_text}`}>{item.name ? item.name : '子项目'}</span>
                            </div>)
                        }
                    </div>
                }
            </div>
        return con;
    }
}