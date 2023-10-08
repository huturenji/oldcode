<template name="newsItem">
    <view class="news_wrap" v-margin="decoItem">
        <view class="news_tab">
            <!-- {{decoItem.data}} -->
            <!-- 顶部导航栏 -->
            <view class="tab_nav">
                <tabs 
                    :list="decoItem.data" 
                    :current="currIndex" 
                    @tabChange="changeStyle"
                    keyName="tabName" 
                    :itemStyle="{height: '88rpx'}"
                    :inactiveStyle="{color: '#222', lineHeight:'44rpx', fontSize: '32rpx'}"
                    :activeStyle="{color: '#222', lineHeight:'50rpx', fontSize: '40rpx', transform: 'scale(1.1)', transformOrigin:'center bottom', fontWeight:'bold', transition: 'transform .8s'}"
                    lineWidth="40rpx"
                    lineColor="#033897"
                    lineHeight="6rpx"         
                >

                    <!-- 右侧更多 -->
                    <template v-slot:right>
                        <view class="more" @click="goIndex">
                            <text>更多</text>
                        </view>
                    </template>
                </tabs>
            </view>
        </view>

        <view class="news_item" v-for="(item,index) in categoryData" :key="index" @click="goDetail(item.articleId)">
            <!-- {{decoItem.data[currIndex].list}} -->
            <view class="news_layout">
                <view class="news_title">{{item.title}}</view>

                <!-- <view class="news_image_list" v-if="item.news_style == 3">
                    <template v-for="(l,i) in item.children.slice(0,3)">
                        <view class="img_item" :key="i">
                            <view class="img_item_warp" :style="[dealStyle(l.img)]"></view>
                        </view>
                    </template>
                </view> -->

                <view class="news_info dw">
                    <view class="auth">{{item.mediaName}}</view>
                    <view class="publish_time">{{formatMsgTime(item.lastUpdateTime, new Date().getTime())}}</view>
                </view>
            </view>
            <view class="news_layout_right">
                <view class="img_item_warp" :style="[dealStyle((item.children[0]).img)]"></view>
            </view>
        </view>
    </view>
</template>

<script>
import tabs from "@/components/tab/base";
import {
    openBBCPage
} from '@/utils/common.js'
export default {
    name: "deco-media-category",
    data() {
        return {
            currIndex:0,
            categoryId:'',
            categoryData:[]
        }
    },
    components: {
        tabs
    },


    props: {
        decoItem:{}
    },
    mounted(){
        this.init()
    },
    computed:{
        currNavItem(){
            return this.nav_list[this.currIndex];
        },
        activeItemStyle(){
            return {
                'font-size': '40rpx',
                'font-weight': '600',
                'color': '#222222'
            }
        }
    },
    methods: {
        dealStyle(img){
            return {
                backgroundImage: 'url(' + img ||'' + ')'
            };
        },
        async changeStyle({index}){
            this.categoryId = this.decoItem.data[index].categoryId;
            this.currIndex = index;
            this.decoItem.data[this.currIndex].list = await this.getCategryDate('listArticle') || [];
            this.decoItem.data[this.currIndex].topList = await this.getCategryDate('listToppingArticle') || [];
            this.categoryData = this.decoItem.data[this.currIndex].topList.concat(this.decoItem.data[this.currIndex].list)
        },
        getbeginCate(){
            this.categoryId = this.decoItem.data[this.currIndex].categoryId;
        },
        async init(){
            this.getbeginCate();
            let local_news = this.$getStorageSync('tabnew_info')
            if (local_news){
                this.decoItem.data[this.currIndex].list = local_news
                this.categoryData = this.decoItem.data[this.currIndex].list
            }

            await this.$nextTick();
            this.decoItem.data[this.currIndex].list = await this.getCategryDate('listArticle') || [];
            this.decoItem.data[this.currIndex].topList = await this.getCategryDate('listToppingArticle') || [];
            this.categoryData = this.decoItem.data[this.currIndex].topList.concat(this.decoItem.data[this.currIndex].list)

        },
        getCategryDate(api){
            return new Promise(resolve => {
                this.$request({
                    header : {
                        "Content-Type": "application/json"
                    },
                    url: `media/content/v1/${api}`,
                    method: 'POST',
                    data:{
                        categoryId: this.categoryId,
                        pageIndex: 1,
                        pageSize: 5,
                        scrollId:null
                    }
                }).then(res=>{
                    if (res.resultCode==0){
                        const data = res.result.hitResult
                        const newData = []
                        data.forEach((item)=>{
                            if (item.cover.length){
                                item.cover.forEach((e)=>{
                                    e.img = e.url
                                })
                                // item.news_style = item.cover.length==1?1:3
                                item.children = item.cover
                                newData.push(item)
                            }
                        })
                        resolve(newData)
                    
                        this.$forceUpdate();
                        // console.log(this.decoItem.data[this.currIndex],'111111');
                        this.$setStorageSync('tabnew_info',newData);
                        this.$nextTick(()=>{
                        // const item = this.decoItem.data[this.currIndex]
                        // this.$set(item,'list',newData)
                            this.$emit('zixunDomComplete')
                        })
                    } else {
                        this.$api.msg(res.msg);
                    }
                })
            });
        },
        /**
             * 时间显示格式化
             * @param timespan 时间戳
             */        
        formatMsgTime (timespan, systemTime) {
            var dateTime = new Date(timespan);
            var year = dateTime.getFullYear();
            var month = dateTime.getMonth() + 1;
            var day = dateTime.getDate();
            var hour = dateTime.getHours();
            var minute = dateTime.getMinutes();
            var milliseconds = 0;
            var timeSpanStr;
            milliseconds = systemTime - timespan;
            //1分钟内显示为刚刚
            if (milliseconds < 1000 * 60 * 1) {
                timeSpanStr = '刚刚';
                //一小时内展示为x分钟前
            } else if (1000 * 60 * 1 <= milliseconds && milliseconds < 1000 * 60 * 60) {
                timeSpanStr = Math.floor((milliseconds / (1000 * 60))) + '分钟前';
                //一天内展示为x小时前
            } else if (1000 * 60 * 60 * 1 <= milliseconds && milliseconds < 1000 * 60 * 60 * 24) {
                timeSpanStr = Math.floor(milliseconds / (1000 * 60 * 60)) + '小时前';
                //7天内展示为x天前
            } else if (1000 * 60 * 60 * 24 <= milliseconds && milliseconds < 1000 * 60 * 60 * 24 * 7) {
                timeSpanStr = Math.floor(milliseconds / (1000 * 60 * 60 * 24)) + '天前';
                //1个月内展示为x周前
            } else if (1000 * 60 * 60 * 24 * 7 <= milliseconds && milliseconds < 1000 * 60 * 60 * 24 * 30) {
                timeSpanStr = Math.floor(milliseconds / (1000 * 60 * 60 * 24 * 7)) + '周前';
                //1年内展示为x月前
            } else if (1000 * 60 * 60 * 24 * 30 <= milliseconds && milliseconds < 1000 * 60 * 60 * 24 * 365) {
                timeSpanStr = Math.floor(milliseconds / (1000 * 60 * 60 * 24 * 30)) + '月前';
                //1年以上展示为x年前
            } else if (1000 * 60 * 60 * 24 * 365 <= milliseconds){
                timeSpanStr = Math.floor(milliseconds / (1000 * 60 * 60 * 24 * 365)) + '年前';
                //异常展示年月日
            } else {
                timeSpanStr = year + '-' + month + '-' + day + ' ' + hour + ':' + minute;
            }
            return timeSpanStr;
        },
        goDetail(articleId){
            openBBCPage(location.origin+'/media/static/content/index.html#/article?articleId='+articleId)
        },
        goIndex(){
            if (!this.decoItem.props.more_news){
                uni.showToast({
                    title: '功能正在开发中，敬请期待...',
                    icon: 'none',
                    duration: 700
                })
                    
            } else {
                openBBCPage(this.decoItem.props.more_news)
            }
        }
    }
}
</script>

