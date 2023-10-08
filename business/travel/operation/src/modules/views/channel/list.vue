<template>
  <div class="channel-list-content">
    <div class="head-panel">
      <div>
        <div class="title">分销渠道管理</div>
        <div class="count">当前分销渠道数量：{{page.totalRecord}}</div>
      </div>
      <div class="add-btn cursorp" @click="addChannel">新增分销渠道</div>
    </div>

    <div class="list-container">
      <div class="notifySearch">
        <div class="notifyName">渠道名称</div>
        <div class="notifyInput">
          <Input type="text" placeholder="请输入渠道名称" v-model.trim="searchKey" maxlength="64" clearable />
        </div>
        <div class="notifySearchBtn">
          <button @click="searchList()">查询</button>
        </div>
      </div>
      <template v-if="!loading && !!channelArr && channelArr.length>0">
        <div class="table">
          <!-- <div class="head-row">
                <div cloumn="2">APP渠道</div>
                <div cloumn="1">渠道ID</div>
                <div cloumn="1">应用ID</div>
                <div cloumn="1">应用密钥</div>
                <div cloumn="2">授权认证请求路径</div>
                <div cloumn="2">消息推送路径</div>
                <div cloumn="2">审批去申请路径</div>                
                <div cloumn="3">支付方式</div>
                <div cloumn="2">操作</div>
          </div>-->

          <div class="table-body">
            <div class="content-row" v-for="channel in channelArr" :key="channel.channelId">
              <div cloumn="2">
                <div class="boxTitle">渠道名称</div>
                <div class="boxContent1">{{channel.channelName}}</div>
              </div>
              <div cloumn="4">
                <div class="boxTitle">渠道配置</div>
                <div class="boxContent">
                  <div class="configLine" v-for="config in channel.baseConfig" :key="config">
                    <div>{{config.uiName}}：</div>
                    <div>
                      <Tooltip
                        :content="config.value && config.value.toString()"
                        placement="bottom"
                        :transfer="true"
                      >
                        <div class="no-wrap">{{config.value}}</div>
                      </Tooltip>
                    </div>
                  </div>
                </div>
              </div>
              <div cloumn="2">
                <div class="boxTitle">是否启用</div>
                <div class="boxContent">
                  <div class="configLine">
                    <div class="imgDivT" v-if="channel.state=='1'" @click="switchEnableDialog(channel)" />
                    <div class="imgDivF" v-else @click="switchEnableDialog(channel)" />
                  </div>
                </div>
              </div>
              <div cloumn="1">
                <div class="boxTitle">编辑时间</div>
                <div class="boxContent2">{{channel.editTime}}</div>
              </div>
              <div cloumn="1">
                <div class="operationEdit">
                  <a
                    href="javascript:void(0);"
                    class="link-btn edit-btn cursorp"
                    @click.stop="editChannel(channel.channelId)"
                  >编辑</a>
                </div>
                <div class="delBtnWrapper">
                  <a
                    href="javascript:void(0);"
                    class="link-btn del-btn cursorp"
                    @click.stop="delChannelDialog(channel, true, $event)"
                  >删除</a>
                  <div class="dialogShow" v-show="channel.isDelDialog">
                    <div class="title">删除后该APP渠道将无法使用商旅通服务，确定删除?</div>
                    <div class="btns">
                      <span
                        class="cursorp"
                        @click.stop="delChannelDialog(channel ,false, $event)"
                      >取消</span>
                      <span class="cursorp" @click.stop="delChannel(channel)">确定</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <page :page="page" @turnPage="turnPage"></page>
      </template>
      <template v-else-if="!loading">
        <div class="empty-message">
          <i class="icon"></i>
          {{!!searchKey?'暂无数据':'您尚未添加分销渠道'}}
          <div v-if="!searchKey" class="link-add-btn cursorp" @click="addChannel">新增分销渠道</div>
        </div>
      </template>
      <div v-else class="loading-container">
        <span>数据加载中...</span>
      </div>
    </div>
  </div>
</template>

