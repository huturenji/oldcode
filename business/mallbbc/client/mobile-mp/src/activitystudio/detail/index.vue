<!-- 奖品详情-未兑换 -->
<template>
    <view class="container">
        <!-- 奖品未领取 -->
        <!-- winPrizeInfo.state 用于避免数据没回来时渲染页面 -->
        <view class="win_get" v-if="winPrizeInfo.state && winPrizeInfo.state != 4">
            <view class="content_wrap">
                <!-- 图片区 -->
                <image class="prize_img" :src="winPrizeInfo.imgUrl" @load="loadImage" @error="errImage"> </image>

                <view class="prize_congratulation">恭喜你获得</view>

                <!-- 商品名称 -->
                <view class="prize_name">{{ `[${winPrizeInfo.name}]` }}</view>

                <!-- 线上奖品领取按钮 -->
                <view class="btn_wrapper">
                    <!-- 线上奖品领取按钮 -->
                    <button
                        v-if="bthText.hasOwnProperty(winPrizeInfo.exchangeType)"
                        type="warn"
                        class="searchBtn"
                        @click="getOnlineLottery"
                    >
                        {{ bthText[winPrizeInfo.exchangeType] }}
                    </button>
                </view>

                <!-- 保存兑奖凭证 -->
                <view
                    v-if="!openType && winPrizeInfo.state === 1"
                    class="save_voucher"
                    style="opacity: 1;"
                >
                    <text @click.stop="saveAwardProof">保存兑奖凭证</text>
                    <text @click.stop="showTips" class="image"></text>
                </view>

                <!-- 中奖信息 -->
                <view class="prize_info">
                    <view class="info_title"> 中奖相关信息 </view>
                    <view class="info_item">
                        <view>活动名称：</view>
                        <view class="activity_content">
                            {{ winPrizeInfo.activityName }}
                        </view>
                    </view>
                    <view class="info_item">
                        <view>中奖时间：</view>
                        <view>{{ winPrizeInfo.winTime }}</view>
                    </view>
                    <view class="info_item">
                        <view>主办企业：</view>
                        <view>{{ winPrizeInfo.companyName }}</view>
                    </view>
                    <!-- 线上实物展示兑奖提示 -->
                    <view class="info_item" v-if="tipsShow">
                        <view>领取方式：</view>
                        <view>{{ winPrizeInfo.exchangePrompt }}</view>
                    </view>
                </view>
            </view>

            <!-- l-painter内样式不支持 vh -->
            <view class="painter_container" v-if="!isLoading">
                <l-painter
                    ref="painter"
                    isCanvasToTempFilePath
                    fileType="jpg"
                    @success="painterSuccess"
                    custom-style="width:100%;height:1240rpx;position:absolute;visibility:hidden;z-index:0;opacity:0;"
                    useCORS
                >
                    <l-painter-view
                        :css=" 'width:700rpx;height:1240rpx;margin:0 auto;background-image:url(' + backImgPath + ')'"
                    >
                        <l-painter-view>
                            <l-painter-view
                                css="text-align:center;color:#FFD690;font-size:40rpx;margin-top:180rpx;position:relative;"
                            >
                                <l-painter-text text="抽奖乐翻天活动" />
                                <l-painter-view
                                    css="width:38rpx;height:4rpx;background:linear-gradient(90deg,#ffd690 100%, #FF7B54 0%);position:absolute;left:148rpx;top:24rpx;"
                                >
                                </l-painter-view>
                                <l-painter-view
                                    css="width:38rpx;height:4rpx;background: linear-gradient(-90deg,#ffd690 100%, #FF100A 0%);position:absolute;left:514rpx;top:24rpx;"
                                >
                                </l-painter-view>
                            </l-painter-view>
                            <l-painter-view
                                css="width:280rpx;height:280rpx;border-radius:8rpx;margin:0 auto;display:flex;justify-content:center;align-items:center;margin-top:32rpx;background:#fff"
                            >
                                <l-painter-qrcode
                                    :text="codeUrl"
                                    css="width: 240rpx; height: 240rpx;"
                                />
                            </l-painter-view>
                            <l-painter-view
                                css="margin-top:20rpx;text-align: center;margin-bottom:20rpx;color:#fff;font-size:28rpx;"
                            >
                                <l-painter-text :text="`请用${appName}扫码兑奖`" />
                            </l-painter-view>
                        </l-painter-view>
    
                        <l-painter-view css="height:700rpx;padding:32rpx 68rpx;">
                            <l-painter-view
                                css="display: flex;padding:16rpx;border-radius: 16px;background: #f5f5f9;"
                            >
                                <l-painter-image
                                    :src="winPrizeInfo.imgUrl"
                                    css="width: 152rpx; height: 152rpx;border-radius:12rpx"
                                />
                                <l-painter-view css="margin-left:20rpx;width:360rpx;padding-top:10rpx;">
                                    <l-painter-text
                                            :text="winPrizeInfo.name"
                                            css="width:360rpx;height:100rpx;font-weight:bold;font-size:30rpx;line-clamp:2;"
                                        />
                                    <l-painter-text
                                            :text="winPrizeInfo.winTime.substring(0,10)"
                                            css="font-size:28rpx;color:#999999"
                                        />
                                </l-painter-view>
                            </l-painter-view>
    
                            <l-painter-view
                                css="font-size:28rpx;color:#666666;text-align:center;font-weight: 500;margin-top:28rpx;position:relative;"
                            >
                                <l-painter-text text="温馨提示" />
                                <l-painter-view
                                    css="width:44rpx;height:2rpx;background:linear-gradient(270deg,#EEEEEE 100%, #999999 0%);position:absolute;left:170rpx;top:14rpx;"
                                >
                                </l-painter-view>
                                <l-painter-view
                                    css="width:44rpx;height:2rpx;background: linear-gradient(-90deg,#999999 100%, #EEEEEE 0%);position:absolute;left:352rpx;top:14rpx;"
                                >
                                </l-painter-view>
                            </l-painter-view>
                            <l-painter-view
                                css="font-size:26rpx;color:#666666;padding:0 24rpx;margin-top:24rpx"
                            >
                                <l-painter-text
                                    text="*该兑奖凭证为您领取奖品的唯一凭证，请妥善保管。"
                                />
                            </l-painter-view>
                            <l-painter-view
                                css="font-size:26rpx;color:#666666;padding:0 24rpx;margin-top:16rpx"
                            >
                                <l-painter-text
                                    text="如因个人原因遗失或泄露而导致奖品被其他人冒领，本平台及活动主办方概不负责，敬请知悉。"
                                />
                            </l-painter-view>
                        </l-painter-view>
                    </l-painter-view>
                </l-painter>
            </view>

            <view class="activity_rule" @click="toActivityRulePage">活动规则</view>
        </view>

        <!-- 异常页面 兑换劵失效-->
        <view class="win_filed" v-if="winPrizeInfo.state && winPrizeInfo.state == 4">
            <view class="prize_state">
                <image
                    src="https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/activitystudio/images/icon_defpage_zrcc.png"
                    mode="scaleToFill"
                    class="empty_img"
                />
                <view class="empty_info">
                    该奖品无法领取,请联系活动主办方
                </view>
            </view>
        </view>

        <!-- 文本过长时使用该提示框 -->
        <u-toast ref="uToast"></u-toast>

        <!-- 兑奖凭证提示弹框 -->
        <uni-popup ref="voucherCodeModal">
            <view class="voucherCodeModal">
                <view>
                    <image class="modalClose" src="https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/activitystudio/images/close3.svg" mode="scaleToFill" @click="$refs.voucherCodeModal.close()" />
                    <view class="modalTitle">
                        <view>兑换码</view>
                    </view>
                    <view class="voucherContent">
                        <view class="voucherText">{{ winPrizeInfo.voucherCode }}</view>
                    </view>
                    <view class="copyText" @click="copyText(winPrizeInfo.voucherCode)">复制兑换码</view>
                    <view class="tips">
                        <view class="tipsTitle">使用说明：</view>
                        <view>1.{{ winPrizeInfo.exchangePrompt }}</view>
                        <view v-if="winPrizeInfo.exchangeUrl">2.链接地址：
                            <text @click="openPage(winPrizeInfo.exchangeUrl)">{{ winPrizeInfo.exchangeUrl }}</text>
                        </view>
                    </view>
                </view>
            </view>
        </uni-popup>

        <!-- 线上奖品已领取弹窗 -->
        <uni-popup ref="prizeReceived">
            <view class="prizeReceived">
                <view class="prize_state">
                    <image
                        src="https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/activitystudio/images/success.png"
                        mode="scaleToFill"
                    />
                    <view class="state_info">
                        奖品已被领取
                    </view>
                </view>
                <view class="prize_info_wrapper">
                    <view class="prize_info">
                        <image
                            :src="winPrizeInfo.imgUrl"
                            mode="scaleToFill"
                        />
                        <view class="detail_info">
                            <view class="prize_name">{{winPrizeInfo.prizeName}}</view>
                            <view class="prize_price" v-show="winPrizeInfo.exchangeType === 1">
                                价值：¥{{ winPrizeInfo.price }}
                            </view>
                        </view>
                    </view>
                </view>
                <view class="peize_text" @click="goShop">去商城逛逛</view>
            </view>
        </uni-popup>
    </view>
