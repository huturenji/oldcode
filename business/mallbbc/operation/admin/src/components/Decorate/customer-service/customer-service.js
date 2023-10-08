/* eslint-disable react/react-in-jsx-scope */
import { Component } from 'react';
import { connect } from 'dva/index';
import { Form} from 'antd';
import { sldSvgIcon,sldComLanguage,getSession,removeSession} from '@/utils/utils';

// eslint-disable-next-line no-unused-vars
import global from '@/global.less';
import styles from '../common/css/index.less';

@connect(({ mdecorate }) => ({
    mdecorate
}))
@Form.create()

//客服组件
export default class CustomerService extends Component {
    constructor(props){
        super(props)
        this.state={
            initData:{
                props : {
                    isShowStyle:false,
                    tel : 15288888888,//联系方式
                    text : `${sldComLanguage('客服电话：')}`//文本内容
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
        }
        handleCurSelData(data)
    }

    //保存装修时改变数据
    compChangeData=()=>{
    }

    render() {
        const { data } = this.props;
        let con = <div
            className={styles.kefu} 
        >
            {sldSvgIcon('#666', 15, 15, 'phone')}
            <span className={styles.text}>{data.props.text}</span>
            <span>{data.props.tel}</span>
        </div>;
        return con;
    }

}