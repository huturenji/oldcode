<template>
  <div class="pool-container">

    <div class="btn-wrapper" v-show="isShowAssociate">
      <el-button class="btn" type="primary" @click="navToAssociate">关联商品池</el-button>
    </div>

    <el-table :header-cell-style="tableHeadStyle" :data="listData" max-height="520" v-show="isShowModal">
      <template v-slot:empty>
        <el-empty class="empty-image-wrapper" :image="emptyImage" :description="emptyDescription"></el-empty>
      </template>
      <el-table-column prop="index" label="序号" min-width="80" :show-overflow-tooltip="true">
      </el-table-column>
      <el-table-column prop="poolId" label="商品池ID">
      </el-table-column>
      <el-table-column prop="poolName" label="商品池名称">
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button @click="navToDetail(scope.row)" type="text" size="small">详情</el-button>
        </template>
      </el-table-column>
    </el-table>


    <div class="pagination-wrapper" v-show="isShowModal">
      <el-pagination v-show="listData.length" @size-change="pageSizeChange" @current-change="pageIndexChange"
        @prev-click="pageIndexChange" @next-click="pageIndexChange" background
        layout="total, sizes, prev, pager, next, jumper" :total="pageObj.total" :page-size="pageObj.pageSize">
      </el-pagination>
    </div>
    <noAuth :isShowModal="!isShowModal" />
  </div>
</template>

<script>

import goodshandler from "bislibs/requestHandler/goodshandler";
import {eventlistenerhandler } from "opcl";
import noAuth from "biscomponents/customer/noAuth.vue";

export default {
  components: {
        noAuth
  },
  created() {
    this.seeProductPool();
    this.associateProductPool();
    if (this.isShowModal){
        this.getGoodsPoolList()
    }
  },
  data() {
    return {
      listData: [], // 表格展示列表数据
      pageObj: {
        pageSize: 10,
        pageIndex: 1,
        total: 0,
      },
      emptyDescription: '暂无数据',
      emptyImage: require('assets/img_defpage_nocontent@2x.png'),

      tableHeadStyle: { background: '#f7f8fa' },
      isShowModal:true, //判断是否有权限查看商品池
      isShowAssociate:true //判断是否有权限关联商品池
    }
  },
  methods: {
    // 判断是否有权限查看活动列表
    seeProductPool() {
        this.isShowModal = eventlistenerhandler.hasAuth('seeProductPool');
    },
    // 判断是否有权限关联商品池
    associateProductPool() {
        this.isShowAssociate = eventlistenerhandler.hasAuth('associateProductPool');
    },
    getGoodsPoolList() {
      const params = {
        pageIndex: this.pageObj.pageIndex,
        pageSize: this.pageObj.pageSize
      };

      this.$iLoading.show();
      goodshandler.listProductPool(params).then(res => {

        if (res.resultCode === 0) {
          const { pageIndex, pageSize, total, productPoolList } = res.result;
          // 为列表添加索引
          this.listData = productPoolList.map((product, index) => {
            return { ...product, index: (pageIndex - 1) * pageSize + index + 1 }
          });

          Object.assign(this.pageObj, { pageSize, pageIndex, total })
        }

      }).catch((e) => {

        console.error(e);
      }).finally(() => {

        this.$iLoading.hide();
      })
    },
    // 检出商品池详情
    navToDetail({ poolId }) {
      this.$router.push({ path: "/goods/pool/detail", query: { poolId } })
    },
    pageSizeChange(pageSize) {
      this.pageObj.pageSize = pageSize
      this.getGoodsPoolList()
    },
    pageIndexChange(pageIndex) {
      this.pageObj.pageIndex = pageIndex
      this.getGoodsPoolList()
    },
    // 跳转到商品池关联页面
    navToAssociate() {
      this.$router.push({ name: 'goodspoolAssociate' })
    }
  }

}
</script>

<style scoped lang="less">
.pool-container {
  height: 100%;
  background-color: #fff;
}

.btn {
  margin: 24px 24px 12px;
  padding: 5px 10px;
  border: 0px;
  width: 102px;
  height: 32px;
  border-radius: 2px;
}

.empty-image-wrapper {
  height: 520px;
}

.pagination-wrapper {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  height: 72px;

  .el-pagination {
    margin: 10px 0 30px;
  }
}
</style>