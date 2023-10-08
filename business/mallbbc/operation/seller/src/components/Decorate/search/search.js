
import React from 'react';
import { connect } from 'dva/index';
import { Input, Form } from 'antd';
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
export default class Search extends React.PureComponent {
    constructor(props){
        super(props)
        this.state={
            initData:{
                props : {
                    isShowStyle:false,
                    inputVal:'',//输入框值
                    linkVal : '',//跳转链接
                    showStoreList : true,//是否展示店铺列表
                    fixed : true,//是否固定在顶部
                    show_style:'all',//搜索框展示全部    section搜索框展示部分
                    storeAndSupplierInfos:[] //供应商数据
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
        if(getSession(`${data.name}_${data.id}_init`)){
            this.initData()
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
            data.children = initData.children
            data.props.firstInit = false
            handleCurSelData(data)
        }
    }
    
    render() {
        const { data } = this.props;
        return(
            <div style={{overflow:'hidden'}}>
                <div className={`${styles.search_wrap} ${global.flex_com_row_start_start}`}>
                    <div>
                        <img
                            style={{ width:32,height:32}}
                            src={require('@/assets/img/decorate/1632969720109622.png')} 
                        />
                    </div>
                
                    <div style={{width:'100%',minHeight:30}}>
                        <div style={{position:"relative"}}>
                            <img className={`${styles.searchImg}`} width={20} height={20} src={require('@/assets/img/decorate/search/icon_search_glass.svg')} />
                            <Input value={data.props.inputVal} disabled style={{padding:"5px 5px 5px 30px",position:'absolute',right:0}} />
                        </div>
                    </div>
                
                    
                    <div>
                        <img
                            style={{ width:32,height:32}}
                            src={require('@/assets/img/decorate/1632969720109622.png')} 
                        />
                    </div>
                    
                </div>
            </div>
        )
    }
}