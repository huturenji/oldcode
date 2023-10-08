
import React from 'react';
import { connect } from 'dva/index';
import { Form} from 'antd';
import global from '@/global.less';
import styles from './personal-center.less';
import {
    getSession,
    removeSession
} from '@/utils/utils';

@connect(({ mdecorate }) => ({
    mdecorate
}))
@Form.create()
export default class PersonalCenter extends React.PureComponent {
    constructor(props){
        super(props)
        this.state={
            initData:{
                props : {
                    isShowStyle:false,
                    showAvatarData:true,//是否展示头像
                    showNameData : true,//是否展示名称
                    showRightData:true//是否展示右侧图标
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
                    {
                        avatarData:{
                            url: '', //链接值
                            url_type: ''//链接类型
                        },
                        nameData:{
                            url: '', //链接值
                            url_type: ''//链接类型
                        },
                        rightData:{ 
                            img: '',//图片绝对地址
                            img_path: '',//图片相对地址
                            imgWidth: '',
                            title:'',
                            url: '', //链接值
                            url_type: ''//链接类型
                        }
                    }
                ]
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
        return(
            <div className={`${styles.titleWarp} ${global.flex_com_space_between}`}>
                <div className={`${global.flex_com_row_start_center}`}>
                    <div style={{ backgroundImage: `url(${require('@/assets/img/decorate/personalcenter/btn_common_touxiang_nor.png')})` }} className={`${styles.avatar}`}></div>
                    <div className={`${global.flex_com_column_center_flex_start}`}>
                        <div className={`${styles.name}`}>admin</div>
                        <div className={`${styles.memberName}`}>会员名：asdfghjkl21a2das1d5asd</div>
                    </div>
                </div>
                {data.props.showRightData&&<div className={`${global.flex_com_column_space_betweent_center}`}>
                    <div 
                        style={{
                            backgroundImage: `url(${data.data[0].rightData.img ? data.data[0].rightData.img : require('@/assets/img/decorate/1632969720109622.png')})`,
                            width: '22px',
                            height: '22px'
                        }}
                        className={`${styles.img}`}
                    ></div>
                    <div className={`${styles.title}`}>{data.data[0].rightData?.title || 'title'}</div>
                </div>}
            </div>
        )
    }
}