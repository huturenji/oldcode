<template>
    <view class="seckillAll">
        <view class="seckillEntry" @click="goDetail(decoItem.props.linkdata)"
            :style="[styles, { borderRadius: decoItem.props.borderRadius * 2 + 'rpx' }]">
            <view class="seckillEntryTop">
                <view class="seckillEntryTopLeft">
                    <view class="leftTitle">{{ decoItem.props.leftText.title }}
                        <image mode="heightFix" v-if="!decoItem.props.leftText.title"
                            :src="decoItem.props.leftText.title ? '' : decoItem.props.leftText.img" />
                    </view>
                    <view class="distanceTime"
                        v-if="(decoItem.props.seckillType == 'vop' && (judgeState == 1 || judgeState == 2)) && !is_show_empty">
                        <view class="session isScale fontScaleIgnore">{{ showStage }}</view>
                        <view class="right">
                            <view class="sec_kill_countdown num-font fontScaleIgnore" v-if="judgeState == 2">
                                <text class="time">{{ secKillHr }}</text>
                                <text class="time_tips">:</text>
                                <text class="time">{{ secKillMin }}</text>
                                <text class="time_tips">:</text>
                                <text class="time">{{ secKillSec }}</text>
                            </view>
                            <view v-else-if="judgeState == 1" class="willSatrt fontScaleIgnore">即将开始</view>
                        </view>
                    </view>
                </view>

                <view class="seckillEntryTopRight">{{ decoItem.props.rightText.title }}
                    <image mode="heightFix" :src="decoItem.props.rightText.title ? '' : decoItem.props.rightText.img"
                        v-if="!decoItem.props.rightText.title" />
                    <text class="iconfont icon_arrow_right" v-if="decoItem.props.rightText.title"></text>
                </view>
            </view>

            <view class="seckillEntryBottom">
                <view class="seckillEntryGoods flex_row_between_center" v-if="!!goods_list && loadGoodsList">
                    <thumbSeckillIndex v-for="(item, index) in goods_list" :key="index" :goods_info="item"
                        :seckillVopType="decoItem.props.seckillType == 'vop' ? true : false" class="goodsItem">
                    </thumbSeckillIndex>

                    <template v-if="goods_list.length < 4">
                        <view class="defaultGoodsItem" v-for="i in (4 - goods_list.length)" :key='i'>
                            <view class="defaultImg">
                                <img :src="loadingImage" />
                            </view>
                            <view class="defaultPriceBox">
                                <view class="defaultTop"></view>
                                <view class="defaultBottom"></view>
                            </view>
                        </view>
                    </template>
                </view>

                <!-- 骨架图 -->
                <view>
                    <view class="empty flex_row_between_center" v-if="!loadGoodsList && !is_show_empty">
                        <view class="defaultGoodsItem" v-for="i in countNum" :key='i'>
                            <view class="defaultImg animated-background">
                                <img :src="loadingImage" />
                            </view>
                            <view class="defaultPriceBox">
                                <view class="defaultTop first-animated-background"></view>
                                <view class="defaultBottom animated-background"></view>
                            </view>
                        </view>
                    </view>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
