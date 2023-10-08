<template>
    <view v-if="!loading" class="container">
        <!-- 核销状态 -->
        <view class="top_part">
            <image :src="stateIcon" mode="widthFix"></image>
            <text>{{stateText}}</text>
        </view>

        <!-- 券码信息 -->
        <view class="cash_part">
            <view class="des">
                <view class="left">
                    <view v-if="couponDetail.publishValue && couponDetail.couponType == 1" class="num-font">
                        <text class="symbol">￥</text><text>{{couponDetail.publishValue}}</text>
                    </view>
                    <view v-if="couponDetail.publishValue && couponDetail.couponType == 2" class="num-font">
                        <text>{{couponDetail.publishValue / 10}}</text><text class="symbol">折</text>
                    </view>
                    <view class="rule">{{couponDetail.couponContent}}</view>
                </view>
                <view class="right">
                    <view class="name">{{couponDetail.couponName}}</view>
                    <view v-if="couponDetail.couponType == 2 && couponDetail.discountLimitAmount" class="dicout_limit">最多优惠<text class="num-font">{{couponDetail.discountLimitAmount}}</text>元</view>
                    <view class="date" v-if="couponDetail.effectiveStart">{{couponDetail.effectiveStart}}~{{couponDetail.effectiveEnd}}</view>
                </view>

                <view class="top_icon">消费券</view>
            </view>

            <view class="line"></view>

            <view class="code_num">
                <view class="code_top">券码</view>
                <view :style="[textStyle()]" :class="['nums', checkNums(couponDetail.couponCode)?'num-font':'']">{{formateNumber(couponDetail.couponCode)}}</view>
            </view>
        </view>


        <!-- 门店信息 -->
        <view class="shop_part">
            <view class="top">
                <view class="left">
                    <view class="name">适用门店</view>
                    <view v-if="someShopUse" class="shop_tips one">指定门店</view>
                    <view v-if="allShopUse" class="shop_tips all">所有门店</view>
                </view>
                <view @click="toMoreShop" class="right">
                    <text>更多适用门店</text>
                    <image src="https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/O2O/icon/btn_common_rightarrow.svg" mode="widthFix"></image>
                </view>
            </view>
            
            <view v-if="shopList && shopList.length > 0 && shop && Object.keys(shop).length > 0" class="shop_index">
                <view class="shop_index_wrap">
                    <view class="left">
                        <image :src="getShopLogo(shop.logo)" mode="widthFix"></image>
                    </view>
                    <view class="right">
                        <view class="name">{{shop.shopName}}</view>
                        <view v-if="shop.areaInfo" class="shop_address">
                            <image class="icon" src="https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/O2O/icon/weizhi.svg" mode="widthFix"></image>
                            <view class="text">{{shop.areaInfo?shop.areaInfo:''}}{{shop.address?shop.address:''}}</view>
                        </view>
                        <view v-if="shop.servicePhone && shop.servicePhone.length>0" class="phone">
                            <image class="icon" src="https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/O2O/icon/btn_common_phone.svg" mode="widthFix"></image>
                            <view class="text">
                                <text @click="callTel(temp)" v-for="(temp, index) in shop.servicePhone" :key="index">{{index==(shop.servicePhone.length-1) ? temp : (temp+',')}}</text>
                            </view>
                        </view>
                    </view>
                </view>
            </view>

            <view v-if="couponDetail.extendInfoVOList && couponDetail.extendInfoVOList.length > 0" class="use_time_range">
                <view class="left">可用时段</view>
                <view class="right">
                    <view v-for="(item, index) in couponDetail.extendInfoVOList" :key="index" class="time_item">
                        <view class="week">{{item.week}}</view>
                        <view>[{{item.period}}]</view>
                    </view>
                </view>
            </view>
            <view class="use_rule">
                <u-collapse :border="false">
                    <u-collapse-item
                        title="使用规则"
                        :clickable="false"
                        :border="false"
                    >
                        <text class="u-collapse-content">{{couponDetail.description}}</text>
                    </u-collapse-item>
                </u-collapse>
            </view>
        </view>
        
        <!-- 会员模块 -->
        <view v-if="memberInfo && Object.keys(memberInfo).length > 0" class="member_part">
            <view class="member_item border_bottom">
                <view class="left">会员呢称</view>
                <view class="right">{{memberInfo.memberNickName || memberInfo.memberName}}</view>
            </view>
            <view class="member_item border_bottom">
                <view class="left">手机号</view>
                <view class="right">{{memberInfo.memberPhone}}</view>
            </view>
            <view class="member_item border_bottom">
                <view class="left">领取渠道</view>
                <view class="right">{{memberInfo.receiveChannelName}}</view>
            </view>
            <view class="member_item">
                <view class="left">领取时间</view>
                <view class="right">{{memberInfo.receiveTime}}</view>
            </view>
        </view>
       

        <!-- 核验人模块 -->
        <view v-if="showChecker && checkMemberInfo && Object.keys(checkMemberInfo).length > 0" class="member_part">
            <view class="member_item border_bottom">
                <view class="left">核验人</view>
                <view class="right">{{checkMemberInfo.verifyUserName}}</view>
            </view>
            <view class="member_item border_bottom">
                <view class="left">核验时间</view>
                <view class="right">{{checkMemberInfo.verifyTime}}</view>
            </view>
            <view class="member_item">
                <view class="left">核验门店</view>
                <view class="right">{{checkMemberInfo.verifyStore}}</view>
            </view>
        </view>

        <!-- 核销备注模块 -->
        <view class="member_part mark_part">
            <view class="member_item check_mark">
                <view class="left">核销备注</view>
                <view @click="gotoMark" class="right">
                    <view v-if="memberInfo.remarks" class="mark_content">{{memberInfo.remarks}}</view>
                    <view v-else class="mark_content no_mark_content">请输入备注内容</view>
                    <image class="arrow" src="https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/O2O/icon/btn_common_rightarrow.svg" mode="widthFix"></image>
                </view>
            </view>
        </view>
        

        <!-- 核销吸底按钮-->
        <view v-if="showCheckBtn" :class="['check_btn', iosHairPhone ? 'iosBottomPadding' : 'androidBottomPadding']">
            <view @click="showCheckConfirm" class="btn">核销券码</view>
        </view>

        <!-- 核销券码的confirm提示框 -->
        <u-modal 
            :show="showCheckModal" 
            title="确定核销该券码吗？" 
            content="核销后，该券码将不可重复再次使用"
            confirmColor="#FF711E" 
            width="300px" 
            :showCancelButton="true"
            :closeOnClickOverlay="true"
            @confirm="checkCash"
            @cancel="closeModal"
            @close="closeModal"
        ></u-modal>

        <!-- 不在可用时间范围内，该时间为核销操作当前时间的confirm提示框 -->
        <u-modal 
            :show="showCheckNotimeModal" 
            title="确定核销该券码吗？" 
            content="该券码不在当前使用时段，核销后，该券码将不可重复再次使用"
            confirmColor="#FF711E" 
            width="300px" 
            :showCancelButton="true"
            :closeOnClickOverlay="true"
            confirmText="继续核销"
            @confirm="checkCash"
            @cancel="closeNotimeModal"
            @close="closeNotimeModal"
        ></u-modal>

        <!-- 该券码在当前店铺不可使用的confirm提示框 -->
        <u-modal 
            :show="showChangeShop" 
            confirmText="切换门店"
            cancelText="我知道了"
            content="该券码在当前店铺不可使用"
            confirmColor="#FF711E" 
            width="300px" 
            :showCancelButton="true"
            :closeOnClickOverlay="true"
            @confirm="changeShop"
            @cancel="closeChangeShop"
            @close="closeChangeShop"
        ></u-modal>
    </view>
