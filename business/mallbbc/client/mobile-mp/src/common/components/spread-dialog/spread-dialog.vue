<template>
    <!--开屏图-->
    <view class="open_screen" :class="{ showDialog: isShow }" v-if="isShow" @touchmove.stop.prevent="() => { }">
        <view class="open_screen_con" @click="gotoGoods_detail" :style="{
            marginTop: home_page_img[0].marginList[0] * 2 + 'rpx' || 0,
            marginRight: home_page_img[0].marginList[1] * 2 + 'rpx' || 0,
            marginBottom: home_page_img[0].marginList[2] * 2 + 'rpx' || 0,
            marginLeft: home_page_img[0].marginList[3] * 2 + 'rpx' || 0
        }">
            <view class="con_img" @click.stop="close_openScreen">
                <image :src="openscnImg"></image>
            </view>
            <image class="open_screen_con_img image_mode_fill_h5" mode="scaleToFill" :src="home_page_img[0].imgUrl"
                :style="{ width: width + 'rpx', 'height': height + 'rpx' }"></image>
        </view>
    </view>
</template>
<script>
import { skipTo, setStorageSync, getStorageSync, formateDateToString } from "@/utils/common.js";
export default {
    name: "deco-spread-dialog",
    components: {},
    props: {
        // 开屏图装修数据
        openScreenData: {
            type: String,
            default: null
        }
    },
    data() {
        return {
            isShow: false,//是否展示开屏图
            openscnImg: "https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/common/icon/close_screen.png",//关闭按钮
            width: '',//开屏图宽度
            height: '',//开屏图高度
            home_page_img: [],//开屏图数据
            loopShowTime: 0, //开屏图展示间隔
            ifShowOneTime: false, // 是否只展示一次
            maxShowTimeInDay: '不限' // 每天最大展示次数
        };
    },
    computed: {},
    mounted() {
        this.homePageImgBis(this.openScreenData);
    },
    methods: {
        //处理开屏图
        homePageImgBis(showTip) {
            if (showTip != null) {
                this.home_page_img = JSON.parse(showTip)
                if (this.home_page_img[0].imgUrl) {
                    const { windowWidth, windowHeight } = uni.getSystemInfoSync();
                    this.width = this.home_page_img[0].width || windowWidth * 0.75 * 1.8;
                    this.height = this.home_page_img[0].height || windowHeight * 0.56 * 1.8;
                    if (this.home_page_img.length > 0) {
                        if (this.home_page_img[0].loopShowTime?.intervalType == '0') {
                            this.loopShowTime = (this.home_page_img[0].loopShowTime?.intervalDays || 0) * 24 * 60 * 60 * 1000;
                        } else {
                            this.ifShowOneTime = true
                        }
                        this.maxShowTimeInDay = this.home_page_img[0]?.maxShowTime || '不限'
                    }
                    this.setHomePageImg();
                }
            }
        },
        //关闭首页广告屏
        close_openScreen() {
            this.isShow = false;
        },
        //点击开屏图跳转到详情页面
        gotoGoods_detail() {
            this.isShow = false;
            let osValue = this.home_page_img[0];
            skipTo(osValue, this);
        },
        //配置开屏图展示逻辑
        setHomePageImg() {
            // 开屏展示时间的缓存
            let cookievalue = getStorageSync('openScreenShowTime');
            // 日期展示次数的缓存 { '2022-12-28':1 }
            const dateShowTimeStorage = getStorageSync('dateShowTimeObj') || {};

            // 今天时间对象
            const currentDate = new Date(); // '2023-01-05 00:52:00'
            const dateStr = formateDateToString(currentDate, 'yyyy-MM-dd');

            // 判断是否满足日展示要求函数
            const judgeMaxShowTimeInDay = () => {
                // 每天显示次数约束

                // 如果不限次数
                if (this.maxShowTimeInDay === '不限') {
                    this.isShow = true
                    setStorageSync('openScreenShowTime', currentDate.getTime())
                    operateShowTimeStorage()
                }
                // 限制次数
                else {
                    const currentHasShowTime = dateShowTimeStorage[dateStr] || 0;
                    // 如果小于当天限制次数则正常展示
                    if (this.maxShowTimeInDay > currentHasShowTime) {

                        this.isShow = true
                        setStorageSync('openScreenShowTime', currentDate.getTime())
                        operateShowTimeStorage()
                    }
                }
            }

            // 操作日期展示次数缓存函数
            const operateShowTimeStorage = () => {
                // 如果当天的值不存在，默认赋1
                if (!dateShowTimeStorage[dateStr]) {
                    dateShowTimeStorage[dateStr] = 1
                }
                // 存在累加
                else {
                    const timeNumber = dateShowTimeStorage[dateStr] + 1;

                    dateShowTimeStorage[dateStr] = timeNumber
                }
                setStorageSync('dateShowTimeObj', dateShowTimeStorage)
            }

            // 最近展示时间不存在，表示从未展示过，所以必须展示
            if (!cookievalue) {

                this.isShow = true;
                // 初始默认赋1
                dateShowTimeStorage[dateStr] = 1
                setStorageSync('openScreenShowTime', currentDate.getTime());
                // 存储显示开屏图的日期以及当天展示的次数
                setStorageSync('dateShowTimeObj', dateShowTimeStorage);

            }
            // 如果今天为展示的第一天或者本身就是展示日，则间隔天数约束不生效，单独判断日展示次数
            else if (formateDateToString(new Date(cookievalue), 'yyyy-MM-dd') === dateStr) {
                judgeMaxShowTimeInDay()
            }
            // 非仅展示一次并且间隔为0时，表示每天都展示
            // 或者
            // 非仅展示一次并且间隔大于0时，表示满足间隔天数即展示
            else if (!this.ifShowOneTime && (this.loopShowTime == 0 || (this.loopShowTime > 0 && currentDate.getTime() * 1 - cookievalue * 1 >= this.loopShowTime))) {
                judgeMaxShowTimeInDay()
            }
            else {
                this.isShow = false;
            }

        }
    }
};
</script>
<style lang="scss" scoped>
@keyframes hideDialog {
    0% {
        opacity: 1;
    }

    25% {
        opacity: 0.75;
    }

    50% {
        opacity: 0.5;
    }

    75% {
        opacity: 0.25;
    }

    100% {
        opacity: 0;
    }
}

@keyframes showDialog {
    0% {
        opacity: 0;
    }

    25% {
        opacity: 0.25;
    }

    50% {
        opacity: 0.5;
    }

    75% {
        opacity: 0.75;
    }

    100% {
        opacity: 1;
    }
}

.open_screen {
    width: 750rpx;
    height: calc(100vh);
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    margin: 0 auto;
    background-color: rgba(0, 0, 0, 0.3);
    z-index: 99999;
    animation: 500ms hideDialog linear forwards;
}

.showDialog {
    animation: 500ms showDialog linear forwards;
}

.open_screen .open_screen_con {
    margin: 0 auto;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border-radius: 15rpx;
}

.open_screen .open_screen_con .open_screen_con_img {
    max-width: 580rpx !important;
    max-height: 776rpx !important;
    background-size: contain;
    border-radius: 15rpx;
}

.open_screen .open_screen_con .con_img {
    width: 58rpx;
    height: 58rpx;
    position: absolute;
    bottom: -72rpx;
    left: 50%;
    margin-left: -29rpx;
}

.open_screen_con .con_img image {
    width: 100%;
    height: 100%;
}</style>