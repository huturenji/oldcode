
<template name="newsItem">
    <view class="news_wrap" v-margin="decoItem">
        <view ref='newsTop'>
            <view v-if="decoItem.props.showStyle=='text'" class="news_top">
                <view class="news">新闻资讯</view>
                <view class="more" @click="goIndex">更多</view>
            </view>
            <view v-else class="news_img" @click="goIndex" >
                <view class="more"></view>
                <!-- <view class="banner_title">{{decoItem.title}}</view> -->
                <img class="top_img" src="../../../static/shared/news/pic_zixun_banner@2x.png" alt="">
            </view>
        </view>
        <view ref='newsItem' class="news_item" :class='{hidden: !showNewsList}' v-for="(item,index) in categoryData" :key="index" @click="goDetail(item.articleId)">
            <view class="news_layout">
                <view class="news_title">{{item.title}}</view>

                <view class="news_image_list" v-if="item.news_style == 3">
                    <template v-for="(l,i) in item.children">
                        <view class="img_item" :key="i">
                            <view class="img_item_warp" :style="[dealStyle(l.img)]"></view>
                        </view>
                    </template>
                </view>

                <view :class="{news_info:true,dw:item.news_style == 1}">
                    <view class="auth">{{item.mediaName}}</view>
                    <view class="publish_time">{{formatMsgTime(item.lastUpdateTime, new Date().getTime())}}</view>
                </view>
            </view>
            <view class="news_layout_right" v-if="item.news_style == 1">
                <view class="img_item_warp" :style="[dealStyle((item.children[0]).img)]"></view>
            </view>
        </view>
    </view>
</template>

<script>
import {
    openBBCPage
} from '@/utils/common.js'
export default {
    name: "deco-media",
    data() {
        return {
            showNewsList: false,
            categoryData:[]   
        }
    },
    props: {
        decoItem:{}
    },
    mounted(){
        this.init()
        // console.log(this.decoItem);
    },
    methods: {
        dealStyle(img){
            return {
                backgroundImage: 'url(' + img ||'' + ')'
            };
        },    
        async init(){
            let local_news = this.$getStorageSync('new_info')
            // console.log(222,local_news)
            if (local_news){
                this.decoItem.data = local_news
                this.categoryData = this.decoItem.data
            }
            await this.$nextTick();
            this.decoItem.data = await this.getCategryDate('listArticle') || [];
            this.decoItem.topData = await this.getCategryDate('listToppingArticle') || [];
            this.categoryData = this.decoItem.topData.concat(this.decoItem.data)
            this.$nextTick(()=>{
                this.calcListLength();
                this.$emit('zixunDomComplete')
            })
        },
        getCategryDate(api) {
            return new Promise(resolve => {
                uni.showLoading()
                this.$request({
                    header : {
                        "Content-Type": "application/json"
                    },
                    url: `media/content/v1/${api}`, // 这个接口是资讯的接口要特殊处理,token要用伴正事的token 在 request.js中处理
                    method: 'POST',
                    data:{
                        categoryId: this.decoItem.props.categoryId ?? "1",
                        pageIndex: 1,
                        pageSize: 10,//最多支持显示10条
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
                                item.news_style = 1;//暂时强制显示单张图片，后期可扩展成装修配置
                                item.children = item.cover
                                newData.push(item)
                            }
                        })
                        resolve(newData)
                        this.$setStorageSync('new_info',newData);
                    } else {
                        this.$api.msg(res.msg);
                    }
                }).finally(()=>{
                    uni.hideLoading()
                })
            });
            
        },
        /**
         * 动态计算要显示的条数
         */
        calcListLength(){
            try {
                if (this.categoryData?.length == 0){
                    this.showNewsList = true;
                    return;
                }
                let containerHeight = SnUtils.getUserPara('height') || document.body.offsetHeight;
                let newsTopDomHeight = this.$refs.newsTop.$el.offsetHeight;
                let newsItemHeight = this.$refs.newsItem?.[0]?.$el.offsetHeight;
                let listLength = Math.floor((containerHeight - newsTopDomHeight) / newsItemHeight);
                this.categoryData.length = this.categoryData.length > listLength ? listLength : this.categoryData.length;
                this.showNewsList = true;
            } catch (e){
                console.error(e);
                this.showNewsList = true;
            }
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
        // background: #fff;
        .news_img{
            position: relative;
            overflow: hidden;
            border-radius: 20rpx 20rpx 0rpx 0rpx;
            .top_img{
                display: block;
                width: 100%;
                height: auto;
            }
            .more{
                background: url("../../../static/shared/news/btn_shangyun_gengduozixun@2x.png");
                width: 60px;
                height: 22px;
                background-repeat: no-repeat;
                background-position: center;
                background-size: cover;
                position: absolute;
                top: 10px;
                right: 10px;
                z-index: 10;
            }
        }
        .news_top{
            display: flex;
            justify-content:space-between;
            font-size: 30rpx;
            font-weight:bold;
            padding-bottom: 20rpx;
            .more{
                height: 56rpx;
                font-size: 30rpx;
                font-weight: 400;
                color: #a4acb2;
                line-height: 56rpx;
            }
            .news{
                height: 56rpx;
                font-size: 40rpx;
                font-weight: 600;
                color: #222222;
                line-height: 56rpx;
                padding-left: 4rpx;
            }
        }

        .news_item{
            display: flex;
            // padding-bottom: 20rpx;
            padding: 32rpx 30rpx;
            background: #fff;
            &.hidden{
                // 此处改为用opacity：0； 因为用visibility：hidden会导致ios上两行超出显示三个点点点得样式出问题，即不显示三个点点点；用display:none则会导致获取不到具体得dom得高度
                opacity: 0;
            }
            .news_layout{
                flex: 1;
                position: relative;
                word-break: break-all;
                .news_title{
                    max-height: 80rpx;
                    width: 100%;
                    line-height: 40rpx;
                    text-overflow: -o-ellipsis-lastline;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    line-clamp: 2;
                    -webkit-box-orient: vertical;
                    word-break: break-all;
                    font-size: 32rpx;
                    font-weight: 600;
                    color: #333;

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