<script>
import tmHandler from "bislibs/requesthandler/traveloperationhandler.js";
import utils from "bislibs/utils";
import  * as travelfun from "bislibs/traveloperationfun.js";
import page from "components/page/page";
export default {
  components: {
    page
  },
  data() {
    return {
      loading: false,
      searchKey: "", //搜索关键字
      channelArr: [], //渠道列表
      page: {
        //查询条件
        pageSize: 10,
        currPage: 1,
        pageCount: 1,
        totalRecord: 0
      },
      paymentPlatformsUI: [] //处理过的支付方式列表
    };
  },
  activated() {},
  created() {},
  mounted() {
    this.getProductionChannels();
  },
  methods: {
    /**
     * 新增渠道
     */
    addChannel() {
      this.$router.push({
        path: "/channel/addChannel"
      });
    },

    /**
     * 编辑渠道
     */
    editChannel(channelId) {
      this.$router.push({
        path: "/channel/editChannel",
        query: {
          channelId: channelId
        }
      });
    },
    /**
     * 删除渠道的弹框操作
     */

    delChannelDialog(channel, value, event) {
      const that = this;
      channel.isDelDialog = value;
      for (var i = 0; i < that.channelArr.length; i++) {
        if (that.channelArr[i].channelId != channel.channelId) {
          that.channelArr[i].isDelDialog = false;
        }
      }
      // ""
      //需要强制刷新
      that.$forceUpdate();
    },
    /**
     * 删除渠道
     */
    delChannel(channel) {
      const that = this;
      that.delChannelDialog(channel, false);
      that.loading = true;
      tmHandler
        .deleteProductionChannel({
          channelId: channel.channelId
        })
        .then(function(res) {
          that.loading = false;
          if (0 == res.resultCode) {
            that.getProductionChannels();
          } else {
            utils.showToast(res.resultMessage || "删除失败");
          }
        })
        .catch(e => {
          that.loading = false;
          utils.showToast("删除失败");
          console.error("删除失败" + e);
        });
    },

    /**
     * 获取渠道数据列表
     */
    getProductionChannels(searchKey) {
      const that = this;
      let data = {
        pageSize: that.page.pageSize,
        pageNum: that.page.currPage
      };
      if (!!searchKey) {
        data.channelName = searchKey;
      }

      that.loading = true;
      tmHandler
        .getProductionChannels(data)
        .then(function(res) {
          that.loading = false;
          if (0 == res.resultCode && !!res.result) {
            let listChannel = res.result.channelInfos;

            //  拼装数据-渠道配置
            for (var i = 0; i < listChannel.length; i++) {
              var item = listChannel[i];
              item.baseConfig = [
                {
                  uiName: "渠道ID",
                  value: utils.showValueOrDeault(item.channelId)
                },
                {
                  uiName: "应用ID",
                  value: utils.showValueOrDeault(item.applicationId)
                },
                {
                  uiName: "应用密钥",
                  value: utils.showValueOrDeault(item.applicationKey)
                },
                {
                  uiName: "消息推送路径",
                  value: utils.showValueOrDeault(item.pushMessageUrl)
                },
                {
                  uiName: "授权认证请求路径",
                  value: utils.showValueOrDeault(
                    item.authorizedCertificationUrl
                  )
                },
                {
                  uiName: "审批去申请路径",
                  value: utils.showValueOrDeault(item.approveTravelUrl)
                },
                {
                  uiName: "企业发票抬头路径",
                  value: utils.showValueOrDeault(item.companyInvoiceTitleUrl)
                },                
                {
                  uiName: "产品域ID",
                  value: utils.showValueOrDeault(item.zoneId)
                }
              ];
              //编辑时间 数据拼装
              item.editTime = new Date(
                utils.showValueOrDeault(item.lastUpdateTime) * 1000
              ).format("yyyy/MM/dd HH:mm");
            }

            listChannel.sort(function(objA, objB) {
              return objB.lastUpdateTime - objA.lastUpdateTime;
            })
            //赋值UI展示列表数据
            that.channelArr = listChannel;

            that.page.totalRecord = res.result.total || 0;
            that.page.pageCount = res.result.pages || 0;
          }
        })
        .catch(() => {
          that.loading = false;
        });
    },

    /**
     * 指定页码翻页跳转
     * @param newPageNum 页码
     */
    turnPage(newPageNum) {
      this.page.currPage = parseInt(newPageNum);
      this.getProductionChannels();
    },
    getSLAList(sLAList) {
      let result = [];
      if (!!sLAList) {
        for (let i = 0; i < sLAList.length; i++) {
          var item = {
            PaymentPlatformName: sLAList[i]
          };
          result.push(item);
        }
      }
      return result;
    },
    /**
     * 获取支付方式显示的名字
     */
    getPaymentName(name1, name2) {
      return name1 + "-" + name2;
    },
    /**
     * 搜索渠道列表
     */
    searchList() {
      const that = this;

      //每次点击按妞查询，需要翻页重置
      that.page.currPage = 1;
      that.getProductionChannels(that.searchKey);
    },
    /**
     * 弹框提示框
     */
    switchEnableDialog(item) {
      let that = this;
      let content = "切换开关可能导致渠道不可用！";
      let title = "确认切换"
      travelfun.showConfirm(
        content,
        function() {
          //确定
          that.switchEnable(item);
        },
        2,
        "取消",
        "确定",
        title,
        function() {
          //取消
        },
        true
      );
    },
    /**
     * 启用关闭此渠道
     */
    switchEnable(item) {
      let that = this;
      //渠道状态(已启用=1；已停用=2)
      let updateState = item.state == "1" ? "2" : "1";
      tmHandler
        .updateChannelState({
          id: item.id,
          state: updateState,
          operator: tmHandler.userInfo
            ? tmHandler.userInfo.userName || tmHandler.userInfo.userName
            : "" //操作者
        })
        .then(res => {
          if (0 == res.resultCode) {
            //局部刷新，修改是否启用字段，不要重新拉取数据，可能导致数据列表不一致。
            (item.state = updateState), that.$forceUpdate();
          } else {
            utils.showToast(res.resultMessage || "操作失败");
          }
        })
        .catch(e => {
          utils.showToast("操作失败");
        });
    }
  }
};
</script>
<style scoped lang="less">
@import "list.less";
</style>
<style>
.ivu-tooltip-arrow {
  display: none !important;
}
/* ivu-tooltip-popper ivu-tooltip-dark */
.ivu-tooltip-inner {
  background-color: #fff !important;
  color: #191919 !important;
  border-radius: 2px;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.2);
  white-space: normal;
  word-break: break-all;
}
</style>



