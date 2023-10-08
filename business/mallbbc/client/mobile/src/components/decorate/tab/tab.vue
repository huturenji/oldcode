<template name="tabGroup">
    <view class="pdb" ref='tabGroup' :style='rootStyle' v-margin="decoItem">
        <view class="tab_wrap tab_group">

            <!-- 顶部导航栏 -->
            <view class="tab_nav" v-show='decoItem.props.showNav'>
                <tabs 
                    ref='tab'
                    class="tabTitle tab_nav_fixed"   
                    :class="{showScrollBar:isPC}"     
                    :itemStyle="{height: '88rpx'}"
                    :inactiveStyle="{color: '#222', lineHeight:'42rpx', fontSize: '30rpx'}"
                    :activeStyle="{color: '#222', lineHeight:'50rpx', fontSize: '36rpx', fontWeight:'bold'}"     
                    :keyName="unitKey" 
                    :list="getTabList(decoItem.data)"  
                    :current="active" 
                    :lineWidth="lineWidth"
                    lineHeight="8rpx" 
                    @tabChange="change"
                ></tabs>
            </view>
            <!-- 遍历渲染的每一个tab栏块 -->
            <!-- 风格1 -->
            <template v-if="decoItem.props.showStyle === 'column' && decoItem.data">
                <view class="tab_wrap_block style1" ref='tabBlock' v-for="(item, index) in decoItem.data" :key="index" :style="{ background: item.background ? item.background : '#fff' }">
                    <view class="tab_item_child">
                        <!-- 此处的v-if="index > 0" 的原因是因为 导航的第一个不需要展示导航 暂时注释 -->
                        <!-- <view class="top_title" v-if="index > 0 || item.titleData.showTitleData">
                            <tabs 
                                class="tabTitle" 
                                lineHeight='0px'  
                                :list="dealName(item)" 
                                :current="0"
                                :itemStyle="{height: '48rpx'}"
                                :keyName="unitKey"
                                :inactiveStyle="{color: '#222', lineHeight:'42rpx', fontSize: '30rpx'}"
                                :activeStyle="{color: '#222', lineHeight:'48rpx', fontSize: '34rpx', fontWeight:'bold'}" 
                            ></tabs>
                        </view> -->
                        
                        <!-- 顶部区域 -->
                        <view v-if="setTopShow(item)" class="list_menu_style3" :style="setBgStyle(item.topData)">
                            <view v-for="(e, i) in item.topData.children" :key="i" class="menu_item" @click="goPage(e)">
                                <image :src="e.img" />
                                <view class="text">{{ e[unitKey] }}</view>
                                <!-- 数据红点 -->
                                <view v-if="getPointShow(e)" class="nums">
                                    <view 
                                        class='content' 
                                        :class='userCenterData[e.redDotSource] > 9 && userCenterData[e.redDotSource] <= 99 ? "scale2" : "scale3"'
                                    >
                                        {{ getPointNum(e.redDotSource) }}
                                    </view>
                                </view>
                                <view class="bracketsNums" v-if="getNumShow(e)">[{{ getPointNum(e.redDotSource) }}]</view>
                            </view>
                        </view>

                        <!-- title区域 -->
                        <view class="top_title" v-if="setTitleShow(item)">
                            <view class="top_title_left" v-if="item.titleData.showTitleData" @click="goPage(item.titleData)">
                                <view v-if="item.titleData.title">{{ item.titleData.title }}</view>
                                <image v-if="!item.titleData.title && item.titleData.img" mode="heightFix" :src="item.titleData.img" />
                            </view>
                            <view class="top_title_right" v-if="item.moreData.showMoreData" @click="goPage(item.moreData)">
                                <view v-if="item.moreData.title">{{ item.moreData.title }}</view>
                                <image v-if="item.moreData.title" class="arrowImg" :src="imgUrl + 'common/icon/icon_common_rightarrow.svg'" mode=""></image>
                                <image v-if="!item.moreData.title && item.moreData.img" class="uploadImg" mode="heightFix" :src="item.moreData.img" />
                            </view>
                        </view>

                        <!-- 列表区域 -->
                        <view class="list_menu_column">
                            <view v-for="(e, i) in item.children" :key="i" class="menu_item" :class="[setListClass(item)]" @click="goPage(e)">
                                <view class="left">
                                    <image class="icon" :src="e.img" :style='setImgStyle(item)' />
                                    <view :style='setImgStyle(item)' >{{ e[unitKey] }}</view>
                                </view>
                                <view class="right">
                                    <!-- 数据红点 -->
                                    <view v-if="getPointShow(e)" class="nums">{{ getPointNum(e.redDotSource) }}</view>
                                    <image class="right_arrow" :src="imgUrl + 'common/icon/icon_common_rightarrow.svg'" />
                                </view>
                            </view>
                        </view>

                        <!-- 物流卡片 -->
                        <view class="express" v-if="item.showLogistics">
                            <expressCard />
                        </view>
                    </view>
                </view>
            </template>
            <!-- 风格2 -->
            <template v-if="decoItem.props.showStyle === 'row' && decoItem.data">
                <view class="tab_wrap_block style2" ref='tabBlock' v-for="(item, index) in decoItem.data" :key="index" :style="{ background: item.background ? item.background : '#fff' }">
                    <view class="tab_item_child">
                        <!-- 此处的v-if="index > 0" 的原因是因为 导航的第一个不需要展示导航 暂时注释 -->
                        <!-- <view class="top_title" v-if="index > 0 || item.titleData.showTitleData">
                            <tabs 
                                class="tabTitle" 
                                lineHeight='0px'  
                                :keyName="unitKey" 
                                :list="dealName(item)" 
                                :current="0"
                                :itemStyle="{height: '48rpx'}"
                                :inactiveStyle="{color: '#222', lineHeight:'42rpx', fontSize: '30rpx'}"
                                :activeStyle="{color: '#222', lineHeight:'48rpx', fontSize: '34rpx', fontWeight:'bold'}" 
                            ></tabs>
                        </view> -->

                        <!-- 顶部区域 -->
                        <view v-if="setTopShow(item)" class="list_menu_style3" :style="setBgStyle(item.topData)">
                            <view v-for="(e, i) in item.topData.children" :key="i" class="menu_item" @click="goPage(e)">
                                <image :src="e.img" />
                                <view class="text">{{ e[unitKey] }}</view>
                                <!-- 数据红点 -->
                                <view v-if="getPointShow(e)" class="nums">
                                    <view 
                                        class='content' 
                                        :class='userCenterData[e.redDotSource] > 9 && userCenterData[e.redDotSource] <= 99 ? "scale2" : "scale3"'
                                    >
                                        {{ getPointNum(e.redDotSource) }}
                                    </view>
                                </view>
                                <view class="bracketsNums" v-if="getNumShow(e)">[{{ getPointNum(e.redDotSource) }}]</view>
                            </view>
                        </view>

                        <!-- title区域 -->
                        <view class="top_title" v-if="setTitleShow(item)">
                            <view class="top_title_left" v-if="item.titleData.showTitleData" @click="goPage(item.titleData)">
                                <view v-if="item.titleData.title">{{ item.titleData.title }}</view>
                                <image v-if="!item.titleData.title && item.titleData.img" mode="heightFix" :src="item.titleData.img" />
                            </view>
                            <view class="top_title_right" v-if="item.moreData.showMoreData" @click="goPage(item.moreData)">
                                <view v-if="item.moreData.title">{{ item.moreData.title }}</view>
                                <image v-if="item.moreData.title" class="arrowImg" :src="imgUrl + 'common/icon/icon_common_rightarrow.svg'" mode=""></image>
                                <image v-if="!item.moreData.title && item.moreData.img" class="uploadImg" mode="heightFix" :src="item.moreData.img" />
                            </view>
                        </view>
                        <!-- 没有tab和顶部区域的占位空间 -->
                        <view v-if="!setTitleShow(item) && !(index > 0 || item.titleData.showTitleData)" style="height: 16rpx"></view>

                        <!-- 列表区域 -->
                        <view class="list_menu_row">
                            <view v-for="(e, i) in item.children" :key="i" class="menu_item" :style="setFlex(item.children)" :class="[setListClass(item)]" @click="goPage(e)">
                                <image :src="e.img" :style="setImgStyle(item)"/>
                                <view class="text" :style="setTextStyle(item)">{{ e[unitKey] }}</view>
                                <!-- 数据红点 -->
                                <view v-if="getPointShow(e)" class="nums">
                                    <view 
                                        class='content' 
                                        :class='userCenterData[e.redDotSource] > 9 && userCenterData[e.redDotSource] <= 99 ? "scale2" : "scale3"'
                                    >
                                        {{ getPointNum(e.redDotSource) }}
                                    </view>
                                </view>
                            </view>
                        </view>

                        <!-- 物流卡片 -->
                        <view class="express" v-if="item.showLogistics">
                            <expressCard />
                        </view>
                    </view>
                </view>
            </template>
        </view>
    </view>
