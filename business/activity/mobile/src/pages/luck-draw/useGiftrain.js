export default {
    data() {
        return {
            rainRun: false,
            isError: false // 出错时阻止弹窗出现
        }
    },
    methods: {
        // 点击开始按钮
        startClick() {
            this.rainGaming = true
        },
        // 红包雨开始
        async rainStart() {
            let result = await this.getLuckResult()
            if (result === 'err') {
                this.isError = true
                return
            } else if (result === null) {
                this.winPrizeInfo = this.emptyPrize1
            } else {
                // 延迟赋值中奖对象，避免出现先显示下次中奖图片再关闭弹窗的现象
                setTimeout(()=>{
                    this.winPrizeInfo = result;
                }, 500)
            }
            this.getResetCount()
        },
        // 红包雨结束
        rainOver(count) {
            this.rainGaming = false
            if (this.isError) {
                this.isError = false
            } else {
                this.showLotteryResultModal()
            }
        }
    },
}