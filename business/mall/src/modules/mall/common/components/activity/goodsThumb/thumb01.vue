<!-- 
  展示格式如下：
  ----------------------
  -------【图片】--------
  ----------------------
  -------【商品名】------
  --【金额】--【购物车】--
 -->
<template>
  <div @click.stop='clickGoodsThumb()' class="thumb-container">
    <div class="product-item expo showYGTH">

      <section class="pic">
        <!-- 未开始显示即将开始 -->
        <div :class="{before:timeBefore}"></div>
        <!-- 已结束展示已结束 -->
        <div :class="{end:timeEnd}"></div>
        <!-- 有限量显示限量 -->
        <div v-if="!!limitNum" class="limit_num">
            限量{{limitNum}}件
        </div>
        <thumbnail :src="img" :status='status'/>
      </section>

      <section class="pd-info showYGTH">
        <h4 class="title-section pd-title">{{title}}</h4>
        <div class="pd-info-left">
          <section class="price-section old-price-section pd-price">
            <span class="curr-price price-label" v-show="!!price">
              <priceLabel  :amount='price' v-if="!!price"/>
            </span>
            <span class="nei-price" v-if="salesPriceText">{{salesPriceText}}</span>
          </section>
        </div>

        <div class="supplier_price" v-if="supplierPrice">
            <span  class="goodsOriginal rmb" ><priceLabel  :amount='supplierPrice' /></span>
            <span class="jingD">京东价</span>
        </div>
        <button @click.stop='addCart($event)' class="addCart-icon-section">
          <span class="cart-icon"></span>
        </button>
      </section>
    </div>
  </div>
