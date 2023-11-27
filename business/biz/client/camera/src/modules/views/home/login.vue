<template>
    <div class="Max_box">
        <div class="contentBox">
            <div class="leftContent"></div>
            <div class="rightContent">
                <div class="loginBox">
                    <header class="login-pf-header">
                        <h1 id="kc-page-title">欢迎使用兆日纸纹系统</h1>
                        <div class="loginTip">请登录</div>
                    </header>
                    <div id="kc-content">
                        <div id="kc-content-wrapper">
                            <div id="kc-form" class="row">
                                <div id="kc-form-wrapper" class="col-xs-12 login-pf-social-section">
                                    <div>
                                        <div class="form-group">
                                            <label class="user_icon"></label>
                                            <input
                                                tabindex="1"
                                                id="username"
                                                class="form-control custom"
                                                placeholder="请输入用户名"
                                                name="username"
                                                value
                                                v-model="userName"
                                                type="text"
                                                autofocus
                                                maxlength="20"
                                                autocomplete="off"
                                            />
                                        </div>

                                        <div class="form-group">
                                            <label class="pass_icon"></label>
                                            <input
                                                tabindex="2"
                                                id="password"
                                                v-model="passWord"
                                                class="form-control custom"
                                                placeholder="请输入密码"
                                                name="password"
                                                type="password"
                                                maxlength="20"
                                                autocomplete="off"
                                            />
                                        </div>

                                        <div class="form-group login-pf-settings">
                                            <div id="kc-form-options"></div>
                                            <div class></div>
                                        </div>

                                        <div id="kc-form-buttons" class="form-group">
                                            <div
                                                tabindex="4"
                                                class="btn btn-primary btn-block btn-lg"
                                                name="login"
                                                id="kc-login"
                                                @click="login"
                                            >登录
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div id="kc-info" class="login-pf-signup">
                                <div id="kc-info-wrapper" class>
                                    <div id="kc-registration"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    components: {},
    data() {
        return {
            userName:'admin',
            passWord:'111111'
        };
    },
    created() {},
    mounted() {},
    methods: {
        /**
         * 登录todu:目前为模拟登录
         */
        login() {
            if(!!!this.userName){
                this.$message({
                    message: '用户名不能为空',
                    type: 'warning'
                });
                return
            }
            if(!!!this.passWord){
                this.$message({
                    message: '密码不能为空',
                    type: 'warning'
                });
                return
            }
            if(this.passWord != '111111'){
                this.$message({
                    message: '用户名或密码错误',
                    type: 'warning'
                });
                return
            }
            let userInfo = {
                userName: this.userName,
                passWord:this.passWord,
                userId:'HD7891',
                nickName:'admin'
            }
            sessionStorage.setItem('userInfo', JSON.stringify(userInfo));
            
            this.$router.replace('/entry');
        }
    }
};
</script>
<style lang="less" scoped>

html,body{
    height: 100%;
}
.login-pf{
    background: none !important;
}
.login-pf body{
    background: none !important;
    background-color: #f8f8f8 !important;
    display: flex;
    align-items: center;
}
.Max_box {
    width: 100%;
    height: 100%;
    min-width: 1000px;
    max-width: 1920px;
    max-height: 1080px;
    padding: 90px;
    margin: auto;
}
.contentBox{
    font-size: 15px;
    background: url('@/themes/default/img/img_login.png') no-repeat center 100%;
    width: 100%;
    height: 100%;
    min-height: 470px;
    border-radius: 24px;
    display: flex;
    box-shadow: 0 8px 20px 13px rgba(139,175,228,.1);
    background-position: center center;
    background-repeat: no-repeat;
    -webkit-background-size: cover;
    -moz-background-size:cover;
    background-size: cover;
    overflow: hidden;
}
.leftContent{
    flex: 1;
    border-radius: 24px 0 0 24px;
}
.rightContent{
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius:0 24px 24px 0;
}
.loginBox{
    width: 400px;
}
#kc-page-title{
    font-size: 28px;
    text-align: center;
    color: #478aee;
    font-weight: bold;
}
.loginTip{
    color: #666;
    font-size: 18px;
    text-align: center;
    padding-bottom: 29px;
    padding-top: 24px;
}
.form-group{
    margin-bottom: 32px;
    position: relative;
}
.form-control{
    border-radius: 8px;
    box-shadow:none;
    border: 0;
    font-size: 14px;
    font-family: Verdana,\\5FAE\8F6F\96C5\9ED1,Arial,Helvetica,sans-serif;
    width: 100%;
    padding: 10px 10px 10px 35px;
    background-color: #f7f7f7!important;
    height: 56px;
    outline: none;
    color: #222;
}
.form-control::placeholder{
    font-style: normal;
}
.placeholder {
    font-style: normal;
}
.form-control:focus{
    box-shadow: none;
}

