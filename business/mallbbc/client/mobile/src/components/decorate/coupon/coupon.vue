<!-- 领券中心 -->
<template>
    <view class="my_coupon" v-margin="decoItem" ref="my_coupon">
        <!-- 随机优惠券 start -->
        <view :class="{'hide':!rondomMod,'random_coupon':true}" style="position: fixed;width: 750rpx;height:100vh;background:rgba(0,0,0,0.6);z-index: 1000;top:0">
            <view class="random_coupon_bg" :style="{backgroundImage:'url(' + imgUrl + 'coupon/random_bg.png)'}" @click="goMyCoupon()">
                <view class="random_coupon_price">￥{{rondomDes.publishValue}}</view>
                <view class="random_coupon_des">{{rondomDes.couponContent}}</view>
                <view class="close_btn" :style="{backgroundImage:'url(' + imgUrl + 'common/icon/close_screen.png)'}" @click.stop="close"></view>
            </view>
        </view>
        <!-- 随机优惠券 end -->
        <view class="my_coupon_nav_warp" ref='couponNavWarp'>
            <view class="my_coupon_nav" ref="couponNav" :style="{justifyContent: decoItem.data.length>1?'center':'start',backgroundImage:decoItem.props.tabBackImage.ifShowTabBackImage?(isScroll?'url(' + decoItem.props.tabBackImage.scrollTopImgInfo.img + ')':'url(' + decoItem.props.tabBackImage.imgInfo.img + ')'):''}">
                <view class="my_coupon_nav_pre_wrap" >
                    <view class="my_coupon_nav_pre" :class="{active:activeIndex == index,line:decoItem.data.length>1&&activeIndex == index}" @click="handleNav(index)" v-for="(item,index) in decoItem.data" :key="index">{{item.title}}</view>
                </view>
            </view>
        </view>
        <view class="coupon_list_top" v-if="decoItem.props.couponBackTopImage.ifShowCouponBackTopImage" :style="{backgroundImage:'url(' + decoItem.props.couponBackTopImage.imgInfo.img + ')'}"></view>
        <!-- 优惠券列表 -->
        <view class="my_coupon_list" :style="{backgroundImage:'url(' + decoItem.props.couponBackImage.imgInfo.img + ')',marginTop:couponListMTop,transform:listSacle}" v-if="!disabledModule && handleNavShow" >
            <view v-if="!noData">
                <view class="coupon_item_box" v-for="(item,index) in decoItem.data[activeIndex].info" :key="index">
                    <view class="coupon_item" v-if="item.coupon_show_type!=='picCoupon'">
                        <view class="coupon_left_box" :class="item.info.receivedState == 3 && item.info.notUseCount==0?'coupon_left_box coupon_left_box1':'coupon_left_box'">
                            <view class="coupon_left fontScaleIgnore">
                                <view class="coupon_pre_price num-font fitFont" 
                                    v-if="(item.info.couponType != 2)&&(item.info.couponType != 3)"
                                    :style="{color:setColor(item)}"
                                >
                                    <text class="unit">¥ </text>
                                    <text class="price_int" :style="{color:setColor(item)}">{{$getPartNumber(item.info.publishValue,'int')}}</text>
                                    <text class="price_decimal" v-if="$getPartNumber(item.info.publishValue,'decimal')!='.00'" :style="{color:setColor(item)}">{{$getPartNumber(item.info.publishValue,'decimal')}}</text>
                                </view>
                                <view class="coupon_pre_price num-font fitFont" v-if="item.info.couponType == 3">
                                    <text class="unit">¥ </text>
                                    <text class="price_int">{{$getPartNumber(item.info.randomMin,'int')}}</text>
                                    <text class="price_decimal" v-if="$getPartNumber(item.info.randomMin,'decimal')!='.00'">{{$getPartNumber(item.info.randomMin,'decimal')}}</text>
                                    <text class="unit">~</text>
                                    <text class="unit">¥ </text>
                                    <text class="price_int">{{$getPartNumber(item.info.randomMax,'int')}}</text>
                                    <text class="price_decimal" v-if="$getPartNumber(item.info.randomMax,'decimal')!='.00'">{{$getPartNumber(item.info.randomMax,'decimal')}}</text>
                                </view>
                                <view class="coupon_pre_price" v-if="item.info.couponType == 2"
                                    :style="{color:setColor(item)}"
                                >
                                    <view class=""></view>
                                    <text class="price_int" :style="{color:setColor(item)}">{{filters.toSplit(filters.toFixNum(item.info.publishValue,1))[0]}}</text>.
                                    <text class="price_decimal">{{filters.toSplit(filters.toFixNum(item.info.publishValue,1))[1]}}</text>
                                    <text class="price_decimal">{{$L('折')}}</text>
                                </view>
                                <view class="coupon_pre_active" 
                                    :class="item.info.couponType == 2?'coupon_pre_active1 coupon_pre_active':'coupon_pre_active'" 
                                    :style="{fontSize:fitfontSize['active'][item.info.couponContent.length],color:setColor(item)}"
                                    v-if="item.info.promotionType!==405"
                                >
                                    {{item.info.couponContent}}
                                </view>
                            </view>
                        </view>
                        <view class="coupon_center_box" :class="item.info.receivedState == 3 && item.info.notUseCount==0?'coupon_center_box coupon_center_box1':'coupon_center_box'">
                            <view class="coupon_cen">
                                <view class="coupon_pre_title" v-if="item.info.promotionType!==405">{{item.info.couponName}}</view>
                                <view v-if="item.info.promotionType==402||!item.info.promotionType">
                                    <view> </view>
                                    <view class="coupon_pre_time fontScaleIgnore" v-if="item.info.publishStartTime&&item.info.publishStartTime.indexOf(':')==-1">{{item.info.publishStartTime}}~{{item.info.publishEndTime}}</view>
                                    <view class="coupon_pre_time fontScaleIgnore" >
                                        <view>{{item.info.publishStartTime}}~</view>
                                        <view>{{item.info.publishEndTime}}</view>
                                    </view>
                                </view>
                                
                                <view v-if="item.info.promotionType==406&&item.info.effectiveTimeType==1">
                                    <view class="maxDeductionValue flex_row_center_center" v-if="item.info.couponType == 2">最多优惠<text class="num-font">{{item.info.discountLimitAmount}}</text>元</view>
                                    <view class="coupon_pre_time fontScaleIgnore" v-if="item.info.effectiveStart&&item.info.effectiveStart.indexOf(':')==-1">{{item.info.effectiveStart}}~{{item.info.effectiveEnd}}</view>
                                    <view class="coupon_pre_time fontScaleIgnore" >
                                        <view>{{item.info.effectiveStart}}~</view>
                                        <view>{{item.info.effectiveEnd}}</view>
                                    </view>
                                </view>
                                <view v-if="item.info.promotionType==406&&item.info.effectiveTimeType==2">
                                    <view class="coupon_pre_time fontScaleIgnore">领取后{{item.info.cycle}}天内使用</view>
                                </view>
                                <view v-if="item.info.promotionType==405">
                                    <view class="coupon_pre_title">{{item.info.publishValue}}元运费券</view>
                                    <!-- <view class="feight_coupon_pre_rules flex_row_center_center">仅限抵扣自营商品运费</view> -->
                                    <view v-if="item.info.effectiveTimeType==1">
                                        <view class="coupon_pre_time fontScaleIgnore" v-if="item.info.effectiveStart&&item.info.effectiveStart.indexOf(':')==-1">{{maskTime(item.info.effectiveStart)}}~{{maskTime(item.info.effectiveEnd)}}</view>
                                        <view class="coupon_pre_time fontScaleIgnore" >
                                            <view>{{maskTime(item.info.effectiveStart)}}~</view>
                                            <view>{{maskTime(item.info.effectiveEnd)}}</view>
                                        </view>
                                    </view>
                                    <view class="coupon_pre_time fontScaleIgnore" v-if="item.info.effectiveTimeType==2">领取后{{item.info.cycle}}天内使用</view>
                                </view>
                                <view class="coupon_pre_rules" v-if="item.info.promotionType!=406&&item.info.promotionType!=405" @click="descriptionOpen(item.info.couponId)">
                                    <text>使用规则</text>
                                    <image :src="item.info.isOpen ? imgUrl + 'common/icon/uptriangle2@2x.png' : imgUrl + 'common/icon/btn_common_downtriangle2@2x.png'" mode=""></image>
                                </view>
                            </view>
                        </view>
                        <!-- 优惠券中间分割线 -->
                        <view class="kacao_box">
                            <view class="kacao kacao1" v-if="item.info.promotionType==402&&(item.info.receivedState !=3 || item.info.notUseCount!=0)"></view>
                            <view class="kacao kacao2" v-if="item.info.promotionType==402&&(item.info.receivedState == 3 && item.info.notUseCount==0)"></view>
                            <view class="kacao kacao3" v-if="item.info.promotionType==406" :class="{opacity4:item.info.receivedState == 3 && item.info.notUseCount==0}"></view>
                            <view class="kacao kacao4" v-if="item.info.promotionType==405" :class="{opacity4:item.info.receivedState == 3 && item.info.notUseCount==0}"></view>
                            <view class="kacaoBase"></view>
                        </view>
                        
                        <view class="coupon_right_box" 
                            :style="{background:setBackground(item)}"
                            :class="itemClass(item)"
                        >
                            <view class="prepareReceive" v-if="item.info.receivedState == 1">
                                <view class="coupon_progress">
                                    {{$L('已抢')}}{{item.info.robbedRate}}%
                                <view class="progress_con">
                                    <progress :percent="item.info.robbedRate" stroke-width="3" activeColor="#FFFFFF" backgroundColor="rgba(255,255,255,0.5)" border-radius='2px' />
                                </view>
                                </view>
                                <view class="coupon_pre_right"  @click="goReceive(item)">{{$L('待领取')}}</view>
                            </view>
                            <view class="coupon_pre_right haveNoCoupon" v-if="item.info.receivedState == 3 && item.info.notUseCount==0"></view>
                            <view class="haveReceived" v-if="item.info.receivedState == 2 || (item.info.receivedState == 3 && item.info.notUseCount!=0)">
                                <view class="coupon_pre_right coupon_pre_right2">{{$L('已领取')}}</view>
                                <view class="havenGetCoupon">
                                    <view class="goUseButton" :style="{color:setColor(item)}" @click="goGoodsList(item.info)">去使用</view>
                                </view>
                            </view>
                        </view>
                        <!-- 左上角满减券svg -->
                        <view class="coupon_type" v-if="item.info.couponType==1">满减券</view>
                        <view class="coupon_type_round" v-if="item.info.couponType==3">随机金额券</view>
                        <view class="coupon_type_dis" v-if="item.info.couponType==2">折扣券</view>
                        <view class="coupon_type_cousum" v-if="item.info.promotionType==406">消费券</view>
                        <view class="coupon_type_feight" v-if="item.info.promotionType==405">运费券</view>
                    </view>
                    <view class="coupon_rules" v-if="item.info.isOpen == true">
                        <view>优惠券类型：<text>{{item.info.storeId==0?'【平台优惠券】':'【店铺优惠券】'}}</text></view>
                        <view class="description">{{item.info.description}}</view>
                    </view>
                    <view v-if="item.coupon_show_type=='picCoupon'" class="picCoupon" @click="goCoupon(item)">
                        <img :src="item.img" >
                    </view>
                </view>
                <view class="no_more" v-if="decoItem.data[activeIndex].info.length>5">- 没有更多了 -</view>
            </view>
            <view class="no_data" v-if="disabledModule || noData">
                <view class="img"></view>
                <text>{{$L('暂无优惠券')}}</text>
            </view>
            <!-- <loadingState v-if="loadingState == 'first_loading'||couponList.length > 0" :state='loadingState' /> -->
        </view>
        <view class="my_coupon_list" :style="{backgroundImage:'url(' + decoItem.props.couponBackImage.imgInfo.img + ')',marginTop:couponListMTop}" v-else >
            
        </view>
        <view class="couponListBottom" v-if="decoItem.props.couponBottomImage.ifShowCouponBottomImage" :class="{couponListBottom_hide:isScroll}" :style="{backgroundImage:'url(' + decoItem.props.couponBottomImage.imgInfo.img + ')'}"></view>
        <!-- 吸顶的coupon_list_top -->
        <view class="coupon_list_top1" :style="{backgroundImage:'url(' + decoItem.props.couponBackTopImage.imgInfo.img + ')'}" v-show="isScroll&&decoItem.props.couponBackTopImage.ifShowCouponBackTopImage"></view>
        <!-- 吸底的couponListBottom -->
        <view class="couponListBottom1" :style="{backgroundImage:'url(' + decoItem.props.couponBottomImage.imgInfo.img + ')'}" v-show="isScroll&&decoItem.props.couponBottomImage.ifShowCouponBottomImage"></view>
    </view>
