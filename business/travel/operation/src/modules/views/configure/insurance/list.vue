<template>
  <div class="insuranceProductList">
    <div class="header">
      <div>
        <div class="title">保险配置</div>
      </div>
    </div>
    <div class="sortList">
      <div class="name">前端保险显示顺序</div>
      <div class="sortListComp">
        <dataSortComp :dataSource="enabledDataList" @onDataSorted="saveSortData"></dataSortComp>
      </div>
    </div>
    <div class="filterListDiv">
      <div class="notifySearch">
        <div class="notifyName">保险简称：</div>
        <div class="notifyInput">
          <Input
            type="text"
            placeholder="请输入保险简称"
            v-model.trim="insShortName"
            maxlength="64"
            :clearable="true"
          />
        </div>
        <div class="notifyName">保险全称：</div>
        <div class="notifyInput">
          <Input
            type="text"
            placeholder="请输入保险全称"
            v-model.trim="insLongName"
            maxlength="64"
            :clearable="true"
          />
        </div>
        <div class="notifyName">产品ID：</div>
        <div class="notifyInput">
          <Input
            type="text"
            placeholder="请输入产品ID"
            v-model.trim="insProdID"
            maxlength="64"
            :clearable="true"
          />
        </div>
        <div class="notifyName">保险类型：</div>
        <div class="notifyInput">
          <Input
            type="text"
            placeholder="请输入保险类型"
            v-model.trim="insProdType"
            maxlength="64"
            :clearable="true"
          />
        </div>
      </div>
      <div class="notifySearch">
        <div class="notifyName">公司名称：</div>
        <div class="notifyInput">
          <Input
            type="text"
            placeholder="请输入公司名称"
            v-model.trim="insCpyName"
            maxlength="64"
            :clearable="true"
          />
        </div>
        <div class="notifyName">启用：</div>
        <div class="notifySelete">
          <Select v-model="enableSelected">
            <Option v-for="item in enableTypes" :key="item.name" :value="item.name">{{ item.desc }}</Option>
          </Select>
        </div>
        <div class="notifySearchBtn">
          <button @click="queryUIDataList(uiListOperationTypeList[1].type)">查询</button>
        </div>
      </div>
    </div>
    <div class="listRegion">
      <div v-if="isLoadData" class="loading-container">
        <span>数据加载中...</span>
      </div>
      <div v-else class="list">
        <div class="listTitle">
          <div class="listTitleCell" v-for="(item) in listTitles" :key="item.name">{{item.name}}</div>
        </div>
        <div class="empty-message" v-if="!uiDataList || uiDataList.length==0">
          <i class="icon"></i> 未找到符合要求的信息，请重新查询
        </div>
        <div class="listItem cursorp" v-for="(item,index) in uiDataList" :key="item.productNo">
          <div class="itemFirstLine">
            <div class="itemFirstLineCell">{{index+1}}</div>
            <div class="itemFirstLineCell">
              <div class="editInput" v-if="editProductNo.indexOf(item.productNo) != -1">
                <Input type="text" v-model.trim="editProductName[index]" maxlength="64" />
              </div>
              <div v-else class="lineCell" :title="item.productShortName">{{item.productShortName}}</div>
            </div>
            <div class="itemFirstLineCell" :title="item.productName">{{item.productName}}</div>
            <div class="itemFirstLineCell">{{item.productCode}}</div>
            <div class="itemFirstLineCell">{{insTypeList[item.productType]||"---"}}</div>
            <div class="itemFirstLineCell" :title="item.companyName">{{item.companyName}}</div>
            <div class="itemFirstLineCell">{{item.farePrice}}</div>
            <div class="itemFirstLineCell">{{item.settlePrice}}</div>
            <div class="itemFirstLineCell">
              <div class="imgDivT" v-if="item.valid == 'VALID'" @click="switchAutomatic(item)" />
              <div class="imgDivF" v-else @click="switchAutomatic(item)" />
            </div>
            <div class="itemFirstLineCell">
              <span type="primary" class="notifyEdit" @click.stop="openDetail(item)">查看详情</span>
            </div>
            <div class="itemFirstLineCell">
              <span
                type="primary"
                class="notifyEdit"
                v-if="editProductNo.indexOf(item.productNo) != -1"
                @click.stop="controlEditItem(item,index)"
              >保存</span>
              <span
                type="primary"
                class="notifyEdit"
                v-else
                @click.stop="controlEditItem(item,index)"
              >编辑</span>
            </div>
          </div>
        </div>
        <page :page="page" @turnPage="turnPage" v-if="uiDataList && uiDataList.length>0"></page>
      </div>
    </div>
    <Loading :show="loading" text="加载中，请稍候"></Loading>
  </div>
</template>

