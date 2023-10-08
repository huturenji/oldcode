<template>
    <view class="content" @click="hideOperate(currentAddressId)" @longpress="hideOperate()" @touchmove="hideOperate()">
        <view v-if='addressList.length' class="address_list_box">
            <view class="address_list">
                <view v-for="(item) in addressList" :key="item.addressId" @click="checkAddress(item)"
                class="address_item" @longpress.stop="showOperate(item.addressId)">
                    <view class="showMaskBox" v-if="currentId == item.addressId"><view class="showMask" @click.stop="copyStrDeal(item)">复制<view class="sanjiao"></view></view></view>
                    <swiper-action
                        @cellOpen="followId = item.addressId"
                        :cellShow="followId === item.addressId"
                        @cellMoving="cellMoving => isCellMoving = cellMoving"
                        ref="swiperCell"
                    >
                        <!-- 主体内容 -->
                        <view class="address-box">
                            <view class="location_img"></view>
                            <view class="addressAll_text_box">
                                <text v-if='!item.valid' class="symbol-container unvalid">失效</text>
                                <text v-if='item.isDefault' class="symbol-container default-tag">默认</text>
                                <text v-if='!!item.tags' class="symbol-container" :class="{mar8:item.isDefault==1}">{{item.tags}}</text>
                                <text class="addressAll_text" :style="{userSelect:userSelect}">{{item.addressAll}}</text>
                            </view>

                            <view class="detailAddress_text_box flex_row_start_start">
                                <view class="detailAddress_text">
                                    <view class="detailAddress" :style="{userSelect:userSelect}">{{item.detailAddress}}</view>
                                    <view class="member_info">
                                        <text :style="{userSelect:userSelect}">{{item.memberName}}</text>
                                        <text >{{item.telMobile|formateTel}}</text>
                                    </view>
                                </view>
                                <view class="uncheckedIcon" @click.stop="operateAddress('edit', item.addressId)"></view>
                            </view>
                        </view>              
                    
                        <!-- 右侧按钮 -->
                        <template v-slot:right>
                            <view class="rightBtn">
                                <view class="slot_line"></view>
                                <view v-if="!item.isDefault && item.valid" @click.stop="defAddress(item)" class="slot-button slot-button-default"><text class="slot-button-text">设为默认</text></view>
                                <view @click.stop="delAddress(item.addressId)" class="slot-button"><text class="slot-button-text">删除</text></view>
                            </view>
                        </template>
                    </swiper-action>
                </view>
            </view>
        </view>

        <template v-if="!addressList.length && addressDone">
            <view class="flex_column_start_center empty_part">
                <view class="img"></view>
                <text class="tip_con">{{$L('还没有收货地址哦')}}~</text>
            </view>
        </template>

        <view class="add_btn_bottom flex_row_center_center" v-if="!disabledModule">
            <button class="add_btn flex_row_center_center" @click="operateAddress('add')">
                {{$L('新建收货地址')}}</button>
        </view>

        <loadingState v-if="loadingState != 'first_loading' && addressList.length > 0" :state='loadingState' />
        <uni-popup ref="popup" type="dialog">
            <uni-popup-dialog type="input" :before-close="true" :title="$L('提示')" :content="popTip" :duration="2000" @close="cancelChange"
                @confirm="confirmChange"></uni-popup-dialog>
        </uni-popup>
    </view>
</template>

