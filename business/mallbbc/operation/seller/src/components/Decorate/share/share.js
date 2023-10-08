
import React from 'react';
import { connect } from 'dva/index';
import { Form} from 'antd';
import global from '@/global.less';
import styles from '../common/css/index.less';

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
                    shareLink:true,
                    shareImg: ''
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

    //保存装修时改变数据
    compChangeData=()=>{
    }

    render() {
        return(
            <div className={`${styles.search_wrap} ${global.flex_com_row_start_start}`}>
                <div>
                    页面分享类型
                </div>
            </div>
        )
    }
}