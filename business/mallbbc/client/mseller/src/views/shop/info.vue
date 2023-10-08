<template>
    <view class="container">
        <template v-if="!loading">
            <view v-if="shopList && shopList.length > 0" class="wrap">
                <view v-for="(item) in shopList" :key="item.shopId" class="wrap_item">
                    <view class="left">
                        <image :src="getShopLogo(item.logo)" mode="widthFix"></image>
                    </view>
                    <view class="right">
                        <view class="name">{{item.shopName}}</view>
                        <view v-if="item.areaInfo" class="shop_address">
                            <image class="icon" src="https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/O2O/icon/weizhi.svg" mode="widthFix"></image>
                            <view class="text">{{item.areaInfo?item.areaInfo:''}}{{item.address?item.address:''}}</view>
                        </view>
                        <view v-if="item.servicePhone && item.servicePhone.length > 0" class="phone">
                            <image class="icon" src="https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/O2O/icon/btn_common_phone.svg" mode="widthFix"></image>
                            <view v-if="isPC" class="text">
                                <text v-for="(temp, index) in item.servicePhone" :key="index">{{index==(item.servicePhone.length-1) ? temp : (temp+',')}}</text>
                            </view>
                            <view v-else class="text">
                                <a v-for="(temp, index) in item.servicePhone" :key="index" :href="'tel:'+ temp ">{{index==(item.servicePhone.length-1) ? temp : (temp+',')}}</a>
                            </view>
                        </view>
                    </view>
                </view>
                <u-loadmore :status="loadingState" line />
            </view>
            <template v-else>
                <empty tips="暂无门店信息"/>
            </template>
        </template>

    </view>
</template>

<script>
import shopHandler from '@/views/shop/handler';
import empty from '@/common/components/empty'
import { isNotEmpty, checkPaginationHasMore } from '@/utils/common';
export default {
    mixins: [],
    data() {
        return {
            defaultShopLogo: 'https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/O2O/icon/icon_yhq_dianpu_nor.svg', // 默认店铺logo
            shopList: [],
            shopIds: '',
            isPC: SnUtils?.isPC() ? true : false,
            hasMore: true, //是否还有更多
            current: 1,
            pageSize: 20,
            loadingState: 'loadmore',
            loading: true
        };
    },
    components: {
        empty
    },
    // 设置当前页面分享到朋友
    onShareAppMessage(option) {
        
    },
    computed:{
      
    },

    watch:{
       
    },
 
    created() {
        this.shopIds = this.$Route.query.shopIds;
        this.getShopList()
    },
    onHide(){
    },
    onReachBottom(){
        this.getMoreData()
    },  
 
    methods: {
        getShopLogo(img){
            if(isNotEmpty(img) && !!img.startsWith('http')){
                return img;
            }
            return this.defaultShopLogo;
        },
        /***
         * 获取店铺列表
         */
        getShopList(){
            let params = {
                current: this.current,
                pageSize: this.pageSize,
                state: 1 //可用门店 非停用
            }
            if(isNotEmpty(this.shopIds)){
                params = {...params, ids: this.shopIds};
            }
            this.loadingState = "loading"
            shopHandler.getShopList(params).then(res => {
                if(res.state == 200 && res?.data?.list?.length > 0){
                    if(this.current == 1){
                        this.shopList = res.data.list;
                    } else {
                        this.shopList = this.shopList.concat(res.data.list);
                    }   
                    this.hasMore = checkPaginationHasMore(res.data.pagination); //是否还有数据
                    if (this.hasMore){
                        this.current++;
                        this.loadingState = 'loadmore';
                    } else {
                        this.loadingState = 'nomore';
                    }
                }
            }).catch(e => {
                console.log(e);
            }).finally(() => {
                this.loading = false;
            })
        },

        getMoreData(){
            if(this.hasMore){
                this.getShopList();
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.wrap{
    padding: 0 32rpx;
    padding-bottom: 30rpx;
    .wrap_item{
        margin-top: 24rpx;
        display: flex;
        background-color: #fff;
        border-radius: 20rpx;
        padding: 28rpx;
        .left{
            width: 128rpx;
            height: 128rpx;
            overflow: hidden;
            border-radius: 16rpx;
            image{
                width: 128rpx;
            }
        }
        .right{
            min-height: 128rpx;
            flex: 1;
            margin-left: 24rpx;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            .name{
                width: 100%;
                font-size: 28rpx;
                font-weight: 600;
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
                    a{
                        text-decoration: none;
                        margin-right: 8rpx;
                        color: #FF711E;
                    }
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
                    a{
                        text-decoration: none;
                        margin-right: 8rpx;
                        color: #FF711E;
                    }
                }
            }

        }
    }
}
</style>
