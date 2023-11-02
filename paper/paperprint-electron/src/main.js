const {
    app,
    BrowserWindow,
    globalShortcut,
    ipcMain,
    Menu
} = require('electron');
const fse = require('fs-extra');
const path = require("path");
const logger = require('./common/log/log4j').default;
const table = require('./common/db/table')
const register = require('./register')
const verify = require('./verify')
const device = require('./common/device')
const {loadDll,closeChildWindow} = require('./common/native/index.js')

let win;
const PROPERTIES_PATH ='./config.properties';

//是否使用python程序进行图片校验 默认为false
let use_python = false;
//是否校验图片中二维码 默认为不校验
let is_qrcode_verify = false;
//配置文件
let bisConfig = null;
//核验参数
let verifyOption = {};
//python服务地址
let python_server_url = 'https://bizmatedev.sinosun.com:17280/paper/';
//python服务静态资源地址
let python_static_url = 'https://bizmatedev.sinosun.com:17280/bizmate/static';

//核验参数key枚举，用于从配置文件中读取
const VERIFYOPTIONENUM = [
    "QRCODE_ALGIN_FORCE",
    "MATCH_POSITION",
    "QRCODE_WIDTH",
    "CUT_PADDING",
    "CUT_HEIGHT",
    "IMAGE_DOWNSAMPLING",
    "IMAGE_DOWNSAMPLING_TOGRAY",
    "IMAGE_DOWNSAMPLING_NUM"
];

//python核验参数
let pyVerifyOption = {};

//python核验参数key枚举，用于从配置文件中读取
const PY_VERIFYOPTIONENUM = [
    "QRCODE_ALGIN_FORCE",
    "MATCH_POSITION",
    "QRCODE_WIDTH",
    "CUT_PADDING",
    "CUT_HEIGHT"
];

/**
 * 监听子进程消息，调用dll
 */
function on_main_dispatch_dll(){
    let winBuffer = win.getNativeWindowHandle();
    device.on({
        use_perspective,resolution,winBuffer
    });
    register.on({
        is_qrcode_verify,python_server_url,python_static_url,use_python,use_perspective,area_radio
    });
    verify.on({
        is_qrcode_verify,python_server_url,python_static_url,use_python,use_perspective,area_radio,
        verifyOption
    });
}

/**
 * 读取配置文件
 */
function readProperties(){
    return new Promise((res)=>{
        fse.readFile(PROPERTIES_PATH, { encoding: "utf-8" }, (err, result) => {
            if (err) {
                console.log(err, "读取文件内容失败");
                res(false);
            } else {
                // 将文件内容按行分割
                const lines = result.split('\n');
                const properties = {};
    
                // 解析每一行的键值对
                lines.forEach((line) => {
                    line = line.trim();
                    if (line && !line.startsWith('#')) {
                        const [key,value] = line.split('=');
                        try {
                            properties[key.trim()] = JSON.parse(value.trim());
                        } catch (error) {
                            properties[key.trim()] = value.trim();
                        }
                    }
                });
                bisConfig = properties;
                VERIFYOPTIONENUM.forEach(key=>{
                    !!bisConfig[key] && (verifyOption[key]=bisConfig[key])
                })
                PY_VERIFYOPTIONENUM.forEach(key=>{
                    !!bisConfig[key] && (pyVerifyOption[key]=bisConfig[key])
                })
                //是否校验二维码
                is_qrcode_verify = properties['IS_QRCODE_VERIFY'];

                //python服务地址
                python_server_url = properties['PY_SERVER_URL'];
                //python静态资源地址
                python_static_url = properties['PY_STATIC_URL'];
                //是否使用python程序
                use_python = properties['USE_PYTHON'];
                //核验方式为透射
                use_perspective = properties['USE_PERSPECTIVE']
                //设备分辨率
                resolution = properties['RESOLUTION']
                //图片内容占背景比例
                area_radio = properties['AREA_RADIO']

                res(true);
            }
        }); 
    })
    
}


/**
 * 初始化本地数据库表
 */
async function initSqlite(){
    await table.create();
}

/**
 * 获取app环境信息
 */
ipcMain.on('getAppEnv', (event, data) => {
    event.reply('getAppEnvReply', {
        isPackaged:app.isPackaged,//是否build环境
        use_perspective:bisConfig.USE_PERSPECTIVE?true:false,//是透射模式
        preview_model:bisConfig.PRVIEW_MODEL, //预览模式 默认为false
        defaultCameraOptions:{//默认摄像头参数
            exposure: bisConfig.EXPOSURE,//曝光
            exposure_auto: bisConfig.EXPOSURE_AUTO,//自动曝光
            whitebalance: bisConfig.WHITEBALANCE,//白平衡
            whitebalance_auto:bisConfig.WHITEBALANCE_AUTO,//自动白平衡
           
        }
    });
}); 

/**
 * 保存日志
 */
ipcMain.on('proxyLogger', (event, data) => {
    logger.info('H5 log-----------'+data);
    let sussessCode = 0;
    event.reply('proxyLoggerReply',sussessCode);
}); 

/**
 * 创建窗口
 * @returns window
 */
function createWindow() {
    //创建浏览器窗口
    win = new BrowserWindow({
        width: 1080,
        height: 720,
        maximizable: false,  // 禁用最大化
        fullscreenable: false, // 禁用全屏
        minWidth: 1080,
        minHeight: 700,//todu minHeight实际效果会大20
        maxWidth: 1080,
        maxHeight: 720,
        useContentSize:true,
        // frame:false,  去掉默认标题栏
        webPreferences: {
            nodeIntegration: true,
            webviewTag: true,
            devTools: true,
            resizable:false,
            maximizable:false,
            // preload: path.join(__dirname, "\\preload.js")
        },
    });
    Menu.setApplicationMenu(null);

   

    if(app.isPackaged){
        win.loadFile(path.join(__dirname,'\\assets/index.html'))
    }else{
        win.loadURL('http://localhost:8080/index.html#/')
    }
    globalShortcut.register('Ctrl+R', () => {
        win.webContents.reload();
    });
    // 快捷键 Ctrl+Alt+T 开启开发者工具
    globalShortcut.register('Ctrl+T', () => {
        win.webContents.openDevTools();
    });
    // win.webContents.setZoomFactor(1); // 设置缩放因子为1，表示不缩放
    return win;
}
const isSingleInstance = app.requestSingleInstanceLock();
if(!isSingleInstance){
    app.quit();
}else{
    //app就绪
    /**
     * app就绪后的事情 
     * 1、读取配置文件
     * 2、加载C++ dll
     * 3、创建窗口
     * 4、初始化本地数据库
     * 5、监听子进程消息
     */
    app.on('ready', async function () {
        await readProperties();
        loadDll();
        createWindow(); 
        await initSqlite();
        on_main_dispatch_dll();//监听子进程消息，并且调用dll方法
    });

    //app关闭时通知python结束进程
    app.on('window-all-closed', async() => {
        logger.info('window-all-closed-----------');
        if(use_python){
            socketClient.connected && socketClient.write('.exit.');
            socketClient.end();
            child_python.kill();
        }
        closeChildWindow(win.getNativeWindowHandle());
        app.quit();
    });
    // 第二次打开实例时 聚焦主窗口
    app.on('second-instance',()=>{
        if(win){
            if(win.isMinimized){
                win.restore();
            }
            win.focus();//激活主窗口
        }
    });
}
