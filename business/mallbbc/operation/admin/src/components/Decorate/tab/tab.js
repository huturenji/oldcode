import React, { Component } from 'react';
import { connect } from 'dva/index';
import { Form} from 'antd';
import { Scrollbars } from 'react-custom-scrollbars';
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
export default class Tab extends Component {
    constructor(props){
        super(props)
        this.state={
            initData:{
                props : {
                    isShowStyle:false,
                    fixed:false,//是固定还是滑动
                    showNav : true, //是否展示导航
                    showStyle:'row',//竖向column  横向row
                    maxNum:4
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
        //tab栏目切换
        const { data } = this.props;
        const con =
            <div>
                
                    
                <div
                    className={`${styles.tablan_wrap} ${global.flex_column_start_start}`}
                >
                    <Scrollbars
                        autoHide
                        autowidth="true"
                        autowidthmin={355}
                        style={{ height: 40 }}
                    >
                        <div className={`${styles.tablan_top} ${global.flex_row_start_center}`}>
                            {(data.data.length == 0) ? sld_com_empty_arrar_4.map((item, index) => <div
                                key={index}
                                className={`${styles.item} ${global.flex_column_between_center}`}
                            >
                                <div className={`${styles.tab_name_part} ${global.flex_row_between_center}`}>
                                    <span className={styles.tab_name}>全部</span>
                                </div>
                            </div>)
                                : data.data.map((item, index) => <div
                                    key={index}
                                    className={`${styles.item} ${global.flex_column_between_center}`}
                                >
                                    <div className={`${styles.tab_name_part}`}>
                                        {item.titleData.showTitleData&&<span className={styles.tab_name} style={{backgroundImage: `url(${!item.titleData.title && item.titleData.img ? item.titleData.img : ''})`,float:'left' }}>
                                            {item.titleData.title?item.titleData.title:(item.titleData.img?'':'全部')}
                                        </span>}
                                    </div>
                                </div>)
                            }
                        </div>
                    </Scrollbars>
                    <div className={`${styles.nav_tab} ${global.flex_com_row_start_center}`}>
                        {sld_com_empty_arrar_4.map((item, index) => <div
                            key={index}
                            className={`${styles.item} ${global.flex_com_row_center}`}
                            style={{ flexDirection: 'column' ,marginBottom:10}}
                        >
                            <img
                                style={{ width: 40, height: 40, marginBottom: 5 }}
                                src={require('@/assets/img/decorate/nav_default.png')}
                            />
                            <span className={`${styles.nav_text}`}>子项目</span>
                        </div>)}
                    </div>
                </div>
                    
            </div>
        return con;
    }


}