<script>
import loadingState from "@/components/loading/loading.vue";
import uniPopup from '@/components/uni-popup/uni-popup.vue'
import uniPopupDialog from '@/components/uni-popup/uni-popup-dialog.vue' 
import addressHandler from '@/components/address/handler';
import orderHandler from '@/components/order/handler';
import {
    mapState,
    mapGetters
} from 'vuex';
import config from '@/common/lib/config'
import swiperAction from '@/components/swiper-action'
import {copyText} from '@/utils/common';
// #ifdef H5
const MASKING_TYPE = SnUtils.DataMasking.MASKING_TYPE;
const maskingText = SnUtils.DataMasking.maskingText;
// #endif
const ISDECORATE = config.ISDECORATE;
export default {
    components: {
        loadingState,
        uniPopup,
        uniPopupDialog,
        swiperAction
    },
    data() {
        return {
            imgUrl: getApp().globalData.imgUrl,
            source: 0,
            sourceId: '', //下单页面选中的地址addressId
            curOperateId: '',
            loadingState: 'first_loading',
            orderSn: '', //订单号
            currentAddressId: '', //记录当前长按点击的地址
            editing: false,
            addressId: 0,
            popTip: '',
            popType: '',
            isFromBackBtn: true,
            followId: '',
            currentId:'',
            userSelect:'none', //据此判断PC端可选中复制，手机端不能选中
            isCellMoving: false,
            isResetCell: false
        }
    },
    
    filters:{
        //手机号脱敏
        formateTel(value){
            let nValue;
            try {
                nValue = ISDECORATE?maskingText(MASKING_TYPE.TEL,value):value; 
            } catch (error) {
                
            }
            return nValue;
        }
    },
    onShow() {
        this.isResetCell = true
        this.resetCell()
    },
    mounted(){
        this.orderSn = this.$Route.query.orderSn;
        // source ：3 从订单详情页的修改地址进入的    2：从订单列表的修改地址进入    1：从确认下单页面的修改地址进入的    4:从鹅毛情填写地址并领取礼物页面的导入地址进入
        // sourceId: 确认订单页面选择的地址id
        this.source = this.$Route.query.source ? this.$Route.query.source : 0; 
        this.sourceId = this.$Route.query.sourceId ? this.$Route.query.sourceId : 0;

        if (SnUtils.isPC()){
            this.userSelect="text";
        }
    },
    computed: {
        ...mapState(['userInfo', 'addressList', 'addressDone']),
        ...mapGetters(['disabledModule'])
    },
    watch: {
        addressList: {
            handler: function() {
                this.followId = ''
                this.resetCell()
            },
            immediate: true,
            deep: true
        }
    },
    //滚动事件地址蒙层
    onPageScroll(e) {
        if (e.scrollTop > 0) {
            this.hideOperate(this.currentAddressId)
        }
    },
    onBackPress() {
        // 只有来源是订单，且不是选择地址时返回
        this.isFromBackBtn && this.source && uni.$emit('addressBack', 2)
    },
    methods: {
        resetCell() {
            if (this.isResetCell) {
                this.isResetCell = false
                this.$refs['swiperCell']?.forEach(refItem => {
                    refItem?.cellReset()
                })
            }
        },
        cancelChange() {
            this.editing = false
            this.$refs.popup.close()
        },
        confirmChange() {
            this.$refs.popup.close()
            if (this.popType == 'edit') {
                orderHandler.updateAddress({
                    orderSn: this.orderSn,
                    addressId: this.addressId
                }).then(res => {
                    if (res.state == 200) {
                        this.$store.dispatch('getAddressList');
                        if (this.source == 3) { //从订单详情页的修改地址进入的
                            this.$api.msg(res.msg);
                            setTimeout(() => {
                                this.$api.prePage().getOrderDetail();
                                this.$Router.back(1)
                                this.editing = false
                            }, 1500)
                        } else if (this.source == 2) { //从订单列表的修改地址进入的
                            this.$api.msg(res.msg);
                            setTimeout(() => {
                                this.$Router.back(1)
                                this.editing = false
                            }, 1500)
                        }
                    } else {
                        this.editing = false
                        this.$api.msg(res.msg);
                    }
                })
            } else if (this.popType == 'del') {
                addressHandler.delAddress({
                    addressIds: this.addressId
                }).then(res => {
                    this.$api.msg(res.msg);
                    if (res.state == 200) {
                        //更新数据
                        this.$store.dispatch('getAddressList');

                        // 如果从确认订单页过来，并且删除的是已选择的地址
                        if (this.addressId === this.sourceId) {
                            this.$api.prePage().changeAddress(null);
                        }
                    }
                }).catch(() => {
                    //异常处理
                })
            }
        },
        //选择地址
        checkAddress(item) {
            if (this.editing || this.isCellMoving) {
                return
            }
            if(!item.valid){
                uni.showToast({
                    title: "该地址已失效，请重新编辑该地址",
                    icon:'none'
                })
                return
            }
            if (this.source == 1) {
                // this.$api.prePage().orderAddress=item
                this.isFromBackBtn = false
                this.$api.prePage().changeAddress(item);
                uni.$emit('addressBack', 1)
                this.$Router.back(1)
            } else if (this.source == 2 || this.source == 3) {
                this.editing = true
                //从订单详情或订单列表里面进入的地址列表
                this.addressId = item.addressId
                this.popTip = '确认修改地址?'
                this.popType = 'edit'
                this.$refs.popup.open()
            } else if (this.source == 4){
                this.giftConfirm(item);
            }
        },
        giftConfirm(item){
            let newItem = JSON.parse(JSON.stringify(item))
            let adderssJson = {
                provinceCode:newItem.provinceCode,
                cityCode:newItem.cityCode,
                districtCode:newItem.districtCode,
                townCode:newItem.townCode?newItem.townCode:'',
                addressAll:newItem.addressAll,
                detailAddress:newItem.detailAddress,
                telMobile:newItem.telMobile,
                memberName:newItem.memberName,
                addressId:newItem.addressId
            } 
            this.$setStorageSync('giftAddressId', newItem.addressId)
            this.$api.prePage().giftAddressAnalyse(adderssJson);
            this.$Router.back(1)
        },
        operateAddress(type, addressId) {
            this.followId = ''
            let that = this;
            this.$moduleGate(()=>{
                that.curOperateId = '';
                let query = {
                    type
                }
                // let url = `/pages/address/operate?type=${type}`;
                if (type == 'edit') {
                    query.addressId=addressId
                }
                // followId = '' 和 nextTick 解决滑块展开调到到下一个页面再返回没关闭问题
                this.$nextTick(() => {
                    that.$Router.push({path:'/pages/address/operate',query})
                })
            })
        },
        //地址长按事件
        showOperate(addressId) {
            this.currentId = addressId;
            // this.currentAddressId = addressId
            // if (this.curOperateId == addressId) {
            //     this.curOperateId = '';
            // } else {
            //     this.curOperateId = addressId;
            // }
            // //阻止浏览器默认行为
            // document.oncontextmenu = function(e) {
            //     e.preventDefault()
            // }
        },
        copyStrDeal(item){
            this.copyStr(JSON.stringify(item))
        },

        /**
         * 复制字符串
         */
        copyStr (item) {
            let strObj = JSON.parse(item);
            let str1 = '收货人：'+ strObj.memberName + '\r\n' 
            + '手机号码：' + strObj.telMobile + '\r\n' 
            + '所在地区：' + strObj.addressAll + '\r\n' 
            + '详细地址：' + strObj.detailAddress;
            this.currentId='';
            copyText(str1,1,'已复制到剪切板')
        },
        //点击蒙层隐藏
        hideOperate() {
            this.curOperateId = '';
            this.currentId = '';
        },
        //删除地址事件
        delAddress(addressId) {
            this.popTip = '确定删除地址?'
            this.popType = 'del'
            this.addressId = addressId
            this.$refs.popup.open()
        },
        //设为默认地址事件
        defAddress(item){
            let param = {...item};
            param.share = param.share ? param.share : false;
            param.key = this.userInfo.access_token;
            param.isDefault = 1 ; //是否设为默认地址（0非默认地址 1默认地址）
            param.townCode = param.townCode ?? ''; 
            param.tags = param.tags ?? '';
            this.isResetCell = true
            addressHandler.editAddress(param).then(async res => {
                this.$api.msg(res.msg);
                if (res.state == 200) {
                    this.$store.dispatch('getAddressList');
                } else {
                    //错误提示
                    this.$api.msg(res.msg);
                }
            })
        }
    }
}
</script>

