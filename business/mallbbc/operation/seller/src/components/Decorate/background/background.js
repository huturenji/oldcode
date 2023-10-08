
import React from 'react';

export default class Background extends React.PureComponent {
    constructor(props){
        super(props)
        this.state={
            initData:{
                styles:[{
                    padding:['','','',''],
                    margin:['','','',''],
                    background:{
                        color:'',//背景颜色
                        img:'',//背景图
                        opacity:'100',//背景透明度
                        scroll:true,//固定模式
                        left:0,
                        top:0,
                        bgHeight:'100%'
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
        if(data.props.firstInit){
            data.styles = initData.styles
        }else{
            
        }
        handleCurSelData(data)
    }

    //保存装修时改变数据
    compChangeData=()=>{
        
    }

    render() {
        return(
            
            <div
                style={{
                    width:'100%',height:'100%',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize:"contain",
                    position:'absolute'
                }}
            >
            </div>
        )
    }
}