</template>

<script>
import { skipTo, repeatArray } from '@/utils/common.js';
import redpoint from '@/components/redpoint/index';
import expressCard from '@/components/express/card.vue';
import tabs from "@/components/tab/base";
import eventsMixin from '../common/mixin/eventsMixin'

export default {
    name: "deco-tab",
    mixins: [eventsMixin],
    components: {
        tabs,
        expressCard
    },
    data() {
        return {
            imgUrl: getApp().globalData.imgUrl,
            active: 0,
            scrollTop:'', //页面滚动的高度
            showTabFixed: false,
            scrollLock: false, //滚动锁
            tabLanoffsetTopList: [],
            fixedNavHeight: 44, //fixed定位的导航栏nav的高度是44px 样式里面写的44px
            setCommonMax: 5, //点击几次加入常用
            tabSpace: 10, //每个tab之间的间隙是20px
            commonName: '常用',
            unitKey: 'tabName',
            lineWidth: '40rpx',
            userCenterData: redpoint.config,
            isPC:SnUtils.isPC()
        }
    },
    props: {
        decoItem:{
            type: Object,
            default: () => {}
        },
        parentScrollTop: {
            type: Number,
            default: 0
        },
        scrollContainer: {
            type: [HTMLElement, Document]
        },
        cacheKey: { //如果tabGroup有常用功能，此时需要借助前端缓存来实现，需要页面给一个前端缓存的key
            type: String
        },
        isChildren: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        rootStyle() {
            let styleObj = {}

            if (this.decoItem.props.isShowStyle && this.decoItem.styles[0].background) {
                let style = this.decoItem.styles[0].background
                styleObj = {
                    background: style.img?`url(${style.img}) center/100% 100% no-repeat`:style.color,
                    opacity: style.opacity/100<1?style.opacity/100:1
                }
            }

            // 固定顶部
            if (this.decoItem.props.fixed) {
                styleObj.paddingBottom = 'calc(100vh - var(--tabGroup-height))'
            }
            return styleObj
        },
        // 设置tabItem样式
        setBgStyle() {
            return item => {
                let styleObj = {}
                // 设置背景色
                styleObj.backgroundColor = item.background ? item.background : '#fff'
                // 设置圆角
                if (item.radius && item.radius.showRadius) {
                    styleObj.borderTopLeftRadius = parseInt(item.radius.leftTop) * 2 + 'rpx'
                    styleObj.borderTopRightRadius = parseInt(item.radius.rightTop) * 2 + 'rpx'
                    styleObj.borderBottomLeftRadius = parseInt(item.radius.leftBottom) * 2 + 'rpx'
                    styleObj.borderBottomRightRadius = parseInt(item.radius.rightBottom) * 2 + 'rpx'
                } else {
                    styleObj.borderRadius = '20rpx'
                }
                return styleObj
            }
        },
        setTopShow() {
            return item => {
                return item.topData && item.topData.showTopData && item.topData.children.length > 0
            }
        },
        setTitleShow() {
            return item => {
                return item.titleData && item.moreData && (item.titleData.showTitleData || item.moreData.showMoreData)
            }
        },
        setListClass() {
            return item => {
                let size = 'big'
                if (item.size !== 'big' && item.size) {
                    size = item.size
                }
                return size
            }
        },
        setImgStyle(){
            return item => {
                let styleObj = {}
                if (item.size==='custom') {
                    styleObj.width = item.imgSize*2 + 'rpx'
                    styleObj.height = item.imgSize*2 + 'rpx'
                }
                return styleObj
            }
        },

        setTextStyle(){
            return item => {
                let styleObj = {}
                if (item.size==='custom') {
                    styleObj.fontSize = item.textSize*2 + 'rpx'
                }
                return styleObj
            }
        },
        getPointShow() {
            return item => {
                let isShow = false
                if (item.showRedDot && (!item.redDotType || item.redDotType === 'redDot') && this.userCenterData[item.redDotSource] && this.userCenterData[item.redDotSource].number > 0) {
                    isShow = true
                }
                return isShow
            }
        },
        getNumShow() {
            return item => {
                let isShow = false
                if (item.showRedDot && item.redDotType === 'brackets' && this.userCenterData[item.redDotSource] && this.userCenterData[item.redDotSource].number > 0) {
                    isShow = true
                }
                return isShow
            }
        },
        getPointNum() {
            return key => {
                let num = this.userCenterData[key].number
                if (key === 'redpacketTotal') {
                    num = `¥${num}`
                } else if (this.userCenterData[key].number > 99) {
                    num = '99+'
                }
                return num
            }
        },
        // 设置一行最多显示四个
        setFlex() {
            return () => {
                const maxNum = this.decoItem.props.maxNum ? parseInt(this.decoItem.props.maxNum) : 4
                let percentage = parseInt(1 / maxNum * 100)
                return {
                    flex: `0 1 ${percentage}%`
                }
            }
        }
    },
    async mounted() {
        this.fixedNavHeight = this.$refs.tab.$el.offsetHeight;//使用dom的实际值

        //初始化常用的功能
        this.initCommonUse();

        //计算底部padding的高度
        this.calcPdt();

        //初始时判断是否需要spin
        this.eventListenerHanler(0);
    },
    watch: {
        showTabFixed(val, oldVal) {
            if (val != oldVal){
                if (this.decoItem.props.fixed && this.decoItem.props.showNav && !this.isChildren){
                    this.$emit('addFixed', this.$refs.tab.$el, val);
                    this.custEvents.dispatch('addFixed', this.$refs.tab.$el, val);
                }
            }
        },
        parentScrollTop:{
            handler(val, oldVal){
                //不在初始化时执行，避免多次触发同一事件
                if (oldVal != undefined){
                    this.eventListenerHanler(val);
                }
            },
            immediate: true
        }
    },
    methods: {
        // tabs 数据
        getTabList(data) {
            return data.map(item => {
                let obj = {
                    [this.unitKey]: item.tabName || item.titleData?.title,
                    children: item.children
                }
                return obj
            })
        },
        //初始化常用功能
        initCommonUse() {
            if (Object.keys(this.decoItem).length > 0 && this.decoItem.data.length > 0){
                let index = this.decoItem.data.findIndex(item => {
                    return item[this.unitKey] == this.commonName
                })
                if (index > -1 && !!this.cacheKey){ //说明存在常用的功能
                    //从缓存中常用列表
                    let commonUseList = this.$getStorageSync(this.cacheKey) || [];
                    if (commonUseList.length > 0){ //说明缓存中存在, 直接将缓存中存在的覆盖
                        let commonChildren = commonUseList.slice(0, 4);

                        //更新缓存中的数据，原因是因为服务汇小应用有可能各种变更，报错小应用的新增和删除，和小应用地址url的变更
                        let newCommon = this.updateCommonChildren(commonChildren, index);
                        this.$setStorageSync(this.cacheKey, newCommon);

                        //因为点击次数和缓存数据是一一对应的所以，如果变更了，此时需要重新更新点击次数
                        this.updateClickCacheTimes(newCommon)

                        this.decoItem.data.splice(index, 1, {
                            [this.unitKey]: this.commonName,
                            children: newCommon
                        })
                    } else { //说明不存在，此时把admin平台配置常用地址存入缓存
                        this.$setStorageSync(this.cacheKey, this.decoItem.data[index].children.slice(0, 4));
                    }
                }
            }
        },
        updateClickCacheTimes(list) {
            // 如果不需要常用功能，此时直接return掉
            if (!this.cacheKey){ return }
            try {
                let commonUseTimes = this.$getStorageSync(`${this.cacheKey}_times`) || []; 
                let arr = commonUseTimes.filter(item => {
                    let j = list.findIndex(temp => {
                        return temp[this.unitKey] == item[this.unitKey];
                    })
                    return j > -1;
                })
                this.$setStorageSync(`${this.cacheKey}_times`, arr); 
            } catch (error) {
            }

        },

        updateCommonChildren(children) {
            try {
                let arr = this.decoItem.data.filter(item => {
                    return item[this.unitKey] != this.commonName
                })
                //整合所有最新的配置的tabs
                let arrChileren = [];
                arr.forEach(element => {
                    arrChileren.push(...element.children)
                });

                //更新操作
                let list = children.map(item => {
                    let j = arrChileren.findIndex(temp => {
                        return temp[this.unitKey] == item[this.unitKey];
                    })
                    if (j > -1){ //找到更新
                        return Object.assign({}, item, arrChileren[j])
                    } //没找到返回false
                    return false;
                    
                })

                //过滤出false
                let filterArr = list.filter(item=>{
                    return !!item && Object.keys(item).length > 0
                })
                if (filterArr.length > 0){
                    return filterArr;
                } //如果过滤完了，直接返回配置的常用
                return this.decoItem.data.filter(item => {
                    return item[this.unitKey] == this.commonName;
                })
                
            } catch (error) {
                return children;
            }
        },

        //点击每一个item 点击记录次数，当次数超过常用要求次数时，此时常用缓存里面推
        clickTabItem(item) {
            // 如果不需要常用功能，此时直接return掉
            if (!this.cacheKey){ return }
            let commonUseTimes = this.$getStorageSync(`${this.cacheKey}_times`) || []; 
            let index = commonUseTimes.findIndex(temp => {
                return item[this.unitKey] == temp[this.unitKey]
            })
            if (index > -1){ //说明存在，此时点击次数 +1
                commonUseTimes.splice(index, 1, {
                    [this.unitKey]: commonUseTimes[index][this.unitKey],
                    clickTimes: ++commonUseTimes[index].clickTimes
                })
                if (commonUseTimes[index].clickTimes >= this.setCommonMax){ //点击超过5次才往里面记录
                    let commonUseList = this.$getStorageSync(this.cacheKey) || [];
                    commonUseList.unshift(item);//数据前面往里推
                    //此时需要根据tabName去重
                    let newArr = repeatArray(commonUseList, this.unitKey).slice(0, 4);
                    this.$setStorageSync(this.cacheKey, newArr);

                    //为了即时渲染，即加入了就能看到效果，此时需要重新给deco_data赋值
                    try {
                        let tempIndex = this.decoItem.data.findIndex(temp => {
                            return temp[this.unitKey] == this.commonName
                        })
                        this.decoItem.data.splice(tempIndex, 1, {
                            [this.unitKey]: this.commonName,
                            children: newArr
                        })
                    } catch (error) {
                    }
                }
            } else { //说明不存在，此时存缓存
                commonUseTimes.push({
                    [this.unitKey]: item[this.unitKey],
                    clickTimes: 1
                })
            }
            this.$setStorageSync(`${this.cacheKey}_times`, commonUseTimes);
        },

        // 处理tab顶部的name
        dealName(item) {
            return [
                {
                    [this.unitKey]: item[this.unitKey]
                }
            ]
        },

        eventListenerHanler(scrollTop) {
            if (this.scrollLock){ return } //如果滚动锁打开了，直接return掉

            this.scrollTop = scrollTop;
            if (this.scrollTop >= this.$refs.tabGroup.$el.offsetTop){
                this.showTabFixed = true; //此时显示顶部定位的tab组件
                this.scrollTop += this.tabSpace;
                if (this.$refs.tabBlock) {
                    for (let i = 0; i < this.$refs.tabBlock.length; i++) {
                        const element = this.$refs.tabBlock[i].$el;
                        if (!!this.$refs.tabBlock[i+1] && this.scrollTop >= element.offsetTop && this.scrollTop < this.$refs.tabBlock[i+1].$el.offsetTop){
                            this.active = i;
                        } else if (this.scrollTop >= this.$refs.tabBlock[this.$refs.tabBlock.length - 1].$el.offsetTop){
                            this.active = this.$refs.tabBlock.length - 1;
                        }
                    }
                }
            } else {
                this.showTabFixed = false;
                this.active = 0;
            }
        },

        // 点击顶部的导航
        change({index}) {
            this.active = index;
            this.showTabFixed = true;
           
            this.scrollLock = true; //打开滚动锁
            setTimeout(() => { //500ms后关闭锁
                this.scrollLock = false;
            }, 600)
            this.scrollToTab(index);
        },

        // 滚动到具体的tab栏处
        scrollToTab(index) {
            let itemOffsetTop = this.$refs.tabBlock[index].$el.offsetTop;
            if (index == 0){
                itemOffsetTop = 0;
            }
            this.scrollContainer.scrollTop = itemOffsetTop;
        },

        goPage(e) {
            this.clickTabItem(e);
            skipTo(e,this)
        },
        calcPdt() {
            try {
                let dom = document.querySelectorAll('.tab_group .tab_wrap_block')[1]; //因为第二个高度才是正确的
                let domHeight = dom.getBoundingClientRect().height;
                let padbtm = parseInt(domHeight) + parseInt(window.titleBarHeight) + parseInt(this.fixedNavHeight)
                document.body.style.setProperty('--tabGroup-height', padbtm+'px');
            } catch (error) {
                document.body.style.setProperty('--tabGroup-height', '230px');
            }
        }
    }
}
</script>

