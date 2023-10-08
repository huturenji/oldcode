//前端渠道的配置项数据源
export let channelConfigTextMap = () => {
    return {
        approvalRequestUrl: {
            name: "审批接入地址：",
            placeholder: "请输入审批接入地址"
        },
        pushRequestUrl: {
            name: "推送接入地址：",
            placeholder: "请输入推送接入地址"
        },
        companyInvoiceTitleUrl: {
            name: "企业发票抬头地址：",
            placeholder: "请输入企业发票抬头地址，找行长确认"
        },
        clientId: {
            name: "keyCloakClientId：",
            placeholder: "请输入keyCloakClientId，渠道分配给B+的token接口入参，找行长确认",
            keyDesc: "渠道分配给B+的token接口入参"
        },
        clientSecret: {
            name: "keyCloakClientSecret：",
            placeholder: "请输入keyCloakClientSecret，渠道分配给B+的token接口入参，找行长确认",
            keyDesc: "渠道分配给B+的token接口入参"
        },
        keyCloakUrl: {
            name: "token接口地址：",
            placeholder: "请输入token接口地址，渠道提供的，用于B+授权的token接口地址，找行长确认",
            keyDesc: "渠道提供的，用于B+授权的token接口地址"
        },
        syncInvoiceUrl: {
            name: "上报发票地址：",
            placeholder: "请输入上报发票地址，渠道提供的，用于B+同步发票信息的接口地址，找行长确认",
            keyDesc: "渠道提供的，用于B+同步发票信息的接口地址"
        }
    };
};
//根据configKey从配置项列表获取某个配置项
export let findChannelConfig = (configList, key) => {
    if (!configList || !key) {
        return {};
    } 
    return (
        configList.find((item) => {
            return item.configKey == key;
        }) || {}
    );
  
};
//前端老板付的配置项数据源,这些都是外部 行长提供的
export let bosspayConfigTextMap1 = (paytype) => {
    if (paytype == 'SM2'){ //SM2
        return {
            alias: {
                name: "支付方式简称：",
                placeholder: "请输入支付方式简称,最大64位，找行长确认"
            },
            apiUrl: {
                name: "支付服务地址：",
                placeholder: "请输入支付服务地址,最大255位，找行长确认"
            },
            shopId: {
                name: "商户号：",
                placeholder: "请输入商户号,最大64位，找行长确认"
            },
            thirdPublicKey: {
                name: "第三方公钥：",
                placeholder: "请输入第三方公钥,最大128位，找行长确认"
            },
            icon: {
                name: "支付图标：",
                placeholder: "请输入公钥,最大64K，找行长确认",
                isImg:true,
                showDel:true
            },
            account: {
                name: "收方账户账号：",
                placeholder: "请输入收方账户账号，渠道提供的，用于B+支付配置，找行长确认",
                isOptional:true
            },
            accountName: {
                name: "收方账户名称：",
                placeholder: "请输入收方账户名称，渠道提供的，用于B+支付配置，找行长确认",
                isOptional:true
            },
            recvbank: {
                name: "商户开户行行号：",
                placeholder: "请输入商户开户行行号，渠道提供的，用于B+支付配置（非本行账号必填），找行长确认",
                isOptional:true
            },
            recvbankName: {
                name: "商户开户行名称：",
                placeholder: "请输入商户开户行名称，渠道提供的，用于B+支付配置（非本行账号必填），找行长确认",
                isOptional:true
            }      
        };
    }//SM9
    return {
        alias: {
            name: "支付方式简称：",
            placeholder: "请输入支付方式简称,最大64位，找行长确认"
        },
        apiUrl: {
            name: "支付服务地址：",
            placeholder: "请输入支付服务地址,最大255位，找行长确认"
        },
        shopId: {
            name: "商户号：",
            placeholder: "请输入商户号,最大64位，找行长确认"
        },
        thirdPublicKey: {
            name: "第三方公钥：",
            placeholder: "请输入第三方公钥,最大128位，找行长确认"
        },
        icon: {
            name: "支付图标：",
            placeholder: "请输入公钥,最大64K，找行长确认",
            isImg:true
        }
    };
  
};
//前端老板付的配置项数据源，这些都是B+，不依赖外部的
export let bosspayConfigTextMap2 = (paytype) => {
    if (paytype == 'SM2'){ //SM2
        return {
            publicKey: {
                name: "公钥：",
                placeholder: "最大128位，B+固定参数，拷贝其它已有配置即可"
            },
            privateKey: {
                name: "私钥：",
                placeholder: "B+固定参数，拷贝其它已有配置即可"
            },
            notifyUrl: {
                name: "回调地址：",
                placeholder: "最大255位，B+固定参数，需区分银行对接的是伴正事还是T信"
            }
        };
    }//SM9
    return {
        publicCommonParam: {
            name: "公共参数：",
            placeholder: "B+固定参数，拷贝其它已有配置即可",
            color: "white"
        },
        privateKey: {
            name: "私钥：",
            placeholder: "B+固定参数，拷贝其它已有配置即可"
        },
        privateKeyPwd: {
            name: "私钥密码：",
            placeholder: "最大128位，B+固定参数，拷贝其它已有配置即可"
        },
        notifyUrl: {
            name: "回调地址：",
            placeholder: "最大255位，B+固定参数，需区分银行对接的是伴正事还是T信"
        }
    };
  
};
export let bosspayConfigTextMap = (signType) => {  
    let myType = parsePayType(signType)
    return JSON.parse(
        (
            JSON.stringify(bosspayConfigTextMap1(myType)) +
      JSON.stringify(bosspayConfigTextMap2(myType))
        ).replace(/}{/, ",")
    );
};
//根据configKey从配置项列表获取某个配置项
export let findBosspayConfig = (config, key) => {
    if (!config || !key) {
        return "";
    } 
    return config[key];
  
};

