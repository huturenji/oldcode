
import React from 'react';
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
export default class StatusBar extends React.PureComponent {
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
                    suspend:false,//悬浮状态
                    background:'white',//背景色
                    opacity:'100',//透明度
                    themeMode:'dark',//文字颜色
                    contentFillTop:false//页面内容是否可以覆盖状态栏
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
        return(
            <div className={`${styles.titleBar} ${global.flex_com_space_between}`} style={{width:'100%',height:30, padding:"0 5px"}}>
                <div>中国电信</div>
                <div className={`${global.flex_com_row_center}`}>
                    <div>100%</div>
                    <div style={{width:20,height:10,border:"1px solid black",borderRadius:10,borderColor:'white',color:'white',backgroundColor:'white'}} />
                </div>
            </div>
        )
    }
}