<template>
    <view class="content">
        <view class="address_list" v-if='addressList.length>0'>
            <uni-swipe-action>
                <uni-swipe-action-item
                :right-options="getOptions(item)"
                v-for="(item) in addressList" 
                :key="item.addressId"
                @click="clickEvent($event,item)"
                >
                    <view class="list" @click="checkAddress(item)">
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
                                        <text >{{ item.telMobile }}</text>
                                    </view>
                                </view>
                                <view class="uncheckedIcon" @click.stop="operateAddress('edit', item.addressId)"></view>
                            </view>
                        </view>
                    </view>
                </uni-swipe-action-item>
            </uni-swipe-action>
        </view>
        
        
        <view class="empty_part" v-if="addressList.length==0">
            <image class="img" src="https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/empty/icon_defpage_zwshdz.png" />
            <text class="tip_con">还没有收货地址哦~</text>
        </view>

        <view :class="['add_btn_bottom',iosHairPhone ? 'iosBottomPadding' : 'androidBottomPadding']">
            <button type="default" class="btn import" @click="getAddressFromWx">
                <image class="weixin-icon" mode="widthFix" src="https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/common/icon/weixin.png" /> 
                <text>微信导入</text>
            </button>
            <button class="btn add_btn flex_row_center_center" @click="operateAddress('add')">
                新增收货地址</button>
        </view>

        <uni-popup ref="popup" type="dialog">
            <uni-popup-dialog type="input" :before-close="true" title="提示" :content="popTip" :duration="2000"
                @close="cancelChange" @confirm="confirmChange"></uni-popup-dialog>
        </uni-popup>
    </view>
</template>

<script>
import uniPopup from '@/common/components/uni-popup/uni-popup.vue';
import uniPopupDialog from '@/common/components/uni-popup/uni-popup-dialog.vue';
import addressHandler from '@/views/components/address/handler';
import orderHandler from '@/views/components/order/handler';
import uniSwipeAction from '@/views/components/uni-swipe-action/uni-swipe-action.vue';
import uniSwipeActionItem from '@/views/components/uni-swipe-action-item/uni-swipe-action-item.vue';
import { prePage } from '@/utils/common.js';
import Authorization from '@/utils/auth/weixin';
import { mapMutations, mapGetters } from 'vuex';