<style lang='scss'>
    .tab_wrap {
        position: relative;
        .tab_nav {
            ::v-deep .u-tabs__wrapper__nav__line{
                bottom: 4px;
            }
        }

        .tab_nav_fixed {
            max-width: 750rpx;
            overflow-x: auto;
            overflow-y: hidden;
            background: #EFF2F5;
            height: 45px;
        }
        .showScrollBar{
            margin: auto;
            left: 0;
            right: 0;
            max-width: 750rpx;
            &::-webkit-scrollbar-track{
                background-color: #EFF2F5;
            }
            &::v-deep{
                display: flex;
                flex-direction: row;
            }
        }

        .tab_wrap_block {
            margin-bottom: 10px;
            border-radius: 20rpx;

            .tab_item {
                white-space: nowrap;
                overflow-x: auto;
                width: auto;
            }

            .tab_item_child {

                .top_title {
                    height: 48rpx;
                    color: #222222;
                    line-height: 48rpx;
                    margin-bottom: 24rpx;
                    font-weight: 700;
                    position: relative;

                    .top_title_left {
                        position: absolute;
                        top: 0;
                        left: 0;
                        height: 48rpx;
                        line-height: 48rpx;
                        font-size: 34rpx;

                        image {
                            height: 40rpx;
                        }
                    }

                    .top_title_right {
                        position: absolute;
                        top: 4rpx;
                        right: 0;
                        height: 40rpx;
                        line-height: 40rpx;
                        font-size: 28rpx;
                        font-weight: 400;
                        color: #222222;
                        display: flex;
                        align-items: center;

                        .uploadImg {
                            height: 40rpx;
                        }

                        .arrowImg {
                            margin-left: 8rpx;
                            width: 20rpx;
                            height: 20rpx;
                        }
                    }
                }

                .list_menu_row {
                    display: flex;
                    flex-wrap: wrap;
                    width: 100%;

                    .menu_item {
                        text-align: center;
                        margin-bottom: 36rpx;
                        position: relative;

                        &.big image {
                            width: 72rpx;
                            height: 72rpx;
                            margin-bottom: 4rpx;
                        }

                        &.small image {
                            width: 52rpx;
                            height: 52rpx;
                            margin-bottom: 4rpx;
                        }

                        &.big .text {
                            font-size: 28rpx;
                            color: #222;
                            line-height: 120%;
                            font-weight: 400;
                        }

                        &.small .text {
                            font-size: 26rpx;
                            color: #222;
                            line-height: 120%;
                            font-weight: 400;
                        }

                        &.big .nums {
                            top: -4rpx;
                        }

                        &.small .nums {
                            top: -12rpx;
                        }

                        &.custom .nums {
                            right :14rpx;
                            top: -10rpx;
                        } 
                        .nums {
                            position: absolute;
                            right: 30rpx;                        
                            width: 28rpx;
                            height: 28rpx;
                            border-radius: 28rpx;
                            box-sizing: border-box;
                            background: #f30300;
                            box-shadow: 1px 2px 3px 0px rgba(249,3,0,0.24); 
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            color: #fff;
                            font-weight: 600;
                            font-size: 20rpx;
                            
                            
                            .content {
                                &.scale2 {
                                    transform: scale(.9);
                                }
                                &.scale3 {
                                    transform: scale(.8);
                                }
                            }
                        }
                    }
                }

                .list_menu_column {
                    .menu_item {
                        width: 100%;
                        display: flex;
                        padding: 32rpx 0rpx 32rpx 0rpx;
                        font-size: 28rpx;
                        justify-content: space-between;
                        align-items: center;

                        .left {
                            display: flex;
                            align-items: center;

                            .icon {
                                width: 44rpx;
                                height: 44rpx;
                                margin-right: 16rpx;
                            }
                        }

                        .right {
                            display: flex;
                            align-items: center;

                            .right_arrow {
                                width: 24rpx;
                                height: 24rpx;
                            }

                            .nums {
                                background: #f30300;
                                border-radius: 14rpx;
                                box-shadow: 2rpx 4rpx 6rpx 0rpx rgba(249,3,0,0.24); 
                                font-size: 20rpx;
                                
                                font-weight: 500;
                                color: #fff;
                                text-align: center;
                                height: 28rpx;
                                line-height: 28rpx;
                                min-width: 28rpx;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                font-size: 20rpx;
                                margin-right: 9rpx;
                            }
                        }
                    }
                }
            }
        }

        .list_menu_style3 {
            display: flex;
            flex-wrap: wrap;
            width: calc(100% + 52rpx);
            margin: -16rpx -26rpx 20rpx -26rpx;

            .menu_item {
                flex: 1;
                display: flex;
                align-items: center;
                justify-content: center;
                position: relative;
                height: 38rpx;
                line-height: 38rpx;
                margin: 20rpx 0;

                &::after {
                    content: '';
                    width: 2rpx;
                    height: 20rpx;
                    background-color: rgba(164, 172, 178, 0.48);
                    position: absolute;
                    right: 0;
                    top: 50%;
                    transform: translateY(-50%);
                }

                &:last-child::after {
                    content: none;
                }

                .text {
                    white-space: nowrap;
                }

                image {
                    width: 38rpx;
                    height: 38rpx;
                    margin-right: 8rpx;
                }

                .nums {
                    background: #f30300;
                    border-radius: 14rpx;
                    box-shadow: 2rpx 4rpx 6rpx 0rpx rgba(249,3,0,0.24); 
                    
                    font-weight: 500;
                    color: #fff;
                    text-align: center;
                    height: 28rpx;
                    line-height: 28rpx;
                    min-width: 28rpx;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 20rpx;
                    margin: 5rpx 0 0 8rpx;
                }

                .bracketsNums {
                    font-size: 22rpx;
                }
            }
        }

        // 不同风格独有样式
        .style1.tab_wrap_block,
        .style2.tab_wrap_block {
            .tab_item_child {
                padding: 20rpx 30rpx 0 30rpx;
            }
        }
    }
</style>