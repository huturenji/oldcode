<#import "template.ftl" as layout>
<@layout.registrationLayout; section>
    <#if section = "html-head">
        <script type="text/javascript" src="${url.resourcesPath}/js/register-util.js"></script>
    <#elseif section = "header">
        ${msg("doRegister")}
    <#elseif section = "form">
        <form id="kc-register-form" class="${properties.kcFormClass!}" action="${url.registrationAction}" method="post">
            <div class="${properties.kcFormGroupClass!} ${messagesPerField.printIfExists('firstName',properties.kcFormGroupErrorClass!)}">
                <label for="firstName" class="${properties.kcLabelRegisterClass!}">${msg("phonenum")}</label>
                <input type="tel" id="ID_phonenum" class="${properties.kcInputClass!} ${properties.kcInputRegisterClass!}" name="userName" placeholder="请输入手机号" maxlength='13' oninput="regInputValue('phone')"/>
            </div>

            <div class="${properties.kcFormGroupClass!} ${messagesPerField.printIfExists('lastName',properties.kcFormGroupErrorClass!)}">
                <label for="lastName" class="${properties.kcLabelRegisterClass!}">${msg("verifyCode")}</label>
                <input type="tel" id="ID_verifyCode" class="${properties.kcInputClass!} ${properties.kcInputRegisterClass!}" placeholder="请输入验证码" name="verificationCode" maxlength='6' oninput="regInputValue('verificationCode')" />
                <div id="getVerifyCode" class="${properties.kcFormVfCClass!} ${properties.kcFormVfCRegisterClass!}" onclick="getVerificationCode('${realm.name}')">${msg("getVerifyCode")}</div>
                <div id="verifyTimeCount" class="${properties.kcFormVfCTimeClass!} ${properties.kcFormVfCTimeRegisterClass!}">60秒</div>            
            </div>

            <div class="${properties.kcFormGroupClass!} ${messagesPerField.printIfExists('email',properties.kcFormGroupErrorClass!)}">
                <label for="email" class="${properties.kcLabelRegisterClass!}">${msg("companyName")}</label>
                <input type="text" id="ID_companyName" class="${properties.kcInputClass!} ${properties.kcInputRegisterClass!}"  placeholder="请输入企业名称" name="companyName" autocomplete="email" maxlength='30'/>
            </div>

            <div class="${properties.kcFormGroupClass!} ${messagesPerField.printIfExists('password',properties.kcFormGroupErrorClass!)}">
                <label for="password" class="${properties.kcLabelRegisterClass!}">${msg("rpassword")}</label>
                <input type="password" id="ID_password" class="${properties.kcInputClass!} ${properties.kcInputRegisterClass!}" name="password" placeholder="请输入密码（6-20位字符）" autocomplete="new-password" maxlength='20' oninput="regInputValue('ID_password')"/>
            </div>

            <div class="${properties.kcFormGroupClass!} ${messagesPerField.printIfExists('password-confirm',properties.kcFormGroupErrorClass!)}">
                <label for="password-confirm" class="${properties.kcLabelRegisterClass!}">重复密码</label>
                <input type="password" id="password-confirm" class="${properties.kcInputClass!} ${properties.kcInputRegisterClass!}" placeholder="请再次输入密码（6-20位字符）" name="password-confirm" maxlength='20' oninput="regInputValue('password-confirm')"/>
            </div>

            <#if recaptchaRequired??>
            <div class="form-group">
                <div class="${properties.kcInputWrapperClass!}">
                    <div class="g-recaptcha" data-size="compact" data-sitekey="${recaptchaSiteKey}"></div>
                </div>
            </div>
            </#if>
            <#--  弹框-接口出错  -->
            <div id="popwindow" class="${properties.kcFormPopwindowClass!}">
                <div class="${properties.kcFormPopwindowbkClass!}">
                    <div id="popwindowhead" class="${properties.kcFormPopwindowheaderClass!}">提示</div>
                    <div class="${properties.kcFormPopwindowdeliconClass!}" onclick="cancelpopwindow()"></div>
                    <div id="popwindowcontent" class="${properties.kcFormPopwindowcontentClass!}"></div>
                    <div class="${properties.kcFormPopwindowbtncancelClass!}" onclick="cancelpopwindow()">${msg("doCancel")}</div>
                    <div class="${properties.kcFormPopwindowbtnokClass!}" onclick="okpopwindow()">${msg("doSure")}</div>
                </div>
            </div>            
            <#--  弹框-loading页面  -->
            <div id="popwindowloading" class="${properties.kcFormPopwindowClass!}">
                <img src="${url.resourcesPath}/img/loading.gif" class="${properties.kcFormPoploadingimgClass!}" />   
            </div>
            <#--  弹框-用户协议  -->
            <div id="popwindowAgreement" class="${properties.kcFormPopwindowClass!}">
                <div class="${properties.kcFormPopwindowbkClass!} ${properties.kcFormPopwindowagrbkClass!} ">
                    <div class="${properties.kcFormPopwindowheaderClass!}">用户协议</div>
                    <div class="${properties.kcFormPopwindowdeliconClass!}" onclick="cancelpopAgreement()"></div>
                    <div id="ID_popwindowAgreement" class="${properties.kcFormPopwindowcontentClass!}"></div>      
                </div>      
            </div>
            
            <div class="${properties.kcFormGroupClass!}">
                <div id="kc-form-options" class="${properties.kcFormOptionsClass!}">
                    <div class="${properties.kcFormOptionsWrapperClass!}">
                        <span><a href="${url.loginUrl}">${kcSanitize(msg("backToLogin"))?no_esc}</a></span>
                    </div>
                </div>

                <div id="kc-form-buttons" class="${properties.kcFormButtonsClass!}">
                    <input type="checkbox" id="ID_readagreement"  name="readProtocl" value="1">阅读并同意<span onclick="readAgreement()" class="${properties.kcFormreadAgreementClass!}">《平台服务协议》</span>
                    <#--  <input class="${properties.kcButtonClass!} ${properties.kcButtonPrimaryClass!} ${properties.kcButtonBlockClass!} ${properties.kcButtonLargeClass!}" type="submit" value="${msg('doRegister')}"/>  -->
                    <div class="${properties.kcButtonClass!} ${properties.kcButtonPrimaryClass!} ${properties.kcButtonBlockClass!} ${properties.kcButtonLargeClass!} ${properties.kcButtonCenterClass!}" onclick="registerUser('${realm.name}')">${msg('doRegister')}</div>
                </div>
            </div>
        </form>

        <#--  注册成功页面  -->
        <div id="kc-form-register-ok" class="${properties.kcFormClass!}">
            <img src="${url.resourcesPath}/img/register-success.png" class="${properties.kcRegisterOkImgClass!}" />   
            <div class="${properties.kcRegisterOkTipClass!}">提交成功</div>
            <div>${msg("registerOKtips")}</div>
            <div class="${properties.kcFormButtonsClass!} ${properties.kcRegisterOkBtnsClass!}">
                <span  class="${properties.kcButtonClass!} ${properties.kcButtonPrimaryClass!} ${properties.kcButtonBlockClass!} ${properties.kcButtonLargeClass!}" >
                    <a href="${url.loginUrl}" class="${properties.kcRegisterOkATagClass!}">返回登录</a>
                </span>
            </div>
        </div>
    </#if>
</@layout.registrationLayout>
