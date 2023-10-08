<template>
    <view class="content">
        <template v-if='addressList.length'>
            <view class="address_list">
                <view v-for="(item, index) in addressList" :key="index" @click="checkAddress(item)"
                    :class="{'list':true,'b-b':index!=addressList.length-1}">
                    <swiper-action
                        @cellOpen="followId = item.commonAddressId"
                        :cellShow="followId === item.commonAddressId"
                        @cellMoving="cellMoving => isCellMoving = cellMoving"
                    >
                        <view>
                            <view class="u-box">
                                <text class="address">{{item.area | formateArea}} {{item.address}}</text>
                                <text @click.stop="operateAddress('edit', item)" class="editicon iconfont icon_edit"></text>
                            </view>
                        </view>

                        <template slot="right">
                            <view @click.stop="delAddress(item.commonAddressId)" class="slot-button"><text class="slot-button-text">删除</text></view>
                        </template>
                    </swiper-action>
                </view>
            </view>
            <view class="add_btn_bottom">
                <button class="add_btn flex_row_center_center" @click="operateAddress('add')">
                    {{$L('新建公司共享地址')}}</button>
            </view>
        </template>
        <template v-if="!addressList.length&&loadingState != 'first_loading'">
            <view class="flex_column_start_center empty_part">
                <view class="img"></view>
                <text class="tip_con">{{$L('还没有公司共享地址哦')}}~</text>
                <view class="ope_btn flex_row_center_center" @click="operateAddress('add')">
                    {{$L('新建公司共享地址')}}
                </view>
            </view>
        </template>
        <!-- <loadingState v-if="loadingState == 'first_loading'||addressList.length > 0" :state='loadingState' /> -->
        <uni-popup ref="popup" type="dialog">
            <uni-popup-dialog type="input" :before-close="true" :title="$L('提示')" :content="popTip" :duration="2000" @close="cancelChange"
                @confirm="confirmChange"></uni-popup-dialog>
        </uni-popup>
    </view>
</template>

<script>

import uniPopup from '@/components/uni-popup/uni-popup.vue'
import uniPopupDialog from '@/components/uni-popup/uni-popup-dialog.vue'
import swiperAction from '@/components/swiper-action'
import addressHandler from '@/components/address/handler';   
export default {
    components: {
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
            addressList:[], //分享地址
            followId: '',
            isCellMoving: false
        }
    },
    filters:{
        //过滤掉三级联动字符串里面的"/"
        formateArea(value){
            let newValue ;
            try {
                newValue = value.replace(/\//ig,'');
            } catch (error) {
                
            }
            return newValue;
        }
    },
    mounted(){
        this.orderSn = this.$Route.query.orderSn;
        this.source = this.$Route.query.source
            ? this.$Route.query.source :
            0; // source ：3 从订单详情页的修改地址进入的    2：从订单列表的修改地址进入    1：从确认下单页面的修改地址进入的
        this.sourceId = 15;
        this.getAddressList();
    },
    computed: {
            
    },
        
    methods: {

        //获取分享地址列表
        getAddressList() {
            uni.showLoading();
            addressHandler.listCommonAddress({
                project: "MALL"
            }).then(res => {
                uni.hideLoading();
                if (res.state == 200) {
                    this.addressList = res.data.list
                } else {
                    this.$api.msg(res.msg);
                }
                this.loadingState = 'complete';
            }).catch(() => {
                uni.hideLoading();
                //异常处理
            })
        },
        cancelChange() {
            this.editing = false
            this.$refs.popup.close()
        },
        confirmChange() {
            this.$refs.popup.close()
            addressHandler.deleteCommonAddress({
                commonAddressIds: [this.commonAddressId]
            }).then(res => {
                if (res.state == 200) {
                    this.$api.msg('删除成功');
                    this.getAddressList();
                } else {
                    this.$api.msg(res.msg);
                }
            }).catch(() => {
                //异常处理
            })
        },


        //选择导入的公司共享地址
        checkAddress(item) {
            if (this.isCellMoving) { return }
            let area = item.area.split('/')
            let areaCode = item.areaCode.split('/')
            const adderssJson = {
                provinceCode:areaCode[0],
                cityCode:areaCode[1],
                districtCode:areaCode[2],
                townCode:areaCode[3]?areaCode[3]:'',
                province:area[0],
                city:area[1],
                county:area[2],
                town:area[3]?area[3]:'',
                exactAddress:item.address
            } 
            var pages = getCurrentPages(); //当前页面栈  
            if (pages.length > 1) {
                var beforePage = pages[pages.length - 2]; //获取上一个页面实例对象  
                beforePage.$vm.onAddressAnalyse(adderssJson); //触发上个面中的方法 
            }
            setTimeout(()=>{
                this.$Router.back(1)
            },200)
        },
        //编辑和删除的操作
        operateAddress(type, item) {
            let query = {
                type
            }
            if (type == 'edit') {
                query.data = JSON.stringify(item)
            }
            this.$Router.push({path:'/pages/address/addshare',query})
        },
            
        //删除地址事件
        delAddress(commonAddressId) {
            this.popTip = '确定删除地址?'
            this.popType = 'del'
            this.commonAddressId = commonAddressId
            this.$refs.popup.open()
        }
            
    }
}
</script>

