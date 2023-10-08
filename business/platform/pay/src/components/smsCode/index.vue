<template>
    <div class="smsCode-container">
        <template v-if='extendUtils.isPC()'>
            <div class='code-input-pc' v-for='n in 6'>
                <input type='tel' class='smsCode-input input-pc' :readonly='smsCodeObj.statu==-1' maxlength='1'
                    @keydown.delete='backspace(n,$event)' @input='setSmsCodePc(n,$event)'>
            </div>
            <div class='btn-pc normal-btn cursorp' :class='{disabled: smsCodeObj.statu==0}' @click='changeBtnState()'>
                <template v-if='smsCodeObj.statu==-1'>
                    获取验证码
                </template>
                <template v-else-if='smsCodeObj.statu==0'>
                    {{smsCodeObj.clock}}秒后重发
                </template>
                <template v-else>
                    重新获取
                </template>
            </div>
        </template>
        <template v-else>
            <label>验证码</label>
            <input type='tel' class='smsCode-input input' :readonly='smsCodeObj.statu==-1' placeholder="请填写短信验证码"
                :maxlength="smsCodeObj.codeSize" v-model='smsCodeObj.code' @input='setSmsCode' />
            <div class='btn normal-btn cursorp' :class='{disabled: smsCodeObj.statu==0}' @click='changeBtnState()'>
                <template v-if='smsCodeObj.statu==-1'>
                    获取验证码
                </template>
                <template v-else-if='smsCodeObj.statu==0'>
                    {{smsCodeObj.clock}}秒后重发
                </template>
                <template v-else>
                    重新获取
                </template>
            </div>
        </template>
    </div>
</template>
<script>
    import extendUtils from 'common/lib/utils';

    function request(url, param, ...other) {
        return envHandler.getEnv().then((res) => {
            return new Promise((reslove, reject) => {
                apiCallHandler(res.url + url, param, ...other).then(data => {
                    if (data.code == 0) {
                        reslove(data);
                    } else {
                        reject(data);
                    }
                }).catch(err => {
                    reject(err.code ? err : null);//只把拦截器返回的异常数据抛出去
                    try {
                        log.err(err && JSON.stringify(err));
                    } catch (e) {
                    }
                })
            });
        });
    }

    export default {
        components: {},
        props: {
            codeSize: {
                type: Number,
                default: 6
            },
            payAmount: {
                type: String,
                default: null
            },
            phoneNo: {
                type: String,
                default: null
            },
            accNo: {
                type: String,
                default: null
            },
            orderNo: {
                type: String,
                default: null
            },
        },
        data() {
            return {
                smsCodeObj: {
                    statu: -1,//-1 未发送过，0 已发送且正在倒计时， 1 已发送且倒计时结束
                    clock: 0,//倒计时
                    codeSize: this.codeSize,
                    code: null,
                },
            }
        },
        created: function () {
        },
        mounted() {
        },
        methods: {
            /**
             * 发送验证码
             */
            changeBtnState(statu = this.smsCodeObj.statu) {
                if (statu == -1) {//开启倒计时
                    this.sendSmsCode().then(() => {
                        this.smsCodeObj.statu = 0;
                        this.smsCodeObj.clock = 60;
                        this.$nextTick(() => {
                            document.getElementsByClassName('smsCode-input')[0].focus();
                        })
                        let timer = setInterval(() => {
                            if (this.smsCodeObj.clock <= 0) {
                                clearInterval(timer);
                                this.smsCodeObj.statu = 1;
                                return;
                            }
                            --this.smsCodeObj.clock;
                        }, 1000)
                    }).catch((e) => {
                        console.error(e)
                    });
                } else if (statu == 1) {//重发
                    this.changeBtnState(-1);
                }
            },

            /**
             * 发送验证码
             */
            sendSmsCode() {
                let that = this;
                let param = {
                    PayAmount: that.payAmount,
                    PhoneNo: that.phoneNo,
                    AccNo: that.accNo,
                    OrderNo: that.orderNo,
                }
                return new Promise((reslove, reject) => {
                    request('pay',"consumeSms", param).then((res) => {
                        if (!!res.data && res.data.SendStatus == '1') {
                            reslove();
                            return;
                        }
                        extendUtils.showToast('发送短信失败');
                        reject();
                    }).catch(() => {
                        extendUtils.showToast('发送短信失败');
                        reject();
                    });
                })
            },
            /**
             * 读取验证码
             */
            setSmsCode() {
                this.smsCodeObj.code = this.smsCodeObj.code.replace(/[^\d]/g, '')
                if (this.smsCodeObj.statu != -1) {
                    this.$emit('setSmsCode', this.smsCodeObj.code);
                }
            },

            setSmsCodePc(index, event) {
                var value = event.currentTarget.value;
                value = value != null ? value.replace(/[^\d]/g, '') : null;
                if (value != null && value != '') {
                    if (this.smsCodeObj.statu != -1) {
                        this.$emit('setSmsCode', this.joinPcSmsCode());
                        let domSize = document.getElementsByClassName('smsCode-input').length;
                        if (index >= domSize - 1) {
                            index = domSize - 1;
                        }
                        document.getElementsByClassName('smsCode-input')[index].focus();
                    }
                } else {
                    event.currentTarget.value = null;
                }
            },

            /**
             * 如果当前input没有值时删除，则将焦点移到上一个input
             */
            backspace(index, event) {
                this.$emit('setSmsCode', this.joinPcSmsCode());
                if (event.currentTarget.value == null || event.currentTarget.value == '') {
                    index = index - 2;
                    if (index <= 0) {
                        index = 0;
                    }
                    document.getElementsByClassName('smsCode-input')[index].focus();
                }
            },

            /**
             * 拼接PC端的验证码
             */
            joinPcSmsCode() {
                let code = '';
                Array.prototype.forEach.call(document.getElementsByClassName('smsCode-input'), (dom) => {
                    if (dom.value != null && dom.value != '') {
                        code += dom.value;
                    }
                })
                this.smsCodeObj.code = code;
                return code;
            },

            isPC() {
                return extendUtils.isPC();
            }
        }
    }

</script>
<style scoped lang="less">
    @import './smsCode.less';
</style>
