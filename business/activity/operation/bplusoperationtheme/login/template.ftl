<#macro registrationLayout bodyClass="" displayInfo=true displayMessage=true displayRequiredFields=false displayWide=false showAnotherWayIfPresent=true>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"  "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" class="${properties.kcHtmlClass!}">

<head>
    <meta charset="utf-8">
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta name="robots" content="noindex, nofollow">

    <#if properties.meta?has_content>
        <#list properties.meta?split(' ') as meta>
            <meta name="${meta?split('==')[0]}" content="${meta?split('==')[1]}"/>
        </#list>
    </#if>
    <title>${msg("loginTitle",(realm.displayName!''))}</title>
    <link rel="icon" href="${url.resourcesPath}/img/favicon.ico" />
    <#if properties.styles?has_content>
        <#list properties.styles?split(' ') as style>
            <link href="${url.resourcesPath}/${style}" rel="stylesheet" />
        </#list>
    </#if>
    <#if properties.scripts?has_content>
        <#list properties.scripts?split(' ') as script>
            <script src="${url.resourcesPath}/${script}" type="text/javascript"></script>
        </#list>
    </#if>
    <#if scripts??>
        <#list scripts as script>
            <script src="${script}" type="text/javascript"></script>
        </#list>
    </#if>
</head>
<#--  登录总的页面入口模板  -->
<body class="${properties.kcBodyClass!}">
  <div class="Max_box">
    <div class="contentBox">
        <div class="leftContent">
        </div>
        <div class="rightContent">
            <#--  下侧的登录部分  -->
            <div class="loginBox">
            
            <#--  登录标题  -->
            <header class="${properties.kcFormHeaderClass!}">
                <#-- 登录标题部分 默认为else 因为displayRequiredFields在该页面配置的为false-->
                <#if !(auth?has_content && auth.showUsername() && !auth.showResetCredentials())>
                    <#if displayRequiredFields>
                        <div class="${properties.kcContentWrapperClass!}">
                            <div class="${properties.kcLabelWrapperClass!} subtitle">
                                <span class="subtitle"><span class="required">*</span> ${msg("requiredFields")}</span>
                            </div>
                            <div class="col-md-10">
                                <h1 id="kc-page-title"><#nested "header"></h1>
                            </div>
                        </div>
                    <#else>
                        <#--  此处用的是login.ftl文件模板  -->
                        <h1 id="kc-page-title"><#nested "header"></h1>
                        <div class="loginTip">请登录</div>
                    </#if>
                <#else>
                    <#if displayRequiredFields>
                        <div class="${properties.kcContentWrapperClass!}">
                            <div class="${properties.kcLabelWrapperClass!} subtitle">
                                <span class="subtitle"><span class="required">*</span> ${msg("requiredFields")}</span>
                            </div>
                            <div class="col-md-10">
                                <#nested "show-username">
                                <div class="${properties.kcFormGroupClass!}">
                                    <div id="kc-username">
                                        <label id="kc-attempted-username">${auth.attemptedUsername}</label>
                                        <a id="reset-login" href="${url.loginRestartFlowUrl}">
                                            <div class="kc-login-tooltip">
                                                <i class="${properties.kcResetFlowIcon!}"></i>
                                                <span class="kc-tooltip-text">${msg("restartLoginTooltip")}</span>
                                            </div>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    <#else>
                        <#nested "show-username">
                        <div class="${properties.kcFormGroupClass!}">
                            <div id="kc-username">
                                <label id="kc-attempted-username">${auth.attemptedUsername}</label>
                                <a id="reset-login" href="${url.loginRestartFlowUrl}">
                                    <div class="kc-login-tooltip">
                                        <i class="${properties.kcResetFlowIcon!}"></i>
                                        <span class="kc-tooltip-text">${msg("restartLoginTooltip")}</span>
                                    </div>
                                </a>
                            </div>
                        </div>
                    </#if>
                </#if>
            </header>

            <#--  input表单输入部分  -->
            <div id="kc-content">
                <div id="kc-content-wrapper">

                <#-- App-initiated actions should not see warning messages about the need to complete the action -->
                <#-- during login.     -->

                <#-- 成功/警告/错误等的icon的信息模块 -->  
                <#if displayMessage && message?has_content && (message.type != 'warning' || !isAppInitiatedAction??)>
                    <div class="alert alert-${message.type}">
                        <#if message.type = 'success'><span class="${properties.kcFeedbackSuccessIcon!}"></span></#if>
                        <#if message.type = 'warning'><span class="${properties.kcFeedbackWarningIcon!}"></span></#if>
                        <#if message.type = 'error'><span class="${properties.kcFeedbackErrorIcon!}"></span></#if>
                        <#if message.type = 'info'><span class="${properties.kcFeedbackInfoIcon!}"></span></#if>
                        <span class="kc-feedback-text">${kcSanitize(message.summary)?no_esc}</span>
                    </div>
                </#if>

                <#--  此处用的是login.ftl文件模板  -->
                <#nested "form">

                <#if auth?has_content && auth.showTryAnotherWayLink() && showAnotherWayIfPresent>
                <form id="kc-select-try-another-way-form" action="${url.loginAction}" method="post" <#if displayWide>class="${properties.kcContentWrapperClass!}"</#if>>
                    <div <#if displayWide>class="${properties.kcFormSocialAccountContentClass!} ${properties.kcFormSocialAccountClass!}"</#if>>
                        <div class="${properties.kcFormGroupClass!}">
                            <input type="hidden" name="tryAnotherWay" value="on" />
                            <a href="#" id="try-another-way" onclick="document.forms['kc-select-try-another-way-form'].submit();return false;">${msg("doTryAnotherWay")}</a>
                        </div>
                    </div>
                </form>
                </#if>

                <#if displayInfo>
                    <div id="kc-info" class="${properties.kcSignUpClass!}">
                        <div id="kc-info-wrapper" class="${properties.kcInfoAreaWrapperClass!}">
                            <#nested "info">
                        </div>
                    </div>
                </#if>
                </div>
            </div>

            </div>
        </div>
    </div>
    <div class="bottomBox">
        技术支持：深圳兆日科技股份有限公司
    </div>
  </div>
</body>
</html>
</#macro>
