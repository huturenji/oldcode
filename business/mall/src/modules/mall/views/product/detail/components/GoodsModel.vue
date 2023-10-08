<template>
    <div class="goods-model-container" v-if='goodsDetailsObj'>
        <div class="title-box">
            <AddressTitle :showTitle='true' @closePopup='closePopup' :title='title'></AddressTitle>
        </div>
        <div class='summary'>
            <thumbnail :src='goodsDetailsObj.imagePath' class='thumbnail'/>
            <div class="goos-price-box">
                <div class='price-content'>
                    <priceLabel :amount="showRealPrice()" class='price'/>
                </div>    
                <div class='provider-num'>
                    商品编号：{{goodsDetailsObj.sku}}
                </div>
            </div>
        </div>
        <div class='float-area'>
            <div class='attributes-area'>
                <ul>
                    <li v-for='(productSpec,index) in productSpecList' :key='index'>
                        <label>{{productSpec.saleName}}</label>       
                        <ul class='clear'>
                            <li v-for='(item,ind) in productSpec.saleAttrList' :class="{active:arrhaveitem(goodsDetailsObj.sku,item.skuIds),disable:'isDisable'==setSpecSkuType(goodsDetailsObj.sku,item.skuIds,productSpec.dim)}" :key="ind" @click="changeSpecSku(goodsDetailsObj.sku,item.skuIds,productSpec.dim)">
                                <span class="inner-text">{{item.saleValue}}</span>
                            </li>
                        </ul>
                    </li>
                </ul>
            </div>
            <counter :value="goodsNum" @input="changeGoodsNum" :max="!!goodsDetailsObj.remainNum && goodsDetailsObj.remainNum>0?goodsDetailsObj.remainNum:BMallConfig.GOODS.MAX_COUNT" @disableFun="toastFun"/>
        </div>
        <div v-if="!!disabledOperate" class='btn-group' v-show="showBtn">
            <div class='disable_btn cursor-btn normal-btn'>{{disBtnText}}</div>
        </div>
        <div v-else class='btn-group' v-show="showBtn" :class="{disable: !!disabledOperate}">
            <div @click="toOrderConfirm" class='buy cursor-btn normal-btn'>立即购买</div>
            <div @click='addCart' class='add-cart cursor-btn normal-btn'>加入购物车</div>
        </div>
    </div>
