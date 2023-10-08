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
// 商品分类组件（原tab切换）
export default class GoodsCategory extends Component {
    constructor(props){
        super(props)
        this.state={
            initData:{
                props : {
                    isShowStyle: false,
                    fixed:false,
                    isShowMore : true, //是否显示更多
                    cateStyle: 1,
                    filterNosaleGoods: true, // 是否隐藏不可售商品
                    show_style : 'small', //small 一行两个   bijia   比价列表
                    showFirstNav: true,
                    sources : 'upload', //数据来源upload上传  Interface//接口获取
                    data: [],
                    onlineSources: []
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
        if(getSession(`${data.name}_${data.id}_init`)){
            this.initData(data)
            removeSession(`${data.name}_${data.id}_init`)
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
            handleCurSelData(data)
        }
    }

    render() {
        let { data } = this.props

        const con = (<div
            className={`${styles.tablan_wrap} ${global.flex_column_start_start}`}
        >
            {/* 分类样式 新/旧 */}
            { data.props.cateStyle === 1 && <img style={{ width: '100%', height: 50 }} src={require('@/assets/img/decorate/goodscategory/cate1.png')} /> }
            { data.props.cateStyle === 2 && <img style={{ width: '100%', height: 50 }} src={require('@/assets/img/decorate/goodscategory/cate2.png')} /> }

            {/* 商品区域 */}
            <img
                style={{ width: '100%', height: 600, marginBottom: 5 }}
                src={require('@/assets/img/decorate/goodscategory/goods.png')}
            />

            {/* 暂无更多 */}
            { data.props.isShowMore && <img style={{ width: '100%', height: 30 }} src={require('@/assets/img/decorate/goodscategory/noMore.png')} /> }
        </div>)
        return con;
    }
}


