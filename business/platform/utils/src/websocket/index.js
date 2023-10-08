/*
 * @Descripttion: websocket 用来与服务端进行通信  需要依赖  sockjs.min.js 与 stomp.min.js
 * @version: v1.0
 * @Author: yg
 * @LastEditors: yg
 * @Date: 2019-04-25 11:17:25
 * @LastEditTime: 2020-09-26 09:58:15
 * 该方法暂时未用到
 */

let stompClient = null;
let initFlag = false;
let websocket = function(){
};

websocket.prototype = {
	/**
	 * websocket初始化连接
	 * @param {Object} socketUrl
	 * @param {Object} socketName
	 */
	initConn:function(socketUrl,socketName){
		let that = this;
		// 向服务器发起websocket连接并发送CONNECT帧  替换为promise
		return new Promise(function(res,rej){
			if(stompClient){
				console.log('stompClient is inited')
				res(stompClient);
			}else{
				// 建立连接对象（还未发起连接）
				// 获取 STOMP 子协议的客户端对象
				stompClient = Stomp.over(new SockJS(socketUrl));
				stompClient.connect(
				    {name:socketName},
				    function connectCallback(frame) {
				        // 连接成功时（服务器响应 CONNECTED 帧）的回调方法
				        console.log("连接成功");
				        res(stompClient);
				    },
				    function errorCallBack(error) {
				    	res(null);
				        // 连接失败时（服务器响应 ERROR 帧）的回调方法
				        console.log("连接失败");
				    }
				);
			}
		});
	},
	/**
	 * 发送消息
	 * @param {Object} url        发送url
	 * @param {Object} data       发送数据  一般为jsonstring
	 * @param {Object} socketUrl  初始化连接url
	 * @param {Object} socketName 初始化连接name
	 */
	send:function(url,data,socketUrl,socketName){
		let that = this;
		that.initConn(socketUrl,socketName).then(()=>{
			stompClient.send(url, {}, data);
		});
	},
	/**
	 * 接收消息
	 * @param {Object} url        订阅url
	 * @param {Object} callback   回调函数
	 * @param {Object} socketUrl  初始化连接url
	 * @param {Object} socketName 初始化连接name
	 */
	subscribe:function(url,callback,socketUrl,socketName){
		let that = this;
		return that.initConn(socketUrl,socketName).then((client)=>{
			if(client){
				return client.subscribe(url,callback);
			}else{
				console.log('连接成功 返回对象不可用，为'+ client)
				return null;
			}
		});
	}
	
	
}

export default new websocket();