</template>

<script>
import shopHandler from '@/views/shop/handler';
import { cashState } from '@/common/lib/enum/cash';
import { isNotEmpty, isEmpty, callPhone } from '@/utils/common';
export default {
    mixins: [],
    data() {
        return {
            couponCode: '', // 券码
            shopId: '', // 门店id
            cashState,
            showCheckModal: false, //确认框
            showChangeShop: false, //确认框
            showCheckNotimeModal: false, //确认框
            couponDetail: {},
            defaultShopLogo: 'https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/O2O/icon/icon_yhq_dianpu_nor.svg', // 默认店铺logo
            loading: true,
            shopIds: '', // 指定的门店ids
            shopList: []
        };
    },
    components: {},
   
    created() {
    },
    onShow(){
        this.couponCode = this.$Route.query.code;
        this.shopId = this.$Route.query.shopId;
        this.getCashDetail()
    },
    watch: {
        shopIds(val){
            this.getShopList(val)
        }
    },
    computed: {
        stateText(){
            try {
                return this.cashState[this.couponDetail.receiveMemberVO.useState]?.text
            } catch (error) {
                return ''
            }
        },
        stateIcon(){            
            try {
                return this.cashState[this.couponDetail.receiveMemberVO.useState]?.icon
            } catch (error) {
                return ''
            }
        },
        showChecker(){
            try {
                return this.cashState[this.couponDetail.receiveMemberVO.useState]?.showChecker
            } catch (error) {
                return false
            }
        },
        showCheckBtn(){
            try {
                return this.cashState[this.couponDetail.receiveMemberVO.useState]?.showCheckBtn
            } catch (error) {
                return false
            }
        },
        shop(){
            let dafaultShop = this.shopList?.[0];
            let selectShop = this.shopList.filter(item => {
                return this.shopId == item.id
            });
            if(selectShop.length > 0){
                return selectShop[0]
            }
            return dafaultShop
        },
        memberInfo(){
            return this.couponDetail?.receiveMemberVO
        },
        checkMemberInfo(){
            return this.couponDetail?.couponCheckMemberVO
        },
        // 指定门店
        someShopUse(){
            return this.couponDetail.useShopType == 0
        },
        // 所有门店
        allShopUse(){
            return this.couponDetail.useShopType == 1
        }
    },
    methods: {
        checkNums(str){
            let numReg = /^[0-9]*$/;
            return numReg.test(str)
        },
        getShopLogo(img){
            if(isNotEmpty(img) && !!img.startsWith('http')){
                return img;
            }
            return this.defaultShopLogo;
        },
        /**
         * 显示核销模态框
         */
        showCheckConfirm(){
            // 判断当前时间是否在使用时间段
            let startTime = new Date(this.couponDetail.effectiveStart.replace(/-/g, '/')).getTime()
            let endTime = new Date(this.couponDetail.effectiveEnd.replace(/-/g, '/')).getTime()
            let nowTime = new Date().getTime();
            if(nowTime >= startTime && nowTime <= endTime){
                this.showCheckModal = true;
                return
            }
            this.showCheckNotimeModal = true;
        },
        /**
         * 关闭核销模态框
         */
        closeModal(){
            this.showCheckModal = false;
        },
        /**
         * 关闭核销模态框
         */
        closeNotimeModal(){
            this.showCheckNotimeModal = false;
        },
        /**
         * 关闭核销模态框
         */
        closeChangeShop(){
            this.showChangeShop = false;
        },
        
        /**
         * 获取门店核销优惠券详情
         */
        getCashDetail(){
            let params = {
                couponCode: this.couponCode
            }
            uni.showLoading({
                title: '加载中',
                mask: true
            })
            shopHandler.getCashDetail(params).then(res => {
                if(res.state == 200 && res.data.couponCode){
                    this.couponDetail = res.data;
                    this.shopIds = this.couponDetail.shopIds
                } else {
                    uni.showToast({
                        icon: 'none',
                        title: res.msg
                    })
                }
            }).catch(e => {
                console.log(e);
            }).finally(() => {
                uni.hideLoading()
                this.loading = false;
            })
        },

        /***
         * 根据核销券的状态显示划线样式
         */
        textStyle(){
            if(Object.keys(this.couponDetail).length <= 0 || isEmpty(this.couponDetail.receiveMemberVO.useState)){ return {} }
            let flag = this.cashState[this.couponDetail.receiveMemberVO.useState].lineThrough;
            let obj = {textDecoration: 'line-through', color: '#999'}
            return flag ? obj : {};
        },
        
        /***
         * 核销接口
         */
        checkCash(){
            let params = {
                couponCode: this.couponCode,
                shopId: this.shopId
            }
            uni.showLoading({
                title: '核销中',
                mask: true
            })
            shopHandler.checkCash(params).then(res => {
                if(res.state == 200){
                    this.toCashResult()
                } else if(res.state == 256){
                    this.showChangeShop = true;
                }else{
                    uni.showToast({
                        icon: 'none',
                        title: res.msg
                    })
                }
            }).catch(e => {
                console.log(e);
            }).finally(() => {
                uni.hideLoading()
                this.showCheckModal = false
            })
        },

        /***
         * 跳转到核销结果页面
         */
        toCashResult(){
            this.$Router.push({
                path: '/views/shop/cashResult',
                query: {
                    couponMemberId: this.memberInfo.couponMemberId || '',
                    remarks: this.memberInfo.remarks || ''
                }
            })
        },
        /***
         * 跳转到核销备注页面
         */
        gotoMark(){
            uni.navigateTo({
                url: `/views/shop/mark?couponMemberId=${this.memberInfo.couponMemberId || ''}`
            })
        },
        /***
         * 跳转更多门店
         */
        toMoreShop(){
            let query = {}
            if(this.someShopUse){
                query = {...query, shopIds: this.shopIds}
            }
            this.$Router.push({
                path: '/views/shop/info',
                query
            })
        },

        // 格式化券码
        formateNumber(s){
            if(!!!s){ return '' }
            return s.toString().replace(/[0-9a-zA-Z]{4}(?=.)/g, '$& ');
        },

        changeShop(){
            this.closeChangeShop()
            uni.reLaunch({
                url: '/views/shop/index'
            });
        },

        /***
         * 获取店铺列表
         */
        getShopList(shopIds){
            let params = {
                current: 1,
                pageSize: 100,
                state: 1 //可用门店 非停用
            }
            if(this.someShopUse){
                params = {...params, ids: shopIds}
            }
            shopHandler.getShopList(params).then(res => {
                if(res.state == 200 && res?.data?.list?.length > 0){
                    this.shopList = res.data.list;
                }
            }).catch(e => {
                console.log(e);
            }).finally(() => {})
        },

        /***
         * 拨打电话的相关功能
         */
        callTel(phone){
            callPhone(phone)
        }
    }
}
</script>

