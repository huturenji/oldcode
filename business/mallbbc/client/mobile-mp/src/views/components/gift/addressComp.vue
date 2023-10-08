<template>
    <view class="content">
        <w-loading ref="loading"></w-loading>
        <text class="addr-tip">填写地址领取礼物</text>
        <view class="form-content">
            <view class="tips-desc" style="padding: 0 0 8rpx;">
                <image src="https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/common/icon/icon_common_prompt_white.svg" mode="widthFix"></image>
                <text>您的朋友已买过单了，无需再支付任何费用</text>
            </view>
            <view class="row">
                <view class="title">收货人</view>
                <input class="input" maxlength='10' type="text" v-model="addressData.memberName" placeholder="收货人姓名"
                    placeholder-style="color:#c2c2c2;font-size:28rpx;" />
                <view @click="operateAddress" class="btn">导入地址</view>
                <!-- <view class='person-icon' @click="addTchatUser"></view> -->
            </view>
            <view class="row">
                <view class="title">联系方式（+86）</view>
                <input class="input" type="number" @input="trimFun(addressData.telMobile, 'telMobile')"
                    v-model="addressData.telMobile" placeholder="请输入手机号"
                    placeholder-style="color:#c2c2c2;font-size:28rpx;" />
            </view>
            <view class="row" @click="chooseArea">
                <view class="title">所在地区</view>
                <view class="input" :class="{placeholder1: !!!addressData.addressAll}">
                    {{addressData.addressAll || '请选择所在地区'}}
                </view>
            </view>
            <view class="row">
                <view class="title">详细地址</view>
                <input class="input" type="text" v-model="addressData.detailAddress" placeholder="请输入详细地址"
                    maxlength='60' placeholder-style="color:#c2c2c2;font-size:28rpx;" />
            </view>

            <view class="addressTitle">智能填写</view>
            <view class="addressAnalyse">
                <addressAnalyse ref='addressAnalyse' @analyse='onAddressAnalyse'></addressAnalyse>
            </view>
        </view>

        <view class="tips-desc">
            <image src="https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/common/icon/icon_common_prompt.svg" mode="widthFix"></image>
            <text>您的收货地址不会被其他人知晓（包括送您礼物的朋友）</text>
        </view>

        <button class="confirm-btn" @click="authProxyHandler(beforeSubmit)">领取礼物</button>

        <!-- 领取失败的toast -->
        <view class="toast" v-if="isToastShow">
            <image src="https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/common/icon/icon_common_warning.svg"></image>
            <text class="title">抱歉，商品太火爆了</text>
            <text class="desc">过几天再试试吧！商品到货后我们将第一时间通知您</text>
        </view>

        <selectAddress ref='selectAddress' :sel_data='selAddressData' @selectAddress="successSelectAddress">
        </selectAddress>

        <!-- 登录弹窗 start-->
        <BottomPopup ref="authPopup" type="bottom" :showTitle="false" conBackground="#fff">
            <AuthComp @confirm="confirm" @cancel="cancel" />
        </BottomPopup>
        <!-- 登录弹窗 end -->
    </view>
</template>

