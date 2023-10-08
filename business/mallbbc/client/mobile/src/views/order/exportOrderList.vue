<template>
    <!-- 导入消费明细的组件放到src 目录下  原因：对外暴露的路由为：/exportOrderList 以生产为例：https://cloud.sinosun.com/mallbbc/static/mobile/index.html#/exportOrderList， 因为ngix转发前面如果带有pages/order 转发会有问题-->
    <view class="export_order_list">
        <view v-if="!showView" class="search_container">
            <u-search @search="initSearchOrderList" searchIconSize="44" @custom="initSearchOrderList" v-model="keywords" bg-color="#fff" height="70" placeholder="订单号"></u-search>
        </view>
        <view
            v-if="loadingState!='first_loading' && orderList.length == 0"
            class="empty_part flex_column_center_center">
            <view class="img"></view>
            <view>{{$L('暂无数据')}}</view>
        </view>

        
        <template v-else>
            <!-- 选中的订单预览 -->    
            <template v-if="showView">
                <view class="view_choosed_list">
                    <view class="title">
                        <text>已选择要导入的费用明细</text>
                        <img @click="showView = false" :src="imgUrl+'common/icon/close.png'"/>
                    </view>

                    <view class="list_item">
                        <view
                            v-if="choosedOrder.length == 0"
                            class="empty_part">
                            <view class="img"></view>
                            <view>{{$L('未选择费用明细')}}</view>
                        </view>

                        <view class="export_order_container">
                            <view v-for="(item, index) in choosedOrder" :key="index" class="export_order_item">
                                <!-- 左侧的选择和详情展示 -->
                                <view class="left">
                                    <!-- 详情 -->
                                    <view class="detail">
                                        <view class="detail_item skuName">
                                            <img :src="getProductDetail(item).mainImage">
                                            <view class="name">{{getProductDetail(item).skuName}}</view>
                                        </view>
                                        <view class="detail_item">日期：{{item.createTime}}</view>
                                        <view class="detail_item">订单号：{{item.orderSn}}</view>
                                    </view>
                                </view>
                                <!-- 右侧的价格 -->
                                <view class="right num-font">
                                    <text class="unit">¥</text>
                                    <text class="price_int">{{$getPartNumber(item.orderAmount,'int')}}</text>
                                    <text class="price_decimal">{{$getPartNumber(item.orderAmount,'decimal')}}</text>
                                </view>
                                <!-- 定位的右上侧的删除按钮 -->
                                <img class="closeItem" @click="deleteOrder(index)" :src="imgUrl+'common/icon/close2.png'"/>
                                
                            </view>
                        </view>
                    </view>
                </view>
            </template>


            <!-- 订单列表的展示 -->
            <template v-else>
                <scroll-view class="order_list_part" scroll-y @scrolltolower='getMoreData'>
                    <view class="export_order_container">
                        <view @click="clickCheckItem(item)" v-for="(item, index) in orderList" :key="index" class="export_order_item">
                            <!-- 左侧的选择和详情展示 -->
                            <view class="left">
                                <!-- 选择 -->
                                <text class="iconfont" :class="{item_check: checkOrderChoosed(item.orderSn), icon_checked_radio: checkOrderChoosed(item.orderSn), icon_check_radio: !checkOrderChoosed(item.orderSn)}"></text>
                                <!-- 详情 -->
                                <view class="detail">
                                    <view class="detail_item skuName">
                                        <img :src="getProductDetail(item).mainImage">
                                        <view class="name">{{getProductDetail(item).skuName}}</view>
                                    </view>
                                    <view class="detail_item">日期：{{item.createTime}}</view>
                                    <view class="detail_item">订单号：{{item.orderSn}}</view>
                                </view>
                            </view>
                            <!-- 右侧的价格 -->
                            <view class="right num-font">
                                <text class="unit">¥</text>
                                <text class="price_int">{{$getPartNumber(item.orderAmount,'int')}}</text>
                                <text class="price_decimal">{{$getPartNumber(item.orderAmount,'decimal')}}</text>
                            </view>
                        </view>
                    </view>
                    <loadingState v-if="loadingState == 'first_loading' || orderList.length > 0" :state='loadingState' />
                </scroll-view>
            </template>
        </template>


        <view class="export_foot">
            <view @click="showView = !showView" class="choose_num">
                <text>已选择:{{choosedOrder.length || 0}}笔</text>
                <text class="iconfont" :class="showView ?'icon_arrow_up':'icon_arrow_down'"></text>
            </view>
            <view class="all_price">
                <view class="title">总计:</view>
                <view class="num-font">
                    <text class="unit">¥</text>
                    <text class="price_int">{{$getPartNumber(totalPrice,'int')}}</text>
                    <text class="price_decimal">{{$getPartNumber(totalPrice,'decimal')}}</text>
                </view>
            </view>
            <view @click="confirm" class="confirm">确定</view>
        </view>
    </view>