import thumbSeckillIndex from "@/common/components/thumb/thumb-seckill-index.vue";
import { skipTo, isNotEmpty } from '@/utils/common.js';
import goodsHandler from "@/views/components/goods/handler.js";
import indexMixin from "@/common/components/decorate/common/mixin/index";
export default {
    name: "deco-goods-seckill-entry",
    mixins: [indexMixin],
    data() {
        return {
            time_list: [],
            goods_list: [],
            pageNum: 1, //当前页数
            pageSize: 20,
            stage_id: '', //场次id
            showStage: '', //入口显示的场次
            currentIndex: 0,
            judgeState: 0, //判断当前秒杀入口显示的状态 0-，1-即将开始，2-进行中
            is_show_empty: false, //是否能显示秒杀商品
            loadGoodsList: false, //是否加载完商品数据
            secKillHr: '', //距离下场秒杀活动开始（进行中） 时
            secKillMin: '', //距离下场秒杀活动开始（进行中） 分
            secKillSec: '',//距离下场秒杀活动开始（进行中） 秒
            countNum: 4,
            loadingImage: ''
        }
    },
    props: {
        decoItem: {},
    },
    computed: {
        // 设置秒杀入口组件背景以及圆角样式
        setBackground() {
            let obj = {};
            if (isNotEmpty(this.decoItem.styles[0].background)) {
                obj = { ...this.decoItem.styles[0].background }
            }
            return obj;
        }
    },
    watch: {
        decoItem: {
            handler(val) {
                if (isNotEmpty(val)) {
                    this.initBackgroud(val)
                    this.initSpace(val)
                    if (val.props.seckillType == "vop") {
                        this.promotionId = val.data[0].vopdata.info.promotionId
                        this.getSessionList();
                    } else if (val.props.seckillType == "union") {
                        this.getGoodsList();
                    }
                }

            },
            deep: true,
            immediate: true
        }
    },
    mounted() {
    },
    components: {
        thumbSeckillIndex
    },
    methods: {
        // 查看更多跳转
        goDetail(item) {
            skipTo(item, this);
        },
        // 获取场次列表
        getSessionList() {
            let _this = this
            goodsHandler.getTodaySeckillStage({
                promotionId: _this.promotionId
            }).then((res) => {
                if (res.state == 200) {
                    let result = res.data.seckillStages
                    if (result != null && result.length > 0) {
                        _this.time_list = result
                        _this.pageNum = 1;
                        let countTime;
                        let showItem = _this.time_list.find((value) => value.logicState > 1);
                        if (showItem.logicState == 2) {
                            _this.judgeState = 2;
                            _this.stage_id = showItem.stageId;
                            _this.showStage = showItem.stageAliar.substring(0, 2) + '点场';
                            countTime = showItem.distanceEndTime;
                            _this.getGoodsList();
                        } else if (showItem.logicState == 3) {
                            _this.judgeState = 1;
                            _this.stage_id = showItem.stageId;
                            _this.showStage = showItem.stageAliar.substring(0, 2) + '点场';
                            _this.getGoodsList();
                        }
                        _this.getAllTime(countTime);
                        _this.secInterval = setInterval(() => {
                            if (countTime == 0) {
                                //倒计时结束，清除倒计时
                                clearInterval(_this.secInterval);
                                this.getSessionList();
                            } else {
                                countTime--;
                                _this.getAllTime(countTime);
                            }
                        }, 1000)
                    } else {
                        _this.is_show_empty = true
                        _this.loadGoodsList = true
                    }
                } else if (res.state == 255) {
                    _this.is_show_empty = true
                    _this.loadGoodsList = true
                } else {
                    uni.showToast({
                        title: res.msg,
                        icon: 'none'
                    })
                }
            }).finally(() => {
            });
        },
        getGoodsList() {
            let _this = this
            var param = {}
            param.pageSize = this.pageSize;
            param.pageIndex = this.pageNum;
            let apiType = this.decoItem.props.seckillType == "vop" ? 'getSeckillProductList' : 'getUnionGoodsList'
            if (this.decoItem.props.seckillType == "vop") {
                apiType = 'getSeckillProductList'
                param.stageId = _this.stage_id
                param.promotionId = this.promotionId;
            } else {
                apiType = 'getUnionGoodsList'
                param.recommendId = this.decoItem.data[0].uniondata.recommendId
                param.storeId = this.decoItem.data[0].uniondata.storeId
            }
            goodsHandler[apiType](param).then(async (res) => {
                if (res.state == 200) {
                    _this.loadGoodsList = true;
                    let result = res.data
                    if (_this.pageNum == 1) {
                        _this.goods_list = result.list
                    } else {
                        _this.goods_list = _this.goods_list.concat(result.list)
                    }

                    if (_this.goods_list.length > 4) {
                        _this.goods_list = _this.goods_list.splice(0, 4);
                    }
                    if (_this.goods_list.length > 0) {
                        _this.is_show_empty = false;
                    } else {
                        _this.is_show_empty = true;
                    }
                } else {
                    _this.is_show_empty = true;
                    _this.loadGoodsList = false;
                    uni.showToast({
                        title: res.msg,
                        icon: 'none'
                    })
                }

            });
        },

        // 场次开始倒计时处理
        getAllTime(countTime) {
            let hours = parseInt(countTime / 60 / 60 % 24);
            let minutes = parseInt(countTime / 60 % 60);
            let seconds = parseInt(countTime % 60);
            this.secKillHr = hours > 9 ? hours : '0' + hours;
            this.secKillMin = minutes > 9 ? minutes : '0' + minutes;
            this.secKillSec = seconds > 9 ? seconds : '0' + seconds;

        },

        // 获取商品的库存状态
        getListStock(Info) {
            return new Promise((resolve) => {
                goodsHandler.checkStock({
                    skuInfos: Info
                }).then(res => {
                    if (res.state == 200 && res.data && res.data.skuStockList && res.data.skuStockList.length > 0) {
                        resolve(res.data.skuStockList);
                    }
                }).catch(e => {
                    console.log(e)
                })
            })
        }

    }
}
</script>

