<template>
<view class="wrapper1" v-show="isShowMask1">
    <transition name="content">
        <view class="content_view" v-show="isShow">
            <view class="title_view">
                <view class="back_view">
                </view>
                <view class="title">请选择所在地区</view>
                <view class="close_view" @click="hidden">
                    <icon class="close_icon" :type="'clear'" size="20" color='#DCDCDC'/>
                </view>
            </view>
            <view class="select_top">
                <view :class="{select_top_item:true,sel_on:currentIndex == index}" ref="select_top_item" v-for="(item,index) in dataList" :key="index" @click="select_top_item_click(index)">
                    <text class="address_value">{{item.regionName}}</text>
                </view>
            </view>
            <swiper class="swiper" :current="currentIndex" @change="swiperChange">
                <swiper-item v-for="(swiper_item,swiper_index) in dataList" :key="swiper_index">
                    <view class="swiper-item">
                        <scroll-view class="scroll-view-item" scroll-y="true">
                            <view class="address_item flex_row_between_center" v-for="(item,index) in cityAreaArray[swiper_index]" :key="index" @click="address_item_click(swiper_index,index,item)" :style="{background:selectIndexArr[swiper_index] === index?bgGrey:bgWhite}">
                                {{item.regionName}}
                                <view v-if="selectIndexArr[swiper_index] === index" class="address_item_icon"></view>

                            </view>
                        </scroll-view>
                    </view>
                </swiper-item>
            </swiper>
        </view>
    </transition>
    <view class="mask" @click="hidden" v-show="isShowMask" @touchmove.stop.prevent="moveHandle"></view>
</view>
</template>

<script>
// import areaData from '../../static/area.json'
export default {
    data() {
        return {
            imgUrl: getApp().globalData.imgUrl,
            isShow: false,
            isShowMask: false,
            isShowMask1: false,
            dataList: [{ //顶部数据源
                regionCode: '',
                regionName: '请选择'
            }],
            currentIndex: 0, //顶部选择index 0,1,2,3
            cityData: {},
            cityAreaArray: [], //底部数据源  [['一级数据'],['二级数据'],...]
            selectIndexArr: [], //底部选择状态 [0,0,0,0]  这种形式,位置对应顶部选择的状态,默认没有值
            indicatorStyleLeft: 16,
            sel_area_tip: {
                code: '',
                name: '请选择'
            },
            bgGrey: '#F8F8F8',
            bgWhite: '#fff',
            areaData:[],
            showTipsFlag:false
        };
    },
    props: {
        sel_data: {
            type: Array,
            value: []
        },
        isBack:{
            type:Boolean,
            default:true
        }
    },
    methods: {
        //当地址错误直接拉起弹窗
        show() {
            this.getAddressListNew()
            this.open()
        },

        //地址校验方法
        async autoAddressSel(){
            
            //获取初始数据
            await this.getAddressListNew()
            //执行校验方法
            let i = 0
            for (let data of this.sel_data){
                //地址有2级3级4级都有可能
                if (data?.code){
                    //index>-1 说明找到该元素 继续执行 若找不到 直接弹出
                    let index = this.cityAreaArray[i].findIndex((item)=>{
                        return item.regionCode == data.code
                    })
                    if (index>-1){
                        //第一个参数为 地址信息  第二个参数为  选中的索引  第三个参数为 数据
                        await this.address_item_click(i, index, this.cityAreaArray[i][index], true)
                        i = i+1
                    } else {
                        this.$emit('changeValid')
                        uni.showToast({
                            title: '地区已失效，请重新选择',
                            icon:'none'
                        })
                        setTimeout(() => {
                            this.open()
                        }, 500);
                    }
                }
            }
        },
        //点击打开地址弹窗
        open(){
            this.isShow = true
            this.isShowMask1 = true
            this.isShowMask = true
        },
        showNoMask(){
            this.getAddressListNew()
            this.isShowMask1 = true
            this.isShow = true
        },
        getAddressList(){
            let param = {};
            param.url = 'v3/system/front/region/list';
            param.data = {};
            param.method = 'GET';
            this.$request(param).then(res => {
                if (res.state == 200){
                    this.areaData=res.data
                    this.cityData = this.areaData
                    this.cityAreaArray.push(this.areaData)
                } else {
                    this.$api.msg(res.msg);
                }
            }).catch((e) => {
                console.log(e)
                //异常处理
            })
        },
        //初始化数据
        getAddressListNew(){
            return new Promise((resolve) => {
                let param = {};
                param.url = 'v3/system/front/region/getRegionInfoList';
                param.data = {parentRegionCode:0};
                param.method = 'GET';
                this.$request(param).then(res => {
                    if (res.state == 200){
                        //为一级数据源赋值
                        this.cityAreaArray.push(res.data)
                        resolve()
                    } else {
                        resolve()
                        this.$api.msg(res.msg);
                    }
                }).catch((e) => {
                    console.log(e)
                    //异常处理
                })
            })
        },
        hidden() {
            this.isShow = false
            setTimeout(() => {
                this.isShowMask = false
                this.isShowMask1 = false
            }, 100);
        },
        select_top_item_click(index) {
            this.currentIndex = index
            this.$nextTick(() => {
                this.changeIndicator(index)
            })

        },
        swiperChange(event) {
            let index = event.detail.current
            this.currentIndex = index

            this.changeIndicator(index)
        },
        changeIndicator(index) {
            let indicatorWidth = 30
            const query = uni.createSelectorQuery().in(this);
            let arr = query.selectAll('.select_top_item .address_value')
            arr.fields({
                size: true,
                scrollOffset: false
            }, data => {

                let itemWidth = data[index]["width"] > 80 ? 70 : data[index]["width"]
                let itemCenterX = 10 + index * 80 + itemWidth / 2
                let left = itemCenterX - indicatorWidth / 2

                this.indicatorStyleLeft = left

            }).exec();


        },
        // isAutoSelect参数是用来处理 是用户点击的true，还是自动程序调用false。用来区分程序反选
        address_item_click(swiper_index, index, item, isAutoSelect=false) {
            let param = {};
            param.url = 'v3/system/front/region/getRegionInfoList';
            param.data = {parentRegionCode:item.regionCode};
            param.method = 'GET';
            return new Promise((resolve) =>{
                this.$request(param).then(res => {
                    if (res.state == 200){
                        // 记录选择的位置,将当前swiper_index后面的位置清除
                        this.selectIndexArr.splice(swiper_index, 5, index)
    
                        if (res.data.length>0){
                            // 将tab栏swiper_index后面的数据清掉,并给当前的位置赋值
                            this.dataList.splice(swiper_index)
                            this.dataList[swiper_index] = item;
                            this.dataList.push({
                                regionCode: '',
                                regionName: '请选择'
                            })
                            // 底部数据源,因为是一级一级重新赋值,所以后面的数据不用清理操作
                            this.cityAreaArray[swiper_index+1] = res.data
                            //直接赋值 swiper动画是干蹦
                            setTimeout(()=>{
                                this.currentIndex = swiper_index +1
                            },50)
                            resolve()
                        } else {
                            this.dataList.splice(-1)
                            this.dataList[swiper_index] = item;
                            const selectArr = []
                            this.dataList.forEach((temp,ind)=>{
                                selectArr.push(temp)
                                selectArr[ind].name = temp.regionName
                                selectArr[ind].code = temp.regionCode
                            })
                            this.$emit("selectAddress", selectArr)
                            if (!isAutoSelect){
                                setTimeout(() => {
                                    this.isShow = false
                                    this.isShowMask = false
                                    this.isShowMask1 = false
                                
                                }, 100);
                            }
                            resolve()
                        }
                    } else {
                        this.$api.msg(res.msg);
                    }
                }).catch((e) => {
                    console.log(e)
                    //异常处理
                })
            })


        },
        moveHandle(){
        },
        backToAdd(){
            this.$emit('backToAdd')
        }
    }

}
</script>