</template>
<script module="filters" lang="wxs" src="../../../utils/filter.wxs"></script>
<script>
    import loadingState from "@/components/loading/loading.vue";
    import goodsHandler from "@/components/goods/handler";
    import {getStyle,skipTo,fitFontSize} from '@/utils/common.js'
    import {reachScrollBottom} from '@/utils/scrollUtils'
    import {
        mapState,
        mapGetters
    } from 'vuex';
    export default {
        name: "deco-coupon",
        components: {
            loadingState
        },
        props: {
            // 装修数据
            decoItem: {
                type: Object,
                default: () => {}
            },
            parentScrollTop: {
                type: Number,
                default: 0
            },
            scrollContainer: {
                type: [HTMLElement, Document]
            }
        },
        data() {
            return {
                imgUrl: getApp().globalData.imgUrl,
                loadingState: 'first_loading',
                pageSize: 10,
                current: 1,
                couponList:[],    //优惠券列表
                activeIndex:0,
                categoryId:'-1',    //当前点击的nav，默认第一项
                noData:false,    //无数据
                loading: false, //是否加载数据
                hasMore: true, //是否还有数据
                rondomMod:false,    //随机弹框
                activity_open:false,
                rondomDes:{},
                couponListMTop:'',
                couponNavSTop:0,
                isScroll:false,
                handleNavShow:false,
                showMore:false,
                fitfontSize:{
                    'active':{
                        19:'22rpx',
                        20:'22rpx',
                        21:'20rpx',
                        22:'20rpx',
                    }
                },
                listSacle:'',
            };
        },
        computed: {
            ...mapState(['hasLogin', 'userInfo']),
            ...mapGetters(['disabledModule']),
            setColor(){
                return item=>{
                    let color
                    if(item.info.promotionType=='405'){
                        color = '#06c7c3'
                    }else if(item.info.promotionType=='406'){
                        color = '#ff711e'
                    }else if(item.info.promotionType=='402'||!item.info.promotionType){
                        color = '#F20C06'
                    }
                    return color
                }
            },
            setBackground(){
                return item=>{
                    let background
                    if(item.info.promotionType=='405'){
                        background = 'radial-gradient(circle at 0% 0%,#02d7d2, #00bbb7)'
                    }else if(item.info.promotionType=='406'){
                        background = 'radial-gradient(circle at 0% 0%,#ff985b, #fc6106)'
                    }else if(item.info.receivedState !=3 || item.info.notUseCount!=0){
                        background = '#FF2628'
                    }else{
                        background = '#fdc2b8'
                    }
                    return background
                }   
            },
            maskTime() {
                return (time) => {
                    let timeStr = ''
                    if (time) {
                        timeStr = time.replaceAll('-','.')
                    }
                    return timeStr
                }
            },
            itemClass(){
                return item=>{
                    let Itemclass
                    if(item.info.receivedState == 3 && item.info.notUseCount==0){
                        if(item.info.promotionType==405){
                            Itemclass = 'yunfeiquan'
                        }else if(item.info.promotionType==406){
                            Itemclass = 'xiaofeiquan'
                        }
                    }
                    return Itemclass
                } 
            }
        },
        mounted(){
            this.getAllCouponList();   
        },
        onReachBottom(){
            if(this.hasMore){
                this.getMoreData()
            }
        },
        activated(){
            this.pageScrollCtrl();
        },
        watch:{
            isScroll(val,oldVal){
                if (val != oldVal){
                    if(this.decoItem.props.tabBackImage.ifScrollTop){
                        if(val){
                            this.$refs.couponNav.$el.classList.add('fixed_nav');
                            this.$refs.couponNav.$el.style.top = window.titleBar.getShowHeight() + 'px';
                        }else{
                            this.$refs.couponNav.$el.classList.remove('fixed_nav');
                        }
                    }
                }
            },
            parentScrollTop:{
                handler(val, oldVal){
                    //不在初始化时执行，避免多次触发同一事件
                    if (oldVal != undefined){
                        this.pageScrollCtrl(val)
                    }
                },
                immediate: true
            },
            $route(to) {
                if(to.path == `/pages/topic/index?id=${this.$config.COUPON_TOPIC_ID}`) {
                    this.isScroll=false;
                }
            }
        },
        methods: {
            // 判断活动是否开启
            ifOpen(){
                let param = {}
                param.data={}
                param.data.names='coupon_is_enable'
                param.url = 'v3/system/front/setting/getSettings'
                param.method = 'GET'
                this.$request(param).then(res => {
                    if (res.state == 200) {
                        if(res.data[0]=='1'){
                            this.activity_open=true
                        }else{
                            this.activity_open=false
                        }
                    }
                })
            },
            goCoupon(item){
                skipTo(item,this)
            },
            //获取领券中心数据
            getAllCouponList(activeIndex, type="list") {
                if (this.decoItem.data.length === 0) {
                    this.noData = true
                    this.handleNavShow = true;
                    return
                }

                let couponIdList = []//优惠券的id列表
                let freightCouponIdList = []//运费券的id列表
                let consumerCouponIdList = []//消费券的id列表
                if (this.decoItem.data[this.activeIndex].info.length==0) {
                    this.handleNavShow=true;
                    this.noData=true
                    return
                }else{
                    this.decoItem.data[this.activeIndex].info.forEach((item)=>{
                        if(!item.info.promotionType||item.info.promotionType=='402'){
                            couponIdList.push(item.info.couponId)
                        }
                        if(item.info.promotionType=='405'){
                            freightCouponIdList.push(item.info.couponId)
                        }
                        if(item.info.promotionType=='406'){
                            consumerCouponIdList.push(item.info.couponId)
                        }
                    })
                }
                (type=="list" || type=="receive" ) && uni.showLoading();
                Promise.all([this.getCouponList(couponIdList),this.getFreightCouponList(freightCouponIdList),this.getConsumerCouponList(consumerCouponIdList)]).then(async([couponList,freightCouponList,consumerCouponList])=>{
                    this.couponList = couponList.concat(freightCouponList).concat(consumerCouponList)
                    if(this.couponList.length == 0){
                        this.noData = true;
                        this.handleNavShow=true;
                    }else{
                        this.noData = false;
                        this.couponList.forEach((item,index)=>{
                            item.isOpen = false;
                            let couponNumber=item.couponContent.substring(item.couponContent.indexOf("满")+1,item.couponContent.indexOf("减")).trim();
                            let couponNumber1=item.couponContent.substring(item.couponContent.indexOf("减")+1,item.couponContent.length).trim();
                            if(parseInt(couponNumber)!=NaN && parseInt(couponNumber)>=10000){
                                item.couponContent='满'+parseInt(couponNumber)/10000+'万'+item.couponContent.substring(item.couponContent.indexOf("减"),item.couponContent.length);
                                if(parseInt(couponNumber1)!=NaN && parseInt(couponNumber1)>=10000){
                                    item.couponContent='满'+parseInt(couponNumber)/10000+'万'+'减'+parseInt(couponNumber1)/10000+'万';
                                }
                            }
                        })
                        let dataList = this.decoItem.data[this.activeIndex].info
                        for(let i = dataList.length - 1; i >= 0; i--) {
                            if(dataList[i].info.couponId) {
                                if(this.couponList.some(items => items.couponId === dataList[i].info.couponId)) {
                                    this.$set(dataList[i], 'info', this.couponList.filter(items => items.couponId== dataList[i].info.couponId)[0])
                                }else{
                                    this.decoItem.data[this.activeIndex].info.splice(i, 1)
                                }
                            }
                        }
                        this.handleNavShow=true;
                        await this.$nextTick()
                        let fontDom = document.getElementsByClassName('fitFont');
                        fitFontSize(fontDom,10);
                        this.listSacle = 'scale(' + (this.$refs.my_coupon.$el.clientWidth/375)>1?(this.$refs.my_coupon.$el.clientWidth/375):1 + ')'
                    }  
                }).finally(async e=>{
                    await this.$nextTick();
                    uni.hideLoading()
                })
            },
            //获取优惠券列表
            getCouponList(list){
                return new Promise((resolve) => {
                    let param = {};
                    param.current = 1;
                    param.pageSize = 1000;
                    param.couponIds = list
                    goodsHandler.couponCenter(param).then(res => {
                        if (res.state == 200) {
                            resolve(res.data.couponList)
                        } else {
                            resolve([])
                        }
                    }).catch((e) => {
                        //异常处理
                    })
                })
                
            },
            // 获取运费券列表
            getFreightCouponList(list){
                return new Promise((resolve) => {
                    let param = {};
                    param.current = 1;
                    param.pageSize = 1000;
                    param.couponIdList = list
                    goodsHandler.getFeightCouponList(param).then(res => {
                        if (res.state == 200) {
                            resolve(res.data.list)
                        } else {
                            resolve([])
                            this.$api.msg(res.msg);
                        }
                    }).catch((e) => {
                        //异常处理
                    })
                })
            },
            // 获取消费券列表
            getConsumerCouponList(list){
                return new Promise((resolve) => {
                    let param = {};
                    param.current = 1;
                    param.pageSize = 1000;
                    param.couponIds = list.join(',')
                    goodsHandler.getConsumeCouponList(param).then(res => {
                        if (res.state == 200) {
                            resolve(res.data.couponList)
                        } else {
                            resolve([])
                        }
                    }).catch(() => {
                        //异常处理
                    })
                })
            },
            handleNav(activeIndex){
                // debugger
                if(this.activeIndex!==activeIndex){
                    this.handleNavShow=false;
                    this.isScroll = false
                    this.activeIndex=activeIndex
                    this.getAllCouponList();
                }else{
                    this.handleNavShow=true;
                    return
                }
            },
            //规则展开
            descriptionOpen(couponId){
                this.couponList.map(item=>{
                    if(item.couponId == couponId){
                        if(item.description != ''){
                            item.isOpen = !item.isOpen
                            this.$forceUpdate()
                        }
                    }
                })
            },
            //加载更多事件
            getMoreData() {
                if (this.hasMore) {
                    this.getAllCouponList();
                }
            },
            //立即领取
            goReceive(item){
                if(item.info.promotionType==405){
                    this.receiveFreight(item)
                    return
                }
                if(item.info.couponType == 3){//随机券需要拿到领取后返回的值
                    let couponId = item.info.couponId
                    let param = {
                        couponId
                    };
                    goodsHandler.receiveCoupon(param).then(res => {
                        if (res.state == 200) {
                            setTimeout(()=>{
                                uni.showToast({
                                    title: '领取成功!',
                                    icon:'none',
                                })
                            },800) 
                            if(item.info.couponType == 3){    //随机优惠券
                                this.rondomMod = true;
                                this.rondomDes = res.data;
                            }
                        } else {
                            setTimeout(()=>{
                                this.$api.msg(res.msg);
                            },800) 
                        }
                        this.getAllCouponList();
                    }).catch((e) => {
                        //异常处理
                    }).finally(()=>{
                        try {
                        const pages = getCurrentPages(); //当前页面栈
                            if (pages.length > 1) {
                                const beforePage = pages[pages.length - 2]; //获取上一个页面实例对象
                                beforePage.$vm.comeBackMyCoupon(); //触发上个面中的方法 获取优惠券列表*getCouponList为上个页面的方法*
                            }
                        } catch (error) {
                            
                        }
                    })
                }else{
                    let params = {}
                    params.couponInfoVOs=[]
                    params.couponInfoVOs.push({
                        promotionType:!!item?.info?.promotionType?item.info.promotionType:402,
                        promotionId:item?.info?.couponId
                    })
                    goodsHandler.reveiverAllCoupon(params).then(res=>{
                        if(res.state==200){
                            setTimeout(()=>{
                                uni.showToast({
                                    title: '领取成功!',
                                    icon:'none'
                                })
                            },800)
                        }else{
                            setTimeout(()=>{
                                uni.showToast({
                                    title: '领取失败!',
                                    icon:'none'
                                })
                            },800)
                        }
                        this.getAllCouponList()
                    }).catch(()=>{

                    }).finally(()=>{
                        try {
                        const pages = getCurrentPages(); //当前页面栈
                            if (pages.length > 1) {
                                const beforePage = pages[pages.length - 2]; //获取上一个页面实例对象
                                beforePage.$vm.comeBackMyCoupon(); //触发上个面中的方法 获取优惠券列表*getCouponList为上个页面的方法*
                            }
                        } catch (error) {
                            
                        }
                    })
                } 
            },
            receiveFreight(data) {
                goodsHandler.receiveFreightByCouponId({ couponId: data.info.couponId }).then(res => {
                    if(res.state==200){
                        setTimeout(()=>{
                            uni.showToast({
                                title: '领取成功!',
                                icon:'none'
                            })
                        },800)
                    }else{
                        setTimeout(()=>{
                            uni.showToast({
                                title: '领取失败!',
                                icon:'none'
                            })
                        },800)
                    }
                    this.getAllCouponList()
                }).finally(()=>{
                    try {
                    const pages = getCurrentPages(); //当前页面栈
                        if (pages.length > 1) {
                            const beforePage = pages[pages.length - 2]; //获取上一个页面实例对象
                            beforePage.$vm.comeBackMyCoupon(); //触发上个面中的方法 获取优惠券列表*getCouponList为上个页面的方法*
                        }
                    } catch (error) {
                        
                    }
                })
            },
            //优惠券，运费券去使用跳转
            goGoodsList(item){
               if(item.promotionType==406){//消费券跳转
                    this.$Router.push({
                        path: '/pages/coupon/myCoupon',
                        query: {
                            activeIndex:2
                        }
                    })
               }else if(item.promotionType==405){//运费券跳转
                    if(item.linkInfo!=null){
                        let skipUrl={};
                        try{
                            skipUrl=JSON.parse(item.linkInfo);
                            skipTo(skipUrl,this);
                        }catch(error){
                            this.$Router.push({
                                path: '/pages/index/index',
                            })
                        }
                    }else{
                        this.$Router.push({
                            path: '/pages/index/index',
                        })
                    }  
               }else{
                    if(item.linkInfo!=null){
                        let skipUrl={};
                        try{
                            skipUrl=JSON.parse(item.linkInfo);
                            skipTo(skipUrl,this);
                        }catch(error){
                            this.gotoDefaultList(item);
                        }
                    }else{
                        this.gotoDefaultList(item);
                    }  
               }
                 
            },
            gotoDefaultList(item){
                if (item.receivedState == 2 || (item.receivedState == 3 && item.notUseCount!=0)) {
                        let params = {}
                        if (item.storeId > 0) {
                            params.storeId=item.storeId
                        }

                        if (item.useType == 2 && item.skus) { //指定商品 跳转到活动商品列表页面
                            params.skus = item.skus;

                
                            this.$Router.push({
                                path: '/pages/activity/activity',
                                query: {
                                    source: 'coupon',
                                    ...params
                                }
                            })
                            return 
                            
                        } else if (item.useType == 3 && item.couponCategoryVO) { //指定分类 跳转到商品列表页面
                            params.categoryIds = item.couponCategoryVO.categoryId
                        }

                        this.$Router.push({
                            path: '/standard/product/list',
                            query: {
                                source: 'coupon',
                                ...params
                            }
                        })
                    }
            },
            //关闭领取随机优惠券弹框
            close(){
                this.rondomMod = false;
            },
            //去我的优惠券列表页面
            goMyCoupon(){
                this.$Router.push('/pages/coupon/myCoupon')
            },
            /**
             * 获取页面滚动对于页面元素的控制
             * 
            */
            pageScrollCtrl(){
                let domTop = this.$refs.couponNavWarp.$el.offsetTop - window.titleBar.getShowHeight();
                //如果滚动条滚到底了，parentScrollTop会变小，此时也应是isScroll保持不变
                if(this.isScroll && reachScrollBottom(this.scrollContainer)){
                    return;
                }
                if(domTop>0&&this.parentScrollTop>=(domTop)){
                    this.isScroll=true;
                }else{
                    this.isScroll=false;
                }
            },
        },

    }
