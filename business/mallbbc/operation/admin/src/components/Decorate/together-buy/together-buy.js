import { connect } from 'dva/index';
import React, { Component } from 'react';
import { Form } from 'antd';
import {
    guid,
    getSession,
    removeSession
} from '@/utils/utils';

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
                    isShowStyle: false,
                    is_show: true,
                    filterNosaleGoods: true,
                    sliceGoodsNum: 0
                },
                data: [{
                    categoryText:'',//分类内容
                    url: '', //链接值
                    url_type: '', //链接类型
                    activityData: 0, //活动日期
                    show_style:'t_row',//
                    showBuyNum: false,//已拼件数
                    uuid: guid(),
                    showSuccessNum:true
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
        return <div>
            <img
                style={{ width: '100%' }}
                src={require('@/assets/img/decorate/together-buy/goods.png')}
            />
        </div>
    }
}
