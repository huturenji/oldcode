<template>
    <view class="turn">
        <view class="ring"></view>
        <view
            class="turntableContent"
        >
            <view
                class="turntable"
                :style="{ transform: rotateAngle, transition: rotateTransition }"
            >
                <!-- 转盘 -->
                <canvas id="turntableCanvas" canvas-id="turntableCanvas"></canvas>
                <!-- 图片文字信息 -->
                <view class="prize">
                    <view v-for="(item, index) in prizeList" class="item" :style="getRotateAngle(index)" :key="index">
                        <div v-html="getRadiusName(item.name,index)"></div>
                        <view class="drawTable-img" :style="{ 'width': prizeCtrlEnum[prizeList.length].imgWidth, 'height': prizeCtrlEnum[prizeList.length].imgWidth, 'bottom':prizeCtrlEnum[prizeList.length].imgPositionBottom }">
                            <img :src="item.imgUrl" />
                        </view>
                    </view>
                </view>
            </view>
            <!-- 指针 -->
            <view class="pointer" @click="startTurns"></view>
        </view>
        <view class="turnBottom"></view>
    </view>
</template>

<script>
import { getQuerySelector } from '@/utils/common.js'

export default {
    props: {
        size: {
            type: Number,
            default: 560
        },
        scale: {
            type: Number,
            default: 1
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
        // 控制转盘转动
        turnsRun: {
            type: Boolean,
            default: false
        },
        // 检测是否可进行抽奖
        checkRun: {
            type: Function,
            default: () => { return true }
        },
        // 转动圈数
        turnsNumber: {
            type: Number,
            default: 5
        },
        // 转动需要持续的时间 (秒)
        turnsTime: {
            default: 5,
        }
    },
    watch: {
        turnsRun(nRun) {
            if (nRun) {
                this.rotate(this.prizeIndex);
            }
        },
        prizeList(nVal, oVal) {
            if (nVal.length !== oVal.length) {
                this.initCanvas()
            }
        }
    },
    data() {
        return {
            imgUrl: getApp().globalData.imgUrl,
            // 设置指针默认指向的位置,现在是默认指向2个扇形之间的边线上
            rotateAngle: 0,
            rotateTransition: '',
            lock: false,  // 用来锁定转盘，避免同时多次点击转动
            startRotateDegree: 0, // 开始转动的角度
            prizeImgWidth: '',
            prizeCtrlEnum:{//奖品数量相关配置1.nameLength名字展示最大长度，2.nameSize名字字号，3.imgWidthRule图片宽高规则,4.imgPositionBottom图片距离中心的位置
                4:{nameLength:12,nameSize:35,imgWidth:'80rpx',imgPositionBottom:'110rpx'},
                6:{nameLength:10,nameSize:35,imgWidth:'80rpx',imgPositionBottom:'120rpx'},
                8:{nameLength:7,nameSize:35,imgWidth:'80rpx',imgPositionBottom:'120rpx'},
                10:{nameLength:5,nameSize:35,imgWidth:'64rpx',imgPositionBottom:'120rpx'},
                12:{nameLength:4,nameSize:35,imgWidth:'58rpx',imgPositionBottom:'140rpx'}
            }
        }
    },
    mounted() {
        this.$nextTick(() => {
            this.initCanvas()
        })
    },
    methods: {
        async initCanvas() {
            const prizeNum = this.prizeList.length;
            const borderColor = '#f9d9c6'
            
            // 开始绘画
            const ctx = uni.createCanvasContext('turntableCanvas')
            ctx.scale(1 / this.scale, 1 / this.scale)
            const canvasSize =  await getQuerySelector('#turntableCanvas', false, this)
            const turntableSize =  await getQuerySelector('.turntable', false, this)
            
            const canvasW = (canvasSize.width = turntableSize.width); // 画板的高度
            const canvasH = (canvasSize.height = turntableSize.height); // 画板的宽度

            // translate方法重新映射画布上的 (0,0) 位置
            ctx.translate(0, canvasH);
            // rotate方法旋转当前的绘图，因为文字是和当前扇形中心线垂直的
            ctx.rotate((-90 * Math.PI) / 180);
            // 圆环的外圆的半径,可用来调整圆盘大小来适应外部盒子的大小
            const outRadius = canvasW / 2 - 1;
            // 圆环的内圆的半径
            const innerRadius = 0;
            const baseAngle = (Math.PI * 2) / prizeNum; // 每个奖项所占角度数
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
            ctx.draw()
        },
        getRotateAngle(index) {
            const angle = (360 / this.prizeList.length) * index + 180 / this.prizeList.length;
            return {
                transform: `rotate(${angle}deg)`
            };
        },
        canBeRotated() {
            if (this.lock) {
                return false;
            }
            return true;
        },
        // 开始事件
        startTurns() {
            // 判断是否可以转动
            if (!this.canBeRotated() || !this.checkRun()) {
                return false;
            }
            // 先上锁, 触发开始游戏
            this.lock = true;
            this.$emit('start-turns');
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
                this.$emit('end-turns');
                this.lock = false;
            }, turnsTimeNum * 1000 + 500);
        },
        getRadiusName(name,index){
            let length = name.length;
            let maxLength = this.prizeCtrlEnum[this.prizeList.length].nameLength;
            let text = length>maxLength?(name.slice(0,maxLength-1)+'...'):name;
            return '<svg viewBox="0 0 440 220"><defs><path id="MyPath" d="M-150,440 A100,100 0 1,1 590,440"></path></defs><text font-size="'+this.prizeCtrlEnum[this.prizeList.length].nameSize+'"><textPath xlink:href="#MyPath" startOffset="50%" style="fill: #ff0000; text-anchor: middle;">'+text+'</textPath></text></svg>'
        }
    }
}
</script>

<style lang="scss" scoped>
.turn {
    width: 750rpx;
    height: 750rpx;
    position: relative;
    margin-bottom: 100rpx;

    .ring {
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        background: url('@/static/shared/turntable/icon_cj_dzp_waipan.png')no-repeat center;
        background-size: 105% 105%;
        z-index: 98;
    }

    .turnBottom {
        position: absolute;
        left: 0;
        bottom: -100rpx;
        width: 100%;
        height: 480rpx;
        background: url('@/static/shared/turntable/icon_cj_dzp_dizuo.png')no-repeat center;
        background-size: 100% 100%;
        z-index: 10;
    }
}

.turntableContent {
    position: absolute;
    width: 560rpx;
    height: 560rpx;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    overflow: hidden;
    z-index: 99;

    .pointer {
        position: absolute;
        width: 240rpx;
        height: 240rpx;
        left: 50%;
        top: 50%;
        z-index: 99;
        transform: translate(-50%, -50%);
        background: url('@/static/shared/turntable/icon_cj_dzp_choujiang.png') no-repeat center;
        background-size: 100% 100%;
    }

    .drawTable-name {
        position: absolute;
        left: 50%;
        top: 40rpx;
        transform: translateX(-50%);
        font-size: 26rpx;
        text-align: center;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
    }

    .drawTable-img {
        position: absolute;
        /*要居中就要50% - 宽度 / 2*/
        left: 50%;
        bottom: 84rpx;
        transform: translateX(-50%);
        height: auto;

        img {
            width: 100%;
            height: 100%;
            border-radius: 8rpx;
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
</style>
