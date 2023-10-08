<!-- 鹅毛情填写地址兑换礼物页面 -->
<template>
    <view class="content">
        <view class="content_wrapper">
            <view class="top-des">
                <img :src="imgUrl + 'common/icon/help_icon.png'" alt="">
                <text>您的朋友已买过单了，无需再支付任何费用</text>
            </view>
            <view class="row b-b">
                <text class="tit">收件人</text>
                <input 
                    class="input" 
                    maxlength='10' 
                    type="text" 
                    v-model="addressData.memberName" 
                    placeholder="请输入姓名"
                    placeholder-class="placeholder" 
                />
                <text @click="operateAddress" class="import_address">导入地址</text>
            </view>
            <view class="row b-b">
                <view class="tit flex_column_center_start">
                    <text>手机号</text>
                    <text>(+86)</text>
                </view>
                <input 
                    class="input" 
                    type="text" 
                    @input="trimFun(addressData.telMobile, 'telMobile')" 
                    v-model="addressData.telMobile" 
                    placeholder="请输入手机号"
                    placeholder-class="placeholder"
                />
            </view>
            <view class="row b-b">
                <text class="tit">所在地区</text>
                <text @click="chooseArea" :class="addressData.addressAll==$L(`请选择所在地区`)? 'input placeholder1':'input'">
                    {{addressData.addressAll}}
                </text>
            </view>
            <view class="row b-b">
                <text class="tit">{{$L('详细地址')}}</text>
                <input 
                    class="input" 
                    type="text" 
                    v-model="addressData.detailAddress" 
                    placeholder="请输入详细地址" 
                    maxlength='60'
                    placeholder-class="placeholder" 
                />
            </view>
    
            <view v-if="showShareAddressTips" class="share-address-tips">
                <view @click="isCheckShare=!isCheckShare" class="icon">
                    <text class="iconfont check-icon" :class="[dealClass()]"></text>
                </view>
                <view class="share-content">
                    <p class="title">共享到公司共享地址</p>
                    <p class="tips">公司所有同事都可使用该地址</p>
                </view>
            </view>
    
            <view class="addressAnalyse">
                <view class="addressTitle">{{$L('智能填写')}}</view>
                <addressAnalyse ref='addressAnalyse' @analyse='onAddressAnalyse'></addressAnalyse>
            </view>
        </view>

        <view class="tips_desc">
            <img :src="imgUrl+'common/icon/icon_common_prompt.svg'" /> 
            <text>您的收货地址不会被其他人知晓（包括送您礼物的朋友）</text> 
        </view>

        <view class="bottom_btn">
            <view @click="submit" class="btn">领取礼物</view>
        </view>
        <selectAddress ref='selectAddress' :sel_data='selAddressData' @selectAddress="successSelectAddress"></selectAddress>

        <!-- 领取失败的toast -->
        <view class="mask" v-if="isMaskShow">
            <image mode="widthFix" :src="imgUrl + 'gift/icon_common_warning.svg'"></image>
            <text class="title">抱歉，商品太火爆了</text>
            <text class="desc">过几天再试试吧！商品到货后我们将第一时间通知您</text>
        </view>
    </view>
</template>

<script>
import selectAddress from '@/components/address/linkselect';
import addressAnalyse from '@/components/address/analysis';
import {
    mapState
} from 'vuex';
import orderHandler from '@/components/order/handler';
import giftHandler from '@/components/gift/handler';
import { isEmpty } from '@/utils/common';
import { giftStatusMap, giftUsedMap } from '@/views/gift/common/lib/enum.js';

