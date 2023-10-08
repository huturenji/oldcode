<template>
    <div class="login_wrap">
        <div class="logo_part">
            <div class="logo_img">
                <icon type='icon_train_12306' size='1.2' />
            </div>
        </div> 

        <div class="input_part">
            <div class="input_item phone">
                <div class="icon"><icon type="icon_login_phone" size='.3' /></div>
                <input type="tel" placeholder="请输入12306用户名/手机号/邮箱"/>  
                <div class="clear"><icon type="icon_common_close" size='.3' /></div>
            </div>
            <div class="input_item password">
                <div class="icon"><icon type="icon_login_password" size='.3' /></div>
                <input type="password" placeholder="请输入12306密码"/>   
                <div class="clear"><icon type="icon_common_close" size='.3' /></div>
            </div>
        </div>

        <div class="forget_pas">忘记密码？</div>

        <div class="login_btn">登录</div>

        <div class="operation_btn">
           <p>免账号购票</p>
           <p>注册12306</p>
        </div>
    </div>
</template>

<script>
    import trainHandler from 'trainHandler/common/lib/trainHandler.js';
    import icon from "components/icon/index.vue";
    export default {
        mixins: [trainHandler.mixin.tChatEventMixin],
        components: {
            icon
        },
        data: function () {
            return {
                
            }
        },
        created: function () {
            // let _this = this;
            // //注册并监听t信返回事件
            // sinosdk.sino.onBack(function (data) {//点击app返回事件
            //     trainHandler.throttle(function () {
            //         _this.goBack();
            //     }, this);
            // }.bind(this));
            // trainHandler.reFreshPage(() => {
            //     trainHandler.reloadWithNoCache()
            // });
        },
        mounted: function () { },
        watch: {},
        methods: {
            goBackFun(){
                const that = this;
                that.$router.back();
            },
        }
    }
</script>

<style scoped lang="less">
@import '~themes/default/styles/login.less';
</style>