<script>
import { checkTel, setStorageSync, getStorageSync, isNotEmpty } from "@/utils/common"
import addressAnalyse from '@/views/components/address/analysis';
import giftMixin from '@/common/mixin/gift.js'
import selectAddress from '@/views/components/address/linkselect';
import { giftStatusMap, giftUsedMap } from '@/common/lib/enum/gift';
import { submitGift, getGiftDetail } from '@/views/components/gift/handler';
import { exchangeBbcToken, setUserInfoToStorage } from '@/utils/auth/index';
import { getToken as getBplusToken } from '@/utils/auth/unionAuth';
import config from '@/common/lib/config.js';
import BottomPopup from '@/common/components/uni-popup/uni-popup-bottom.vue'; // 底部弹出层
import AuthComp from '@/common/components/auth/auth-comp';
import { authProxyHandler } from '@/utils/auth/auth.js';
import { subscribeMessage } from '@/views/subscribe/index.js';
import { SUB_PUB_KEY } from '@/views/subscribe/enum.js';
import payHandler from '@/views/components/pay/handler';
export default {
    mixins: [giftMixin],
    components: {
        addressAnalyse,
        selectAddress,
        BottomPopup,
        AuthComp
    },
    data() {
        return {
            authKey: 'authed-gift-receive',
            isToastShow: false,
             
            addressData: {
                memberName: '',
                telMobile: '',
                addressAll: '请选择所在地区',
                detailAddress: '',
                isDefault: false,
                addressId: '', //编辑收货地址时的id
                tags: '', //标签
                splitTimeout: 1000
            },
            selAddressData: [],
            featherId: '',
            allData: {},//礼物数据
            addressList: [] //地址列表
        }
    },
    onLoad() {

    },
    mounted() {
        this.featherId = this.$Route.query.featherId;
        this.getGiftDetail()
        this.getStorageAdress()
    },
    computed: {
    },
    methods: {
        confirm(flag){
            uni.$emit(this.authKey, flag);
            this.$refs.authPopup.close();

        },
        cancel(){
            uni.$emit(this.authKey, false);
            this.$refs.authPopup.close();
        },
        authProxyHandler(next){
            authProxyHandler(this, this.authKey, next);
        },
        showToast() {
            this.isToastShow = true;
            this.maskTimer && clearInterval(this.maskTimer);
            this.maskTimer = setTimeout(() => {
                this.isToastShow = false;
            }, 3000);
        },
        hideToast() {
            this.isToastShow = false;
        },
        operateAddress() {
            this.$Router.push({ path: '/views/address/list', query: { source: 4 } })
        },
        // 获取默认地址并解析
        async getStorageAdress() {
            this.giftAddressAnalyse(this.$store.state.defaultAddress);
        },
        //输入校验
        trimFun(newVal, type) {
            setTimeout(() => {
                this.$set(this.addressData, type, this.strTrim(newVal));
            }, 0)
        },
        //去除字符串内所有的空格,非数字字符，并截取前11位
        strTrim(str) {
            if (!str) { return str }
            return str?.replace(/[^0-9]/g, '').substring(0, 11);
        },
        onAddressAnalyse(result) {
            this.selAddressData = [
                {
                    code: result.provinceCode,
                    name: result.province
                },
                {
                    code: result.cityCode,
                    name: result.city
                },
                {
                    code: result.districtCode ? result.districtCode : '',
                    name: result.county
                },
                {
                    code: result.townCode ? result.townCode : '',
                    name: result.town
                }

            ];
            //拼接地区、地址
            this.addressData.addressAll = ''
            if (result.province) {
                this.addressData.addressAll += result.province
            }
            if (result.city) {
                this.addressData.addressAll += result.city
            }
            if (result.county) {
                this.addressData.addressAll += result.county
            }
            if (result.town) {
                this.addressData.addressAll += result.town
            }
            if (result.phone) {
                this.addressData.telMobile = result.phone
            }
            if (result.name) {
                this.addressData.memberName = result.name
            }
            this.addressData.detailAddress = result.exactAddress;
            //拿到地址就开始反选，无论反选是否成功
            this.$refs.selectAddress.autoAddressSel()
        },
        chooseArea() {
            if (this.addressData.addressAll == "请选择所在地区") {
                this.$refs.selectAddress.show()
            } else {
                // 此处新增延时器的原因是 在部分安卓机型上 地址三级选择器的动画 有抖动的问题
                setTimeout(() => {
                    this.$refs.selectAddress.open()
                }, 500)
            }
        },
        successSelectAddress(address) { //选择成功回调
            this.selAddressData = address;
            this.addressData.addressAll = ''
            address.forEach((item) => {
                this.addressData.addressAll += item.name;
            })
        },

        // 与服务端人员沟通后， 更新完手机号之后，要重新用b+ token exchange mallbbc token，否则原先token里面的信息手机号信息有可能有误
        exchangeToken(){
            return new Promise(async resolve => {
                let bplusToken = await getBplusToken();
                try {
                    let userInfo = await exchangeBbcToken(bplusToken)
                    setUserInfoToStorage(userInfo); // 将用户token信息存入缓存
                    resolve(true);
                } catch (error) {
                    console.log('更新用户信息失败', error);
                    resolve(false);
                }
            })
        },


        //提交订单，领取礼物
        beforeSubmit(){
            let data = JSON.parse(JSON.stringify(this.addressData));
            if (!data.memberName.trim()) {
                uni.showToast({
                    title: '请填写收货人姓名',
                    icon: 'none'
                })
                return;
            }
            if (!checkTel(data.telMobile)) {
                return;
            }
            if (data.addressAll == '请选择所在地区') {
                uni.showToast({
                    title: '请选择所在地区',
                    icon: 'none'
                })
                return;
            }
            if (!data.detailAddress.trim()) {
                uni.showToast({
                    title: '请填写详细地址',
                    icon: 'none'
                })
                return;
            } else if (data.detailAddress.length < 5) {
                uni.showToast({
                    title: '详细地址至少填写5个字',
                    icon: 'none'
                })
                return;
            }

            subscribeMessage(this, [SUB_PUB_KEY.PAYMENT_SUCCESS_REMINDER], () => this.submit(data));
        },
        submit(data){
            let param = {};                           
            let products = [
                {
                    sku: this.allData.orderDetailVOs[0]?.childOrdersVOS[0]?.orderProductListVOList[0]?.sku,
                    number: this.allData.orderDetailVOs[0]?.childOrdersVOS[0]?.orderProductListVOList[0]?.productNum,
                    notAttendDiscount: false
                }
            ];

            param.featherSubmitParamVO = { giverOrReceiver: 1, voucherCode: this.allData.voucherCode }
            param.orderSource = 'FEATHER';
            param.orderFrom = 5;
            param.source = 3;
            param.products = products;
            param.isCart = false;
            let receiverInfo = {}
            receiverInfo.name = data.memberName; //收货人
            receiverInfo.provinceCode = this.selAddressData[0].code; //省份编码
            receiverInfo.cityCode = this.selAddressData[1].code; //城市编码
            receiverInfo.districtCode = this.selAddressData[2] ? (isNaN(parseInt(this.selAddressData[2].code)) ? '' : this.selAddressData[2].code) : ''; // 区域编码
            receiverInfo.townCode = this.selAddressData[3] ? (isNaN(parseInt(this.selAddressData[3].code)) ? '' : this.selAddressData[3].code) : ''; //镇街道编码
            receiverInfo.addressAll = data.addressAll; //所在地区
            receiverInfo.detailAddress = data.detailAddress; //详细地址
            receiverInfo.mobile = data.telMobile; //联系电话
            param.receiverInfo = receiverInfo
            // 收礼物下单新增企业名称字段
            if (!!config.COMPANYNAME){
                param.companyName = config.COMPANYNAME;
            }
            // 下单新增渠道名称字段
            if (!!config.CHANNELNAME){
                param.channelName = config.CHANNELNAME;
            }
            this.$refs?.loading?.open();

            submitGift(param).then(async res => {
                if (res.state == 200 && res.data?.orderPayState == payHandler.orderPayState.PAY_SUCCESS) {
                    // 更新鹅毛情领取状态 该方法在混入 giftMixin.js 里面
                    // 置成已收礼 已兑换 状态 为了解决从此处回退到礼物列表的时候 礼物状态没有更新的问题
                    this.setGiftStatusToCache({
                        featherId: this.featherId,
                        status: giftStatusMap.RECEIVED,
                        used: giftUsedMap.USED
                    })
                    //设置地址缓存
                    setStorageSync('address', {
                        memberName: this.addressData.memberName,
                        addressAll: this.addressData.addressAll,
                        detailAddress: this.addressData.detailAddress,
                        telMobile: this.addressData.telMobile,
                        selAddressData: this.selAddressData,
                    })
                    this.$Router.replace({
                        path: '/views/gift/exchange/result',
                        query: {
                            featherId: this.featherId,
                            status: 0
                        }
                    })


                } else {
                    // 领取失败 todo
                    this.showToast({
                        icon: 'none',
                        title: res.msg
                    });
                }
            }).catch(res => {
                //错误提示
                uni.showToast({
                    title: res.msg,
                    icon: 'none'
                })
            }).finally(e=>{
                this.$refs?.loading?.close();
            })
        },
        getGiftDetail() {
            let params = {}
            params.featherId = this.$Route.query.featherId
            getGiftDetail(params).then(res => {
                if (res.state == 200) {
                    this.allData = res.data
                    if (!this.allData.receiverFeatherOrderVO) {
                        this.featherId = this.allData.featherId;
                    } else {
                        this.featherId = this.allData.receiverFeatherOrderVO.featherId;
                    }
                }
            }).catch(() => {
                uni.showToast({
                    title: res.msg,
                    icon: 'none'
                })
            })
        },
        /*导入我的地址中的地址，因我的地址列表数据和共享地址或智能识别返回数据结构不一样，
        故没用上面的onAddressAnalyse方法，重新写一个专门针对这个页面这种情况的方法*/
        giftAddressAnalyse(result) {
            this.selAddressData = result.selAddressData || [
                {
                    code: result.provinceCode,
                    name: ''
                },
                {
                    code: result.cityCode,
                    name: ''
                },
                {
                    code: result.districtCode ? result.districtCode : '',
                    name: ''
                },
                {
                    code: result.townCode ? result.townCode : '',
                    name: ''
                }

            ];
            this.addressData.addressAll = result.addressAll;
            this.addressData.detailAddress = result.detailAddress;
            this.addressData.telMobile = result.telMobile;
            this.addressData.memberName = result.memberName;
            //拿到地址就开始反选，无论反选是否成功
            this.$refs.selectAddress.autoAddressSel()
        }
    }
}
</script>

