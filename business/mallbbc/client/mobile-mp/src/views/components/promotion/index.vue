<!-- 相关活动价格在商品详情页的展示 -->
<template>
    <view class="index_for_detail" v-show="attendPromotion">
        <!-- 秒杀 -->
        <seckill 
            v-if="currentComp == 'seckill'" 
            :detail="promotionDetail" 
            :priceInfo="priceInfo"
            @initPromotionDetail="getPromotionInfo(promotionInfo)" 
            @initGoodsDetail="$emit('initGoodsDetail')">
        </seckill>
        <!-- 一起买 -->
        <together 
            v-if="currentComp == 'together'" 
            :detail="promotionDetail" 
            :priceInfo="priceInfo"
            @initPromotionDetail="getPromotionInfo(promotionInfo)" 
            @initGoodsDetail="$emit('initGoodsDetail')">
        </together>

        <!-- 天天专场 -->
        <daily 
            v-if="currentComp == 'daily'" 
            :detail="promotionDetail" 
            :priceInfo="priceInfo"
            @initPromotionDetail="getPromotionInfo(promotionInfo)" 
            @initGoodsDetail="$emit('initGoodsDetail')">
        </daily>
    </view>
</template>

<script>
import promotionHandler from "@/views/components/promotion/common/handler";
import { promotionEnum } from '@/common/lib/enum/promotion';
import seckill from "@/views/components/promotion/seckill/detail.vue"
import together from "@/views/components/promotion/together/detail.vue"
import daily from "@/views/components/promotion/daily/detail.vue"


export default {
    components: {
        seckill,
        together,
        daily,
    },
    props: {
        //商品信息
        goodsData: {
            type: Object,
            require: true
        },

        // 是否参加活动
        attendPromotion: {
            type: Boolean,
            require: false
        },

        //价格相关的信息
        priceInfo: {
            type: Object,
            default: () => { }
        }
    },
    data() {
        return {
            currentComp: '',
            currentApi: '',
            promotionId: '', //活动id
            promotionInfo: {}, //活动详情简要
            promotionDetail: {} //活动详细的信息
        };
    },
    created() {
    },
    watch: {
        'goodsData.sku': {
            handler(val) {
                this.initData(val);
            },
            immediate: true
        }
    },

    methods: {

        //获取商品参加活动相关的列表
        async initData() {
            // 初始化活动相关的接口之前，清空活动相关详情
            this.clearPromotionInfo();
            this.$emit('clearPromotionInfo');
            this.$emit('initFullDisList', [])
            return new Promise(resolve => {
                let param = {
                    sku: this.goodsData.sku,
                    storeId: this.goodsData.storeId,
                    specialofferState: 3,
                    disocuntState: 2
                }
                promotionHandler.getPromotionList(param).then(res => {
                    if (res.state == 200 && res.data?.activityList && res.data?.activityList.length > 0) {
                        if (res.data.activityList.length > 0) {
                            // 整合满优惠列表数据
                            let fullDisList = res.data.activityList.filter(item => {
                                return item.promotionGrade != 1
                            })

                            this.$emit('initFullDisList', fullDisList)

                            // 整合一级活动详情数据 
                            let oneLevelList = res.data.activityList.filter(item => {
                                return item.promotionGrade == 1
                            });

                            // 经与服务端人员沟通，一个商品只能参加一个以及活动，所以如果商品参加了一级活动有且只有一条一级活动数据【一级活动目前包括： 秒杀 拼团 阶梯团 预售 一起买 天天专场】
                            if (oneLevelList.length > 0) {
                                this.promotionInfo = oneLevelList[0]; // 更新活动的简要信息
                                this.getPromotionInfo(this.promotionInfo);
                            } else {
                                this.$emit('promotionDone');
                            }
                        }
                    } else {
                        this.$emit('promotionDone');
                    }
                    resolve(true)
                }).catch(e => {
                    console.log(e);
                    resolve(true)
                })
            })
        },

        // 清空活动详情
        clearPromotionInfo() {
            this.promotionDetail = {};
            this.currentComp = '';
            this.currentApi = '';
        },

        //整合活动详情相关的数据
        getPromotionInfo(promotionInfo) {
            this.promotionId = promotionInfo.promotionId; //活动id
            if (!!!this.promotionId) { return }
            let params = {
                sku: this.goodsData.sku,
                promotionId: this.promotionId
            };
            if (promotionInfo.promotionType == promotionEnum.SECKILL.type) { // 秒杀
                this.currentComp = 'seckill';
                this.currentApi = 'getSeckillDetail';
                params = Object.assign({}, params, {
                    stageId: this.promotionInfo?.stageId
                })
            } else if (promotionInfo.promotionType == promotionEnum.PRESELL.type) { // 预售
                this.currentComp = 'presale';
                this.currentApi = 'getPresaleDetail';
            } else if (promotionInfo.promotionType == promotionEnum.PINGROUP.type) { //拼团
                this.currentComp = 'pingroup';
                this.currentApi = 'getPinInfoDetail';
            } else if (promotionInfo.promotionType == promotionEnum.LADDER.type) { //阶梯团
                this.currentComp = 'ladder';
                this.currentApi = 'getLadderDetail';
            } else if (promotionInfo.promotionType == promotionEnum.ECBUY.type) { //一起买
                this.currentComp = 'together';
                this.currentApi = 'getBuyTogether';
                params = Object.assign({}, params, {
                    stageId: this.promotionInfo?.stageId
                })
            } else if (promotionInfo.promotionType == promotionEnum.DAILY.type) { //天天专场 目前天天专场活动是没有详情接口的
                this.currentComp = 'daily';
                this.currentApi = '';
            }
            this.getPromotionDetail(params, promotionInfo.promotionType);
        },

        // 获取活动详情
        getPromotionDetail(param, promotionType) {
            if (!!!this.currentApi) {
                this.$emit('promotionDone');
                return
            }
            promotionHandler[this.currentApi](param).then(res => {
                if (res.state == 200) {
                    if (this.promotionInfo.promotionType == promotionEnum.ECBUY.type && !!res.data && !!res.data.buyTogetherStageProductVO) { //一起买赋值详情的时候要特殊处理
                        this.promotionDetail = res.data.buyTogetherStageProductVO;
                    } else {
                        this.promotionDetail = res.data;
                    }
                    this.$emit('updatePromotionInfo', {
                        ...this.promotionDetail,
                        promotionType
                    });

                } else {
                    this.promotionDetail = {};
                    this.$api.msg(res.msg);
                }
            }).catch((e) => {
                console.log(e);
                //异常处理
            }).finally(() => {
                this.$emit('promotionDone');
            })
        }

    }

}
</script>

<style lang='scss' scoped>

</style>
