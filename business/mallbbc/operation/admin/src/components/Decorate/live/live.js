import React, { Component } from 'react';
import { connect } from 'dva/index';
import { Form} from 'antd';
import {
    sld_com_empty_arrar_2,
    live_defalut_img
} from '@/utils/util_data';
import {
    sldComLanguage,
    getSession,
    removeSession
} from '@/utils/utils';

import global from '@/global.less';
import styles from '../common/css/index.less';

@connect(({ mdecorate }) => ({
    mdecorate
}))
@Form.create()
// 商品分类组件（原tab切换）
export default class Live extends Component {
    constructor(props){
        super(props)
        this.state={
            initData:{
                props : {
                    isShowStyle:false,
                    show_style : 'one',//展示风格：one 只显示2个商品，不可滚动，two 只显示3个商品，不可滚动 three 只显示2个商品，不可滚动，长形显示   four 异形轮播 five 多余3个的轮播
                    border_radius : 8//短视频卡片边角，直角0、圆角5px
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
                        title : `${sldComLanguage('直播')}`,//标题名称
                        view_more_url : '',//查看更多的链接
                        data : {
                            ids: [],//短视频id集合
                            info: []//短视频信息
                        }//短视频数据
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
        const con = <div
            className={`${styles.video} ${global.flex_column_start_start}`}
        >
            <div className={`${styles.title} ${global.flex_row_between_center}`}>
                <span className={`${styles.left_con}`}>{data.data[0].title}</span>
                <span className={styles.right_con}>查看更多&nbsp;&gt;</span>
            </div>

            <div
                className={`${global.flex_row_start_start} ${styles.live_list}`}
                style={{
                    height: 171,
                    width: '100%',
                    overflow: 'hidden'
                }}
            >
                {sld_com_empty_arrar_2.map((item_video, index_video) =>
                    <div
                        key={index_video}
                        style={{
                            backgroundImage: `url(${live_defalut_img()})`
                        }}
                    />)}
            </div>

        </div>;
        return con;
    }
}
