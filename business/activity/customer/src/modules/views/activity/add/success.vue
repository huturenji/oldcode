<template>
<div class="warp">
    <div class="onlineWarp" v-if="!!orderNo">
        <i class="el-icon-success"></i>
        <div class="success">创建成功</div>
        <div class="xieyi">
            <i class="el-icon-warning"></i>
            <div class="title">为确保活动正常进行，请将订单金额转入以下对公账户。如已与本公司签订活动合作协议的，请参考协议条款完成付款事宜。</div>
        </div>
        <div class="kefu">如有疑问，请联系客服：{{orderInfo.account.phone}}</div>
        <div class="infoWarp">
            <div class="key">开户名</div>
            <div class="value">{{orderInfo.account.name}}</div>
        </div>
        <div class="infoWarp">
            <div class="key">开户银行</div>
            <div class="value">{{orderInfo.account.bank}}</div>
        </div>
        <div class="infoWarp">
            <div class="key">账号</div>
            <div class="value">{{orderInfo.account.number}}</div>
        </div>
        <div class="infoWarp">
            <div class="key">金额</div>
            <div class="value last">
                <div class="price">￥</div>
                <div class="price num">{{orderInfo.orderAmount?orderInfo.orderAmount.toFixed(2):"0.00"}}</div>
            </div>
        </div>
        <div class="ok" @click="toDetail">确定</div>
    </div>
    <div class="offlineWarp" v-else>
        <i class="el-icon-success"></i>
        <div class="success">创建成功</div>
        <div class="ok offOk" @click="toDetail">确定</div>
    </div>
</div>
</template>
<script>
import { utils } from "opcl";
import apihandler from "bislibs/requestHandler/activityhandler";

export default {
  data() {
    return {
      orderInfo:{
        account:{
          phone:'',
          name:'',
          bank:'',
          number:'',
        }
      },
      orderNo :this.$route.query.orderId,
    };
  },
  created() {},
  mounted() {
    if(!!this.orderNo) this.detailOrder();
  },
  computed:{},
  methods: {
    //获取活动订单详情
    detailOrder() {
      let that = this;
      let reqData = {
            orderNo: that.orderNo
        };
      that.$iLoading.show();
      apihandler
        .detailOrder(reqData)
        .then((result) => {
          if (!!result && result.resultCode == 0) {
            that.orderInfo = result.result;
          }
        // console.log(that.orderInfo);
        })
        .catch((err) => {
          console.log(err);
          that.orderInfo = {
                  "account": {
                    "name": "string",
                    "bank": "string",
                    "number": "string"
                }
              }
        }).finally(() => {
            that.$iLoading.hide();
        });
    },
    /**
     * 跳转到详情
     */
    toDetail() {
        this.$router.push({
            path: "/activity/detail",
            query: {
                activityId: utils.getStorage("customer_activityId")
            }
        });
    },
  },
};
</script>
<style lang="less" scoped>
.el-icon-success{
    width: 63px;
    height: 63px;
    font-size: 63px;
    color: #23c343;
}
.warp{
    width: 100%;height: 100%;
    padding-top: 20px;
    padding-bottom: 10px;
    background: #fff;
    .onlineWarp,.offlineWarp{
        width: 100%;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
        .success{
            margin-top: 10px;
            font-size: 18px;
            font-weight: 600;
            color: #222;
        }
        img{
            width: 300px;
            height: 170px;
            margin-bottom: 10px;
        }
        .xieyi{
            width: 826px;
            height: 40px;
            background: #fff7e8;
            border: 1px solid #ff9a2e;
            border-radius: 2px;
            padding: 10px 16px;
            margin-top: 16px;
            display: flex;
            justify-content: center;
            .el-icon-warning{
                height: 20px;
                line-height: 20px;
                font-size: 14px;
                color:#ff9a2e;
            }
            .title{
                height: 20px;
                line-height: 20px;
            }
        }
        .kefu{
            margin: 25px 0 10px 0;
            color:#4e5969;
            font-size: 14px;
        }
        .infoWarp{
            margin-top: 16px;
            display: flex;
            width: 300px;
            .key{
                width:100px;
                text-align: left;
                color:#4e5969;
            }
            .value{
                flex: 1;
                color: #1d2129;
            }
            .last{
                height: 30px;
                display: flex;
                align-items: baseline;
                .price{
                    color: #F76560;
                    font-size: 14px;
                } 
                .num{
                    font-size: 20px;
                }   
            }
        }
        .ok{
            margin-top:40px;
            width: 60px;
            height: 32px;
            background: #409eff;
            border-radius: 2px;
            color: #fff;
            line-height: 32px;
            text-align: center;
            cursor: pointer;
        }
        // .ok:hover{
        //     background-color: #666;
        // }
        .offOk{
            margin-top: 32px;
        }
    }
}
</style>