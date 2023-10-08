<!-- 物流公司页面 -->
<template>
    <view class="logistics_company">
        <!-- 搜索 start-->
        <view class="logistics_company_search">
            <view class="compnay_search">
                <view class="logistics_company_left">
                    <text class="iconfont icon_search"></text>
                    <input type="text" :value="inputVal" :placeholder="$L('请输入物流公司')" @input="getValue" />
                </view>
                <image :src="imgUrl+'common/icon/icon_search_clean.svg'" mode="" class="close_btn" v-if="inputVal!=''" @click="clearVal"></image>
            </view>
            <view class="go_search" @click="goSearch">{{$L('搜索')}}</view>
        </view>
        <!-- 搜索 end -->
        <!-- 物流公司列表 start -->
        <view class="logistics_company_list" v-if="LogisticsCompany.length > 0">
            <view class="logistics_company_pre" v-for="(item,index) in LogisticsCompany" :key="index" @click="selectLogCom(item.expressName,item.expressId)">
                <rich-text :nodes="item.expressName" ></rich-text>
            </view>
            <loadingState :state='loadingState'/>
        </view>
        <view class="logistics_company_list" v-if="LogisticsCompany.length == 0">
            <view class="no_data">
                {{$L('暂无数据')}}~
            </view>
        </view>
    </view>
</template>


<script>
import loadingState from "@/components/loading/loading.vue";
import {
    mapState
} from 'vuex';
export default {
    components: {
        loadingState
    },
    data() {
        return {
            imgUrl: getApp().globalData.imgUrl,
            LogisticsCompany:[], //物流公司
            inputVal:'', //输入框的值
            current:1, //当前为第1页
            loadingState: 'first_loading',
            pageSize: 20,
            loading: false,//是否加载数据
            hasMore: true//是否还有数据
        };
    },
    mounted(){
        /**
             * 修复app端点击除全部订单外的按钮进入时不加载数据的问题
             * 替换onLoad下代码即可
             */
        this.getLogisticsCompany()
    },
    onLoad() {
        // /**
        //  * 修复app端点击除全部订单外的按钮进入时不加载数据的问题
        //  * 替换onLoad下代码即可
        //  */
        // this.getLogisticsCompany()
    },
    computed: {
        ...mapState(['userInfo'])
    },
    methods: {
        //获取物流公司数据信息
        getLogisticsCompany(){
            // if (this.loadingState === 'loading') {
            //     //防止重复加载
            //     return;
            // }

            // if (this.loadingState == 'no_more_data') {
            //     //已经没有数据，无需再请求
            //     return;
            // }
            let param = {};
            param.url = 'v3/system/front/express/list';
            param.method = 'GET';
            param.data = {};
            param.data.pageSize = 20;
            param.data.current = this.current;
            param.data.expressName = this.inputVal;
            this.loadingState = this.loadingState == 'first_loading' ? this.loadingState : 'loading';
            this.$request(param).then(res => {
                if (res.state == 200) {
                    if (this.current == 1){
                        this.LogisticsCompany = res.data.list;
                    } else {
                        this.LogisticsCompany = this.LogisticsCompany.concat(res.data.list);
                    }
                    this.hasMore = this.$checkPaginationHasMore(res.data.pagination);//是否还有数据
                    if (this.hasMore){
                        this.current++;
                        this.loadingState = 'allow_loading_more';
                    } else {
                        this.loadingState = 'no_more_data';
                    }
                } else {
                    this.$api.msg(res.msg);
                }
            }).catch(() => {
                //异常处理
            })
        },
        //获取输入框的值
        getValue(e){
            let that = this;
            that.inputVal = e.detail.value;
            that.current = 1;
            that.getLogisticsCompany();
            // let searchArr = [];
            // searchArr = that.LogisticsCompany.filter(item=>item.expressName.includes(that.inputVal));
            // if (searchArr.length > 0){
            //     searchArr.forEach(item=>{
            //         item.expressName = that.join(item.expressName,that.inputVal);
            //     })
            //     that.LogisticsCompany = searchArr;
            // }
        },
        // 拼接  经测试原代码功能无效  rich-text 不支持 text 换为span可以解析 这里暂时不要这个功能了 
        // 原来在 getValue里面替换也是有问题的 查询获取物流公司是异步的，这个替换执行了 又被覆盖了 
        join(str,key){
            var reg = new RegExp((`(${key})`), "gm");
            var replace = '<text style="color:#FD463E;font-weight:bold;">$1</text>';
            return str.replace(reg, replace);
        },
        //去搜索
        goSearch(){
            this.current = 1;
            this.getLogisticsCompany();
        },
        //清空输入框
        clearVal(){
            let that = this;
            that.inputVal = '';
            that.current = 1;
            that.getLogisticsCompany();
        },
        //选择物流公司
        selectLogCom(expressName,expressId){
            let pages = getCurrentPages();
            let prevPage = pages[pages.length - 2]; //上一个页面
            prevPage.$vm.logisticsCompanyData = {
                'expressName':expressName,
                'expressId':expressId
            }
            this.$Router.back(1)
        },
        //触底
        onReachBottom(){
            if (this.hasMore){
                this.getLogisticsCompany();
            }
        }
    }
}
</script>

<style lang='scss'>
    page {
        background: #FFFFFF;
        height: 100%;
        width: 750rpx;
        margin: 0 auto;
    }
    .logistics_company{
        width: 100%;
        background: #FFFFFF;
        .logistics_company_search{
            position: fixed;
            background: #FFFFFF;
            // top: 0;
            top:var(--titleBarFillHeight);
            width: 750rpx;
            height: 76rpx;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 20rpx 30rpx;
            box-sizing: border-box;
            z-index:999;
            .compnay_search{
                display: flex;
                justify-content: space-between;
                padding: 0 20rpx;
                align-items: center;
                width: 617rpx;
                height: 65rpx;
                background: #F5F5F5;
                border-radius: 33rpx;
                .logistics_company_left{
                    display: flex;
                    align-items: center;
                    .icon_search {
                        font-size: 28rpx;
                        margin-right: 17rpx;
                        color: #999;
                    }
                    input{
                        font-size: 28rpx;
                        
                        font-weight: 500;
                        color: #333333;
                        line-height: 65rpx;
                    }
                }
                .close_btn{
                    width: 30rpx;
                    height: 30rpx;
                }
            }
            .go_search{
                font-size: 28rpx;
                
                font-weight: 500;
                color: #333333;
                line-height: 32rpx;
            }
        }
        .logistics_company_list{
            padding-top: 65rpx;
            width: 100%;
            background: #FFFFFF;
            border-top: 20rpx solid #F5F5F5;
            .logistics_company_pre{
                height: 88rpx;
                background: #FFFFFF;
                border-bottom: 1rpx solid #F8F8F8;
                font-size: 28rpx;
                
                font-weight: 500;
                color: #333333;
                line-height: 88rpx;
                margin: 0 29rpx;
            }
            .no_data{
                font-size: 28rpx;
                
                font-weight: 500;
                color: #333333;
                line-height: 88rpx;
                width: 100%;
                display: flex;
                justify-content: center;
                margin-top: 300rpx;
            }
        }
    }
</style>
