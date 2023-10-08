import React from 'react';
import { connect } from 'dva/index';
import { Form} from 'antd';
import {
    getSession,
    removeSession
} from '@/utils/utils';

// eslint-disable-next-line no-unused-vars
import global from '@/global.less';
import styles from '../common/css/index.less';

// 公告组件
@connect(({ mdecorate }) => ({
    mdecorate
}))
@Form.create()
export default class ImageFreeCombination extends React.PureComponent{
    constructor(props){
        super(props)
        this.state={
            initData:{
                props : {
                    isShowStyle:false,
                    columnsNumber:'1' //图片列数
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
            handleCurSelData(data)
        }
    }

    //保存装修时改变数据
    compChangeData=()=>{
    }

    render() {
        let { data } = this.props
        return (
            <div 
                className={`${styles.TuPianZuHe_warp} ${global.flex_com_row_start_start}`} 
            >
                {/* 图片列表 */}
                { data.data.length > 0 && data.data.map((item,index)=>
                    <div
                        key={index}
                        className={`${styles.item} ${global.flex_com_row_center}`}
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
                    <div className={`${styles.item} ${global.flex_com_row_center}`} style={{flex:1}}>
                        <img
                            style={{ width:"100%"}}
                            src={require('@/assets/img/decorate/1632969720109622.png')} 
                        />
                    </div>
                }
            </div>
        )
    }
}