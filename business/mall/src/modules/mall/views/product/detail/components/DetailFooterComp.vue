<template>
    <div class="detail-footer-wrap fixed-dom-part">
        <!-- 下架 无货 区域限售的tips提示 -->
        <tipsInfo :hasStock="hasStock" :stopSales="stopSales" :areaRestrict="areaRestrict"/>
        <div class="detail-footer">
          <div class="left-part itemWrap">
              <div class="left-part-item favorite" @click="collectGoods">
                  <Icon :class="{animate: isCollected}" :type="!isCollected ? 'icon_mall_uncollect' : 'icon_mall_collect_active'" size='0.4'></Icon>
                  <p>{{isCollected?'已收藏':'收藏'}}</p>
              </div>
              <div class="left-part-item favorite zhiCustomBtn" @click="gotoCustomerService">
                  <Icon type='kefu' size='0.4'></Icon>
                  <p>客服</p>  
              </div>
              <div class="left-part-item" @click="gotoCart">
                  <span class="cartnum_box" id='detailFooterCart'>
                      <Icon type='icon_mall_gouwuche2' size='0.4'></Icon>
                      <div v-if="cartNum > 0" class="cartNum">
                          <numThumb :number='cartNum'></numThumb>
                      </div>
                  </span>
                  <p>购物车</p>
              </div>
          </div>
          <div class="option-btn itemWrap" :class="{disable: disabledOperate}">
              <!-- 加入购物车的公共方法在mallMixin.js里面 -->
              <span class="cursor-btn normal-btn" @click="toOrderConfirm">立即购买</span>
              <span class="cursor-btn normal-btn" @click="addCart()">加入购物车</span>
          </div>
        </div>

    </div>
