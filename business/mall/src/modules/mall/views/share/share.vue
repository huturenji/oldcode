<template>
    <div class="favorite">
        <!-- 商品的列表渲染 -->
        <!-- <mescrollVue ref="mescroll" :down="mescrollDown" :up="mescrollUp" @init="mescrollInit"> -->
            <loadingComp v-if="loading"></loadingComp>
            <emptyPage v-else-if="cllectGoods.length <= 0"></emptyPage>
            <div v-else class="list-box">
                <div class="good-item" @click="gotoDetail(item)" v-for="(item, index) in cllectGoods" :key="index">
					<div class="favorite-item" slot="content">
						<div class="item-box">
							<div @click.stop="item.checked = !item.checked" v-if="editFlag && !isguest" class="choose-item">
								<Icon :type="item.checked?'icon_mall_checkbox_sel':'icon_mall_checkbox_nor'" size=".4"/>
							</div>
							<div class="list-one">
								<thumb06
									:img='item.imageUrl || item.imagePath'
									:title='item.name'
									:price='item.unitPrice'
								>
                                    <!-- 商品规格插槽 -->
                                    <template slot="sub-text">
                                        <!-- dealSpecification在全局混入里面globalMixin.js -->
                                        <div class="goods-format">{{dealSpecification(item.specification)}}</div>
                                    </template>
								</thumb06>
							</div>
						</div>
					</div>
                </div>
            </div>
        <!-- </mescrollVue> -->
        <!-- 定位底部的全选批量取消收藏的部分 -->
        <div v-transfer-dom v-if="!isguest">
            <div class="choose-all-deleteCollection fixed-dom-part">
                <div @click="chooseAllFun" class="choose-all">
                    <Icon :type="chooseAll?'icon_mall_checkbox_sel':'icon_mall_checkbox_nor'" size=".44"/>
                    <span class="text">全选</span>
                </div>
                <div @click="action()" class="cancle-btn linear-gra-mall-addFavorite cursorp">
                   {{isShareCart?'分享('+chooseNum+')':'加入购物车'}}
                </div>
            </div>
        </div>
        <!--分享-->
        <div v-transfer-dom>
            <popup v-model="showSharePopup" position="bottom" height="auto" width="100%" class="radiusTop">
                <share @close="showSharePopup=false" :shareOptions="shareOptions"></share>
            </popup>
        </div>  
    </div>
</template>
<script>
const Icon = ()=>import('commonComp/base/Icon.vue');
const thumb06 = ()=>import('commonComp/goodsThumb/thumb06.vue');
const emptyPage = ()=>import('commonComp/base/emptyPage.vue');
const loadingComp = ()=>import('commonComp/base/LoadingComp.vue');
const share = ()=>import('common/components/share')
import extendUtils from 'common/lib/utils';
import { Popup ,TransferDom} from 'vux';
import AddCartAnimation from 'common/lib/animation/addCart.js';
import shareHandler from 'common/lib/requestHandler/shareHandler.js';
import goodsHandler from 'common/lib/requestHandler/goodsHandler.js';
import tChatEventMixin from 'common/lib/mixin/tChatEventMixin';

