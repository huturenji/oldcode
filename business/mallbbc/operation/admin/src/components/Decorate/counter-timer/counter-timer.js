import { connect } from 'dva/index';
import { Form } from 'antd';
import React, { Component } from 'react';
import commonStyles from '../common/css/index.less';

@connect(({ mdecorate }) => ({
    mdecorate
}))
@Form.create()

// 倒计时组件
export default class CounterTimer extends Component {
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
                    countSet:0,//0-精确至天，1-精确至时分秒
                    countTime:new Date().toLocaleDateString(), //指定日期
                    positionStyle:{
                        positionX:'',
                        positionY:''
                    },
                    fontStyle:{
                        isBold:false,
                        size:12,
                        color:''
                    },
                    bgImg:{
                        img:'',
                        info:{},
                        url_type:''
                    }
                }]
            }
        }
    }

    componentWillMount() {
        this.initData()
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

    handleTime = (time,type) => {
        let countTime = ''
        let localTime = ''
        let tempCountTime = 0
        // let secInterval = null
        if (time) {
            if (type == 0) {
                localTime = new Date().toLocaleDateString()
                tempCountTime = parseInt((new Date(`${time.slice(0,10)} 00:00:00`).getTime() - new Date(localTime).getTime())/1000)
                countTime = parseInt(tempCountTime / 60 / 60 / 24)>0?parseInt(tempCountTime / 60 / 60 / 24):0
            } else if (type == 1) {
                if (time.length == 10) {
                    time = `${time} 00:00:00`
                }
                localTime = new Date()
                tempCountTime = parseInt((new Date(time).getTime() - new Date(localTime).getTime())/1000)
                let timeObj = this.getAllTime(tempCountTime)
                countTime = `${timeObj.hours}:${timeObj.minutes}:${timeObj.seconds}`
                // secInterval = setInterval(() => {
                //     if (tempCountTime == 0) {
                //         //倒计时结束，清除倒计时
                //         clearInterval(secInterval);
                //     } else {
                //         tempCountTime--;
                //         timeObj = this.getAllTime(tempCountTime)
                //         countTime = `${timeObj.hours}:${timeObj.minutes}:${timeObj.seconds}`
                        
                //     }
                // }, 1000)
            }
        }
        return countTime
        
    }

    getAllTime = (time) => {
        let temptHours = parseInt(time / 60 / 60)>0?parseInt(time / 60 / 60):0;
        let temptMinutes = parseInt(time / 60 % 60)>0?parseInt(time / 60 % 60):0;
        let temptSeconds = parseInt(time % 60)>0?parseInt(time % 60):0;
        let hours = temptHours > 9 ? `${temptHours}` : `0${ temptHours}`;
        let minutes = temptMinutes > 9 ? `${temptMinutes}` : `0${ temptMinutes}`;
        let seconds = temptSeconds > 9 ? `${temptSeconds}` : `0${ temptSeconds}`;
        return {hours:hours,minutes:minutes,seconds:seconds}
    }
    
    render() {
        const { data } = this.props;
        let con = <div>
            <div style={{ height: data?.data[0].bgImg?.img ? 'auto' : '100px' }}>
                {data.data.length>0 && data.data.map((item, index) => <div style={{position:'relative',height:'100%'}} key={index}>
                    <img
                        style={{width:'100%'}}
                        src={item.bgImg.img ? item.bgImg.img : ''}
                    />
                    <div 
                        style={{position:'absolute',fontWeight:item.fontStyle.isBold?'bold':'normal',
                            top:`${item.positionStyle.positionY !== '' ? `${item.positionStyle.positionY}` : '0'}%`,
                            left: `${item.positionStyle.positionX !== '' ? `${item.positionStyle.positionX}` : '0'}%`,
                            fontSize: `${item.fontStyle.size || 12}px`,color:`${item.fontStyle.color || '#000'}`}} 
                        className={commonStyles.numFont}
                    >{this.handleTime(item.countTime,item.countSet)}</div>
                </div>)}
            </div>
        </div>;
        return con;
    }
}