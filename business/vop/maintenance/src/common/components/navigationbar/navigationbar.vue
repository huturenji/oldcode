<template>
    <div>
        <div id="topnavWrap">
            <div class="topnav">
                <h4>{{ websitename }}</h4>
                <div class="resetPwd">
                    <span
                        class="usenName"
                        :title="welcomeuser"
                    >
                        {{ welcomeuser }}
                    </span>
                    <b
                        v-if="showUserIcon"
                        class="usericon"
                        @click="openUserInfo()"
                    >
                    </b>
                    <span
                        class="nav2"
                        title="退出登录"
                        @click="openPopMain()"
                    ></span>
                </div>
            </div>
        </div>
        <Modal
            v-model="showPopMain"
            width="410"
            :mask-closable="false"
            class-name="quitPopModal"
        >
            <div
                v-show="popTitle"
                slot="header"
                class="headerStyle"
            >
                {{ popTitle }}
            </div>
            <div class="contentStyle">
                {{ popContent }}
            </div>

            <div
                slot="footer"
                class="footerStyle"
            >
                <Button
                    class="btnStyle"
                    type="primary"
                    @click="logOut"
                >确定</Button>
                <Button
                    class="btnStyle"
                    @click="closePopMain"
                >
                    取消
                </Button>
            </div>
        </Modal>
    </div>
</template>

<script>
export default {
    props: {
        showUserIcon: {
            type: Boolean,
            default: true
        },
        websitename: {
            type: String,
            default: ""
        },
        userinfo: {
            type: Object,
            default() {
                return {
                    username: "", //显示管理员名称
                    userID: "" //显示管理员ID
                }
            }
        }
    },
    components: {},
    watch: {
        userinfo: {
            handler() {
                this.setWelcomeUser();
            },
            deep: true
        }
    },
    computed: {},
    data() {
        return {
            welcomeuser: "",
            showPopMain: false, //是否显示退出的弹框
            eventFlag: "acceptevent",
            actionQuit: "quit",
            popTitle: "提示",
            popContent: "确定退出登录？"
        };
    },
    created() {},
    mounted() {
        this.setWelcomeUser();
    },
    methods: {
        setWelcomeUser() {
            this.welcomeuser =
                "欢迎您," + (this.userinfo && this.userinfo.username);
        },
        /**
         * 退出登录
         */
        logOut() {
            this.closePopMain();
            this.$emit(this.eventFlag, {
                name: this.actionQuit,
                params: null
            });
        },
        /**
         * 关闭退出登录确认框
         */
        closePopMain() {
            this.showPopMain = false;
        },
        /**
         * 打开退出登录确认框
         */
        openPopMain() {
            this.showPopMain = true;
        },
        /**
         * 点击显示用户资料
         */
        openUserInfo() {}
    }
};
</script>

<style scoped lang="less">
#topnavWrap {
    height: 48px; //导航栏高度统一为48px
    background-color: #478aee; //导航栏背景色统一为兆日蓝478aee
}

.topnav {
    height: 100%;
    font-family: "Microsoft YaHei";
    display: flex;
    box-sizing: border-box;
}

.topnav h4 {
    height: 100%;
    line-height: 48px;
    font-size: 20px; //导航栏标题字号统一为20px
    color: #fff; //导航栏标题字号统一为fff
    font-weight: 600; //导航栏标题字号统一为600
    flex: 1;
}

