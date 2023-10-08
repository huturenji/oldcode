<!-- 奖品详情-未兑换 -->
<template>
    <view class="container" v-if="!isLoading">
        <!-- 奖品未领取 -->
        <view class="win_get" v-if="winPrizeInfo.state != 4">
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
                    v-if="!openType && judgePlateformAndVersion"
                    class="save_voucher"
                    :style="{ opacity: '1' }"
                >
                    <text @click.prevent="saveAwardProof">保存兑奖凭证</text>
                    <image @click.prevent="showTips" :src="imgUrl + 'images/btn_common_gantanhao.svg'" mode="scaleToFill" />
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
            <l-painter
                ref="painter"
                isCanvasToTempFilePath
                fileType="jpg"
                @success="path = $event"
                custom-style="width:100%;height:1240rpx;position:absolute;visibility:hidden;"
                useCORS
            >
                <l-painter-view
                    :css=" 'width:700rpx;height:1240rpx;margin:0 auto;background-image:url(' + getBackImgUrl + ')'"
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
                            <l-painter-text :text="`请使用${appName}扫码兑奖`" />
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

            <view class="activity_rule" @click="toActivityRulePage">活动规则</view>
        </view>

        <!-- 异常页面 兑换劵失效-->
        <view class="win_filed" v-if="winPrizeInfo.state == 4">
            <view class="prize_state">
                <image
                    :src="imgUrl + 'images/icon_defpage_zrcc.png'"
                    mode="scaleToFill"
                    class="empty_img"
                />
                <view class="empty_info">
                    该奖品无法领取,请联系活动主办方
                </view>
            </view>
        </view>

        <!-- 兑奖凭证提示弹框 -->
        <uni-popup ref="voucherCodeModal">
            <view class="voucherCodeModal">
                <view>
                    <image class="modalClose" :src="imgUrl + 'images/close3.svg'" mode="scaleToFill" @click="$refs.voucherCodeModal.close()" />
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
                            <i @click="openPage(winPrizeInfo.exchangeUrl)">{{ winPrizeInfo.exchangeUrl }}</i>
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
                        :src="imgUrl + 'images/success.png'"
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
                            <view class="prize_price" v-show="winPrizeInfo.exchangeType === 1">价值：¥{{ winPrizeInfo.price }}</view>
                        </view>
                    </view>
                </view>
                <view class="peize_text" @click="goShop">去商城逛逛</view>
            </view>
        </uni-popup>
        <!-- h5保存图片 -->
        <uni-popup ref="h5saveimage">
            <view class="h5saveimage">
                <view class="prize_state">
                    <image
                        :src="path"
                        mode="scaleToFill"
                    />
                    <!-- <view class="state_info">
                        请截图保存
                    </view> -->
                </view>
            </view>
        </uni-popup>        
    </view>
</template>

<script>
import { formateDateToString, encrypt, setDefaultImage, copyText, fitFontSize } from "@/utils/common.js";
import shareHandler from '@/utils/shareHandler.js';
import { getPrizeDetail } from '@/common/lib/handler.js'
import config from '@/common/lib/config.js'

