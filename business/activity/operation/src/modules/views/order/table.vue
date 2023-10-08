<template>
  <div>
      <el-row>
        <el-col :span="24" class="tableList">
            <el-table
                stripe
                class="list-table"
                max-height="720"
                :data="dataList"
                :highlight-current-row="true"
                @filter-change="filterChange"
                :header-cell-style="{ background: '#f7f8fa' }"
                style="
                    width: 100%;
                    border: 1px solid #ebeef5;
                    border-bottom: 0;
                "
             >

                <template v-for="(item,index) in tableHead">
                  <el-table-column
                    :prop="item.prop"
                    :label="item.label"
                    :min-width="item.minwidth||undefined"
                    :width="item.width||undefined"
                    :key="`${item.prop}${index}`"
                    :column-key="item.prop"
                    :filter-multiple="false"
                    :filters="item.prop=='approveResult'?[{text: '已通过', value: 'PASS'}, {text: '已拒绝', value: 'NOT_PASS'}]:undefined"
                  >
                      <template slot-scope="scope">
                        <template v-if='item.prop=="goods_info"'>
                          <el-popover trigger="hover" placement="top">
                            <p v-for="(e,i) in scope.row.products" :key="i" class="hover_goods">
                              <span class="hover_goods_left">{{e.skuName}}</span>
                              <span class="hover_goods_right">¥{{e.salePrice}}*{{e.number}}</span>
                            </p>
                             <div slot="reference" class="sku">
                                <span class="sku_name">{{ scope.row.products[0]&&scope.row.products[0].skuName | filterskuName }}</span><span class="sku_info">{{scope.row.products.length>1?'等':''}}{{scope.row.products.length}}个商品</span>
                            </div>
                          </el-popover>
                        </template>
                        <template v-else-if='item.prop=="approveResult"'>
                            <span class="circleDot" :class='[scope.row.approveResult=="PASS"?"success_color":"reject_color"]'></span>
                            <span>{{scope.row.approveResult=='PASS'?'已通过':'已拒绝'}}</span>
                        </template>
                        <template v-else-if='item.prop=="payStatus"'>
                            <span class="circleDot" :class='[scope.row.payStatus=="PAID"?"success_color":"reject_color"]'></span>
                            <span>{{scope.row.payStatus=='PAID'?'已支付':'未支付'}}</span>
                        </template>
                        <template v-else-if='item.prop=="orderAmount"'>
                            <div>¥{{scope.row.orderAmount}}</div>
                        </template>
                         <template v-else-if='item.prop=="payType"'>
                            <span>{{scope.row.payType=='OFFLINE'?'线下':'线上'}}</span>
                        </template>
                        <template v-else-if='item.prop=="createTime"'>
                            <div>{{scope.row.createTime | filterTime}}</div>
                        </template>
                        <template v-else>
                          {{ scope.row[item.prop] }}
                        </template>
                      </template>
                  </el-table-column>
                </template>
                <el-table-column
                    prop=""
                    label="操作"
                    width="80"
                >
                  <template slot-scope="scope">
                      <div
                          class="active"
                          @click="showDetail(scope.row)"
                      >
                          详情
                      </div>
                    </template>
                </el-table-column>
             </el-table>
        </el-col>
        <el-col :span="24" class="pagebox">
            <el-pagination
                background
                v-if="totals"
                @size-change="changePageSize"
                @current-change="onPageChange"
                :current-page="currentPage"
                :page-sizes="pageSizeOpt"
                :page-size="pageSize"
                layout="total, prev, pager, next, jumper,sizes"
                :total="totals"
            >
            </el-pagination>
          </el-col>
      </el-row>
  </div>
</template>
<script>
  import orderHandler from "bislibs/requestHandler/orderHandler";
  import moment from "moment";
  export default {
    props:{
      tableHead:{
        type:Array,
        default:[]
      },
      approveStatus:{
        type:String,
        default:'UNAPPROVED'
      }
    },
    data() {
      return {
        dataList: [],
        pageSizeOpt:[10, 20, 30, 40, 50, 100],
        totals: 0,
        pageSize: 10,
        currentPage: 1,
        searchForm:{}
      };
    },
    filters:{
        filterTime(val){ 
            return val && moment(val).format("YYYY/MM/DD HH:mm")  
        },
        filterskuName(val){ 
            return val && val.length>5? val.slice(0, 5)+'...' : (val||'')
        }
    },
    created() {
       
    },
    mounted(){

        this.getOrderList()
    },
    methods: {

      filterChange(filters){
        let key = Object.keys(filters)[0];
        let value = filters[key][0]
        if(value){
          this.searchForm = {
            approveResult:value
          }
        }else{
           this.searchForm = {}
        }
        this.currentPage = 1
        this.getOrderList()
      },
      showDetail(data) {
            let puhsTarget = {
                path: "/order/detail",
                query: {orderNo :data.orderNo,approveStatus:data.approveStatus},
            };
            this.$router.push(puhsTarget);
      },
      getOrderList(page) {
            let _this = this;
            _this.$iLoading.show();
            page && page.pageIndex && (_this.currentPage = page.pageIndex)
            let params = {
                pageIndex: _this.currentPage,
                pageSize: _this.pageSize,
                approveStatus:_this.approveStatus
            };
            let json = Object.assign(params,_this.searchForm)
            orderHandler
                .getOrderList(json)
                .then((result) => {
                    _this.$iLoading.hide();
                    if (result.resultCode === 0) {
                        _this.dataList = result.result.orders;
                       
                        _this.totals = result.result.total;
                    }
                })
                .catch((e) => {
                    _this.$iLoading.hide();
                });
        },
        onPageChange(currentPage) {
            let _this = this;
            _this.currentPage = currentPage;
            _this.getOrderList();
        },
        changePageSize(pageSize) {
            let _this = this;
             _this.currentPage = 1
            _this.pageSize = pageSize;
            _this.getOrderList();
        },
    }
  };
</script>
<style scoped lang="less">
  .tableList {
   
  }
  .active{
    cursor: pointer;
    color: #409EFF;
  }
  .pagebox {
    text-align: right;
    padding-top: 20px;
  }
  .hover_goods{
    width: 240px;
    display: flex;
    justify-content: space-between;
    .hover_goods_left,hover_goods_right{
      width: 100px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
  .sku{
    display: flex;
    // .sku_name{
    //   flex: 1;
    //   overflow: hidden;
    //   text-overflow: ellipsis;
    //   white-space: nowrap;
    // }
    // .sku_info{
    //   flex: 20px;
    // }
  }

  .circleDot{
      margin-bottom: 2px;
      display: inline-block;
      width: 6px;
      height: 6px;
      border-radius: 6px;
      background: rgb(209, 28, 28);
  }
  .success_color{
    background: #23C343;
  }
  .reject_color{
    background: #F76560;
  }
  
</style>