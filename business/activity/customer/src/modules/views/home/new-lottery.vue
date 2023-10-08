<template>
  <div class="newlottery">
    <div class="stepsbox">
      <SNsteps
        :active="activieStep"
        :steps="topStepsData"
        :style="{ width: '60vw' }"
      />
    </div>
    <keep-alive>
      <component
        :is="currentStateObj && currentStateObj.uiComponent"
        :inputData="compInputData"
        :onlineTotalPrice="goodsTotalPrice"
        :hasOnlineGood="!!parseFloat(goodsTotalPrice)"
        :canNext="canNext"
        @addgoodsok="addgoodsok"
        @setgoodsokxck="setgoodsokxck"
        ref="childComp"
      ></component>
    </keep-alive>
    <stepsAction
      class="stepsActionbox"
      v-if="ifShowSA"
      :type="stateActionType"
      :rightbtntext="rightbtntext"
      @leftClick="onLeftClick"
      @rightClick="onRightClick"
    >
      <div slot="component" v-if="ifShowSlot" class="jineslot">
        <div>线上商城商品待结算金额：</div>
        <div class="moneyUnit">￥</div>
        <div class="money">
          {{ goodsTotalPrice }}
        </div>
      </div>
    </stepsAction>
  </div>
</template>
<script>
import { utils } from "opcl";
import {
  setCurrentLottery,
  getLifecycleItem,
  getDefaultLifecycleState,
  isLifecycleEnd,
  getBtnTypeByLifecycle,
  getRightBtnText,
  isLifecycleShowSlot,
  getCompInputData,
  getLifecycleSteps,
  setResultData,
  ifCanNext,
  getTotalPrice,
  getAddPrizeData,
  destoryUIDataCache,
  lifecycleKeyMap,
} from "bislibs/home/newlottery-lifecycle";
//底部的步骤操作区域
const stepsAction = () => import("biscomponents/home/steps-action.vue");
//新增商品的组件
const addPrize = () => import("biscomponents/home/addprize/add-prize.vue");
//设置抽奖的组件
const setLottery = () => import("biscomponents/home/setlottery/set-lottery.vue");
//设置抽奖的组件 现场开奖类型
const setLotteryxck = () => import("biscomponents/home/setlottery/set-lottery-xck.vue");
//确认抽奖的组件
const confirmLottery = () => import("biscomponents/home/confirmlottery/confirm-lottery.vue");
//确认抽奖的组件 现场开奖类型
const confirmLotteryxck = () => import("biscomponents/home/confirmlottery/confirm-lottery-xck.vue");
//完成抽奖的组件
const setokLottery = () => import("biscomponents/home/createoklottery/setok-lottery.vue");
//顶部的步骤条组件
const SNsteps = () => import("biscomponents/home/sn-steps.vue");