<style lang="scss">
// 不换行
@mixin no-wrap() {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
}

.wrapper1 {
    z-index: 1999;
    position: fixed;
    width: 750rpx;
    top: 0;
    left: 50%;
    bottom: 0;
    transform: translate(-50%, 0);
    background-color: rgba(0, 0, 0, 0.4);
    .content_view {
        z-index: 999;
        background: #fff;
        position: fixed;
        height: 65%;
        left: 0;
        bottom: 0;
        right: 0;
        border-top-left-radius: 10rpx;
        border-top-right-radius: 10rpx;
        width: 750rpx;
        margin: 0 auto;
        display: flex;
        flex-direction: column;
        .title_view {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0 30rpx;
            height: 100rpx;

            .title {
                font-size: 32rpx;
                color: 32rpx;
                font-weight: bold;
                color: #333333;
            }

            .close_view {
                height: 60rpx;
                width: 40rpx;
                display: flex;
                justify-content: center;
                align-items: center;
            }
        }

        .select_top {
            height: 90rpx;
            display: flex;
            justify-content: flex-start;
            align-items: center;
            padding: 0 30rpx;
            position: relative;
            box-sizing: border-box;
            border-bottom: 1rpx solid #f2f2f2;
            .select_top_item {
                margin-right: 30rpx;
                font-size: 28rpx;
                line-height: 80rpx;
                @include no-wrap();
                color: #333;
                border-bottom: 6rpx solid #fff;
                max-width: 200rpx;
                &.sel_on{
                    color: var(--tagColor);
                    border-bottom: 6rpx solid var(--tagColor);
                    font-weight: bold;
                    height: 90rpx;
                }
            }
        }

        .swiper {
            flex: 1;
            position: relative;
            .swiper-item {
                height: 100%;

                .scroll-view-item {
                    height: 100%;

                    .address_item {
                        color: #333333;
                        font-size: 28rpx;
                        display: flex;
                        align-items: center;
                        height: 90rpx;
                        line-height: 90rpx;
                        padding: 0 30rpx;
                        .address_item_icon {
                            width: 40rpx;
                            height: 40rpx;
                            margin-left: 20rpx;
                            background: var(--checkedImg);
                        }
                    }
                }
            }
        }
    }

    .mask {
        position: fixed;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        background: $uni-text-color-grey;
        opacity: 0.4;
    }
}

.content-enter {
    transform: translateY(100%);
}

.back_view{
    display: flex;
    align-items: center;
    image{
        width: 30rpx;
        height: 30rpx;
    }
    text{
        font-size: 28rpx;
    }
}

.content-enter-to {
    transform: translateY(0%);
}

.content-enter-active {
    transition: transform 0.5s;
}

.content-leave {
    transform: translateY(0%);
}

.content-leave-to {
    transform: translateY(100%);
}

.content-leave-active {
    transition: transform 0.5s;
}
</style>
