<template>
  <div>
    <group>
      <cell title="退票手续费" :value="refundDetail.RefPoundage"></cell>
      <cell title="应退金额/实退金额" :value="amount"></cell>
      <cell title="退票状态" :value="strStatus(refundDetail.OrderStatus)"></cell>
      <cell title="退票订单号" :value="refundDetail.RefundNo"></cell>
      <cell title="退票原因" value-align="left"  :value="refundDetail.OpRemark"></cell>
      <cell title="申请时间" :value="handleDate(refundDetail.OpTime)"></cell>
      <cell title="退票时间" :value="strRefDate(refundDetail)"></cell>
    </group>
  </div>
</template>

<script>
  import trainHandler from 'trainHandler/common/lib/trainHandler.js';
  import {
    Group,
    Cell,
  } from 'vux';
  let OrderNO = '';
  let Price = '';
  export default {
    mixins: [trainHandler.mixin.tChatEventMixin],
    components: {
      Group,
      Cell,
    },
    data: function () {
      return {
        refundDetail: '',
        amount: '',
      }
    },
    created: function () {
      const that = this;

      //注册并监听t信返回事件
    //   sinosdk.sino.onBack(function(){
    //     that.$router.back();   
    //   }.bind(this),that);      
      
      that.$emit('showOff', true);
    //   trainHandler.reFreshPage(()=>{
	//       that.getRefundDatail();
    //   });             
      
      OrderNO = that.$route.query.orderNo;
      Price = that.$route.query.price;
      that.getRefundDatail();
    },
    mounted: function () {
      const that = this;
    },
    updated: function () {},
    beforeDestory: function () {

    },
    methods: {
        goBackFun(){
            const that = this;
            that.$router.back();
        },
      strRefDate(refundDetail) {
        const that = this;
        let str = '无';
        if (!(refundDetail.OrderStatus == 4 || refundDetail.OrderStatus == 5)) {
          str = that.handleDate(refundDetail.RefDate);
        }
        return str
      },
      strStatus(type) {
        const that = this;
        let str = '';
        switch (type) {
          case 1:
            str = '申请中';
            break;
          case 2:
            str = '处理中';
            break;
          case 3:
            str = '已退票';
            break;
          case 4:
            str = '不能退票';
            break;
          case 5:
            str = '已取消';
            break;
          case 6:
            str = '退款中';
            break;
          default:
            str = '其他'
        }
        return str
      },
      handleDate(date) {
        const that = this;
        let str = '';
        if (!!date && new Date(date).getTime() > 0) {
          const timeZone = new Date().getTimezoneOffset() / 60;
          if (new Date(date.split('T')).getTime() > 0) {
            date = date.split('T');
            str = new Date(date).format('yyyy/MM/dd HH:mm:ss')
          } else {
            str = new Date(new Date(date).getTime() + timeZone * 3600000).format('yyyy/MM/dd HH:mm:ss')
          }
        } else {
          str = '待确认'
        }
        return str;
      },
      getRefundDatail() {
        const that = this;
        const url = "train/getRefundOrderDetail";
        const obj = {
            "RefOrderNo": OrderNO
        };
        trainHandler.apiCallHandler(url, obj, 'POST', true).then((res) => {
          console.log(res);
          if (res.resultCode == 0) {
            that.refundDetail = res.result.RefundOrder;
            that.amount = Price + '/' + that.refundDetail.RefAmount
          } else {
            trainHandler.showToast(res.rdesc)
          }
        })
      }
    }
  }
</script>
<style scoped lang="less">
 @import './refundDetail.less';
</style>