/**
 *属性处理类,一些数据中台的属性配置，都放到这里保存和获取
 */
class Properties {
    constructor() {
    //存储发票的配置信息
        this.invoiceProperties = {
            //发票抬头类型，1=个人，2=企业
            invoiceTitleType: {
                1: "个人",
                2: "企业"
            },
            //发票状态，开票状态,0=未开票，1=已开票
            invoiceState: {
                0: "待开票",
                1: "已开票"
            },
            //发票类型,2=增值税专用发票，3=电子发票
            invoiceCategory: {
                2: "增值税专用发票",
                3: "电子发票"
            }
        };
        //存储订单的配置信息
        this.orderProperties = {
            //订单状态，订单状态，0=全部，1=待审批；2=待付款；3=待发货；4=待收货,5=已完成；6=已取消,7=已分单
            orderState: {
                0: "全部",
                1: "待审批",
                2: "待付款",
                // 3: "待发货",
                4: "待收货",
                5: "已完成",
                6: "已取消"
                // 7: "已分单"
            },
            //物流状态，0=运输中，1=配送中，2=已签收
            expressOrderState: {
                0: "运输中",
                1: "配送中",
                2: "已签收"
            },
            //支付方式，1=微信，2=支付宝，3=老板付，7=银联支付，8=行内转账,10=微信沙箱，11=支付宝沙箱,13=行内转账UAT，14=行内转账SIT
            paymentTypeDesc: {
                1: "微信",
                2: "支付宝",
                3: "老板付",
                7: "银联支付",
                8: "老板付",
                10: "微信沙箱",
                11: "支付宝沙箱",
                13: "老板付-UAT",
                14: "老板付-SIT",
                "WX_PAY": "微信",
                "ALI_PAY": "支付宝",
                "WALLET_PAY": "老板付",
                "UNION_PAY": "银联支付",
                "INBANK_PAY": "老板付",
                "WX_PAY_TEST": "微信沙箱",
                "ALI_PAY_TEST": "支付宝沙箱",
                "INBANK_PAY_UAT": "老板付-UAT",
                "INBANK_PAY_SIT": "老板付-SIT"
            }
        };

        //存储图片的配置信息.
        //n0(最大图 800*800px)、n1(350*350px)、n2(160*160px)、n3(130*130px)、n4(100*100px) 为图片大小,n12大图无水印
        //n0带有京东水印，其余的n1-n4不带，12 大图无水印的.也可以https://img13.360buyimg.com/n0/s450*400_ 自定义大小
        this.imgProperties = {
            imgHost: "https://img13.360buyimg.com/",
            imgSize: {
                n0: "n0/",
                n1: "n1/",
                n2: "n2/",
                n3: "n3/",
                n4: "n4/",
                n12: "n12/"
            }
        };
        //fs文件存储的配置信息
        //商城自己的文件服务fs的地址是 https://bplusdev.sinosun.com:18180/mall/file/v1，前部的域名是跟API一致的。
        //https://bplusdev.sinosun.com:18180/mall/file/v1/content/static/p/add/channel/user.pdf
        this.fsProperties = {
            fsBasePath: "/mall/file/v1/content"
        };
    }
    /**发票抬头类型转换
   * @type
   */
    getInvoiceTitleTypeProp(type) {
        return this.invoiceProperties["invoiceTitleType"][type];
    }
    /**发票状态，转换
   * @type
   */
    getInvoiceStateProp(type) {
        return this.invoiceProperties["invoiceState"][type];
    }
    /**发票类型转换
   * @type
   */
    getInvoiceCategoryProp(type) {
        return this.invoiceProperties["invoiceCategory"][type];
    }
    /**订单状态转换
   * @type
   */
    getOrderStateProp(type) {
        return this.orderProperties["orderState"][type];
    }
    /**订单支付方式转换
   * @type
   */
    getPaymentTypeProp(type) {
        return this.orderProperties["paymentTypeDesc"][type];
    }
    /**订单物流状态
   * @type
   */
    getExpressOrderState(type) {
        return this.orderProperties["expressOrderState"][type];
    }

    /**
   * Unix时间戳转换
   * @param {string}
   */
    getapplyTimeProp(UnixTime, type = 1) {
        if (!UnixTime) {
            return ""
        }
        var date = new Date(parseInt(UnixTime));
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        month = month < 10 ? "0" + month : month;
        var day = date.getDate();
        day = day < 10 ? "0" + day : day;
        var hour = date.getHours();
        hour = hour < 10 ? "0" + hour : hour;
        var minute = date.getMinutes();
        var second = date.getSeconds();
        minute = minute < 10 ? "0" + minute : minute;
        second = second < 10 ? "0" + second : second;
        if (type == 1) {
            return (
                year +
        "-" +
        month +
        "-" +
        day +
        " " +
        hour +
        ":" +
        minute +
        ":" +
        second
            );
        } else if (type == 2) {
            return year + "年" + month + "月" + day + "日";
        }
    }

    /**
   * 将京东的图片path加上前缀，变成可以直接访问的图片地址
   * @param {*} imgPath
   * @param {*} picSize size有多个大小，列表的我们用n4，大图用n0
   */
    getFullImgPath(imgPath, picSize = "n4") {
        if (!imgPath) {
            return "";
        }
        //地址中 HTTP打头的，都是不需要拼接的
        let prefix = "http";
        if (
            imgPath.slice(0, prefix.length) === prefix
        ) {
            return imgPath;
        }
        //imgpath是所有的京东接口的path，需要拼接的京东图片地址
        let result =
      this.imgProperties["imgHost"] +
      this.imgProperties["imgSize"][picSize] +
      imgPath;
        return result;
    }
    /**订单配送人员信息是否展示根据物流状态决定
   * @type
   */
    processExpressManInfo(express) {
        if (!express) {
            return;
        }
        if (express.state && express.state == 0) {
            delete express["phone"];
        } else {
            console.log("keep it");
        }
    }
    /**
   * 拼接fs的文件地址
   */
    getFullfsPath(filePath) {
        if (!filePath) {
            return "";
        }
        //地址HTTP打头的，都是不需要拼接的
        let prefix = "http";
        if (filePath.slice(0, prefix.length) === prefix) {
            return filePath;
        }
        //使用本地的域名加上文件服务地址，再加上相对路径
        let result = this.getSinosunFsOrigin() + filePath;
        return result;
    }
    /**
   * 获取兆日的文件服务器，域名和服务名
   */
    getSinosunFsOrigin() {
        return location.origin + this.fsProperties["fsBasePath"]
    }
}

export default new Properties();
