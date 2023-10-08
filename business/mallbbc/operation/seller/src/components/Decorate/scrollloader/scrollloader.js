import { connect } from 'dva/index';
import React,{ Component } from 'react';
import { Form } from 'antd';
import {
    getSession,
    removeSession
} from '@/utils/utils';
import global from '@/global.less';

@connect(({ mdecorate }) => ({
    mdecorate
}))
@Form.create()


// 轮播组件
export default class Scrollloader extends Component {
    constructor(props){
        super(props)
        this.state={
            initData:{
                props : {
                    isShowStyle: false,
                    btnImg: ''
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
        let con = null;
        
        con = 
            <div style={{height: 150,position: 'relative'}}>
                <div className={`${global.flex_com_column_center_center}`} style={{'position': 'absolute','height': 80, 'width': '60%', 'top': 10, 'left': '20%', 'backgroundColor': '#ccc'}}>商品图片滚动区域</div>
                <div className={`${global.flex_com_column_center_center}`} style={{'position': 'absolute','height': 40, 'width': 100, 'bottom': 10, 'left': '50%', 'transform': 'translateX(-50%)', 'backgroundColor': '#ccc'}}>开始按钮</div>
            </div>
        return con;
    }
}