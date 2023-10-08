<template>
    <view @click.stop="" class="address_list_con">
        <template>
            <template v-if="addressListComputed.length > 0">
                <scroll-view scroll-y class="address_list">
                    <view v-for="(item, index) in addressListComputed" :key="index" @click.stop="chooseAddress(item)" class="address_item">
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
                                        <text >{{item.telMobile|formateTel}}</text>
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
                    <view class="img"></view>
                    <text class="tip_con">{{$L('还没有收货地址哦')}}~</text>
                </view>
            </template>
        </template>
        <view class="other_address" v-if='!disabledModule'>
            <view class="other_btn" @click.stop="addAddressModule">新建收货地址</view>
        </view>
    </view>

</template>

<script>
import addressHandler from '@/components/address/handler';
import { mapMutations, mapGetters, mapState } from 'vuex';
import { getLocation } from '@/utils/common.js'
import config from '@/common/lib/config';
// #ifdef H5
const MASKING_TYPE = SnUtils.DataMasking.MASKING_TYPE;
const maskingText = SnUtils.DataMasking.maskingText;
// #endif
const ISDECORATE = config.ISDECORATE;
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
        //新增开关：当页面再次加载时执行地址初始化操作
        isOpen:{
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            imgUrl: getApp().globalData.imgUrl,
            loading: true, //请求接口的loading
            location: null,
            map: null //地图对象
        }
    },
    watch: {
        addressList: {
            handler: function(list) {
                if (!this.addressDone) { return }
                this.choosedAddress(list)
            },
            immediate: true,
            deep: true
        }
    },
    // activated(){
    //     //console.log('activated',this.isOpen);
    //     this.isOpen && this.choosedAddress(this.addressList)
    // },
    computed: {
        ...mapGetters(['disabledModule']),
        ...mapState(['addressList', 'addressDone', 'defaultAddress']),
        addressListComputed(){
            return this.addressList.filter(item => item.valid) // 过滤掉失效的地址
        }
    },
    filters:{
        formateTel: function (value) {
            let newValue
            try {
                newValue = ISDECORATE?maskingText(MASKING_TYPE.TEL,value):value;
            } catch (error) {
            }
            return newValue;
        }
    },
    methods: {
        ...mapMutations(['setDefaultAddress']),
        addAddressModule(){
            this.$moduleGate(this.addAddress)
        },
        // 选中地址列表的效果
        checkChoose(item){
            return item.addressId == this.value.addressId
        },

        // 获取选中地址
        async choosedAddress() {
            this.$emit('input', this.defaultAddress);
        },

        // 点击回退按钮
        back(){
            this.$emit('back');
        },

        //点击关闭
        close(){
            this.$emit('close');
        },


        // 选中地址
        chooseAddress(item){
            this.$setStorageSync('addressId', item.addressId);
            this.$emit('input', item);
            this.setDefaultAddress()
            this.back();
            this.close();
        },

        //跳转到
        addAddress(){
            this.$Router.push({
                path: `/pages/address/operate`
            })
        },

        // 初始化地图插件
        initGdMap() {
            let that = this;
            return new Promise(async (resolve) => {
                try {
                    that.location = await getLocation();
                    // console.log('获取的当前定位地址对象：', that.location);
                    if (!!that.location.formattedAddress){ //高德定位完的地址字段叫formattedAddress，此时利用该值去调用解析兆日自己的地址code
                        let chooseItem = await that.getAddressFromMap(that.location.formattedAddress);
                        resolve(chooseItem)
                    }
                } catch (error) {
                    console.log(error);
                    resolve({})
                }
            })
        },


        // 根据定位的字符串解析当前的在兆日code
        getAddressFromMap(fullAddress){
            return new Promise((resolve) => {
                addressHandler.addressParsing({
                    supplierId: "1",
                    addressInfo: fullAddress
                }).then(res=>{
                    if (res.state == 200 && !!res.data && !!res.data.provinceCode){
                        let chooseItem = {
                            provinceCode: res.data.provinceCode,
                            cityCode: res.data.cityCode,
                            districtCode: res.data.countyCode,
                            townCode: res.data.townCode?res.data.townCode:'',
                            addressAll: `${res.data.province ? res.data.province : ''}${res.data.city ?res.data.city : ''}${res.data.county ? res.data.county : ''}${res.data.town ? res.data.town : ''}`,
                            detailAddress: `${res.data.exactAddress ? res.data.exactAddress : ''}`
                        }
                        resolve(chooseItem)
                    } else {
                        resolve({})
                    }
                }).catch(e=>{
                    console.error(e);
                    resolve({})
                })
            })
        }

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
}
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
        cursor: pointer;
        .iconfont{
            font-size: 30rpx;
        }
    }
    .close_img {
        position: absolute;
        top: 50%;
        right: 30rpx;
        transform: translateY(-50%);
        cursor: pointer;
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
                background: url('@/static/shared/common/icon/weizhi333.svg') center no-repeat;
                &.checked_location_img {
                    background: var(--locationIcon);
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
                    background: url('@/static/shared/common/icon/btn_common_radio_nor.svg') center no-repeat;
                    background-size: 100% 100%;
                    &.checked {
                        background: var(--selectRadio);
                    }
                }
            }
            

        }
    }
}
.other_address {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    height: calc(120rpx + var(--safe-area-inset-bottom) + var(--tabBarHeight));
    background: #fff;
    padding: 0 30rpx calc(var(--safe-area-inset-bottom) + var(--tabBarHeight));

    .other_btn {
        width: 100%;
        height: 80rpx;
        background-color: var(--confirmBtnBgColor2);
        border-radius: 40rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 30rpx;
        
        font-weight: 600;
        color: var(--confirmBtnTextColor);
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
        background: var(--addressEmptyImg);
        background-size: 100% 100%;
        text-align: center;
        color:#999;
    }

    .tip_con {
        color: $main-third-color;
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

</style>
