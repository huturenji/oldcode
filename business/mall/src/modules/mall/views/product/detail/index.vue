<template>
    <div class="top">
        <div>
            <!-- 顶部的banner滚动图片  -->
            <div class="banner">
                <swiperComp :list="bannerList" :swiperOptipns="swiperOptipns"></swiperComp>
            </div>


            <!-- 活动进行中商品价格模块显示的样式 -->
            <template v-if="activityGoingOn">
                <component :is="goodsDetailsObj.marketingCard" :goodsDetailsObj="goodsDetailsObj"  @cutDownEnded="cutDownEnded" @showJdPop="showJdPop"></component>
            </template>

            <!-- 活动预热阶段商品价格模块显示的样式 -->
            <template v-else-if="activityPreheat">
                <preheatPrice :goodsDetailsObj="goodsDetailsObj" @showJdPop="showJdPop"/>
            </template>

            <!-- 默认显示的商品价格模块 -->
            <div v-else class="price"> 
                <div>
                    <priceLabel :amount='goodsDetailsObj.price'/>
                </div>
            </div>
            



            <!-- 商品名称和编号相关dom -->
            <div class="goods-des" :class="{activityGoingOn: activityGoingOn}">
                <div class="good-name can-select">{{goodsDetailsObj.name}}</div>
                <div class="good-code">
                    <span>商品编号：{{goodsDetailsObj.sku}}</span>
                    <div class="btns">
                        <div v-if="showMoreGoodsBtn" class="btn-more-goods" @click="gotoIndex">更多商品</div>
                        <div class="btn-share" @click="gotoShareThrottle" v-if="!isguest">分享</div>
                    </div>
                </div>
            </div>

            <!-- 赠品和附件相关的dom -->
            <div class="good-gift">
                <!-- 赠品 -->
                <div v-if="showDiscount" class="good-gift-choose">
                    <span class="title">优惠</span>
                    <div class="right-content">
                        <!-- 赠品 -->
                        <div @click="showGiftOrAttachmentList('gift')" class="content" v-if="!!giftList && giftList.length > 0">
                            <span class="symble"><symbolGift name="赠品"/></span>
                            <span class="name">{{giftList[0].name}}</span>
                            <span class="right_icon"><Icon type='icon_common_rightarrow' size='.24'></Icon></span>
                        </div>
                        <!-- 附件 -->
                        <div @click="showGiftOrAttachmentList('attachment')" class="content" v-if="!!attachmentList && attachmentList.length > 0">
                            <span class="symble"><symbolGift name="附件"/></span>
                            <span class="name">{{attachmentList[0].name}}</span>
                            <span class="right_icon"><Icon type='icon_common_rightarrow' size='.24'></Icon></span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 商品的选择和送至 -->
            <div class="goods-choose-address">
                <div class="good-choose" @click="showGoodsModelFun">
                    <span class="title">选择</span>
                    <!-- //下面的逗号分隔符改成中文符号，保持与spec效果一致。 -->
                    <span v-if="!!productSpec.spec" class="content">{{productSpec.spec || ''}}，{{goodsNum}}{{goodsDetailsObj.saleUnit || defaultUnit}}</span>
                    <span v-else class="content formate-placeholder">请选择商品规格</span>
                    <span v-if="!isguest">
                        <Icon type='icon_common_rightarrow' size='.24'></Icon>
                    </span>
                </div>
                <div class="good-address" @click="showAddressChooseGoods=true" v-if="!isguest">
                    <p class="title">送至</p>
                    <div class="right-content">
                            <div class="address-des">
                                <p class="address-name">
                                    <span v-if="!!choosedAddress.fullAddress2" class="address-content">{{choosedAddress.fullAddress2}}</span>
                                    <span v-else class="address-placeholder">请选择收货地址</span>
                                </p>
                                <Icon type='icon_common_rightarrow' size='.24'></Icon>
                            </div>
                            
                    </div>
                    
                </div>
                <!-- 当存在库存的时候展示该信息 -->
                <div v-if="showStockText" class="stock_tips">
                    <span>{{stockText}}</span>
                    <template v-if="!!promiseTime">
                        <i>, </i>
                        <span v-html="promiseTime"></span>
                    </template>
                </div> 
            </div>

            <!-- 服务模块 -->
            <!-- <div class="goods-service">
                <p class="title">服务</p>
                <ul class="des">
                    <li>
                        <Icon type='correct_service' size=".26"/>
                        <span v-if="!!goodsDetailsObj.factoryShip" class="service_text">厂商发货配送</span>
                        <span v-else class="service_text">由<span>{{supplierName}}</span>发货，并提供售后服务</span>
                    </li>
                    <li>
                        <Icon type='icon_common_prompt_red' size=".26"/>
                        <span class="service_text"><span>{{supplierName}}</span>企业购非商品质量问题，不支持退货</span>
                    </li>
                </ul>
            </div> -->

            <!-- 最新版的服务模块 -->
            <div class="goods-service-tips">
                <ul class="tips_content">
                    <li>
                        <Icon type='correct_service' size=".26"/>
                        <span v-if="!!goodsDetailsObj.factoryShip" class="service_text">厂商发货配送</span>
                        <span v-else class="service_text">由<span>{{supplierName}}</span>发货，并提供售后服务</span>
                    </li>
                    <li>
                        <Icon type='icon_common_prompt' size=".26"/>
                        <span class="service_text">不支持7天无理由退货</span>
                    </li>
                </ul>
            </div>

        </div>
		<!-- 商品销售属性选择界面 -->
        <div v-transfer-dom v-if="!isguest">
            <popup v-model="showGoodsModel" height='75%'>
                <GoodsModel
                    v-if='showGoodsModel'
                    :goodsDetailsObj='goodsDetailsObj'
                    :productSpecList="productSpecList"
                    :goodsNum="goodsNum"
                    :hasStock="hasStock"
                    :stopSales="stopSales"
                    :areaRestrict="areaRestrict"
                    :activityGoingOn="activityGoingOn"
                    @changegoodsNumIndex="changegoodsNumIndex"
                    @changeSkuIndex="changeSkuIndex"
                    @addCart='addCart($event)'
                    @closePopup='closeDetailModel'
                    @toOrderConfirm='toOrderConfirm'
                />
            </popup>
        </div>

		<!-- 商品赠品显示的弹窗 -->
        <div v-transfer-dom v-if="!isguest">
            <popup v-model="showGiftPop" height='75%' class="giftPop">
                <giftPop
                    :list="giftPopList"
                    :type="giftPopType"
                    @closePopup='closeGiftPop'
                />
            </popup>
        </div>

        <!-- 选择地址信息弹窗部分 -->
        <div v-transfer-dom class="addressPopupBox" v-if="!isguest">
            <popup v-model="showAddressChooseGoods" class="editAddress" height='100%' width="100%" position="right" :popup-style={zIndex:1001}>
                <addressComp ref="addressComp" v-model="choosedAddress" :showCheck="true" addressType="productIndex" @closeAddressList="closeAddressList" @saveSuccess='saveSuccess'></addressComp>
            </popup>
        </div>

        <!--分享-->
        <div v-transfer-dom v-if="!isguest">
            <popup v-model="showSharePopup" position="bottom" height="auto" width="100%" class="radiusTop">
                <share @close="showSharePopup=false" :shareOptions="shareOptions"></share>
            </popup>
        </div> 

        <!--内嵌京东页面的弹窗-->
        <div v-transfer-dom>
            <template v-if="showJdPagePop">
                <div class="mask"></div> 
                <div class="pop_wrap">
                    <supplierDetailPage :sku="goodsDetailsObj.sku"/>
                    <Icon class='icon-btn' type='icon_common_close_white'  @click.native="showJdPagePop=false" size='.6'/>
                </div>
            </template> 
        </div> 
    </div>
