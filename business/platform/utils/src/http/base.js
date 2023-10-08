/*
 * @Descripttion: 数据请求
 * @version: 1.0
 * @Author: yg
 * @LastEditors: Please set LastEditors
 * @Date: 2019-04-25 17:20:38
 * @LastEditTime: 2021-02-03 17:31:49
 */


/**
 * 数据请求
 * @param {*} param  参数，必须为json 其中数据为method, url, data, responseType
 * 例如：
 * {
 *      method:post,                     //请求类型
 *      url:'http://www.a.b.com',        //请求url,可以为相对路径也可以为绝对路径
 *      data:{},                         //请求参数
 *      timeout:1000,                    //超时时间，1s
 *      headers:{content-type:'application/x-www-form-urlencoded;',Accept:'XXX'} //请求头类型 默认为{content-type:application/json;charset=UTF-8'}
 *      responseType:'',                 //数据返回类型
 * }
 * @param {*} timeoutcb  超时回调函数
 */
export function httpRequest(param={},timeoutcb){

    return new Promise(function(res, rej){

        if('Object'!=Object.prototype.toString.call(param).match(/^\[object\s(.*)\]$/)[1]){
            rej('param fomart is wrong,is must be json');
            return;
        }

        if('Object'!=Object.prototype.toString.call(param.headers||{}).match(/^\[object\s(.*)\]$/)[1]){
            rej('param.headers fomart is wrong,is must be json');
            return;
        }

        var url = param.url,method = param.method,data = param.data;
        //默认请求头为 ('content-type','application/json;charset=UTF-8')
        var headers = Object.assign({'content-type':'application/json;charset=UTF-8'},param.headers || {});
        //超时时间与返回头
        var timeout = param.timeout,responseType=param.responseType || 'text';

        var sendData = null;
 
        var tempData = joinObject(data,'&');
        
        var xhr = new window.XMLHttpRequest();
        
        //设置请求参数
        if('GET'==method.toUpperCase()&&0<tempData.length){
            //如果是GET请求,并且参数不为空，需要把data拼接到url中
            var and = url.indexOf('?') == -1 ? '?' : '&';
            url += and + tempData;
        } else{
            //formData格式不做任何处理
            if(data instanceof FormData){
                sendData = data;
            }else{//post请求
                var contentType = headers.hasOwnProperty['Content-Type']?headers['Content-Type']:headers['content-type'];
 
                if(-1<contentType.indexOf('application/x-www-form-urlencoded')){
                    //如果是application/x-www-form-urlencoded
                    sendData = tempData;
                }else if(-1<contentType.indexOf('application/json')){
                    //否则application/json;charset=UTF-8
                    sendData = JSON.stringify(data);
                }else{
                    //其他请求头的数据格式
                    sendData = data;
                }
            }
        }
        xhr.open(method, url, param.async===false ? param.async : true);
        //设置超时时间，默认为30s
		xhr.timeout = timeout || 30000;
        xhr.ontimeout = function(event){
            timeoutcb&&timeoutcb(event);
            console.error('xhr timeout');
    　　}

        //设置请求头，formData格式不做任何处理
        if(!(data instanceof FormData)){
            for(var headerName in headers){
                if(headers.hasOwnProperty(headerName)){
                    xhr.setRequestHeader(headerName,headers[headerName]);
                }
            }
        }

        //设置返回类型
        xhr.responseType = responseType;

        xhr.onreadystatechange  = function(e){
            var currentTarget = e.currentTarget || xhr; //兼容mock
        	if(currentTarget&&currentTarget.readyState === 4){
        		if(currentTarget.status == 200){
	            	if('JSON'==responseType.toUpperCase()){
	            		var returnRes = currentTarget.response;
	            		try{
                            var _class = Object.prototype.toString.call(returnRes).match(/^\[object\s(.*)\]$/)[1];
	            			if(_class==='Object'){//判断返回值的类型，如果为Object直接返回，如果为String格式化后返回
	            				res(returnRes)
	            			}else if(_class==='String'){
	            				res(JSON.parse(returnRes));
	            			}else{//如果返回的不是Object或者String类型，则直接返回currentTarget
                                res(currentTarget);
                            }
	            		}catch(e){
	            			res(returnRes);
	            		}
	            	}else if('arraybuffer'==responseType){//将blob数据类型改为arraybuffer兼容Android4.3
	            		res(xhr.response)
                    }else{
                        res(currentTarget.response)
                    }
	            } else{//xhr状态不是200
                    console.error('xhr status is not 200');
	                rej(currentTarget);
	            }
        	}else{
                //todo something  不能直接返回res或者rej，请求状态是由非4状态转变为4，如果res或者rej，则无法返回真实请求返回值
            }
        }
        xhr.send(sendData);
    })
}

/**
 * 按照键值对的方式拼接对象 多个属性之间按照symbol连接 例如 object为{a:1,b:2} symbol为 & 则拼接为a=1&b=2
 * @param {object} object 拼接的对象
 * @param {string} symbol 拼接的字符串
 */
export function joinObject(object,symbol){
    let objStr = '';
    for(var o in object){
        if (object.hasOwnProperty(o)) {
            objStr += `${symbol}${o}=${object[o]}`;
        }
    }
    return objStr.slice(1);
}