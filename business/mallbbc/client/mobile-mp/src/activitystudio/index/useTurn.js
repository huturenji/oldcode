export default {
    data() {
        return {
            turnsRun: false
        }
    },
    methods: {
        // 开始抽奖
        async startTurns() {
            let result = await this.getLuckResult()
            // 出现错误 将转盘锁还原，阻止游戏进行
            if (result === 'err') {
                this.$refs['turntable'].lock = false
                return
            }

            // 开始游戏和更新抽奖次数
            this.turnsRun = true;
            this.getResetCount();
            // 处理中奖结果
            if (result === null) {
                this.winPrizeInfo = this.emptyPrize1
            } else {
                // 延迟赋值中奖对象，避免出现先显示下次中奖图片再关闭弹窗的现象
                setTimeout(()=>{
                    this.winPrizeInfo = result;
                },500)
            }
        },
        endTurns() {
            this.turnsRun = false;
            this.showLotteryResultModal()
        }
    },
}