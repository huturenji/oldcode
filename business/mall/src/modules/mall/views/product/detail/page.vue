<template>
    <div class="detail-container">
        <template v-if="!notInPool">
            <div class='scroll-content full-screen' :class="{lockScrollY: isLockScroll}" ref='scrollContent'>
                <div ref='goodsIndex'>
                    <index 
                        ref="pageIndex"
                        :goodsDetailsObj="goodsDetailsObj" 
                        :productSpec="productSpec" 
                        :productSpecList="productSpecList" 
                        :goodsNum="goodsNum" 
                        :hasStock="hasStock"
                        :areaRestrict="areaRestrict"
                        :stockText="stockText"
                        :stopSales="stopSales"
                        :promiseTime="promiseTime"
                        :isguest="isguest"
                        @changegoodsNumPage="changegoodsNumPage" 
                        @changeSkuPage="changeSkuPage"
                        @cutDownEnded="getGoodesDetails"
                        @toOrderConfirm="toOrderConfirm"
                        @addressChange="addressChange"
                        @pageNoScroll="pageNoScroll"
                    />
                </div>
                <description 
                    :goodsDetailsObj="goodsDetailsObj" 
                    :descNavFixed='descNavFixed' 
                    @fixedDes='fixedDes'
                />
                <!-- 底部的导航组件 -->
                <div v-transfer-dom v-if="!isguest">
                    <DetailFooterComp 
                        ref="detailFooterComp"
                        :goodsDetailsObj="goodsDetailsObj" 
                        :stopSales="stopSales"
                        :hasStock="hasStock"
                        :areaRestrict="areaRestrict"
                        @toOrderConfirm="toOrderConfirm"
                    />
                </div>  
            </div>
        </template>

        <template v-else>
            <emptyPage tips="商品已过期或不存在" emptyImg="GOODS_NOPOOR" />
        </template>

    </div>
