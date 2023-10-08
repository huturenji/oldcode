var orginMap = {
    "https://bplusdev.sinosun.com:18580": "https://bplusdev.sinosun.com:18180",
    "https://bplussit.sinosun.com:18680": "https://bplussit.sinosun.com:18380",
    // "https://cloud.sinosun.com/": "https://cloud.sinosun.com:9443"
}

function cancelpopwindowlogin() {
    document.getElementById('popwindowlogin').style.display = "none"
    document.getElementById('popwindowcontentlogin').innerHTML = ""
}

function okpopwindowlogin(realmName) {
    let err = document.getElementById('popwindowcontentlogin').innerHTML
    //如果已经登录，跳转到项目首页
    if (err == "您已经登录") {
        cancelpopwindowlogin()
        // window.location = (orginMap[window.origin] || window.origin) + "/activitystudio/static/customer/index.html"
        window.location = window.origin + '/auth/realms/' + realmName + '/protocol/openid-connect/logout?redirect_uri='
            + encodeURI((orginMap[window.origin] || window.origin) + "/activitystudio/static/customer/index.html")
    } else {
        cancelpopwindowlogin()
    }
}