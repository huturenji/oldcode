import utils from 'sino/common/utils';
//notation: js file can only use this kind of comments
//since comments will cause error when use in webview.loadurl,
//comments will be remove by java use regexp
let _window = utils.getWindow();
const webviewjsbridge = function () {
    //如果WebViewJavascriptBridge 已经加载则不再加载
    //AndObj为T信客户端专用标志，如果不是T信客户端则不加载该js bridge
    if ((_window.WebViewJavascriptBridge && 
    _window.WebViewJavascriptBridge.handleMessageFromObjC) || !_window.AndObj) {
        return;
    }

    let messagingIframe;
    let sendMessageQueue = [];
    let receiveMessageQueue = [];
    let messageHandlers = {};

    let CUSTOM_PROTOCOL_SCHEME = 'yy';
    let QUEUE_HAS_MESSAGE = '__QUEUE_MESSAGE__/';

    let responseCallbacks = {};
    let uniqueId = 1;

    function _createQueueReadyIframe(doc) {
        messagingIframe = doc.createElement('iframe');
        messagingIframe.style.display = 'none';
        doc.documentElement.appendChild(messagingIframe);
    }

    //set default messageHandler
    function init(messageHandler) {
        if (_window.WebViewJavascriptBridge._messageHandler) {
            throw new Error('WebViewJavascriptBridge.init called twice');
        }
        _window.WebViewJavascriptBridge._messageHandler = messageHandler;
        let receivedMessages = receiveMessageQueue;
        receiveMessageQueue = null;
        for (let i = 0; i < receivedMessages.length; i++) {
            _dispatchMessageFromNative(receivedMessages[i]);
        }
    }

    function send(data, responseCallback) {
        _doSend({
            data: data
        }, responseCallback);
    }

    function registerHandler(handlerName, handler) {
        messageHandlers[handlerName] = handler;
    }

    function callHandler(handlerName, data, responseCallback) {
        //  	console.log("callHandler start"+new Date().getTime() + " handlerName = " + handlerName+" data = "+JSON.stringify(data));
        _doSend({
            handlerName: handlerName,
            data: data
        }, responseCallback);
        //      console.log("callHandler end"+new Date().getTime() + " handlerName = " + handlerName);
    }

    //sendMessage add message, 触发native处理 sendMessage
    function _doSend(message, responseCallback) {
        //  	console.log(" message = " + JSON.stringify(message) + "_doSend start"+new Date().getTime());
        if (responseCallback) {
            let callbackId = 'cb_' + (uniqueId++) + '_' + new Date().getTime();
            responseCallbacks[callbackId] = responseCallback;
            message.callbackId = callbackId;
        }
        sendMessageQueue.push(message);
        // messagingIframe.src = CUSTOM_PROTOCOL_SCHEME + '://' + QUEUE_HAS_MESSAGE;
        _window.AndObj.getData(CUSTOM_PROTOCOL_SCHEME + '://' + QUEUE_HAS_MESSAGE);
        //      AndObj.getData(CUSTOM_PROTOCOL_SCHEME + '://' + QUEUE_HAS_MESSAGE);
        //      console.log(" message = " + message + "_doSend end"+new Date().getTime());
    }

    // 提供给native调用,该函数作用:获取sendMessageQueue返回给native,由于android不能直接获取返回的内容,所以使用url shouldOverrideUrlLoading 的方式返回内容
    function _fetchQueue() {
        //  	console.log("_fetchQueue start"+new Date().getTime());
        let messageQueueString = JSON.stringify(sendMessageQueue);
        sendMessageQueue = [];
        //android can't read directly the return data, so we can reload iframe src to communicate with java
        // messagingIframe.src = CUSTOM_PROTOCOL_SCHEME + '://return/_fetchQueue/' + encodeURIComponent(messageQueueString);
        //      AndObj.getData(CUSTOM_PROTOCOL_SCHEME + '://return/_fetchQueue/' + encodeURIComponent(messageQueueString));
        _window.AndObj.getData(CUSTOM_PROTOCOL_SCHEME + '://return/_fetchQueue/' + encodeURIComponent(messageQueueString));
        //      console.log("_fetchQueue end  AndObj.getData --  "+new Date().getTime());
    }

    //提供给native使用,
    function _dispatchMessageFromNative(messageJSON) {
        setTimeout(function () {
            let message = JSON.parse(messageJSON);
            let responseCallback;
            if (message.responseId) {
                responseCallback = responseCallbacks[message.responseId];
                if (!responseCallback) {
                    return;
                }
                responseCallback(message.responseData);
                delete responseCallbacks[message.responseId];
            } else {
                //直接发送
                if (message.callbackId) {
                    let callbackResponseId = message.callbackId;
                    responseCallback = function (responseData) {
                        _doSend({
                            responseId: callbackResponseId,
                            responseData: responseData
                        });
                    };
                }

                let handler = _window.WebViewJavascriptBridge._messageHandler;
                if (message.handlerName) {
                    handler = messageHandlers[message.handlerName];
                }
                //查找指定handler
                try {
                    handler && handler(message.data, responseCallback);
                } catch (exception) {
                    if (typeof console !== 'undefined') {
                        console.log("WebViewJavascriptBridge: WARNING: javascript handler threw.", message, exception);
                    }
                }
            }
        });
    }

    //提供给native调用,receiveMessageQueue 在会在页面加载完后赋值为null,所以
    function _handleMessageFromObjC(messageJSON) {
        if (receiveMessageQueue && receiveMessageQueue.length > 0) {
            receiveMessageQueue.push(messageJSON);
        } else {
            _dispatchMessageFromNative(messageJSON);
        }
    }
    const SnJSBridge = _window.WebViewJavascriptBridge = {
        init: init,
        send: send,
        registerHandler: registerHandler,
        callHandler: callHandler,
        _fetchQueue: _fetchQueue,
        _handleMessageFromObjC: _handleMessageFromObjC
    };

    let doc = utils.getWindow().document;
    _createQueueReadyIframe(doc);
    let readyEvent = doc.createEvent('Events');
    readyEvent.initEvent('SnJSBridgeReady');
    readyEvent.bridge = SnJSBridge;
    doc.dispatchEvent(readyEvent);
}

webviewjsbridge();
// 定义导出接口
const jsbridge = {
    init: _window.WebViewJavascriptBridge && _window.WebViewJavascriptBridge.init,
    send: _window.WebViewJavascriptBridge && _window.WebViewJavascriptBridge.send,
    registerHandler: _window.WebViewJavascriptBridge && _window.WebViewJavascriptBridge.registerHandler,
    callHandler: _window.WebViewJavascriptBridge && _window.WebViewJavascriptBridge.callHandler,
    _fetchQueue: _window.WebViewJavascriptBridge && _window.WebViewJavascriptBridge._fetchQueue,
    _handleMessageFromObjC: _window.WebViewJavascriptBridge && _window.WebViewJavascriptBridge._handleMessageFromObjC
};
export default jsbridge;
