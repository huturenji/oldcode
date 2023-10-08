export default {
    methods: {
        // startback 为开始转动的回调
        async startOneyuanflashkill(startback) {
            let result = await this.getLuckResult()
            // 错误的时候打开锁
            if (result === 'err') {
                this.$refs['oneyuanflashkill'].lock = false
                return
            }
            startback && startback()
            if (result === null) {
                this.winPrizeInfo = this.emptyPrize6
            } else {
                // 延迟赋值中奖对象，避免出现先显示下次中奖图片再关闭弹窗的现象
                setTimeout(()=>{
                    this.winPrizeInfo = result;
                },500)
            }
            this.getResetCount()
        },
        endOneyuanflashkill() {
            this.showLotteryResultModal()
        }
    },
}