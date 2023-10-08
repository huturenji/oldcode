<!-- 领券中心 -->
<template>
    <view class="my_coupon" :style="[styles]" ref="my_coupon">
        <w-loading ref="loading"></w-loading>
        <!-- 随机优惠券 start -->
        <view :class="{'hide':!rondomMod,'random_coupon':true}" style="position: fixed;width: 750rpx;height:100vh;background:rgba(0,0,0,0.6);z-index: 1000;top:0">
            <view class="random_coupon_bg" :style="{backgroundImage:'url(https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/coupon/random_bg.png)'}" @click="goMyCoupon()">
                <view class="random_coupon_price">￥{{rondomDes.publishValue}}</view>
                <view class="random_coupon_des">{{rondomDes.couponContent}}</view>
                <view class="close_btn" :style="{backgroundImage:'url(https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/common/icon/close_screen.png)'}" @click.stop="close"></view>
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
        <view class="my_coupon_list" :style="{backgroundImage:'url(' + decoItem.props.couponBackImage.imgInfo.img + ')',marginTop:couponListMTop}" v-if="handleNavShow" >
            <view v-if="!noData">
                <view class="coupon_item_box" v-for="(item,index) in decoItem.data[activeIndex].info" :key="index">
                    <view class="coupon_item" v-if="item.coupon_show_type!=='picCoupon'">
                        <view class="coupon_left_box" :class="item.info.receivedState == 3 && item.info.notUseCount==0?'coupon_left_box coupon_left_box1':'coupon_left_box'">
                            <view class="coupon_left fontScaleIgnore">
                                <view
                                    v-if="(item.info.couponType != 2)&&(item.info.couponType != 3)"
                                    class="coupon_pre_price num-font" 
                                    :class="[{ 'orange': item.info.promotionType==406, 'blue': item.info.promotionType==405 }]"
                                >
                                    <text class="unit" :style="{fontSize:fitfontSize['small'][getPartNumber(item.info.publishValue,'int').toString().length]}">¥ </text>
                                    <text class="price_int" :style="{fontSize:getFontSize(item.info.publishValue)}">{{getPartNumber(item.info.publishValue,'int')}}</text>
                                    <text class="price_decimal" v-if="getPartNumber(item.info.publishValue,'decimal')!='.00'" :style="{fontSize:fitfontSize['small'][getPartNumber(item.info.publishValue,'int').toString().length]}">{{getPartNumber(item.info.publishValue,'decimal')}}</text>
                                </view>
                                <view class="coupon_pre_price num-font" v-if="item.info.couponType == 3" :style="{fontSize:getRandomSmallFontSize(item)}">
                                    <text class="unit">¥ </text>
                                    <text class="price_int" :style="{fontSize:getRandomFontSize(item)}">{{getPartNumber(item.info.randomMin,'int')}}</text>
                                    <text class="price_decimal" v-if="getPartNumber(item.info.randomMin,'decimal')!='.00'">{{getPartNumber(item.info.randomMin,'decimal')}}</text>
                                    <text class="unit">~</text>
                                    <text class="unit">¥ </text>
                                    <text class="price_int" :style="{fontSize:getRandomFontSize(item)}">{{getPartNumber(item.info.randomMax,'int')}}</text>
                                    <text class="price_decimal" v-if="getPartNumber(item.info.randomMax,'decimal')!='.00'">{{getPartNumber(item.info.randomMax,'decimal')}}</text>
                                </view>
                                <view 
                                    v-if="item.info.couponType == 2"
                                    class="coupon_pre_price"
                                    :class="[{ 'orange': item.info.promotionType==406, 'blue': item.info.promotionType==405 }]"
                                >
                                    <view class=""></view>
                                    <text class="price_int">{{filters.toSplit(filters.toFixNum(item.info.publishValue,1))[0]}}</text>.
                                    <text class="price_decimal">{{filters.toSplit(filters.toFixNum(item.info.publishValue,1))[1]}}</text>
                                    <text class="price_decimal">折</text>
                                </view>
                                <view
                                    v-if="item.info.promotionType !== 405"
                                    class="coupon_pre_active"
                                    :class="item.info.couponType == 2?'coupon_pre_active1 coupon_pre_active':''" 
                                    :style="{fontSize:fitfontSize['active'][item.info.couponContent.length]}"
                                >
                                    {{item.info.couponContent}}
                                </view>
                            </view>
                        </view>
                        <view class="coupon_center_box" :class="item.info.receivedState == 3 && item.info.notUseCount==0?'coupon_center_box coupon_center_box1':'coupon_center_box'">
                            <view class="coupon_cen">
                                <view class="coupon_pre_title">{{item.info.couponName}}</view>
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
                                    <view v-if="item.info.couponType == 1">
                                        <view class="coupon_pre_time fontScaleIgnore" v-if="item.info.effectiveStart&&item.info.effectiveStart.indexOf(':')==-1">{{item.info.effectiveStart}}~{{item.info.effectiveEnd}}</view>
                                        <view class="coupon_pre_time fontScaleIgnore" >
                                            <view>{{item.info.effectiveStart}}~</view>
                                            <view>{{item.info.effectiveEnd}}</view>
                                        </view>
                                    </view>
                                </view>
                                <!-- 运费券相关信息 -->
                                <view v-if="item.info.promotionType==405">
                                    <!-- <view class="freight_tag">仅限抵扣自营商品运费</view> -->
                                    <view class="coupon_pre_time fontScaleIgnore" v-if="item.info.effectiveTimeType === 2">领取后{{ item.info.cycle }}天内</view>
                                    <view v-if="item.info.effectiveTimeType == 1">
                                        <view class="coupon_pre_time fontScaleIgnore" v-if="item.info.effectiveStart&&item.info.effectiveStart.indexOf(':')==-1">{{maskTime(item.info.effectiveStart)}}~{{maskTime(item.info.effectiveEnd)}}</view>
                                        <view class="coupon_pre_time fontScaleIgnore" v-else-if="item.info.effectiveTimeType === 1 && item.info.effectiveStart && item.info.effectiveEnd">
                                            <view>{{maskTime(item.info.effectiveStart)}}~</view>
                                            <view>{{maskTime(item.info.effectiveEnd)}}</view>
                                        </view>
                                    </view>
                                </view>
                                <view v-if="item.info.promotionType==406&&item.info.effectiveTimeType==2">
                                    <view class="coupon_pre_time fontScaleIgnore">领取后{{item.info.cycle}}天内使用</view>
                                </view>
                                <view class="coupon_pre_rules" v-if="item.info.promotionType!=406&&item.info.promotionType!=405" @click="descriptionOpen(item.info.couponId)">
                                    <text>使用规则</text>
                                    <image :src="item.info.isOpen ? upTriangleImage : downTriangleImage" mode=""></image>
                                </view>
                            </view>
                        </view>
                        <!-- 优惠券中间分割线 -->
                        <view class="kacao_box">
                            <view class="kacao kacao1" v-if="item.info.promotionType==402&&(item.info.receivedState !=3 || item.info.notUseCount!=0)"></view>
                            <view class="kacao kacao2" v-if="item.info.promotionType==402&&(item.info.receivedState == 3 && item.info.notUseCount==0)"></view>
                            <view class="kacao kacao3" v-if="item.info.promotionType==406" :class="{opacity4:item.info.receivedState == 3 && item.info.notUseCount==0}"></view>
                            <view class="kacao kacao4" :class="{ opacity: item.info.receivedState == 3 && item.info.notUseCount==0 }" v-if="item.info.promotionType==405"></view>
                            <view class="kacaoBase"></view>
                        </view>
                        <view class="coupon_right_box" 
                            :class="[{
                                'opacity4': item.info.promotionType==406 && item.info.receivedState == 3 && item.info.notUseCount==0,
                                'blue': item.info.promotionType==405,
                                'blue1': item.info.promotionType==405 && item.info.receivedState == 3 && item.info.notUseCount==0,
                                'orange': item.info.promotionType==406,
                                'red': item.info.promotionType!==406 && item.info.promotionType!=405 && (item.info.receivedState !=3 || item.info.notUseCount!=0),
                                'pink': item.info.promotionType!==406 && item.info.promotionType!=405 && !(item.info.receivedState !=3 || item.info.notUseCount!=0)
                            }]"
                        >
                            <view class="prepareReceive" v-if="item.info.receivedState == 1">
                                <view class="coupon_progress">
                                    已抢{{item.info.robbedRate}}%
                                <view class="progress_con">
                                    <progress :percent="item.info.robbedRate" stroke-width="3" activeColor="#FFFFFF" backgroundColor="rgba(255,255,255,0.5)" border-radius='2px' />
                                </view>
                                </view>
                                <view class="coupon_pre_right"  @click="goReceive(item)">待领取</view>
                            </view>
                            <view class="coupon_pre_right haveNoCoupon" v-if="item.info.receivedState == 3 && item.info.notUseCount==0"></view>
                            <view class="haveReceived" v-if="item.info.receivedState == 2 || (item.info.receivedState == 3 && item.info.notUseCount!=0)">
                                <view class="coupon_pre_right coupon_pre_right2">已领取</view>
                                <view class="havenGetCoupon">
                                    <view class="goUseButton" :class="[{ 'orange': item.info.promotionType==406, 'blue': item.info.promotionType==405 }]" @click="goGoodsList(item.info)">去使用</view>
                                </view>
                            </view>
                        </view>
                        <!-- 左上角满减券svg -->
                        <view class="coupon_type" v-if="item.info.couponType==100">满减券</view>
                        <view class="coupon_type_round" v-if="item.info.couponType==3">随机金额券</view>
                        <view class="coupon_type_dis" v-if="item.info.couponType==2">折扣券</view>
                        <view class="coupon_type_cousum" v-if="item.info.promotionType==406">消费券</view>
                        <view class="coupon_type_blue" v-if="item.info.promotionType==405">运费券</view>
                    </view>
                    <view class="coupon_rules" v-if="item.info.isOpen == true">
                        <view>优惠券类型：<text>{{item.info.storeId==0?'【平台优惠券】':'【店铺优惠券】'}}</text></view>
                        <view class="description">{{item.info.description}}</view>
                    </view>
                    <view v-if="item.coupon_show_type=='picCoupon'" class="picCoupon" @click="goCoupon(item)">
                        <image :src="item.img" />
                    </view>
                </view>
                <view class="no_more" v-if="decoItem.data[activeIndex].info.length>5">- 没有更多了 -</view>
            </view>
            <view class="no_data" v-if="noData">
                <view class="img"></view>
                <text>暂无优惠券</text>
            </view>
            <!-- <loadingState v-if="loadingState == 'first_loading'||couponList.length > 0" :state='loadingState' /> -->
        </view>
        <view class="my_coupon_list" :style="{backgroundImage:'url(' + decoItem.props.couponBackImage.imgInfo.img + ')',marginTop:couponListMTop}" v-else >
            
        </view>
        <view class="couponListBottom" v-if="decoItem.props.couponBottomImage.ifShowCouponBottomImage" :class="{couponListBottom_hide:isScroll}" :style="{backgroundImage:'url(' + decoItem.props.couponBottomImage.imgInfo.img + ')'}"></view>
       
    </view>
