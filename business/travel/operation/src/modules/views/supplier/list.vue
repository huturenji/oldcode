<template>
  <div class="marketPage">
    <div class="header">
      <div>
        <div class="title">供应商配置</div>
      </div>
    </div>
    <div class="headerTips">
      <div class="smallTip">小贴士</div>
      <div class="tip" v-for="item in tipArr" :key="item">{{item}}</div>
    </div>
    <div v-if="isLoadData" class="loading-container">
      <span>数据加载中...</span>
    </div>
    <div class="list">
      <div class="listTitle">
        <div
          class="listTitleCell"
          v-for="(item) in listTitles"
          :key="item.name"
          :title="item.name"
        >{{item.name}}</div>
      </div>
      <div class="listItem cursorp" v-for="(item,index) in supplierList" :key="item.notifyRuleId">
        <div class="itemFirstLine">
          <div class="itemFirstLineCell">{{index+1}}</div>
          <div class="itemFirstLineCell">{{item.providerTypeDesc}}</div>
          <div class="itemFirstLineCell">{{item.bizTypeDesc}}</div>
          <div class="itemFirstLineCell">
            <div class="imgDivT" v-if="item.enabled" @click="switchEnable(item)" />
            <div class="imgDivF" v-else @click="switchEnable(item)" />
          </div>
          <!-- <div class="itemFirstLineCell">
            <div class="imgDivT" v-if="item.automatic" @click="switchAutomatic(item)" />
            <div class="imgDivF" v-else @click="switchAutomatic(item)" />
          </div> -->
        </div>
      </div>
      <page :page="page" @turnPage="turnPage" v-if="supplierList && supplierList.length>0"></page>
    </div>
  </div>
</template>
<script>
import  * as travelfun from "bislibs/traveloperationfun.js";
import page from "components/page/page";
import tmHandler from "bislibs/requesthandler/traveloperationhandler.js";
export default {
  components: {
    page
  },
  data() {
    return {
      listTitles: [
        {
          name: "编号"
        },
        {
          name: "供应商"
        },
        {
          name: "业务类型"
        },
        {
          name: "是否启用此供应商"
        },
        // {
        //   name: "自动出票"
        // }
      ],
      supplierList: [],
      page: {
        pageSize: 20,
        currPage: 1,
        pageCount: 1,
        totalRecord: 0
      },
      tipArr: ["1、火车票只能启用一个供应商。"]
    };
  },
  created() {
    this.getDataList();
  },
  methods: {
    /**
     * 指定页码翻页跳转
     * @param newPageNum 页码
     */
    turnPage(newPageNum) {
      this.page.currPage = parseInt(newPageNum);
    },
    /**
     *分页查询供应商配置
     */
    getDataList() {
      let that = this;
      let request = {
        pageSize: that.page.pageSize,
        pageNumber: that.page.currPage
      };
      tmHandler.queryOnlineProviderRules(request).then(res => {
        if (0 == res.resultCode && !!res.result.data) {
          let tempList = res.result.data;
          tempList &&
            tempList.sort(function(order1, order2) {
              let time1 = order1 && order1.bizType;
              let time2 = order2 && order2.bizType;
              return time1.localeCompare(time2);
            });
          that.supplierList = tempList;
          that.page.totalRecord =
            res.result.totalNumber || res.result.data.length;
          that.page.pageCount = res.result.totalPage || 1;
        }
      });
    },
    /**
     * 启用关闭此类型供应商
     */
    switchEnable(item) {
      let that = this;
      var enableNum = 0; //该业务启用的个数
      //点击关闭/启用按钮时提示
      if (item.enabled) {
        //如果停用当前业务的最后一个供应商给提示
        for (var i = 0; i < that.supplierList.length; i++) {
          if (
            that.supplierList[i].bizType == item.bizType &&
            that.supplierList[i].enabled == true
          ) {
            enableNum++;
          }
        }
        //判断是否当前业务最后一个启用的供应商
        if (enableNum == 1) {
          travelfun.showConfirm(
            "这个是" +
              item.bizTypeDesc +
              "启用的最后一个供应商，停用后该业务的前端小应用将没有产品信息",
            function() {
              that.switchProvider(item);
            },
            2,
            "取消",
            "确定",
            null,
            function() {},
            true
          );
        } else {
          travelfun.showConfirm(
            "停用后前端小应用将不展示此供应商的产品信息。",
            function() {
              that.switchProvider(item);
            },
            2,
            "取消",
            "确定",
            null,
            function() {},
            true
          );
        }
      } else {
        travelfun.showConfirm(
          "启用后前端小应用将展示此供应商的产品信息。",
          function() {
            that.switchProvider(item);
          },
          2,
          "取消",
          "确定",
          null,
          function() {},
          true
        );
      }
    },
    /**
     * 启用关闭供应商
     */
    switchProvider(val) {
      let that = this;
      tmHandler
        .switchProviderGrayRule({
          grayRuleId: val.grayRuleId,
          enabled: !val.enabled
        })
        .then(res => {
          if (0 == res.resultCode && res.result && res.result.grayRuleId) {
            //局部刷新，修改是否启用字段，不要重新拉取数据，可能导致数据列表不一致。
            (val.enabled = !val.enabled), that.$forceUpdate();
          } else {
            utils.showToast(data.resultMessage || "操作失败");
          }
        })
        .catch(e => {
          utils.showToast("操作失败");
        });
    },
    /**
     * 切换是否自动出票
     */
    // switchAutomatic(item) {
    //   const that = this;
    //   that.loading = true;
    //   tmHandler
    //     .switchProviderAutomatic({
    //       grayRuleId: item.grayRuleId,
    //       automatic: !item.automatic
    //     })
    //     .then(function(res) {
    //       that.loading = false;
    //       if (0 == res.resultCode && res.result && res.result.grayRuleId) {
    //         //局部刷新，修改是否启用字段，不要重新拉取数据，可能导致数据列表不一致。
    //         (item.automatic = !item.automatic), that.$forceUpdate();
    //       } else {
    //         utils.showToast(data.resultMessage || "操作失败");
    //       }
    //     })
    //     .catch(e => {
    //       that.loading = false;
    //       utils.showToast("操作失败");
    //     });
    // }
  }
};
</script>
<style lang='less' scoped>
@import "list.less";
</style>