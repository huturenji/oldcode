

window.onload = function () {
    //默认不显示 pop框
    hideRegisterOKPage();
    hideLoading();
    //默认不显示 pop框
    cancelpopwindow();
    cancelpopAgreement();
}
/**
 * 点击发送请求按钮
 */
function getVerificationCode(realmName) {
    //错误提示区域
    let errorBox = document.getElementById('check-error-text')
    errorBox.style.color = "red"
    //没有手机号
    let phone = document.getElementById('ID_phonenum').value
    if (!phone) {
        errorBox.style.display = "block"
        errorBox.innerHTML = "没有输入手机号"
        console.log('no input phone')
        return
    }
    //手机格式校验失败
    if (!regInputValue('phone')) {
        return
    }
    //校验通过后，取消错误提示语
    errorBox.style.display = "none"

    let userServerDomain = sessionStorage.getItem('userServerDomain')
    let configId = sessionStorage.getItem('configId')
    let theUrl = userServerDomain + '/auth/realms/' + realmName + '/verification_codes/sendVerificationCode'
    // 当 data 为 URLSearchParams 对象时设置为 application/x-www-form-urlencoded;charset=utf-8,
    let params = new URLSearchParams();
    params.append('configId', configId)
    params.append('phone', phone)
    params.append('smsTemplateCode', 1)//传1 注册，2 登录 ，3 重置

    showLoading()

    axios
        .post(theUrl, params, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } })
        .then(function (res) {
            hideLoading()
            console.log(res)
            if (res.data.resultCode == 0) {
                showpopwindow(res.data.resultCode, '成功')
            } else {
                showpopwindow(res.data.resultCode, '错误')
            }
        }).catch(err => {
            console.log(err)
            hideLoading()
        })
    //打开倒计时
    showTimeCount()
}

//接口的错误码
var errorCodeMap = {
    0: "短信已经发送，请注意查收",
    80091001: "服务器内部异常，请稍后重试",
    80091002: "参数错误",
    80091003: "用户已存在，无需重复注册",
    80091004: "用户信息不存在，请确认手机号是否正确",
    80091005: "登录类型不支持",
    80091006: "该账户当前不可用",
    80091007: "无效的验证码",
    80091008: "密码错误",
    80005001: "验证码获取失败",
    accountFreeze: "您的账户已被冻结，冻结期间无法登录。如有疑问，请联系客服：400-855-6588",
    accountReview: "您审注册的账户正在审核中，请耐心等待。如需帮助，请联系客服：400-855-6588"
}
function cancelpopwindow() {
    document.getElementById('popwindow').style.display = "none"
    document.getElementById('popwindowcontent').innerHTML = ""
}

function okpopwindow() {
    cancelpopwindow()
}

function showpopwindow(type, head) {
    document.getElementById('popwindow').style.display = "block"
    document.getElementById('popwindowcontent').innerHTML = errorCodeMap[type] || type
    if (!!head) {
        document.getElementById('popwindowhead').innerHTML = head
    }
}
/**
 * 关闭倒计时
 */
function hideTimeCount() {
    //显示 发送请求按钮
    document.getElementById('getVerifyCode').style.display = "block"
    //隐藏 倒计时
    document.getElementById('verifyTimeCount').style.display = "none"
}

/**
 * 显示倒计时
 */
function showTimeCount() {
    //隐藏 发送请求按钮
    document.getElementById('getVerifyCode').style.display = "none"
    document.getElementById('verifyTimeCount').style.display = "block"
    //倒计时60秒
    var leftTime = 61;
    var timeCount = setInterval(function () {
        leftTime--;
        document.getElementById('verifyTimeCount').innerHTML = leftTime + "秒"
        if (leftTime == 0) {
            clearInterval(timeCount)
            hideTimeCount()
        }
    }, 1000)
}

/**
 * 显示加载框
 */
function showLoading() {
    document.getElementById('popwindowloading').style.display = "block"
}

/**
 * 隐藏加载框
 */
function hideLoading() {
    document.getElementById('popwindowloading').style.display = "none"
}

/**
 * 阅读用户协议
 */
function readAgreement() {
    document.getElementById('popwindowAgreement').style.display = "block"
    document.getElementById('ID_popwindowAgreement').innerHTML = "<h1>敬请期待</h1>"
}

/**
 * 关闭用户协议
 */
function cancelpopAgreement() {
    document.getElementById('popwindowAgreement').style.display = "none"
}

/**
 * 显示注册成功页面
 */
function showRegisterOKPage() {
    document.getElementById('kc-form-register-ok').style.display = "block"
    document.getElementById('kc-register-form').style.display = "none"
}

/**
 * 隐藏注册成功页面
 */
