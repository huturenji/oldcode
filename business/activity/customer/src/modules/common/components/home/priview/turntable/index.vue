<template>
    <div class="turn">
        <div class="ring"></div>
        <div
            class="turntableContent"
            :style="{ width: size/2 + 'px', height: size/2 + 'px'}"
        >
            <div
                class="turntable"
                :style="{ transform: rotateAngle, transition: rotateTransition }"
            >
                <!-- 转盘 -->
                <canvas id="turntableCanvas" width='280' height='280'></canvas>
                <!-- 图片文字信息 -->
                <div :class="['prize', `prize_${prizeList.length}`]">
                    <div v-for="(item, index) in prizeList" class="item" :style="getRotateAngle(index)" :key="index">
                        <div class="drawTable-name" :style="{ 'color': '#ff0000', 'width': prizeNameWidth  }">{{ item.inputName || item.name }}</div>
                        <div class="drawTable-img" :style="{ 'width': prizeImgWidth, 'height': prizeImgWidth }" >
                            <img :src="item.img" />
                        </div>
                    </div>
                </div>
            </div>
            <!-- 指针 -->
            <div class="pointer" @click="startTurns"></div>
        </div>
        <div class="turnBottom"></div>
    </div>
</template>

<script>
import { utils } from "opcl";

export default {
    props: {
        size: {
            type: Number,
            default: 560
        },
        // 转盘数据
        prizeList: {
            required: true,
            type: Array
        },
        // 转盘转动后指针停在区间的索引
        prizeIndex: {
            type: Number,
            default: -1
        },
        // 转动圈数
        turnsNumber: {
            type: Number,
            default: 5
        },
        styleOpt: {
            default: () => {
                return {
                    // 每一块扇形的外边框颜色,默认值,可通过父组件来改变
                    borderColor: '#ff9800'
                }
            },
        },
        // 转动需要持续的时间 (秒)
        turnsTime: {
            default: 5,
        },
        pointerStyle: {
            default: () => {
                return {
                    
                }
            },
        },
    },
    watch: {
        turnsRun(nRun) {
            if (nRun) {
                this.rotate(Math.floor(Math.random()*this.prizeList.length));
            }
        },
        prizeList(nVal, oVal) {
            if (nVal.length !== oVal.length) {
                this.updateCanvas()
            }
        }
    },
    data() {
        return {
            // imgUrl: getApp().globalData.imgUrl,
            // 设置指针默认指向的位置,现在是默认指向2个扇形之间的边线上
            rotateAngle:0,
            rotateTransition:'',
            startRotateDegree:0,// 开始转动的角度
            turnsRun:false,
            firstFlag:true,
            prizeNameWidth: '',
            prizeImgWidth: '',
            activityId:utils.getStorage("customer_typeId")
        }
    },
    mounted() {
        this.$nextTick(() => {
            if(this.activityId=='1'){
                this.initCanvas()
            } 
        })
    },
    activated(){
        this.updateCanvas()
    },
    methods: {
        updateCanvas(){
            this.rotateAngle = '';
            this.rotateTransition = '';
            this.startRotateDegree = 0
            this.$nextTick(() => {
                if(this.activityId=='1'){
                    this.initCanvas()
                } 
            })            
        },
        async initCanvas() {
            const data = this.styleOpt;
            const prizeNum = this.prizeList.length;
            const { borderColor } = data;
            
            // 开始绘画
            
            const ctx = document.querySelector('#turntableCanvas').getContext('2d')
            // debugger
            const canvasSize =  document.querySelector('#turntableCanvas').getBoundingClientRect()
            const turntableSize =  document.querySelector('.turntable').getBoundingClientRect()
            const canvasW = (canvasSize.width = turntableSize.width); // 画板的高度
            const canvasH = (canvasSize.height = turntableSize.height); // 画板的宽度
            
            // rotate方法旋转当前的绘图，因为文字是和当前扇形中心线垂直的
            if(this.firstFlag){
                // translate方法重新映射画布上的 (0,0) 位置
                ctx.translate(0, canvasH);
                ctx.rotate((-90 * Math.PI) / 180);
                this.firstFlag = false
            }
            // 圆环的外圆的半径,可用来调整圆盘大小来适应外部盒子的大小
            const outRadius = canvasW / 2 - 1;
            // 圆环的内圆的半径
            const innerRadius = 0;
            const baseAngle = (Math.PI * 2) / prizeNum; // 每个奖项所占角度数
            this.computedWidth(outRadius, baseAngle) // 计算图片和文字宽度
            ctx.clearRect(0, 0, canvasW, canvasH); //去掉背景默认色
            ctx.strokeStyle = borderColor; // 设置画图线的颜色
            for (let index = 0; index < prizeNum; index++) {
                const angle = index * baseAngle;
                // 给抽奖扇形填充渐变色
                const coordinateX = canvasW / 2 + parseInt(Math.cos(angle + baseAngle / 2) * outRadius)
                const coordinateY = canvasH / 2 + parseInt(Math.sin(angle + baseAngle / 2) * outRadius)
                let grad = ctx.createLinearGradient(canvasW / 2, canvasH / 2, coordinateX, coordinateY)
                if (index % 2 === 0) {
                    grad.addColorStop(0, '#f2d4d4')
                    grad.addColorStop(0.2, '#f9eded')
                    grad.addColorStop(0.5, '#faefef')
                    grad.addColorStop(0.7, '#f1dcdc')
                    grad.addColorStop(1, '#e8c4c4')
                } else {
                    grad.addColorStop(0, '#f3c6b4')
                    grad.addColorStop(0.2, '#f7d4c1')
                    grad.addColorStop(0.5, '#fde1ce')
                    grad.addColorStop(0.7, '#f3cebb')
                    grad.addColorStop(1, '#e2a796')
                }
                
                ctx.fillStyle = grad; //设置每个扇形区域的颜色,根据每条数据中单独设置的优先
                ctx.beginPath(); //开始绘制
                // 标准圆弧：arc(x,y,radius,startAngle,endAngle,anticlockwise)
                ctx.arc(canvasW * 0.5, canvasH * 0.5, outRadius, angle, angle + baseAngle, false);
                ctx.arc(canvasW * 0.5, canvasH * 0.5, innerRadius, angle + baseAngle, angle, true);
                ctx.stroke();
                ctx.fill();
                ctx.save();
            }
        },
        getRotateAngle(index) {
            const angle = (360 / this.prizeList.length) * index + 180 / this.prizeList.length;
            return {
                transform: `rotate(${angle}deg)`
            };
        },
        // 计算每块区域图片和文字宽度
        computedWidth(radius, deg) {
            //0815新需求，去掉最少4个奖品的限制。大转盘至少有4个分区。
            if(this.prizeList.length>=4){
                const topWidth = Math.sin(deg / 2) * radius * 2
                this.prizeNameWidth = topWidth * 0.75 + 'px'
                this.prizeImgWidth = topWidth * 0.3 + 'px'
            }
        },
        // 开始事件
        startTurns() {
            this.turnsRun = true;
        },
        rotate(index) {
            const turnsTimeNum = this.turnsTime;
            const rotateAngleValue =
                this.startRotateDegree +
                this.turnsNumber * 360 +
                360 -
                (180 / this.prizeList.length + (360 / this.prizeList.length) * index) -
                (this.startRotateDegree % 360);
            
            this.startRotateDegree = rotateAngleValue;
            this.rotateAngle = `rotate(${rotateAngleValue}deg)`;
            this.rotateTransition = `transform ${turnsTimeNum}s cubic-bezier(0.250, 0.460, 0.455, 0.995)`;
            setTimeout(() => {
                this.turnsRun = false
                // this.luckResult(result)
            }, turnsTimeNum * 1000 + 500);
        },
        // 抽奖结束
        luckResult() {          
            this.showLotteryResultModal();
        }
    }
}
</script>