<style lang="scss" scoped>
.container{
    padding: 0 30rpx;
    padding-bottom: calc(140rpx + constant(safe-area-inset-bottom));
    padding-bottom: calc(140rpx + env(safe-area-inset-bottom));
}
.top_part{
    padding: 32rpx 0;
    display: flex;
    align-items: center;
    justify-content: center;
    image{
        width: 48rpx;
        height: 48rpx;
    }
    text{
        margin-left: 12rpx;
        color: #222222;
        font-size: 48rpx;
        font-weight: 600;
    }
}

.cash_part{
    background-color: #ffffff;
    border-radius: 20rpx;
    .des{
        background-color: #fff4ef;
        border-radius: 20rpx 20rpx 0 0;
        padding: 28rpx 0rpx 40rpx 0;
        padding-bottom: 30rpx;
        display: flex;
        align-items: center;
        position: relative;
        .top_icon{
            width: 124rpx;
            height: 36rpx;
            font-size: 20rpx;
            display: flex;
            justify-content: center;
            align-items: center;
            background: #ff711e;
            border-radius: 20rpx 0rpx 20rpx 0rpx;
            position: absolute;
            top: 0;
            left: 0;
            color: #fff;
        }
        .left{
           width: 200rpx;
           color: #FF711E;
           font-size: 56rpx;
           font-weight: normal;
           text-align: center;
           .symbol{
                font-size: 28rpx;
           }
           .rule{
                font-size: 24rpx;
                word-break: break-all;
                margin-top: 10rpx;
                padding: 0 10rpx;
           }
        }
        .right{
           width: calc(100% - 200rpx);
           padding-right: 30rpx;
            .name{
                font-size: 28rpx;
                color: #222222;
                font-weight: 600;
                text-align: justify;
                // text-overflow: -o-ellipsis-lastline;
                // overflow: hidden;				//溢出内容隐藏
                // text-overflow: ellipsis;		//文本溢出部分用省略号表示
                // display: -webkit-box;			//特别显示模式
                // -webkit-line-clamp: 2;			//行数
                // line-clamp: 2;					
                // -webkit-box-orient: vertical;	//盒子中内容竖直排列
            }
            .dicout_limit{
                padding: 4rpx 10rpx;
                color: #FF711E;
                border: 1px solid #FF711E;
                border-radius: 6rpx;
                font-size: 20rpx;
                margin-top: 8rpx;
                width: fit-content;
            }
            .date{
                font-size: 22rpx;
                color: #222222;
                margin-top: 18rpx;
            }
        }
    }

    .code_num{
        background: #fff;
        padding: 44rpx 40rpx 50rpx 40rpx;
        border-radius: 0 0 20rpx 20rpx;
        .code_top{
            font-size: 28rpx;
            font-weight: 600;
            line-height: 40rpx;
            color: #222;
        }
        .nums{
            font-size: 34rpx;
            font-weight: 600;
            font-weight: normal;
            line-height: 48rpx;
            margin-top: 8rpx;
        }
    }
    .line{
        border-bottom: 2rpx dashed #ff924c;
        position: relative;
        &::before{
            content: "";
            width: 32rpx;
            height: 32rpx;
            border-radius: 50%;
            position: absolute;
            left: -14rpx;
            top: -16rpx;
            background-color: #eff2f5;
        }
        &::after{
            content: "";
            width: 32rpx;
            height: 32rpx;
            border-radius: 50%;
            position: absolute;
            right: -14rpx;
            top: -16rpx;
            background-color: #eff2f5;
        }
    }
}