<style lang="scss" scoped>
.seckillAll {
    display: flex;
}

.seckillEntry {
    width: 100%;
    padding: 24rpx 20rpx 24rpx 20rpx;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    // background-color: #fff;
    border-radius: 20rpx;

    .seckillEntryTop {
        display: flex;
        justify-content: space-between;
        align-items: flex-end;

        .seckillEntryTopLeft {
            margin-left: 8rpx;
            font-size: 24rpx;
            color: #222222;
            background-repeat: no-repeat;
            background-position: center;
            background-size: cover;
            display: flex;
            align-items: center;
            justify-content: space-between;

            .leftTitle {
                display: flex;
                align-items: center;
                justify-content: center;
                margin-right: 16rpx;

                image {
                    width: auto;
                    height: 32rpx;
                }
            }

            .distanceTime {
                width: 208rpx;
                height: 34rpx;
                border-radius: 8rpx;
                overflow: hidden;
                display: flex;
                align-items: center;
                justify-content: center;
                background: url('https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/seckill/bg_xs_time.png') center no-repeat;
                background-size: 100% 100%;

                .session.fontScaleIgnore {
                    width: 50%;
                    height: 100%;
                    font-size: 24rpx;
                    color: #fff;
                    display: flex;
                    align-items: center;
                    padding-left: 32rpx;
                    font-weight: 500;
                }

                .isScale {
                    transform: scale(0.8);
                    white-space: nowrap;
                }

                .right {
                    flex: 1;
                    height: 100%;
                    color: #f30300;
                    padding-left: 4rpx;
                    font-weight: 400;
                    display: flex;
                    align-items: center;
                    justify-content: center;

                    .sec_kill_countdown.fontScaleIgnore {
                        flex: 1;
                        height: 100%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 22rpx;
                    }

                    .willSatrt.fontScaleIgnore {
                        font-size: 20rpx;
                        font-weight: bold;
                    }
                }
            }
        }

        .seckillEntryTopRight {
            font-size: 26rpx;
            font-weight: 400;
            color: #222222;
            background-repeat: no-repeat;
            background-position: center;
            background-size: cover;
            display: flex;
            align-items: center;

            image {
                width: auto;
                height: 36rpx;
            }

            .icon_arrow_right {
                font-size: 16rpx;
                margin-left: 4rpx;
                color: #222222;
            }
        }
    }

    .seckillEntryBottom {
        width: 100%;
        margin-top: 26rpx;

        .goodsItem {
            width: 23%;
        }
    }

}

.empty {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.defaultGoodsItem {
    width: 23%;
    padding: 12rpx 12rpx 18rpx;
    background: #fff;
    border-radius: 12rpx;

    .defaultImg {
        width: 100%;

        img {
            width: 100%;
        }
    }

    .defaultPriceBox {
        margin-top: 12rpx;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;

        .defaultTop {
            width: 100rpx;
            height: 24rpx;
            background: #eaeff4;
            border-radius: 4rpx;
            overflow: hidden;
        }

        .defaultBottom {
            width: 80rpx;
            height: 24rpx;
            background: #eaeff4;
            border-radius: 4rpx;
            overflow: hidden;
            margin-top: 12rpx;
        }
    }
}

.animated-background {
    animation-name: placeHolderShimmer;
    animation-duration: 0.75s;
    animation-iteration-count: infinite;
    animation-direction: alternate;
    animation-timing-function: ease;
    position: relative;
}

.first-animated-background {
    animation-name: placeHolderShimmer;
    animation-duration: 0.75s;
    animation-iteration-count: infinite;
    animation-direction: alternate;
    animation-timing-function: ease;
    background: #ffadad !important;
    position: relative;
}

@keyframes placeHolderShimmer {
    0% {
        opacity: 1;
    }

    100% {
        opacity: 0.15;
    }
}
</style>