<template>
    <view :class="['container']" :style="[styleTop]">
        <view class="top_wrap">
            <view @click="showActionSheetFun" class="user">
                <view class="user_name">
                    <image src="https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/O2O/shop/icon_sh_touxiang_nor.svg" mode="widthFix"></image>
                    <text>{{userInfo.vendorNickname || userInfo.vendorName}}</text>
                </view>
                <image class="arrow" src="https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/O2O/icon/btn_common_rightarrow_white.svg" mode="widthFix"></image>
            </view>
            <view class="shop_container">
                <template v-if="choosedShop && choosedShop.shopName">
                    <view @click="showPicker=true" class="choosed_shop">
                        <text>{{choosedShop.shopName}}</text>
                        <image src="https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/O2O/icon/btn_common_rightarrow.svg" mode="widthFix"></image>
                    </view>
                    
                    <view class="scan_box">
                        <view @click="miniScan" class="scan_item">
                            <image src="https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/O2O/scan/btn_yhq_saomao.svg" mode="widthFix"></image>
                            <view class="text">扫码核销</view>
                        </view>
                        <view @click="toCashInput" class="scan_item">
                            <image src="https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/O2O/scan/btn_yhq_shoudong.svg" mode="widthFix"></image>
                            <view class="text">手动核销</view>
                        </view>
                    </view>
                </template>

                <template v-else>
                    <empty tips="暂未关联门店"/>
                </template>
            </view>
        </view>

        <!-- 历史核验列表 -->
        <view class="history">
            <view class="title">历史记录</view>
            <view v-if="hasCheckedList" class="list" :style="[listHeight]">
                <scroll-view scroll-y="true" :style="[listHeight]" class="scroll-list" @scrolltolower="getMoreData">
                    <view @click="toCashDetail(item.couponCode)" v-for="(item) in checkList" :key="item.couponCode" class="check_item">
                        <view class="left">
                            <view v-if="item.publishValue && item.couponType == 1" class="price num-font"><text>￥</text>{{item.publishValue}}</view>
                            <view v-if="item.publishValue && item.couponType == 2" class="price num-font">{{item.publishValue / 10}}<text>折</text></view>
                            <view class="rules">{{item.couponContent}}</view>
                        </view>
                        <view class="middle">
                            <view class="name">{{item.couponName}}</view>
                            <view v-if="item.couponType == 2 && item.discountLimitAmount" class="dicout_limit">最多优惠<text class="num-font">{{item.discountLimitAmount}}</text>元</view>
                            <view v-if="item.effectiveStart" class="time_range">
                                <view>{{item.effectiveStart}}~</view>
                                <view>{{item.effectiveEnd}}</view>
                            </view>
                        </view>
                        <view class="right">
                            <image :src="getBgImage(item.useState)" mode="widthFix"></image>
                        </view>

                        <view class="top_icon">消费券</view>
                    </view>
                    <u-loadmore :status="loadingState" line />
                </scroll-view>
            </view>

            <view class="list empty_list" :style="[listHeight]" v-else-if="!hasMore">
                <empty tips="暂无内容"/>
            </view>
        </view>
    
        <!-- 门店选择picker -->
        <u-picker 
            :show="showPicker" 
            closeOnClickOverlay 
            :defaultIndex="chooosedIndexArray" 
            :columns="columns" 
            keyName="shopName"
            confirmColor="#FF711E"
            @close="closePick"
            @cancel="closePick"
            @confirm="confirmShop"
        ></u-picker>

        <!-- 退出登录的actionsheet -->
        <u-action-sheet
            :show="showActionSheet"
            round="28rpx"
            :closeOnClickOverlay="true"
            :safeAreaInsetBottom="true"
            @close="closeActionSheet"
        >
            <view class="action-sheet action-sheet-title">确定退出登录</view>
            <view @click="loginOut" class="action-sheet action-sheet-loginout">退出登录</view>
            <view @click ="closeActionSheet" class="action-sheet action-sheet-cancle">取消</view>
        </u-action-sheet>
    </view>
</template>