.shop_part{
    margin-top: 24rpx;
    background-color: #fff;
    border-radius: 20rpx;
    padding-bottom: 20rpx;
    .top{
        padding: 0 28rpx;
        height: 96rpx;
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 28rpx;
        .left{
            color: #666;
            display: flex;
            align-items: center;
            .shop_tips{
                padding: 4rpx 10rpx;
                border-radius: 6rpx;
                font-size: 20rpx;
                width: fit-content;
                margin-left: 10rpx;
                &.one{
                    border: 1px solid #F30300;
                    color: #F30300;
                }
                &.all{
                    border: 1px solid #06C7C3;
                    color: #06C7C3;
                }
            }
        }
        .right{
            color: #222;
            display: flex;
            align-items: center;
            font-weight: 600;
            image{
                width: 24rpx;
                height: 24rpx;
                margin-left: 8rpx;
            }
        }
    }

    .shop_index{
        padding: 0 28rpx;
        .shop_index_wrap{
            padding: 20rpx;
            background: #eff2f5;
            border-radius: 12rpx;
            display: flex;
            align-items: center;
            margin-bottom: 22rpx;
        }
        .left{
            width: 128rpx;
            height: 128rpx;
            overflow: hidden;
            border-radius: 16rpx;
            image{
                width: 100%;
            }
        }
        .right{
            margin-left: 24rpx;
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            .name{
                font-size: 28rpx;
                text-overflow: -o-ellipsis-lastline;
                overflow: hidden;				//溢出内容隐藏
                text-overflow: ellipsis;		//文本溢出部分用省略号表示
                display: -webkit-box;			//特别显示模式
                -webkit-line-clamp: 2;			//行数
                line-clamp: 2;					
                -webkit-box-orient: vertical;	//盒子中内容竖直排列
            }
            .shop_address{
                margin-top: 18rpx;
                overflow: hidden;
                .icon{
                    float: left;
                    width: 24rpx;
                    margin-right: 8rpx;
                    margin-top: 4rpx;
                }
                .text{
                    font-size: 24rpx;
                    line-height: 34rpx;
                    overflow: hidden;
                    display: flex;
                    flex-wrap: wrap;
                }
            }
            .phone{
                margin-top: 18rpx;
                overflow: hidden;
                .icon{
                    float: left;
                    width: 24rpx;
                    margin-right: 8rpx;
                    margin-top: 4rpx;
                }
                .text{
                    font-size: 24rpx;
                    line-height: 34rpx;
                    overflow: hidden;
                    display: flex;
                    flex-wrap: wrap;
                    color: #FF711E;
                    text{
                        color: #FF711E;
                        margin-right: 8rpx;
                    }
                }
            }
        }
    }
    
    .use_time_range{
        margin-top: 22rpx;
        padding: 20rpx 28rpx;
        display: flex;
        justify-content: space-between;
        position: relative;
        &::after{
            content: "";
            border-bottom: 2rpx solid #e8e8e8;
            left: 28rpx;
            right: 0;
            bottom: 0;
            position: absolute;
        }
        .left{
            width: 180rpx;
            font-size: 28rpx;
            color: #666;
        }
        .right{
            flex: 1;
            text-align: right;
            font-size: 28rpx;
            color: #222;
            font-weight: 600;
            .week{
                margin-bottom: 8rpx;
            }
            .time_item{
                margin-bottom: 14rpx;
                &:last-child{
                    margin-bottom: 0;
                }
            }
        }
    }

    .use_rule{
        ::v-deep .u-cell__title-text{
            font-size: 28rpx;
            color: #666;
        }
    }
}