<style lang='scss' scoped>
    page {
        width: 750rpx;
        margin: 0 auto;
        background: #FFFFFF;
        -webkit-touch-callout: none;
        /*系统默认菜单被禁用*/
        -webkit-user-select: none;
        /*webkit浏览器*/
        -khtml-user-select: none;
        /*早期浏览器*/
        -moz-user-select: none;
        /*火狐*/
        -ms-user-select: none;
        /*IE10*/
        user-select: none;
        -webkit-touch-callout: none;
        -moz-touch-callout: none;
        -ms-touch-callout: none;
        touch-callout: none;
    }

    uni-page-body {
        display: flex;
        height: 100%;
    }

    .content {
        position: relative;
        background: #fff;
        width: 100%;
        padding-bottom: calc(120rpx + var(--safe-area-inset-bottom));
        .address_list_box {
            height: 100%;
            .address_list {
                padding-bottom: 120rpx;
                background: #fff;
            }
        }
    }

    .address_item {
        display: flex;
        align-items: center;
        padding: 20rpx 30rpx;
        position: relative;
        .showMaskBox{
            display: flex;
            align-items: center;
            justify-content: flex-end;
            position: absolute;
            height: 0;
            top:24rpx;
            left: 136rpx;
            z-index: 100;
            &.showMaskSkuBox{
                top:-100rpx;
            }
            .showMask{
                width:120rpx;
                height:50rpx;
                background-color:rgba(0,0,0,1);
                color:#fff;
                display:flex;
                align-items: center;
                justify-content: center;
                border-radius: 10rpx;
                position: relative;
                font-size: 24rpx;
                .sanjiao{
                width: 0;
                height: 0;
                border: 14rpx solid;
                border-top-color: rgba(0,0,0,1);
                border-bottom-color: transparent;
                border-left-color: transparent;
                border-right-color: transparent;
                position: absolute;
                bottom:-26rpx;
                }
            }
        }
        .address-box {
            position: relative;
            padding-left: 48rpx;
            width: 100%;
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            text-align: justify;
            color: #222222;
            word-wrap: break-word;
            word-break: break-all;
            .location_img{
                position: absolute;
                top: 0;
                left: 0;
                width: 36rpx;
                height: 36rpx;
                background-size: 100% 100%;
                background: url('@/static/shared/common/icon/weizhi333.svg') center no-repeat;
            }
            .addressAll_text_box {
                padding-right: 74rpx;
                text-align: justify;
                font-size: 26rpx;
                word-break: break-all;
                font-weight: 400;
                margin-bottom: 4rpx;
                .symbol-container{
                    margin-top: 4rpx;
                    margin-right: 12rpx;
                    display: inline-block;
                    padding: 0 8rpx;
                    min-width: 56rpx;
                    max-width: 176rpx;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    height: 30rpx;
                    text-align: center;
                    line-height:30rpx;
                    font-weight: bold;
                    box-sizing: border-box;
                    border-radius: 6rpx;
                    background: var(--addressTagBg);
                    color:var(--addressTagTextColor) !important;
                    font-size: 20rpx !important;
                    vertical-align: top;
                    &.mar8 {
                        margin-right: 8rpx;
                    }
                }
                .default-tag{
                    margin-right: 12rpx;
                    background: var(--confirmBtnBgColor2);
                    color: var(--confirmBtnTextColor)  !important;
                }
                .unvalid{
                    border: 1px solid #999;
                    background: #999;
                    color: #fff;
                }
                .addressAll_text {
                    margin-right: 12rpx;
                    line-height: 36rpx;
                    color: #666666;
                }
            }
            .detailAddress_text_box {
                width: 100%;
                .detailAddress_text{
                    flex: 1;
                    color: #222222;
                    .detailAddress {
                        font-size: 28rpx;
                        min-height: 40rpx;
                        line-height: 40rpx;
                        font-weight: bold;
                    }
                    .member_info {
                        margin-top: 2rpx;
                        line-height: 36rpx;
                        font-size: 26rpx;
                        &>text:first-of-type {
                            padding-right: 24rpx;
                        }
                        text {
                            line-height: 36rpx;
                        }
                    }
                }
                .uncheckedIcon {
                    margin-left: 34rpx;
                    width: 40rpx;
                    height: 40rpx;
                    border-radius: 50%;
                    background: url('@/static/shared/common/icon/btn_common_radio_edit.svg') center no-repeat;
                    background-size: 100% 100%;
                }
            }

        }
    }

    .wrapper {
        flex: 1;
        background: #fff;

        .iconfont {
            color: $main-color;
            font-size: 32rpx;
            margin-right: 30rpx;
        }
    }

    .icon-bianji {
        display: flex;
        align-items: center;
        height: 80rpx;
        font-size: 40rpx;
        color: $font-color-light;
        padding-left: 30rpx;
    }

    .add_btn_bottom {
        position: fixed;
        width: 750rpx;
        height: calc(120rpx + var(--safe-area-inset-bottom));
        bottom: 0;
        padding: 0 30rpx var(--safe-area-inset-bottom);
        background: #FFFFFF;
        margin: 0 auto;
        z-index: 95;

        .add_btn {
            width: 100%;
            font-size: 30rpx;
            color: var(--confirmBtnTextColor);
            height: 80rpx;
            background: var(--confirmBtnBgColor2);
            border-radius: 44rpx;
            letter-spacing: 1rpx;
        }
    }

    .empty_part {
        flex: 1;
        width: 100%;
        height: 100%;
        padding-top: calc((100vh - var(--titleBarFillHeight, 0px)) * 0.32 - 128rpx);

        .img {
            width: 256rpx;
            height: 256rpx;
            background: var(--addressEmptyImg);
            background-size: 100% 100%;
            text-align: center;
            color:#999;
        }
        .tip_con {
            color: $main-third-color;
            font-size: 28rpx;
        }
        
    }
    .rightBtn {
        display: flex;
        height: 100%;
    }
    .slot_line{
        margin-left: 2rpx;
    }
    .slot-button{
         width: 120rpx;
         height: 100%;
         background: var(--tagColor);
         color: #fff;
         display: flex;
         justify-content: center;
         align-items: center;
         border-radius: 0 20rpx 20rpx 0;
     }
     .slot-button-default{
         border-radius: 0 ;
         background: #c2c2c2;
     }
</style>