export default {
    components: {
        selectAddress,
        addressAnalyse
    },
    data() {
        return {
            imgUrl: getApp().globalData.imgUrl,
            addressData: {
                memberName: '',
                telMobile: '',
                addressAll: '请选择所在地区',
                detailAddress: '',
                isDefault: 0,
                tags:'', //标签
                splitTimeout:1000
            },
            selAddressData: [],
            windowHeight:'',
            tagObj: {name:''}, //标签的对象
            saveTagObj:{name:''}, //保存标签的对象
            showShareAddressTips:false, //是否显示共享地址勾选框
            isCheckShare:false, //共享地址勾选状态
            copyAddressData:{}, // 对addressData中的telMobile的第一次接口返回的备份
            isAddFlag:true,//默认可以添加地址
            orderState:0, //0代表填写地址提交后下单成功，非0表示失败
            voucherCode:'', //礼物兑换码
            allData:{}, //礼物详情数据
            isMaskShow: false, //礼物领取失败控制变量
            redpacketCodeList:[] //选中红包id集合
        }
    },

    mounted(){
        this.featherId = this.$Route.query.featherId;
        this.getReceiveGift();
        uni.getSystemInfo({
            success:(res)=>{
                this.windowHeight = res.windowHeight;
            }
        });

        //初始化地址相关信息
        this.getAddressItem();
    },
    computed: {
        ...mapState(['userInfo','addressList'])
    },
    watch: {
        saveTagObj: {
            handler(val){
                this.isCheckShare = false;
                if (val && Object.keys(val).length > 0 && val.code && val.code == 'company'){
                    this.showShareAddressTips = true;
                } else {
                    this.showShareAddressTips = false;
                }
            },
            deep: true
        }
    },
    methods: {
        //初始化获取地址相关信息 目前地址addressList是存储在vuex里面的
        getAddressItem() {
            if (this.addressList.length > 0) {
                var default_address = this.addressList.filter(function(item) {
                    return item.isDefault == 1;
                })
                // 下侧涉及到addressData从vuex里面addressList里面过滤的数据赋值的时候要用深拷贝，否则后面再给addressData还会重新复制，会影响vuex地址的源数据
                if (default_address.length > 0) {
                    this.addressData =JSON.parse(JSON.stringify(default_address[0])) 
                } else {
                    this.addressData = JSON.parse(JSON.stringify(this.addressList[0]))
                }
                if (this.$getStorageSync('giftAddressId')) {
                    let addressID = this.$getStorageSync('giftAddressId')
                    if (this.addressList.filter(i => i.addressId == addressID)[0]) {
                        let tmp = this.addressList.filter(i => i.addressId == addressID)[0]
                        this.addressData = JSON.parse(JSON.stringify(tmp))
                    }
                }
                //拿到地址就开始反选，无论反选是否成功
                this.giftAddressAnalyse(this.addressData);
            }
        },
        dealClass(){
            return `${this.isCheckShare?'icon_checked checked':'icon_check'}`
        },
        chooseArea() {
            if (this.addressData.addressAll == "请选择所在地区"){
                this.$refs.selectAddress.show()
            } else {
                this.$refs.selectAddress.open()
            }
        },
        successSelectAddress(address) { //选择成功回调
            this.selAddressData = address;
            this.addressData.addressAll = ''
            address.forEach((item) => {
                this.addressData.addressAll += item.name;
            })
        },
        //输入校验
        trimFun(newVal, type){
            setTimeout(()=>{
                this.$set(this.addressData, type, this.strTrim(newVal));
            },0)
        },

        // 获取礼物订单详情
        getReceiveGift(){
            let param = {};
            param.featherId = this.featherId;
            giftHandler.getGiftDetail(param).then(res => {
                if (res.state == 200){
                    this.allData = res.data;
                    if (isEmpty(this.allData.receiverFeatherOrderVO)){
                        this.featherId = this.allData.featherId
                    } else {
                        this.featherId = this.allData.receiverFeatherOrderVO.featherId ;
                    }

                } else {
                    this.$api.msg(res.msg);
                }
            }).catch(()=>{

            })
        },
        //去除字符串内所有的空格,非数字字符，并截取前11位
        strTrim(str){
            if (!str){ return str }
            return str.replace(/[^0-9]/g, '').substring(0,11);
        },

        // 提交订单
        async submit(){
            let data = JSON.parse(JSON.stringify(this.addressData));
            if (isEmpty(data.memberName.trim())) {
                this.$api.msg('请填写收货人姓名');
                return;
            }
            if (!this.$checkTel(data.telMobile)) {
                return;
            }
            if (data.addressAll=='请选择所在地区') {
                this.$api.msg('请选择所在地区');
                return;
            }
            if (isEmpty(data.detailAddress.trim())) {
                this.$api.msg('请填写详细地址');
                return;
            } else if (data.detailAddress.length < 5) {
                this.$api.msg('详细地址至少填写5个字');
                return;
            }
            let param = {};
            // this.addressId = this.addressData.addressId;
            uni.showLoading();

            param.receiverInfo = {
                name:data.memberName, //收货人
                provinceCode:this.selAddressData[0].code, //省份编码
                cityCode:this.selAddressData[1].code, //城市编码
                districtCode:this.selAddressData[2] ? (isNaN(parseInt(this.selAddressData[2].code))? '': this.selAddressData[2].code) : '', // 区域编码
                townCode:this.selAddressData[3] ? (isNaN(parseInt(this.selAddressData[3].code))? '': this.selAddressData[3].code) : '', //镇街道编码
                addressAll:data.addressAll, //所在地区
                detailAddress:data.detailAddress, //详细地址
                mobile:data.telMobile //联系电话
            }
            
            param.featherSubmitParamVO = {giverOrReceiver:1,voucherCode:this.allData.voucherCode}
            param.orderSource = 'FEATHER';
            param.orderFrom = 2;
            param.source = 3;
            try {
                param.products = [
                    {
                        number: this.allData.orderDetailVOs[0].childOrdersVOS[0]?.orderProductListVOList[0]?.productNum,
                        sku: this.allData.orderDetailVOs[0].childOrdersVOS[0]?.orderProductListVOList[0]?.sku,
                        notAttendDiscount:false
                    }
                ];
            } catch {

            }
            let userInfo = getApp().globalData.userParams
            // 下单新增企业名称字段
            if (!!userInfo.companyName){
                param.companyName = userInfo.companyName;
            }
            // 下单新增渠道名称字段
            if (!!userInfo.channelName){
                param.channelName = userInfo.channelName;
            }
            param.redpacketCodeList = this.redpacketCodeList
            orderHandler.submit(param).then(async res => {
                if (res.state == 200) {
                    window.featherObj = {
                        featherId:this.featherId,
                        status:giftStatusMap.RECEIVED,
                        used:giftUsedMap.USED,
                        type:'change'
                    }
                    //43409需求 订单优化 下单接口从异步改为同步，不再需要调用PayInfo接口轮询是否可支付。领取礼物 因为礼物已经送礼之前已经付款了，getPayInfo 可以直接去掉
                    uni.hideLoading();
                    this.orderState = 0;
                    this.goToResult(this.orderState);
                } else {
                    //错误提示
                    uni.hideLoading();
                    this.giftErrorToast();
                }
            }).catch(()=>{
                uni.hideLoading();
                this.giftErrorToast();
            })
        },

        //领取礼物失败的提示
        giftErrorToast(){
            this.isMaskShow = true;
            setTimeout(() => {
                this.isMaskShow = false;
            }, 1800);  
                  
        },


        goToResult(state){
            this.$Router.push({path:'/views/gift/exchange/result',query:{state}})
        },
        //地址校验接口
        addressFlag(adressCode,Type){
            return new Promise((resolve) => {
                let param = {}
                param.data = {
                    provinceCode: adressCode.provinceCode,
                    cityCode:  adressCode.cityCode,
                    districtCode:  adressCode.districtCode,
                    townCode:  adressCode.townCode,
                    supplierType:  Type
                }
                param.header = {
                    "Content-Type": "application/json"
                };
                param.url = 'v3/member/front/memberAddress/addressCheck'
                param.method = 'POST'
                this.$request(param).then(res => {
                    if (res.state == 200) {
                        resolve(true)
                    } else {
                        resolve(false)
                    }
                })
            })
        },

        // 地址智能识别 识别后的数据处理
        async onAddressAnalyse(result){
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
                    code: result.districtCode?result.districtCode:'',
                    name: result.county
                },
                {
                    code: result.townCode?result.townCode:'',
                    name: result.town
                }

            ];
            //拼接地区、地址
            this.addressData.addressAll = ''
            if (result.province){
                this.addressData.addressAll += result.province
            }
            if (result.city){
                this.addressData.addressAll += result.city
            }
            if (result.county){
                this.addressData.addressAll += result.county
            }
            if (result.town){
                this.addressData.addressAll += result.town    
            }
            if (result.phone){
                this.addressData.telMobile = result.phone
            }
            if (result.name){
                this.addressData.memberName = result.name
            }
            this.addressData.detailAddress = result.exactAddress;
            //拿到地址就开始反选，无论反选是否成功
            this.$refs.selectAddress.autoAddressSel()
        },
        
        /*导入我的地址中的地址，因我的地址列表数据和共享地址或智能识别返回数据结构不一样，
        故没用上面的onAddressAnalyse方法，重新写一个专门针对这个页面这种情况的方法*/
        giftAddressAnalyse(result){
            this.selAddressData = [
                {
                    code: result.provinceCode,
                    name: ''
                },
                {
                    code: result.cityCode,
                    name: ''
                },
                {
                    code: result.districtCode?result.districtCode:'',
                    name: ''
                },
                {
                    code: result.townCode?result.townCode:'',
                    name: ''
                }

            ];
            this.addressData.addressAll = result.addressAll;
            this.addressData.detailAddress = result.detailAddress;
            this.addressData.telMobile = result.telMobile;
            this.addressData.memberName = result.memberName;
            //拿到地址就开始反选，无论反选是否成功
            this.$refs.selectAddress.autoAddressSel()
        },

        // 跳转到地址列表 选择地址
        operateAddress(){
            this.$Router.push({path:'/pages/address/list',query: {source:4}})
        }

    }
}
</script>

