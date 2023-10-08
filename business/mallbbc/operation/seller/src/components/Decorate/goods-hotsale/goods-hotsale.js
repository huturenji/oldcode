
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
export default class HotSale extends React.PureComponent {
    constructor(props){
        super(props)
        this.state={
            initData:{
                props : {
                    isShowStyle:false,
                    filterNosaleGoods: true, // 是否隐藏不可售商品
                    leftText: {
                        img: '',//图片绝对地址
                        img_path: '',//图片相对地址
                        title:'',
                        url: '', //链接值
                        url_type: '',//链接类型
                        width: '100%',
                        height: '100%'
                    },
                    rightText:{
                        img: '',//图片绝对地址
                        img_path: '',//图片相对地址
                        title:'',
                        url: '', //链接值
                        url_type: '',//链接类型
                        width: '100%',
                        height: '100%'
                    }
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
                    ids: [],
                    info: []
                }]
            }
        }
    }

    componentWillMount() {
        this.initData()
    }

    componentWillReceiveProps (nextProps){
        let {data} = nextProps
        if(getSession(`${data.name}_${data.id}`)){
            this.compChangeData(data)
            removeSession(`${data.name}_${data.id}`)
        }
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
        }
        handleCurSelData(data)
    }

    //保存装修时改变数据
    compChangeData=()=>{}

    render() {
        const { data } = this.props;
        const con = (<div
            className={`${styles.tablan_wrap} ${global.flex_column_start_start}`}
        >
            <div>
                <div className={`${styles.hotSale_item} ${global.flex_com_column_start_start}`}>
                    <div style={{padding:10,width:'100%'}} className={`${styles.hotSale_text} ${global.flex_com_space_between}`}>
                        <div className={`${styles.hotSale_left}`} style={{backgroundImage:`url(${!data.props.leftText.title&&data.props.leftText.img?data.props.leftText.img:''})`,width:!data.props.leftText.title&&data.props.leftText.img?60:'',height:20}}>{data.props.leftText.title?data.props.leftText.title:(data.props.leftText.img?'':'文字描述/图片')}</div>
                        <div className={`${styles.hotSale_right}`} style={{backgroundImage:`url(${!data.props.rightText.title&&data.props.rightText.img?data.props.rightText.img:''})`,width:!data.props.leftText.title&&data.props.leftText.img?60:'',height:20}}>{data.props.rightText.title?data.props.rightText.title:(data.props.rightText.img?'':'文字描述/图片')}</div>
                    </div>
                </div>
                <img
                    style={{ width: '100%', height: 200, marginBottom: 5 }}
                    src={require('@/assets/img/decorate/goods_hotsale/hotsale.png')}
                />
            </div>
        </div>)
        return con;
    }
}
