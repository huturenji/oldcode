<template name="advertisement">
    <view class="advertisement" v-margin="decoItem">
        <view class="advertisementWarp" :style="{backgroundImage: 'url(' + decoItem.data[0].imglist[0].img||'' + ')',width:(decoItem.data[0].imglist[0].width)+'rpx'}">
            <view class="advertisementTop">
                <view class="leftbg" :style="{backgroundImage: 'url(' + decoItem.data[0].imglist[1].img||'' + ')',width:(decoItem.data[0].imglist[1].width)+'rpx', height:(decoItem.data[0].imglist[1].height)+'rpx'}"></view>
                <view class="rightbg" :style="{backgroundImage: 'url(' + decoItem.data[0].imglist[2].img||'' + ')',width:(decoItem.data[0].imglist[2].width)+'rpx', height:(decoItem.data[0].imglist[2].height)+'rpx'}" @click="goPage(decoItem.data[0].imglist[2].url)"></view>
            </view>
            <view class="advertisement_tab">
                <view v-for="(item,index) in decoItem.data[0].children" :key="index" class="advertisement_tab_warp" @click="goPage(item.url,item.url_type)" :style="{width:(item.width)}">
                    <view class="advertisement_tab_img" :style="{backgroundImage: 'url(' + item.img||'' + ')', height:(item.height)+'px'}"></view>
                    <view class="advertisement_tab_price" >
                        <span class="item_title num-font"><span class="rmb">￥</span>{{item.title}}</span>
                        <!-- 屏蔽掉划线价 -->
                        <!-- <span class="item_price num-font"><span>￥</span>{{item.price}}</span> -->
                    </view>
                </view>
            </view>
        </view>
        <!-- 功能还未完成就不要了 -->
        <!-- <view v-else-if="decoItem.data.zidingyi_style=='3'" class="advertisementWarp_3" :style="{backgroundImage: 'url(' + decoItem.data.leftRightImglist[0].img||'' + ')'}">
            <view class="advertisement_tab_3" :style="{paddingTop:decoItem.paddingTopVal+'px'}">
                <view v-for="(item,index) in decoItem.data.leftRightChildren" :key="index" class="advertisement_tab_warp_3" @click="goPage(item.url,item.url_type)">
                    <view class="advertisement_tab_img_3" :style="{backgroundImage: 'url(' + item.img||'' + ')'}"></view>
                    <view class="advertisement_tab_price_3" >
                        <text class="item_title num-font">
                            <text class="rmb fitFont">￥</text>
                            <text class="int rmb fitFont">{{$getPartNumber(item.title,'int')}}</text>
                            <text class="decimal rmb fitFont">{{$getPartNumber(item.title,'decimal')}}</text>
                        </text>
                        
                        <text class="item_price num-font fitFont"><text>￥</text>{{item.price}}</text>
                    </view>
                </view>
            </view>
        </view> -->
    </view>
</template>


<script>
import {
    openBBCPage
} from '@/utils/common.js'
export default {
    name: "deco-advertise",
    data() {
        return {
        }
    },
    props: {
        // 装修数据
        decoItem: {
            type: Object,
            default: () => {}
        }
    },
    mounted(){
        // console.log('111',this.decoItem.paddingTopVal);
    },
    watch:{
        decoItem: {
            handler() {
                this.$nextTick(() => {
                    this.fitFontSize()
                })
            },
            deep: true
        }
    },
    methods: {
        fontOverFlow(dom) {
            let parent = dom.parentElement;
            let parentStyle = this.getStyle(parent);
            return dom.offsetWidth >= dom.parentElement.offsetWidth - parseFloat(parentStyle.paddingLeft) - parseFloat(parentStyle.paddingRight);
        },
        //获取元素属性
        getStyle (obj, attr) {
            if (obj.currentStyle) { // 兼容IE
                return obj.currentStyle[attr]
            } 
            return window.getComputedStyle(obj, null)[attr]
            ;
        },
        fitFontSize() {
            let that = this;
            let fontDom = document.querySelectorAll('.orderTotalMsg_container .fitFont');
            let zoom = false;
            Array.prototype.forEach.call(fontDom, dom => {
                if (that.fontOverFlow(dom)) {
                    zoom = true;
                }
            })
            zoom && Array.prototype.forEach.call(fontDom, dom => {
                dom.style.fontSize = parseInt(this.getStyle(dom, 'fontSize')) - 1 + 'px';
                //pc最小12px，再小的字号不支持
                if (that.isPC && parseFloat(dom.style.fontSize) < 12) {
                    dom.style.whiteSpace = 'normal';
                    dom.style.lineHeight = 'initial';
                    return;
                }
                if (that.fontOverFlow(dom)) {
                    that.fitFontSize()
                }
            })
        },
        goPage(url,url_type){
            if (url_type==''){
                      
            } else if (!url){
                uni.showToast({
                    title: '功能正在开发中，敬请期待...',
                    icon: 'none',
                    duration: 700
                })
                    
            } else {
                openBBCPage(url)
            }
        }
    }
}
</script>