<script>
import { loginOut as loginAhthOut } from '@/utils/auth/index';
import shopHandler from '@/views/shop/handler';
import { cashState } from '@/common/lib/enum/cash';
import { getStorageSync, setStorageSync, isArray, checkPaginationHasMore, toLogin, removeShopStorage, scan, isNotEmpty } from '@/utils/common';
import config from '@/common/lib/config'
import empty from '@/common/components/empty'
export default {
    mixins: [],
    data() {
        return {
            showPicker: false,
            shopList: [], // 门店列表
            chooosedIndex: 0,
            columns: [], //渲染的门店列表
            checkList: [], //当前门店的核销记录列表
            cashState,
            vendorId: getStorageSync(config.STORAGE_CACHE_KEY.VENDORID) || '',
            loadingState: 'loadmore',
            current: 1,
            pageSize: 20,
            hasMore: true,
            showActionSheet: false,
            userInfo: getStorageSync(config.STORAGE_CACHE_KEY.USER_INFO) || {}
        };
    },
    components: {
        empty
    },
    
    computed:{
        /**
         * 选中的门店信息
         */
        choosedShop(){
            return this.shopList[this.chooosedIndex];
        },

        chooosedIndexArray(){
            return [this.chooosedIndex]
        },

        // 是否有核销历史列表 
        hasCheckedList(){
            return this.checkList.length > 0 
        },
        styleTop(){
            return {
                paddingTop: this.navHeight + 'px'
            }
        },
        listHeight(){
            return {
                height: `calc(100vh - ${this.navHeight}px - 500rpx - 180rpx)`
            }
        }
    },

    watch:{
        choosedShop: {
            handler(newVal){
                this.current = 1;
                this.getCheckListByShop(newVal)
            },
            deep: true
        }
    },
 
    created() {
        this.initStoreList();
        this.chooosedIndex = getStorageSync(config.STORAGE_CACHE_KEY.CHOOSED_SHOP_INDEX) || 0;
    },
    onHide(){
    },
 
    methods: {
        /***
         * 退出登录
         */
        loginOut(){
            removeShopStorage();
            loginAhthOut(); //退出登录
            toLogin(); // 跳转到登录页面
        },
        /***
         * 底部显示退出登录的弹窗提示
         */
        showActionSheetFun(){
            this.showActionSheet = true;
        },  
        /***
         * 底部关闭退出登录的弹窗提示
         */
        closeActionSheet(){
            this.showActionSheet = false;
        },  
        /****
         * 获取门店列表
         */
        initStoreList(){
            this.shopList = getStorageSync(config.STORAGE_CACHE_KEY.SHOPLIST_CACHE_KEY);
            if(isArray(this.shopList)){
                this.columns = [this.shopList]
            }
        },

        /****
         * 获取门店列表
         */
        getCheckListByShop(){
            if(!!!this.choosedShop || !!!this.choosedShop.shopId || !!!this.vendorId){
                this.hasMore = false;
                console.log('店铺shopId不能为空');
                return
            }
            let params = {
                verifyShopId: this.choosedShop.shopId,
                vendorId: this.vendorId,
                current: this.current,
                pageSize: this.pageSize
            }
            this.loadingState = "loading"
            shopHandler.getCheckListByShop(params).then(res => {
                if(res.state == 200){
                    if (this.current == 1){
                        this.checkList = res.data.list;
                    } else {
                        this.checkList = this.checkList.concat(res.data.list);
                    }
                    this.hasMore = checkPaginationHasMore(res.data.pagination); //是否还有数据
                    if (this.hasMore){
                        this.current++;
                        this.loadingState = 'loadmore';
                    } else {
                        this.loadingState = 'nomore';
                    }
                } else {
                    uni.showToast({
                        icon: 'none',
                        title: res.msg
                    })
                }
            }).catch(e => {
                console.log(e);
            }).finally(() => {

            })
        },
        //页面到底部加载更多数据
        getMoreData(){
            if (this.hasMore){
                this.getCheckListByShop();
            }
        },

        /***
         * 获取背景图片
         */
        getBgImage(state){
            return this.cashState[state]?.bgImage
        },

        /***
         * 关闭选择门店的picker
         */
        closePick(){
            this.showPicker = false;
        },

        /***
         * 选择店铺
         */
        confirmShop(shop){
            this.chooosedIndex = shop.indexs[0]
            setStorageSync(config.STORAGE_CACHE_KEY.CHOOSED_SHOP_INDEX, shop.indexs[0])
            this.closePick();
        },

        /**
         * 跳转到手动核验接口
         */
        toCashInput(){
            this.$Router.push({
                path: '/views/shop/cashInput',
                query: {
                    shopId: this.choosedShop.shopId
                }
            })
        },

        /****
         * 跳转到消费详情页面
         */
        toCashDetail(code){
            this.$Router.push({
                path: '/views/shop/cashDetail',
                query: {
                    code,
                    shopId: this.choosedShop.shopId
                }
            })
        },

        /**
         * 获取门店核销优惠券详情
         */
        getCashDetail(couponCode){
            return new Promise(resolve => {
                let params = {
                    couponCode
                }
               
                shopHandler.getCashDetail(params).then(res => {
                    if(res.state == 200 && res.data.couponCode){
                        resolve({
                            done: true,
                            des: '成功'
                        })
                    } else {
                        resolve({
                            done: false,
                            des: res.msg
                        })
                    }
                }).catch(e => {
                    console.log(e);
                    resolve({
                        done: false,
                        des: '根据券码获取详情失败'
                    })
                }).finally(() => {
                })
            })
        },

        /***
         * 小程序的扫一扫
         */
        async miniScan(){
            try {
                let result = await scan();
                let code = result.result;
                if(isNotEmpty(code)){
                    uni.showLoading({
                        title: '加载中',
                        mask: true
                    })
                    let {done, des} = await this.getCashDetail(code)
                    if(done){
                        setTimeout(()=>{
                            // 延时进入消费券详情 给人友好交互体验
                            this.toCashDetail(code)
                        }, 1000)
                    }else{
                        uni.hideLoading()
                        uni.showToast({
                            icon: 'none',
                            title: des
                        })
                    }
                }else {
                    uni.hideLoading()
                    uni.showToast({
                        icon: 'none',
                        title: '未检测到二维码'
                    })
                }
            } catch (error) {
                uni.hideLoading()
                uni.showToast({
                    icon: 'none',
                    title: '扫码失败'
                })
            }
           
        }
    }
}
</script>