</template>
<script module="filters" lang="wxs" src="@/utils/filter.wxs"></script>
<script>
    import loadingState from "@/common/components/loading/loading.vue";
    import goodsHandler from "@/views/components/goods/handler";
    import { skipTo, getPartNumber } from '@/utils/common.js'
    import config from '@/common/lib/config.js';
    import mixin from "@/common/components/decorate/common/mixin/index";

    export default {
        name: "deco-coupon",
        mixins: [mixin],
        components: {
            loadingState
        },
        props: {
            // 装修数据
            decoItem: {
                type: Object,
                default: () => {}
            }
        },
        data() {
            return {
                upTriangleImage: 'https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/common/icon/uptriangle2%402x.png',
                downTriangleImage: 'https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/common/icon/btn_common_downtriangle2%402x.png',
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
                handleNavShow:false,
                showMore:false,
                fitfontSize:{
                    'active':{19:'22rpx',20:'22rpx',21:'20rpx',22:'20rpx'},
                    'big':{1:'64rpx',2:'64rpx',3:'64rpx',4:'52rpx',5:'44rpx',6:'36rpx',7:'32rpx',8:'28rpx'},
                    'small':{1:'32rpx',2:'32rpx',3:'32rpx',4:'28rpx',5:'26rpx',6:'24rpx',7:'24rpx',8:'24rpx'},
                    'bigInt':{1:'64rpx',2:'64rpx',3:'64rpx',4:'64rpx',5:'56rpx',6:'48rpx',7:'40rpx',8:'34rpx'},
                    'bigRandom':{1:'64rpx',2:'50rpx',3:'40rpx',4:'30rpx',5:'24rpx',6:'22rpx',7:'22rpx',8:'22rpx'},
                    'smallRandom':{1:'24rpx',2:'24rpx',3:'24rpx',4:'24rpx',5:'24rpx',6:'20rpx',7:'20rpx',8:'20rpx'},
                    'smallRandomInt':{1:'32rpx',2:'32rpx',3:'32rpx',4:'28rpx',5:'24rpx',6:'24rpx',7:'24rpx',8:'24rpx'},
                    'bigRandomInt':{1:'64rpx',2:'64rpx',3:'64rpx',4:'52rpx',5:'40rpx',6:'34rpx',7:'30rpx',8:'28rpx'},
                    'bigRandomInt2':{1:'64rpx',2:'64rpx',3:'46rpx',4:'36rpx',5:'32rpx',6:'26rpx',7:'26rpx',8:'24rpx'}
                },
                getPartNumber,
            };
        },
        computed: {
            // 计算普通金额的字号大小
            getFontSize() {
                return (value) => {
                    let size = '64rpx'
                    let intLength = getPartNumber(value,'int').toString().length
                    if (getPartNumber(value,'decimal')!='.00') {
                        size = this.fitfontSize['big'][intLength]
                    } else {
                        size = this.fitfontSize['bigInt'][intLength]
                    }
                    return size
                }
            },
            // 计算随机金额Int的字号大小
            getRandomFontSize() {
                return (item) => {
                    let size = '64rpx'
                    let intLength = 1
                    if (item?.info?.randomMin && item?.info?.randomMax) {
                        intLength = getPartNumber(item.info.randomMin,'int').toString().length + getPartNumber(item.info.randomMax,'int').toString().length
                    }
                    if (getPartNumber(item.info.randomMin,'decimal')!='.00' && getPartNumber(item.info.randomMax,'decimal')!='.00') {
                        size = this.fitfontSize['bigRandom'][intLength]
                    } else if (getPartNumber(item.info.randomMin,'decimal')=='.00' && getPartNumber(item.info.randomMax,'decimal')=='.00') {
                        size = this.fitfontSize['bigRandomInt'][intLength]
                    } else {
                        size = this.fitfontSize['bigRandomInt2'][intLength]
                    }
                    
                    return size
                }
            },
            // 计算随机金额Decimal的字号大小
            getRandomSmallFontSize() {
                return (item) => {
                    let size = '32rpx'
                    let intLength = 1
                    if (item?.info?.randomMin && item?.info?.randomMax) {
                        intLength = getPartNumber(item.info.randomMin,'int').toString().length + getPartNumber(item.info.randomMax,'int').toString().length
                    }
                    if (getPartNumber(item.info.randomMin,'decimal')!='.00' && getPartNumber(item.info.randomMax,'decimal')!='.00') {
                        size = this.fitfontSize['smallRandom'][intLength]
                    } else {
                        size = this.fitfontSize['smallRandomInt'][intLength]
                    }
                    return size
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
        },
        watch:{
          
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
                (type=="list" || type=="receive" ) && this.$refs?.loading?.open();
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
                       
                    }  
                }).finally(async e=>{
                    await this.$nextTick();
                    this.$refs?.loading?.close();
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
                    goodsHandler.freightCouponCenter(param).then(res => {
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
                    // 待适配消费券
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
                if(this.activeIndex!==activeIndex){
                    this.handleNavShow=false;
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
                if (item.info.promotionType == 405) {
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
                    }).finally(() => {
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

                    }).finally(() => {
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
            // 领取运费券
            receiveFreight(data) {
                goodsHandler.receiveFreightByCouponId({ couponId: data.info.couponId })
                    .then(res => {
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
                    })
                    .finally(() => {
                        const pages = getCurrentPages(); //当前页面栈
                        if (pages.length > 1) {
                            const beforePage = pages[pages.length - 2]; //获取上一个页面实例对象
                            beforePage.$vm.comeBackMyCoupon(); //触发上个面中的方法 获取优惠券列表*getCouponList为上个页面的方法*
                        }
                    })
            },
            //优惠券，消费券去使用跳转
            goGoodsList(item){
               if(item.promotionType==406){//消费券跳转
                    this.$Router.push({
                        path: '/views/coupon/myCoupon',
                        query: {
                            activeIndex:2
                        }
                    })
               } else if(item.promotionType==405){//运费券跳转
                    if(item.linkInfo!=null){
                        let tempLinkInfo = item.linkInfo.replace(/wx_url/g,"url");
                        let skipUrl={};
                        try{
                            skipUrl=JSON.parse(tempLinkInfo);
                            skipTo(skipUrl,this);
                        }catch(error){
                            uni.switchTab({
                                url: '/pages/index/index'
                            })
                        }
                    }else{
                        uni.switchTab({
                            url: '/pages/index/index'
                        })
                    }
               } else {
                    if(item.linkInfo!=null){
                        let tempLinkInfo = item.linkInfo.replace(/wx_url/g,"url");
                        let skipUrl={};
                        try{
                            skipUrl=JSON.parse(tempLinkInfo);
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
                        if (item.useType == 2 && item.skus) { ////指定商品 跳转到活动商品列表页面
                            params.skus = item.skus;
                            this.$Router.push({
                                path: '/views/coupon/list/index',
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
                            path: '/views/goods/list/index',
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
        background-repeat: no-repeat;
        background-position: top;
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
            background-size: 100% 100%;
            .my_coupon_nav_pre_wrap{
                height: 88rpx;
                display: flex;
                flex-wrap: nowrap;
                align-items: center;
                overflow-x: auto;
                .my_coupon_nav_pre{
                    font-size: 30rpx;
                    font-family: PingFang SC;
                    font-weight: 500;
                    color: #222222;
                    height: 60rpx;
                    line-height: 56rpx;
                    margin-right: 48rpx;
                    min-width: max-content;
                    &.line {
                        background-image: url('https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/coupon/icon_common_line.svg');
                    }
                    &:last-child{
                        margin-right: 0rpx;
                    }
                }
                .active{
                    font-size: 34rpx;
                    font-family: PingFang SC;
                    font-weight: bold;
                    position: relative;
                    background-size: 40rpx 8rpx;
                    background-repeat: no-repeat;
                    background-position: center bottom;
                }
            }
        }

        .coupon_list_top{
            width: 750rpx;
            height: 64rpx;
            background-position: center;
            background-repeat: no-repeat;
            background-size: 100% 100%;
        }
        .coupon_list_top1{
            width: 750rpx;
            height: 64rpx;
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
                            line-height: 31rpx;
                            color: #F20C06;
                            width: fit-content;

                            &.orange {
                                color: #ff711e;

                                .price_int{
                                    color: #ff711e;
                                }
                            }

                            &.blue {
                                color: #04d0cc;

                                .price_int{
                                    color: #04d0cc;
                                }
                            }

                            .price_int{
                                font-size: 64rpx;
                                font-weight: bold;
                                color: #F20C06;
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
              
                        .coupon_cen{
                        display: felx;
                        flex-direction: column;
                        padding-top: 10rpx;
                        .coupon_pre_title{
                            font-size: 32rpx;
                            font-family: PingFang SC;
                            font-weight: bold;
                            color: #111111;
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
                            font-family: PingFangSC, PingFangSC-Regular;
                            font-weight: 500;
                            color: #222222;
                            line-height: 34rpx;
                            margin: 14rpx 0 6rpx;
                            text-align: left;
                        }
                        .freight_tag {
                            font-size: 20rpx;
                            color: #ff0000;
                            height: 34rpx;
                            padding: 0 8rpx;
                            border: 2rpx solid rgba(255, 0, 0, 0.6);
                            margin: 6rpx 0;
                            border-radius: 4rpx;
                            display: inline-flex;
                            align-items: center;
                            justify-content: center;
                        }
                        .coupon_pre_rules{
                            display: flex;
                            align-items: center;
                            margin-bottom: 10rpx;
                            text{
                                font-size: 22rpx;
                                font-family: PingFang SC;
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
                        &.orange {
                            background: radial-gradient(circle at 0% 0%,#ff985b, #fc6106);
                        }
                        &.red {
                            background-color:#FF2628;
                        }
                        &.pink {
                            background-color:#fdc2b8;
                        }
                        &.blue {
                            background: radial-gradient(circle at 0% 0%,#02d7d2, #00bbb7);
                        }
                        &.blue1 {
                            background: #ffffff radial-gradient(circle at 0% 0%,rgba(2,215,210,0.4), rgba(0,187,183,0.4)) !important;
                        }
                        &.opacity4 {
                            background: #ffffff radial-gradient(circle at 0% 0%,rgba(255,152,91,0.4), rgba(252,97,6,0.4)) !important;
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
                                background: url('https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/coupon/yiqiangwan.png') center no-repeat;
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

                                &.orange {
                                    color: #ff711e;
                                }

                                &.blue {
                                    color: #04d0cc;
                                }
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
                        background-image: url('https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/coupon/bg_yhq_xuxian1.1.png');
                    }
                    &.kacao2{
                        background-image: url('https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/coupon/bg_yhq_xuxian3.2.png');
                    }
                    &.kacao3{
                        background-image: url('https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/coupon/bg_yhq_xiaofeiquan.png');
                    }
                    &.kacao4{
                        background-image: url('https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/coupon/bg_yhq_xuxian4.png');

                        &.opacity {
                            opacity: 0.4;
                        }
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
                    background-image: url('https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/common/icon/bg_yhq_xuxian0.png');
                }
                .coupon_rules{
                    width: 692rpx;
                    padding: 22rpx 24rpx;
                    box-sizing: border-box;
                    font-size: 24rpx;
                    font-family: PingFang SC;
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
                .coupon_type_blue{
                    text-align: center;
                    position: absolute;
                    font-weight: 500;
                    top: 0;
                    left: 0;
                    width: 124rpx;
                    height: 36rpx;
                    line-height:36rpx ;
                    background: #d3ffff;
                    border-radius: 16rpx 0 20rpx 0;
                    color: #04d0cc;
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
            padding-top: 250rpx;
            .img {
                width: 256rpx;
                height: 256rpx;
                opacity: 0.8;
                background: url('https://bbnjstaticba-sinosun.oss-cn-hangzhou.aliyuncs.com/Ba04ZWJgWx/miniProgram/empty/icon_defpage_zwyhq.png') center no-repeat;
                background-size: 100% 100%;
            }
            text{
                font-size: 28rpx;
                font-family: PingFangSC, PingFangSC-Regular;
                font-weight: 400;
                color: $main-third-color;
            }
            .go_coupon_center{
                width: 160rpx;
                height: 54rpx;
                background: #F5EAEA;
                border-radius: 27rpx;
                font-size: 28rpx;
                font-family: PingFang SC;
                font-weight: 500;
                color: #EF242F;
                text-align: center;
                line-height: 54rpx;
            }
        }
    }
</style>