<style lang='scss'>
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
        padding-bottom: 128rpx;
    }

    .address_list {
        padding-bottom: 158rpx;
    }

    .list {
        /* display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: flex-start; */
        padding: 30rpx 30rpx;
        background: #fff;
        position: relative;

        &.b-b {
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

        .mask {
            position: absolute;
            z-index: 4;
            left: 0;
            right: 0;
            top: 0;
            bottom: 0;
            background: rgba(0, 0, 0, .6);

            view {
                width: 166rpx;
                height: 90rpx;
                border-radius: 45rpx;
                color: #fff;
                font-size: 34rpx;

                &.edit {
                    background: linear-gradient(-90deg, rgba(254, 152, 32, 1), rgba(255, 183, 43, 1));
                }

                &.del {
                    background: linear-gradient(-90deg, rgba(252, 29, 28, 1), rgba(255, 122, 24, 1));
                    margin-left: 80rpx;
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
    .flex_column_start_start{
        padding-right: 10rpx;
    }
    

    .u-box {
        display: flex;
        font-size: 30rpx;
        color: $font-color-light;
        color: $main-font-color;
        font-weight: bold;
        align-items: center;
        min-height: 60rpx;
        .address {
            flex: 1;
            font-size: 26rpx;
            color: main-font-color;
            line-height: 38rpx;
            margin-top: 5rpx;
            word-break: break-all;
        }
        .editicon{
            // position: absolute;
            // top: 30rpx;
            // right: 30rpx;
            margin-left: 20rpx;
            font-size: 30rpx;
            color: #999;
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
        height: calc(168rpx + var(--safe-area-inset-bottom));
        bottom: 0;
        padding: 40rpx 0 var(--safe-area-inset-bottom);
        background: #FFFFFF;
        margin: 0 auto;
        z-index: 95;

        .add_btn {
            width: 664rpx;
            font-size: 34rpx;
            color: var(--confirmBtnTextColor);
            height: 88rpx;
            background: var(--confirmBtnBgColor2);
            border-radius: 44rpx;
            letter-spacing: 1rpx;
        }
    }

    .empty_part {
        display: flex;
        flex: 1;
        width: 100%;
        height: 100%;
        padding-top: calc((100vh - var(--titleBarFillHeight, 0px)) * 0.32 - 128rpx);
        background: #fff;

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
            color: var(--confirmBtnTextColor);
            font-size: 28rpx;
            padding: 0 25rpx;
            height: 54rpx;
            background: var(--confirmBtnBgColor2);
            border-radius: 27rpx;
            margin-top: 20rpx;
        }
    }
    .slot-button{
         width: 120rpx;
         height: 100%;
         background: var(--confirmBtnBgColor2);
         color: var(--confirmBtnTextColor);
         display: flex;
         justify-content: center;
         align-items: center;
         border-radius: 0 20rpx 20rpx 0;
         margin-left: 2rpx;
     }
     .slot-button-default{
         border-radius: 0 ;
         background: #c2c2c2;
     }
</style>