<style lang="scss" scoped>
.container{
    background: url('https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/O2O/shop/bg_sh_bg.png') top center no-repeat;
    background-size: 100% auto;
    .shop_container{
        ::v-deep .empty_box{
            background-color: #fff;
            padding-top: 0;
            .empty_img{
                width: 200rpx;
                height: 200rpx;
            }
        }
    }
    
    .top_wrap{
        padding: 0rpx 30rpx;

        .user{
            padding-top: 20rpx;
            color: #fff;
            display: flex;
            align-items: center;
            .user_name{
                font-size: 30rpx;
                font-weight: 600;
                flex: 1;
                line-height: 42rpx;
                display: flex;
                align-items: center;
                text{
                    display: inline-block;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    max-width: 360rpx;
                }
                image{
                    width: 56rpx;
                    height: 56rpx;
                    margin-right: 16rpx;
                }
            }
            .arrow{
                width: 24rpx;
                height: 24rpx;
            }
            
        }

        .shop_container{
            padding: 120rpx 0 86rpx 0;
            margin-top: 32rpx;
            background: #ffffff;
            border-radius: 20rpx;
            backdrop-filter: blur(12rpx);
            position: relative;
            .choosed_shop{
                padding: 0 44rpx;
                height: 64rpx;
                background: #eff2f5;
                border-radius: 0rpx 0rpx 40rpx 40rpx;
                position: absolute;
                top: 0;
                left: 50%;
                transform: translateX(-50%);
                font-size: 28rpx;
                display: flex;
                align-items: center;
                justify-content: center;
                text{
                    display: inline-block;
                    max-width: 340rpx;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }

                image{
                    width: 24rpx;
                    margin-left: 8rpx;
                }
            }
        }

    }
    .scan_box{
        display: flex;
        justify-content: space-around;
        .scan_item{
            width: 120rpx;
            text-align: center;
            image{
                width: 120rpx;
            }
            .text{
                font-size: 28rpx;
                margin-top: 24rpx;
                font-weight: 600;
            }
        }
    }
}