</template>
<script>
import thumbnail from 'common/components/goodsThumb/thumbnail';
import extendUtils from 'common/lib/utils';
import scrollLockMixin from 'common/lib/mixin/scrollLockMixin.js';
const priceLabel = ()=>import('common/components/base/priceLabel');
const counter = ()=>import('common/components/base/counter');
const AddressTitle = ()=>import('common/components/base/AddressTitle.vue');
const Icon = ()=>import('common/components/base/Icon.vue');
export default {
    name: 'goodsModel',
    mixins: [scrollLockMixin],
    components: {priceLabel, thumbnail, counter, AddressTitle, Icon},
    props:{
        goodsDetailsObj: {
            type: Object,
            default: ()=>{}
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
		//是否上下架 true=下架 false=上架
        stopSales:{
            type:Boolean,
            default:false
        },
		//是否区域限售 true=限售 false=不限售
        areaRestrict:{
            type:Boolean,
            default:false
        },
		//该商品是否正在进行活动
        activityGoingOn:{
            type:Boolean,
            default:false
        }
    },
    data(){
        return {
			title:'',
			domHeight: document.documentElement.clientHeight,  //默认屏幕高度
            showHeight: document.documentElement.clientHeight,   //实时屏幕高度
            showBtn:true, //默认显示底部按钮
        }
	},
	computed:{
        /**
         * 该变量用来判断当该商品下架或者缺货的时候，相关按钮不能操作的
         */
        disabledOperate(){
            return !!this.stopSales || !this.hasStock || !!this.areaRestrict ;
		},  
		
		//商品下架 无货 和 区域限售的按钮提示文字展示
		disBtnText(){
			let text = '抱歉，所选商品无货';
			if(this.stopSales){
				text = '该商品已下架，非常抱歉！'
			}else if(!this.stopSales && !!this.areaRestrict){
				text = '该商品在该地区暂不支持销售，非常抱歉！'
			}else if(!this.stopSales && !this.areaRestrict && !this.hasStock){
				text = '抱歉，所选商品无货'
			}
			return text;
		}    
    },
	watch: {
		showHeight(val) { 
			if (this.domHeight > this.showHeight) {
				this.showBtn = false;
			} else {
				//关闭软键盘时，同步数量
				this.showBtn = true;
			}
		}
    },
    created(){
		window.onresize = () => {
            return (() => {
                this.showHeight = document.documentElement.clientHeight;//这里需要注意一下可视区高度。
            })();
        };
    },
    mounted(){},
    methods: {
        
        //关闭弹窗
        closePopup(){
            this.$emit('closePopup');
		},
		
		//showToast提示
		toastFun(){
			this.goodsDetailsObj.remainNum>0 && extendUtils.showToast(`商品仅剩${this.goodsDetailsObj.remainNum}件`);
		},

		/**
		 * 修改商品数量
		 */
		changeGoodsNum(value){ 
			if(Number(value) >= this.goodsDetailsObj.remainNum && this.goodsDetailsObj.remainNum>0){this.toastFun()};
			this.$emit('changegoodsNumIndex',value)
		},
		/**
		 * 商品id是否在商品销售规格列表中
		 * @param {str} item 
		 * @param {arr} arr 商
		 * @param {str} key
		 */
		arrhaveitem(item,arr,key){
			var isInArr = false;
			var len = arr.length;
			for (var i = 0; i < len; i++) {
				if (!!key ? arr[i][key] == item : arr[i] == item) {
					isInArr = true;
					break;
				}
			}
			return isInArr;
		},
		/**
		 * 切换商品规格id
		 * @param {str} sku 当前说选商品id，beforeChange
		 * @param {arr} skuIds 商品规格list
		 * @param {arr} dim 维度
		 */
		changeSpecSku(sku,skuIds,dim){
			let that = this;
			//获取每个维度下的skuIds
			let tempList = that.getDimSkus(sku,skuIds,dim);
			//获取每个维度skuIds的交集
			let skus = [];
			let leng = tempList.length;
			for (let i = 0; i < leng; i++) {
				if(0==i){
                    skus = tempList[i];
				}else{
					let len = skus.length;
					let tempSkus = [];
					for(let j=0;j<len;j++){
						if(that.arrhaveitem(skus[j],tempList[i])){
							tempSkus.push(skus[j])
						}
					}
                    skus = tempSkus;
				}
            }
            if(0 == skus.length){
                return false;
            }
			this.$emit('changeSkuIndex',skus[0])
        },
        /**
		 * 计算规格是否可选
         * TODU如果使用changeSpecSku方法的话会循环调用，后续需要优化一下
		 * @param {str} sku 当前所选商品id
		 * @param {arr} skuIds 商品规格list
		 * @param {arr} dim 维度
		 */
        setSpecSkuType:function(sku,skuIds,dim){
            let that = this;
            let res = '';
			//获取每个维度下的skuIds
			let tempList = that.getDimSkus(sku,skuIds,dim);
			//获取每个维度skuIds的交集
			let skus = [];
			let leng = tempList.length;
			for (let i = 0; i < leng; i++) {
				if(0==i){
                    skus = tempList[i];
				}else{
					let len = skus.length;
					let tempSkus = [];
					for(let j=0;j<len;j++){
						if(that.arrhaveitem(skus[j],tempList[i])){
							tempSkus.push(skus[j])
						}
					}
                    skus = tempSkus;
				}
            }
            if(0 == skus.length){
                res = 'isDisable';
            }
            return res;
        },
		/**
		 * 获取所有维度商品规格id列表
		 * @param {str} sku 当前说选商品id，beforeChange
		 * @param {arr} skuIds 商品规格list
		 * @param {arr} dim 维度
		 */
		getDimSkus(sku,skuIds,dim){
			let that = this;
			let resList = [];
			let length = this.productSpecList.length;
			for(let i=0;i<length;i++){
				let value = this.productSpecList[i];
				if(dim == value.dim){//点击的按钮所属的维度
					resList.push(skuIds);
				}else{//非当前维度
					let len = value.saleAttrList.length;
					for(let j=0;j<len;j++){
						if (that.arrhaveitem(sku,value.saleAttrList[j].skuIds)) {
							resList.push(value.saleAttrList[j].skuIds);
						}
					}
				}
			}
			return resList;
		},

		/**
		 * 提交订单
		 */
		toOrderConfirm(){
			if(!!this.disabledOperate){return}//缺货商品不能操作
			this.$emit('toOrderConfirm');
		},

		//添加到购物车
        addCart(){
			if(!!this.disabledOperate){return}//缺货商品不能操作
            this.$emit('addCart');
        },

		// 选择规格的弹窗展示的价格（正在进行中的活动要显示活动价）
		showRealPrice(){
			if(this.activityGoingOn && this.goodsDetailsObj.promotionalPrice > 0){
				return  this.goodsDetailsObj.promotionalPrice;
			}
			return this.goodsDetailsObj.price;
		}
    }
}
</script>
<style scoped lang="less">
@import '~themes/default/styles/product/detail/components/goodsModel.less';
</style>