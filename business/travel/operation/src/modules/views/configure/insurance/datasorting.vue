<template>
  <div class="dataSortComp">
    <div class="sortArea">
      <div class="sortArrow" v-if="editStatus">
        <div class="imgArrowForward" @click.stop="itemForward" />
        <div class="imgArrowBack" @click.stop="itemBack" />
      </div>
      <div v-else class="sortArrowEmpty"></div>
      <div class="sortList">
        <div class="sortItem" v-for="(item,index) in dataSourceCopy" :key="item">
          <span>{{index+1}}</span>
          <div
            class="buttonNormal"
            :class="{'buttonSelect':editStatus && selcetedItemID==item.id}"
            :title="item.name"
            @click.stop="sortTheData(item,index)"
          >{{item.name}}</div>
        </div>
      </div>
    </div>
    <div class="btnArea">
      <button v-if="editStatus" @click.stop="saveData">保存</button>
      <button v-else @click.stop="sortTheData()">调整顺序</button>
    </div>
  </div>
</template>

<script>
import tmHandler from "bislibs/requesthandler/traveloperationhandler.js";
export default {
  props: {
    //数据源列表
    dataSource: {
      type: Array,
      default: [],
      required: true
    }
  },
  directives: {},
  components: {},
  data() {
    return {
      toast1: "请先点击调整顺序",
      toast2: "现在是末尾顺序",
      toast3: "现在是第一顺序",
      toast4: "数量小于2，不支持排序",
      dataSourceCopy: [],
      editStatus: false, //是否编辑状态，默认false
      selectedIndex: -1, //正在选中操作的数据索引
      selcetedItemID: -1 //正在选中操作的数据ID
    };
  },
  computed: {},
  watch: {
    dataSource: {
      handler(val, oldVal) {
        // console.log("dataSource.watch");
        if (val && val.length > 0) {
          this.dataSourceCopy = JSON.parse(JSON.stringify(val));
        } else {
          this.dataSourceCopy = [];
        }
        this.closeEditStatus();
      },
      deep: true,
      immediate: true
    }
  },
  created() {
    // console.log("dataSource");
  },
  mounted() {},
  methods: {
    itemForward() {
      if (this.selcetedItemID != -1) {
        if (this.selcetedItemID == this.dataSourceCopy[0].id) {
          //已经是第一个
          utils.showToast(this.toast3);
        } else {
          //选中的item跟前面一个互换位置
          this.dataSourceCopy.splice(
            this.selectedIndex - 1,
            1,
            ...this.dataSourceCopy.splice(
              this.selectedIndex,
              1,
              this.dataSourceCopy[this.selectedIndex - 1]
            )
          );
          //选中的下标索引 减一
          this.selectedIndex--;
        }
      } else {
        utils.showToast(this.toast1);
      }
    },
    itemBack() {
      if (this.selcetedItemID != -1) {
        if (
          this.selcetedItemID ==
          this.dataSourceCopy[this.dataSourceCopy.length - 1].id
        ) {
          //已经是最后一个
          utils.showToast(this.toast2);
        } else {
          //选中的item跟后面一个互换位置
          this.dataSourceCopy.splice(
            this.selectedIndex,
            1,
            ...this.dataSourceCopy.splice(
              this.selectedIndex + 1,
              1,
              this.dataSourceCopy[this.selectedIndex]
            )
          );
          //选中的下标索引 加一
          this.selectedIndex++;
        }
      } else {
        utils.showToast(this.toast1);
      }
    },
    sortTheData(item, index) {
      if (this.dataSourceCopy && this.dataSourceCopy.length > 1) {
        this.openEditStatus(item, index);
      } else {
        utils.showToast(this.toast4);
      }
    },
    openEditStatus(item, index) {
      this.editStatus = true;
      this.selectedIndex = index || 0;
      this.selcetedItemID = (item && item.id) || this.dataSourceCopy[0].id;
    },
    closeEditStatus() {
      this.editStatus = false;
      // this.selcetedItemID == -1;
      this.selectedIndex = -1;
    },
    saveData() {
      this.closeEditStatus();
      let result = JSON.parse(JSON.stringify(this.dataSourceCopy));
      this.$emit("onDataSorted", result);
    }
  }
};
</script>
<style scoped lang="less">
@import "~styles/common.less";
.dataSortComp {
  background: white;
  display: flex;
  justify-content: space-between;
  .sortArea {
    margin-right: 30px;
    .sortArrow {
      margin-bottom: 10px;
      display: flex;
      justify-content: center;
      .imgArrowForward {
        margin-right: 10px;
        height: 24px;
        width: 24px;
        background: url(~assets//icon_turn_left_hov.png);
      }
      .imgArrowBack {
        height: 24px;
        width: 24px;
        background: url(~assets//icon_turn_right_hov.png);
      }
    }
    .sortArrowEmpty {
      height: 24px;
      margin-bottom: 10px;
    }
    .sortList {
      display: flex;
      flex-wrap: wrap;
      .sortItem {
        display: flex;
        align-items: flex-end;
        .buttonNormal {
          margin: 10px 10px 0px 5px;
          width: 135px;
          height: 55px;
          color: #333333;
          border: 1px solid #333333;
          border-radius: 2px;
          font-size: 12px;
          word-break: break-all;
          overflow: hidden;
        }
        .buttonSelect {
          cursor: pointer;
          background: #e2e2e2;
        }
      }
    }
  }
  .btnArea {
    width: 130px;
    display: flex;
    align-items: flex-end;
    button {
      border: 0;
      width: 100px;
      height: 40px;
      line-height: 40px;
      border-radius: 2px;
      color: #fff;
      background-color: @primary;
    }
  }
}
</style>
