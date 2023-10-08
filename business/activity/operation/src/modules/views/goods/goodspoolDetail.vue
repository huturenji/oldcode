<template>
  <div class="pool-detail">
    <div class="title">
      <div>
        <p>商品池ID</p>
        <p>商品池名称</p>
      </div>
      <div>
        <p>{{ poolId }}</p>
        <p>{{ poolName }}</p>
      </div>
    </div>
    <div class="table">
      <GoodsTable :productItem="productItem"></GoodsTable>
    </div>

    <el-row type="flex" justify="end" class="pagination-wrapper">
      <el-pagination v-show="productList.length" @size-change="pageSizeChange" @current-change="pageIndexChange"
        @prev-click="pageIndexChange" @next-click="pageIndexChange" background
        layout="total, sizes, prev, pager, next, jumper" :total="pageObj.total" :pageSize="pageObj.pageSize"
        :pageCount="pageCount" :pageIndex="pageObj.pageIndex">
      </el-pagination>
    </el-row>
    <el-card shadow="always" class="cancel" v-if="isShowAssociate">
      <el-button @click="open" type="primary">取消关联</el-button>
    </el-card>
    <noAuth :isShowModal="!isShowModal" />
  </div>
</template>

<script>
import GoodsTable from './goodsTable.vue';
import goodshandler from "bislibs/requestHandler/goodshandler";
import { eventlistenerhandler } from "opcl";
const { userInfo } = goodshandler
export default {
  components: { GoodsTable },
  data() {
    return {
      poolId: '',
      poolName: '',
      productList: [],
      pageObj: {
        pageSize: 10,
        pageIndex: 1,
        total: 0,
        pageCount: ' ',
        isShowAssociate: true, //判断是否有权限关联商品池
        isShowModal: true //判断是否有权限查看活动列表
      },
    }
  },
  mounted() {
    this.seeProductPool();
    this.associateProductPool();
    this.getGoodsListByPoolId()
  },
  methods: {
    // 判断是否有权限关联商品池
    associateProductPool() {
      this.isShowAssociate = eventlistenerhandler.hasAuth('associateProductPool');
    },
    // 判断是否有权限查看活动列表
    seeProductPool() {
      this.isShowModal = eventlistenerhandler.hasAuth('seeProductPool');
    },
    getGoodsListByPoolId() {
      this.$iLoading.show();
      this.poolId = this.$route.query.poolId
      let param = { poolId: this.poolId, pageIndex: this.pageObj.pageIndex, pageSize: this.pageObj.pageSize }
      goodshandler.listProduct(param).then(res => {
       
        const { pageIndex, pageSize, total, poolId, poolName, productList, pageCount } = res.result;
        this.pageObj.currentPage = pageIndex
        this.pageObj.pageSize = pageSize
        this.pageObj.total = total
        this.poolId = poolId
        this.poolName = poolName
        this.productList = productList
        this.pageCount = pageCount
        this.productList.forEach(element => {
          element.settlePrice = "￥" + element.settlePrice
        });
        //给每条数据添加序号
        this.productItem = []
        this.productList.forEach((item, index) => {
          this.productItem.push(
            { ...item, 'index': pageSize * (pageIndex - 1) + index + 1 }
          )
        });
       
        this.index = this.pageSize * (requestData.pageIndex - 1) + index + 1
        this.$iLoading.hide()
      }).catch((err) => {
        this.$iLoading.hide()
        console.log(err)
      })
    },

    pageSizeChange(pageSize) {
      this.pageObj.pageSize = pageSize
      this.getGoodsListByPoolId(pageSize)
    },
    pageIndexChange(pageIndex) {
      this.pageObj.pageIndex = pageIndex
      this.getGoodsListByPoolId(pageIndex)
    },
    open() {
      this.$confirm('确认取消关联?', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        center: true,
        lockScroll: true,
        type: 'info '
      }).then(() => {
        this.$message({
          type: 'success',
          message: '取消关联成功!'
        });
        this.cancelAssociate()
      }).catch(() => {

      });
    },
    cancelAssociate() {

      const params = {
        poolId: this.poolId,
        poolName: this.poolName,
        bind: false,
        operatorId: userInfo.userId,
        operatorName: userInfo.mgrName,
      }
      this.$iLoading.show();
      goodshandler.bindProductPool(params).then(res => {
        if (res.resultCode === 0) {
          this.$iLoading.hide();
          this.$router.push({ path: '/goods/pool' })
        }
      }).catch(() => {
        this.$message.error(res.resultMessage)
        this.$iLoading.hide();
      })
    },
  }
} 
</script>

<style scoped>
.el-table__body-detail {
  height: auto !important;
}

.pool-detail {
  background-color: rgb(242, 243, 245);

}

.title {

  background-color: #FFF;
  padding: 10px;
  height: 104px;
  display: flex;
  align-items: center;

}

.title p {
  margin: 15px;
}

.table {
  max-height: 616px;
  padding: 24px 0px 0px 0px;
  width: 100%;
  background-color: #FFF;
  margin-top: 20px;
}



p {
  margin-top: 10px;
  display: flex;
  width: 150px;
  justify-content: space-between;
  text-align: left;
}

el-pagination::v-deep {
  padding-right: 10px;
}

.pagination-wrapper {
  padding: 20px 0 20px;
  margin-bottom: 82px;
  background: #FFF;
}

.cancel {
  width: calc(100vw - 200px);
  position: fixed;
  bottom: 0px;
  display: flex;
  left: 200px;
  justify-content: center;
}
</style>