
import { connect } from 'dva/index';
import React, { Component } from 'react';
import { Form } from 'antd';
import global from '@/global.less';
import styles from '../common/css/index.less';
import style from './goods-seckill-activity.less'
import { getSession, removeSession } from '@/utils/utils';

@connect(({ mdecorate }) => ({
    mdecorate
}))
@Form.create()

export default class SeckillEntry extends Component {
    constructor(props){
        super(props)
        this.state = {
            initData:{
                props: {
                    isShowStyle: false,

                    firstTabShow: false,
                    filterNosaleGoods: true,
                    cateStyle: 1,
                    tabFixed: true,
                    show_style: 'old',
                    contentLRPadding: 0,
                    isTopShow: false,
                    mainTitle: {//右侧主标题
                        titleStyle: 'none',
                        img: '',//图片绝对地址
                        img_path: '',//图片相对地址
                        title:'',
                        url: '', //链接值
                        url_type: ''//链接类型
                    },
                    subTitle:{//右侧副标题
                        titleStyle: 'none',
                        img: '',//图片绝对地址
                        img_path: '',//图片相对地址
                        title:'',//文字 或者 倒计时
                        url: '', //链接值
                        url_type: ''//链接类型
                    },
                    topBackgroundImg:''
                },
                data: [],
                styles:[{
                    padding:['','','',''],
                    margin:['','','',''],
                    background:{
                        color:'',//背景颜色
                        img:'',//背景图
                        opacity:'100',//背景透明度
                        scroll:true//固定模式
                    }
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
            this.compChangeData()
            removeSession(`${data.name}_${data.id}`)
        }
    }

    //初始化数据
    initData = () => {
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
    compChangeData = () => {}

    render() {
        const { data } = this.props;
        const mainTitle = data.props?.mainTitle || {}
        const subTitle = data.props?.subTitle || {}

        const con = (<div>
            {/* 分类区域 */}
            <div className={`${styles.tablan_top} ${global.flex_row_start_center}`} style={{'display': (data.data.length >= 0 && data.props.firstTabShow) ? '' : 'none'}}>
                { data.data.map((item,index)=><div
                    key={index}
                    className={`${styles.item} ${global.flex_column_between_center}`}
                >
                    <div className={`${styles.tab_name_part} ${global.flex_column_between_center}`}>
                        <span className={styles.tab_name} style={{fontSize:20}}>{ item.activityName ? item.activityName : '分类标题' }</span>
                    </div>
                </div>)}
            </div>

            {/* 顶部区域 */}
            { data.props.isTopShow && (mainTitle.titleStyle === 'imgOrtext' || subTitle.titleStyle === 'imgOrtext') &&
                <div className={`${style.title}`}>
                    <div className={`${style.leftTitle}`} style={{'display': mainTitle.titleStyle === 'imgOrtext' ? '' : 'none' }}>
                        { mainTitle.img ? <img src={mainTitle.img} className={`${style.titleImg}`} /> : '主标题' }
                    </div>
                    <div className={`${style.rightTitle}`}>
                        { subTitle.titleStyle === 'imgOrtext' &&
                            (subTitle.img ? <img src={subTitle.img} className={`${style.titleImg}`} /> : <div>{subTitle.title}</div>)
                        }
                        { subTitle.titleStyle === 'countDown' &&
                            <img src={require(`@/assets/img/decorate/goods_seckill_activity/count.png`)} style={{right: 20}} className={`${style.titleImg}`} />
                        }
                    </div>
                </div>
            }

            {/* 场次分类 */}
            <div style={{ width: '100%' }}>
                <img
                    style={{ width: '100%' }}
                    src={data.props.cateStyle === 1 ? require(`@/assets/img/decorate/goods_seckill_activity/cate1.png`): require(`@/assets/img/decorate/goods_seckill_activity/cate2.png`)}
                />
            </div>

            {/* 商品列表 */}
            <div style={{ width: '100%', padding: `0 ${parseInt(data.props.contentLRPadding)}px`, backgroundColor: '#eff2f5' }}>
                <img
                    style={{ width: '100%' }}
                    src={data.props.show_style === 'old' ? require(`@/assets/img/decorate/goods_seckill_activity/goods1.png`) : require(`@/assets/img/decorate/goods_seckill_activity/goods2.png`)}
                />
            </div>
        </div>)
        return con;
    }
    
}