</template>
<script>
import {Swiper, SwiperItem } from 'vux';
import goodsHandler from 'common/lib/requestHandler/goodsHandler.js';
import activityHandler from 'common/lib/requestHandler/activityHandler.js';
import orderHandler from 'common/lib/requestHandler/orderHandler.js';
import shareHandler from 'common/lib/requestHandler/shareHandler.js';
const emptyPage = ()=>import('common/components/base/emptyPage.vue');
const DetailFooterComp = ()=>import('./components/DetailFooterComp.vue');
const description = ()=>import('./description.vue');
import index from './index.vue';
import tChatEventMixin from 'common/lib/mixin/tChatEventMixin';
import extendUtils from 'common/lib/utils';
import {ProductStatus, ProductStockStatus} from 'common/lib/enum/productStatusEnum';
import { SnModal } from 'sinosun-ui';
export default {
    name: 'goodsDetailPage',
    mixins: [tChatEventMixin],
    components: {
        DetailFooterComp,
        index,
        description,
        emptyPage
    },
    data(){
        return {
            descNavFixed: false,//详情的菜单是否固定在顶部
            curComponent: 'index',
            sku: this.$route.query.sku || '', //商品编号，根据商品编号去查询商品的详情
            goodsDetailsObj: {}, //商品详情对象
			productSpec:{},//商品销售属性
			productSpecList:[],//商品销售属性列表
            goodsNum:1,//商品数量
            addressObj: {}, //选择的地址对象
            provinceCode: '', //省份编码
            cityCode: '', //城市编码
            districtCode: '', //县区编码
            townCode: '', //乡镇编码
            stopSales: false, //该变量用来判断该商品是否已下架
            hasStock: true, //该变量用来判断该商品是否有库存
            notInPool: false, //该变量用来判断该商品是否在商品池
            areaRestrict: false, //该变量用来判断该商品是区域限售
            stockText:'', //有货的时候显示的有货提示文字
            productStatusMap: ProductStatus,//商品上下架状态
            promiseTime:'', //查询的预计送达时间
            giftList: null, //赠品的list
            attachmentList: null, //附件的list
            isguest:true,//是否是游客身份
            isLockScroll: false,
        }
    },
    async created(){
        this.isguest = 'guest' == extendUtils.getGuestIdentity();
        //获取商品详情
        this.getGoodesDetails();
    },
    mounted(){
        this.$refs.scrollContent && this.$refs.scrollContent.addEventListener('scroll', this.onScroll);
    },
    watch: {
        /**
         * 监听地址的变化，目前是为了更新库存的接口 获取商品的库存数量
         */
        addressObj:{
            handler(newVal, oldVal){
                if(!!newVal && Object.keys(newVal).length > 0){
                    if(!!newVal.areaCode && newVal.areaCode.split('/').length > 0){
                        let areaCodeArr = newVal.areaCode.split('/');
                        this.provinceCode = areaCodeArr[0] || '',
                        this.cityCode = areaCodeArr[1] || '',
                        this.districtCode = areaCodeArr[2] || '',
                        this.townCode = areaCodeArr[3] || '' 

                        this.$nextTick(()=>{
                            Object.keys(oldVal).length > 0 && !!this.sku && this.getlistUnitPrice(this.sku); //更新地址后重新查询商品相关的信息，有可能价格等属性会有变化(目前是苏宁的价格会变)                      
                            Object.keys(oldVal).length > 0 && !!this.sku && !this.stopSales&& this.updateAllMsg(); //地址变化后查询该商品的相关其他信息
                        })
                    }
                }
            },
            deep: true,
            immediate:true
        },

        /**
         * 监听商品数量的变化，目前是为了更新有无库存的接口 获取商品的库存数量
         */
        goodsNum:{
            handler(newVal, oldVal){
                if(!!newVal && !this.stopSales){ //当商品为上架状态时才查商品的相关的信息
                    this.updateAllMsg();
                }
            },
            deep: true
        }
    },
    beforeRouteLeave(to,from,next){
        shareHandler.cancelBizmateShare();
        next()
    },
    methods: {
        //当地址变更或者商品数量变更，或者商品规格变更（sku变更）的时候需要更新的相关数据 目前包括 库存/区域先手/预计送达时间/赠品和附件相关
        updateAllMsg(){
            this.getlistStock(); //查询该商品的库存
            this.checkAreaLimit(); //查询该商品是否区域限售
            this.getPromiseTime(); //查询该商品预计到达时间
            this.getGoodsGift(); //查询该商品赠品和附件相关的信息
        },

         //打开新增地址弹窗
        gotoAddress(){
            this.$refs['pageIndex'].gotoAddress();
        },

        // 页面是否能够滑动，目前用的地方是，展示京东页面的iframe弹窗的时候，底部的页面应该不能滑动，关闭弹窗的时候，页面可以滑动
        pageNoScroll(val){
            this.isLockScroll = val;
        },
        /**
         * 根据商品编号去查询商品的详情
         */
        getGoodesDetails(){
            const that = this;
            
            let param = {
                channelId: goodsHandler.channelId,
                sku: [this.sku], 
                supplierId: goodsHandler.supplierId
                // queryExts: 'nappintroduction'//在移动端展示
            }
            if(!!that.$route.query.cityId){
                param = Object.assign({}, param, {
                    cityId: that.$route.query.cityId
                })
            }
            that.$loading.show();
            goodsHandler.getProductDetail(param).then(res=>{
                that.$loading.hide();
                if(res.resultCode == 0 && res.result){
                    this.goodsDetailsObj = res.result.detail[0];
                    // 更新变量notInPool 该变量用来判断该商品是否在商品池
                    that.notInPool = !!this.goodsDetailsObj.notInPool; 
                    if(!!that.notInPool){return}
                    
                    // 更新变量stopSales 该变量用来判断该商品是否已下架
                    that.stopSales = this.productStatusMap[this.goodsDetailsObj.state].stopSales;

                 
                    
                    //当商品是上架状态时，才能查询商品的相关状态
                    if(!that.stopSales){
                        that.updateAllMsg();                       
                    }
                    
                    //获取该商品活动详情（是否有参加活动，如果有参加活动，获取活动的相关信息）
                    that.listProductMarketing(this.sku);

					//获取商品销售详情
                    that.getProductSpec(this.sku);
                    //获取商品销售价格
                    that.getlistUnitPrice(this.sku);
                    //获取商品销售列表
                    that.getProductSpecList(this.sku);
                    //设置第三方分享信息
                    that.setThirdShare();
                }
            }).catch(e=>{ 
                that.$loading.hide();
                that.showPage = true;
                console.log(e);
                
            })
        },
        
		/**
         * setThirdShare
         */
		setThirdShare(){
            let that = this;
            //设置第三方（微信、朋友圈等）分享信息
            let location = window.location;
            let callBackUrl = location.origin + location.pathname + "#/product/detail?channelId="+(goodsHandler.channelId||this.$route.query.channelId||'')+"&pageFrom=share&sku=" + that.goodsDetailsObj.sku+'&supplierId='+that.goodsDetailsObj.supplierId;
            let appName = that.BMallConfig.SUPPLIER_Map[goodsHandler.supplierId].name+'企业购';
            let shareInfo = {
                title:that.goodsDetailsObj.name, // 分享标题 
                desc:'我在'+appName+'发现不错的商品，点击查看', // 分享描述   
                link:callBackUrl, // 分享链接  
                imgUrl:that.goodsDetailsObj.imagePath || '', // 分享图标,图片绝对地址 
            }
            //设置二次分享
            shareHandler.setThirdShareInfo(shareInfo);
                       
        },

		/**
         * 获取商品销售属性
		 * @param {str} sku 商品id
         */
		getProductSpec(sku){
			let that = this;
			let param = {
                sku: sku+'', 
                supplierId:goodsHandler.supplierId
            }
            goodsHandler.getProductSpec(param).then(res=>{
                if(res.resultCode == 0 && res.result){
                    that.productSpec = res.result.spec[0] || {};
                }
            }).catch(e=>{ 
                console.log(e);
            })	
            
			
        },


        /**
         * 根据商品编号和渠道id去查询商品的活动信息
         */
        listProductMarketing(){
            const that = this;
            let param = {
                channelId: activityHandler.channelId,
                skuList:[this.sku]
            }
            activityHandler.listProductMarketing(param).then(res=>{
                if(res.resultCode == 0 && res.result && res.result.list && res.result.list.length>0){
                    that.$set(that.goodsDetailsObj, 'promotionalPrice', res.result.list[0].promotionalPrice); //更新商品的活动价
                    that.$set(that.goodsDetailsObj, 'marketingCard', res.result.list[0].marketingCard); //更新商品的展示的卡片
                    that.$set(that.goodsDetailsObj, 'marketingState', res.result.list[0].marketingState); //更新商品的活动状态
                    that.$set(that.goodsDetailsObj, 'marketingStartTime', res.result.list[0].marketingStartTime); //活动开始时间
                    that.$set(that.goodsDetailsObj, 'marketingEndTime', res.result.list[0].marketingEndTime); //活动结束时间 
                    that.$set(that.goodsDetailsObj, 'marketingShowTime', res.result.list[0].marketingShowTime); //活动展示时间
                    that.$set(that.goodsDetailsObj, 'limitNum', res.result.list[0].limitNum); //限售数量
                    that.$set(that.goodsDetailsObj, 'supplierPrice', res.result.list[0].supplierPrice); //更新商品的供应商价格 默认用导入的
                    that.getSupplierPrice();//查询供应商价格
                }
            }).catch(e=>{
              console.log(e);
            })
        },

        

        /**
         * 根据商品编号查询商品供应商价格（现阶段该价格是指京东价）
         */
        getSupplierPrice(){
            const that = this;
            let param = {
                skuList: [this.sku]
            }
            goodsHandler.getSupplierPrices(param).then(res=>{
                if(res.resultCode == 0 && res.result && res.result.length>0 && res.result[0].price>0){
                    that.$set(that.goodsDetailsObj, 'supplierPrice', res.result[0].price); //更新商品的供应商价格
                }
            }).catch(e=>{
              console.log(e);
            })
        },


        /**
         * 根据商品编号去查询商品的价格
         */
        getlistUnitPrice(sku){
            const that = this;

            let ids = [{
                categoryId1:that.goodsDetailsObj.categoryId1,
                categoryId2:that.goodsDetailsObj.categoryId2,
                categoryId3:that.goodsDetailsObj.categoryId3,
                sku:sku
            }]
            let param = {
                spId: goodsHandler.supplierId,
                businessType: 'COMMODITY',
                productInfos: ids,
                cityId: that.cityCode || ''
            }
            goodsHandler.getlistUnitPrice(param).then(res=>{
                if(res.resultCode == 0 && res.result){
                    that.$set(that.goodsDetailsObj, 'price', res.result.productPrice[0].unitPrice)
                }
            }).catch(e=>{
              console.log(e);
            })
        },
        /**
         * 获取商品销售列表
		 * @param {str} sku 商品id
         */
		getProductSpecList(sku){
            let that = this;
            //游客不查询此接口
            if(!!that.isguest){
                return;
            }
			let param = {
                sku: sku+'', 
                supplierId:goodsHandler.supplierId
            }
            goodsHandler.getProductSpecList(param).then(res=>{
                if(res.resultCode == 0 && res.result){
					that.productSpecList = res.result.spec;
                }
            }).catch(e=>{ 
                console.log(e);
            })			
        },
        
        /**
         * 查询该商品的库存数量
         */
		getlistStock(){
            //如果没选择地址或者没有sku，直接return
            if(!this.provinceCode || !this.sku){return}
			let that = this;
			let param = {
                stockRequire:[
                    {
                        sku: that.sku,
                        num: that.goodsNum,
                    }
                ],
                areaId1: this.provinceCode,
                areaId2: this.cityCode || '',
                areaId3: this.districtCode || '',
                areaId4: this.townCode || '',
                supplierId: goodsHandler.supplierId,
            }
            goodsHandler.getlistStock(param).then(res=>{
                if(res.resultCode == 0 && !!res.result && res.result.stock.length > 0){
                    let stock = res.result.stock[0];
                    //将是否缺货字段添加到goodsDetailsObj上
                    this.$set(that.goodsDetailsObj, 'hasStock', ProductStockStatus[stock.stockState].hasStocks);
                    this.$set(that.goodsDetailsObj, 'remainNum', stock.remainNum);
                    //更新有货的提示语
                    that.stockText = ProductStockStatus[stock.stockState].textConfirm;
                    // 更新变量hasStock 该变量用来判断该商品是否有库存
                    that.hasStock = that.goodsDetailsObj.hasStock;
                    
                }
            }).catch(e=>{ 
                console.log(e);
            })			
		},
        /**
         * 查询该商品的赠品和附件相关的东西
         */
		getGoodsGift(){
            //如果没选择地址或者没有sku，直接return
            if(!this.provinceCode || !this.sku){return}
			let that = this;
			let param = {
                skuIds:[
                    {
                        sku: that.sku,
                        num: that.goodsNum,
                    }
                ],
                areaId1: this.provinceCode,
                areaId2: this.cityCode || '',
                areaId3: this.districtCode || '',
                areaId4: this.townCode || '',
                supplierId: goodsHandler.supplierId,
                show: true, //购买量不足时是否展示赠品，true-展示 false-不展示
            }
            goodsHandler.getGoodsGift(param).then(res=>{
                if(res.resultCode == 0 && !!res.result.skuGiftAndAttachmentInfoList && res.result.skuGiftAndAttachmentInfoList.length > 0){
                    that.attachmentList = res.result.skuGiftAndAttachmentInfoList[0].attachmentList;
                    that.giftList = res.result.skuGiftAndAttachmentInfoList[0].giftList;
                    //将是赠品list和附件list字段添加到goodsDetailsObj上
                    this.$set(that.goodsDetailsObj, 'attachmentList', that.attachmentList);
                    this.$set(that.goodsDetailsObj, 'giftList', that.giftList);                    
                }
            }).catch(e=>{ 
                console.log(e);
            })			
		},
        /**
         * 查询该商品是否区域限购
         */
		checkAreaLimit(){
            //如果没选择地址或者没有sku，直接return
            if(!this.provinceCode || !this.sku){return}
			let that = this;
			let param = {
                skuIds: [that.sku],
                areaId1: this.provinceCode,
                areaId2: this.cityCode || '',
                areaId3: this.districtCode || '',
                areaId4: this.townCode || '',
                supplierId: goodsHandler.supplierId,
            }
            that.$loading.show();
            goodsHandler.checkAreaLimit(param).then(res=>{
                that.$loading.hide();
                if(res.resultCode == 0 && !!res.result && res.result.skuAreaRestrictList.length > 0){
                    let skuAreaRestrict = res.result.skuAreaRestrictList[0];
                    //将是否缺货字段添加到goodsDetailsObj上
                    this.$set(that.goodsDetailsObj, 'areaRestrict', skuAreaRestrict.areaRestrict);
                   
                    // 更新变量hasStock 该变量用来判断该商品是否区域限售
                    that.areaRestrict = that.goodsDetailsObj.areaRestrict;
                    
                }
            }).catch(e=>{ 
                that.$loading.hide();
                console.log(e);
            })			
        },
        
        /**
         * 查询该商品预计送达时间
         */
        getPromiseTime(){
            if(!!!this.provinceCode || !!!this.cityCode){return} //如果没有地址的情况下此时不查预计到达时间的接口
            let param = {
                skuList: [
                    {
                        skuId: this.sku,
                        num: this.goodsNum,
                    }
                ],
                provinceCode: this.provinceCode,
                cityCode: this.cityCode || '',
                districtCode: this.districtCode || '',
                townCode: this.townCode || '',
                addrDetail: this.addressObj.address,
                supplierId: goodsHandler.supplierId 
            };
            return new Promise((resolve, reject) => {
                orderHandler.getPromiseTime(param).then(res=>{
                    if(res.resultCode == 0 && !!res.result){
                        this.promiseTime = res.result.promiseTips[0].promiseTip;
                    }
                }).catch(e=>{
                    console.log(e);
                })
            })
        },
        /**
         * 页面注册的滚动事件的回调
         */
        onScroll(){
            let scrollContent = this.$refs.scrollContent;
            let goodsIndex = this.$refs.goodsIndex;
            if(!scrollContent || !goodsIndex){
                return;
            }
            let scrollTop = this.$refs.scrollContent.scrollTop;
            let tabTop = goodsIndex.offsetHeight;
            if(scrollTop >=tabTop ){
                this.descNavFixed = true;
            }else {
                this.descNavFixed = false;
            }
        },

        /**
         * 标题固定的回调
         */
        fixedDes(){
            let scrollContent = this.$refs.scrollContent;
            let goodsIndex = this.$refs.goodsIndex;
            if(!scrollContent || !goodsIndex){
                return;
            }
            scrollContent.scrollTop = goodsIndex.offsetHeight;
        },
        /**
         * T信刷新事件的注册回调 必须是refresh
         */
        // refresh(){
            
        // },
		/**
		 * 修改商品数量
		 */
		changegoodsNumPage(value){
			this.goodsNum = value;
		},
		/**
		 * 修改商品销售规则，修改商品id
		 */
		changeSkuPage(value){
            this.sku = value;
            //当变更商品sku的时候，此时重新更新该商品是否加入收藏的状态
            this.$refs.detailFooterComp.judgeGoodsInCollections(this.sku);
			//获取商品详情信息
			this.getGoodesDetails();
        },
        
        /**
         * 跳转到订单详情页面
         */
		 toOrderConfirm(){
            //  如果没有选择地址是不能下单的
            // if(!Object.keys(this.addressObj).length>0){
            //     SnModal({
            //         message: '您还没有收货地址，赶快去设置一个吧',
            //         showCancelButton: true,
            //         confirmButtonText:'去设置',
            //     }).then(res => {
            //         this.gotoAddress();
            //     }).catch(rej => {
            //         console.log('rej === ', rej);
            //     });
            //     return
            // }
            if(!!this.goodsDetailsObj.sku && this.goodsNum >= 1){
                let productList = [
                    {
                        sku: this.goodsDetailsObj.sku, //商品sku编号
                        num: this.goodsNum || 1,  //商品数量
                        productSpec: JSON.stringify(this.productSpec) || '', //商品规格参数
                        supplierId: goodsHandler.supplierId, //供应商id
                    }
                ];
                 //将要购买的商品list和选择的地址存储到 sessionStorage
                extendUtils.setSession('productSkuList', JSON.stringify(productList));
                extendUtils.setStorage(goodsHandler.primaryKey+'_addressSelected', JSON.stringify(this.addressObj));
                this.$router.push({
                    path: '/order/confirm',
                }) 
            }
         },

         /**
          * 地址对象
          */
         addressChange(item){
            this.addressObj = item;
        }
    }
}
</script>
<style scoped lang="less">
    @import '~themes/default/styles/product/detail/page.less';
</style>