</template>

<script>
import { formateDateToString, setDefaultImage, copyText, getUrlParams, isEmpty, setStorageSync } from '@/utils/common.js';
import { getPrizeDetail } from '@/activitystudio/common/lib/handler.js';
import lPainter from "@/activitystudio/components/lime-painter/components/l-painter/l-painter.vue";
import lPainterView from "@/activitystudio/components/lime-painter/components/l-painter-view/l-painter-view.vue";
import lPainterText from "@/activitystudio/components/lime-painter/components/l-painter-text/l-painter-text.vue";
import lPainterImage from "@/activitystudio/components/lime-painter/components/l-painter-image/l-painter-image.vue";
import lPainterQrcode from "@/activitystudio/components/lime-painter/components/l-painter-qrcode/l-painter-qrcode.vue";
import uniPopup from '@/common/components/uni-popup/uni-popup.vue';
import config from '@/common/lib/config'

export default {
    name: "redeemPage",
    components: {
        lPainter,
        lPainterView,
        lPainterText,
        lPainterImage,
        lPainterQrcode,
        uniPopup
    },
    data() {
        return {
            // base64海报路径
            path: "",
            // 二维码指向地址
            codeUrl: "",
            // 获奖时间
            winningTime: formateDateToString(new Date(), "yyyy-MM-dd hh:mm:ss"),
            isLoading: true,
            loadImageFlag:false,
            winPrizeInfo: {},
            winCertificate: '',
            backImgPath: 'https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/activitystudio/images/bg_cj_djpz.png', 
            activityId: '',  // 活动id
            saveSuccessMsg:'凭证保存成功', // 保存成功消息
            appName:'微信', 
            openType: false,  // 该页面打开方式，true 标识扫码打开，如果为扫自己保存的凭证打开则不显示保存凭证按钮
            bthText: {
                1: '立即领取',
                3: '填写兑奖地址领取',
                4: '立即领取'
            },
            copyText
        };
    },
    computed:{
        tipsShow() {
            if(this.winPrizeInfo.exchangePrompt) {
                if (this.winPrizeInfo.offlinePrizeType === 2) {
                    return this.winPrizeInfo.exchangeType === 2
                } else if(this.winPrizeInfo.offlinePrizeType === 3) {
                    return this.winPrizeInfo.exchangeType === 2 || this.winPrizeInfo.exchangeType === 4
                } else {
                    return false
                }
            } else {
                return false
            }
        }
    },
    onLoad({ winCertificate, activityId, openType, q }) {
        if (q) {
            // 扫码获取参数
            const url = decodeURIComponent(q)
            this.activityId = getUrlParams('activityId', url)
            this.winCertificate = getUrlParams('winCertificate', url)
            this.openType = Boolean(getUrlParams('openType', url))
        } else {
            // 跳转页面获取参数
            this.activityId = activityId
            this.winCertificate = winCertificate
            this.openType = Boolean(openType)
        }
    },
    onShow() {
        this.getWinDetail()
    },
    mounted() {
        this.initCodeUrl();
    },
    methods: {
        painterSuccess(e) {
            this.path = e
        },
        initCodeUrl(){
            let apiUrl = config.API_URL;
            if(isEmpty(apiUrl)){
                console.log('配置的API_URL不存在');
                return
            }
            // 去掉分享链接的端口号
            apiUrl = apiUrl.replace(/com:(.+?)\//, () => 'com/')
            this.codeUrl = `${apiUrl}activitystudio-detail?winCertificate=${this.winCertificate}&activityId=${this.activityId}&openType=1`;
        },
        // 跳转活动规则页
        toActivityRulePage() {
            uni.navigateTo({ url: `/activitystudio/rule/index?activityId=${this.activityId}` });
        },
        // 获取兑换凭证信息
        getWinDetail() {
            this.isLoading = true
            getPrizeDetail({ winCertificate: this.winCertificate })
                .then(res => {
                    if (res.resultCode === 0) {
                        let prizeInfo = res.result;
                        setDefaultImage(res.result)
                        prizeInfo.name = res.result.prizeName;
                        this.winPrizeInfo = prizeInfo
                        this.isLoading = false
                    } else {
                        uni.showToast({ title: res.resultMessage, icon: 'none' })
                    }
                })
        },
        // 保存图片到本地（PC、App都支持；H5只支持在浏览器端长按保存图片）
        saveAwardProof() {
            if(!this.loadImageFlag){
                uni.showToast({
                    title: '图片加载失败，请刷新...',
                    icon: "none",
                });
                return false
            }
            uni.showToast({
                title: '正在保存，请稍后...',
                icon: "none",
            });
            setTimeout(() => {
                uni.saveImageToPhotosAlbum({
                    filePath: this.path,
                    success: () => {
                        uni.showToast({
                            title: this.saveSuccessMsg,
                            icon: "none",
                        });
                    },
                    fail: () => {
                        uni.showToast({
                            title: "保存失败，请联系抽奖平台方",
                            icon: "none",
                        })
                    }
                });
            }, 3000);
        },
        // 图片加载是否完毕
        loadImage(e){
            this.loadImageFlag = true
        },
        // 图片加载失败
        errImage(){
            this.loadImageFlag = false
        },
        // 立即领取
        getOnlineLottery() {
            // 领取类型
            // exchangeType: 1 线上奖品 前往商城订单页下单领取
            // exchangeType: 2 不显示领奖按钮 只能保存兑奖凭证
            // exchangeType: 3 跳转到地址页领取
            // exchangeType: 4 商云优惠券跳转g2优惠券页面， 虚拟商品弹框提示
            if (this.winPrizeInfo.exchangeType === 1) {
                this.receiveOnLinePrize()
            } else if(this.winPrizeInfo.exchangeType === 3) {
                uni.navigateTo({ url: `/activitystudio/address/index?winCertificate=${this.winCertificate}&activityId=${this.activityId}` });
            } else if(this.winPrizeInfo.exchangeType === 4) {
                if (this.winPrizeInfo.offlinePrizeType === 1) {//商云优惠券
                    if (this.winPrizeInfo.state === 1) {
                        this.$Router.push({
                            path: '/views/coupon/receive',
                            query: {
                                password: this.winPrizeInfo.voucherCode
                            }
                        })
                    } else {
                        this.$refs.prizeReceived.open();
                    }
                } else if (this.winPrizeInfo.offlinePrizeType === 3) {
                    this.$refs.voucherCodeModal.open();
                } else if (this.winPrizeInfo.offlinePrizeType === 4) {//商云红包
                    if (this.winPrizeInfo.state === 1) {
                        this.$Router.push({
                            path: '/views/redpacket/receive',
                            query: {
                                password: this.winPrizeInfo.voucherCode
                            }
                        })
                    } else {
                        this.$refs.prizeReceived.open();
                    }
                }
            } else {
                uni.showToast({ title: '未查到中奖信息', icon: 'none' })
            }
        },
        // 领取线上奖品
        async receiveOnLinePrize() {
            // 已领取则显示已领取弹窗
            if (this.winPrizeInfo.state === 1) {
                this.$Router.push({
                    path: '/views/order/confirm/voucher',
                    query: {
                        sku: this.winPrizeInfo.sku,
                        voucherCode: this.winPrizeInfo.voucherCode
                    }
                })
            } else if (this.winPrizeInfo.state === 2) {
                this.$refs.prizeReceived.open();
            }
        }, 
        goShop() {
            uni.switchTab({ url: '/' })
        },
        showTips() {
            this.$refs.uToast.show({
                type: 'default',
                message: '*该兑奖凭证为您领取奖品的唯一凭证，请妥善保管。如因个人原因遗失或泄露而导致奖品被其他人冒领，本平台及活动主办方概不负责，敬请知悉。'
            })
            // uni.showToast({
            //     title: '*该兑奖凭证为您领取奖品的唯一凭证，请妥善保管。如因个人原因遗失或泄露而导致奖品被其他人冒领，本平台及活动主办方概不负责，敬请知悉。',
            //     icon: 'none',
            //     duration: 3000
            // })
        },
        openPage(url) {
            // 链接需要带上http / https才能进行跳转
            // sinosdk.sino.openThirdApplet({ url: url })
        }
    },
    onHide(){
    },
};
</script>
<style lang="scss" scoped>
@import './style/index.scss';

// 线下奖品领取弹窗
.voucherCodeModal {
    width: 590rpx;
    background-color: #fff;
    border-radius: 20rpx;
    padding: 28rpx 40rpx 40rpx 40rpx;
    position: relative;;

    > view {
        width: 100%;
        max-height: 800rpx;
        overflow-y: auto;
    }

    .modalTitle {
        height: 42rpx;
        width: 100%;
        position: relative;
        text-align: center;

        > view {
            font-size: 30rpx;
            height: 42rpx;
            line-height: 42rpx;
            color: #222;
            font-weight: 400;
        }
    }

    .modalClose {
        position: absolute;
        top: 24rpx;
        right: 24rpx;
        width: 44rpx;
        height: 44rpx;
        z-index: 99;
    }

    .voucherContent {
        background-color: #eff2f5;
        margin-top: 34rpx;
        border-radius: 16rpx;
        padding: 16rpx;

        > view:first-child {
            line-height: 24px;
            text-align: center;
            font-size: 24px;
            word-break: break-all;
            color: #222;
        }
    }

    .copyText {
        font-size: 30rpx;
        height: 42rpx;
        line-height: 42rpx;
        text-align: center;
        color: #f30300;
        margin-top: 24rpx;
    }

    .tips {
        margin-top: 32rpx;

        > view {
            height: 36rpx;
            line-height: 36rpx;
            font-size: 26rpx;
            color: #666;
        }

        .tipsTitle {
            font-weight: 600;
        }

        > view:nth-child(2),
        > view:nth-child(3) {
            font-weight: 400;
            margin-top: 8rpx;

            text {
                font-style: normal;
                color: #f30300;
            }
        }
    }
}

// 已领取弹窗
.prizeReceived {
    width: 600rpx;
    padding: 40rpx;
    background-color: #fff;
    border-radius: 20rpx;
    
    .prize_state {
        padding-top: 60rpx;
        text-align: center;
    
        image {
            width: 120rpx;
            height: 120rpx;
        }
    
        .state_info {
            font-size: 34rpx;
            font-weight: bold;
            color: #222222;
            text-align: center;
            margin-top: 32rpx;
        }
    }

    .prize_info_wrapper{
        width: 100%;
        margin-top: 80rpx;

        .prize_info {
            width: 100%;
            height: 184rpx;
            margin: 0 auto;
            background: #f5f5f9;
            border-radius: 8px;
            display: flex;
            align-items: center;
            padding: 16rpx;
        
            image {
                width: 140rpx;
                height: 140rpx;
            }

            .detail_info {
                flex: 1;
                margin-left: 20rpx;

                .prize_name {
                    margin-top: 8rpx;
                    font-size: 28rpx;
                    font-weight: bold;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }

                .prize_price {
                    margin-top:26rpx;
                    font-size: 28rpx;
                    color:#999999
                }
            }
        }
    }

    .peize_text {
        margin: 40rpx 0 20rpx 0;
        text-align: center;
        color: #f30300;
        font-size: 30rpx;
    }
}
.painter_container{
    opacity: 0;
    position: fixed;
    z-index: 0;
    width: 0;
    height: 0;
    left: -100%;
}
</style>