<style scoped lang="scss">
.placeholder1{
    color:#c2c2c2;
    font-size:28rpx;
}
.content {
    padding-top: 48rpx;

    .addr-tip {
        height: 44rpx;
        font-size: 32rpx;
        font-weight: 600;
        color: #ffffff;
        line-height: 44rpx
    }

    .form-content {
        margin-top: 20rpx;
        background-color: #2E3643;
        border-radius: 20rpx;
        padding: 35rpx 28rpx;

        .row {
            display: flex;
            align-items: center;

            padding: 32rpx 30rpx;
            height: 100rpx;
            background: #eff2f5;
            border-radius: 16rpx;
            margin-top: 20rpx;
            font-size: 28rpx;
            color: #222222;

            .title {
                width: 130rpx;
                flex-shrink: 0;
            }

            .input {
                flex: 1;
                margin-left: 20rpx;
            }

            .btn {
                color: #FC303F;
                font-weight: 700;
            }


        }

        .addressTitle {
            margin: 20rpx 0 12rpx;
            color: #fff;
            font-size: 28rpx;
            font-weight: 600;
        }

        .addressAnalyse {
            background: #eff2f5;
            border-radius: 16rpx;
            padding: 24rpx 30rpx;
        }

    }


    .tips-desc {
        display: flex;
        align-items: flex-start;
        padding: 24rpx 4rpx;

        image {
            width: 32rpx;
            height: 32rpx;
            margin-right: 8rpx;
        }

        text {
            flex: 1;
            font-size: 26rpx;
            color: #999;
        }
    }

    .confirm-btn {
        margin: 80rpx 0 0;
        text-align: center;
        width: 100%;
        height: 80rpx;
        line-height: 80rpx;
        color: #fff;
        background: #f30300;
        border-radius: 40rpx;
        font-weight: bold;
        font-size: 30rpx;
    }
    .confirm-btn::after{
        display: none;
    }

    .toast {
        text-align: center;
        font-size: 13px;
        background-color: rgba($color: #000000, $alpha: 0.7);
        color: #fff;
        position: fixed;
        top: 50%;
        left: 50%;
        height: 322rpx;
        width: 428rpx;
        margin-left: -214rpx;
        margin-top: -162rpx;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 32rpx 40rpx 28rpx;
        border-radius: 5px;
        z-index: 300;

        image {
            width: 80rpx;
            height: 80rpx;
        }

        .title {
            font-size: 30rpx;
            margin-top: 36rpx;
            font-weight: 500;
        }

        .desc {
            font-size: 28rpx;
            margin-top: 24rpx;
            height: 80rpx;
            font-weight: 400;
            color: #ffffff;
            line-height: 40rpx;
        }
    }

}
</style>