export default {
    mixins: [tChatEventMixin],
    directives: {
        TransferDom
    },
    components:{
        thumb06,
        emptyPage,
        Icon,
        loadingComp,
        share,
        Popup
    },
    data(){
        let that = this;
        return Object.assign(extendUtils.stateManager.setData([
                {
                    name:'showSharePopup'//分享购物清单
                }
        ], that), {
            cllectGoods: [], //我的收藏商品列表
            editFlag: true, //是否显示批量取消收藏 默认为false
            chooseAll: false, //全选默认为false
            isShareCart:false,//是否是分析那个场景，有分享购物车和购物清单
            loading:true,//数据加载中
            chooseNum:0,//
            supplierId:this.$route.query.supplierId,//供应商id
            shareOptions:{},//分享所需的参数
            isguest:true,//是否是游客身份
            
        })
    },
    async created(){
        this.isguest = 'guest' == extendUtils.getGuestIdentity();

        /**
         *获取分享的商品列表
         */
        this.getListData();
    },
    beforeRouteLeave(to,from,next){
        shareHandler.cancelBizmateShare();
        next()
    },
    watch:{
        /**
         * 监听收藏商品列表变化，监听全选的功能
         */
        cllectGoods: {
            handler(val){
                if(val && val.length > 0){
                    let num = 0;
                    val.forEach( item=> {
                        !!item.checked && num++
                    });
                    this.chooseNum = num;
                    this.chooseAll = num == val.length;
                }
            },
            deep: true
        }
    },
    methods: {
		/**
		 * 获取页面列表数据
		 */
		getListData(){
            this.loading = true;
            //分享前页面
			if(!!this.$route.query.bisType && 'shareCart' == this.$route.query.bisType){
				this.isShareCart = true;
				this.getCllectGoods();
			//分享后打开购物清单
			}else{
				this.getSharedGoods(decodeURIComponent(this.$route.query.skus));
			}
			document.title = this.isShareCart?"分享购物车":decodeURIComponent(this.$route.query.shareName)+"的购物清单"
		},

		/**
		 * 页面刷新入口函数 mescroll刷新回调
		 * @param mescroll对象
		 */
		// refresh(mescroll){
		//     mescroll.resetUpScroll();
		// },
        /**
         * 获取待分享的商品
         */
        async getCllectGoods(){
            //等授权完成后再去获取缓存
            await extendUtils.authInterceptor(); 
            this.cllectGoods = !!JSON.parse(extendUtils.getStorage(goodsHandler.primaryKey + '_shareGoods')) ? JSON.parse(extendUtils.getStorage(goodsHandler.primaryKey + '_shareGoods')) : [];
            this.loading = false;
			// 默认全选
			this.chooseAllFun();
        },
        /**
         * 获取购物清单的商品信息
		 * @param {str} skus商品id列表
         */
		getSharedGoods(skus){
            const that = this;
			let param = {
                sku: skus.split("|"),
                supplierId:this.supplierId,
                channelId: goodsHandler.channelId,
				// queryExts: 'nappintroduction'//在移动端展示
            }
			goodsHandler.getProductSimpleDetail(param).then(res=>{
				if(res.resultCode == 0 && res.result){
                    let goods = res.result.detail;
                    let cllectList = [];
                    let skuList = param.sku;
                    for(let i = 0;i < skuList.length;i++){    //解决服务端返回采购列表排序与购物车不一致的问题
                        for(let j = 0;j < goods.length;j++){
                            if(skuList[i] == goods[j].sku){
                                cllectList.push(goods[j]);
                            }
                        }
                    }
                    that.cllectGoods = cllectList;
					// 默认全选
                    that.chooseAllFun();
                    //设置第三方分享信息
                    that.setThirdShare();
                    //根据商品id查询商品价格
                    if(that.cllectGoods.length>0){
                        that.getlistUnitPrice(that.cllectGoods);
                    }
                }else{
                    that.loading = false;
                }
                
			}).catch(e=>{
				console.log(e);
				that.loading = false;
			})
        },
		/**
         * setThirdShare
         */
		setThirdShare(){
            let that = this;
            //设置第三方（微信、朋友圈等）分享信息
            let location = window.location;
            let skus = this.$route.query.skus;
            let uName = decodeURIComponent(this.$route.query.shareName);
            let appName = that.BMallConfig.SUPPLIER_Map[goodsHandler.supplierId].name+'企业购';
            let callBackUrl = location.origin + location.pathname + "#/share?channelId="+(goodsHandler.channelId||this.$route.query.channelId||'')+"&bisType=shareMenu&shareName="+encodeURIComponent(uName || '')+"&skus="+encodeURI(skus)+"&supplierId="+that.cllectGoods[0].supplierId;
            let shareInfo = {
                title:uName+'的购物清单', // 分享标题 
                desc:'这是'+uName+'的购物清单，点击请查看', // 分享描述   
                link:callBackUrl, // 分享链接  
                imgUrl:that.cllectGoods[0].imagePath || '', // 分享图标,图片绝对地址 
            }
            //设置二次分享
            shareHandler.setThirdShareInfo(shareInfo);
        },        
        /**
         * 根据商品编号去查询商品的价格
         */
        getlistUnitPrice(cartList){
            const that = this;
            let ids = cartList.map(function(value){
            　　return {
                    categoryId1:value.categoryId1,
                    categoryId2:value.categoryId2,
                    categoryId3:value.categoryId3,                    
                    sku:value.sku
                }
            })
            let param = {
                spId: cartList[0].supplierId,
                businessType:'COMMODITY',
                productInfos: ids,
            }
            goodsHandler.getlistUnitPrice(param).then(res=>{
                if(res.resultCode == 0 && res.result){
                    that.loading = false;
                    let tempCartList = res.result.productPrice;
                    that.cllectGoods = cartList.map(value => {
                        let index = tempCartList.findIndex(temp => {
                            return temp.sku == value.sku;
                        })
                        if(index > -1){
                            value = Object.assign({}, value, {unitPrice:tempCartList[index].unitPrice});
                        }     
                        return value;             　　
                    })
                    //查询商品销售属性
                    that.getProductSpec(that.cllectGoods);
                }
            }).catch(e=>{
              console.log(e);
              that.loading = false;
            })
        }, 
        /**
         * 根据商品编号去查询商品的销售属性
         */
        getProductSpec(cartList){
            const that = this;
            let ids = cartList.map(function(value){
            　　return value.sku
            })
            let param = {
                sku: ids,
                supplierId:cartList[0].supplierId
            }
            goodsHandler.getProductSpec(param).then(res=>{
                if(res.resultCode == 0 && res.result){
                    let tempCartList = res.result.spec;
                    that.cllectGoods = cartList.map(value => {
                        let index = tempCartList.findIndex(temp => {
                            return temp.sku == value.sku;
                        })
                        if(index > -1){
                            value = Object.assign({}, value, {specification: JSON.stringify(tempCartList[index])}); //此处需要序列化一下，以为该页面显示的商品规格处理的方法都是dealSpecification
                        }     
                        return value;             　　
                    })
                }
            }).catch(e=>{
              console.log(e);
            })
        }, 
		/**
		 * 全选功能
		 */
		chooseAllFun(){
			this.chooseAll = !this.chooseAll;
			if(this.cllectGoods.length > 0){
				this.cllectGoods.forEach( item => {
					this.$set(item, 'checked', this.chooseAll);
				})
			}
		},
		/**
		 * 获取选中的需要处理的产品
		 */
		getSelectedGoods(){
			return this.cllectGoods.filter(item => {
				return !!item.checked;
			})
		},
		 /**
		 * 页面操作，分享购物车或采购清单加入购物车
		 */
		action(){
			let that = this;
			let selectedGoods = this.getSelectedGoods();
			if(selectedGoods.length <= 0){
			    extendUtils.showToast('请选择要分享的商品');
			}else{
                if(that.isShareCart){//分享购物车
                    that.getShareInfo(selectedGoods);
				}else{//采购清单加入购物车
					that.addMenuGoodsToCart(selectedGoods);
				}
			}
        },
        
        /**
         * 获取分享所需参数
		 *@param {Array} selectedGoods 所选中的列表
         */
		async getShareInfo(selectedGoods){
            let that = this;
			let location = window.location;
            let uData = await shareHandler.getUserInfo();
            let appInfo = {};
            try {
                appInfo = await shareHandler.getAppConfig();
            } catch (error) {
            }
            let appId = appInfo.appId || 0;
			let skus = selectedGoods.map(function(value,index,array){
			　　return value.sku
            })
            let uName = uData.uName || '';
            let appName = that.BMallConfig.SUPPLIER_Map[goodsHandler.supplierId].name+'企业购';
			//todo pageType参数是为了兼容app的商旅链接判断的，后续需要app端进行修改。
			let callBackUrl = location.origin + location.pathname + "#/shareCart?channelId="+(goodsHandler.channelId||'')+"&pageType=businessTrip&bisType=shareMenu&showTitleBar=false&showStatusBar=false&shareName="+encodeURIComponent(uData.uName || '')+"&skus="+encodeURI(skus.join('|'))+"&supplierId="+selectedGoods[0].supplierId;
			let shareData = {
                title : uName+'的购物清单', // 分享标题          
                desc : '这是'+uName+'的购物清单，点击请查看', // 分享描述           
                link : callBackUrl, // 分享链接          
                imgUrl : selectedGoods[0].imageUrl || '', // 分享图标,图片绝对地址  
                appId: appId+'',//小应用Id
                appName: appInfo.appName || appName || '企业购',//小应用名字,无合法appId时使用appName
                contentType : 'link', // 分享类型,music、video或link，不填默认为link
            }
            that.shareOptions = shareData;
            that.showSharePopup = true;
        },
		 /**
		 * 采购清单加入购物车
		 * @param {Array} selectedGoods 所选中的列表
		 */
		addMenuGoodsToCart(selectedGoods){
            let that = this;
            let goods = [];
			selectedGoods.forEach(item => {
                goods.push({
                    "sku": item.sku,
                    "supplierId": item.supplierId,
                    "quantity": 1,
                    "name": item.name,
                    "specification": item.specification || '', //这里已经是字符串了
                    "imageUrl": item.imagePath,
                    "jdCardCategoryId3": item.categoryId3 || '', //商品的三级分类，该字段目前用来判断实体礼品卡不能加入购物车的
                });				
            })
            //加入购物车的方法在全局混入里面globalMixin.js
            that.setIntoShopCar(goods).then(flag => {
                !!flag && that.gotoCart();
            }).catch(e=>{
                console.error('加入购物车失败====', e);
            })
        },
		 /**
		 * 跳转到购物车页面
		 */
		gotoCart(){
            let that = this;
            setTimeout(()=>{
                that.$router.push(
                    {
                        path: '/cart',
                    }
                )
            },200)
			
		},
        /**
         * 跳转订单详情页面
         */
        gotoDetail(item){
            //分享出去的购物清单需要携带channelId
            let query = {
                sku: item.sku,
                supplierId: item.supplierId,
                channelId:goodsHandler.channelId||this.$route.query.channelId||''
            }
            if(!!this.$route.query.bisType && 'shareMenu' == this.$route.query.bisType){
                query['channelId'] = this.$route.query.channelId;
                query['pageFrom'] = 'shareCart';
            }
            this.$router.push({
                path:'/product/detail',
                query:query
            })
        },
        /**
         * 页面刷新入口函数 mescroll刷新回调
         * @param mescroll对象
         */
        // refresh(mescroll){
        //     setTimeout(()=>{
        //     mescroll.endSuccess();
        //     }, 1000)
        // },

        /**
         * T信回退事件的注册回调 必须是goBackFun
         */
        goBackFun(){
            //分享购物车回退是路由回退
            if(this.isShareCart){
                this.$router.back();
            //采购清单回退是对于页面跳转的回退
            }else{
                extendUtils.goBackPage('');
            }
            
        },
    }
}
</script>
<style lang="less" scoped>
    @import '~themes/default/styles/share/share.less';
</style>
<style lang='less'>
    @import '~themes/default/styles/components/mescroll.less';
</style>
