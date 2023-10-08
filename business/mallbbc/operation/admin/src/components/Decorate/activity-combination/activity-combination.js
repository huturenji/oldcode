
import React from 'react';
import { connect } from 'dva/index';

@connect(({ mdecorate }) => ({
    mdecorate
}))

export default class share extends React.PureComponent {
    constructor(props){
        super(props)
        this.state={
            initData:{
                props : {
                    isShowStyle:false,
                    filterNosaleGoods:false,
                    show_style:'one'//三种样式
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
                    areaOne: {//左标题
                        areaOneType:'activity',
                        backgroundColor:'#fff',
                        style:'one',
                        img: '',//图片绝对地址
                        sources:{
                            url: '', 
                            url_type: ''
                        },
                        leftText:{
                            img:'',
                            title:''
                        },
                        link:{
                            url: '', 
                            url_type: ''
                        },
                        isLunbo:true,
                        speed:3
                    },
                    areaTwo: {//左标题
                        areaTwoType:'activity',
                        backgroundColor:'#fff',
                        style:'one',
                        img: '',//图片绝对地址
                        sources:{
                            url: '', 
                            url_type: ''
                        },
                        leftText:{
                            img:'',
                            title:''
                        },
                        link:{
                            url: '', 
                            url_type: ''
                        },
                        isLunbo:true,
                        speed:3
                    },
                    areaThree: {//左标题
                        img: '',//图片绝对地址
                        link:{
                            url: '', 
                            url_type: ''
                        }
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

    render() {
        const { data } = this.props
        return(
            <div>
                {data.props.show_style=='one'&&<img src={require('@/assets/img/decorate/activity_combination/show_style1.png')} style={{width:'100%'}}></img>}
                {data.props.show_style=='two'&&<img src={require('@/assets/img/decorate/activity_combination/show_style2.png')} style={{width:'100%'}}></img>}
                {data.props.show_style=='three'&&<img src={require('@/assets/img/decorate/activity_combination/show_style3.png')} style={{width:'100%'}}></img>}
            </div>
        )
    }
}