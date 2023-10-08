<#import "template.ftl" as layout>
<@layout.registrationLayout displayInfo=true displayMessage=!messagesPerField.existsError('username'); section>
    <#if section = "html-head">
        <script type="text/javascript" src="${url.resourcesPath}/js/login-reset-pwd-util.js"></script>
    <#elseif section = "header">
        ${msg("emailForgotTitle")}
    <#elseif section = "form">
        <form id="kc-reset-password-form" class="${properties.kcFormClass!}" action="${url.loginAction}" method="post">
            <div class="${properties.kcFormGroupClass!} ${messagesPerField.printIfExists('firstName',properties.kcFormGroupErrorClass!)}">
                <label for="firstName" class="${properties.kcLabelRegisterClass!}">${msg("phonenum")}</label>
                <input type="tel" id="ID_phonenum" class="${properties.kcInputClass!}  ${properties.kcInputRegisterClass!}" name="userName" placeholder="请输入手机号" maxlength='13' oninput="regInputValue('phone')"/>
            </div>

            <div class="${properties.kcFormGroupClass!} ${messagesPerField.printIfExists('lastName',properties.kcFormGroupErrorClass!)}">
                <label for="lastName" class="${properties.kcLabelRegisterClass!}">${msg("verifyCode")}</label>
                <input type="tel" id="ID_verifyCode" class="${properties.kcInputClass!}  ${properties.kcInputRegisterClass!}" placeholder="请输入验证码" name="verificationCode" maxlength='6' oninput="regInputValue('verificationCode')" />
                <div id="getVerifyCode" class="${properties.kcFormVfCClass!} ${properties.kcFormVfCRegisterClass!}" onclick="getVerificationCode('${realm.name}')">${msg("getVerifyCode")}</div>
                <div id="verifyTimeCount" class="${properties.kcFormVfCTimeClass!}  ${properties.kcFormVfCTimeRegisterClass!}">60秒</div>            
            </div>

            <div class="${properties.kcFormGroupClass!} ${messagesPerField.printIfExists('password',properties.kcFormGroupErrorClass!)}">
                <label for="password" class="${properties.kcLabelRegisterClass!}">新密码</label>
                <input type="password" id="ID_password" class="${properties.kcInputClass!}  ${properties.kcInputRegisterClass!}" name="password" placeholder="请输入新密码" autocomplete="new-password" maxlength='20' oninput="regInputValue('ID_password')"/>
            </div>

            <div class="${properties.kcFormGroupClass!} ${messagesPerField.printIfExists('password-confirm',properties.kcFormGroupErrorClass!)}">
                <label for="password-confirm" class="${properties.kcLabelRegisterClass!}">重复新密码</label>
                <input type="password" id="password-confirm" class="${properties.kcInputClass!}  ${properties.kcInputRegisterClass!}" placeholder="请再次输入新密码" name="password-confirm" maxlength='20' oninput="regInputValue('password-confirm')"/>
            </div>      
            <#--  返回登录页  -->
            <div class="${properties.kcFormGroupClass!} ${properties.kcFormSettingClass!}">
                <div id="kc-form-options" class="${properties.kcFormOptionsClass!}">
                    <div class="${properties.kcFormOptionsWrapperClass!}">
                        <span><a id="banckbtn" href="${url.loginUrl}">${kcSanitize(msg("backToLogin"))?no_esc}</a></span>
                    </div>
                </div>
                <div id="kc-form-buttons" class="${properties.kcFormButtonsClass!}">
                    <#--  <input class="${properties.kcButtonClass!} ${properties.kcButtonPrimaryClass!} ${properties.kcButtonBlockClass!} ${properties.kcButtonLargeClass!}" type="submit" value="${msg("doSubmit")}"/>  -->
                    <div class="${properties.kcButtonClass!} ${properties.kcButtonPrimaryClass!} ${properties.kcButtonBlockClass!} ${properties.kcButtonLargeClass!} ${properties.kcButtonCenterClass!}" onclick="resetpwd('${realm.name}')">${msg('doSubmit')}</div>
                </div>
            </div>
        </form>
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
    <#--  <#elseif section = "info" >
        ${msg("emailInstruction")}  -->
    </#if>
</@layout.registrationLayout>
