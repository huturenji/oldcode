
import React from 'react';
import { connect } from 'dva/index';
import { Form} from 'antd';
import style from './signin-edit.less';

@connect(({ mdecorate }) => ({
    mdecorate
}))
@Form.create()

export default class share extends React.PureComponent {
    constructor(props){
        super(props)
        this.state={
            initData:{
                props : {
                    isShowStyle:false,
                    signInBgImg: '',
                    signInImg: '',
                    signInDoneImg: '',
                    signImgWidth: 0,
                    isShowSignInXY: false,
                    signInXY: [0, 0],
                    isShowCount: true,
                    isCountBold: false,
                    countColor: 'rgba(0,0,0,1)',
                    countFontSize: 12,
                    countXY: [0, 0]
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
                    url: '', //链接值
                    url_type: '' //链接类型
                }]
            }
        }
    }

    componentWillMount() {
        this.initData()
    }

    componentWillReceiveProps (nextProps){
        let {compChangeDataFlag} = nextProps.mdecorate
        if(compChangeDataFlag){
            this.compChangeData()
            let {dispatch} = this.props
            dispatch({
                type: 'mdecorate/setParams',
                payload: {
                    compChangeDataFlag:false
                }
            })
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

    // 设置坐标
    setXY = (data, isShow=true) => {
        let xyObj = { position: 'absolute' }
        if (isShow) {
            xyObj.left = `${data[0]}%`
            xyObj.top = `${data[1]}%`
            xyObj.transform = 'translateX(-50%)'
        } else {
            xyObj.top = '0'
        }
        return xyObj
    }

    // 设置签到天数样式
    setCountStyle = () => {
        const { data } = this.props
        let styleObj = {
            color: data.props.countColor,
            'fontSize': `${data.props.countFontSize}px`,
            'fontWeight': data.props.isCountBold ? 'bold': 'normal'
        }

        return styleObj
    }

    setImgStyle = () => {
        const { data } = this.props
        let styleObj = {}

        if (data.props.signImgWidth) {
            styleObj.width = `${data.props.signImgWidth}px`
        }

        return styleObj
    }

    //保存装修时改变数据
    compChangeData=()=>{}

    render() {
        const { data } = this.props
        return(
            <div className={`${style.por}`} style={{ 'overflow': 'hidden' }}>
                { data.props.signInBgImg ? 
                    <div>
                        <img src={data.props.signInBgImg} style={{width: '100%'}} />
                    </div>
                    :
                    <div className={`${style.signBg}`}>签到活动背景</div>
                }
                <img src={data.props.signInImg} style={{ ...this.setXY(data.props.signInXY, data.props.isShowSignInXY), ...this.setImgStyle() }} />
                { data.props.isShowCount && 
                    <div style={{ 'whiteSpace': 'nowrap', ...this.setXY(data.props.countXY), ...this.setCountStyle() }}>
                        <span>0</span>
                    </div>
                }
            </div>
        )
    }
}