</script>

<style lang="scss">
    .no_more{
        height: 60rpx;
        text-align: center;
        color: #999;
        font-size: 28rpx;
        padding-bottom: calc(40rpx + var(--safe-area-inset-bottom));
    }
    .maxDeductionValue {
        width: fit-content;
        height: 32rpx;
        margin-top: 8rpx;
        padding: 0 10rpx;
        font-size: 20rpx;
        color: #ff711e;
        border: 1px solid #ff711e;
        border-radius: 6rpx;
    }
    .my_coupon{
        width: 100%;
        margin: 0 auto;
        overflow-x: hidden;
        // margin-top: calc(-1*var(--titleBarFillHeight));
        background-repeat: no-repeat;
        background-position: top;
        // background: url('@/static/shared/coupon/img_msc_youhuiquan1.png') no-repeat top;
        background-size: 100% auto;
        .random_coupon.hide{
            display: none;
        }
        .random_coupon{
            display: flex;
            justify-content: center;
            padding-top: 250rpx;
            .random_coupon_bg{
                width: 598rpx;
                height: 804rpx;
                background-size: 100% 100%;
                padding-top: 330rpx;
                display: flex;
                flex-direction: column;
                align-items: center;
                position: relative;
                .random_coupon_price{
                    font-size: 68rpx;
                    font-family: PangMenZhengDao;
                    font-weight: 400;
                    color: #D41E04;
                }
                .random_coupon_des{
                    font-size: 30rpx;
                    font-family: Source Han Sans CN;
                    font-weight: 400;
                    color: #E52308;
                    line-height: 34rpx;
                }
                .close_btn{
                    position: absolute;
                    right: 10rpx;
                    top: 22rpx;
                    z-index: 20;
                    width: 57rpx;
                    height: 57rpx;
                    background-size: 100% 100%;
                }
            }
        }
        .titleBarBg{
            width: 750rpx;
            height: var(--titleBarHeight);
            position: fixed;
            top: 0;
            background: #D90000;
            padding-top: var(--statusHeight);
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 36rpx;
            color: #fff;
            z-index: 999;
        }
        .my_coupon_nav_warp{
            width: 100%;
            height: 88rpx;
        }
        .fixed_nav{
            max-width: var(--page-width);
            position: fixed;
            // top: var(--titleBarFillHeight);
            left: auto;
            right: auto;
            width: 100%;
            z-index: 900;
        }
        .my_coupon_nav{
            display: flex;
            flex-wrap: nowrap;
            align-items: center;
            justify-content: center;
            width: 100%;
            height: 88rpx;
            padding:0rpx 30rpx;
            // margin-top:496rpx;
            background-repeat: no-repeat;
            background-position: center;
            // background: url('@/static/shared/coupon/img_msc_youhuiquan8.png') no-repeat top;
            background-size: 100% 100%;
            .my_coupon_nav_pre_wrap{
                height: 88rpx;
                display: flex;
                flex-wrap: nowrap;
                align-items: center;
                overflow-x: auto;
                .my_coupon_nav_pre{
                    font-size: 30rpx;
                    
                    font-weight: 500;
                    color: #222222;
                    height: 60rpx;
                    line-height: 56rpx;
                    margin-right: 48rpx;
                    min-width: max-content;
                    &.line {
                        // background-image: var(--axtiveLine);
                        background-image: url('@/static/shared/common/icon/icon_common_line.svg');
                    }
                    &:last-child{
                        margin-right: 0rpx;
                    }
                }
                .active{
                    font-size: 34rpx;
                    
                    font-weight: bold;
                    position: relative;
                    // background-image: url('@/static/shared/common/icon/icon_common_line.svg');
                    background-size: 40rpx 8rpx;
                    background-repeat: no-repeat;
                    background-position: center bottom;
                }
            }
        }
        // .navfixed{
        //     position: fixed;
        //     background-color: #D90000;
        //     height: calc(635rpx - 525rpx);
        //     z-index: 900;
        // }
        .coupon_list_top{
            width: 750rpx;
            height: 64rpx;
            // background-image: url('@/static/shared/coupon/img_msc_youhuiquan7.png');
            background-position: center;
            background-repeat: no-repeat;
            background-size: 100% 100%;
        }
        .coupon_list_top1{
            width: 750rpx;
            height: 64rpx;
            // background-image: url('@/static/shared/coupon/img_msc_youhuiquan7.png');
            background-position: center;
            background-repeat: no-repeat;
            background-size: 100% 100%;
            position: fixed;
            top:calc(var(--titleBarHeight) + 145rpx);
            z-index: 10;
            margin-top: 0;
        }
        .my_coupon_list{
            width: 750rpx;
            // background-image: url('@/static/shared/coupon/img_msc_youhuiquan2.png');
            background-size: 100% 100%;
            background-position: center;
            background-repeat: no-repeat;
            min-height:calc(100vh - 508rpx);
            transform-origin: left top;
            .coupon_item_box{
                text-align: center;
                position: relative;
                padding: 0 30rpx 30rpx;
                .coupon_item{
                    width:100%;
                    min-height: 190rpx;
                    border-radius: 16rpx;
                    overflow: hidden;
                    background-size: 100% 100%;
                    display: flex;
                    align-items: stretch;
                    position: relative;
                    // background-color: #fff;
                    .coupon_left_box{
                        width:190rpx;
                        min-height: 190rpx;
                        background-color: #fff;
                        display: flex;
                        align-items: center;
                        // &.coupon_left_box1{
                        //     opacity: 0.4;
                        // }
                        .coupon_left,.coupon_left.fontScaleIgnore{
                        width:190rpx;
                        padding: 0 10rpx;
                        margin-top: 26rpx;
                        display: flex;
                        flex-direction: column;
                        white-space: nowrap;
                        justify-content: center;
                        align-items: center;
                        .coupon_pre_price{
                            font-size: 32rpx;
                            font-weight: normal;
                            line-height: 31rpx;
                            color: #F20C06;
                            width: fit-content;
                            .price_int{
                                font-size: 64rpx;
                                font-weight: normal;
                                color: #F30801;
                                line-height: 31rpx;
                            }
                        }
                        .coupon_pre_active{
                            font-size: 26rpx;
                            font-family: Source Han Sans CN;
                            font-weight: 400;
                            color: #F6130E;
                            line-height: 31rpx;
                            margin-top: 22rpx;
                            width: fit-content;
                            white-space: normal;
                            &.coupon_pre_active1{
                                font-size: 22rpx;
                            }
                        }
                    }
                    
                    }
                    .coupon_center_box{
                        flex: 1;
                        min-height: 190rpx;
                        background-color: #fff;
                        text-align: left;
                        display: flex;
                        align-items: center;
                        padding-right: 13rpx;
                        // &.coupon_center_box1{
                        //     opacity: 0.4;
                        // }
                        .coupon_cen{
                        display: felx;
                        flex-direction: column;
                        padding-top: 10rpx;
                        .coupon_pre_title{
                            font-size: 28rpx;
                            
                            font-weight: bold;
                            color: #222;
                            line-height: 130%;
                            // max-height: 80rpx;
                            // min-height: 40rpx;
                            text-overflow: -o-ellipsis-lastline;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            display: -webkit-box;
                            -webkit-line-clamp: 2;
                            line-clamp: 2;
                            word-break: break-all;
                            -webkit-box-orient: vertical;
                            
                        }
                        .coupon_pre_time,.coupon_pre_time.fontScaleIgnore{
                            font-size: 24rpx;
                            
                            font-weight: 500;
                            color: #222222;
                            line-height: 34rpx;
                            margin: 14rpx 0 6rpx;
                            text-align: left;
                        }
                        .coupon_pre_rules{
                            display: flex;
                            align-items: center;
                            margin-bottom: 10rpx;
                            text{
                                font-size: 22rpx;
                                
                                font-weight: 500;
                                color: #222;
                                line-height: 31rpx;
                            }
                            image{
                                margin-top: 2rpx;
                                width: 24rpx;
                                height: 24rpx;
                                margin-left: 9rpx;
                            }
                        }
                    }
                    }
                    .coupon_right_box{
                        width: 164rpx;
                        min-height: 190rpx;   
                        display: flex;
                        flex-direction: column;
                        justify-content: space-between;
                        align-items: center;
                        padding: 24rpx 12rpx 20rpx 0;
                        position: relative;
                        &.coupon_right_box1{
                            background-color:#fdc2b8;
                        }
                        &.xiaofeiquan {
                            background: #ffffff radial-gradient(circle at 0% 0%,rgba(255,152,91,0.4), rgba(252,97,6,0.4)) !important;
                        }
                        &.yunfeiquan {
                            background: #ffffff radial-gradient(circle at 0% 0%,rgba(2,215,210,0.4), rgba(0,187,183,0.4)) !important;
                        }
                        .haveReceived{
                            height: 100%;
                            display: flex;
                            flex-direction: column;
                            justify-content: space-between;
                            align-items:center;
                        }
                        .coupon_pre_right{
                            width: 160rpx;
                            box-sizing: border-box;
                            font-size: 28rpx;
                            font-family: Source Han Sans CN;
                            font-weight: 600;
                            color: #FFFFFF;
                            text-align: center;
                            &.coupon_pre_right2{
                                font-size: 28rpx;
                                font-weight: 400;
                            }
                            &.haveNoCoupon{
                                height: 100%;
                                background: url('@/static/shared/coupon/icon_yhq_yiqiangwan _w.svg') center no-repeat;
                                background-size: 160rpx 160rpx;
                            }
                        }
                        .havenGetCoupon{
                            width: 128rpx;
                            .goUseButton{
                                line-height: 48rpx;
                                width: 128rpx;
                                height: 48rpx;
                                background: #fff;
                                border-radius: 24rpx;
                                font-size: 28rpx;
                                font-weight: 600;
                                color: #f30300;
                            }
                        }
                    }
                    
                }
                .kacao_box {
                    position: relative;
                    width: 24rpx;
                    min-height: 190rpx;
                }
                .kacao{
                    width: 24rpx;
                    min-height: 190rpx;
                    position: absolute;
                    left: 0;
                    top: 0;
                    z-index: 2;
                    background-size: 100% 100%;
                    background-repeat: no-repeat;
                    &.kacao1{
                        background-image: url('@/static/shared/coupon/bg_yhq_xuxian1.1.png');
                    }
                    &.kacao2{
                        background-image: url('@/static/shared/coupon/bg_yhq_xuxian3.2.png');
                    }
                    &.kacao3{
                        background-image: url('@/static/shared/coupon/bg_yhq_xiaofeiquan.png');
                    }
                    &.kacao4{
                        background-image: url('@/static/shared/coupon/bg_yhq_yunfeiquan.png');
                    }
                    &.opacity4 {
                        opacity: 0.4;
                    }
                }
                .kacaoBase {
                    width: 24rpx;
                    min-height: 190rpx;
                    position: absolute;
                    left: 0;
                    top: 0;
                    z-index: 2;
                    z-index: 1;
                    width: 24rpx;
                    min-height: 190rpx;
                    background-size: 100% 100%;
                    background-repeat: no-repeat;
                    background-image: url('@/static/shared/coupon/bg_yhq_xuxian0.png');
                }
                .coupon_rules{
                    width: 692rpx;
                    padding: 22rpx 24rpx;
                    box-sizing: border-box;
                    font-size: 24rpx;
                    
                    font-weight: 500;
                    color: #666666;
                    line-height: 30rpx;
                    margin-top:-6rpx;
                    background: #f7f7f7;
                    border-top: 1rpx solid #f2f2f2;
                    border-radius: 0 0 16rpx 16rpx;
                    text-align: left;
                    .description{
                        margin-top: 16rpx;
                    }
                    text{
                        color: #222;
                    }
                }
                .coupon_type{
                    text-align: center;
                    position: absolute;
                    font-weight: 500;
                    top: 0;
                    left: 0;
                    width: 124rpx;
                    height: 36rpx;
                    line-height:36rpx ;
                    background: #ffe8e8;
                    border-radius: 16rpx 0 20rpx 0;
                    color: #F30300;
                    font-size: 20rpx;
                }
                .coupon_type_round{
                    text-align: center;
                    position: absolute;
                    font-weight: 500;
                    top: 0;
                    left: 0;
                    width: 124rpx;
                    height: 36rpx;
                    line-height:36rpx ;
                    background: #ffefe2;
                    border-radius: 16rpx 0 20rpx 0;
                    color: #fe8224;
                    font-size: 20rpx;
                }
                .coupon_type_cousum{
                    text-align: center;
                    position: absolute;
                    font-weight: 500;
                    top: 0;
                    left: 0;
                    width: 124rpx;
                    height: 36rpx;
                    line-height:36rpx ;
                    background: #FFE3D4;
                    border-radius: 16rpx 0 20rpx 0;
                    color: #eb5700;
                    font-size: 20rpx;
                }
                .coupon_type_feight{
                    text-align: center;
                    position: absolute;
                    font-weight: 500;
                    top: 0;
                    left: 0;
                    width: 124rpx;
                    height: 36rpx;
                    line-height:36rpx ;
                    border-radius: 16rpx 0 20rpx 0;
                    font-size: 20rpx;
                    color: #06c7c3;
                    background: #d4ffff;
                }
                .coupon_type_dis{
                    text-align: center;
                    position: absolute;
                    font-weight: 500;
                    top: 0;
                    left: 0;
                    width: 124rpx;
                    height: 36rpx;
                    line-height:36rpx ;
                    background: #e8edff;
                    border-radius: 16rpx 0 20rpx 0;
                    color: #2455fe;
                    font-size: 20rpx;
                }
                .coupon_progress{
                    width: 160rpx;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    font-size: 26rpx;
                    font-family: Source Han Sans CN;
                    font-weight: 400;
                    color: #FFFFFF;
                    line-height: 31rpx;
                    padding-bottom: 50rpx;
                    .progress_con{
                        width: 104rpx;
                        margin-top: 12rpx;
                        border-radius: 5rpx;
                        progress{
                            border-radius: 5rpx;
                            overflow: hidden;
                        }
                    }
                }
            }
            .no_more_data{
                height: 20rpx;
                line-height: 20rpx;
            }
        }
        .couponListBottom{
            width:750rpx;
            height: 40rpx;
            // background-image: url('@/static/shared/coupon/img_msc_youhuiquan3.png');
            background-size: 100% 100%;
            background-position: center;
            background-repeat: no-repeat;
            opacity: 1;
            &.couponListBottom_hide{
                opacity: 0;
            }
        }
        .couponListBottom1{
            width:750rpx;
            height: 40rpx;
            // background-image: url('@/static/shared/coupon/img_msc_youhuiquan3.png');
            background-size: 100% 100%;
            background-position: center;
            background-repeat: no-repeat;
            position: fixed;
            bottom: 0;
            z-index: 9;
        }
        .picCoupon{
            display: flex;
            justify-content: space-around;
            align-items: center;
        }
        .no_data{
            display: flex;
            flex-direction: column;
            align-items: center;
            padding-top: calc((100vh - 508rpx - var(--titleBarFillHeight, 0px)) * 0.32 - 128rpx);
            // height:calc(100vh - 508rpx);
            .img {
                width: 256rpx;
                height: 256rpx;
                opacity: 0.8;
                // background: var(--couponEmptyImg2);
                background: url('@/static/shared/empty/icon_defpage_zwyhq.png') center no-repeat;
                background-size: 100% 100%;
            }
            text{
                font-size: 28rpx;
                
                font-weight: 400;
                color: $main-third-color;
            }
            .go_coupon_center{
                width: 160rpx;
                height: 54rpx;
                background: #F5EAEA;
                border-radius: 27rpx;
                font-size: 28rpx;
                
                font-weight: 500;
                color: #EF242F;
                text-align: center;
                line-height: 54rpx;
            }
        }
    }
    .feight_coupon_pre_rules {
        width: 222rpx;
        height: 32rpx;
        margin:12rpx 0 0 0;
        font-size: 20rpx;
        font-weight: bold;
        border-radius: 6rpx;
        overflow: hidden;
        color: #f4211b;
        border: 1px solid #ff0000;
    }
</style>
