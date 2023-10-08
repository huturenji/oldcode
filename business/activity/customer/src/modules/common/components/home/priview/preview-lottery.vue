<template>
  <div>
    <div class="mobileWarp">
        <div class="mobileTop"></div>
        <div class="turn mobile" v-if="activityId=='1'">
            <turntable
                class="turnPage"
                :prizeList="prizeList"
                :prize-index="prizeIndex"
                :turnsNumber="7"
            />
            <div class="btn_wrapper">
                <div class="tips"> 您今天还有{{count}}次抽奖机会 </div>
            </div>
        </div>
        <div class="hiteggs mobile" v-if="activityId=='2'">
            
        </div>
        <div class="squarenine_content mobile" v-if="activityId=='3'">
            <squarenine
                :prize-list="squareninePrizeList"
                :prize-index="prizeIndex"
                :speed="100"
                :circle="200"
            />
            <div class="btn_wrapper">
                <div class="tips"> 您今天还有{{count}}次抽奖机会 </div>
            </div>
        </div>
        <div class="giftrain mobile" v-if="activityId=='4'">
            
        </div>
        <div class="mobile" v-if="activityId=='5'">
            <xck :prize-list="xckPrizeList"></xck>
        </div>        
    </div>
  </div>
</template>
<script>
import turntable from "./turntable";
import squarenine from "./squarenine";
import xck from "./xck";
import { utils } from "opcl";
export default {
  components:{
    turntable,
    squarenine,
    xck
  },
  props: {
    lottery: {
      type: Object,
      default: {},
    },
    count: {
      type: Number||String,
      default: '无数',
    },
    previewData:{
      type: Object,
      default: {}, 
    }
  },
  data() {
    return {
        prizeIndex: -1,
        turnsRun:false,
        activityId:'1',//抽奖类型
        prizeList: [//大转盘默认数据 
            
        ],
        emptyPrize:{
            name: "谢谢参与",
            img: require("assets/shared/images/icon_cj_weizhongjiang.png"),
        },
        squareninePrizeList: [//九宫格默认数据
            
        ],
        xckPrizeList:[],//现开活动奖品
        list:[]//获取的商品数据  用于监听数据变化
    };
  },
  created() {},
  mounted() {
    this.resetPrizeList()
  },
  watch:{
     previewData:{
        handler(value){
            this.resetPrizeList()
        },
        deep:true
     } 
  },
  methods: {
    //更改奖品，预览对应更改   activityId抽奖类型：1大转盘 3九宫格  goodsType商品类型：1线上 2线下
    resetPrizeList(){
        this.activityId = utils.getStorage("customer_typeId")
        //抽奖二期，奖品混合，不区分线上还是线下
        this.list = JSON.parse(JSON.stringify(this.previewData.onlinePrizes)).concat(JSON.parse(JSON.stringify(this.previewData.offlinePrizes)))
        this.list.forEach((element)=>{
            if(!!element.selectedImg){
                element.img = element.selectedImg
            }
        })
        if(this.activityId=='1'){
            if(this.list&&this.list.length>0){//有数据
                this.prizeList= []
                //1个奖品，就是 奖品 谢谢参与 奖品 谢谢参与
                if(this.list.length == 1){
                    this.list.splice(this.list.length, 0, this.emptyPrize)
                    this.list.splice(this.list.length, 0, this.list[0])
                    this.list.splice(this.list.length, 0, this.emptyPrize)
                    this.prizeList = this.list
                }else if(this.list.length == 2){
                    //2个奖品，就是 奖品 谢谢参与 奖品2 谢谢参与
                    this.list.splice(1, 0, this.emptyPrize)
                    this.list.splice(this.list.length, 0, this.emptyPrize)
                    this.prizeList = this.list
                }else if(this.list.length == 3){
                    //3个奖品，就是 奖品1 奖品2 奖品3 谢谢参与
                    this.list.splice(this.list.length, 0, this.emptyPrize)
                    this.prizeList = this.list
                }else {
                    //大于等于4个奖品，使用原来的补充方案
                    const prizeLength = this.list.length
                    if(this.list.length%2!=0){//数据为单数时补充一个谢谢参与
                        this.prizeList = this.list.concat(this.emptyPrize)
                    }else{//为双数时 补充两个谢谢参与
                        this.list.splice(prizeLength, 0, this.emptyPrize)
                        this.list.splice(prizeLength / 2, 0, this.emptyPrize)
                        this.prizeList = this.list
                    }
                }
            }else{
                this.prizeList = []
                for (let index = 0; index < 6; index++) {
                    this.prizeList.push(this.emptyPrize)
                }
            }
        }else if(this.activityId=='3'){
            if(this.list&&this.list.length>0){
                const prizeLength = this.list.length
                // 、当添加的奖品数量≤7件时，九宫格的数量为8个奖品宫格；当添加的奖品数量＞7时，九宫格的数量为12个宫格；
                if (prizeLength <= 7) {
                    const left = 8 - prizeLength // 需要补充不中奖数量
                    for (let i = left; i > 0; i--) {
                        this.list.splice(parseInt((prizeLength / left) * i), 0, this.emptyPrize)
                    }
                    this.squareninePrizeList = this.list
                }else if (prizeLength > 7 && prizeLength <= 11) {
                    const left = 12 - prizeLength // 需要补充不中奖数量
                    for (let i = left; i > 0; i--) {
                        this.list.splice(parseInt((prizeLength / left) * i), 0, this.emptyPrize)
                    }
                    this.squareninePrizeList = this.list
                }else{
                    //超过11个，还是12宫格
                    this.squareninePrizeList = this.list.slice(0,12)
                }
            }else{
                //默认还是9宫格
                this.squareninePrizeList= []
                for (let index = 0; index < 8; index++) {
                    this.squareninePrizeList.push(this.emptyPrize)
                }
            }
        }else if(this.activityId=='5'){
            // this.xckPrizeList =  JSON.parse(JSON.stringify(this.previewData.xckPrizes||[])) 
            this.xckPrizeList =  this.list
        }
        
    }
  },
};
</script>
<style lang="less" scoped>
.backimg {
  margin: 0 10px;
}
.turnPage {
    width: 100%;
    height: 100%;
}
.mobileWarp{
    width: 400px;
    height: 667px;
    background: #070707;
    border-radius: 38px;
    box-shadow: 0px -4px 7px 0px rgba(255,255,255,0.12) inset;
    padding: 12px;
    position: relative;
    .mobileTop{
        position: absolute;
        top: 12px;
        left: 50%;
        margin-left: -65px;
        width: 129px;
        height: 19px;
        background: #000000;
        border-radius: 0px 0px 15px 15px;
        z-index: 100;
    }
    .mobile{
        width: 375px;
        height: 645px;
        position: relative;
        .btn_wrapper{
            width: 100%;
            position: absolute;
            bottom: 75px;
            text-align: center;
            font-size: 15px;
            font-weight: 700;
            color: #eb2910;
            letter-spacing: 1px;
        }
    }
    .turn{
        background: url('assets/shared/turntable/bg_cj_dzp_bg.png')no-repeat center;
        background-size: 100% 100%;
        border-radius: 38px;
    }
    .squarenine_content{
        background: url('assets/shared/squarenine/bg_cj_jgg_bg.png')no-repeat center;
        background-size: 100% 100%;
        border-radius: 38px;
    }
    .hiteggs{
        background: url('../../../../../themes/default/img/icon/icon_cj_zjd.png')no-repeat center;
        background-size: 100% 100%;
        border-radius: 38px;
    }
    .giftrain{
        background: url('../../../../../themes/default/img/icon/icon_cj_hby.png')no-repeat center;
        background-size: 100% 100%;
        border-radius: 38px;
    }
}
.qrcodeWarp {
  width: 100%;
  height: 380px;
  display: flex;
  flex-direction: column;
  align-items: center;
  border: #e4e4e4 solid 1px;
  padding-top: 15px;
  div {
    width: 100%;
    text-align: center;
    margin-bottom: 15px;
  }
  .qrcode {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .qrcodetitle {
    font-size: 18px;
    font-weight: bold;
  }
}
</style>