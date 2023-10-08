<template>
    <div class="order-info">
        <div class="title">
            {{ title }}
        </div>
        <div class="order-num">
            <div><label>平台订单号:</label><span
                class="active"
                @click="showOrderDetail(orderInfo.subOrderNo)"
            >{{ orderInfo.subOrderNo }}</span></div>
            <div class="sp-no">
                <label>售后订单号:</label><span>{{ orderInfo.postSaleNo }}</span>
            </div>
            <!-- <div class="sp-no"><label>供应商订单号:</label><span>{{ orderInfo.spOrderId }}</span></div> -->
        </div>
        <div class="goods-info-wrapper">
            <div
                class="goods-info"
                v-for="( data,index) in orderInfo.postSaleProductInfoList"
                :key="index"
            >
                <img
                    v-lazy="showGoodImage(data.mainImage)"
                    alt=""
                >
                <div class="goods-right">
                    <p :title="data.productName">
                        {{ data.productName }}
                    </p>
                    <div class="goods-label">
                        <label>渠道价:</label><span>{{ data.settlePrice }}</span>
                        <label>购买数量:</label><span>{{ data.productNum }}</span> <span>{{ data.saleUnit }}</span>
                    </div>
                </div>
            </div>
            <!-- <div class="tell">
                <img class="sup-icon" v-lazy="supplierInfo.logo" alt="">
                <span>{{ supplierInfo.simpleName }}</span>
                <img class="phone-icon" :src="require('assets/tell.png')" alt="">
                <b>{{ supplierInfo.contactNumber }}</b >
            </div> -->
        </div>
    </div>
</template>
<script>
import { mapMutations } from "vuex";
export default {
    props: {
        title: {
            type: String,
            default: ""
        },
        orderInfo: {
            type: Object,
            default: () => {}
        },
        supplierInfo: {
            type: Object,
            default: () => {}
        }
    },
    data:function(){
        return {
            imgBaseUrl: 'https://img13.360buyimg.com/n0/' //图片显示根路径
        }
    },    
    methods: {
        ...mapMutations({
            setOrderNo: "SET_ORDERNO",
            setOrderType: "SET_ORDERTYPE",
            setsubOrderNo: "SET_SUBORDERNO"
        }),        
        /**
         * 查看订单详情
         */
        showOrderDetail(orderId) {
            if (orderId) {
                this.setsubOrderNo(orderId);
                this.setOrderType("child");
                this.$router.push({
                    name: `salechild`
                });                
            }
        },
        //展示图片
        showGoodImage(imgUrl){
            if (!imgUrl){
                //默认图片展示
                return require("assets/icon_mall_liwu.png")
            } else if (imgUrl && imgUrl.toLowerCase().indexOf("http") == 0) {
                return imgUrl
            }
            //京东的图片，相对地址，拼接一下
            return this.imgBaseUrl + imgUrl
            
        }
    }
};
</script>
<style lang="less" scoped>
 
.order-info {
    margin-top: 16px;
    padding: 16px 0 32px 0;
    border-radius: 8px;
    background-color: #fff;
    .title {
        padding: 0 32px 8px 32px;
        border-bottom: 1px solid #eee;
    }
    .order-num {
        display: flex;
        padding: 24px 0 20px 0;
        div {
            flex: 1;
            padding: 0 56px;
            label {
                color:  #999;
                margin-right: 10px;
            }
        }
    }
    .goods-info-wrapper {
        margin: 0 56px;
        padding: 15px;
        background: #F4F4F4;
        border-radius: 4px;
        display: flex;
        flex-direction: column;
        .goods-info,
        .tell {
            flex: 1;
            display: flex;
        }
        .goods-info {
            margin-bottom: 10px;
            .goods-right {
                display: flex;
                flex-direction: column;
                justify-content: center;
            }
            p {
                width: 300px;
                overflow: hidden;
                text-overflow: ellipsis;
                display: -webkit-box;
                /*! autoprefixer: off */
                -webkit-box-orient: vertical;
                /* autoprefixer: on */
                -webkit-line-clamp: 2;
            }
            img {
                width: 72px;
                height: 72px;
                margin-right: 10px;
            }
            .goods-label {
                margin-top: 12px;
                color:  #999;
            }
        }
        .tell {
            border-left: 1px solid #eee;
            display: flex;
            align-items: center;
            justify-content: center;
            .sup-icon {
                width: 56px;
                height: 56px;
            }
            span {
                margin: 0 24px 0 8px;
            }
            .phone-icon {
                width: 20px;
                height: 20px;
            }
            b {
                margin-left: 8px;
            }
        }
    }
}
</style>