export default {
  components: {
    stepsAction,
    addPrize,
    setLottery,
    setLotteryxck,
    confirmLottery,
    confirmLotteryxck,
    setokLottery,
    SNsteps,
  },
  data() {
    return {
      initStep: getDefaultLifecycleState(),
      currentState: "",
      currentStateObj: {},
      ifShowSA: false,
      ifShowSlot: false,
      stateActionType: "",
      rightbtntext: "下一步",
      compInputData: null, //每个组件需要的参数
      topStepsData: getLifecycleSteps(),
      activieStep: 0, //步骤条的当前取值
      goodsTotalPrice: 0,
      canNext: null //每一步的校验结果
    };
  },
  created() {
    //页面刷新等操作，需要重置一下本页面的初始数据状态
    setCurrentLottery()
    //默认是pre状态 . 目前不支持 记忆功能
    this.currentState = this.initStep;
  },
  mounted() {},
  watch: {
    //我们列表的数据对象，接受prop的传值，因为树形操作打开和关闭，需要修改展示的数组，但我们不能修改prop的数据
    currentState: {
      handler(val) {
        // console.log("currentState=" + val);
        this.currentStateObj = getLifecycleItem(val);
        this.setCompInputData();
        this.setUIVaule();
      },
      // immediate: true,
    },
  },
  beforeDestroy() {
    //本页面销毁前，清空记录的缓存
    destoryUIDataCache();
  },
  methods: {
    /**
     * 上一步的操作，切换当前的状态
     */
    onLeftClick() {
      this.currentState = this.currentStateObj.pre || this.initStep;
    },
    /**
     * 下一步的操作，切换当前的状态
     */
    async onRightClick() {
      //点击下一步，赋值子组件的结果集
      setResultData(this.currentState);
      //是否可以继续下一步，条件判断
      this.canNext = await ifCanNext(this.currentState, this);
      //如果不能继续下一步，给出提示语
      if (!!this.canNext && !this.canNext.state) {
        //这里的点击 下一步 的结果集，因为设置活动 UE 要求错误提示在页面显示，不需要toast
        //确认页面的点击 确认 调用接口，我们默认显示接口的错误提示toast，不需要自定义toast
        if (
          this.currentState != lifecycleKeyMap.SET_LOTTERY &&
          this.currentState != lifecycleKeyMap.CONFIRM_LOTTERY
        ) {
          !!this.canNext.showTip && utils.showToast(this.canNext.showTip);
        }
        return;
      }
      //否则，跳转到下一步
      if (!!this.currentStateObj.next) {
        this.currentState = this.currentStateObj.next;
      } else {
        utils.showToast("没有下一步了");
      }
    },
    /**
     * 设置某个状态下的 组件的 数据输入值
     */
    setCompInputData() {
      //inputData 根据具体的 组件的实现 不一样。这里 可能也不一定叫做 compInputData， 需要的数据 一般是上个页面的数据结果 ，也有可能其他的数据
      this.compInputData = getCompInputData(this.currentState);
      //每一步，都初始化canNext为Null，表示用户没有操作 下一步 点击按钮
      this.canNext = null;
    },
    /**
     * 根据生命周期状态，设置UI组件显隐
     */
    setUIVaule() {
      //是否显示 底部的 操作栏
      this.ifShowSA = !isLifecycleEnd(this.currentState);
      //底部操作栏的显示状态
      this.stateActionType = getBtnTypeByLifecycle(this.currentState);
      this.rightbtntext = getRightBtnText(this.currentState);
      //必须是 新增、确认 步骤的 线上商品，才需要显示 总额 抽奖二期，奖品可以混合添加，不再区分线上线下。
      this.ifShowSlot = isLifecycleShowSlot(this.currentState);
      //更新顶部 的 步骤条
      this.activieStep = this.topStepsData.indexOf(this.currentStateObj.name);
    },
    //添加商品OK，需要手动拉一次数据，目前的主要作用是更新底部的线上商城商品待结算金额
    addgoodsok() {
      //点击下一步，从子组件获取数据集
      let selectGoods = getAddPrizeData().onlinePrizes;
      this.goodsTotalPrice = getTotalPrice(selectGoods, this);
    },
    //现场开奖，第三步确认页面，需要刷新页面金额数据
    setgoodsokxck() {
      let selectGoods = []
      this.compInputData.settings.prizeSetList.forEach(element => {
        //这里的商品数据 混合了 线上 和 线下的，需要识别处 线上的商品
        if(!element.good.offPrizeType){
          selectGoods.push(element.good)
        }         
      })
      this.goodsTotalPrice = getTotalPrice(selectGoods, this);
    },
  },
};
</script>
<style lang="less" scoped>
.newlottery {
  background: white;
  padding: 5px 22px;
  .stepsbox {
    margin: 20px;
    display: flex;
    justify-content: center;
  }
  .stepsActionbox {
    margin-top: 12px;
    margin-bottom: 5px;
    .jineslot {
      display: flex;
      align-items: baseline;
      .money {
        color: red;
        font-size: 18px;
      }
      .moneyUnit {
        color: red;
      }
    }
  }
}
</style>