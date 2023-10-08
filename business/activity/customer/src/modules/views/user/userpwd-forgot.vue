<template>
  <div class="form-container">
    <el-form :model="userinfo" label-position="left" status-icon :rules="rules" ref="passwordForm" label-width="100px">
      <el-form-item label="手机号" prop="telephoneNumber">
        <el-input v-model="userinfo.telephoneNumber" maxlength="11" show-word-limit clearable placeholder="请输入手机号">
        </el-input>
      </el-form-item>
      <el-form-item label="验证码" prop="verifyCode">
        <el-input v-model="userinfo.verifyCode" placeholder="请输入验证码">
          <!-- 插槽方式： 和ue中的样式不一致，暂时 -->
          <!-- <el-button slot="append" class="code-btn">获取验证码</el-button> -->
        </el-input>
        <div :class="{ btnDisabled: isDisabled }" class="code-btn" @click="getVerifyCode">{{
        verifyBtnText
        }}</div>
      </el-form-item>
      <el-form-item label="新密码" prop="newPassword">
        <el-input type="password" v-model="userinfo.newPassword" autocomplete="off" clearable show-password
          placeholder="请输入新密码">
        </el-input>
      </el-form-item>
      <el-form-item label="重复新密码" prop="repeatPassword">
        <el-input type="password" v-model="userinfo.repeatPassword" autocomplete="off" clearable show-password
          placeholder="请再次输入新密码">
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button class="submit-btn" type="primary" @click="submit">提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { validatePass } from 'bislibs/utils/regex-util.js';

export default {
  watch: {
    verifyBtnText(newV) {
      // console.log(newV);
      if (newV === '获取验证码' || newV === '重新发送') {
        this.isDisabled = false
      } else {
        // 禁用点击按钮
        !this.isDisabled && (this.isDisabled = true)
      }
    }
  },
  data() {
    // 重复密码输入校验
    var validateRepeatPass = (rule, value, callback) => {
      // console.log('validateRepeatPass', value, rule);
      if (!this.userinfo.newPassword || value !== this.userinfo.newPassword) {
        callback(new Error('重复密码不一致'));
      }
      callback()
    }
    // 电话号码格式校验
    var validateTelNumber = (rule, value, callback) => {
      if (!value) {
        callback(new Error('电话号码不能为空'))
      }
      let regex = /^[1][35789][0-9]{9}$/
      if (regex.test(value)) {
        callback()
      }
      callback(new Error('电话号码格式不正确'))

    }
    return {
      isDisabled: false,
      verifyBtnText: '获取验证码',
      userinfo: {
        telephoneNumber: '',
        verifyCode: '',
        newPassword: '',
        repeatPassword: '',
      },
      rules: {
        newPassword: [
          { validator: validatePass, trigger: 'blur', required: true },
        ],
        repeatPassword: [
          { validator: validatePass, trigger: 'blur', required: true },
          { validator: validateRepeatPass, trigger: 'blur' }
        ],
        telephoneNumber: [
          { validator: validateTelNumber, trigger: 'blur', required: true }
        ],
        verifyCode: [
          { required: true, trigger: 'blur', message: '验证码不能为空' }
        ]
      }
    }
  },
  methods: {
    submit() {
      this.$refs.passwordForm.validate((valid) => {
        if (valid) {
          this.$message.success('ok')
          // 调用接口
        } else {
          return false;
        }
      });

    },
    getVerifyCode() {
      if (this.isDisabled) {
        this.$message.waring('请不要频繁点击')
        return
      }
      // 倒计时
      let count = 60;
      let timer

      // 模拟异步任务
      setTimeout(() => {
        clearInterval(timer)
        this.verifyBtnText = '重新发送'
        this.userinfo.verifyCode = 'a5f9'
      }, 5000)

      this.verifyBtnText = `已发送 ${count}s`
      timer = setInterval(() => {
        count -= 1
        if (count < 0) {
          this.verifyBtnText = '重新发送'
          clearInterval(timer)
          return
        }
        this.verifyBtnText = `已发送 ${count}s`
      }, 1000)

    }
  }
}
</script>

<style scoped>
.form-container {
  width: 40%;
  margin: 50px auto 0;
}

.code-btn {
  padding: 0 !important;
  z-index: 5;
  height: 30px;
  line-height: 30px;
  width: 70px;
  text-align: center;
  box-sizing: border-box;
  color: #fff;
  font-size: 10px;
  border-radius: 5px;
  position: absolute;
  right: 5px;
  top: 5px;
  background-color: rgb(35, 132, 229);
}

.code-btn:hover {
  cursor: pointer;
}

.btnDisabled {
  background-color: lightblue;
}

.btnDisabled:hover {
  cursor: not-allowed;
}

.submit-btn {
  width: 60%;
}
</style>