.member_part{
    margin-top: 24rpx;
    background-color: #fff;
    border-radius: 20rpx;
    padding-bottom: 12rpx;
    &.mark_part{
        padding-bottom: 0rpx;
    }
    .member_item{
        min-height: 96rpx;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 32rpx;
        font-size: 28rpx;
        .left{
            color: #666;
            width: 180rpx;
        }
        .right{
            flex: 1;
            color: #222;
            font-weight: 600;
            text-align: right;
        }
        
        &.check_mark{
            .right{
                text-align: right;
                display: flex;
                align-items: center;
                .mark_content{
                    padding: 10rpx 0;
                    flex: 1;
                    word-break: break-all;
                    &.no_mark_content{
                        font-weight: normal;
                        color: #999;
                    }
                }
                
                .arrow{
                    width: 24rpx;
                    margin-left: 8rpx;
                }
            }
        }
    }
}
.border_bottom{
    position: relative;
    &::after{
        content: "";
        position: absolute;
        border-bottom: 2rpx solid #e8e8e8;
        left: 32rpx;
        right: 0;
        bottom: 0;
    }
}
.check_btn{
    position: fixed;
    bottom: 0;
    padding: 20rpx 28rpx;
    background-color: #fff;
    width: 750rpx;
    left: 0;
    right: 0;
    box-sizing: border-box;
    .btn{
        background-color: #FF711E;
        border-radius: 40rpx;
        height: 80rpx;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #fff;
        font-size: 30rpx;
        font-weight: 600;
    }

}
</style>
