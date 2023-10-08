
import React from 'react';
import { connect } from 'dva/index';
import { Form} from 'antd';
// eslint-disable-next-line no-unused-vars
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
export default class Lottery extends React.PureComponent {
    constructor(props){
        super(props)
        this.state={
            initData:{
                props : {
                    isShowStyle:false,
                    background:[{backgroundColor:'',img:''}]
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
        const { data } = this.props;
        return(
            <div>
                <div style={{backgroundColor:data.props.background[0].backgroundColor?data.props.background[0].backgroundColor:'', backgroundImage:`url(${(data.props.background[0].img&&(!data.props.background[0].backgroundColor))?data.props.background[0].img:''})`}}>
                    <div className={`${styles.raffle_warp}`} style={{backgroundImage:`url(${require('@/assets/img/decorate/lottery/raffle.png')})`}} />
                </div>
            </div>
        )
    }
}