<template>
    <view @click.stop="" :class="isIos() ? 'isIos address_list_con' : 'address_list_con'">
        <template>
            <template v-if="getValidAddressList.length > 0">
                <scroll-view scroll-y class="address_list">
                    <view v-for="(item, index) in getValidAddressList" :key="index" @click.stop="chooseAddress(item)" class="address_item">
                        <view class="address-box" :class="{checked_location_img:checkChoose(item)}">
                            <view class="location_img" :class="{checked_location_img:checkChoose(item)}"></view>
                            <view class="addressAll_text_box">
                                <text v-if='item.isDefault==1' class="symbol-container default-tag">默认</text>
                                <text v-if='!!item.tags' class="symbol-container" :class="{mar8:item.isDefault==1}">{{item.tags}}</text>
                                <text class="addressAll_text">{{item.addressAll}}</text>
                            </view>

                            <view class="detailAddress_text_box flex_row_start_start">
                                <view class="detailAddress_text">
                                    <view class="detailAddress">{{item.detailAddress}}</view>
                                    <view class="member_info">
                                        <text>{{item.memberName}}</text>
                                        <text >{{item.telMobile}}</text>
                                    </view>
                                </view>
                                <view class="uncheckedIcon" :class="{checked:checkChoose(item)}"></view>
                            </view>
                        </view>
                    </view>

                </scroll-view>
            </template>
            <template v-else>
                <view class="flex_column_start_center empty_part">
                    <image class="img" src="https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/empty/icon_defpage_zwshdz.png" />
                    <text class="tip_con">还没有收货地址哦~</text>
                </view>
            </template>
        </template>
        <view class="other_address">
            <button type="default" class="btn import" @click.stop="getAddressFromWx">
                <!-- <image class="weixin-icon" mode="widthFix" src="https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/common/icon/weixin.png" />  -->
                <text>微信导入</text>
            </button>
            <button class="btn add_btn flex_row_center_center" @click.stop="addAddress">
                新增收货地址</button>
        </view>
    </view>

</template>

<script>
import weixinAuth from '@/utils/auth/weixin'
import { isIos, getAddressFromMap, isNotEmpty } from '@/utils/common';
import { mapGetters, mapMutations, mapState } from 'vuex'

export default {
    name: "address-choose",
    props: {
    
        // 双向绑定的绑定的选中的地址item
        value:{
            type: Object,
            default: ()=>{}
        },
        // 是否显示title关闭按钮
        showCloseBtn: {
            type: Boolean,
            default: true
        },
        // 是否显示title回退按钮
        showBackBtn: {
            type: Boolean,
            default: true
        },

        //是否需要地图的定位功能
        useLocation:{
            type: Boolean,
            default: false
        },
        
    },
    data() {
        return {
            imgUrl: getApp().globalData.imgUrl,
            loading: true, //请求接口的loading
        }
    },
    computed: {
        ...mapState(['defaultAddress', 'selectAddress']),
        ...mapGetters(['getValidAddressList', 'getSelectedAddress']),
    },
    watch: {
        selectAddress: {
            handler: function(val) {
                if (isNotEmpty(val)) {
                    this.setDefaultAddress()
                }
            },
            immediate: true,
            deep: true
        },
        defaultAddress: {
            handler: function() {
                if (!isNotEmpty(this.getSelectedAddress)) {
                    this.setDefaultAddress()
                }
            },
            immediate: true,
            deep: true
        }
    },
    methods: {
        ...mapMutations(['updateSelectedAddress']),
        isIos,
        // 选中地址列表的效果
        checkChoose(item){
            return item.addressId == this.value.addressId
        },
        // 点击回退按钮
        back(){
            this.$emit('back');
        },
        //点击关闭
        close(){
            this.$emit('close');
        },
        // 设置选择的地址
        setDefaultAddress() {
            if (isNotEmpty(this.getSelectedAddress)) {
                this.$emit('input', this.getSelectedAddress);
            } else {
                this.$emit('input', this.defaultAddress);
            }
        },
        // 选中地址
        chooseAddress(item) {
            this.updateSelectedAddress(item);
            this.$emit('input', item);
            this.back();
            this.close();
        },

        // 获取微信地址
        getAddressFromWx() {
            weixinAuth.getWxAddress().then(res => {
                if (res?.errMsg === 'chooseAddress:ok') {
                    res.type = 'chooseAddress';
                    this.$Router.push({ path: '/views/address/operate', query: res })
                }
            }).catch(() => {
                uni.showToast({
                    title: "获取微信地址失败，请手动创建地址",
                    icon:'none'
                })
            })
        },

        //跳转到新增地址页面
        addAddress(){
            this.$Router.push({
                path: `/views/address/operate`
            })
        },

        // 初始化地图插件
        initGdMap() {
            return new Promise(async (resolve) => {
                try {
                    const { address, errMsg, name } = await weixinAuth.getLocation();
                    if ('chooseLocation:ok' === errMsg) {
                        let chooseItem = await getAddressFromMap(address + name);
                        console.log(chooseItem)
                    }
                } catch (error) {
                    console.log(error);
                    resolve({})
                }
            })
        },
    }
}
</script>

