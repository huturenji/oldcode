// 引入客服的功能
import sobotHandler from './handler';
var functional = SnTravel.functional;
let { baseRequestHandler } = functional;
const mixin={
    data() {
        return {   
        }
    },    
    mounted() { 
    },

    onShow() {},
    
    methods: {
        /**
         * 调用接口结束当前智齿客服会话
         */
        sobotOut(){
            let userInfo = new baseRequestHandler().getUserParam();
            let params = {
                partnerid: userInfo.userId
            }
            sobotHandler.endConservation(params).then(res => {
                if(res.resultCode == 0){
                    console.info('调用结束智齿客服会话成功');
                } else {
                    console.log('调用结束智齿客服会话失败', res);
                }
            }).catch(e => {
                console.log('调用结束智齿客服会话失败', e);
            })
        }
    }
}
export default mixin;