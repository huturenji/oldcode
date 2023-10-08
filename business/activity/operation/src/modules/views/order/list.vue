<template>
<div>
  <div v-show="isShowModal">
      <div class="tab">
        <el-tabs v-model="approveStatus" @tab-click="handleClick">
            <el-tab-pane label="未审核" name="UNAPPROVED">
              
            </el-tab-pane>
            <el-tab-pane label="已审核" name="APPROVED">
              
            </el-tab-pane>
         </el-tabs>
      </div>
      <div class="table_area">
        <ordertable :tableHead='tableHead' :approveStatus='approveStatus' ref="retable"></ordertable>
      </div>
  </div>
  <noAuth :isShowModal="!isShowModal" />
</div>
</template>
<script>
import ordertable from "./table.vue";
import {eventlistenerhandler} from "opcl";
import noAuth from "biscomponents/customer/noAuth.vue";
  export default {
    components: {
        ordertable,
        noAuth
    },
    data() {
      return {
        approveStatus: 'UNAPPROVED',
        tableHead:[],
        tableHead1:[
            {
                label:'订单流水号',
                prop:'orderNo',
                minwidth:'60',
            },
            {
                label:'活动名称',
                prop:'activityName',
                minwidth:'60',
            },
            {
                label:'手机号',
                prop:'customerPhone',
                minwidth:'60',
            },
            {
                label:'企业名称',
                prop:'customerName',
                minwidth:'60',
            },
            {
                label:'商品信息',
                prop:'goods_info',
                minwidth:'60',
                tel:'goods_info'
            },
            {
                label:'结算方式',
                prop:'payType',
                width:'120',
            },
            {
                label:'订单创建时间',
                prop:'createTime',
                minwidth:'60',
            },
            {
                label:'订单金额',
                prop:'orderAmount',
                minwidth:'60',
            }
        ],
        tableHead2:[
          {
                label:'订单流水号',
                prop:'orderNo',
                minwidth:'60',
            },
            {
                label:'活动名称',
                prop:'activityName',
                minwidth:'60',
            },
            {
                label:'手机号',
                prop:'customerPhone',
                minwidth:'60',
            },
            {
                label:'企业名称',
                prop:'customerName',
                minwidth:'60',
            },
            {
                label:'商品信息',
                prop:'goods_info',
                minwidth:'60',
                tel:'goods_info'
            },
            {
                label:'结算方式',
                prop:'payType',
                width:'120',
            },
            {
                label:'订单创建时间',
                prop:'createTime',
                minwidth:'60',
            },
            {
                label:'订单状态',
                prop:'payStatus',
                width:'120',
            },
            {
                label:'全部状态',
                prop:'approveResult',
                width:'120',
            },
            {
                label:'订单金额',
                prop:'orderAmount',
                minwidth:'60',
            }
        ],
        isShowModal:true //判断是否有权限查看订单列表
      };
    },
    created() {
       this.tableHead = this.tableHead1
       this.seeOrder();
    },
    activated(){
      this.$nextTick(()=>{
        this.$refs.retable.getOrderList()
      })
    },
    methods: {
      // 判断是否有权限查看订单列表
      seeOrder() {
          this.isShowModal = eventlistenerhandler.hasAuth('seeOrder');
      },
      handleClick(tab, event) {
        if(tab.name=="APPROVED"){
          this.tableHead = this.tableHead2
        }else{
          this.tableHead = this.tableHead1
        }
        this.$nextTick(()=>{
          this.$refs.retable.searchForm = {}
          this.$refs.retable.getOrderList({pageIndex:1})
        })
      }
    }
  };
</script>
<style scoped lang="less">
    .tab{
      background: #fff;
      padding-left: 24px;
      padding-top: 7px;
      /deep/ .el-tabs__item{
        font-size: 16px;
      }
      /deep/ .el-tabs__nav-wrap::after{
        display: none;
      }
    }
    .table_area{
      margin-top: 12px;
      background:#fff;
      min-height: calc(100vh - 190px);
    }
</style>