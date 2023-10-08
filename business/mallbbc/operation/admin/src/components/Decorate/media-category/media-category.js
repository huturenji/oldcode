
import React ,{Component} from 'react';
import { connect } from 'dva/index';
import { Form} from 'antd';
import { Scrollbars } from 'react-custom-scrollbars';
import {
    sld_com_empty_arrar_4
} from '@/utils/util_data';
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
export default class MediaCategory extends Component {
    constructor(props){
        super(props)
        this.state={
            initData:{
                props : {
                    isShowStyle:false,
                    more_news : '' //更多的跳转链接
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
        return(
            <div
                className={`${styles.tablan_wrap} ${styles.news_wrap} ${global.flex_column_start_start}`}
            >
                <Scrollbars
                    autoHide
                    autowidth="true"
                    autowidthmin={355}
                    style={{ height: 40 }}
                >
                    <div className={`${styles.tablan_top} ${global.flex_row_start_center}`}>
                        {(data.data.length == 0) ? sld_com_empty_arrar_4.map((item, index) => <div
                            key={index}
                            className={`${styles.item} ${global.flex_column_between_center}`}
                        >
                            <div className={`${styles.tab_name_part} ${global.flex_column_between_center}`}>
                                <span className={styles.tab_name}>全部</span>
                            </div>
                        </div>)
                            : data.data.map((item, index) => <div
                                key={index}
                                className={`${styles.item} ${global.flex_column_between_center}`}
                            >
                                <div className={`${styles.tab_name_part} ${global.flex_column_between_center}`}>
                                    <span className={styles.tab_name}>{item.tabName?item.tabName:'全部'}</span>
                                </div>
                            </div>)
                        }
                    </div>
                </Scrollbars>
                <div className={`${styles.news_item}`}>
                    <div className={`${styles.news_layout}`}>
                        <div className={`${styles.news_title}`}>新闻标题新闻标题新闻标题新闻标题新闻标题新闻标题新闻标题</div>
                        <div className={`${styles.news_info} ${styles.dw}`}>
					                  <div className={`${styles.auth}`}>发布机构</div>
					                  <div className={`${styles.publish_time}`}>发布时间</div>
				                </div>
                    </div>

                    <div className={`${styles.news_layout_right}`}>
				                <div className={`${styles.img_item_warp}`} style={{backgroundImage:`url(${require('@/assets/img/decorate/media/wap_style02.png')})`}} />
			              </div>
                </div> 
                <div style={{position:'absolute',right:0,top:10}}>
                    更多
                </div>
            </div>
        )
    }
}