</template>
<script>
import extendUtils from 'common/lib/utils';
import Bus from 'common/lib/bus/bus.js';
import customerService from 'common/lib/customer-service/index.js'; //客服系统
import goodsHandler from 'common/lib/requestHandler/goodsHandler.js';
const Icon = ()=>import('common/components/base/Icon.vue');
const tipsInfo = ()=>import('./tipsInfo.vue');
const numThumb = ()=>import('common/components/cartThumb/numThumb.vue');
import {ProductStatus} from 'common/lib/enum/productStatusEnum';
export default {
    name:'footerNewComp',
    components:{
        Icon,
        numThumb,
        tipsInfo
    },
    props:{
        //传递的商品详情
        goodsDetailsObj:{
            type: Object,
            required: true,
            default(){
                return {}
            }
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
        //是否区域限售 true=下架 false=上架
        areaRestrict:{
            type:Boolean,
            default:false
        }
    },
    watch: {
     
    },
    data(){
        return {
            isCollected: false, //代表是否该商品被收藏了
            userInfo:{},      
        }
    },
   
    computed:{
        //购物车中商品的数量
        cartNum(){
            var numbers = this.$store.state.cartNumber;
            return numbers;
        },
        /**
         * 该变量用来判断当该商品下架或者缺货的时候，相关按钮不能操作的
         */
        disabledOperate(){
            return !!this.stopSales || !this.hasStock || !!this.areaRestrict;
        }, 

        /********
         * 整合在线客服需要拼接的参数（用的在线客服事智齿科技）
         */
        zcConfig(){   
            let that = this;
            let location = window.location;
            let cityId =  goodsHandler.getCityId(); //次数的cityId要以url的形式带着，解决客服人员点击商品卡片的时候苏宁获取商品详情因为cityId有问题获取不了商品详情的问题
            let callBackUrl = location.origin + location.pathname + "#/product/shareDetail?channelId="+(goodsHandler.channelId||'')+"&pageType=businessTrip&pageFrom=customerService&sku=" + that.goodsDetailsObj.sku+'&supplierId='+that.goodsDetailsObj.supplierId + '&cityId='+ cityId;
            return {
                card_title: '商品信息', //商品标题（必传）
                card_url: encodeURIComponent(callBackUrl), //商品信息的商品链接地址（必传）（建议使用encodeURIComponent转义一下，防止链接中带有特殊符号导致参数获取失败）
                card_desc: encodeURIComponent(this.goodsDetailsObj.name), //商品信息的简述内容（选传）
                card_note: '￥' + this.goodsDetailsObj.price, //2000元 商品标签例：价格（选传）
                card_picture: encodeURIComponent(this.goodsDetailsObj.imagePath), //商品的缩略图（选传）（建议使用encodeURIComponent转义一下，防止链接中带有特殊符号导致参数获取失败） 
            } 
        },
        
        
    },
    async created(){
        this.initCollect();
        //分发获取购物车数量的接口 在vuex里面
        this.$store.dispatch('getCartNum');
    },

    mounted(){
        let that = this;
    },
    methods:{

        //跳转到客服系统
        async gotoCustomerService(){  
            let url = await customerService.run(1, this.zcConfig, 'product').catch(e=>{
                console.log(e)
            });
            window.open(url);
            // extendUtils.openApplet({
            //     appId: this.BMallConfig.SUPPLIER_Map[goodsHandler.supplierId].appId,
            //     url,
            // });
        },

        /**
         * 加入购物车
         */
        addCart(){
            //已下架商品无法加入购物车
            if(!!this.disabledOperate){return}
            //监听底部的购物车数量
            Bus.$emit('showGoodsModel');
        },

        /**
         * 跳转购物车
         */
        gotoCart(){
            this.$router.push({
                path:'/cart'
            })
        },

        /**
         * 订单详情页加入收藏和取消收藏
         */
        collectGoods(){
			let that = this;
			if(that.isCollected){
				that.deleteFavorites();
			}else{
				that.addFavoriteList();
			}
        },
        /**
         * 加入收藏
         */
		addFavoriteList(){
            let that = this;
            let skus = [{
                sku: that.goodsDetailsObj.sku,
                supplierId: that.goodsDetailsObj.supplierId,
            }]
            //加入收藏的方法在全局混入里面globalMixin.js
            that.addFavorite(skus).then(flag => {
                if(!!flag){
                    that.isCollected = true;
                }
            }).catch(e=>{
                console.log(e);
            });
		},
        /**
         * 删除收藏
         */
		deleteFavorites(){
			let that = this;
			let param = {
                skus: [
                    {
                        sku: that.goodsDetailsObj.sku,
                        supplierId: that.goodsDetailsObj.supplierId,
                    }
                ],//商品编号
                "userId":goodsHandler.userId, 
                "companyId":goodsHandler.companyId, 
                "channelId":goodsHandler.channelId, 
            }
            that.$loading.show();
			goodsHandler.deleteFavorites(param).then(res=>{
			    this.$loading.hide();
			    if(res.resultCode == 0){
                    this.isCollected = false;
                    // extendUtils.showToast("取消收藏")
			    }
			}).catch(e=>{
			    console.log(e);
			    this.$loading.hide();
			})
        },
        //查询商品是否已经收藏
        initCollect(){
            if(this.goodsDetailsObj.supplierId){
                this.judgeGoodsInCollections(this.$route.query.sku);
            }else{
                setTimeout(()=>{
                    this.initCollect();
                },300)
            }
        },
        /**
         * 判断收藏里面是否有该商品 true 代表收藏了  false代表没收藏
         */
        judgeGoodsInCollections(sku){
			let that = this;
			let param = {
                "sku": sku,
                "supplierId": that.goodsDetailsObj.supplierId,
                "userId":goodsHandler.userId,
                "companyId":goodsHandler.companyId,
                "channelId":goodsHandler.channelId,
            };
            //收藏的商品
			goodsHandler.getFavorite(param).then(res=>{
			    if(res.resultCode == 0){
					if(!!res.result && !!res.result.sku){//说明存在
					    this.isCollected = true;
					}else{//说明不存在
					    this.isCollected = false;
					}
			    }
			}).catch(e=>{
			    console.log(e);
			})
        },

        /**
         * 提交订单
         */
        toOrderConfirm(){
            //已下架商品无法下单
            if(!!this.disabledOperate){return}
            this.$emit('toOrderConfirm');
        }
    }
}
</script>
<style scoped lang="less">
@import '~themes/default/styles/common/variable.less';
@import '~mallStyles/mixins/mixinsStyle.less';
@keyframes mymove{
    0%{
        transform: scale(0);  /*开始为原始大小*/
    }
    50%{
        transform: scale(1.5);
    }
    100%{
        transform: scale(1);
    }
}
/*Safari and Chrome*/
@-webkit-keyframes mymove {
    0%{
        transform: scale(0);  /*开始为原始大小*/
    }
    50%{
        transform: scale(1.5);
    }
    100%{
        transform: scale(1);
    }
}
.detail-footer-wrap{
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  max-width: @max-content-width;
  z-index: 300;


}
.detail-footer{

    height: 1.1rem;
    background: #fff;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-right: 0.2rem;
    box-shadow:0px 6px 20px 0px rgba(101,112,242,0.12);
    .left-part{
        width: 45%;
        display: flex;
        justify-content: space-around;
        align-items: center;
        padding: 0 0.3rem;
        .left-part-item{
            cursor: pointer;
            min-width: 0.6rem;
        }
        .favorite{
            //加入收藏的动画
            .animate{
                animation: mymove 0.2s ease-in-out 0s 1;
                -webkit-animation: mymove 0.2s ease-in-out 0s 1; /*Safari and Chrome*/
            }
        }
    }
    & .itemWrap{
        text-align: center;
        .cartnum_box{
            position: relative;
            .cartNum{
                position: absolute;
                top: -0.2rem;
                left: 0.65rem;
                white-space: nowrap;
            }
        }
        &.option-btn{
            flex: 1;
            display: flex;
            justify-content: space-between;
            span{
                display: inline-block;
                width: 50%;
                height: 100%;
                height: 0.72rem;
                line-height: 0.72rem;
                color: #fff;
                text-align: center;
                font-size: 0.28rem;
                &:first-child{
                    border-radius: 0.8rem 0  0 0.8rem;
                    border-right: none;
                    .linear-gra-mall-addFavorite(140deg)
                }
                &:last-child{
                    border-radius: 0 0.8rem 0.8rem 0;
                    .linear-gra-add-cart-btn(140deg);
                }
            }
            &.disable span{
              opacity: 0.4;
            }
        }
        p{
            font-size: 0.2rem;
            color: @secondary-text-color;
        }
    }
}
</style>
