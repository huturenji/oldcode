<template>
  <div class="squarenine">
    <div class="squarenine_box" :class="classArr">
      <!-- 开始按钮 -->
      <div class="start" @click="startDraw">
        <div></div>
      </div>
      <!-- 奖品列表 -->
      <div
        v-for="(item, i) in prizeList"
        :key="'luckmarquee' + i"
        :class="[`gift gift_${i + 1}`]"
      >
        <div class="activeBorder" v-show="index == i"></div>
        <div class="gift_img">
          <img :src="item.img" />
        </div>
        <div class="desc">{{ item.inputName || item.name }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    // 奖品列表
    prizeList: {
      type: Array,
      required: true,
    },
    // 中奖奖品的 index
    prizeIndex: {
      type: Number || String,
      default: -1,
    },
    // 初始转动速度
    speed: {
      type: Number || String,
      default: 200,
    },
    // 预抽奖，转动多少次进入抽奖环节
    circle: {
      type: Number || String,
      default: 15,
    },
    checkRun: {
      type: Function,
      default: () => {
        return true;
      },
    },
  },
  data() {
    return {
      giftLength: this.prizeList.length,
      velocity: this.speed,
      lock: false,
      index: 0,
      cellNumber: 0,
      timer: null,
      classArr: ["size_8"], //这里组件跟mobile不一样，需要动态切换样式
    };
  },
  watch: {
    prizeList: {
      handler() {
        this.giftLength = this.prizeList.length;
        //动态刷新样式，9宫格和12宫格 动态切换
        if (this.giftLength == 8) {
          this.classArr.splice(0, 1, "size_8");
        } else {
          this.classArr.splice(0, 1, "size_12");
        }
      },
      deep: true,
      immediate: true,
    },
  },
  mounted() {},
  methods: {
    rollMarquee() {
      this.cellNumber += 1;
      let idx = this.index; // 当前转动到哪个位置
      const count = this.giftLength; // 总共有多少个位置
      idx += 1;
      if (idx > count - 1) {
        idx = 0;
      }
      this.index = idx;
      this.getPrize();
    },
    getPrize() {
      // 当前转动次数符合条件 && 转动到中奖位置
      if (this.cellNumber > this.speed && this.prizeIndex === this.index) {
        // 清除转动定时器
        this.timer && clearTimeout(this.timer);
        //恢复默认值和初始值
        this.timer = null;
        this.cellNumber = 0;
        this.velocity = this.speed;
        setTimeout(() => {
          this.index = this.prizeIndex;
          this.lock = false;
        }, 500);
      } else {
        // 转动速度
        if (this.cellNumber < this.circle) {
          this.velocity -= 4;
        } else {
          this.velocity += 20;
        }
        // 开始转动抽奖
        this.timer = setTimeout(this.rollMarquee, this.velocity);
      }
    },
    startDraw() {
      //为了模拟抽奖，随机赋值prizeIndex并启动抽奖rollMarquee
      this.prizeIndex = Math.floor(Math.random() * (this.giftLength || 8));
      this.rollMarquee();
    },
  },
};
</script>

