
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
export default class FixImage extends React.PureComponent {
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
                    img: '',//图片绝对地址
                    img_path: '',//图片相对地址
                    containerHeight:"titleBar",//组件真实的高度
                    opacity:'100',//透明度
                    background:'white',//背景色
                    fixed:false,//是否固定在顶部
                    title: '',//文字
                    direction:'row',//文字和图片的对齐方向
                    align:'left',//文字和图片的对齐方向
                    url: '', //链接值
                    url_type: '',//链接类型
                    width: '100%',
                    height: '100%'
                }]
            }
        }
    }

    componentWillMount() {
        this.initData()
    }

    componentWillReceiveProps (nextProps){
        let {data} = nextProps
        if(getSession(`${data.name}_${data.id}_init`)){
            this.initData(data)
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
            data.props.firstInit = false
        }
        handleCurSelData(data)
    }

    render() {
        const { data } = this.props;
        return(
            <div className={`${styles.titleSet_wrap}`}>
                {data.data&&data.data[0]&&
                        <div 
                            className={` ${data.data[0].direction=='row'?global.flex_com_row_start_start:global.flex_com_column_center_center}`}
                        >
                            {data.data[0].img?
                                <div className={`${styles.itemImg}`} style={{ width:25,height:25,backgroundImage:`url(${data.data[0].img?data.data[0].img:''})`}} />:
                                <img
                                    style={{ width: 100, height: 30, marginBottom: 5 }}
                                    src={require('@/assets/img/decorate/fiximage/fix-image.png')}
                                />
                            }
                            <div style={{ lineHeight:data.data[0].direction=='row'?'25px':'16px'}}>{data.data[0].title?data.data[0].title:''}</div>
                        </div>
                }
            </div>
        )
    }
}