<style lang="scss">
.advertisement{
    .advertisementWarp{
    // padding: 0 15px;
    display: flex;
    flex-direction: column;
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
        .advertisementTop{
            padding: 12px 15px;
            display: flex;
            justify-content: space-between;
            .leftbg{
                background-repeat: no-repeat;
                background-position: center;
                background-size: cover;
            }
            .rightbg{
                background-repeat: no-repeat;
                background-position: center;
                background-size: cover;
            }
        }
        .advertisement_tab{
            display: flex;
            flex-wrap: nowrap;
            padding-left: 15px;
            overflow-x:auto ;
            .advertisement_tab_warp{
                // width: 25%;
                padding-right: 10px;
                text-align: center;
                padding-bottom: 7px;
                .advertisement_tab_img {
                    width: 100%;
                    background-repeat: no-repeat;
                    background-position: center;
                }
                .advertisement_tab_price{
                    display: flex;
                    flex-direction: column;
                    text-align: center;
                    padding-top: 10px;
                    .item_title{
                        .rmb{
                            font-size: 12px;
                        }
                        font-weight: normal;
                        color: #e64634;
                        font-size: 16px;
                        word-wrap: break-word;
                        word-break: break-all;
                        overflow: hidden;
                    }
                    .item_price{
                        font-size: 11px;
                        color: #999;
                        text-decoration:  line-through;
                        word-wrap: break-word;
                        word-break: break-all;
                        overflow: hidden;
                    }
                }
            }
        }
    }
    .advertisementWarp_3{
        width: 100%;
        min-height: 300rpx;
        background-repeat: no-repeat;
        background-size: 100% 100%;
        .advertisement_tab_3{
            display: flex;
            flex-wrap: wrap;
            justify-content: flex-start;  
            padding: 0 10rpx 0 30rpx;
            .advertisement_tab_warp_3{
            width: 304rpx;
            height:140rpx; 
            display: flex;
            justify-content: flex-start; 
            background-color: #fff;
            border-radius: 16rpx;
            margin: 0 20rpx 20rpx 0;
            padding: 10rpx;
            .advertisement_tab_img_3{
                width: 120rpx;
                height: 120rpx;
                background-repeat: no-repeat;
                background-size: 100% 100%;
            }
            .advertisement_tab_price_3{
                display: flex;
                flex-direction: column;
                padding: 14rpx 0;
                .item_title{
                    .rmb{
                        font-size: 32rpx;
                    }
                    .int{
                        font-size: 40rpx;
                    }
                    .decimal{
                        font-size: 22rpx;
                    }
                    font-weight: bold;
                    color: #e64634;
                    word-wrap: break-word;
                    word-break: break-all;
                    overflow: hidden;
                    height: 48rpx;
                }
                .item_price{
                    height: 34rpx;
                    font-size: 28rpx;
                    color: #999;
                    text-decoration:  line-through;
                    word-wrap: break-word;
                    word-break: break-all;
                    overflow: hidden;
                    margin-top: 8rpx;
                }
            }
        }
        }
        
    }
}

</style>