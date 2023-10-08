/*
 * 订单混入js
 */
var orderMixin = {
    data(){
        return {
            selfOrder:true //如果是自己给自己订的，返回true，不然返回false 默认true
        }
    },
    methods: {
        //如果是自己给自己订的，返回true，不然返回false 
        judgeOrderBook(){
            return this.selfOrder;
        },
        /*
        * 获取由别人预定的按钮置灰的样式 改签和退票
        */
        getOtherBookBtnStyle(){
            return !this.judgeOrderBook()
                ? {
                    color:'#c2c2c2',
                    borderColor:'#c2c2c2'
                }
                : {}
        }
    }
}

export default orderMixin;
    