</template>
<script>
import loadingState from "@/components/loading/loading.vue";
export default {
    components:{ loadingState },
    data() {
        let orderNos = SnUtils.getUserPara('orderNos');
        let checkedOrderArr = [];
        if (!!orderNos){
            checkedOrderArr = orderNos.split('|');
        }
        return {
            imgUrl: getApp().globalData.imgUrl,
            orderList: [], //订单列表
            pageSize: 10, //每页请求的条数
            current: 1, //当前页
            choosedOrder: [], //选中的数据
            maxNum:50,//最多选择50条
            checkedOrderArr: checkedOrderArr,//已选择的订单号
            hasMore: false, //是否还有数据
            loadingState: 'first_loading',
            showView: false, //查看选中的订单
            keywords:'', //搜索关键字
            lock: false //下拉加载的锁
        };
    },
    created(){

        // 获取已完成的订单列表
        this.getOrderList();

        //银企通传过来的checkedOrderArr的orderNos，去反查选中的订单列表
        this.initChoosedOrder();
            
            
    },
    mounted(){

    },
    computed:{
        totalPrice(){
            let totalPrice = 0;
            this.choosedOrder.forEach(order=>{
                totalPrice += order.orderAmount * 100;
            })
            return totalPrice / 100;
        }
    },
    onShow() {

            
    },
    methods: {
            
        // 获取订单详情的商品
        getProductDetail(item){
            try {
                return item.orderProductListVOList[0]; //目前默认是第一个商品
            } catch (error) {
                return {}
            }
        },

        /**
             * 订单是否被选中
             */  
        checkOrderChoosed(orderSn){
            let res = false;
            let index = this.choosedOrder.findIndex(temp => {
                return temp.orderSn == orderSn;
            })
            if (index>-1){
                res = true;
            } else {
                res = false;
            }
            return res;
        },

        // 选择或者移除选择状态
        clickCheckItem(item){
            let that = this;
            let index = that.choosedOrder.findIndex(temp => {
                return temp.orderSn == item.orderSn;
            })
            if (index > -1){
                that.choosedOrder.splice(index, 1);
            } else {
                if (that.choosedOrder.length >= that.maxNum){
                    uni.showToast({
                        title: `最多选择${that.maxNum}条`,
                        icon: 'none',
                        duration: 700
                    })
                    return;
                }
                that.choosedOrder.push(item);
            }
        },

        //上拉分页加载更多事件
        getMoreData() {
            if (this.hasMore) {
                this.getOrderList();
            }

        },

        // 获取订单列表
        async getOrderList(){
            let list = await this.initOrderList();
            this.orderList = [...this.orderList, ...list];
        },

        // 初始化搜索
        initSearchOrderList(){
            this.current = 1;
            this.orderList = [];
            this.loadingState = 'first_loading';
            this.getOrderList();
        },

        // 根据选中的订单号反选订单 初始化choosedOrder
        initChoosedOrder(){
            if (this.checkedOrderArr.length <= 0){ return }
            let param = {};
            param.url = 'v3/business/front/orderInfo/list';
            param.data = {};
            param.data.pageSize = 999;
            param.data.current = 1;
            param.data.orderState = 40; //交易完成的订单状态
            param.data.orderSns = this.checkedOrderArr.join(','); 
            this.$request(param).then(res => {
                if (res.state == 200 && res.data.list.length > 0) {
                    this.choosedOrder = res.data.list
                }
            }).catch((e) => {
                //异常处理
                console.log(e);
            }).finally(()=>{
                    
            })
                
        },

        // 获取已完成的订单列表
        initOrderList(){
            if (!!this.lock){ return }
            return new Promise((resolve) => {
                let param = {};
                param.url = 'v3/business/front/orderInfo/list';
                param.data = {};
                param.data.pageSize = this.pageSize;
                param.data.current = this.current;
                param.data.orderState = 40; //交易完成的订单状态
                param.data.orderSn = this.keywords; //交易完成的订单状态
                this.loadingState = this.loadingState == 'first_loading' ? this.loadingState : 'loading';
                this.lock = true;
                this.$request(param).then(res => {
                    if (res.state == 200 && res.data.list.length > 0) {

                        //确定是否还有数据
                        this.hasMore = this.$checkPaginationHasMore(res.data.pagination); 
                        if (this.hasMore) {
                            this.current++;
                            this.loadingState = 'allow_loading_more';
                        } else {
                            this.loadingState = 'no_more_data';
                        }

                        // 将订单列表resolve出去
                        resolve(res.data.list);
                    } else {
                        resolve([]);
                        this.loadingState = 'no_more_data';
                    }
                }).catch((e) => {
                    //异常处理
                    console.log(e);
                    resolve([]);
                    this.loadingState = 'no_more_data';
                }).finally(()=>{
                    this.lock = false;
                })
            })
        },

        // 将日期改为时间戳
        changeTimestamp(time){
            let newTime = time.toString();
            try {
                if (newTime.indexOf('-') > -1 || newTime.indexOf('/') > -1){
                    newTime = newTime.replace(/-/g, '/')
                }
                let date = new Date(newTime);
                return date.getTime() || time;
            } catch (error) {
                console.log(error)
                return time;
            }
        },

        /**
             * 保存
             */             
        confirm(){
            let result = [];
            this.choosedOrder.forEach(order=>{
                    
                result.push({
                    orderNo: order.orderSn, //订单号
                    orderTime: this.changeTimestamp(order.createTime), //下单时间 此处应该是时间戳
                    pName: order.orderProductListVOList
                        ? order.orderProductListVOList.map(p=>{
                            return p.skuName;
                        })
                        : [], //商品名称
                    orderMoney: order.orderAmount * 100, //订单金额（单位：分）
                    payNo: order.tradeSn, //支付单号
                    payMethod: order.paymentCode //订单支付方式 
                })
            })

            let loadData = {
                orderList: result,
                uniqueId: SnUtils.getUserPara('uniqueId')
            };
            loadData = JSON.stringify(loadData);
            sinosdk.sino.back('', 1, loadData);
        },


        //删除已选中的订单
        deleteOrder(index){
            this.choosedOrder.splice(index, 1)
        }    
    }
}
</script>

