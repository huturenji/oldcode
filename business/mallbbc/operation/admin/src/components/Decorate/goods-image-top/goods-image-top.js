import { connect } from 'dva/index';
import { Form} from 'antd';
import React, { Component } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import ALibbSvg from '@/components/ALibbSvg';
import { sld_com_empty_arrar_4 } from '@/utils/util_data';
import {
    getSession,
    removeSession
} from '@/utils/utils';

import global from '@/global.less';
import styles from '../common/css/index.less';

const defailt_goods_img = require('@/assets/img/decorate/goodsimagetop/default_goods_img.png');//装修默认的商品空图片

@connect(({ mdecorate }) => ({
    mdecorate
}))
@Form.create()
// 商品组合组件（原搭配组件）
export default class GoodsImageTop extends Component {
    constructor(props){
        super(props)
        this.state={
            initData:{
                props : {
                    isShowStyle:false,

                    dapei_desc:'',//搭配图片描述
                    dapei_img :'',//搭配图片
                    dapei_title : '',//搭配标题
                    dapei_link : {
                        url:'',
                        url_type:''
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
                data : [{
                    ids: [],
                    info: []
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
            this.compChangeData(data)
            removeSession(`${data.name}_${data.id}`)
        }
        if(getSession(`${data.name}_${data.id}_init`)){
            this.initData()
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
        }
        handleCurSelData(data)
    }

    //保存装修时改变数据
    compChangeData=()=>{}

    render() {
        const { data } = this.props;
        let con = <div
            className={styles.dapei}
        >
            {data.props.dapei_title && <div className={styles.dapei_title}>{data.props.dapei_title}</div>}
            <div className={styles.img_wrap}>
                {data.props.dapei_img
                    ? <img src={data.props.dapei_img} />
                    : <div className={`${global.flex_column_center_center}`} style={{ paddingTop: 10 }}>
                        <ALibbSvg fill="#fff" width={40.8} height={33.6} type="tupian1" /><span
                            className={styles.center_tip}
                        >宽750*高不限</span>
                    </div>
                }
            </div>
            {data.props.dapei_desc && <div className={styles.dapei_desc}>{data.props.dapei_desc}</div>}
            <Scrollbars
                autoHide
                autowidth="true"
                autowidthmin={355}
                style={{ height: 200 }}
            >
                <div className={styles.goods_info}>
                    {
                        sld_com_empty_arrar_4.map(item => <div key={item} className={`${global.flex_com_column_start_start} ${styles.item}`}>
                            <div className={`${global.flex_row_common} ${styles.img}`}>
                                <img src={defailt_goods_img} />
                            </div>
                            <span className={styles.name}>商品名称</span>
                            <span className={styles.price}>¥0</span>
                        </div>)
                    }
                </div>
            </Scrollbars>
            <div />
        </div>;
        return con;
    }

}