.history{
    padding: 0 30rpx;
    .title{
        margin-top: 40rpx;
        margin-bottom: 38rpx;
        height: 42rpx;
        font-size: 30rpx;
        font-weight: 600;
    }
    .list{
    }
    .empty_list{
        border-radius: 20rpx;
        background-color: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .scroll-list{
        .check_item{
            margin-bottom: 28rpx;
            background-color: #fff;
            border-radius: 16rpx;
            display: flex;
            align-items: center;
            color: #222;
            position: relative;
            .top_icon{
                width: 124rpx;
                height: 36rpx;
                font-size: 22rpx;
                display: flex;
                justify-content: center;
                align-items: center;
                background: #e8e8e8;
                border-radius: 16rpx 0rpx 16rpx 0rpx;
                position: absolute;
                top: 0;
                left: 0;
                color: #A7A7A7;
            }

            .left{
                width: 192rpx;
                text-align: center;
                opacity: .4;
                font-size: 56rpx;
                font-weight: 500;
                .price{
                    text{
                        font-size: 28rpx;
                    }
                }
                .rules{
                    font-size: 24rpx;
                    padding: 0 10rpx;
                    word-break: break-all;
                }
            }
            .middle{
                opacity: .4;
                flex: 1;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                padding-right: 24rpx;
                padding: 8rpx 0rpx 8rpx 6rpx;

                .name{
                    font-weight: 600;
                    font-size: 28rpx;
                    text-overflow: -o-ellipsis-lastline;
                    overflow: hidden;				//溢出内容隐藏
                    text-overflow: ellipsis;		//文本溢出部分用省略号表示
                    display: -webkit-box;			//特别显示模式
                    -webkit-line-clamp: 2;			//行数
                    line-clamp: 2;					
                    -webkit-box-orient: vertical;	//盒子中内容竖直排列
                }
                .time_range{
                    font-size: 22rpx;
                    margin-top: 18rpx;
                    text-align: justify;
                }
                .dicout_limit{
                    padding: 4rpx 10rpx;
                    color: #A7A7A7;
                    border: 1px solid #A7A7A7;
                    border-radius: 6rpx;
                    font-size: 20rpx;
                    margin-top: 8rpx;
                    width: fit-content;
                }
            }
            .right{
                border-radius:0 16rpx 16rpx 0;
                width: 176rpx;
                position: relative;
                background: #E8E8E8;
                padding: 8rpx;
                image{
                    width: 176rpx;
                    opacity: .4;
                }
                &::before{
                    content: "";
                    position: absolute;
                    width: 28rpx;
                    height: 28rpx;
                    background-color: #eff2f5;
                    border-radius: 50%;
                    top: -16rpx;
                    left: -14rpx;
                    z-index: 100;
                }
                &::after{
                    content: "";
                    position: absolute;
                    width: 28rpx;
                    height: 28rpx;
                    background-color: #eff2f5;
                    border-radius: 50%;
                    bottom: -16rpx;
                    left: -14rpx;
                    z-index: 100;
                }
            }
        }
    }
}
.action-sheet{
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    &.action-sheet-title{
        height: 80rpx;
        font-size: 24rpx;
        color: #999;
        border-bottom: 1px solid #E8E8E8;
    }
    &.action-sheet-loginout{
        height: 108rpx;
        font-size: 30rpx;
        color: #F30300;
        border-bottom: 20rpx solid #eff2f5;
    }
    &.action-sheet-cancle{
        height: 108rpx;
        font-size: 30rpx;
        color: #222;
        font-weight: 600;
    }
}
</style>