</template>
<script>
import priceLabel from './base/priceLabel'
import thumbnail from "./thumbnail"
export default {
  components: {priceLabel, thumbnail},

  data(){
      return{
        
      }
  },
  props: {
    img: {//商品图片
        type: String,
        default: ''
    },
    number: {//商品数量
        type: Number,
        default: 0
    },
    limitNum:{ //限量
        default: 0
    },
    title: {//商品标题
        type: String,
        default: ''
    },
    price: {//商品售价
        default: 0
    },
    supplierPrice: {//商品供应商售价
        default: 0
    },
    status: {//商品状态（已下架，无货，剩余数量等）
        type: Object,
        defalut: null,
    },
    timeBefore:{
        type: Boolean,
        default: false,
    },
    timeEnd:{
        type: Boolean,
        default: false,
    },
    salesPriceText:{
      type: String,
      default:'优惠价'
    }
  },
  methods: {

    addCart($event){
        this.$emit('addCart', $event)
    },

    clickGoodsThumb(){
        this.$emit('clickGoodsThumb')
    }


  },
};
</script>
<style scoped lang="less">
// 屏幕尺寸
@screen-sm: 550px;
@screen-md: 768px;
@screen-lg: 1080px;
@tabBg: #ffeef0;
//------------ 移动端通用样式 -------------
@media screen and (max-width: @screen-sm) {
   .thumb-container{
        width: 100%;
        height: 100%;

        &>.product-item{
            display: block;
            background-color: inherit;
            position: relative;
            .pic{
                position: relative;
                min-height: 3.4rem;
                display: flex;
                align-items: stretch;
                background-color: #fff;
                overflow: hidden;
                .before{
                    width: 1.42rem;
                    height: .82rem;
                    background:url('~themes/default/img/activity/activitys/tag_jijiangkaishi@2x.png') center no-repeat;
                    background-size: cover;
                    -webkit-background-size: cover;
                    -o-background-size: cover;
                    position: absolute;
                    right: 0;
                    top:0.20rem;
                }
                .end{
                    width: 100%;
                    height: 100%;
                    background:url('~themes/default/img/activity/activitys/bg_yijieshu@2x.png') center no-repeat;
                    background-size: cover;
                    position: absolute;
                    top: 0;
                    left: 0;
                }
                .limit_num{
                    position: absolute;
                    bottom: .16rem;
                    right: .1rem;
                    padding: .06rem .16rem;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    background: rgba(0, 0, 0, 0.5);
                    border-radius: .22rem;
                    line-height: .28rem;
                    font-size: .2rem;
                    z-index: 20;
                    color: #fff;
                }
                /deep/ .goods-thumbnail-container{
                    height: auto;
                }
            }
            
            .pd-info{
                // height: 1.7rem;
                padding: 0 .24rem;
                margin: .1rem 0 .2rem 0;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                &.showYGTH{
                    
                    .pd-info-left{
                        margin-bottom: 0.04rem;
                        margin-top: .2rem;
                    }
                    .pd-info-left .price-section{
                        font-size: 0.28rem;
                    }
                    .pd-info-left .price-section .curr-price{
                        background: linear-gradient(133deg,#ff8063 4%, #e6331f 97%);
                        color: #fff;
                        padding: 0.05rem 0.1rem;
                        border-radius: 0.08rem;
                    }
                    .pd-info-left .price-section .nei-price{
                        border-style: none;                        
                    }
                    .goodspr .goodsOriginal{
                        height: 0.32rem;
                        line-height: 0.32rem;
                        margin-top: 0.14rem;
                        font-size: 0.26rem;
                        text-decoration:none;
                        color: #222222
                    }
                    .goodspr .jingD{
                        height: 0.32rem;
                        line-height: 0.32rem;
                        margin-top: 0.14rem;
                        font-size: 0.24rem;
                        font-weight: 400;
                        color: #222222
                    }
                }
                .title-section {
                    font-size: .28rem;
                    font-weight: 400;
                    height: .8rem;
                    margin: 0;
                    padding: 0;
                    line-height: 0.4rem;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    word-break: break-all;
                    white-space: normal;
                    color: #333333;
                }

                .pd-info-left{
                    .price-section {
                        font-size: .3rem;
                        font-weight: bold;
                        height: .44rem;
                        line-height: .44rem;
                        .curr-price {
                            color: #e32d2d-light;
                            vertical-align: middle;

                            .rmb{
                                font-style: normal;
                            }
                        }

                        .old-price {
                            font-size: .24rem;
                            vertical-align: middle;
                            color: #999;
                        }
                        .nei-price{
                            font-size: 0.22rem;
                            line-height: 0.32rem;
                            color: #FFA501;
                            border: solid 0.02rem #FFA501;
                            border-radius: 0.06rem;
                        }
                    }
                }
                .supplier_price{
                    color: #333333;
                    font-size: 0.26rem;
                    .goodsOriginal{
                        text-decoration:line-through;
                    }
                }
        
            
                .addCart-icon-section{ 
                    position: absolute;
                    right: .2rem;
                    bottom: .24rem;
                    z-index: 1;
                    cursor: pointer;
                    .cart-icon {
                        display: block;
                        width: .52rem;
                        height: .52rem;
                        background: url('~themes/default/img/icon/add_cart.svg') center no-repeat;
                        border-radius: 100%;
                        background-size: 100%;
                        background-position: center;
                        &:active{
                            background-color: #FF8001;
                            background: url('~themes/default/img/icon/cart_active.svg') center no-repeat;
                            background-size: 100%;
                        }
                    }
                }
            }
        }
    }

}


//------------ pc端通用样式 包括pc客户端 浏览器端 -------------
@media screen and (min-width: @screen-sm) {
    .thumb-container{
        width: 100%;
        height: 100%;

        &>.product-item{
            display: block;
            background-color: inherit;
            position: relative;
            .pic{
                position: relative;
                display: flex;
                align-items: stretch;
                background-color: #fff;
                overflow: hidden;
                .before{
                    width: 71px;
                    height: 41px;
                    background:url('~themes/default/img/activity/activitys/tag_jijiangkaishi@2x.png') center no-repeat;
                    background-size: cover;
                    -webkit-background-size: cover;
                    -o-background-size: cover;
                    position: absolute;
                    right: 0;
                    top: 10px;
                }
                .end{
                    width: 100%;
                    height: 100%;
                    background:url('~themes/default/img/activity/activitys/bg_yijieshu@2x.png') center no-repeat;
                    background-size: cover;
                    position: absolute;
                    top: 0;
                    left: 0;
                }
                .limit_num{
                    position: absolute;
                    bottom: 8px;
                    right: 5px;
                    padding: 4px 10px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    text-align: center;
                    background: rgba(0, 0, 0, 0.5);
                    border-radius: 11px;
                    font-size: 11px;
                    z-index: 20;
                    color: #fff;
                }
                /deep/ .goods-thumbnail-container{
                    height: auto;
                }
            }
            
            .pd-info{
                padding: 0 12px;
                margin: 5px 0 10px 0;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                &.showYGTH{
                    
                    .pd-info-left{
                        margin-bottom: 2px;
                        margin-top: 10px;
                    }
                    .pd-info-left .price-section{
                        font-size: 14px;
                    }
                    .pd-info-left .price-section .curr-price{
                        background: linear-gradient(133deg,#ff8063 4%, #e6331f 97%);
                        color: #fff;
                        padding: 1px 2px;
                        border-radius: 4px;
                    }
                    .pd-info-left .price-section .nei-price{
                        border-style: none;
                        
                    }
                    .goodspr .goodsOriginal{
                        height: 16px;
                        line-height: 16px;
                        margin-top: 7px;
                        font-size: 13px;
                        text-decoration:none;
                        color: #222222
                    }
                    .goodspr .jingD{
                        height: 16px;
                        line-height: 16px;
                        margin-top: 7px;
                        font-size: 12px;
                        font-weight: 400;
                        color: #222222
                    }
                }
                .title-section {
                    font-size: 14px;
                    font-weight: 400;
                    height: 40px;
                    margin: 0;
                    padding: 0;
                    line-height: 20px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    word-break: break-all;
                    white-space: normal;
                    color: #333333;
                }

                .pd-info-left{
                    .price-section {
                        font-size: 14px;
                        font-weight: bold;
                        height: 22px;
                        line-height: 22px;
                        .curr-price {
                            color: #e32d2d;
                            vertical-align: middle;

                            .rmb{
                                font-style: normal;
                            }
                        }

                        .old-price {
                            font-size: 12px;
                            vertical-align: middle;
                            color: #999;
                        }
                        .nei-price{
                            font-size: 10px;
                            line-height: 16px;
                            color: #FFA501;
                            border: 1px #FFA501;
                            border-radius: 3px;
                        }
                    }
                }
                .supplier_price{
                    color: #333333;
                    font-size: 13px;
                    .goodsOriginal{
                        text-decoration:line-through;
                    }
                }
        
            
                .addCart-icon-section{ 
                    position: absolute;
                    right: 10px;
                    bottom: 12px;
                    z-index: 1;
                    cursor: pointer;
                    border:none 0;
                    border-radius: 50%;
                    .cart-icon {
                        display: block;
                        width: 26px;
                        height: 26px;
                        background: url('~themes/default/img/icon/add_cart.svg') center no-repeat;
                        
                        background-size: 100%;
                        background-position: center;
                        &:active{
                            background-color: #FF8001;
                            background: url('~themes/default/img/icon/cart_active.svg') center no-repeat;
                            background-size: 100%;
                        }
                    }
                }
            }
        }
    }
}


</style>