export default {
    name: "redeemPage",
    data() {
        return {
            imgUrl: getApp().globalData.imgUrl,
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
            backImgPath: (process.env.NODE_ENV === 'development') ? `${getApp().globalData.imgUrl}images/bg_cj_djpz.png` : `${window.location.origin}/activitystudio/static/mobile/static/shared/images/bg_cj_djpz.png`, //todo 此处暂时在本地编译环境用相对路径，在服务器环境用绝对路径
            activityId: '',  // 活动id
            saveSuccessMsg:'凭证保存成功', // 保存成功消息
            appName:'抽奖App', // app名称
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
        // 由于部署程序的目录不一致，导致画报插件获取错误的背景图路劲，因此通过origin和pathname拼接。
        getBackImgUrl(){
            const origin = window.location.origin;
            let pathname = window.location.pathname;
            if (pathname.includes('index.html')){
                pathname = pathname.replace('index.html','');
            }
            return `${origin}${pathname}static/shared/images/bg_cj_djpz.png`;      
        },
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
    onLoad({ winCertificate, activityId, openType }) {
        this.activityId = activityId
        this.winCertificate = winCertificate
        this.openType = Boolean(openType)

        // 保存成功消息设置
        const browserInfo = navigator.userAgent;
        if (browserInfo.includes('Android') || browserInfo.includes('iPhone')){
            this.saveSuccessMsg = '成功保存到相册';
        }
    },
    onShow() {
        this.getWinDetail()
    },
    mounted() {
        this.getAppinfo()
        // this.setThirdShare()
        this.codeUrl = `${location.origin}${location.pathname}#/pages/redeem-page/redeem-page?winCertificate=${this.winCertificate}&activityId=${this.activityId}&closeTo=1&openType=1`;
    },
    methods: {
        // 跳转活动规则页
        toActivityRulePage() {
            uni.navigateTo({ url: `/pages/rule/rule?activityId=${this.activityId}` });
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
            let that = this;
            if(!that.loadImageFlag){
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
               sinosdk.sino
                .saveImage({ imgUrl: that.path })
                .then((res) => {
                    uni.hideLoading()
                    if (Object.keys(res).includes('savePath')){
                        uni.showToast({
                            title: that.saveSuccessMsg,
                            icon: "none",
                        });
                    } else {
                        that.$refs.h5saveimage.open();
                        uni.showToast({
                            title: '请截图保存兑奖凭证',
                            icon: "none",
                            duration:3000
                        });
                    }
                })
                .catch((err) => {
                    uni.hideLoading()
                    that.$refs.h5saveimage.open();
                    uni.showToast({
                        title: '请截图保存兑奖凭证',
                        icon: "none",
                        duration:3000
                    });
                }); 
            }, 1500);
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
                uni.navigateTo({ url: `/pages/address/index?winCertificate=${this.winCertificate}&activityId=${this.activityId}` });
            } else if(this.winPrizeInfo.exchangeType === 4) {
                if (this.winPrizeInfo.offlinePrizeType === 1) {//商云优惠券
                    let url = ''
                    if (this.winPrizeInfo.exchangeUrl) {
                        url = `${this.winPrizeInfo.exchangeUrl}?password=${this.winPrizeInfo.voucherCode}`
                    } else {
                        url = window.location.origin + `/${config.DOMAIN_NAME}/static/mobile/index.html#/pages/coupon/receive?password=${this.winPrizeInfo.voucherCode}`
                    }
                    sinosdk.sino.openApplet({
                        appId: '268435729',
                        url: url
                    })
                } else if (this.winPrizeInfo.offlinePrizeType === 3) {
                    this.$refs.voucherCodeModal.open();
                    this.$nextTick(() => {
                        let dom = document.querySelector('.voucherText')
                        fitFontSize(dom, 72)
                    })
                } else if (this.winPrizeInfo.offlinePrizeType === 4) {//商云红包
                    let url = ''
                    if (this.winPrizeInfo.exchangeUrl) {
                        url = `${this.winPrizeInfo.exchangeUrl}?password=${this.winPrizeInfo.voucherCode}`
                    } else {
                        url = window.location.origin + `/${config.DOMAIN_NAME}/static/mobile/index.html#/pages/redpacket/receive?password=${this.winPrizeInfo.voucherCode}`
                    }
                    sinosdk.sino.openApplet({
                        appId: '268435729',
                        url: url
                    })
                }
            } else {
                uni.showToast({ title: '未查到中奖信息', icon: 'none' })
            }
        },
        // 领取线上奖品
        receiveOnLinePrize() {
            // 已领取则显示已领取弹窗
            if (this.winPrizeInfo.state === 1) {
                let params = {
                    sku: this.winPrizeInfo.sku,
                    voucherCode: this.winPrizeInfo.voucherCode,
                    userId: getApp().globalData.userParams.userId,
                    channelId: getApp().globalData.userParams.channelId,
                    companyId: getApp().globalData.userParams.companyId
                }

                // 数据加解密
                let encryptStr = encrypt(params)
                encryptStr = encodeURIComponent(encryptStr)
                const url = window.location.origin + `/${config.DOMAIN_NAME}/static/mobile/index.html#/views/order/confirm/voucher?code=` + encryptStr
                    
                // 打开小应用 回调为关闭页面的回调
                sinosdk.sino.openApplet({
                    appId: '268435729',
                    url: url
                })
            } else if (this.winPrizeInfo.state === 2) {
                this.$refs.prizeReceived.open();
            }
        }, 
        goShop() {
            const url = window.location.origin + `/${config.DOMAIN_NAME}/static/mobile/index.html#/`
            sinosdk.sino.openApplet({
                appId: '268435729',
                url: url
            })
        },
        showTips() {
            uni.showToast({
                title: '*该兑奖凭证为您领取奖品的唯一凭证，请妥善保管。如因个人原因遗失或泄露而导致奖品被其他人冒领，本平台及活动主办方概不负责，敬请知悉。',
                icon: 'none',
                duration: 3000
            })
        },
        openPage(url) {
            // 链接需要带上http / https才能进行跳转
            sinosdk.sino.openThirdApplet({ url: url })
        },
        // 判断是否是伴正事平台并且是否已支持的版本
        judgePlateformAndVersion() {
            const palteform = sinosdk.sino.getPlatform();
            if (palteform !== 'bizmate') {
                return false;
            } else {
                return true;
            }
        },
        // 设置分享的内容
        setThirdShare(){
            // // #ifdef H5
            // let that = this;
            // //设置第三方（微信、朋友圈等）分享信息
            // let location = window.location;
            // let callBackUrl = `${location.origin}${location.pathname}#/?activityId=${this.activityId}`;
            // let shareInfo = {
            //     title: '抽奖乐翻天', // 分享标题
            //     desc: '奖品多多，惊喜多多，一起来参与活动抽奖吧！', // 分享描述
            //     link: callBackUrl // 分享链接
            // }
            // //设置二次分享
            // shareHandler.setThirdShareInfo(shareInfo);
            // // #endif
        },
        getAppinfo(){
            let that = this;
            sinosdk.sino.getAppInfo({'key':'appName'}).then(function(data){
                if (!!data.value){
                    // key，appName 和 appLogo
                    that.appName = data.value
                } else {
                    that.appName = '抽奖App'
                }
            }).catch(()=>{
                return false;
            })
        }
    },
    onHide(){
        shareHandler.cancelBizmateShare();
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
        cursor: pointer;
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
        cursor: pointer;
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

            i {
                font-style: normal;
                color: #f30300;
                cursor: pointer;
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
        cursor: pointer;
    }
}
.h5saveimage{
    width: 640rpx;
    padding: 0rpx 0;
    background-color: #fff;
    border-radius: 20rpx;
    .prize_state {
        position: relative;
        text-align: center;
        image {
            width: 563rpx;
            height: 930rpx;
        }
    }

}
</style>
