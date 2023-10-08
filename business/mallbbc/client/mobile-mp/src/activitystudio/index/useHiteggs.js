export default {
    methods: {
        async hit(callBack) {
            let result = await this.getLuckResult()
            // 先判断是否出现错误
            if (result === 'err') {
                return
            } else if (result === null) {
                this.winPrizeInfo = this.emptyPrize1
            } else {
                this.winPrizeInfo = result;
            }

            this.showLotteryResultModal()
            await this.getResetCount()
            // 等待结果和剩余次数查询完后，解开砸蛋锁
            callBack && callBack()
        }
    },
}