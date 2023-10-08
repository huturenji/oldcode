// 引入客服的功能
import sobotHandler from '@/components/sobot/handler';
import {resetTileText} from '@/utils/common';
const mixin={
    data() {
        return {   
        }
    },    
    mounted() { 
        // 监听页面回退，调用关闭智齿会话接口
        this.childWindowCloseFun()
    },

    onShow() {},
    
    methods: {
        childWindowCloseFun(){
            let that = this;
            try {
                sinosdk.sino.onChildWindowClose(function(){ //注册推送
                    that.sobotOut();
                    if(that.$route.path=='/pages/tabbar/services'||that.$route.path=='/pages/tabbar/personalcenter'){
                        resetTileText();//兼容贵阳银行页面回退事件被该地方监听，重置title
                    }  
                }.bind(that));
            } catch (error) {
                    
            }
        },

        /**
         * 调用接口结束当前智齿客服会话
         */
        sobotOut(){
            let userInfo = getApp().globalData.userParams;
            let params = {
                partnerid: userInfo.userId
            }
            sobotHandler.endConservation(params).then(res => {
                if(res.state == 200){
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