/*
 * author: wendux
 * email: 824783146@qq.com
 * source code: https://github.com/wendux/Ajax-hook
 **/
export default function (ob) {
    // module.exports = function (ob) {

    //Save original XMLHttpRequest as RealXMLHttpRequest
    var realXhr = "RealXMLHttpRequest"


    //Call this function will override the `XMLHttpRequest` object
    ob.hookAjax = function (proxy) {

        // Avoid double hook
        window[realXhr] = window[realXhr] || XMLHttpRequest

        XMLHttpRequest = function () {
            var xhr = new window[realXhr];
            // We shouldn't hook XMLHttpRequest.prototype because we can't
            // guarantee that all attributes are on the prototype。
            // Instead, hooking XMLHttpRequest instance can avoid this problem.
            for (var attr in xhr) {
                var type = "";
                try {
                    type = typeof xhr[attr] // May cause exception on some browser
                } catch (e) {
                }
                if (type === "function") {
                    // hook methods of xhr, such as `open`、`send` ...
                    this[attr] = hookFunction(attr);
                } else {
                    Object.defineProperty(this, attr, {
                        get: getterFactory(attr),
                        set: setterFactory(attr),
                        enumerable: true
                    })
                }
            }
            this.xhr = xhr;
            //因为SWP的请求方法返回值有一句var currentTarget = e.currentTarget || xhr; //兼容mock
            //导致ajax代理获取到的还是原生xhr的返回值。这里加上这段话，为了下面 setterFactory 方法自定义event。
            try {
                new window.Event('custom')
            } catch (exception) {
                window.Event = function(type, bubbles, cancelable, detail) {
                    var event = document.createEvent('CustomEvent') // MUST be 'CustomEvent'
                    event.initCustomEvent(type, bubbles, cancelable, detail)
                    return event
                }
            }
        }

        // Generate getter for attributes of xhr
        function getterFactory(attr) {
            return function () {
                var v = this.hasOwnProperty(attr + "_") ? this[attr + "_"] : this.xhr[attr];
                var attrGetterHook = (proxy[attr] || {})["getter"]
                return attrGetterHook && attrGetterHook(v, this) || v
            }
        }

        // Generate setter for attributes of xhr; by this we have an opportunity
        // to hook event callbacks （eg: `onload`） of xhr;
        function setterFactory(attr) {
            return function (v) {
                var xhr = this.xhr;
                var that = this;
                var hook = proxy[attr];
                if (typeof hook === "function") {
                    // hook  event callbacks such as `onload`、`onreadystatechange`...
                    xhr[attr] = function () {
                        //如果是 onreadystatechange 事件，特殊处理一下，
                        if(attr=="onreadystatechange"){
                            //1、将xhr改成that，将原始对象改成代理对象 。
                            //2、arguments的第一个参数event由原生事件改成自定义事件 
                            arguments[0]= new Event("readystatechange")
                            proxy[attr](that) || v.apply(that, arguments);
                        } //其他情况保持原生xhr的对象和事件
                        else{                           
                            proxy[attr](that) || v.apply(xhr, arguments);
                        }
                    }
                } else {
                    //If the attribute isn't writable, generate proxy attribute
                    var attrSetterHook = (hook || {})["setter"];
                    v = attrSetterHook && attrSetterHook(v, that) || v
                    try {
                        xhr[attr] = v;
                        //在部分安卓的低端手机上，代理的this[attr]无法赋值成功，DMTHttpProxy里面的xhr.response = postRes;这句代码无效。
                        //但是使用setter 和 getter函数可以实现。
                        this[attr + "_"] = v;
                    } catch (e) {
                        this[attr + "_"] = v;
                    }
                }
            }
        }

        // Hook methods of xhr.
        function hookFunction(fun) {
            return function () {
                var args = [].slice.call(arguments)
                if (proxy[fun] && proxy[fun].call(this, args, this.xhr)) {
                    return;
                }
                if(fun=="send"){
                    // debugger
                    //send方法，为了能够让原生xhr使用改动后的body对象，入参由 args 改成 sendAgrs 。
                    //sendAgrs 是一个调用者 args的代理，args不可修改，sendAgrs作为代理可以修改。
                    return this.xhr[fun].apply(this.xhr, this.xhr.sendAgrs);
                }
                return this.xhr[fun].apply(this.xhr, args);
                
            }
        }

        // Return the real XMLHttpRequest
        return window[realXhr];
    }

    // Cancel hook
    ob.unHookAjax = function () {
        if (window[realXhr]) {XMLHttpRequest = window[realXhr];}
        window[realXhr] = undefined;
    }

    //for typescript
    ob["default"] = ob;
}
