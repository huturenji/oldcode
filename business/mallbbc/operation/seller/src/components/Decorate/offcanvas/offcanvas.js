import { connect } from 'dva/index';
import React,{ Component } from 'react';
import { Form } from 'antd';
import styles from './index.less';
import {renderChildren} from '../common/renderComponent'
import { getSession, removeSession, guid } from '@/utils/utils';

@connect(({ mdecorate }) => ({
    mdecorate
}))
@Form.create()

export default class Offcanvas extends Component {
    constructor(props) {
        super(props)

        const uuid = guid()
        this.state = {
            initData: {
                props: {
                    isShowStyle: false
                },
                data: [{
                    guid: uuid,
                    leftTitle: { //左侧标题
                        id: uuid,
                        img: '',//图片绝对地址
                        img_path: '',//图片相对地址
                        title:'分类标题',
                        url: '', //链接值
                        url_type: ''//链接类型
                    },
                    mainTitle:{//右侧主标题
                        titleStyle: 'imgOrtext',
                        img: '',//图片绝对地址
                        img_path: '',//图片相对地址
                        title:'',
                        url: '', //链接值
                        url_type: ''//链接类型
                    },
                    subTitle:{//右侧副标题
                        titleStyle: 'none',
                        img: '',//图片绝对地址
                        img_path: '',//图片相对地址
                        title:'',//文字 或者 倒计时
                        url: '', //链接值
                        url_type: ''//链接类型
                    },
                    backgroundImg: '', //分类背景图
                    topBackgroundImg:'' //顶部分类的背景图
                }],
                children: {[uuid]:[]},
                styles: [{
                    padding:['','','',''],
                    margin:['','','',''],
                    background:{
                        color:'',//背景颜色
                        img:'',//背景图
                        opacity:'100',//背景透明度
                        scroll:true//固定模式
                    }
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
            this.compChangeData()
            removeSession(`${data.name}_${data.id}`)
        }
    }

    //初始化数据
    initData = () => {
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
    compChangeData = () => {}

    /*
     * 更改菜单选中项
     */
    changeMenuSelected = (flag,item) => {
        const { data,handleCurSelData,changeChildrenFlag } = this.props;
        if(!!flag){
            data.tempCurrChildrenKey = item.leftTitle.id;
            if(!data.children[data.tempCurrChildrenKey]){
                data.children[data.tempCurrChildrenKey] = []
            }
        }
        handleCurSelData(data);
        changeChildrenFlag(flag)
    }

    renderChildren(){
        let { data, handleCurSelData } = this.props;
        return renderChildren(data?.children[data.tempCurrChildrenKey], {handleCurSelData})
    }
    
    render() {
        const { data } = this.props;
        return (
            <div>
                <div>点击对应分类标题，可设置分类的子组件</div>
                <div>点击其他区域，可设置当前组件属性</div>
                <div className={styles.wrapper}>
                    <div className={styles.left_menu}>
                        {
                            data.data.map((item,index) => (<div
                                className={`${styles.left_menu_item} ${item.id === data.tempCurrChildrenKey && styles.selectded_menu_item}`}
                                onClick={() => this.changeMenuSelected(true,item)}
                                key={index}
                            >
                                <span className={styles.left_menu_item_text}>{item.leftTitle.title}</span>
                            </div>))
                        }
                    </div>
                    <div className={styles.category_wrapper} onClick={() => this.changeMenuSelected(false)}>
                        {/* 标题 */}
                        <div className={styles.category_title}>
                            <p className={styles.right_main_text}>主标题</p>
                            <p>副标题</p>
                        </div>
                        {/* 渲染子组件 */}
                        {this.renderChildren()}
                        {/* <div className={styles.showMore}>
                        --向下滑动前往<span className={styles.showMoreText}>“{data.data[data.nav_current + 1]?.leftTitle?.title}”</span>--
                    </div> */}
                    </div>
                </div>
            </div>
        )
    }
}
