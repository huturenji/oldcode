import React, { Component } from 'react';
import { connect } from 'dva/index';
import { Form} from 'antd';
import styles from '../common/css/index.less';
import {
    getSession,
    removeSession
} from '@/utils/utils';


// 辅助空白组件
@connect(({ mdecorate }) => ({
    mdecorate
}))
@Form.create()
export default class FixBlank extends Component {
    constructor(props){
        super(props)
        this.state={
            initData:{
                props : {
                    isShowStyle:false,
                    news_border_radius : '8', //图片圆角还是直角
                    showStyle:"text", //展示类型
                    more_news : '' , //更多的跳转链接
                    categoryId : '' //数据来源
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
        let con = <div
            className={`${styles.news_wrap}`}
        >
            <div className={`${styles.news_top}`}>
                <div>资讯</div>
                <div className={`${styles.more}`}>更多资讯</div>
            </div>
            <div className={`${styles.news_top} ${styles.img_news_top}`} style={{backgroundImage:`url(${require('@/assets/img/decorate/media/pic_zixun_banner@2x.png')})`}}>
                <div className={`${styles.more} ${styles.img_more}`} style={{backgroundImage:`url(${require('@/assets/img/decorate/media/btn_shangyun_gengduozixun@2x.png')})`}} />
            </div>
            <div className={`${styles.news_item}`}>
                <div className={`${styles.news_layout}`}>
                    <div className={`${styles.news_title}`}>新闻标题新闻标题新闻标题新闻标题新闻标题新闻标题新闻标题</div>
                    <div className={`${styles.news_info} ${styles.dw}`}>
                        <div className={`${styles.auth}`}>发布机构</div>
                        <div className={`${styles.publish_time}`}>发布时间</div>
                    </div>
                </div>

                <div className={`${styles.news_layout_right}`}>
                    <div className={`${styles.img_item_warp}`} style={{ backgroundImage: `url(${require('@/assets/img/decorate/media/wap_style02.png')})` }} />
                </div>
            </div>
        </div>

        return con;
    }
}