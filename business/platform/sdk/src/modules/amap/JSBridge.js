(function(window) {
  function loadJSBridge(main) {
    class JSBridge {
      constructor() {
        const self = this;
        window.INJECT_PALTFORM = '渠道名'; // 作为高德打车渠道标识

        return function JSBFn(opts, cb) {
          self[this](opts, cb);
        };
      }

      /**
       * [getCurrentLocation 获取实时定位]
       * @param  {[type]}   opts [暂时无用]
       * @param  {Function} cb   [回调函数]
       */
      getCurrentLocation(opts, cb) {
//        cb({
//          error, // 定位失败时 error: 1
//          longitude, latitude, // 高德坐标系下的经纬度
//          city, // 城市名
//          cityAdcode, // 城市码
//        });

            //add code
            var result = window.sqkbgdjsbridge.getCurrentLocation();
            cb(JSON.parse(result));
      }

      /**
       * [startContinuousLocation 开启持续定位]
       * @param  {[type]}   opts { callbackInterval：获取定位的时间间隔 }
       * @param  {Function} cb   [回调函数]
       */
      startContinuousLocation(opts, cb) {
        const { callbackInterval = 5000 } = opts;
        this.continuousLocationTimr = window.setInterval(() => {
          this.getCurrentLocation({}, cb);
        }, callbackInterval);

        window.sqkbgdjsbridge.startContinuousLocation(JSON.stringify(opts));//add code
      }

      /**
       * [stopContinuousLocation 停止持续定位]
       * @param  {Function} cb [回调函数]
       */
      stopContinuousLocation(cb) {
        clearInterval(this.continuousLocationTimr);
        this.continuousLocationTimr = null;
        window.sqkbgdjsbridge.stopContinuousLocation();//add code
        cb();
      }

      /**
       * [getDeviceId 获取设备号]
       * @param  {Function} cb [回调函数]
       */
      getDeviceId(cb) {
        // 如果获取失败返回''
//        cb(deviceId || '');

         //add code
         var deviceId = window.sqkbgdjsbridge.getDeviceId();
         cb(deviceId);
      }

      /**
       * [popWindow 关闭当前webview]
       */
      popWindow() {

        //add code
        window.sqkbgdjsbridge.popWindow();
      }

      /**
       * [pushWindow 打开新的webview]
       * @param  {[type]} opts {url: 新页面链接, param: { defaultTitle: 标题 }}
       */
      pushWindow(opts) {
        if (opts.url) {
          const { param = {} } = opts;
        }

        //add code
        window.sqkbgdjsbridge.pushWindow(JSON.stringify(opts));
      }

      /**
       * [setClipboard 复制粘贴]
       * @param {[type]} opts {text: 需要复制的文本内容}
       */
      setClipboard(opts) {

        //add code
        window.sqkbgdjsbridge.setClipboard(JSON.stringify(opts));
      }

      /**
       * [getSystemInfo 获取系统信息]
       * @param  {Function} cb [回调函数]
       */
      getSystemInfo(cb) {
        // 渠道方自行选择提供
//        cb({
//          model, // 手机型号
//          version, // 渠道app版本号
//          brand, // 手机品牌
//          system, // 系统版本
//        });

        //add code
        var systemInfoStr = window.sqkbgdjsbridge.getSystemInfo();
        cb(JSON.parse(systemInfoStr));
      }

      /**
       * [setGestureBack 手势禁止]
       * @param {[type]} opts {val:手势返回开启状态，false禁止/true允许}
       */
      setGestureBack(opts) {
        const { val } = opts;

        //add code
        window.sqkbgdjsbridge.setGestureBack(JSON.stringify(opts));
      }

      /**
       * [hideTopBar 隐藏导航栏]
       */
      hideTopBar() {

        //add code
        window.sqkbgdjsbridge.hideTopBar();
      }

      /**
       * [tradePay 调起支付收银台]
       * @param  {[type]}   opts {orderStr: 支付宝支付交易字符串}
       * @param  {Function} cb   [回调函数]
       */
      tradePay(opts, cb) {
        const { orderStr } = opts;
//        cb({
//          resultCode, // 收银台支付状态
//          message, // 异常信息
//        });

        //add code
        var result = window.sqkbgdjsbridge.tradePay(JSON.stringify(opts));
        cb(JSON.parse(result));
      }

      /**
       * [setTitle 设置导航栏标题]
       * @param {[type]} opts {title: 标题}
       */
      setTitle(opts) {
        if (opts.title) {
          
        }

        //add code
        window.sqkbgdjsbridge.setTitle(JSON.stringify(opts));
      }

      /**
       * [backPress 返回事件监听]
       * @param  {Function} cb [回调函数]
       */
      backPress(cb) {
        // 透传点击事件提供阻止默认行为的能力
        cb(event);

        //add code
        window.sqkbgdjsbridge.backPress();
      }
    }

    window.JSBridge = new JSBridge();
    main();
  }

  loadJSBridge(function() {
    console.log('jsbridge加载完毕', window.INJECT_PALTFORM);
  });
})(window);