<style lang='scss'>
    .news_wrap{
        overflow: hidden;
        .news_tab{
            position: relative;
            .tab_nav{
                width: 85%;
                font-weight: 500;
                ::v-deep .u-scroll-view {
                    color: red;
                    
                }
            }
            .more{
                position: absolute;
                right: 0;
                top:0;
                bottom:0;
                margin-top:auto;
                margin-bottom:auto;
                width: 92rpx;
                height: 40rpx;
                background: #ffffff;
                border-radius: 20rpx;
                text-align: center;
                display: flex;
                align-items: center;
                justify-content: center;
                text{
                    font-size: 26rpx;
                    color: #033897;
                    font-weight: 600;
                }
                
            }
        }
        

        .news_item{
            display: flex;
            // padding-bottom: 20rpx;
            padding: 32rpx 30rpx;
            background: #fff;
            .news_layout{
                flex: 1;
                position: relative;
                .news_title{
                    overflow:hidden; 
                    text-overflow:ellipsis;
                    display:-webkit-box; 
                    -webkit-box-orient:vertical;
                    -webkit-line-clamp:2;
                    font-size: 32rpx;
                    font-weight: 600;
                    color: #333;
                    // height:120rpx;
                    // &.noMinheight{
                    // height: auto;
                    // height:120rpx;
                    // } 
                }
                .news_image_list{
                    display: flex;
                    justify-content:space-between;
                    margin-top:24rpx;
                    .img_item{
                        flex: 1;
                        height: 160rpx;
                        margin-right:10rpx;
                        &:last-child{
                            margin-right: 0;
                        }
                        .img_item_warp{
                            height: 100%;
                            border-radius:5px;
                            background-repeat: no-repeat;
                            background-position: center;
                            background-size: cover;
                        }

                    }
                }
                .news_info{
                    display: flex;
                    margin-top: 30rpx;
                    font-size: 24rpx;
                    color: #999;
                    font-weight: 400;
                    .auth{
                        margin-right: 16rpx;
                    }
                }
                .dw{
                    position: absolute;
                    top: 108rpx;
                }
            }
            .news_layout_right{
                 width:220rpx;
                 margin-left:20rpx;
                 height:160rpx;
                 .img_item_warp{
                    height: 100%;
                    border-radius: 5px;
                    background-repeat: no-repeat;
                    background-position: center;
                    background-size: cover;
                }
            }
            
        }
    }
</style>