<style lang="scss">
.export_order_list{
    padding-bottom: 130rpx;
    overflow: hidden;
    .order_list_part{
        height: calc(100vh - 245rpx);
    }
    .empty_part{
        padding-top: 276rpx;
        width: 100%;

        .img {
            width: 256rpx;
            height: 256rpx;
            background: var(--emptyImg);
            background-size: 100% 100%;
        }

        view {
            color: $main-third-color;
            font-size: 28rpx;
        }
    }
}
.export_order_container{
    padding: 0 20rpx;
    .export_order_item{
        position: relative;
        cursor: pointer;
        margin-bottom: 20rpx;
        background: #ffffff;
        border-radius: 16rpx;
        box-shadow: 0px 2rpx 16rpx 0px rgba(101,112,242,0.12); 
        padding: 34rpx 24rpx;
        display: flex;
        align-items: center;
        .closeItem{
            position: absolute;
            right: 20rpx;
            top: 40rpx;
            cursor: pointer;
        }
        .right {
            min-width: 160rpx;
            text-align: right;
            font-size: 36rpx;
            .unit{
                font-size: 28rpx;
            }
        }
        .left {
            display: flex;
            align-items: center;
            flex: 1;
            .iconfont{
                width: 68rpx;
                color: #BBBBBB;
                font-size: 32rpx;
                &.item_check{
                    color: var(--radioCheckedColor);
                }
            }
            .detail{
                flex:1;
                .detail_item{
                    margin-bottom: 12rpx;
                    font-size: 26rpx;
                }
                .skuName{
                    display: flex;
                    align-items: center;
                    font-size: 28rpx;
                    img{
                        width: 88rpx;
                        height: auto;
                    }
                    .name{
                        flex: 1;
                        margin-left: 20rpx;
                        text-align: justify;
                        text-overflow: -o-ellipsis-lastline;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        display: -webkit-box;
                        -webkit-line-clamp: 2;
                        line-clamp: 2;
                        -webkit-box-orient: vertical;
                        line-height: 44rpx;
                    }

                }
            }
        }
    }
    
}
.export_foot{
    position: fixed;
    bottom: 0;
    max-width: 750rpx;
    width: 100%;
    height: 110rpx;
    background: #fff;
    display: flex;
    align-items: center;
    padding-left: 20rpx;
    .choose_num{
        width: 190rpx;
        font-size: 28rpx;
        display: flex;
        align-items: center;
        cursor: pointer;
        .iconfont{
            font-size: 26rpx;
            color: #c2c2c2;
            margin-left: 4rpx;
            
        }
    }
    .all_price{
        flex: 1;
        font-size: 36rpx;
        .title{
            font-size: 24rpx;
        }
    }
    .confirm{
        width: 200rpx;
        height: 110rpx;
        background: var(--confirmBtnBgColor2);
        color: var(--confirmBtnTextColor);
        font-size: 28rpx;
        text-align: center;
        line-height: 110rpx;
        cursor: pointer;
    }
}

.view_choosed_list{
    width: 100%;
    .title{
        position: relative;
        text-align: center;
        font-size: 28rpx;
        margin-bottom: 20rpx;
        padding-top: 20rpx;
        img{
            position: absolute;
            right: 30rpx;
            width: 20rpx;
            height: auto;
            top: 30rpx;
            cursor: pointer;
        }
    }
}

.search_container{
    padding: 20rpx 20rpx;
}
</style>