<style lang="scss" scoped>
    page {
        width: 750rpx;
        margin: 0 auto;
    }
    .content_wrapper{
        background: rgba(46,54,67,0.79);
        border-radius: 20rpx;
        backdrop-filter: blur(6rpx);
        padding: 40rpx 28rpx;
    }
    .content{
        position: relative;
        overflow: auto;
        .top_tips{
            width: 750rpx;
            height: 67rpx;
            // position: fixed;
            padding: 0 30rpx;
            // top: var(--titleBarFillHeight, 0px);
            // z-index: 10;
            line-height: 67rpx;
            font-size: 28rpx;
            word-wrap: break-all;
            font-weight: bold;
            color: #222;
        }
    }

    .b_b {
        &:after {
            position: absolute;
            z-index: 3;
            left: 20rpx;
            right: 0;
            height: 0;
            content: '';
            -webkit-transform: scaleY(0.5);
            transform: scaleY(0.5);
            border-bottom: 1px solid rgba(0, 0, 0, .1);
        }
    }

    .addressTitle{
        font-size: 28rpx;
        color: #fff;
        font-weight: bold;
        margin-bottom: 12rpx;
    }
    .top-des{
        display: flex;
        align-items: center;
        color: #fff;
        font-size: 26rpx;
        margin-bottom: 28rpx;
        img{
            width: 28rpx;
            height: auto;
            margin-right: 10rpx;
        }
    }

    .row {
        display: flex;
        align-items: center;
        position: relative;
        padding: 0 30rpx;
        height: 100rpx;
        background: #eff2f5;
        border-radius: 16rpx;
        margin-bottom: 20rpx;
        // &.b-b {
        //     &:after {
        //         position: absolute;
        //         z-index: 3;
        //         left: 20rpx;
        //         right: 0;
        //         height: 0;
        //         content: '';
        //         -webkit-transform: scaleY(0.5);
        //         transform: scaleY(0.5);
        //         border-bottom: 1px solid rgba(0, 0, 0, .1);
        //     }
        // }
        
        .import_address{
            position: absolute;
            right: 20rpx;
            font-size: 28rpx;
            color: #FF0000;
            font-weight: bold;
            cursor: pointer;
        }
        .tit {
            flex-shrink: 0;
            min-width: 112rpx;
            font-size: 28rpx;
            color: #222;
        }

        .input {
            flex: 1;
            font-size: 28rpx;
            color: #222222;
            padding-left: 30rpx;
            .placeholder{
                font-size: 28rpx;
                color: #999999;
            }
        }

        .person-icon{
            background: url("@/static/shared/common/icon/btn_conmmon_phone.svg") center no-repeat;
            background-size: contain;
            width: 40rpx;
            height:40rpx;
        }
    }
    .placeholder1{
        color: #999999 !important;
        font-size: 28rpx!important;
    }
    .addressAnalyse{
    
      ::v-deep .address-parse-area{
        .block{
            padding: 24rpx 30rpx;
            background: #eff2f5;
            border-radius: 16rpx;
        }
        
      }
    }
    .btn{
        display: inline-block;
        padding: 0rpx 30rpx;
        height: 80rpx;
        line-height: 80rpx;
        border: 1px solid #F30300;
        border-radius: 44rpx;
        cursor: pointer;
        color: #F30300;
        margin-left: 16rpx;
        font-size: 28rpx;
        font-weight: bold;
        white-space: nowrap;
        &:active{
            opacity: .8;
        }
      }
    .share-address-tips{
        padding: 16rpx 30rpx;
        display: flex;
        align-items: center;
        background: #f5f5f5;
        .icon{
            cursor: pointer;
            .check-icon{
                font-size: 40rpx;
                &.checked{
                    color: #e82b29;
                }
            }
        }
        .share-content{
            margin-left: 16rpx;
            .title{
            font-size: 28rpx;
            color:#333;
            line-height: 40rpx;
            }
            .tips{
            font-size: 24rpx;
            color:#999;
            line-height:34rpx;
            }
        }
    }
    .bottom_btn{
        width: 100%;
        margin: 40rpx 0;
        .btn{
            text-align: center;
            width: 100%;
            line-height: 80rpx;
            height: 80rpx;
            margin: 0;
            padding: 0;
            font-size: 30rpx;
            font-weight: bold;
            border-radius: 44rpx;
            background: #f30300;
            color: #fff;
            border: 2rpx solid #f30300;
        }
    }
    .tips_desc{
        display: flex;
        align-items: flex-start;
        padding: 24rpx 0rpx;
        img{
            width: 32rpx;
            height: auto;
            margin-right: 8rpx;
            margin-top: 4rpx;
        }
        text{
            flex: 1;
            font-size: 28rpx;
            color: #999;
        }
    }
    .mask {
        text-align: center;
        background: rgba(0, 0, 0, .8);
        color: #fff;
        position: fixed;
        top: 50%;
        left: 50%;
        height: 322rpx;
        width: 428rpx;
        margin-left: -214rpx;
        margin-top: -161rpx;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 32rpx 40rpx 28rpx 40rpx;
        border-radius: 24rpx;

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
            line-height: 40rpx;
        }
    }
</style>
