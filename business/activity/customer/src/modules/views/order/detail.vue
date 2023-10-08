<template>
    <div>
        <div class="top">
            <div class="detailTitle">
                <i class="el-icon-arrow-left" @click="goback"></i>
                <div class="text">
                    订单详情
                </div>
            </div>
            <div class="order-money">
                <div>订单金额:</div>
                <div class="money">￥{{list.orderAmount}}</div>
            </div>
        </div>
        <el-row>
            <el-col :span="24">
                <el-table
                :data="skuList"
                :header-cell-style="{ background: '#F7F8FA',color:'#1d2129',height:'40px' }"
                style="width: 100%">
                    <el-table-column
                        prop="sku"
                        label="SKU"
                        width="300"
                        :cell-style="{paddingLeft:'24px'}"
                        >
                    </el-table-column>
                    <el-table-column
                        prop="skuName"
                        label="商品名称"
                        width="700">
                        <template slot-scope="scope">
                            <div class="goods">
                                <el-popover placement="top-start" width="250" trigger="hover">
                                    <img style="height: 200px" :src="scope.row.mainImage" alt="" />
                                    <img
                                        slot="reference"
                                        class="img"
                                        :src="scope.row.mainImage"
                                    />
                                </el-popover>
                                <span class="goodsName">{{scope.row.skuName}}</span>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="number"
                        label="数量"
                        width="300">
                    </el-table-column>
                    <el-table-column
                        prop="salePrice"
                        label="单价"
                        width="300">
                        <template slot-scope="scope">
                            <div class="price">
                                <span>￥</span>
                                <span class="goodsName">{{scope.row.salePrice}}</span>
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
            </el-col>
            <el-col :span="24" class="marginT10">
                <div class="base-info">
                    <div class="title">
                        基本信息
                    </div>
                    <div class="info">
                        <namedcomp compName="订单流水号">
                            <span slot="component">{{list.orderNo}}</span>
                        </namedcomp>
                        <namedcomp compName="结算方式">
                            <span slot="component">{{list.payType=="OFFLINE"?'线下':'线上'}}</span>
                        </namedcomp>
                        <namedcomp compName="订单创建时间">
                            <span slot="component">{{list.createTime}}</span>
                        </namedcomp>
                    </div>
                </div>
            </el-col>
            <el-col :span="24" class="marginT10" v-if="approveStatus=='APPROVED'">
                <div class="base-info">
                    <div class="title">
                        审核信息
                    </div>
                    <div class="info">
                        <namedcomp compName="审核状态">
                            <span slot="component">{{list.approveResult=='PASS'?'已通过':'已拒绝'}}<span>({{list.payStatus=='PAID'?'已支付':'待支付'}})</span></span>
                        </namedcomp>
                        <namedcomp compName="备注">
                            <span slot="component">{{list.approveRemark}}</span>
                        </namedcomp>
                    </div>
                </div>
            </el-col>
            <el-col :span="24" class="marginT10" v-else>
                <div class="base-info">
                    <div class="title">
                        付款信息
                    </div>
                    <div class="marginT10 tips">
                        <SNTag type="warning" :text="tishiText" />
                        <p class="marginT10 coustom">如有疑问,请联系客服：{{list.account.phone}}</p>
                    </div>
                    <div class="info">
                        <namedcomp compName="开户名">
                            <span slot="component">{{list.account.name}}</span>
                        </namedcomp>
                        <namedcomp compName="开户银行">
                            <span slot="component">{{list.account.bank}}</span>
                        </namedcomp>
                        <namedcomp compName="账号">
                            <span slot="component">{{list.account.number}}</span>
                        </namedcomp>
                        <namedcomp compName="金额">
                            <span slot="component" class="red">¥{{list.orderAmount}}</span>
                        </namedcomp>
                    </div>
                </div>
            </el-col>
        </el-row>
        
    </div>
</template>
<script>
  import orderHandler from "bislibs/requestHandler/orderhandler";
  const SNTag = () => import("biscomponents/home/sn-tag.vue");
  export default {
    components: {
        SNTag,
    },
    data() {
      return {
        list:{
          account:{
            phone:'',
            name:'',
            bank:'',
            number:'',
            }
        },//订单信息
        skuList:[],//商品信息
        tishiText:'为确保活动正常进行，请将订单金额转入以下对公账户。如已与本公司签订活动合作协议的，请参考协议条款完成付款事宜',
        approveStatus:this.$route.query.approveStatus  // 订单审核状态
      };
    },
    created() {
       
    },
    mounted(){
        this.getOrderDeatil(this.$route.query.orderNo)
    },
    methods: {
        goback(){
            this.$router.go(-1)
        },
        getOrderDeatil(orderNo) {
            let _this = this;
            _this.$iLoading.show();
            let params = {
                orderNo
            };
            orderHandler
                .getOrderDetail(params)
                .then((result) => {
                    _this.$iLoading.hide();
                    if (result.resultCode === 0) {
                        _this.list = result.result
                        const {products} = _this.list
                        _this.skuList = products
                    }
                })
                .catch((e) => {
                    _this.$iLoading.hide();
                });
        }
    }
  };
</script>
<style scoped lang="less">
    .marginT10{
        margin-top: 10px;
    }
    .marginT20{
        margin-top: 20px;
    }
    .marginB20{
        margin-bottom: 20px;
    }
    .base-info{
        background-color: #fff;
        /deep/.namedcomp{
            width: 33%;
            color: #1D2129;
            .compNameA{text-align: left;color: #4E5969;}
        }
        .info{
            padding: 16px 24px;
        }
        .coustom{
            padding-left: 40px;
        }
        .tips{
            padding: 0 24px;
        }
    }
    .top{
        background-color: #fff;
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 54px;
    }
    .detailTitle{
        display: flex;
        align-items: center;
        height: 24px;
        .el-icon-arrow-left{
            height: 24px;
            line-height: 24px;
            font-size: 16px;
            margin-left: 24px;
        }
        .text{
            margin-left: 10px;
            font-size: 16px;
            font-weight: bold;
            color: #1d2129;
        }
    }
    .order-money{
        font-size: 14px;
        font-weight: 600;
        color: #1d2129;
        line-height: 24px;
        display: flex;
        margin-right: 24px;
        justify-content: flex-end;
        .money{
            height: 24px;
            font-size: 18px;
            font-weight: bold;
            text-align: right;
            color: #f76560;
            line-height: 24px
        }
    }
    .title{
        width: 100%;
        height: 43px;
        font-size: 14px;
        font-family: PingFangSC, PingFangSC-Medium;
        font-weight: 600;
        color: #1d2129;
        padding: 12px 24px 0 24px;
        border-bottom: 1px solid #f2f3f5;
    }
    .goods{
         display: flex;
         align-items: center;
         .goodsName{
            margin-left: 10px;
            width: 200px;
            word-break: break-all;
            text-overflow: ellipsis;
            display: -webkit-box;
            overflow: hidden;
            /*! autoprefixer: off; */
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
         }
    }
    .img {
        height: 70px;
        width: 70px;
        padding: 3px;
    }
    .red{
        color: red;
    }
    
</style>