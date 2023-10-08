import React,{ Component } from 'react';
import { connect } from 'dva/index';
import { Form} from 'antd';
import {
    sld_com_empty_arrar_4
} from '@/utils/util_data';

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

//导航组件
export default class Navigation extends Component {
    constructor(props){
        super(props)
        this.state={
            initData:{
                props : {
                    isShowStyle:false,
                    indicatorActiveColor:'#fff',//手机端滚动条滑块颜色
                    indicatorColor:'rgb(255, 134, 118)',//手机端滚动条颜色
                    icon_set:'up',//图标方向 up 图标向上 left 图标向左  no-icon 不显示图标
                    slide:35,//图标的大小
                    style_set:'nav'//样式设置 nav 导航  tag-nav分组
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
        const { data } = this.props;
        let con = null;
        //导航样式
        con = <div
            className={`${styles.nav} ${global.flex_com_row_start_center}`}
            style={{overflowX:'scroll'}}
        >
            {(data.data.length == 0) ? sld_com_empty_arrar_4.map((item, index) => <div
                key={index}
                className={`${styles.item} ${global.flex_com_row_center}`}
            >
                <img
                    style={{ width: 30, height: 30 }}
                    src={require('@/assets/img/decorate/nav_default.png')}
                />
                <span className={`${styles.nav_text}`}>导航</span>
            </div>)
                : data.data.map((item, index) => <div
                    key={index}
                    className={`${styles.item} ${global.flex_com_row_center}`}
                >
                    {data.props.icon_set != 'no-icon' &&
                        <img
                            style={{ width: 30, height: 30 }}
                            src={item.img ? item.img : require('@/assets/img/decorate/nav_default.png')}
                        />}
                    <span className={`${styles.nav_text}`}>{item.name ? item.name : '导航'}</span>
                </div>)
            }
        </div>;
        return con;
    }

}