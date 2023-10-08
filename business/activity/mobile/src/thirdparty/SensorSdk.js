/*eslint-disable */
/*
 * @Author: hujinhui
 * @Date: 2022-06-13 16:41:22
 * @LastEditTime: 2022-07-07 17:17:57
 * @Description: SDK埋点配置
*/

/*
 * init(appId, serverAddress, token, autoPageView=true) 初始化，且前三个参数为必传
 * appId: 智e采平台分配的应用唯一Id
 * serverAddress： 智e采服务地址
 * token: 请求接口的授权token
 * autoPageView: 不传默认true，sdk自动抓取页面浏览事件，false 时sdk不自动抓取页面浏览，由H5应用层调用 sdk.initPage()方法触发页面浏览事件
 *
 * reportEvent(eventId, {key:value}) 自定义上报事件，事件id和事件对象
 * eventId: 业务自定义的事件ID，值为app-viewScreen时，则为页面浏览事件手动埋点
 * \[key,value\]: 业务自定义的属性字段，是Object对象类型
 *
 * setAttributs(data) 设置用户属性（用户自定义上报参数）
 * data 为对象，{key:value}：要设置的用户属性数组对象，可以有多个key-value
 *
 * setUserId(userId) 设置用户id
 *
 * setBankId(bankId) 设置银行id
 *
 * setCompanyId(companyId) 设置企业id
 *
 * updateToken(token) 更新token
 *
 * setPage(pagePath) 应用层指定url
*/
(function (global) {
    // 判断用户是否是第一次进入页面
    if (localStorage.getItem("isFirstTime")) {
        localStorage.setItem("isFirstTime", "N");
    } else {
        localStorage.setItem("isFirstTime", "Y");
    }
    // 全局参数配置
    var page; // 当前页URL
    var refer;
    var filter_url_params = true; // 是否过滤URL中传递的参数
    // 存放xml解析的json对象
    // var xmlObj = {};
    var xmlObjList = [];
    // 用户设置的url，pagePathURL存在会获取当前保存的，否则自动获取当前页面的pathname
    var pagePathURL = "";
    // 上报条件
    var reportConditions = {
        time: 300,
        list: 5
    };
    // 获取xml接口url
    var downLoadURL = "/operation/dataetl/v1/probeSetting/probeSettingAppSetting";
    // 上报接口url
    var reportURL = "/operation/dataetl/v1/sendSensorData"
    // indexeddb数据库对象
    var myDB = {
        name: 'sinosunStorage',
        tableName: 'sinosunList',
        db: null
    };
    // 保存用户传入标识
    var configInfo = {
        appId: '',
        serverAddress: '',
        token: '',
        autoPageView: true,
        userId: '',
        bankId: '',
        companyId: ''
    };
    var heatMap = {
        /**
         * sdk初始化，检查历史埋点数据和获取xml配置
         * @param {String} appId  用于查询采集策略xml内容 必传
         * @param {String} serverAddress  请求ajax地址host 必传
         * @param {String} token 请求命令牌 必传
         * @param {Boolean} autoPageView 是否自动抓取app-viewScreen事件
         */
        init: function (appId, serverAddress, token, autoPageView) {
            if (!appId || !serverAddress || !token) {
                console.error("SensorSdk初始化参数异常");
                return
            }
            configInfo.appId = appId;
            configInfo.serverAddress = serverAddress;
            configInfo.token = token;
            if (heatMap.isBoolean(autoPageView)) {
                configInfo.autoPageView = autoPageView;
            }
            heatMap.openDB(myDB.name, myDB.db, myDB.tableName).then(() => {
                heatMap.checkAndUpload();
                heatMap.checkDeviceId();
                heatMap.getXML();
            }).catch(() => {
                console.error("indexedDB数据库初始化失败，请稍后重试")
            })
        },
        /**
         * sdk初始化调用，检查本地是否有历史未上传完的事件
         * @param {Boolean} force false 表示不强制上传，需检查事件数量和上报时间间隔； true  强制立马上传事件
         */
        checkAndUpload: function (force) {
            var temp;
            if (heatMap.isBoolean(force)) {
                temp = force;
            } else {
                temp = true;
            }
            if (temp) {
                // 获取数据库数据
                heatMap.cursorGetData(myDB.db, myDB.tableName).then(res => {
                    var list = res;
                    if (list.length > 0) {
                        for (let i = 0; i < list.length; i++) {
                            if (list[i].isSend) {
                                delete list[i].isSend;
                                heatMap.putData(myDB.db, myDB.tableName, list[i]);
                            }
                        }
                        heatMap.reportBuryPoint(list);
                    }
                }).catch(() => {
                    console.error("读取indexedDB数据失败");
                })
            } else {
                // 检查是否上报
                heatMap.checkReportPoint();
            }
        },
        //
        /**
         * 更新token
         * @param {String} token 用户设置token
         */
        updateToken: function (token) {
            configInfo.token = token;
        },
        /**
         * sdk缓存用户UserId，后续触发事件会带上新的UserId
         * @param {String} userId 设置用户id
         */
        setUserId: function (userId) {
            configInfo.userId = userId;
        },
        /**
         * sdk缓存BankId，后续触发事件会带上新的BankId
         * @param {String} bankId 设置银行id
         */
        setBankId: function (bankId) {
            configInfo.bankId = bankId;
        },
        /**
         * sdk缓存CompanyId，后续触发事件会带上新的CompanyId
         * @param {String} companyId 设置企业id
         */
        setCompanyId: function (companyId) {
            configInfo.companyId = companyId;
        },
        /**
         * 设置当前单页页面的pagePath（pagePath一旦设置，之后的页面url改变需同步设置，否则将沿用上一次的pagePath）
         * @param {String} pagePath 用户手动设置的pagePath
         */
        setPage: function (pagePath) {
            pagePathURL = pagePath
        },
        /**
         * 当用户有属性新增或变更时设置用户属性
         * @param {object} data 为对象，{key:value}：要设置的用户属性数组对象，可以有多个key-value
         */
        setAttributs: function (data) {
            if (!heatMap.isObject(data)) {
                console.error("setAttributs函数的参数应该是Object类型");
                return
            }
            heatMap.openDB(myDB.name, myDB.db, myDB.tableName).then(() => {
                var obj = {
                    ...heatMap.setBaseInfo('set-attributes'),
                    properties: {
                        ...data
                    }
                }
                heatMap.saveSensorData(obj);
            }).catch(() => {
                console.error("indexedDB数据库初始化失败，请稍后重试")
            })
        },
        /**
         * 用于设置上报的JSON数据的主体
         * @param {String} eventId 参数为上报事件类型
         * @returns {object} 返回值为上报事件模型的主体对象
         */
        setBaseInfo: function (eventId) {
            const baseInfo = {
                version: "1",
                type: 2,
                deviceId: localStorage.getItem('deviceId') || '',
                appId: configInfo.appId || '',
                userId: configInfo.userId || '',
                eventId: eventId,
                timestamp: new Date().getTime(),
                isSend: true
            }
            if (configInfo.bankId) {
                baseInfo.bankId = configInfo.bankId;
            }
            if (configInfo.companyId) {
                baseInfo.companyId = configInfo.companyId;
            }
            return baseInfo;
        },
        /**
         * 保存需要上报的事件，并进行是否需要上报事件的校验
         * @param {object} obj 为需要保存的事件对象
         */
        saveSensorData: function (obj) {
            // 读取数据，检查是否上报
            heatMap.addData(myDB.db, myDB.tableName, obj).then((res) => {
                heatMap.checkReportPoint();
            }).catch(() => {
                console.error("新增indexedDB数据失败");
            })
        },
        /**
         * 生成deviceId
         * @returns {any} 生成的deviceId值
         */
        guid: function () {
            return 'xxxxxxxx-xxxx-xxxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                var r = Math.random() * 16 | 0,
                    v = c == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
        },
        /**
         * 检查本地是否存在deviceId，如果存在就跳过，不存在则生成deviceId并保存本地，同时上报设备属性
         */
        checkDeviceId: function () {
            var uuid = localStorage.getItem('deviceId');
            // 判断deviceId是否存在
            if (!uuid) {
                // 不存在，则生成deviceId
                var deviceId = this.guid();
                localStorage.setItem('deviceId', deviceId);
                var systemItem = this.systemRedirect();
                var browser = this.getUA();
                var systemObj = {
                    ...heatMap.setBaseInfo('set-attributes'),
                    // 应用层上报的属性内容
                    properties: {
                        deviceOs: systemItem.type,
                        deviceOsVersion: systemItem.version,
                        language: window.navigator.language,
                        screenResolutionX: window.screen.width,
                        screenResolutionY: window.screen.height,
                        browser: browser.type,
                        browserVersion: browser.version
                    },
                }
                heatMap.saveSensorData(systemObj);
            }
        },
        /**
         * 获取用户系统信息，返回系统类型和版本
         * @returns {object} 返回系统和版本
         */
        systemRedirect: function () {
            var systemInfo = {};
            // var sUserAgent = navigator.userAgent;
            var isWin = (navigator.platform == "Win32") || (navigator.platform == "Windows");
            var isMac = (navigator.platform == "Mac68K") || (navigator.platform == "MacPPC") || (navigator.platform ==
                "Macintosh") || (navigator.platform == "MacIntel");
            if (isMac) {
                systemInfo.type = "Mac";
                var ua = navigator.userAgent.toLowerCase();
                var version = null;
                var reg = /x [\d._]+/gi;
                var v_info = ua.match(reg);
                version = (v_info + "").replace(/[^0-9|_.]/ig, "").replace(/_/ig, "."); //得到版本号9.3.2或者9.0
                // version = parseInt(version.split('.')[0]); // 得到版本号第一位
                systemInfo.version = version;
                return systemInfo
            };
            var isUnix = (navigator.platform == "X11") && !isWin && !isMac;
            if (isUnix) {
                systemInfo.type = "Unix";
                systemInfo.version = 'other';
                return systemInfo;
            }
            var isLinux = (String(navigator.platform).indexOf("Linux") > -1);
            if (isLinux) {
                systemInfo.type = "Linux";
                systemInfo.version = 'other';
                return systemInfo;
            }
            if (isWin) {
                var ua = navigator.userAgent.toLowerCase();
                var version = null;
                var reg = /nt [\d._]+/gi;
                var v_info = ua.match(reg);
                version = (v_info + "").replace(/[^0-9|_.]/ig, "").replace(/_/ig, "."); //得到版本号9.3.2或者9.0
                systemInfo.type = "windows";
                systemInfo.version = version;
                return systemInfo
            }
            return {
                type: "未知",
                version: ''
            };
        },
        /**
         * 获取浏览器信息
         * @returns {object} 返回浏览器类型和版本
         */
        getUA: function () {
            var Sys = {};
            var ua = navigator.userAgent.toLowerCase();
            var s;
            if ((s = ua.match(/opera.([\d.]+)/))) {
                Sys.type = 'opera';
                Sys.version = Number(s[1].split('.')[0]);
            } else if ((s = ua.match(/msie ([\d.]+)/))) {
                Sys.type = 'ie';
                Sys.version = Number(s[1].split('.')[0]);
            } else if ((s = ua.match(/edge.([\d.]+)/))) {
                Sys.type = 'edge';
                Sys.version = Number(s[1].split('.')[0]);
            } else if ((s = ua.match(/firefox\/([\d.]+)/))) {
                Sys.type = 'firefox';
                Sys.version = Number(s[1].split('.')[0]);
            } else if ((s = ua.match(/chrome\/([\d.]+)/))) {
                Sys.type = 'chrome';
                Sys.version = Number(s[1].split('.')[0]);
            } else if ((s = ua.match(/version\/([\d.]+).*safari/))) {
                Sys.type = 'safari';
                Sys.version = Number(s[1].match(/^\d*.\d*/));
            } else if ((s = ua.match(/trident\/([\d.]+)/))) {
                Sys.type = 'ie';
                Sys.version = 11;
            } else {
                Sys.type = '未知';
                Sys.version = '';
            }
            return Sys;
        },
        /**
         * 初始化elementClick并进行监听用户点击事件
         * @returns {any} 如果解析elementClick中判断条件为false，则停止上报
         */
        initEvent: function () {
            document.addEventListener("click", function (e) {
                e = e || window.event;
                var t = e.target || e.srcElement;
                // console.log("当前点击的元素", [t]);
                // 判断是否抓取当前点击元素
                var pathInfo = heatMap.getCssSecltor(t);
                var notifyInfo = {}
                notifyInfo.data = {};
                var flag = false;
                // 解析xmlObjList对象中的elementClick对象
                for (let index = 0; index < xmlObjList.length; index++) {
                    var obj = xmlObjList[index].elementClick;
                    if (obj) {
                        if (heatMap.filterCondition("click", xmlObjList[index].elementClick.filter, t, pathInfo.pathId)) {
                            flag = true;
                            for (const key in obj) {
                                if (key != "filter") {
                                    // 获取url query
                                    if (key === "elementExtData") {
                                        // 判断自定义属性是否上报
                                        var bool = false;
                                        if (obj.elementExtData.customFilter.key === "*") {
                                            // 如果判断条件的值为*，则判断对应的属性值是否为null，是，则说明不存在该属性
                                            if (heatMap.screenClickValue(obj.elementExtData.customFilter.elementId, t, pathInfo.pathId) === null) {
                                                bool = false;
                                            } else {
                                                bool = true;
                                            }
                                        } else if (heatMap.screenClickValue(obj.elementExtData.customFilter.elementId, t, pathInfo.pathId) === obj.elementExtData.customFilter.key) {
                                            bool = true;
                                        }
                                        if (bool) {
                                            for (const key1 in obj.elementExtData) {
                                                if (key1 != 'customFilter') {
                                                    notifyInfo.data[obj.elementExtData[key1]] = heatMap.screenClickValue(key1, t, pathInfo.pathId);
                                                }
                                            }
                                        }
                                    } else {
                                        var temp = heatMap.screenClickValue(key, t, pathInfo.pathId);
                                        // 当temp为null或undefined类型时，统一赋值空字符串
                                        notifyInfo[obj[key]] = temp == null? '': temp;
                                    }
                                }
                            }
                        }
                    }
                }
                // console.log(flag);
                if (!flag) return;
                // 保存json上报数据，触发埋点上报开关
                var clickObj = {
                    ...heatMap.setBaseInfo('app-click'),
                    properties: {
                        ...notifyInfo
                    }
                }
                heatMap.saveSensorData(clickObj);
            }, true)
        },
        // 获取页面路径
        /**
         * 解析pageViewKeys对象，同时提供给单页面页面url变化时调用，抓取页面信息
         * @returns {any} 解析pageViewKeys对象中条件为false时停止上报
         */
        initPage: function () {
            page = window.location.href; // 当前页URL
            refer = filter_url_params ? this.delUrlParams(window.document.referrer) : window.document.referrer; // 来源页URL
            var query = page.indexOf("?") > 0 ? page.substring(page.indexOf('?') + 1) : '';
            var queryList = [];
            if (query) {
                queryList = this.splitQuery(query);
            }
            var pageInfo = {};
            for (let index = 0; index < xmlObjList.length; index++) {
                var obj = xmlObjList[index].pageViewKeys;
                for (const key in obj) {
                    if (key === "query") {
                        // 获取url query
                        pageInfo.query = new Object(pageInfo.query)
                        for (const key1 in obj.query) {
                            var target = '';
                            for (let i = 0; i < queryList.length; i++) {
                                for (const y in queryList[i]) {
                                    if (y === key1) {
                                        target = queryList[i][y];
                                    }
                                }
                            }
                            pageInfo.query[obj.query[key1]] = target;
                            // delete pageInfo.query[key1]
                        }
                    } else {
                        var temp = this.screenPageValue(key);
                        // 当temp为null或undefined时，赋值空字符串
                        pageInfo[obj[key]] = temp == null? "": temp;
                    }
                }
            }
            // 保存json上报数据，触发埋点上报开关
            if (Object.getOwnPropertyNames(pageInfo).length === 0) return;
            // 触发上报
            var pageObj = {
                ...heatMap.setBaseInfo('app-viewScreen'),
                properties: {
                    ...pageInfo
                }
            }
            heatMap.saveSensorData(pageObj);
        },
        // 离开页面触发
        leavePage: function () {
            window.addEventListener('unload', () => {

            });
            window.onbeforeunload = function () {
                // JSON.parse(localStorage.getItem("myDB"))
            }
        },
        /**
         * 将XML的Document对象转换为JSON对象数组
         * @param xmlDoc xml的Document对象
         * @return string
         */
        convertToJSON: function (xmlDoc) {
            var buffer = new Array();
            var obj = {}
            //获取xml文档的所有子节点
            for (let i = 0; i < xmlDoc.length; i++) {
                var obj = {}
                var nodeList = xmlDoc[i].childNodes;
                generate(nodeList);
                buffer.push(obj)
            }
            for (let i = 0; i < buffer.length; i++) {
                // 将符合条件的xml筛选出来
                if (!heatMap.filterCondition('page', buffer[i].pagefilters)) {
                    buffer.splice(i, 1)
                }
            }
            xmlObjList = buffer;
            if (buffer.length > 0) {
                // 初始化click和page事件
                heatMap.initEvent();
                if (configInfo.autoPageView) {
                    heatMap.initPage();
                }
            }
            /**
             * 中间函数，用于递归解析xml文档对象
             * @param node_list xml文档的的nodeList
             */
            function generate(node_list) {
                for (var i = 0; i < node_list.length; i++) {
                    var curr_node = node_list[i];
                    if (curr_node.nodeType === 1) {
                        if (curr_node.childNodes.length > 1) {
                            // 还有子集
                            if (curr_node.nodeName === "pagefilters") {
                                // 如果是页面条件，则进行拦截
                                obj.pagefilters = searchFilter(curr_node);
                            } else if (curr_node.nodeName === "elementfilters") {
                                // 如果是事件，则进行拦截
                                obj.elementClick = new Object(obj.elementClick);
                                obj.elementClick.filter = searchFilter(curr_node);
                            } else {
                                generate(curr_node.childNodes);
                            }
                        } else {
                            // 没有子集
                            var curr_parentNode = curr_node.parentNode;
                            if (curr_parentNode.nodeName === "pageViewKeys") {
                                // 这是页面抓取元素
                                // textContent
                                // 若query为最后一级，则直接返回，无query值
                                if (curr_node.nodeName === "query") return;
                                obj.pageViewKeys = new Object(obj.pageViewKeys);
                                obj.pageViewKeys[curr_node.getAttribute('sun:sourceKey')] = curr_node.getAttribute('sun:targetKey');
                            } else if (curr_parentNode.nodeName === "query") {
                                // 这是query参数
                                if (!obj.pageViewKeys) {
                                    obj.pageViewKeys = new Object(obj.pageViewKeys);
                                }
                                obj.pageViewKeys.query = new Object(obj.pageViewKeys.query);
                                obj.pageViewKeys.query[curr_node.getAttribute('sun:sourceKey')] = curr_node.getAttribute('sun:targetKey');
                            } else if (curr_parentNode.nodeName === "elementClickKeys") {
                                // 这是点击事件参数
                                // 若elementExtData为最后一级，则直接返回，无自定义属性值
                                if (curr_node.nodeName === "elementExtData") return;
                                obj.elementClick = new Object(obj.elementClick);
                                obj.elementClick[curr_node.getAttribute('sun:sourceKey')] = curr_node.getAttribute('sun:targetKey');
                            } else if (curr_parentNode.nodeName === "elementExtData") {
                                // 这是点击事件自定义属性参数参数
                                // console.log([curr_parentNode]);
                                if (!obj.elementClick) {
                                    obj.elementClick = new Object(obj.elementClick);
                                }
                                obj.elementClick.elementExtData = new Object(obj.elementClick.elementExtData);
                                obj.elementClick.elementExtData[curr_node.getAttribute('sun:sourceKey')] = curr_node.getAttribute('sun:targetKey');
                                // 由于elementExtData标签的属性值 唯一，可直接抓取；还要获取elementKey中的targetKey为elementId对应属性的值来进行判断
                                for (let i = 0; i < curr_parentNode.attributes.length; i++) {
                                    obj.elementClick.elementExtData.customFilter = new Object(obj.elementClick.elementExtData.customFilter);
                                    // key保存elementExtData中elementId的值，由于其属性值是只存在一个，所以直接设置即可
                                    obj.elementClick.elementExtData.customFilter.key = curr_parentNode.attributes[i].value;
                                    // 从 elementClick中获取elementId的对应关系
                                    for (const key in obj.elementClick) {
                                        if (obj.elementClick[key] === "elementId") {
                                            obj.elementClick.elementExtData.customFilter.elementId = key;
                                        }
                                    }
                                    // var str = curr_parentNode.attributes[x].nodeName;
                                    // var temp = str.slice(4)
                                    // obj.elementClick.elementExtData.customFilter[temp] = curr_parentNode.attributes[x].value;
                                }
                            }
                        }
                    }
                }
            }
            /**
             * 匹配属性
             * @param {*} params 为属性数组
             */
            // function isAttr (params) {

            // }
            /**
             * 解析条件判断的值
             * @param {*} el 条件的dom对象
             * @returns 返回一个条件组成的对象
             */
            function searchFilter (el) {
                var arr = el.childNodes;
                var filterObject = {};
                var num = 0;
                // console.log(arr);
                for (let i = 0; i < arr.length; i++) {
                    if (arr[i].nodeType === 1) {
                        var filter = 'filter' + num++;
                        filterObject[filter] = [];
                        for (let j = 0; j < arr[i].childNodes.length; j++) {
                            let temp = arr[i].childNodes[j];
                            if (temp.nodeType === 1) {
                                var obj = {};
                                // key 属性名 filter 判断条件 value 对应值
                                obj.key = temp.getAttribute('sun:sourceKey');
                                obj.filter = heatMap.searchSign(temp.getAttribute('sun:op'));
                                obj.value = temp.textContent;
                                filterObject[filter].push(obj)
                            }
                        }
                    }
                }
                return filterObject || {}
            }
        },
        /**
         * 调用后台接口获取xml文件
         */
        getXML: function () {
            var that = this;
            heatMap.doAjax({
                type: 'GET',
                url: configInfo.serverAddress + downLoadURL,
                dataType: 'JSON',
                data: `appId=${configInfo.appId}&type=1`,
                success: function (data) {
                    if (data.result && data.result.length > 0) {
                        var strXml = data.result[0];
                        var parser, xmlDoc
                        if (window.DOMParser) {
                            parser = new DOMParser();
                            xmlDoc = parser.parseFromString(strXml, "text/xml");
                        } else {
                            // Internet Explorer
                            xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
                            xmlDoc.async = false;
                            xmlDoc.loadXML(strXml);
                        }
                        that.convertToJSON(xmlDoc.getElementsByTagName("pages"));
                    } else {
                        console.error('配置文件为空')
                    }
                },
                error: function (err) {
                    console.error('配置文件获取失败！');
                }
            });
        },
        /**
         * 暴露给用户，提供自定义上报接口
         * @param {String} eventId 自定义的事件类型
         * @param {object} data 自定义数据，类型为object {key:value}
         */
        reportEvent: function (eventId, data) {
            // 此处打开数据库，防止页面刷新时数据库未创建成功
            heatMap.openDB(myDB.name, myDB.db, myDB.tableName).then(() => {
                if (eventId === "app-viewScreen") {
                    // 手动设置页面浏览事件
                    if (xmlObjList.length > 0) {
                        heatMap.initPage();
                    }
                } else {
                    if (!heatMap.isObject(data)) {
                        console.error("reportEvent函数的第二个参数应该是Object类型");
                        return
                    }
                    var obj = {
                        ...heatMap.setBaseInfo(eventId),
                        properties: {
                            ...data
                        }
                    }
                    heatMap.saveSensorData(obj);
                }
            }).catch(() => {
                console.error("indexedDB数据库初始化失败，请稍后重试")
            })
        },
        /**
         * 获取indexedDB的数据，检查是否符合上报条件，符合条件进行数据上报
         */
        checkReportPoint: function () {
            // 获取本地储存的json数据进行上报
            // 参数为上报的参数
            heatMap.cursorGetData(myDB.db, myDB.tableName).then(res => {
                var list = res;
                var arr = [];
                var time = localStorage.getItem('reportTime')
                // 上报时间间隔大于两秒或数据大于5
                if (list.length > reportConditions.list || new Date().getTime() - time > reportConditions.time) {
                    // 上报
                    localStorage.setItem('reportTime', new Date().getTime())
                    // 删除当前表数据
                    for (let i = 0; i < list.length; i++) {
                        if (list[i].isSend) {
                            delete list[i].isSend;
                            heatMap.putData(myDB.db, myDB.tableName, list[i]);
                            arr.push(list[i])
                        }
                    }
                    // 发送ajax请求
                    heatMap.reportBuryPoint(arr);
                } else {
                }
            }).catch(() => {
                console.error("读取indexedDB数据失败");
            })
        },
        /**
         * 上报事件埋点
         * @param {Array} list 是上报的事件模型组成的数组
         */
        reportBuryPoint: function (list) {
            // setTimeout(function () {
            //     console.log("上报成功");
            //     for (let i = 0; i < list.length; i++) {
            //         heatMap.deleteData(myDB.db, myDB.tableName, list[i].index);
            //     }
            // }, 2000)
            // return
            heatMap.doAjax({
                type: 'POST',
                url: configInfo.serverAddress + reportURL,
                dataType: 'JSON',
                data: JSON.stringify({
                    sensorData: list
                }),
                success: async function (data) {
                    // console.log('上报成功');
                    for (let i = 0; i < list.length; i++) {
                        heatMap.deleteData(myDB.db, myDB.tableName, list[i].index);
                    }
                },
                error: function (data) {
                    // console.error('上报失败');
                    // 将list的数据存到表中
                    for (let i = 0; i < list.length; i++) {
                        list[i].isSend = true;
                        heatMap.putData(myDB.db, myDB.tableName, list[i]);
                    }
                },
            });
        },
        /**
         * 创建indexedDB数据库
         * @param {*} name 数据库名称
         * @param {*} db 数据库表格对象
         * @param {*} table 表格名称
         * @returns {object} 返回一个promise对象
         */
        openDB: function (name, db, table) {
            return new Promise((resolve, reject) => {
                const indexDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB;
                // var version = version || 1;
                // var request = indexDB.open(name, version);
                var request = indexDB.open(name);
                request.onerror = function (e) { //创建失败
                    // console.log(e.currentTarget.error.message);
                    reject()
                };
                request.onsuccess = function (e) { //创建成功
                    // console.log('创建成功----------------------');
                    myDB.db = e.target.result;
                    resolve(e.target.result)
                };
                request.onupgradeneeded = function (e) { //升级版本号，修改数据库结构（新增或删除表、索引或者主键），只能通过升级数据库版本完成
                    myDB.db = e.target.result;
                    var objectStore;
                    if (!myDB.db.objectStoreNames.contains(table)) { //升级版本号，修改数据库结构（新增或删除表、索引或者主键），只能通过升级数据库版本完成
                        objectStore = myDB.db.createObjectStore(table, {
                            keyPath: 'index',
                            autoIncrement: true
                        }); //以数据对象的一个属性作为主键
                        // objectStore = db.createObjectStore('table1', { autoIncrement: true });//以递增数字作为主键
                    }
                };
            })
        },
        /**
         * 关闭indexedDB数据库
         * @param {*} db indexed对象
         */
        closeDB: function (db) { //关闭
            db.close();
        },
        /**
         * 删除indededdb数据库
         * @param {*} name 数据库名称
         */
        deleteDB: function (name) { //删除
            const indexDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB
            indexDB.deleteDatabase(name);
        },
        /**
         * 通过add向表中添加数据
         * @param {*} db 数据库表对象
         * @param {*} storeName 表名称
         * @param {*} item 需要写入的对象
         * @returns {object} 数据写入成功时，返回一个promise对象
         */
        addData: function (db, storeName, item) {
            return new Promise((resolve) => {
                var transaction = db.transaction(storeName, 'readwrite'); //新建事务时必须指定用哪些表格和操作模式（"只读"或"读写"）
                var table1 = transaction.objectStore(storeName);
                // debugger
                var request = table1.add(item);
                request.onsuccess = function (event) {
                    // return request
                    // console.log("写入成功->", request.result)
                    resolve(request)
                };
            })
        },
        /**
         * 获取数据库表中的所有数据
         * @param {*} storeName 表名称
         * @param {*} db 数据库表对象
         * @param {*} id 获取数据的唯一表示
         * @returns {object} 读取数据成功时，返回一个promise对象
         */
        // readData: function (storeName, db, id) {
        //     return new Promise((resolve, reject) => {
        //         var transaction = db.transaction(storeName);
        //         var table1 = transaction.objectStore(storeName);
        //         // var request = table1.get(id);
        //         var request = table1.getAll();
        //         // return request;
        //         request.onsuccess = function (event) {
        //             resolve(request)
        //         };
        //     })
        // },
        /**
         * 获取数据库表中的所有数据
         * @param {*} storeName 表名称
         * @param {*} db 数据库表对象
         * @returns {object} 读取数据成功时，返回一个promise对象
         */
        cursorGetData: function (db, storeName) {
            return new Promise((resolve, reject) => {
                let list = [];
                var store = db
                    // 事务
                    .transaction(storeName, "readwrite")
                    // 仓库对象
                    .objectStore(storeName);
                // 指针对象
                var request = store.openCursor();
                // 游标开启成功，逐行读数据
                request.onsuccess = function (e) {
                    var cursor = e.target.result;
                    // console.log(cursor);
                    if (cursor) {
                        // 必须要检查
                        list.push(cursor.value);
                        // 遍历了存储对象中的所有内容
                        cursor.continue();
                    } else {
                        // console.log("游标读取的数据：", list);
                        resolve(list)
                    }
                };
            })
        },
        /**
         * 删除数据库表格中的数据
         * @param {*} db 表对象
         * @param {*} storeName 表名称
         * @param {*} id 表格数据中的唯一标识
         */
        deleteData: function (db, storeName, id) {
            var transaction = db.transaction(storeName, 'readwrite');
            var table1 = transaction.objectStore(storeName);

            var request = table1.delete(id);
            request.onsuccess = function (event) {
            };
        },
        /**
         * 修改indexedDB表中的数据
         * @param {*} db 表对象
         * @param {*} storeName 表名称
         * @param {*} item 需要修改的表格数据
         */
        putData: function (db, storeName, item) {
            var transaction = db.transaction(storeName, 'readwrite'); //新建事务时必须指定用哪些表格和操作模式（"只读"或"读写"）
            var table1 = transaction.objectStore(storeName);
            // debugger
            var request = table1.put(item);
            request.onsuccess = function (event) {
                // console.log('数据修改成功');
                // console.log(request)
            };
        },
        /**
         * 判断是否为对象类型
         * @param {*} arg 一个对象值
         * @returns {Boolean} false 不是对象，否则是对象
         */
        isObject: function (arg) {
            if (arg == null) {
                return false;
            } else {
                return Object.prototype.toString.call(arg) == '[object Object]';
            }
        },
        /**
         * 判断是否为boolean值
         * @param {*} arg 一个boolean值
         * @returns {Boolean} true 是boolean值，否则不是
         */
        isBoolean: function (arg) {
            return Object.prototype.toString.call(arg) == '[object Boolean]';
        },
        /**
         * 解析xml文件中对应的条件操作符
         * @param {*} code 条件操作符的代码
         * @returns {object} 返回对应的条件运算符
         */
        searchSign: function (code) {
            var sign;
            switch (code) {
                case '.gt.':
                    sign = ">"
                    break;
                case '.lt.':
                    sign = "<"
                    break;
                case '.eq.':
                    sign = "=="
                    break;
                case '.neq.':
                    sign = "!="
                    break;
                case '.ge.':
                    sign = ">="
                    break;
                case '.le.':
                    sign = "<="
                    break;
                case '.exist.':
                    // .exist. 包含关系
                    sign = "*"
                    break;
                default:
                    sign = false
                    break;
            }
            return sign
        },
        /**
         * 获取pageView的预备属性事件的返回值
         * @param {*} key 对应的属性名称
         * @returns {*} 返回对应预设属性的值
         */
        screenPageValue: function (key) {
            var txt;
            if (key == null) return null;
            var str = key.toLowerCase();
            switch (str) {
                case 'urlpath':
                    txt = pagePathURL? pagePathURL: window.location.pathname
                    break;
                case 'host':
                    txt = window.location.host;
                    break;
                case 'title':
                    txt = document.title;
                    break;
                case 'pagewidth':
                    txt = window.innerWidth;
                    break;
                case 'pageheight':
                    txt = window.innerHeight;
                    break;
                case 'isfirsttime':
                    txt = localStorage.getItem("isFirstTime") === "Y" ? true : false;
                    break;
                case 'fullpath':
                    txt = this.delUrlParams(window.location.href);
                    break;
                case 'lastscreenurl':
                    txt = this.delUrlParams(window.document.referrer);
                    break;
                default:
                    txt = null
                    break;
            }
            return txt
        },
        /**
         * 获取elementClick的预备属性事件的返回值
         * @param {*} key 对应的属性名称
         * @param {*} el 点击元素的dom对象
         * @param {*} elementUrl 点击元素在文档中的url
         * @returns {*} 返回对应预设属性的值
         */
        screenClickValue: function (key, el, elementUrl) {
            var txt;
            // console.log(key);
            if (key == null) return null
            var str = key.toLowerCase();
            switch (str) {
                case 'urlpath':
                    if (pagePathURL) {
                        txt = pagePathURL
                    } else {
                        txt = window.location.pathname;
                    }
                    break;
                case 'position':
                    let elContent = el.getBoundingClientRect()
                    let scrollX = document.documentElement.scrollLeft || document.body.scrollLeft
                    let scrollY = document.documentElement.scrollTop || document.body.scrollTop
                    let x = elContent.left + scrollX
                    let y = elContent.top + scrollY
                    txt = `${x},${y}`
                    break;
                case 'title':
                    txt = document.title;
                    break;
                case 'linkurl':
                    txt = el.getAttribute('href');
                    break;
                case 'elementtype':
                    txt = el.nodeName;
                    break;
                case 'element_selector':
                    txt = elementUrl;
                    break;
                default:
                    txt = el.getAttribute(key);
                    break;
            }
            return txt
        },
        /**
         * 解析pagefilters对象，获取当前page是否需要抓取
         * @param {*} type 自定义事件类型，page\click
         * @param {*} obj 解析的xml文件中xmlObjList.pagefilters对象
         * @param {*} el 点击元素的事件对象
         * @param {*} elementUrl 点击元素的url
         * @returns {Boolean} false 则当前pages下的数据不抓取，否则获取
         */
        filterCondition: function (type, obj, el, elementUrl) {
            // console.log(obj);
            var arrFilter1 = [];
            for (const key in obj) {
                // 这一级为||，有true，则抓取
                if (obj[key].length === 0) {
                    continue
                }
                var arrFilter2 = [];
                for (let i = 0; i < obj[key].length; i++) {
                    var bool = true;
                    // 这一级为&&，只要有返回false，则整体为false
                    var str = "";
                    if (type === "page") {
                        str = heatMap.screenPageValue(obj[key][i].key);
                    } else {
                        str = heatMap.screenClickValue(obj[key][i].key, el, elementUrl);
                    }
                    // console.log(str, obj[key][i].filter, obj[key][i].value);
                    if (!obj[key][i].filter) {
                        console.error("预期外的操作运算符，请检查xml文件中条件设置");
                        arrFilter2.push(false)
                        continue;
                    }
                    if (obj[key][i].filter != "*" && obj[key][i].value != "*") {
                        // 判断条件或者值没有*再做比较
                        if (obj[key][i].filter === "==") {
                            bool = str == obj[key][i].value ? true : false
                        } else if (obj[key][i].filter === "!=") {
                            bool = str != obj[key][i].value ? true : false
                        } else if (obj[key][i].filter === ">") {
                            bool = str > obj[key][i].value ? true : false
                        } else if (obj[key][i].filter === "<") {
                            bool = str < obj[key][i].value ? true : false
                        } else if (obj[key][i].filter === ">=") {
                            bool = str >= obj[key][i].value ? true : false
                        } else if (obj[key][i].filter === "<=") {
                            bool = str <= obj[key][i].value ? true : false
                        }
                    } else if (obj[key][i].value === "*") {
                        // 若果值为*，则对应的值不为null即可，不用判断条件
                        if (str === null) {
                            bool = false;
                        } else {
                            bool = true;
                        }
                    } else if (obj[key][i].filter != "*") {
                        // 如果判断条件为*，则包含对应的值即可
                        if (str.indexOf(obj[key][i].value) > -1) {
                            bool = true;
                        } else {
                            bool = false;
                        }
                    }
                    arrFilter2.push(bool)
                }
                var temp = arrFilter2.indexOf(false) > -1 ? false : true;
                arrFilter1.push(temp)
            }
            return arrFilter1.indexOf(true) > -1 ? true : false;
        },
        /**
         * 获取cookie
         * @param {*} name 要获取的cookie的名字
         * @returns 对应名称的值
         */
        getCookie: function (name) {
            var search = name + "="//查询检索的值
            var returnvalue = "";//返回值
            if (document.cookie.length > 0) {
                var sd = document.cookie.indexOf(search);
                if (sd != -1) {
                    sd += search.length;
                    var end = document.cookie.indexOf(";", sd);
                    if (end == -1)
                        end = document.cookie.length;
                    //unescape() 函数可对通过 escape() 编码的字符串进行解码。
                    returnvalue = unescape(document.cookie.substring(sd, end))
                }
            }
            return returnvalue;
        },
        /**
         * 拆分页面url的query的值
         * @param {*} str 页面的query字符串
         * @returns query组成的数组[{key: 'aaa'}]
         */
        splitQuery: function (str) {
            var arr = str.split('&');
            var list = [];
            for (let i = 0; i < arr.length; i++) {
                var obj = {}
                var tempArr = arr[i].split('=');
                obj[tempArr[0]] = tempArr[1]
                list.push(obj)
            }
            return list
        },
        /**
         * 拆分页面url，去除query参数
         * @param {*} url 页面url
         * @returns 不带query的页面路径
         */
        delUrlParams: function (url) {
            if (url.indexOf('?') > 0) {
                return url.substring(0, url.indexOf('?'));
            }
            return url;
        },
        /**
         * Ajax请求
         * @param {*} obj 请求的配置项，如请求类型，请求地址等参数设置
         * @returns  返回一个ajax
         */
        doAjax: function (obj) {
            var xmlhttp, type, url, timeout, async, dataType, data;
            if (typeof (obj) !== 'object') return false;
            type = obj.type === undefined ? 'POST' : obj.type.toUpperCase(); // 默认POST
            url = obj.url;
            timeout = obj.timeout === undefined ? 8000 : obj.timeout; // 默认timeout 8000ms
            async = obj.async === undefined ? true : obj.type; // async默认为true
            dataType = obj.dataType === undefined ? 'HTML' : obj.dataType.toUpperCase(); // datatype默认为html
            data = obj.data === undefined ? {} : obj.data;

            var formatParams = function () {
                if (type === 'GET' || dataType === 'JSONP') {
                    if (url.lastIndexOf('?') === -1) {
                        url += '?' + data;
                    } else {
                        url += '&' + data;
                    }
                }
            }

            // step1:创建ajax对象
            if (window.XMLHttpRequest) {
                xmlhttp = new XMLHttpRequest();
            } else {
                xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
            }
            // xmlhttp.timeout = 30000;
            // xmlhttp.ontimeout = function () {
            //     console.log("请求超时");
            // }
            // xmlhttp.onerror = obj.fail
            // step2:data数据对象
            // var params = formatParams(data);
            var params = data;
            // console.log("data数据对象:"+params);

            // step3:处理dataType类型
            if (type === 'GET' || dataType === 'JSONP') {
                if (url.lastIndexOf('?') === -1) {
                    url += '?' + data;
                } else {
                    url += '&' + data;
                }
            }

            // step4:连接并发送
            if (dataType === 'JSONP') {
                if (typeof (obj.beforeSend) === 'function') obj.beforeSend(xmlhttp);
                var callbackName = ('jsonp_' + Math.random()).replace(".", "");
                var oHead = document.getElementsByTagName('head')[0];
                data.callback = callbackName;
                var ele = document.createElement('script');
                ele.type = "text/javascript";
                ele.onerror = function () {
                    obj.error && obj.error("请求失败");
                };
                oHead.appendChild(ele);
                window[callbackName] = function (json) {
                    oHead.removeChild(ele);
                    window[callbackName] = null;
                    obj.success && obj.success(json);
                };
                ele.src = url;
            } else { // dataType 非JSONP
                xmlhttp.open(type, url, async);
                // xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                xmlhttp.setRequestHeader("Content-type", "application/json; charset=utf-8");
                xmlhttp.setRequestHeader("Authorization", "Bearer " + configInfo.token); // 请求头设置toekn
                if (typeof (obj.beforeSend) === 'function') obj.beforeSend(xmlhttp);
                xmlhttp.send(params);
                // console.log("xmlhttp.send数据："+params);
                xmlhttp.onreadystatechange = function () {
                    if (xmlhttp.readyState === 4) {
                        if (xmlhttp.status >= 200 && xmlhttp.status < 300 || xmlhttp.status == 304) {
                            var res;
                            if (dataType === 'JSON') {
                                try {
                                    res = JSON.parse(xmlhttp.responseText);
                                } catch (e) {
                                    obj.error('返回的json格式不正确');
                                }
                            } else if (dataType === 'XML') {
                                // xmlhttp.responseXML
                                res = xmlhttp.responseXML;
                            } else {
                                res = xmlhttp.responseText;
                            }
                            obj.success && obj.success(res);
                        } else {
                            obj.error && obj.error(xmlhttp.status + '错误')
                        }
                    } else {
                        // obj.error && obj.error(xmlhttp.status + '错误');
                    }
                }
            }

            // TODO 请求超时的处理
        },
        /**
         * 获取点击元素的url
         * @param {*} el 点击元素的事件对象
         * @returns {object} 元素的url对象
         */
        getCssSecltor: function (el) {
            // debugger
            if (!(el instanceof Element)) { return; }
            var selectorPathList = [];
            while (el.nodeType === Node.ELEMENT_NODE) {
                var selector = el.nodeName.toLowerCase();
                // if (el.id) {
                //     selector += '#' + el.id;
                //     selectorPathList.unshift(selector);
                //     break;
                // }
                if (el.nodeName.toLowerCase() === 'body') {
                    selectorPathList.unshift('body');
                    break;
                }
                var sib = el;
                var nth = 1;
                while (sib) {
                    sib = sib.previousElementSibling;
                    if (sib) {
                        if (sib.nodeName.toLowerCase() == selector) {
                            nth++;
                        }
                    } else {
                        break;
                    }
                }
                selector += ":nth-of-type(" + nth + ")";
                selectorPathList.unshift(selector);
                el = el.parentNode;
            }

            var pathId = selectorPathList.join("_").replace(/(:nth-of-type)/g, "");
            pathId = pathId.replace(/\((\d+)\)/g, "$1");
            return {
                selectorPath: selectorPathList.join(" > "),
                pathId: pathId
            }
        },
    };
    // global.heatMap = heatMap;
    var SensorSdk = {
        init: heatMap.init,
        reportEvent: heatMap.reportEvent,
        setAttributs: heatMap.setAttributs,
        setUserId: heatMap.setUserId,
        setBankId:  heatMap.setBankId,
        setCompanyId:  heatMap.setCompanyId,
        updateToken: heatMap.updateToken,
        setPage: heatMap.setPage,
    }
    global.SensorSdk = SensorSdk;
})(window);
