<template>
    <div class="form-container">
        <el-form :model="userinfo" label-position="left" status-icon :rules="rules" ref="passwordForm"
            label-width="100px">
            <el-form-item label="原密码" prop="rawPassword">
                <el-input type="password" v-model="userinfo.rawPassword" autocomplete="off" show-password
                    placeholder="请输入原密码">
                </el-input>
            </el-form-item>
            <el-form-item label="新密码" prop="newPassword">
                <el-input type="password" v-model="userinfo.newPassword" autocomplete="off" show-password
                    placeholder="请输入新密码">
                </el-input>
            </el-form-item>
            <el-form-item label="重复新密码" prop="repeatPassword">
                <el-input type="password" v-model="userinfo.repeatPassword" autocomplete="off" show-password
                    placeholder="请再次输入新密码">
                </el-input>
            </el-form-item>
            <el-form-item>
                <el-button class="save-btn" type="primary" @click="save">保存</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import { EventBus, SysEventTypes, EventObj} from 'opcl'
import { validatePass } from 'bislibs/utils/regex-util.js';
import userInfoHandler from "bislibs/requestHandler/userInfohandler";

export default {
    data() {
        var validateNewPass = (rule, value, callback) => {
            if (value === this.userinfo.rawPassword) {
                callback(new Error('新旧密码不能相同'));
            }
            callback()
        }

        var validateRepeatPass = (rule, value, callback) => {
            if (!this.userinfo.newPassword || value !== this.userinfo.newPassword) {
                callback(new Error('重复输入密码不一致'));
            }
            callback()
        }
        return {
            userinfo: {
                rawPassword: '',
                newPassword: '',
                repeatPassword: '',
            },
            rules: {
                rawPassword: [
                    { required: true, message: '原密码不能为空', trigger: 'blur' },
                    { validator: validatePass, trigger: 'blur' }
                ],
                newPassword: [
                    { required: true, message: '新密码不能为空', trigger: 'blur' },
                    { validator: validatePass, trigger: 'blur' },
                    { validator: validateNewPass, trigger: 'blur' }
                ],
                repeatPassword: [
                    { required: true, message: '重复新密码不能为空', trigger: 'blur' },
                    { validator: validatePass, trigger: 'blur' },
                    { validator: validateRepeatPass, trigger: 'blur' }
                ]
            }
        }
    },
    methods: {
        save() {
            this.$refs.passwordForm.validate((valid) => {
                if (valid) {
                    // 调用接口
                    this.updatePassword()
                } else {
                    // this.$message.error('error')
                    return false;
                }
            });

        },
        updatePassword() {
            const that = this;
            that.$iLoading.show();
            let params = {
                newPassword:that.userinfo.newPassword,
                oldPassword:that.userinfo.rawPassword,
                userId:userInfoHandler.userInfo.userId
            };
            userInfoHandler
            .updatePassword(params)
                .then((result) => {
                    if (result.resultCode === 0) {
                        // that.$message.success('修改密码成功')
                        //这里的超时UI弹框，这里不需直接确认弹框样式，需要发一个消息出去，首页渠弹框。
                        const evt = new EventObj(SysEventTypes.USER_OP_TIMEOUT_EVENT,"修改密码成功，请重新登录");
                        EventBus.dispatchEvent(evt);    
                    }
                    that.$iLoading.hide();
                })
                .catch(() => {
                    that.$iLoading.hide();
                });
        },
    }
}
</script>

<style scoped lang="less">
.form-container {
    width: 40%;
    margin: 50px auto 0;
    /deep/ .el-form-item.is-required:not(.is-no-asterisk)>.el-form-item__label::before {
        content: '';
        color: #F56C6C;
        margin-right: 4px;
    }
    /deep/ .el-form-item.is-required:not(.is-no-asterisk)>.el-form-item__label::after {
        content: '*';
        color: #F56C6C;
        margin-right: 4px;
    }
}

.save-btn {
    width: 60%;
}
</style>