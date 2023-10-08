import utils from 'sino/common/utils';
//notation: js file can only use this kind of comments
//since comments will cause error when use in webview.loadurl,
//comments will be remove by java use regexp
//js-app v1.0.0
let bridge = (function(){
    let _window = utils.getWindow();
    let doc = utils.getWindow().document;
    let inElectronH5Frame = utils.isElectronH5Container(_window)
    if (_window.WebViewJavascriptBridge || (!inElectronH5Frame && !_window.AndObj)) {
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
        if (WebViewJavascriptBridge._messageHandler) {
            throw new Error('WebViewJavascriptBridge.init called twice');
        }
        WebViewJavascriptBridge._messageHandler = messageHandler;
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
        //  	console.log("callHandler start"+new Date().getTime() + " handlerName = " + handlerName);
        _doSend({
            handlerName: handlerName,
            data: data
        }, responseCallback);
        //      console.log("callHandler end"+new Date().getTime() + " handlerName = " + handlerName);
    }
    
    //sendMessage add message, 触发native处理 sendMessage
    function _doSend(message, responseCallback) {
        //  	console.log(" message = " + message + "_doSend start"+new Date().getTime());
        if (responseCallback) {
            let callbackId = 'cb_' + (uniqueId++) + '_' + new Date().getTime();
            responseCallbacks[callbackId] = responseCallback;
            message.callbackId = callbackId;
        }
        sendMessageQueue.push(message);
        // messagingIframe.src = CUSTOM_PROTOCOL_SCHEME + '://' + QUEUE_HAS_MESSAGE;
        //pc的AndObj非实时注入，需要等待AndObjReady才注入
        if(inElectronH5Frame && !_window.AndObj){
            doc.addEventListener('AndObjReady', ()=>{
                _window.AndObj.getData(CUSTOM_PROTOCOL_SCHEME + '://' + QUEUE_HAS_MESSAGE);
            })
        }else{
            _window.AndObj.getData(CUSTOM_PROTOCOL_SCHEME + '://' + QUEUE_HAS_MESSAGE);
        }
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
            //      	console.log("messageJSON = " + messageJSON);
            //          let message = JSON.parse(decodeURIComponent(messageJSON));
            let message = JSON.parse(messageJSON);
            //			let message = undefined;
            //			try{
            //				message = JSON.parse(messageJSON)
            //			}catch(error){
            //				console.log("error12 = " +JSON.stringify(error))
            //			}
            //			console.log("message12 = " + message);
            let responseCallback;
            //java call finished, now need to call js callback function
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
    
                let handler = WebViewJavascriptBridge._messageHandler;
                if (message.handlerName) {
                    handler = messageHandlers[message.handlerName];
                }
                //查找指定handler
                try {
                    handler && handler(message.data, responseCallback);
                } catch (exception) {
                    if (typeof console != 'undefined') {
                        console.log("WebViewJavascriptBridge: WARNING: javascript handler threw.", message, exception);
                    }
                }
            }
        });
    }
    
    //提供给native调用,receiveMessageQueue 在会在页面加载完后赋值为null,所以
    function _handleMessageFromNative(messageJSON) {
        if (receiveMessageQueue && receiveMessageQueue.length > 0) {
            receiveMessageQueue.push(messageJSON);
        } else {
            _dispatchMessageFromNative(messageJSON);
        }
    }
    
    let WebViewJavascriptBridge;
    if(!_window.WebViewJavascriptBridge){
        WebViewJavascriptBridge = _window.WebViewJavascriptBridge = {
            init: init,
            send: send,
            registerHandler: registerHandler,
            callHandler: callHandler,
            _fetchQueue: _fetchQueue,
            _handleMessageFromNative: _handleMessageFromNative
        };
        _createQueueReadyIframe(doc);
        let readyEvent = doc.createEvent('Events');
        readyEvent.initEvent('WebViewJavascriptBridgeReady');
        readyEvent.bridge = WebViewJavascriptBridge;
        doc.dispatchEvent(readyEvent);
    }else{
        WebViewJavascriptBridge = _window.WebViewJavascriptBridge
    }

    return WebViewJavascriptBridge
})()


export default bridge;