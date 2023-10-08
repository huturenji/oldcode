import React, { Component } from 'react';

export default class Advertise extends Component {
    constructor(props){
        super(props)
        this.state={
            initData:{
                props : {
                    isShowStyle: false
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
                data : [
                    
                ]
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

    render() {
        const {data} = this.props
        const con =
        <div>
            {/* 图片列表 */}
            { data.data.length > 0 && data.data.map((item,index)=>
                <div
                    key={index}
                    className={`${global.flex_com_row_center}`}
                    style={{flex:1}}
                >
                    <img
                        style={{ width:"100%"}}
                        src={item.img ? item.img : require('@/assets/img/decorate/1632969720109622.png')} 
                    />
                </div>
            )}
            {/* 缺省图 */}
            { data.data.length === 0 && 
                <div className={` ${global.flex_com_row_center}`} style={{flex:1}}>
                    <img
                        style={{ width:"100%"}}
                        src={require('@/assets/img/decorate/1632969720109622.png')} 
                    />
                </div>
            }
        </div>
        return con;
    }
}