import React, { Component } from 'react';
import { connect } from 'dva/index';
import { Form} from 'antd';
import styles from '../common/css/index.less';
import {
    getSession,
    removeSession
} from '@/utils/utils';

@connect(({ mdecorate }) => ({
    mdecorate
}))
@Form.create()
// 商品推荐组件
export default class Advertise extends Component {
    constructor(props){
        super(props)
        this.state={
            initData:{
                props : {
                    isShowStyle:false,
                    filterNosaleGoods: true, // 是否隐藏不可售商品
                    title : "",//商品标题
                    isShowMore : true, //是否显示更多
                    show_style : 'small',//展示类型：big 大图 small 一行两个 list 列表 一行一个 bijia 比价列表
                    sources:'upload' //手动上传/都在买(都在买不支持商品展示模式)
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
            this.compChangeData(data)
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
    compChangeData=()=>{}

    render() {
        const { data } = this.props;
        const con = (<div className={`${styles.tablan_wrap} ${global.flex_column_start_start}`}>
            { data.props.title != "" &&
                <div style={{
                    lineHeight: '30px',
                    width: '100%',
                    textAlign: 'center'
                }}
                > {data.props.title} </div>
            }
            {/* 商品区域 */}
            <img
                style={{ width: '100%', height: 500, marginBottom: 5 }}
                src={require('@/assets/img/decorate/goods/goods.png')}
            />
            {/* 暂无更多 */}
            { data.props.isShowMore && <img style={{ width: '100%', height: 30 }} src={require('@/assets/img/decorate/goods/noMore.png')} /> }
        </div>)
        return con;
    }
}