//京东：“JD”、苏宁：“SN” 西域-XY
export let getPushTemplateTypes = () => {
    return [
        { businessType: "JD", businessTypeDesc: "京东" },
        { businessType: "SN", businessTypeDesc: "苏宁" },
        { businessType: "XY", businessTypeDesc: "西域" }
    ];
};

/**
 * 页面上的 数据转换
 */
export function getCascaderList(sData, isDir = true) {
    let resultArray = [];
    for (let i = 0; i < sData.length; i++) {
        let key = sData[i].companyId || sData[i].channelId;
        let value = sData[i].companyName || sData[i].channelName;
        if (!key || !value) {
            continue;
        }

        let item = {
            // value: parseInt(key),
            value: key,
            label: value
        };
        if (isDir) {
            item.loading = false;
            item.children = [];
        }
        resultArray.push(item);
    }
    return resultArray;
}

/**
 *
 * @param {Object} content      内容
 * @param {Object} rightFunction   右侧按钮点击事件
 * @param {Object} title        title
 * @param {Object} type         类型       1-单个按钮  2-两个按钮  3-多个按钮      默认为两个按钮
 * @param {Object} strLeftBtn   左侧按钮
 * @param {Object} strRightBtn  右侧按钮
 * @param {Object} leftFunction   左侧按钮点击事件
 * @param {Object} H5Flag       是否调用H5方法
 */
export function showConfirm(
    content,
    rightFunction,
    type,
    strLeftBtn,
    strRightBtn,
    title,
    leftFunction,
    // eslint-disable-next-line no-unused-vars
    H5Flag
) {
    // eslint-disable-next-line no-redeclare
    var type = type || 2; //默认两个按钮
    Vue.$vux.confirm.show({
    //显示confirm弹窗   暂时屏蔽H5方法
        title: title || "",
        content: content,
        confirmText: strRightBtn,
        cancelText: strLeftBtn,
        showCancelButton: type == 2,
        onShow() {
            console.log("show");
        },
        onHide() {
            console.log("hide");
        },
        onCancel() {
            leftFunction();
        },
        onConfirm() {
            rightFunction();
        }
    });
}
/**
 * JS的实现下载文件功能。这个不会让浏览器弹出数据框
 * @param url 下载地址，也可以是一个blob对象，必选
 * @param saveName 保存文件名，可选
 */
export function downloadFile(url, saveName) {
    if (typeof url == "object" && url instanceof Blob) {
        url = URL.createObjectURL(url); // 创建blob地址
    }
    var aLink = document.createElement("a");
    aLink.href = url;
    aLink.download = saveName || ""; // HTML5新增的属性，指定保存文件名，可以不要后缀，注意，file:///模式下不会生效

    var event;
    if (window.MouseEvent) {
        event = new MouseEvent("click");
    }
    else {
        event = document.createEvent("MouseEvents");
        event.initMouseEvent(
            "click",
            true,
            false,
            window,
            0,
            0,
            0,
            0,
            0,
            false,
            false,
            false,
            false,
            0,
            null
        );
    }
    aLink.dispatchEvent(event);
}
/**
 * 是否是有效的名字，汉字 英文 数字 _-/
 * @param {*} input 
 */
export function isVailidName(input) {
    var reg = /^[\w\u4e00-\u9fa5\-\/]+$/
    return reg.test(input)
}

//对公支付方式
export let getAllPayTypes = () => {
    return [
        { name: "SM9（老板付）", value: "SM9" },
        { name: "SM2（公款闪付、公款转账）", value: "SM2" }
    ];
};
//对公支付方式
export let parsePayType = (paytype) => {
    return getAllPayTypes().find(item=>{
        return paytype.indexOf(item.value) != -1
    }).value
};