<style lang="less" scoped>
.squarenine {
  // 样式直接从mobile那边拷贝过来，需要做一些修改。rpx全部改成px 数字除以2, img 要改成 img， view要改成 div .
  margin-top: 20px;
  position: absolute;
  width: 375px;
  height: 475px;
  padding: 100px 50px;
  border-radius: 8px;
  background: url("assets/shared/squarenine/bg_cj_jgg_waikuang.png") no-repeat
    center;
  background-size: 100% 100%;
    .squarenine_box {
        .gift .desc {
            color: #de4321;
        }

        .activeBorder {
            position: absolute;
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
            background: url("assets/shared/squarenine/icon_cj_jgg_sel.svg") no-repeat center;
            background-size: 100% 100%;
            z-index: 99;
        }
    }

    .squarenine_box.size_8 {
        position: relative;
        width: 100%;
        height: 100%;
        margin: 0;
        padding: 0;

        .gift_1, .gift_3, .gift_5, .gift_7 {
            background: url("assets/shared/squarenine/icon_cj_jgg_gezi1.png") no-repeat center;
        }
        
        .gift_2, .gift_4, .gift_6, .gift_8 {
            background: url("assets/shared/squarenine/icon_cj_jgg_gezi2.png") no-repeat center;
        }

        .start {
            position: relative;
            top: 95px;
            left: 95px;
            width: 77px;
            height: 77px;
            overflow: hidden;
            border-radius: 5px;
            background: url("assets/shared/squarenine/icon_cj_jgg_bg.png") no-repeat center;
            background-size: 100% 100%;

            div {
                width: 100%;
                height: 100%;
                background: url("assets/shared/squarenine/icon_cj_jgg_choujiang2.png") no-repeat center;
                background-size: 100% 100%;
                animation: startMove 1.5s linear 0s infinite;
            }
        }

        .gift {
            list-style: none;
            position: absolute;
            width: 77px;
            height: 77px;
            background-size: 100% 100%;

            .gift_img {
                margin: 10px auto 6px;
                width: 34px;
                height: 34px;
                border-radius: 4px;
                overflow: hidden;

                img {
                    width: 100%;
                    height: 100%;
                }
            }

            .desc {
                display: block;
                max-width: 140px;
                margin: 0 auto;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                text-align: center;
                font-size: 12px;
                font-weight: 500;
            }
        }
        // 上面三个
        .gift_1, .gift_2, .gift_3 {
            top: 6px;
        }
        // 左边三个
        .gift_1, .gift_7, .gift_8 {
            left: 6px;
        }
        // 竖向中间两个
        .gift_2, .gift_6 {
            left: 95px;
        }
        // 横向中间两个
        .gift_4, .gift_8 {
            top: 95px;
        }
        // 右边三个
        .gift_3, .gift_4, .gift_5 {
            left: 184px;
        }
        // 下面三个
        .gift_5,.gift_6, .gift_7 {
            top: 184px;
        }
    }

    .squarenine_box.size_12 {
        position: relative;
        width: 100%;
        height: 100%;
        margin: 0;
        padding: 0;

        .gift_1, .gift_4, .gift_7, .gift_10 {
            background: url("assets/shared/squarenine/icon_cj_jgg_gezi1.png") no-repeat center;
        }
        
        .gift_2, .gift_3, .gift_5, .gift_6, .gift_8, .gift_9, .gift_11, .gift_12 {
            background: url("assets/shared/squarenine/icon_cj_jgg_gezi2.png") no-repeat center;
        }

        .start {
            position: relative;
            top: 77px;
            left: 77px;
            width: 120px;
            height: 120px;
            overflow: hidden;
            border-radius: 5px;
            background: url("assets/shared/squarenine/icon_cj_jgg_bg.png") no-repeat center;
            background-size: 100% 100%;

            div {
                width: 100%;
                height: 100%;
                background: url("assets/shared/squarenine/icon_cj_jgg_choujiang2.png") no-repeat center;
                background-size: 100% 100%;
                animation: startMove 1.5s linear 0s infinite;
            }
        }

        .gift {
            list-style: none;
            position: absolute;
            width: 62px;
            height: 62px;
            background-size: 100% 100%;

            .gift_img {
                margin: 7px auto 3px;
                width: 25px;
                height: 25px;
                border-radius: 4px;
                overflow: hidden;

                img {
                    width: 100%;
                    height: 100%;
                }
            }

            .desc {
                display: block;
                max-width: 60px;
                margin: 0 auto;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                text-align: center;
                font-size: 12px;
                font-weight: 500;
            }
        }

        // 上面三个
        .gift_1, .gift_2, .gift_3, .gift_4 {
            top: 6px;
        }
        // 左边三个
        .gift_1, .gift_10, .gift_11, .gift_12 {
            left: 6px;
        }
        // 竖向中间两个
        .gift_2, .gift_9 {
            left: 73px;
        }
        .gift_3, .gift_8 {
            left: 140px;
        }
        // 横向中间两个
        .gift_5, .gift_12 {
            top: 73px;
        }
        .gift_6, .gift_11 {
            top: 140px;
        }

        // 右边三个
        .gift_4, .gift_5, .gift_6, .gift_7 {
            left: 207px;
        }
        // 下面三个
        .gift_7, .gift_8, .gift_9, .gift_10 {
            top: 207px;
        }
    }  
}

@keyframes startMove {
  0% {
    -webkit-transform: scale(1);
    transform: scale(1);
  }
  25% {
    -webkit-transform: scale(1.05);
    transform: scale(1.05);
  }
  50% {
    -webkit-transform: scale(1.1);
    transform: scale(1.1);
  }
  75% {
    -webkit-transform: scale(1.05);
    transform: scale(1.05);
  }
  100% {
    -webkit-transform: scale(1);
    transform: scale(1);
  }
}
</style>