.pass_icon, .user_icon {
    position: absolute;
    top: 50%;
    left: 10px;
    transform: translateY(-50%);
}
.user_icon {
    left: 5px;
    width: 28px;
    height: 28px;
    background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAADYUlEQVRYR+2WX4gVVRzHv78z964h+SAGC4oV9KClhiauYC3LnDnTXpYW6qFVgqC/aAihKGqKdhWDSkuCILYewih8MYRQ8e6cs9PCLirqQpimb5XaQ5HbQ+Rym/v7yWx3QWX33rmXC0vgwHAezjnf7+d85/D7DWGGH5phf9wH+P8lUCwWVWdn5zPM/AKAx9M7RESXROSYMWaEiKSRe9VQAtbaeQD6ReR5AN49RgmAY5VKZUOhULiZFSIzwPDw8Jzx8fFTIrIGwHkAh0TknFIq1egAsFlEniKi057nPev7/t9ZIDIDRFF0CMAmAEdyudxrvu+P32kQx/EDSZIcBtBHRAeMMdtaBmCtbReRqwCujY2NdfT19d2aSjyO4weTJDlHRO3lcnlRT0/PH/UgMiVQKpXWKaWOAFgfhuHntUSttRtF5FMietEYc7QlANbanSLyXqVSWVkoFEZriZZKpdVKqTNEtN0Y82GrAHaLyD7P85ZqrS/VEo2iaAWAUaXUO0EQvN8SAOfcK8z8ZZZYoyh6CcA3RPSyMebrVgE8xswXAcQjIyO9xWKRpxIWEeWcO8XMT+fz+SW+7//cEoBUJIqib9MC5Hne9iAIDk4l7JzbyswfADgahuHaeuYTVTTLoirAw0R0FsA8Eeln5o/b2tqupXPM/AgzbwHwJhH9RUTLgyC4kUU7M0AqNjQ0tKxcLp8AsBBAWoh+q5osADALwC/M/Fx3d/ePWcwbSsBa+4SIfATAAMhVDf6pjrOrY0JEUT6f39LV1fVTFohMCTjnekXksIjMJaLLaUMC8D2AyZgXiIhOCxWAxQBuep73qtb6u3oQdQGcc1pEjv/XdekTpVTx3j4waVLtBzsApO+/AHrDMExBp31qAsRx/FCSJOeJaL5S6g2t9Vf1TpTOW2vfBnBQRK4T0SpjzJ/T7asJYK3dKyJ7iKjfGPMWgEw/GyJCzrkvROR1InrXGLOvYYBqnFcAzAWwLAzDX7Oc/o7P8WiSJGnx+j2Xy6VF6a72Pblu2gSccx3MfJaIjhtjehsxn1w7MDBwUilVUEqt0lpfmEqjFsBE/VdK7Q6CYH8zANbaiSZWqy9MCzA4OLiImT8DsMsYc7pJgCdF5IDnedu01j80lEAzhs3sqVsHmhFtZM99gBlP4DZ642gwqboevAAAAABJRU5ErkJggg==) no-repeat;
    background-size: 100%;
}
.pass_icon {
    width: 18px;
    height: 22px;
    background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABMAAAAXCAYAAADpwXTaAAACTUlEQVQ4T9WUMWgUQRSG/zd7FwQhGPDgIGohQUSMqGcKGzW3M7sBUSuTVm0sUwliICDRQrDRUhAt5dKpILszy6qNEkxAUURCmsg1OQsLK+9unox4h4m73Grnq5Z9//vmf/veLCEnjDETzDwL4BSAnQC+ENFzIrrr+/5SVhllvKQ4jm8S0VUAWXkGcEspdQ2Ae+7HH+IkSeastTcAfGfm2+Vy+UGr1VofHh7e43neBQBXAAwR0byUciEXZozZy8wfAXhCiDO+7z/b6twYM8XMTwBYIcQB3/fXeppNzuI4vu5OJKKHUsqLed9Ta30fwCVmXgiCYD4TprV2TqastWfDMHSnZ4bW+jSApwAipdRUJswYs8TMbooTQRC8yYNFUVQTQrj8slLqWJ4zJ6iVSqXjlUplJQ+2sbFxpNvtviaiFSllbRMsTdOxTqdz79dOZa1DHpfd7llrLwdBsEppmm7rdDpvAexjZktEFkA3r7rvgkhYaz0iEgBWS6XSITLGKGaOAbx37U1OTn4bBOrloyjaLoR4BWBcCBG6bT9PRA0Ai0qp6aKgns4Y84iZZwDMDIQZYyQznyOix1JKnbHExWBpmu5qt9trRDTkrpe1diwMw8+/Aws701qPA3jXK/Y873C9XnfD6kdhmKvQWrtLP01Ei1LKuX9us8gw/srZIOB/AkuSpG6tTQB8staeGB0d/TqotV6+2WzuEEK8ALCfiBQ1Go2hkZGRZQAHi0K26ojoQ7VaPfrzDxFF0W7P8+4w80kiKheFMnMbwEsAs0qp9R84VzuisT4kTgAAAABJRU5ErkJggg==) no-repeat;
    background-size: 100%;
}
#kc-form-buttons{
    padding-top: 16px;

}
#kc-form-buttons .btn-primary{
    font-size: 18px;
    height: 56px;
    line-height: 44px;
    background-image: none !important;
    background-color: #478aee !important;
    border-color: #478aee !important;
    border-radius: 5px;
    width: 100%;
    color: #fff;
    margin-bottom: 0;
    font-weight: 600;
    text-align: center;
    white-space: nowrap;
    vertical-align: middle;
    -ms-touch-action: manipulation;
    touch-action: manipulation;
    user-select: none;
    padding: 6px 10px;
    box-shadow: 0 2px 3px rgba(3,3,3,.1);
    -webkit-appearance: button;
    cursor: pointer;
    border: none;
}
#kc-form-buttons .btn-primary:hover{
    opacity: 0.8 !important;
}
#kc-form-buttons .btn-primary:focus{
    outline:none !important;
}
#kc-form-buttons .btn-primary:disabled{
    color: #fff !important;
}
.alert{
    padding-left: 30px;
    margin-bottom: 0;
}
.alert>.pficon{
    top: 12px;
    left: 0;
}
</style>