</template>
<script>
import {SnIcon} from 'sinosun-ui';
import {ProductActivityStatus} from 'common/lib/enum/productStatusEnum';
import { Popup, TransferDom, XDialog } from 'vux';
import addressComp from 'commonComp/address/address.vue';
const Icon = ()=>import('common/components/base/Icon.vue');
const swiperComp = ()=>import('common/components/swiper/swiperComp.vue');
const priceLabel = ()=>import('common/components/base/priceLabel.vue');
const share = ()=>import('common/components/share')
const employee = ()=>import('common/components/employee')
import GoodsModel from './components/GoodsModel.vue';
import giftPop from './components/giftPop.vue';
import symbolGift from 'common/components/base/symbolGift.vue';
import preheatPrice from './components/preheatPrice.vue';
import supplierDetailPage from './components/supplierDetailPage.vue';
import extendUtils from 'common/lib/utils';
import shareHandler from 'common/lib/requestHandler/shareHandler.js';
import goodsHandler from 'common/lib/requestHandler/goodsHandler.js';
import AddCartAnimation from 'common/lib/animation/addCart.js';
import tChatEventMixin from 'common/lib/mixin/tChatEventMixin';
import Bus from 'common/lib/bus/bus.js';
export default {
    name: 'goodsDetailsIndex',
    directives: {
        TransferDom
    },
    mixins: [tChatEventMixin],
    components: {
      priceLabel,
      Popup,
      XDialog,
      GoodsModel,
      swiperComp,
      Icon,
      SnIcon,
      addressComp,
      symbolGift,
      giftPop,
      share,
      employee,
      preheatPrice,
      supplierDetailPage
    },
    props:{
        //传递的商品详情
        goodsDetailsObj:{
            type: Object,
            required: true,
        },
		//商品销售属性
		productSpec:{
            type: Object,
            default:()=>{spec:''},
		},
		//商品销售属性列表
		productSpecList:{
            type: Array,
            default:()=>[],
		},
		//商品数量
		goodsNum:{
			type: [Number, String],
			default:1,
        },
        //是否有库存 true=有 false=无
        hasStock:{
            type:Boolean,
            default:true
        },
        //是否区域限售 true=有 false=无
        areaRestrict:{
            type:Boolean,
            default:false
        },
        //是否上下架 true=下架 false=上架
        stopSales:{
            type:Boolean,
            default:false
        },
        stockText:{
            type:String,
            default:''
        },

        //预计到达时间
        promiseTime:{
            type:String,
            default:''
        },
        //是否是游客
        isguest:{
            type:Boolean,
            default:false
        },
    },
    data(){
      let that = this;
      return Object.assign(extendUtils.stateManager.setData([
                {
                    name: 'showAddressChooseGoods', //选择地址的弹窗控制变量
                    show:{
                        callback(){
                            document.title = '地址管理'
                        }
                    },
                    hide:{
                        callback(){
                            document.title = '商品详情'
                        }
                    }
                },
                {
                    name:'showGoodsModel',//商品类型弹窗
                },
                {
                    name:'showGiftPop',//商品赠品的弹窗
                },
                {
                    name:'showSharePopup'//分享购物清单
                }
      ],this), {
        choosedAddress: {},//显示的choosedAddress对象
        swiperOptipns: { //swiper的配置
          from:'detail', //该参数用来配置是哪里来的swiper配置 detail代表是商品详情的
          // 如果需要分页器
          pagination : '.swiper-pagination',
          paginationType : 'fraction',
          autoplay:2000, //自动轮播事件间隔
        },
		sku: this.$route.query.sku,//商品id
        defaultUnit:'个',//默认单位个
        supplierName:'',
        giftPopList: [], //赠品和附件显示list的弹窗
        giftPopType: '', //区分是赠品还是附件
        shareOptions:{},//分享所需的参数
        isPC: extendUtils.isPC(),
        showJdPagePop: false, //是否显示京东详情页的配置
      })
    },
    computed: {
        //传递给swiper的滚动对象数组
        bannerList(){
            return !!this.goodsDetailsObj.imagePathList && this.goodsDetailsObj.imagePathList.map(item => {
                return {
                    imgUrl: (item.startsWith('http://')||item.startsWith('https://')) ? item : (this.BMallConfig.IMG_PREFIX_MAIN + item) 
                }
            });
        },
        //显示有无货相关的文字
        showStockText(){
            return !!this.stockText && !this.areaRestrict && this.hasStock && !this.stopSales;
        },

        //赠品相关的list
        giftList(){
            return !!this.goodsDetailsObj && this.goodsDetailsObj.giftList;
        },

        //附件相关的list
        attachmentList(){
            return !!this.goodsDetailsObj && this.goodsDetailsObj.attachmentList;
        },

        //是否显示优惠栏
        showDiscount(){
            return (!!this.giftList && !!this.giftList.length > 0) || (!!this.attachmentList && !!this.attachmentList.length > 0);
        },

        // 该商品是否在预热阶段
        activityPreheat(){
            try {
                return  ProductActivityStatus[this.goodsDetailsObj.marketingState].isPreheat;
            } catch (error) {
                return false;
            }
        },

        // 该商品是否正在进行中
        activityGoingOn(){
            try {      
                return ProductActivityStatus[this.goodsDetailsObj.marketingState].isGoingOn;
            } catch (error) {
                return false;
            }
        },

        //是否显示更多商品的按钮
        showMoreGoodsBtn(){
            try {      
                return !!this.activityGoingOn;
            } catch (error) {
                return false;
            }
        }
    },
    watch:{
        choosedAddress:{
            handler(val){
                this.$emit('addressChange', val);
            },
            deep:true,
            immediate:true
        },
        showJdPagePop(val){
            this.$emit('pageNoScroll', val)
        }
    },
    created(){
        Bus.$on('showGoodsModel', ()=>{
            this.showGoodsModel = true;
        })
        //初始化供应商的名字
        this.supplierName = this.BMallConfig.SUPPLIER_Map[goodsHandler.supplierId].name;
    },
    mounted(){

    },
    methods: {
        /*****
         * 显示选择规则界面
         */
        showGoodsModelFun(){
            //游客不能选择规格
            if(!!this.isguest){
                return;
            }            
            this.showGoodsModel = true;
        },

        /*****
         * 显示商品赠品或者附件的弹窗
         */
        showGiftOrAttachmentList(type){
            if(!!type&&type == 'gift'){//点击的赠品
                this.giftPopList = this.giftList;
            }else if(!!type&&type == 'attachment'){//点击的附件
                this.giftPopList = this.attachmentList;
            }
            this.giftPopType = type;
            this.showGiftPop = true;
        },
        
        /****
         * 活动倒计时结束后执行的回调
         */
        cutDownEnded(){
            this.$emit('cutDownEnded')
        },

        /*****
         * 选择完地址关闭弹窗
         */
        closeAddressList(){
            this.closeAddressPopup();
        },

        /*****
         * 关闭地址选择信息弹窗
         */
        closeAddressPopup(){
            this.showAddressChooseGoods = false;
        },
        /**
         * 加入购物车
         */
        addCart($event){
            let that = this;
			let goods = [{
				"sku": this.goodsDetailsObj.sku,
				"supplierId": this.goodsDetailsObj.supplierId,
				"quantity": this.goodsNum,
				"name": this.goodsDetailsObj.name,
				"specification": JSON.stringify(this.productSpec) || '',
				"imageUrl": this.goodsDetailsObj.imagePath,
				"jdCardCategoryId3": this.goodsDetailsObj.categoryId3 || '', //商品的三级分类，该字段目前用来判断实体礼品卡不能加入购物车的
            }]
            //加入购物车的方法在全局混入里面globalMixin.js
            that.setIntoShopCar(goods).then(flag => {
                if(!!flag){ //加入购物车接口返回成功后，再执行动画
                    that.showGoodsModel = false;
                    that.$nextTick(()=>{
                        let dom = that.createGoodThumb(that.bannerList[0].imgUrl);
                        //延迟开始动画
                        setTimeout(async ()=>{
                            let cartDom = document.getElementById('detailFooterCart');
                            let config = {target: dom, clone: false,zoomType:'linear'};
                            //创建动画对象
                            let animation = new AddCartAnimation(cartDom);
                            //1.闪烁
                            await animation.twinkleAnimation(dom);
                            //2. 抛物线运动
                            await animation.start($event, config);
                            //3. 购物车抖动
                            await animation.shakeAnimation(cartDom);
                            //4. +1动画
                            let text = '+' + that.goodsNum;
                            await animation.addNumShow(cartDom, text);
                        }, 100);
                    })
                }
            }).catch(e => {
                console.error('加入购物车失败====',e);
            });
            

          
        },

        /**
         * 创建一个用于动画的dom
         */
        createGoodThumb(url){
            let dom = document.createElement('img');
            dom.src = url;
            dom.style.width = '1.1rem';
            dom.style.height = '1.1rem';
            dom.style.borderRadius = '0.8rem';
            dom.style.position = 'absolute';
            dom.style.left = 'calc(50% - .4rem)';
            dom.style.top = 'calc(15% - .4rem)';
            dom.style.backgroundColor = '#fff';
            dom.style.zIndex = '999';
            return document.body.appendChild(dom);
        },

        // 显示京东价格的弹窗
        showJdPop(){    
            this.showJdPagePop = true;
        },

        /**
         * 点击查看更多商品跳转到首页
         */ 
        gotoIndex(){
            this.$router.push({
                path: '/home'
            })
        },

        /**
         * 关闭商品型号选择的弹窗
         */
        closeDetailModel(){
            this.showGoodsModel = false;
        },

        /**
         * 关闭商品赠品的弹窗
         */
        closeGiftPop(){
            this.showGiftPop = false;
        },
        /**
         * 分享节流阀
         */
        gotoShareThrottle(){
            let that = this;
            extendUtils.throttle(function() {
                that.gotoShare();
            }.bind(that));
        },
        /**
         * 分享商品详情
         */
		async gotoShare(){
            let that = this;
            if(!!!that.goodsDetailsObj.imagePath){ return } //等图片有值了之后，才能去分享
            let location = window.location;
            let callBackUrl = location.origin + location.pathname + "#/product/detail?channelId="+(goodsHandler.channelId||this.$route.query.channelId||'')+"&pageFrom=share&sku=" + that.goodsDetailsObj.sku+'&supplierId='+that.goodsDetailsObj.supplierId;
            let appInfo = {};
            try {
                appInfo = await shareHandler.getAppConfig();
            } catch (error) {
            }
            let appId = appInfo.appId || 0;
            let appName = that.BMallConfig.SUPPLIER_Map[goodsHandler.supplierId].name+'企业购';
			let shareData = {
                title : that.goodsDetailsObj.name, // 分享标题          
                desc : '我在'+appName+'发现不错的商品，点击查看', // 分享描述           
                link : callBackUrl, // 分享链接          
                imgUrl : that.goodsDetailsObj.imagePath || '', // 分享图标,图片绝对地址  
                appId: appId+'',//小应用Id
                appName: appInfo.appName || appName || '企业购',//小应用名字,无合法appId时使用appName
                contentType : 'link', // 分享类型,music、video或link，不填默认为link
            }
            that.shareOptions = shareData;
            that.showSharePopup = true;
        },
        /**
         * T信回退事件的注册回调 必须是goBackFun
         */
        goBackFun(){
            // let serviceIframe = document.getElementById('zc__sdk__container');
            // let height = extendUtils.getStyle(serviceIframe, 'height');
            // console.log('height', height);

            // //可以拿到当前聊天窗体的状态 expand展开 collapse收起
            // zc('frame_status', function(data) {
            //     console.log(data, 456);
            // })


            // if(parseInt(height) > 0){
            //     serviceIframe.style.height = "0px";
            // }else{
                if(!!this.$route.query.pageFrom && ('share' == this.$route.query.pageFrom || 'customerService' == this.$route.query.pageFrom)){ //分享页面或者客服页面进入的此时回退页面
                    extendUtils.goBackPage('');
                    return
                }else{
                    this.$router.back();
                    return
                }
                //防止极限情况下页面无法回退
                extendUtils.goBackPage('');
            // }

        },
		/**
		 * 修改商品数量
		 */
		changegoodsNumIndex(value){
			this.$emit('changegoodsNumPage',value)
		},
		/**
		 * 修改商品id
		 */
		changeSkuIndex(value){
			this.$emit('changeSkuPage',value)
		},
		/**
		 * 提交订单
		 */
		toOrderConfirm(){
			this.$emit('toOrderConfirm')
		}
    }
}
</script>
<style scoped lang="less">
 @import '~themes/default/styles/product/detail/index.less';
.vux-popup-dialog.giftPop{
  background-color: #fff;
}

</style>
