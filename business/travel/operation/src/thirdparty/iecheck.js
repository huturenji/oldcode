function iecheck() {
    var ie = IEVersion();
    if (ie != -1) {
        window.alert = function (str) {
            var shield = document.createElement("DIV");
            shield.id = "shield";
            shield.style.position = "absolute";
            shield.style.left = "0px";
            shield.style.top = "0px";
            shield.style.width = "100%";
            shield.style.height = document.body.scrollHeight + "px";
            //弹出对话框时的背景颜色 

            shield.style.textAlign = "center";
            shield.style.zIndex = "25";
            //背景透明 IE有效 
            //shield.style.filter = "alpha(opacity=0)"; 
            var alertFram = document.createElement("DIV");
            alertFram.id = "alertFram";
            alertFram.style.position = "absolute";
            alertFram.style.left = "50%";
            alertFram.style.top = "50%";
            alertFram.style.marginLeft = "-225px";
            alertFram.style.marginTop = "-75px";
            alertFram.style.width = "380px";
            alertFram.style.height = "145px";
            alertFram.style.background = "#ff0000";
            alertFram.style.textAlign = "center";
            alertFram.style.lineHeight = "150px";
            alertFram.style.zIndex = "300";
            strHtml = "<ul style=\"list-style:none;margin:0px;padding:0px;boeder-width:100%\">\n";
            strHtml +=
                " <li style=\"text-align: center;background:#478aee;font-size:14px;color:#fff;height:25px;line-height:25px;border:1px solid #82a0ce;\">公告</li>\n";
            strHtml +=
                " <li style=\"background:#fff;text-align:center;font-size:14px;height:120px;line-height:120px;border-left:1px solid #82a0ce;border-bottom:1px solid #82a0ce;border-right:1px solid #82a0ce;\">" +
                str + "</li>\n";
            strHtml += "</ul>\n";
            alertFram.innerHTML = strHtml;
            document.body.appendChild(alertFram);
            document.body.appendChild(shield);
            // var ad = setInterval("doAlpha()", 5);

            alertFram.focus();
            document.body.onselectstart = function () {
                return false;
            };
        }
        // debugger
        alert("本站点不支持IE浏览器,请使用Chrome浏览器")
    }
}

function IEVersion() {
    var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
    var isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1; //判断是否IE<11浏览器
    var isEdge = userAgent.indexOf("Edge") > -1 && !isIE; //判断是否IE的Edge浏览器
    var isIE11 = userAgent.indexOf('Trident') > -1 && userAgent.indexOf("rv:11.0") > -1;
    if (isIE) {
        var reIE = new RegExp("MSIE (\\d+\\.\\d+);");
        reIE.test(userAgent);
        var fIEVersion = parseFloat(RegExp["$1"]);
        if (fIEVersion == 7) {
            return 7;
        } else if (fIEVersion == 8) {
            return 8;
        } else if (fIEVersion == 9) {
            return 9;
        } else if (fIEVersion == 10) {
            return 10;
        } else {
            return 6; //IE版本<=7
        }
    } else if (isEdge) {
        return 'edge'; //edge
    } else if (isIE11) {
        return 11; //IE11
    } else {
        return -1; //不是ie浏览器
    }
}