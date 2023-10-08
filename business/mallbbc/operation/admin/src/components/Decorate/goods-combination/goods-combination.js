import React,{ Component }from 'react'
import { connect } from 'dva/index';
import { Form} from 'antd';
import styles from './goods-combination.less'
import commonStyles from '../common/css/index.less';
import {
    getSession,
    guid,
    removeSession
} from '@/utils/utils';

@connect(({ mdecorate }) => ({
    mdecorate
}))
@Form.create()
export default class GoodsCombination extends Component {
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
                data : [
                    {
                        iconStyle : { // icon样式
                            type: 0, // 标签类型（0无 1斜标（左上）2斜标(右上) 3火标 4圆标 5圆角标(左上) 6圆角标(中间) 7书签标）
                            iconText: '', // 标签内容
                            positionX: '', // 位置横坐标
                            positionY: '',// 位置纵坐标
                            iconTextColor:'', // 标签文本颜色
                            background:{color:'',img:'',opacity:''} // 组件背景属性
                                    
                        },
                        priceStyle : { // 价格划线样式
                            priceStyleType: 0, // 价格样式类型（0常规样式 1划线价样式）
                            positionX: '', // 常规价格横坐标
                            positionY: '', // 常规价格纵坐标
                            originPositionX:'',// 划线价格横坐标
                            originPositionY:'',// 划线价格纵坐标
                            priceFontSize:12, // 价格大小
                            priceSymbolAndDemicalSize: 12,// 价格符号和小数
                            priceColor: '', // 价格颜色
                            originPriceSize: 12,// 划线价大小
                            originPriceColor: '', // 划线价颜色
                            ifShowPriceSymbol: 1, // 是否展示价格符号
                            ifShowOriginPriceSymbol:1, // 是否展示价格符号
                            priceDemicalCount:2, //价格小数位数
                            originPriceDemicalCount:2 //划线价格小数位数
                        },
                        data : {
                            ids: [],
                            info: []
                        },
                        uuid:guid()
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
    
    /*
     * 设置外层容器的背景以及边距样式
     */
    changeContainerStyle = () => {
        let {data} = this.props
        let styleObj = {
            marginTop: `${data.styles[0].margin[0] || 0}px`,
            marginBottom: `${data.styles[0].margin[2] || 0}px`,
            marginLeft: `${data.styles[0].margin[3] || 0}px`,
            marginRight: `${data.styles[0].margin[1] || 0}px`,
            paddingTop: `${data.styles[0].padding[0] || 0}px`,
            paddingBottom: `${data.styles[0].padding[2] || 0}px`,
            paddingLeft: `${data.styles[0].padding[3] || 0}px`,
            paddingRight: `${data.styles[0].padding[1] || 0}px`,
            opacity: `${data.styles[0].background[0]?.opacity || 100}%`
        };
        // if (data.props.isShowStyle && data.styles[0].background) {
        //     switch (data.styles[0].background.colorselect) {
        //     case 'img':
        //         styleObj = Object.assign(styleObj, { backgroundImage: `url('${data.styles[0].background.img}')`, backgroundRepeat: 'no-repeat', backgroundSize: '100% 100%' });
        //         break;
        //     case 'colorInput':
        //         styleObj = Object.assign(styleObj, {
        //             backgroundColor: data.styles[0].background.colorInput
        //         });
        //         break;
        //     case 'colorFinder':
        //         styleObj = Object.assign(styleObj, {
        //             backgroundColor: data.styles[0].background.colorFinder
        //         });
        //         break;
        //     default:
        //         break;
        //     }
        // }
        return styleObj;
    }

    /*
     * 处理价格
     * @param price:价格
     * @param priceType:价格类型
     * return 处理后的价格整数/小数
     */
    handlePrice = (price, priceType) => {
        if (!price) {
            return '0.00'
        }
        if (priceType === 'integer') {
            return price ? price.toString().split('.')[0] : '0';
        }
        if (!price.toString().split('.')[1]) {
            return (`00`)
        } if (price.toString().split('.')[1].length==1) {
            return (`${price.toString().split('.')[1]}0`)
        } 
        return (price.toString().split('.')[1])
            
           
    }


    /*
     * 设置标签背景样式
     * return 返回样式对象
     */
    setIconBackgroundStyle= (item) => {
        let styleObj = { color: `${item.iconStyle.iconTextColor || 'white'}` };
        let backgroundStyle = {};
        if (item.iconStyle.background) {
            backgroundStyle.opacity = `${item.iconStyle.background.opacity || 100}%`
            item.iconStyle.background.img?backgroundStyle.backgroundImage = `url(${item.iconStyle.background.img})`:backgroundStyle.background = item.iconStyle.background.color
        }

        return Object.assign(styleObj, backgroundStyle);
    }

    /*
     * 设置标签缩放比例
     */
    setIconScaleRatio = (item) => {
        const { data } = this.props;
        const scaleStyle = {};
        let styleValue = '';

        // 圆中标每次缩放的定位点会根据x位置变化
        if(item.iconStyle.type == 6){
            scaleStyle.transformOrigin = 'top left';
            if(item.iconStyle.positionX == 50){
                scaleStyle.transformOrigin = 'top center';
                styleValue = 'translate(-50%)'
            }
        }
        switch (data.data.length) {
        case 2:
            styleValue += ' scale(0.5)';
            break;
        case 3:
            styleValue += ' scale(0.33)';
            break;
        case 4:
            styleValue += ' scale(0.25)';
            break;
        default:
            styleValue += ' scale(1)';
            break;
        }
        scaleStyle.transform = styleValue;
        return scaleStyle;
    }

    render() {
        let con = null;
        const { data } = this.props;
        con = <div style={this.changeContainerStyle()}>
            <div
                className={styles.container}
                style={{ height: data.data[0].data.info.length === 0 ? '140px' : 'auto' }}
            >

                {
                    data.data.length>0 && data.data.map((item1) => (
                        <div
                            className={`${styles.good_item} ${styles.good_box}`}
                        >
                            {/* 背景图 */}
                            {item1.data.info.length>0 && item1.data.info.map((item) => <img src={`${item.uploadImage || item.imgUrl || item.mainImage}`} style={{ width: '100%' }} />)}

                            {item1.data.info.length>0 && item1.data.info.map((item) => <div className={styles.price_wrapper} style={{ top: `${item1.priceStyle.positionY !== '' ? `${item1.priceStyle.positionY}` : '60'}%`, left: `${item1.priceStyle.positionX !== '' ? `${item1.priceStyle.positionX}` : '50'}%`, transform: `${item1.priceStyle.positionX !== '' ? 'none' : 'translateX(-50%)'}` }}>
                                {/* 现价*/}
                                <p
                                    className={`${styles.good_item_price} ${commonStyles.numFont}`}
                                    style={{
                                        fontSize: `${item1.priceStyle.priceSymbolAndDemicalSize || 12}px`,
                                        color: `${item1.priceStyle.priceColor || '#F5222D'}`,
                                        fontWeight:'bold'
                                    }}
                                >
                                    {item1.priceStyle.ifShowPriceSymbol === 1 ? '¥' : ''}
                                    <span style={{ fontSize: `${item1.priceStyle.priceFontSize || 14}px` }}>{this.handlePrice(item.showPrice||item.salePrice, 'integer')}</span>
                                    {item1.priceStyle.priceDemicalCount!=0 && <span>.{this.handlePrice(item.showPrice||item.salePrice, 'demical').slice(0,item1.priceStyle.priceDemicalCount)}</span>}
                                </p>
                            </div>)}

                            {item1.data.info.length>0 && item1.data.info.map((item) => <div className={styles.price_wrapper} style={{ top: `${item1.priceStyle.originPositionY !== '' ? `${item1.priceStyle.originPositionY}` : '70'}%`, left: `${item1.priceStyle.originPositionX !== '' ? `${item1.priceStyle.originPositionX}` : '50'}%`, transform: `${item1.priceStyle.originPositionX !== '' ? 'none' : 'translateX(-50%)'}` }}>
                                {/* 原价 */}
                                {
                                    item1.priceStyle.priceStyleType === 1 &&
                                    <p
                                        className={`${styles.good_item_origin_price} ${commonStyles.numFont}`}
                                        style={{ fontSize: `${item1.priceStyle.originPriceSize || 12}px`, color: `${item1.priceStyle.originPriceColor || '#000'}` }}
                                    >
                                        {item1.priceStyle.ifShowOriginPriceSymbol === 1 ? '¥' : ''}
                                        <span style={{ fontSize: `${item1.priceStyle.originPriceSize || 14}px` }}>{this.handlePrice(item.showPrice||item.salePrice, 'integer')}</span>
                                        {item1.priceStyle.originPriceDemicalCount!=0 && <span>.{this.handlePrice(item.showPrice||item.salePrice, 'demical').slice(0,item1.priceStyle.originPriceDemicalCount)}</span>}
                                    </p>
                                }
                            </div>)}

                            {/*左斜标*/}
                            {
                                item1.iconStyle.type == 1 && <div
                                    className={styles.oblique_icon_wrapper}
                                    style={
                                        {
                                            top: `${item1.iconStyle.positionY || '0'}%`,
                                            left: `${item1.iconStyle.positionX || '0'}%`,
                                            transformOrigin : 'left top',
                                            ...this.setIconScaleRatio(item1)
                                        }}
                                >
                                    <div
                                        className={`${styles.oblique_icon_common_style} ${styles.left_oblique_icon}`}
                                        style={
                                            {
                                                ...this.setIconBackgroundStyle(item1)

                                            }}

                                    >

                                        {item1.iconStyle.iconText || '热销'}
                                    </div>
                                </div>
                            }

                            {/*右斜标*/}
                            {
                                item1.iconStyle.type == 2 && <div
                                    className={styles.oblique_icon_wrapper}
                                    style={
                                        {
                                            top: `${item1.iconStyle.positionY || '0'}%`,
                                            right: `${item1.iconStyle.positionX || '0'}%`,
                                            transformOrigin : 'right top',
                                            ...this.setIconScaleRatio(item1)
                                        }}
                                >
                                    <div
                                        className={`${styles.oblique_icon_common_style} ${styles.right_oblique_icon}`}
                                        style={
                                            {
                                                ...this.setIconBackgroundStyle(item1)

                                            }}
                                    >
                                        {item1.iconStyle.iconText || '热销'}
                                    </div>
                                </div>
                            }

                            {/*火标*/}
                            {
                                item1.iconStyle.type == 3 && <div
                                    className={`${styles.heat_icon}`}
                                    style={
                                        {
                                            top: `${item1.iconStyle.positionY || '-2'}%`,
                                            right: `${item1.iconStyle.positionX || '2'}%`,
                                            transformOrigin : 'right top',
                                            ...this.setIconBackgroundStyle(item1),
                                            ...this.setIconScaleRatio(item1)
                                        }}

                                >
                                    <span>{item1.iconStyle.iconText || '秒杀'}</span>
                                </div>
                            }

                            {/*书标*/}
                            {
                                item1.iconStyle.type == 7 && <div
                                    className={`${styles.book_icon}`}
                                    style={
                                        {
                                            top: `${item1.iconStyle.positionY || '0'}%`,
                                            left: `${item1.iconStyle.positionX || '0'}%`,
                                            backgroundPosition: `${item1.iconStyle.background.length === 0 ? '-1px -1px' : '0% 0%'}`,
                                            transformOrigin : 'left top',
                                            ...this.setIconBackgroundStyle(item1),
                                            ...this.setIconScaleRatio(item1)
                                        }}

                                >
                                    <span>{item1.iconStyle.iconText || '爆款'}</span>
                                </div>
                            }

                            {/*圆标*/}
                            {
                                item1.iconStyle.type == 4 && <div
                                    className={`${styles.circle_icon_common_style} ${styles.circle_icon}`}
                                    style={
                                        {
                                            top: `${item1.iconStyle.positionY || '2'}%`,
                                            right: `${item1.iconStyle.positionX || '2'}%`,
                                            transformOrigin : 'right top',
                                            ...this.setIconBackgroundStyle(item1),
                                            ...this.setIconScaleRatio(item1)
                                        }}
                                >

                                    {item1.iconStyle.iconText || '限时'}
                                </div>
                            }

                            {/*圆左标*/}
                            {
                                item1.iconStyle.type == 5 && <div
                                    className={`${styles.circle_icon_common_style} ${styles.circle_left_icon}`}
                                    style={
                                        {
                                            top: `${item1.iconStyle.positionY || '0'}%`,
                                            left: `${item1.iconStyle.positionX || '0'}%`,
                                            transformOrigin : 'left top',
                                            ...this.setIconBackgroundStyle(item1),
                                            ...this.setIconScaleRatio(item1)
                                        }}
                                >
                                    {item1.iconStyle.iconText || '限时'}
                                </div>
                            }

                            {/*圆中标*/}
                            {
                                item1.iconStyle.type == 6 && <div
                                    className={`${styles.circle_icon_common_style} ${styles.circle_middle_icon}`}
                                    style={
                                        {
                                            top: `${item1.iconStyle.positionY || '0'}%`,
                                            left: `${item1.iconStyle.positionX ? `${item1.iconStyle.positionX}` : '50'}%`,
                                            ...this.setIconBackgroundStyle(item1),
                                            ...this.setIconScaleRatio(item1)
                                        }}
                                >
                                    {item1.iconStyle.iconText || '特价'}
                                </div>
                            }
                        </div>

                    ))}
            </div>
        </div>
        return con;
    }
}