.resetPwd {
    flex: 1;
    text-align: right;
    display: flex;
    justify-content: flex-end;
    justify-items: center;
    font-size: 15px;
    letter-spacing: 1px;
    color: #fff;

    i {
        font-style: normal;
    }
    .usenName {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 200px;
        line-height: 48px;
    }

    .usericon {
        padding-right: 16px;
        background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAAERlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAGKADAAQAAAABAAAAGAAAAADiNXWtAAAB0UlEQVRIDd3VzS8DQRjHcVttUz3QemmEizhLJM7ljyAiDkTEwf8g4UBcOBEhXEmEuxMiDnpREonXP4KQtF7aqu+vtqJrdlu9McknszvzPPNsp9NtTc1fb1YlHyCfzysuCL8dn6HPWJaVt++r71g8iDEk8GQ7oR9BoPqVyWSBMLahdoQFLOIYajsIV1WERB/mkcIkitujwgGMI41p+H5dhKROe4Ep0wIawyz0AB3VFBgmUU9Y75bMXBSvGHSL8fpoXSTd4sUtmfEU7qBYY/MqkCajBV97b1hBczE8G+YKQ14FkkS0o9stmfEeqMCpR4x5in3VEb1AEk3OKMaacYZz1DnnK7onMQ79uC7Rj1a0YQA3eERvRYuZgkj2YwLFluNCim2Ui1pTbtkxEiNYxxvucYAlLOMQD9DcGlyPsrEQCVp8Hzrjq4ih8N6ht3Rtj63Qq4hiI8bFnIMEals2kcUQXLdAc9ArQ9u2Aa8j/VmKoD5o8Rl4HeNCAjEqMgflxJ0PXHJPgN4v2nftb7Rk0uOG2EboRGk73f9jmAzhGltw3RpnLWK1rbu4Quj7vHML9EXmkODfSn1FjdgsgXt4R0mBHwvwBDpB5b8sR6Zy0OAY/ge3Hw6C3ueHYNf+AAAAAElFTkSuQmCC)
            no-repeat right;
        background-size: auto 16px;
        cursor: pointer;
    }
    .usericon:hover {
        padding-right: 16px;
        background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAAERlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAGKADAAQAAAABAAAAGAAAAADiNXWtAAACAklEQVRIDdWUuUsDQRSHsypiPFAsvK/KxhsbUdBCLAyIVjb+fxaCYGNl4Ymi4oFIGrHwFo/CKl4xfr8wI252dhNLH3w7s/POeTO7sdh/F6+QDWQyGdkVQ5Gx/2JMe56XMe+hQ94EBC/BuwcGoc5EemDch1OSpM2ac4hMQPBSvKahCy7gBuTTDG2QhCWSvDM6RdU5heBqxyh0wjIc2mrRqV19kIBh3jfQqW0BsT0NKFiogSHYhAMbnHnMzI+ZbsMIVINTohKoDZI9V3VmbQe9YjTJ0CVRCXSgT/DpcjRrH4zPYA8/YBqVQM4VEGUjnWxCi4hyvsOxCuohTBpRKMFtmEFUAl1L3fcEt6Q8NwBrCjwJ93CZq7fv+b6Ddgzn4AVW4Qrk0wLjUAnzHLiKcUq+BLrv/TBlvO2vwfotsX7iumXGPluNnftGWhBnYQKUQF+qzuQRJLo1DaAv/QhWSPLKGBDnl2yCz2Kt38EhrEGKIGl0ql5npwLGQP+oWtYX0KeY+8Ru9WcRQ7VlBrphEZJhLcBWiWwLtZNlFcH4I65b1IpWwdchNLgimMTHTLdgAHT4PvElMBX1YvEGu2GV/45gbPTL0Dn1EMPXFV8CDNQe9f0MlKRQke05dIDvXHMT6F1X8bqQ6rHLCrbqu4qSry9B1uD3gy3GQTv5k8gHyv7k9C+MvwG5Bpnj9OSBnQAAAABJRU5ErkJggg==)
            no-repeat right;
        background-size: auto 16px;
        cursor: pointer;
    }

    .nav2 {
        margin-left: 10px;
        width: 16px;
        background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAAERlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAGKADAAQAAAABAAAAGAAAAADiNXWtAAAA1UlEQVRIDWNgGAUDHQKM2Bzw////YqB4JDY5PGLLGRkZe9HlmdAFoHyQ4Zo45EgSZsGj+jrQRSZ45ImSwuUDojQTo2jUAnAoAVOdPhB3AjFGnGIIEBOuQIMuA9XxIKllA7KlgNgaKBcBTBxPkOQwmUBFZ0AYUwYiApTDBb4DJcKR9ZHlA6ABRkDMjWSQGpBdDsShQNdfQhLHzgS6Aq8P0HUB1QsAMXKQwZWQ6wO4ASAG0NUfUASQOEM/H+ALIk1QXCD5lhCTpNJ0OdC064RMHJUfGiEAAHJlVuRotkBcAAAAAElFTkSuQmCC)
            no-repeat center;
        background-size: 100%;
        padding: 0 10px;
        cursor: pointer;
    }

    .nav2:hover {
        margin-left: 10px;
        width: 16px;
        background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAAERlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAGKADAAQAAAABAAAAGAAAAADiNXWtAAAA1UlEQVRIDWNgGAUDHQKM2Bzw//9/K6C4LjY5PGKXGRkZj6HLM6ELQPkgw0VwyJEkzIJH9Rugi2bikSdKCpcPiNJMjKJRC8ChBEx1EkDsCsTM6MGGL5LR1cL5QIOygBw2uAADA8hgXiCWA8qtASaOjzA5siwAahaDGYBGSwL5skBMsQWg5IvsA2Eg3xqIVwNd/wJIwwFZPgAa8hxuApABDJZXQOoqUPwnsjiITZYF6IYADf6OLgbjD/18gC+IRIBhmw7zKhE0SaXpZaCBb4gwdFTJEAgBAC1zKrV5E4/PAAAAAElFTkSuQmCC)
            no-repeat center;
        background-size: 100%;
        padding: 0 10px;
        cursor: pointer;
    }
}
.quitPopModal {
    display: flex;
    align-items: center;
    justify-content: center;
    .ivu-modal {
        top: 0;
    }
    .headerStyle {
        text-align: center;
        font-weight: 700;
    }
    .contentStyle {
        text-align: center;
        padding: 10px 0 0 0;
    }
    .footerStyle {
        display: flex;
        justify-content: center;
        .btnStyle {
            width: 91px;
            height: 24px;
            margin: 0 15px;
        }
    }
}
</style>