<script>
import tmHandler from "bislibs/requesthandler/traveloperationhandler.js";
import utils from "bislibs/utils";
import page from "components/page/page";
const dataSortComp = () => import("./datasorting.vue");

export default {
  directives: {},
  components: {
    page,
    dataSortComp
  },
  data() {
    return {
      cacheRuleItem: "insuranceProduct",
      listTitles: [
        {
          name: "编码"
        },
        {
          name: "保险简称"
        },
        {
          name: "保险全称"
        },
        {
          name: "产品ID"
        },
        {
          name: "保险类型"
        },
        {
          name: "公司名称"
        },
        {
          name: "票面价格"
        },
        {
          name: "销售价格"
        },
        {
          name: "是否启用"
        },
        {
          name: "详情"
        },
        {
          name: "操作"
        }
      ],
      insTypeList: {
        1: "航意险",
        2: "航延险",
        3: "航意/航延险",
        4: "误机险",
        5: "交通意外险",
        6: "火车险",
        "AIRLINE_ACCIDENT_INSURANCE":"航空意外险",
        "AIRLINE_DELAY_INSURANCE":"航空延误险",
        "AIRLINE_ACCIDENT_AND_DELAY_INSURANCE":"航意航延组合险",
        "AIRLINE_MISSED_INSURANCE":"航意误机组合险",
        "ACCIDENT_INSURANCE":"交通意外险",
        "TRAIN_INSURANCE":"火车险"        
      },
      netDataList: [], //后台全量数据
      uiDataList: [], //页面显示的数据列表
      enabledDataList: [], //已启用的数据列表
      editProductNo: [], //编辑状态的数据列表
      editProductName: [], //编辑状态的输入列表
      page: {
        pageSize: 20,
        currPage: 1,
        pageCount: 1,
        totalRecord: 0
      },
      isLoadData: true, //是否是显示加载框
      loading: false, //删除时候的弹出的加载框
      enableTypes: [
        {
          desc: "全部",
          name: "all"
        },
        {
          desc: "已启用",
          name: "enable"
        },
        {
          desc: "未启用",
          name: "unable"
        }
      ],
      uiListOperationType: -1,
      //UI列表操作类型
      uiListOperationTypeList: [
        {
          type: 1,
          name: "数据全量刷新"
        },
        {
          type: 2,
          name: "页面查询按钮"
        },
        {
          type: 3,
          name: "翻页按钮"
        },
        {
          type: 4,
          name: "是否启用按钮"
        },
        {
          type: 5,
          name: "保存简称操作"
        }
      ],
      enableSelected: "", //启用的类型
      insShortName: "", //简称的输入
      insLongName: "", //全称的输入
      insProdID: "", //产品ID的输入
      insProdType: "", //保险类型的输入
      insCpyName: "" //公司名字的输入
    };
  },
  computed: {},
  watch: {
    netDataList: {
      //从后端全量拉取数据
      handler(val, oldVal) {
        let that = this;
        //默认查询第一页
        that.queryUIDataList();
        //排序列表重新初始化
        that.getSortDataList(val);
      },
      deep: true,
      immediate: true
    }
  },
  created() {
    this.initPageParam();
    this.getDataList();
  },
  mounted() {},
  methods: {
    //分页获取通知规则数据
    getDataList() {
      let that = this;
      //无论这个更新接口调用成功或者失败，都不影响继续调用 查询接口
      tmHandler.updateInsProducts().then(
        function(res) {
          // console.log(res.result);
          that.uiListOperationType = that.uiListOperationTypeList[0].type;
          that.getAllData4Net();
        },
        function(error) {
          console.log(error);
          that.uiListOperationType = that.uiListOperationTypeList[0].type;
          that.getAllData4Net();
        }
      );
    },
    /**
     * 全局拉取一次数据
     */
    getAllData4Net() {
      let that = this;
      that.isLoadData = true;
      let request = {
        pageSize: 1000, //全量拉取数据，1000使用一个较大的数。
        pageIndex: 1
      };
      tmHandler.getInsProductsForManager(request).then(
        function(res) {
          that.isLoadData = false;
          if (0 == res.resultCode && !!res.result.insProducts) {
            that.netDataList = res.result.insProducts;
          } else {
            utils.showToast(res.resultMessage || "查询失败");
            //清空列表
            that.netDataList && that.netDataList.splice(0);
          }
        },
        function(error) {
          that.isLoadData = false;
          utils.showToast(res.resultMessage || "查询失败");
          //清空列表
          that.netDataList && that.netDataList.splice(0);
        }
      );
    },
    /**
     * 获取要排序的 已启用的数据
     */
    getSortDataList(allDataList) {
      let that = this;
      if (allDataList && allDataList.length) {
        let tempList = [];
        // "";
        for (let i = 0; i < allDataList.length; i++) {
          if (allDataList[i].valid == "VALID") {
            let item = {
              id: allDataList[i].productNo,
              name: allDataList[i].productShortName,
              orderIndex: allDataList[i].orderIndex
            };
            tempList.push(item);
          }
        }
        //OrderIndex排序已启用的列表
        tempList.sort(function(objA, objB) {
          return objA.orderIndex - objB.orderIndex;
        });

        that.enabledDataList = tempList;
        // console.log("enabledDataList=" + JSON.stringify(that.enabledDataList));
        // console.log("enabledDataList.length=" + that.enabledDataList.length);
      } else {
        that.enabledDataList = [];
      }
    },
    /**
     * 指定页码翻页跳转
     * @param newPageNum 页码
     */
    turnPage(newPageNum) {
      this.page.currPage = parseInt(newPageNum);
      this.queryUIDataList(this.uiListOperationTypeList[2].type);
    },
    /**
     * 修改通知规则
     */
    openDetail(item) {
      if (!!item) {
        //修改
        utils.setStorage(this.cacheRuleItem, JSON.stringify(item));
      } else {
        //新增
        utils.removeStorage(this.cacheRuleItem);
      }
      this.$router.push({
        path: "/configure/insurance/insuranceProductDetail"
      });
    },
    /**
     * 控制 每一行的编辑和保存
     */
    controlEditItem(item, itemIndex) {
      const that = this;
      // "";
      let hasIndex = that.editProductNo.indexOf(item.productNo) != -1;
      if (hasIndex) {
        //保存操作
        if (
          !!that.editProductName[itemIndex] &&
          that.editProductName[itemIndex] != item.productShortName
        ) {
          that.setShortName(item, itemIndex);
        } else if (
          !!that.editProductName[itemIndex] &&
          that.editProductName[itemIndex] == item.productShortName
        ) {
          utils.showToast("您没有修改简称");
          //局部刷新，修改名字。
          that.uiListOperationType = that.uiListOperationTypeList[4].type;
          that.editProductNo.splice(
            that.editProductNo.indexOf(item.productNo),
            1
          );
        } else {
          utils.showToast("简称不能为空");
        }
      } else {
        //编辑操作
        that.editProductNo.push(item.productNo);
        //编辑框赋初值为简称
        that.editProductName[itemIndex] = item.productShortName;
      }
    },
    /**
     * 切换是否启用
     */
    setShortName(item, index) {
      const that = this;
      that.loading = true;
      tmHandler
        .setInsProductShortNameByManager({
          productNo: item.productNo,
          productShortName: that.editProductName[index]
        })
        .then(function(res) {
          that.loading = false;
          if (0 == res.resultCode && res.result && res.result.success) {
            //局部刷新，修改名字。
            that.uiListOperationType = that.uiListOperationTypeList[4].type;
            item.productShortName = that.editProductName[index];
            that.editProductNo.splice(
              that.editProductNo.indexOf(item.productNo),
              1
            );
            utils.showToast("编辑成功");
            // that.$forceUpdate();
          } else {
            utils.showToast(res.result.failedReason || "操作失败");
          }
        })
        .catch(e => {
          that.loading = false;
          utils.showToast("操作失败");
        });
    },
    /**
     * 切换是否启用
     */
    switchAutomatic(item) {
      const that = this;
      that.loading = true;
      tmHandler
        .setInsProductValid({
          productNo: item.productNo,
          valid: !(item.valid == "VALID")
        })
        .then(function(res) {
          that.loading = false;
          if (0 == res.resultCode && res.result && res.result.success) {
            //开启之后，还有一个默认的操作，就是后台会自动排序到已启用的最后一位，所以需要刷新全量，
            //否则前端无法知道新增的准确排序值。
            that.uiListOperationType = that.uiListOperationTypeList[3].type;
            that.getAllData4Net();
          } else {
            utils.showToast(res.result.failedReason || "操作失败");
          }
        })
        .catch(e => {
          that.loading = false;
          utils.showToast("操作失败");
        });
    },
    /**
     * 页面数据赋初值
     */
    initPageParam() {
      let that = this;
      that.enableSelected = that.enableTypes[0].name;
    },
    resetListParam() {
      let that = this;
      //影响到翻页的逻辑，需要重置下面数据
      that.editProductNo = [];
      that.editProductName = [];
    },
    /**
     * 获取页面展示的列表
     */
    queryUIDataList(type) {
      let that = this;
      if (!!type) {
        that.uiListOperationType = type;
      }
      if (that.uiListOperationType == 1) {
        //全量数据刷新，需要翻页重置
        that.page.currPage = 1;
        that.resetListParam();
      } else if (that.uiListOperationType == 2) {
        //查询查询
        that.page.currPage = 1;
        that.resetListParam();
      } else if (that.uiListOperationType == 3) {
        //翻页查询
      } else if (that.uiListOperationType == 4) {
        //是否启用，因为列表数据有增减，会影响到翻页的逻辑，需要重置下面数据
        that.resetListParam();
      } else if (that.uiListOperationType == 5) {
        //简称保存
      } else {
        //默认 ==1
        that.page.currPage = 1;
        that.resetListParam();
      }

      //先筛选数据
      let tempList = [];
      for (let i = 0; i < that.netDataList.length; i++) {
        if (that.filterDataByConditions(that.netDataList[i])) {
          tempList.push(that.netDataList[i]);
        }
      }
      // console.log("tempList.size=" + tempList.length);
      //OrderIndex排序已启用的列表
      if (that.enableSelected == that.enableTypes[1].name) {
        tempList.sort(function(objA, objB) {
          return objA.orderIndex - objB.orderIndex;
        });
        // console.log("tempList=" + JSON.stringify(tempList));
      }
      //赋值数据总量和数据总页数
      that.page.totalRecord = tempList.length;
      that.page.pageCount =
        that.page.totalRecord % that.page.pageSize == 0
          ? parseInt(that.page.totalRecord / that.page.pageSize)
          : parseInt(that.page.totalRecord / that.page.pageSize) + 1 || 1;
      //再处理分页
      let startIndex = (that.page.currPage - 1) * that.page.pageSize;
      //slice方法索引超过 列表最大值，会返回[]，不会报错。
      that.uiDataList = tempList.slice(
        startIndex,
        startIndex + that.page.pageSize
      );
      // console.log("uiDataList.size=" + that.uiDataList.length);
    },
    /**
     * 根据输入的筛选条件过滤数据是否合格
     */
    filterDataByConditions(data) {
      const that = this;
      let result = true;
      //判断数据是否是已启用的
      if (that.enableSelected) {
        if (that.enableSelected == that.enableTypes[0].name) {
          result = true;
        } else if (that.enableSelected == that.enableTypes[1].name) {
          result = data.valid == "VALID";
        } else if (that.enableSelected == that.enableTypes[2].name) {
          result = !(data.valid == "VALID");
        } else {
          result = true;
        }
      } else {
        result = true;
      }
      if (!result) {
        return false;
      }
      //判断数据满足简称
      if (that.insShortName) {
        result = data.productShortName.indexOf(that.insShortName) != -1;
      } else {
        result = true;
      }
      if (!result) {
        return false;
      }
      //判断数据满足全称
      if (that.insLongName) {
        result = data.productName.indexOf(that.insLongName) != -1;
      } else {
        result = true;
      }
      if (!result) {
        return false;
      }
      //判断数据满足ID
      if (that.insProdID) {
        result = data.productCode.indexOf(that.insProdID) != -1;
      } else {
        result = true;
      }
      if (!result) {
        return false;
      }
      //判断数据满足类型
      if (that.insProdType) {
        let pTypes = [];
        //由名字筛选出来ID
        for (var key in that.insTypeList) {
          if (that.insTypeList[key].indexOf(that.insProdType) != -1) {
            pTypes.push(key);
          }
        }
        // ""
        //用ID来判断
        result = pTypes.indexOf(data.productType + "") != -1;
      } else {
        result = true;
      }
      if (!result) {
        return false;
      }
      //判断数据满足公司名字
      if (that.insCpyName) {
        result = data.companyName.indexOf(that.insCpyName) != -1;
      } else {
        result = true;
      }
      if (!result) {
        return false;
      }
      return result;
    },
    /**
     * 排序后的列表
     */
    saveSortData(sortedList) {
      let that = this;

      let sortedNoList = [];
      for (let i = 0; i < sortedList.length; i++) {
        sortedNoList.push(sortedList[i].id);
      }
      let request = {
        productNoList: sortedNoList
      };
      //排序操作类似于 查询按钮，需要
      that.uiListOperationType = that.uiListOperationTypeList[1].type;
      that.loading = true;
      tmHandler.setInsProductIndexByManager(request).then(
        function(res) {
          that.loading = false;
          if (0 == res.resultCode && !!res.result.success) {
            utils.showToast("保存成功");
            //操作成功，全局拉取一次数据，因为数据有批量更新
            that.getAllData4Net();
          } else {
            utils.showToast(res.result.failedReason || "保存失败");
            //操作失败，全局拉取一次数据，因为无法正常操作
            that.getAllData4Net();
          }
        },
        function(error) {
          that.loading = false;
          utils.showToast("保存失败");
          //操作失败，全局拉取一次数据，因为无法正常操作
          that.getAllData4Net();
        }
      );
    }
  }
};
</script>
<style scoped lang="less">
@import "list.less";
</style>
