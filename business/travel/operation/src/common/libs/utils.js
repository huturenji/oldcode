import proxysnutils from './snutilsproxy';
import config from './config'; //相关的配置选项
/**
 * 项目中不允许直接调用libs的对象。必须通过utils来引用，主要是上面import的对象
 * 项目的工具方法类，包含项目中用到的所有的业务相关的方法
 */
class utils {
    /**
     * JS的实现下载文件功能。这个不会让浏览器弹出数据框
     * @param url 下载地址，也可以是一个blob对象，必选
     * @param saveName 保存文件名，可选
     */
    downloadFile(url, saveName) {
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
     * 加载配置文件
     */
    getJsonFile(path) {
        return new Promise((resolve, reject) => {
            var req = new XMLHttpRequest();
            req.open('GET', path, true);
            req.setRequestHeader('Accept', 'application/json');
            req.onreadystatechange = function () {
                if (req.readyState == 4) {
                    if (req.status == 200) {
                        try {
                            resolve(JSON.parse(req.responseText))
                        } catch (e) {
                            console.error(e);
                            reject()
                        }
                    } else {
                        console.error('get json file failed! http state is: ' + req.status)
                        reject()
                    }
                }
            };
            req.send();
        })
    }

    async getBslConfig() {
        let bslConfig = {}
        if (!!window.bslConfig) {
            bslConfig = window.bslConfig;
        } else {
            bslConfig = window.bslConfig = await this.getJsonFile(config.BSL_CONF.JSON_CONF);
        }
        return bslConfig;
    }
}

var a = new utils()
export default Object.assign({}, proxysnutils, { getBslConfig: a.getBslConfig, getJsonFile: a.getJsonFile });