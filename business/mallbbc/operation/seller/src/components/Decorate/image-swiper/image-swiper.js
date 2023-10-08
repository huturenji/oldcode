import { connect } from 'dva/index';
import React, { Component } from 'react';
import { Form } from 'antd';
import Slider from 'react-slick';
import ALibbSvg from '@/components/ALibbSvg';
import {
    getSession,
    removeSession
} from '@/utils/utils';
import { sld_com_empty_arrar_4 } from '@/utils/util_data';
import global from '@/global.less';
import styles from '../common/css/index.less';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

@connect(({ mdecorate }) => ({
    mdecorate
}))
@Form.create()


// 轮播组件
export default class Swiper extends Component {
    constructor(props) {
        super(props)
        this.state = {
            stateData: {

            },
            initData: {
                props: {
                    isShowStyle: false,
                    autoplaySpeed: 3, // 轮播间隔时长，单位：秒
                    showVague: false,//是否展示高斯模糊
                    dataType: 'img',//轮播数据是图片还是商品
                    sources: 'upload',
                    filterNosaleGoods: true,
                    showGoodsNum: 0,
                    imageSpacing: ''
                },
                styles: [{
                    padding: ['', '', '', ''],
                    margin: ['', '', '', ''],
                    background: {
                        color: '',//背景颜色
                        img: '',//背景图
                        opacity: '100',//背景透明度
                        scroll: true//固定模式
                    }
                }],
                data: []
            }
        }
    }

    componentWillMount() {
        this.initData()
    }

    componentWillReceiveProps(nextProps) {
        let { data } = nextProps
        if (getSession(`${data.name}_${data.id}_init`)) {
            this.initData()
            removeSession(`${data.name}_${data.id}_init`)
        }
    }

    //初始化数据
    initData = () => {
        let { initData } = this.state
        let { data, handleCurSelData } = this.props
        if (data.props.firstInit) {
            data.props = { ...data.props, ...initData.props }
            data.styles = initData.styles
            data.data = initData.data
            data.children = initData.children
            data.props.firstInit = false
            handleCurSelData(data)
        }
    }

    render() {
        let { data } = this.props
        let con = null;
        const settings = {
            dots: true,
            infinite: true,
            speed: 500,
            slidesToShow: 1,
            slidesToScroll: 1
        };
        if (data.props.dataType === 'img' && data.data && data.data.length !== 0) {
            /* 轮播图片 */
            con =
                <div>
                    <Slider {...{
                        dots: true,
                        infinite: true,
                        speed: 500,
                        slidesToShow: 1,
                        slidesToScroll: 1,
                        className: 'common',
                        autoplay: true,
                        autoplaySpeed: 2000
                    }}
                    >
                        {data.data.map((item, index) =>
                            <div
                                className={`${styles.lunbo_wrap} ${global.flex_row_common}`}
                                key={`img${index}`}
                            >
                                <div style={{ width: "100%" }} className={`${styles.empty_swiper_img} ${global.flex_column_center_center}`}>
                                    <img src={item.img || require('@/assets/img/decorate/image-swiper/default.png')} />
                                </div>
                            </div>
                        )}
                    </Slider>
                </div>
        } else if (data.props.dataType === 'goods') {
            /* 轮播商品 */
            con =
                <div>
                    <div
                        className={`${styles.lunbo_wrap} ${global.flex_row_common}`}
                    >
                        <div style={{ width: "100%" }} className={`${styles.empty_swiper_img} ${global.flex_column_center_center}`}>
                            <img src={require('@/assets/img/decorate/image-swiper/swiper-goods.png')} />
                        </div>
                    </div>
                </div>
        } else {
            /* 轮播图片缺省 */
            con =
                <div>
                    <Slider {...{
                        dots: true,
                        infinite: true,
                        speed: 500,
                        slidesToShow: 1,
                        slidesToScroll: 1,
                        className: 'common',
                        autoplay: true,
                        autoplaySpeed: 2000
                    }}
                    >
                        { sld_com_empty_arrar_4.map((item, index) => 
                            <div
                                className={`${styles.lunbo_wrap} ${global.flex_row_common}`}
                                key={`empty${index}`}
                                style={{ height: 150 }}
                            >
                                <div style={{ height: 150,width:"100%" }} className={`${styles.empty_swiper_img} ${global.flex_column_center_center}`}>
                                    <ALibbSvg fill="#fff" width={40.8} height={33.6} type="tupian1" />
                                    <span className={`${styles.center_tip} ${global.flex_row_common}`}>宽710*高不限</span>
                                </div>
                            </div>
                        )}
                    </Slider>
                </div>
        }

        return con;
    }

}