<style lang="less" scoped>
.turn {
    width: 375px;
    height: 375px;
    position: relative;

    .ring {
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        background: url('assets/shared/turntable/icon_cj_dzp_waipan.png')no-repeat center;
        background-size: 105% 105%;
        z-index: 98;
    }

    .turnBottom {
        position: absolute;
        left: 0;
        bottom: -50px;
        width: 100%;
        height: 240px;
        background: url('assets/shared/turntable/icon_cj_dzp_dizuo.png')no-repeat center;
        background-size: 100% 100%;
        z-index: 10;
    }
}

.turntableContent {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    overflow: hidden;
    z-index: 99;

    .pointer {
        position: absolute;
        left: 50%;
        top: 50%;
        z-index: 99;
        transform: translate(-50%, -50%);
        width: 80px;
        height: 80px;
        background-image: url('assets/shared/turntable/icon_cj_dzp_choujiang.png');
        background-size: contain;
        background-repeat: no-repeat;
    }

    .drawTable-name {
        position: absolute;
        left: 50%;
        top: 20px;
        transform: translateX(-50%);
        font-size: 13px;
        text-align: center;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
    }

    .drawTable-img {
        position: absolute;
        /*要居中就要50% - 宽度 / 2*/
        left: 50%;
        bottom: 42px;
        transform: translateX(-50%);
        height: auto;

        img {
            width: 100%;
            height: 100%;
        }
    }

    .turntable {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;

        #turntableCanvas {
            width: 100%;
            height: 100%;
        }

        .mlcanvas {
            margin-left: -50%;
        }
    }
    .prize {
        position: absolute;
        left: 25%;
        top: 0;
        width: 50%;
        height: 50%;

        .item {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            transform-origin: center bottom;
        }
    }
}
.prize_4  .drawTable-img {
    bottom: 38px;
}

.prize_6  .drawTable-img {
    bottom: 44px;
}

.prize_8 .drawTable-img {
    bottom: 50px;
}

.prize_10, .prize_12 {
    .drawTable-img {
        bottom: 55px;
    }
}
</style>