function hideRegisterOKPage() {
    document.getElementById('kc-register-form').style.display = "block"
    document.getElementById('kc-form-register-ok').style.display = "none"
}

/**
 * 注册
 */
function registerUser(realmName) {
    //错误提示区域
    let errorBox = document.getElementById('check-error-text')
    errorBox.style.color = "red"
    //校验是否选中了协议
    let isAgreement = document.getElementById('ID_readagreement').checked
    if (!isAgreement) {
        errorBox.style.display = "block"
        errorBox.innerHTML = "你还没有同意用户协议"
        return
    }
    //校验两次密码是否一致
    let password = document.getElementById('ID_password').value
    let passwordConfirm = document.getElementById('password-confirm').value
    if (password != passwordConfirm) {
        console.log('两次密码输入不一致')
        errorBox.style.display = "block"
        errorBox.innerHTML = "两次密码输入不一致"
        return
    }
    let userName = document.getElementById('ID_phonenum').value
    let verificationCode = document.getElementById('ID_verifyCode').value
    let companyName = document.getElementById('ID_companyName').value
    if (!userName || !verificationCode || !companyName || !password) {
        console.log('请输入必填项')
        errorBox.style.display = "block"
        errorBox.innerHTML = "请输入必填项"
        return
    }

    //校验手机号和 密码的有效性
    if (!regInputValue('phone') || !regInputValue('ID_password') || !regInputValue('password-confirm')) {
        return
    }

    //校验都通过了，隐藏错误提示
    errorBox.style.display = "none"

    let userServerDomain = sessionStorage.getItem('userServerDomain')
    let configId = sessionStorage.getItem('configId')
    let theUrl = userServerDomain + '/auth/realms/' + realmName + '/bplus_user_defined/register'
    let params = new URLSearchParams();
    params.append('configId', configId)
    params.append('userName', userName)
    params.append('password', password)
    params.append('companyName', companyName)
    params.append('verificationCode', verificationCode)

    showLoading()
    axios
        .post(theUrl, params, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } })
        .then(function (res) {
            console.log(res)
            hideLoading()
            if (res.data.resultCode == 0) {
                showRegisterOKPage()
            } else {
                showpopwindow(res.data.resultCode, '错误')
            }
        }).catch(err => {
            console.log(err)
            hideLoading()
        })
}

//监听校验输入信息
function regInputValue(type) {
    //错误提示区域
    let errorBox = document.getElementById('check-error-text')
    errorBox.style.color = "red"
    if (type == 'phone') {
        //校验手机号 最大数字13位（86+11位手机号） 只能是数字字符，不能有其他字符和空格。
        var phoneStr = document.getElementById('ID_phonenum').value.toString().replace(/ /g, '');//清除空位
        phoneStr = phoneStr.replace(/\D/g, "");//清除非数字字符
        document.getElementById('ID_phonenum').value = phoneStr //将处理后的手机号回填到输入框
        let phoneTest11 = /(1[3-9]\d{9}$)/;
        let phoneTest13 = /(861[3-9]\d{9}$)/;
        if (phoneStr.length == 11 && phoneTest11.test(phoneStr) || phoneStr.length == 13 && phoneTest13.test(phoneStr)) {
            //校验通过后，取消错误提示语
            errorBox.style.display = "none"
            return true
        } else {
            errorBox.style.display = "block"
            errorBox.innerHTML = "请输入正确的手机号"
            return false
        }
    } else if (type == 'ID_password' || type == 'password-confirm') {
        //校验密码 校验规则 6-20位 最大长度20个字符 
        let password = document.getElementById(type).value.toString().replace(/ /g, '');//清除空位;
        if (!!password && password.length > 5 && password.length < 21) {
            //校验通过后，取消错误提示语
            errorBox.style.display = "none"
            return true
        } else {
            errorBox.style.display = "block"
            errorBox.innerHTML = (type == 'ID_password' ? "请输入密码（6-20位字符）" : "请再次输入密码（6-20位字符）")
            return false
        }
    } else if (type == 'verificationCode') {
        //校验验证码 最大数字6位 只能是数字字符，不能有其他字符和空格。
        var verificationCodeStr = document.getElementById('ID_verifyCode').value.toString().replace(/ /g, '');
        verificationCodeStr = verificationCodeStr.replace(/\D/g, "");//限制只能输入数字
        document.getElementById('ID_verifyCode').value = verificationCodeStr;
        if (!!verificationCodeStr) {
            //校验通过后，取消错误提示语
            errorBox.style.display = "none"
            return true
        } else {
            errorBox.style.display = "block"
            errorBox.innerHTML = "请输入验证码"
            return false
        }
    } else if (type == 'companyName') {
        //校验公司名称 校验规则 最大长度30个字符 
        // let password = document.getElementById('ID_companyName').value;
        return true
    }
    return true
}