export default {
    components: {
        uniPopup,
        uniPopupDialog,
        uniSwipeAction,
        uniSwipeActionItem
    },
    data() {
        return {
            source: 0,
            sourceId: '', //下单页面选中的地址addressId
            curOperateId: '',
            orderSn: '', //订单号
            currentAddressId: '', //记录当前长按点击的地址
            editing: false,
            addressId: 0,
            popTip: '',
            popType: '',
            isFromBackBtn: true,
            currentId: '',
            userSelect: 'none', //据此判断PC端可选中复制，手机端不能选中
            addressList:[],
            options:[ //左滑滑块选项
                {
                    text: '设为默认',
                    style: {
                        backgroundColor: '#c2c2c2',
                        fontSize:'24rpx'
                    }
                },
                {
                    text: '删除',
                    style: {
                        backgroundColor: '#e82b29',
                        fontSize:'24rpx'
                    }
                }
            ],
            controlShow:false, //左滑滑块是否显示 true:显示
            from: '', // 页面来源
        }
    },
    onShow() {
        // 先从内存里读取, 再请求接口调用最新的
        this.addressList = this.$store.state.addressList;
        this.getAddressList();
        
        // 如果是从订单确认页面访问且添加了地址之后直接返回
        if (this.addressList.length && this.isFromOrderConfirm) {
            this.checkAddress(this.addressList[0])
        }
    },
    mounted() {
        const { from, orderSn, source, sourceId } = this.$Route.query;
        this.from = from;
        this.orderSn = orderSn;
        this.source = source ? source : 0;
        this.sourceId = sourceId ? sourceId : 0;
        if (this.isFromOrderConfirm) {
            wx.setNavigationBarTitle({
                title: '确认订单'
            })
        }
    },
    watch: {
    },
    computed: {
        ...mapGetters(['getSelectedAddress']),
        getOptions(){
            return (item) => {
                const { isDefault, valid } = item;
                // 地址已经是默认的和失效的不可设置为默认
                return (isDefault == 1 || !valid) ? this.options.slice(1) : this.options
            }
        },
        // 是否从订单确认页面跳转
        isFromOrderConfirm() {
            return this.from === 'orderConfirm';
        }
    },
    onBackPress() {
        // 只有来源是订单，且不是选择地址时返回
        this.isFromBackBtn && this.source && uni.$emit('addressBack', 2)
    },
    methods: {
        ...mapMutations(['updateSelectedAddress']),
        // 滑块点击事件
        clickEvent(e,item){
            if (e.content.text == '设为默认'){
                this.defAddress(item)
            } else if (e.content.text == '删除'){
                this.delAddress(item.addressId)
            }
        },
        // 获取地址列表
        async getAddressList() {
            this.addressList = await this.$store.dispatch('getAddressList');
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
                        if (this.source == 3) { //从订单详情页的修改地址进入的
                            uni.showToast({
                                title:res.msg,
                                icon:'none'
                            })
                            
                            setTimeout(() => {
                                prePage().getOrderDetail();
                                this.$Router.back(1)
                                this.editing = false
                            }, 1500)
                        } else if (this.source == 2) { //从订单列表的修改地址进入的
                            uni.showToast({
                                title:res.msg,
                                icon:'none'
                            })
                            setTimeout(() => {
                                this.$Router.back(1)
                                this.editing = false
                            }, 1500)
                        }
                    } else {
                        this.editing = false
                        uni.showToast({
                            title:res.msg,
                            icon:'none'
                        })
                    }
                })
            } else if (this.popType == 'del') {
                addressHandler.delAddress({
                    addressIds: this.addressId
                }).then(res => {
                    uni.showToast({
                        title: "删除成功",
                        icon:'none'
                    })
                    if (res.state == 200) {
                        if (this.addressId == this.getSelectedAddress.addressId) {
                            this.updateSelectedAddress({});
                        }
                        //更新数据
                        this.controlShow = false
                        this.getAddressList()

                        // 如果从确认订单页过来，并且删除的是已选择的地址
                        if (this.addressId === this.sourceId) {
                            prePage().changeAddress(null);
                        }
                    }
                }).catch(() => {
                    //异常处理
                })
            }
        },
        //选择地址
        checkAddress(item) {
            if (this.editing) {
                return
            }
            if(!item.valid){
                return uni.showToast({
                    title: "该地址已失效，请重新编辑该地址",
                    icon:'none'
                })
            }
            if (this.source == 1) {
                // prePage().orderAddress=item
                this.isFromBackBtn = false
                prePage().changeAddress(item);
                uni.$emit('addressBack', 1)
                setTimeout(() => {
                    this.$Router.back(1)
                }, 500)
            } else if (this.source == 2 || this.source == 3) {
                this.editing = true
                //从订单详情或订单列表里面进入的地址列表
                this.addressId = item.addressId
                this.popTip = '确认修改地址?'
                this.popType = 'edit'
                this.$refs.popup.open()
            } else if (this.source == 4) {
                this.giftConfirm(item);
            }
        },
        giftConfirm(item) {
            const adderssJson = {
                provinceCode: item.provinceCode,
                cityCode: item.cityCode,
                districtCode: item.districtCode,
                townCode: item.townCode ? item.townCode : '',
                addressAll: item.addressAll,
                detailAddress: item.detailAddress,
                telMobile: item.telMobile,
                memberName: item.memberName,
                addressId: item.addressId
            }
            var pages = getCurrentPages(); //当前页面栈  
            if (pages.length > 1) {
                var beforePage = pages[pages.length - 2]; //获取上一个页面实例对象 
                beforePage.$vm.$refs.address.giftAddressAnalyse(adderssJson); //触发上个面中的方法 
            }
            setTimeout(() => {
                this.$Router.back(1)
            }, 200)
        },
        operateAddress(type, addressId) {
            let that = this;
            that.curOperateId = '';
            let query = {
                type
            }
            
            if (type == 'edit') {
                query.addressId = addressId
            }
            this.$nextTick(() => {
                that.$Router.push({ path: '/views/address/operate', query })
            })
        },
        //删除地址事件
        delAddress(addressId) {
            this.popTip = '确定删除地址?'
            this.popType = 'del'
            this.addressId = addressId
            this.$refs.popup.open()
        },
        //设为默认地址事件
        defAddress(item) {
            let param = { ...item };
            param.share = param.share ? param.share : false;
            param.isDefault = 1; //是否设为默认地址（0非默认地址 1默认地址）
            param.townCode = param.townCode ?? '';
            param.tags = param.tags ?? '';
            addressHandler.editAddress(param).then(async res => {
                uni.showToast({
                    title:res.msg,
                    icon:'none'
                })
                if (res.state == 200) {
                    this.controlShow = false
                    this.getAddressList();
                } else {
                    //错误提示
                    uni.showToast({
                        title:res.msg,
                        icon:'none'
                    })
                }
            })
        },
        // 获取微信地址
        getAddressFromWx() {
            Authorization.getWxAddress().then(res => {
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
    min-height: 100%;
    width: 100%;
    padding-bottom: 128rpx;
}

.address_list {
    padding-bottom: 40rpx;
}

.list {
    padding: 20rpx 30rpx;
    background: #fff;
    position: relative;
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

.flex_column_start_start {
    padding-right: 80rpx;
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
        background: url('https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/common/icon/btn_common_weizhi.svg') center no-repeat;
    }
    .addressAll_text_box {
        padding-right: 74rpx;
        text-align: justify;
        font-size: 26rpx;
        word-break: break-all;
        font-weight: 400;
        margin-bottom: 4rpx;
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
            background: url('https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/common/icon/btn_common_radio_edit.svg') center no-repeat;
            background-size: 100% 100%;
        }
    }

}

.icon-bianji {
    display: flex;
    align-items: center;
    height: 80rpx;
    font-size: 40rpx;
    // color: #909399;
    padding-left: 30rpx;
}

.add_btn_bottom {
    position: fixed;
    width: 750rpx;
    bottom: 0;
    padding: 20rpx 30rpx;
    background: #FFFFFF;
    z-index: 95;
    display: flex;
    align-items: center;
    justify-content: space-around;
    // padding-bottom: constant(safe-area-inset-bottom);
    // padding-bottom: env(safe-area-inset-bottom);
    .btn {
        width: 45%;
        font-size: 26rpx;
        border-radius: 44rpx;
        letter-spacing: 1rpx;
        &::after {
            border-width: 0;
        }
    }
    .import {
        background: #fff;
        border: 1rpx solid #cbcbcb;
        color: #161618;
        display: flex;
        align-items: center;
        justify-content: center;
        .weixin-icon {
            width: 28rpx;
            margin-right: 4rpx;
        }
    }
    .add_btn {
        color: #fff;
        background: #f30300;
    }
}

.empty_part {
    display: flex;
    flex-direction: column;
    align-items: center;
    flex: 1;
    width: 100%;
    height: 100%;
    padding-top: calc((100vh - var(--titleBarFillHeight, 0px)) * 0.32 - 128rpx);

    .img {
        width: 256rpx;
        height: 256rpx;
    }

    .tip_con {
        color: #999;
        font-size: 28rpx;
    }

}

.rightBtn {
    display: flex;
    height: 100%;
}

.slot_line {
    margin-left: 2rpx;
}

.slot-button {
    width: 120rpx;
    height: 100%;
    background: #E82B29;
    color: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 0 20rpx 20rpx 0;
}

.slot-button-default {
    border-radius: 0;
    background: #c2c2c2;
}

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
    color:#fff !important;
    font-size: 20rpx !important;
    vertical-align: top;
    &.mar8 {
        margin-right: 8rpx;
    }
}
.default-tag{
    margin-right: 12rpx;
    background: #f30300;
}
.unvalid{
    border: 1px solid #999;
    background: #999;
    color: #fff;
}
::v-deep {
    .uni-popup__wrapper-box {
        padding-bottom: 0!important;
    }
}
::v-deep .uni-swipe_button {
    width: 130rpx;
    padding: 0;
}
</style>
