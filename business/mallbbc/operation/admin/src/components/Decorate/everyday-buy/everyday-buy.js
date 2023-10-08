import { connect } from 'dva/index';
import React, { Component } from 'react';
import { Form } from 'antd';
import { getSession, removeSession } from '@/utils/utils';
import style from './everyday-buy.less';

@connect(({ mdecorate }) => ({
    mdecorate
}))
@Form.create()

export default class TogetherBuy extends Component {
    constructor(props){
        super(props)
        this.state = {
            initData:{
                props: {
                    show_style: 'd_row',
                    filterNosaleGoods: true,
                    isShowStyle: false
                },
                data: [{
                    mainTitle: {//右侧主标题
                        titleStyle: 'imgOrtext',
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
                    topBackgroundImg:'' //顶部分类的背景图
                }],
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
        let { data } = this.props
        let mainTitle = data.data[0]?.mainTitle || {}
        let subTitle = data.data[0]?.subTitle || {}
        return <div>
            { (mainTitle.titleStyle === 'imgOrtext' || subTitle.titleStyle === 'imgOrtext') &&
                <div className={`${style.title}`}>
                    <div className={`${style.leftTitle}`} style={{'display': mainTitle.titleStyle === 'imgOrtext' ? '' : 'none' }}>
                        { mainTitle.img ? <img src={mainTitle.img} className={`${style.titleImg}`} /> : '主标题' }
                    </div>
                    <div className={`${style.rightTitle}`} style={{'display': subTitle.titleStyle === 'imgOrtext' ? '' : 'none' }}>
                        { subTitle.img ? <img src={subTitle.img} className={`${style.titleImg}`} /> : '副标题' }
                    </div>
                </div>
            }
            <img style={{width: '100%'}} src={require('@/assets/img/decorate/everyday-buy/goods.png')} />
        </div>
    }
}
