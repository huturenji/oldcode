<#import "template.ftl" as layout>
<@layout.registrationLayout displayInfo=true displayMessage=true displayWide=(realm.password && social.providers??); section>
    <#if section = "html-head">
        <script type="text/javascript" src="${url.resourcesPath}/js/login-util.js"></script>
        <script> 
            //缓存SPA注入的自定义变量，调用接口需要用到，登录页缓存后，其他页面从缓存获取
            cache([{key: 'userServerDomain', value: '${userServerDomain}'}, {key: 'configId', value:'${configId}'}])
        </script>
    <#elseif section = "header">
        <div>${(client.description!'')}</div>
        <div class="loginTip">请登录</div>
    <#elseif section = "form">
    <div id="kc-form" <#if realm.password && social.providers??>class="${properties.kcContentWrapperClass!}"</#if>>
      <div id="kc-form-wrapper" <#if realm.password && social.providers??>class="${properties.kcFormSocialAccountContentClass!} ${properties.kcFormSocialAccountClass!}"</#if>>
        <#if realm.password>
            <form id="kc-form-login" action="${url.loginAction}" method="post">
                <div class="${properties.kcFormLoginTabsClass!}">
                    <#--  登录类型参数password或者verificationCode  -->
                    <input type="hidden" id="authenticationType" name="authenticationType" value="${(authenticationType!'')}"/>
                    <div class="${properties.kcFormLoginTabClass!}" onclick="clickTab1()">
                        <div id="loginTabTxt1" class="${properties.kcFormLoginTabTxtClass!}">${msg("loginPWD")}</div>
                        <div id="loginTabLine1" class="${properties.kcFormLoginTabLineClass!}"></div>
                    </div>
                    <div class="${properties.kcFormLoginTabClass!}" onclick="clickTab2()">
                        <div id="loginTabTxt2" class="${properties.kcFormLoginTabTxtClass!}">${msg("loginVerifyCode")}</div>
                        <div id="loginTabLine2" class="${properties.kcFormLoginTabLineClass!}"></div>
                    </div>
                </div>

                <div class="${properties.kcFormGroupClass!}">
                    <#if usernameEditDisabled??>
                        <label class="user_icon"></label>
                        <input tabindex="1" id="username" class="${properties.kcInputClass!}" placeholder="请输入手机号" name="userName" type='tel' disabled value="${(userName!'')}" required/>
                    <#else>
                        <label class="user_icon"></label>
                        <input tabindex="1" id="username" class="${properties.kcInputClass!}" placeholder="请输入手机号" name="userName" type='tel' maxlength='13' oninput="regInputValue('phone')"  autofocus autocomplete= "new-password" value="${(userName!'')}" required/>
                    </#if>
                </div>

                <div id="loginTabPWD" class="${properties.kcFormGroupClass!}">
                    <label class="pass_icon"></label>
                    <input tabindex="2" id="password" class="${properties.kcInputClass!}" placeholder="请输入密码（6-20位字符）" name="password" type="password" maxlength='20' autocomplete= "new-password" oninput="regInputValue('password')" />
                </div>

                <div id="loginTabVfC" class="${properties.kcFormGroupClass!}">
                    <label class="pass_icon"></label>
                    <input tabindex="2" id="verificationCode" class="${properties.kcInputClass!}" placeholder="请输入验证码" name="verificationCode" type='tel' maxlength='6' oninput="regInputValue('verificationCode')" autocomplete= "new-password" />
                    <div id="getVerifyCode" class="${properties.kcFormVfCClass!}" onclick="getVerificationCode('${realm.name}')">${msg("getVerifyCode")}</div>
                    <div id="verifyTimeCount" class="${properties.kcFormVfCTimeClass!}">60秒</div>
                </div>  
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
                    <div class="${properties.kcFormPoploadingbkClass!}">
                        <img src="${url.resourcesPath}/img/loading.gif" class="${properties.kcFormPoploadingimgClass!}" />  
                    </div> 
                </div>

                <div class="${properties.kcFormGroupClass!} ${properties.kcFormSettingClass!}">
                    <div id="kc-form-options">
                        <#--  忘记密码的提示区域，默认显示  -->
                        <div class="${properties.kcFormOptionsWrapperClass!}">
                            <span><a tabindex="5" href="${url.loginResetCredentialsUrl}">${msg("doForgotPassword")}</a></span>
                        </div>
                    </div>

                    <div id="kc-form-buttons" class="${properties.kcFormGroupClass!}">
                    <#--  登录按钮区域，默认显示  -->
                        <input type="hidden" id="id-hidden-input" name="credentialId" <#if auth.selectedCredential?has_content>value="${auth.selectedCredential}"</#if>/>
                        <input tabindex="4" class="${properties.kcButtonClass!} ${properties.kcButtonPrimaryClass!} ${properties.kcButtonBlockClass!} ${properties.kcButtonLargeClass!}" name="login" id="kc-login" type="submit" value="${msg('doLogIn')}" onclick="return checkLogin()"/>
                    </div>
                </div>
            </form>
        </#if>
        </div>
      </div>
    <#elseif section = "info" >
        <#--  立即注册的提示区域，默认password显示  -->
        <#if realm.password>
            <div id="kc-registration" class="${properties.kclogin2registerClass!}">
                <span>${msg("noAccount")} <a tabindex="6" href="${url.registrationUrl}">${msg("doRegister")}</a></span>
            </div>
        </#if>
    </#if>

</@layout.registrationLayout>
