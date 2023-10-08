import { connect } from 'dva/index';
import { Form } from 'antd';
import React, { Component } from 'react';
import {
    getSession,
    removeSession
} from '@/utils/utils';

@connect(({ mdecorate }) => ({
    mdecorate
}))
@Form.create()

// 小浮窗组件
export default class FloatingWindow extends Component {
    constructor(props){
        super(props)
        this.state={
            initData:{
                props : {
                    isShowStyle:false
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
                    range_set:'single', //'single'-当前专题，'all'-所有装修页
                    uploadImg:{
                        img:'',
                        info:{},
                        url_type:''
                    },
                    allowClose:true,
                    position:'right',
                    showStyle:0 //0-隐藏，1-无效果，2-向内侧旋转折叠收缩，3-向内侧折叠收缩
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
        let con = <div>
            <div>
                {data.data.length>0 && data.data.map((item) => <img
                    style={{ width: 30, height: 30 }}
                    src={item.uploadImg.img ? item.uploadImg.img : require('@/assets/img/decorate/nav_default.png')}
                />)}
            </div>
        </div>;
        return con;
    }
}