<style lang="scss">
.address_list_con{
    width: 750rpx;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    .address_top {
        height: 104rpx;
        line-height: 104rpx;
        font-size: 32rpx;
        font-weight: bold;
        border-radius: 28rpx 28rpx 0 0;
        width: 100%;
        text-align: center;
        background: #fff;
        color: #333;
        position: relative;
        .back_img{
            position: absolute;
            top: 50%;
            left: 30rpx;
            transform: translateY(-50%);
            width: 30rpx;
            .iconfont {
                font-size: 30rpx;
            }
        }
        .close_img {
            position: absolute;
            top: 50%;
            right: 30rpx;
            transform: translateY(-50%);
            width: 40rpx;
            height: 40rpx;
            background: #e8e8e8;
            border-radius: 50%;
            .icon_close{
                font-size: 40rpx;
            }
        }
    }

    .address_list {
        flex: 1;
        height: 100%;
        background-color: #fff;
        overflow-y: auto;
        .address_item{
            display: flex;
            align-items: center;
            padding: 0 30rpx 40rpx;
            cursor: pointer;
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
                    background: url('https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/common/icon/btn_common_weizhi.svg') center no-repeat;
                    &.checked_location_img {
                        background: url('https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/common/icon/btn_common_weizhi_red.svg') center no-repeat;
                    }
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
                        background: #2942e8;
                        color:#fff;
                        font-size: 20rpx;
                        vertical-align: top;
                        &.mar8 {
                            margin-right: 8rpx;
                        }
                    }
                    .default-tag{
                        margin-right: 12rpx;
                        background: #F30300;
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
                        background: url('https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/common/icon/btn_common_radio_nor.svg') center no-repeat;
                        background-size: 100% 100%;
                        &.checked {
                            background: url('https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/common/icon/icon_setp_sel3_red.svg') center no-repeat;
                        }
                    }
                }
                

            }
        }
    }
    .other_address {
        width: 100%;
        padding: 20rpx 30rpx;
        background: #FFFFFF;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .btn {
            margin: 0;
            width: 328rpx;
            height: 80rpx;
            font-size: 30rpx;
            font-weight: bold;
            border-radius: 44rpx;
            letter-spacing: 1rpx;
            &::after {
                border-width: 0;
            }
        }
        .import {
            background: #fff;
            border: 2rpx solid #2bae67;
            color: #2BAD66;
            display: flex;
            align-items: center;
            justify-content: center;
            // .weixin-icon {
            //     width: 28rpx;
            //     margin-right: 4rpx;
            // }
        }
        .add_btn {
            border: 2rpx solid #f30300;
            color: #fff;
            background-color: #f30300;
        }
    }


    .empty_part {
        flex: 1;
        width: 100%;
        height: 680rpx;
        padding-top: calc((832rpx - 100rpx - 120rpx) * 0.32 - 128rpx);
        background: #FFF;

        .img {
            width: 256rpx;
            height: 256rpx;
        }

        .tip_con {
            color: #999;
            font-size: 28rpx;
        }

        .ope_btn {
            color: $main-color;
            font-size: 28rpx;
            padding: 0 25rpx;
            height: 54rpx;
            background: rgba(252, 28, 28, .1);
            border-radius: 27rpx;
            margin-top: 20rpx;
        }
    }
}
</style>
