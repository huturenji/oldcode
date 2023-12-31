!(function(window, document) {
	function GVerify(options) { //创建一个图形验证码对象，接收options对象为参数
		this.options = { //默认options参数值
			id: "", //容器Id
			canvasId: "verifyCanvas", //canvas的ID
			width: "100", //默认canvas宽度
			height: "30", //默认canvas高度
			type: "blend", //图形验证码默认类型blend:数字字母混合类型、number:纯数字、letter:纯字母
			code: ""
		}
		
		if(Object.prototype.toString.call(options) == "[object Object]"){//判断传入参数类型
			for(var i in options) { //根据传入的参数，修改默认参数值
				this.options[i] = options[i];
			}
		}else{
			this.options.id = options;
		}
		
		this.options.numArr = "0,1,2,3,4,5,6,7,8,9".split(",");
		this.options.letterArr = getAllLetter();
 
		this._init();
		this.refresh();
	}
 
	GVerify.prototype = {
		/**版本号**/
		version: '1.0.0',
		
		/**初始化方法**/
		_init: function() {
			var con = document.getElementById(this.options.id);
			var canvas = document.createElement("canvas");
			this.options.width = con.offsetWidth > 0 ? con.offsetWidth : "100";
			this.options.height = con.offsetHeight > 0 ? con.offsetHeight : "30";
			canvas.id = this.options.canvasId;
			canvas.width = this.options.width;
			canvas.height = this.options.height;
			canvas.style.cursor = "pointer";
			canvas.innerHTML = "您的浏览器版本不支持canvas";
			canvas.style.color = "red";
			con.appendChild(canvas);
			var parent = this;
			canvas.onclick = function(){
				parent.refresh();
			}
		},
		
		/**生成验证码**/
		refresh: function() {
			this.options.code = "";
			var canvas = document.getElementById(this.options.canvasId);
			if(canvas.getContext) {
				var ctx = canvas.getContext('2d');
			}else{
				alert('您的浏览器版本不支持canvas，请使用IE9以上版本的浏览器！');
				return;
			}
			
			ctx.textBaseline = "middle";
 
			ctx.fillStyle = randomColor(180, 240);
			ctx.fillRect(0, 0, this.options.width, this.options.height);
 
			if(this.options.type == "blend") { //判断验证码类型
				var txtArr = this.options.numArr.concat(this.options.letterArr);
			} else if(this.options.type == "number") {
				var txtArr = this.options.numArr;
			} else {
				var txtArr = this.options.letterArr;
			}
			/**生成四个字符**/
			for(var i = 1; i <= 4; i++) {
				var txt = txtArr[randomNum(0, txtArr.length)];				
				this.options.code += txt;
				ctx.font = randomNum(this.options.height/2, this.options.height) + 'px SimHei'; //随机生成字体大小
				ctx.fillStyle = randomColor(50, 160); //随机生成字体颜色		
				ctx.shadowOffsetX = randomNum(-3, 3);
				ctx.shadowOffsetY = randomNum(-3, 3);
				ctx.shadowBlur = randomNum(-3, 3);
				ctx.shadowColor = "rgba(0, 0, 0, 0.3)";
				var x = this.options.width / 5 * i;
				var y = this.options.height / 2;
				var deg = randomNum(-30, 30);
				/**设置旋转角度和坐标原点**/
				ctx.translate(x, y);
				ctx.rotate(deg * Math.PI / 180);
				ctx.fillText(txt, 0, 0);
				/**恢复旋转角度和坐标原点**/
				ctx.rotate(-deg * Math.PI / 180);
				ctx.translate(-x, -y);
			}
			/**绘制干扰线**/
			for(var i = 0; i < 4; i++) {
				ctx.strokeStyle = randomColor(40, 180);
				ctx.beginPath();
				ctx.moveTo(randomNum(0, this.options.width), randomNum(0, this.options.height));
				ctx.lineTo(randomNum(0, this.options.width), randomNum(0, this.options.height));
				ctx.stroke();
			}
			/**绘制干扰点**/
			for(var i = 0; i < this.options.width/4; i++) {
				ctx.fillStyle = randomColor(0, 255);
				ctx.beginPath();
				ctx.arc(randomNum(0, this.options.width), randomNum(0, this.options.height), 1, 0, 2 * Math.PI);
				ctx.fill();
			}
		},
		
		/**验证验证码**/
		validate: function(code){
			var code = code.toLowerCase();
			var v_code = this.options.code.toLowerCase();	
			
			if(code == v_code){
				return true;
			}else{
				this.refresh();
				return false;
			}
		}
    }
    /*unicode 编码*/
    var hanziUnicode = "\u7684,\u4e00,\u662f,\u4e86,\u6211,\u4e0d,\u4eba,\u5728,\u4ed6,\u6709,\u8fd9,\u4e2a,\u4e0a,\u4eec,\u6765,\u5230,\u65f6,\u5927,\u5730,\u4e3a,\u5b50,\u4e2d,\u4f60,\u8bf4,\u751f,\u56fd,\u5e74,\u7740,\u5c31,\u90a3,\u548c,\u8981,\u5979,\u51fa,\u4e5f,\u5f97,\u91cc,\u540e,\u81ea,\u4ee5,\u4f1a,\u5bb6,\u53ef,\u4e0b,\u800c,\u8fc7,\u5929,\u53bb,\u80fd,\u5bf9,\u5c0f,\u591a,\u7136,\u4e8e,\u5fc3,\u5b66,\u4e48,\u4e4b,\u90fd,\u597d,\u770b,\u8d77,\u53d1,\u5f53,\u6ca1,\u6210,\u53ea,\u5982,\u4e8b,\u628a,\u8fd8,\u7528,\u7b2c,\u6837,\u9053,\u60f3,\u4f5c,\u79cd,\u5f00,\u7f8e,\u603b,\u4ece,\u65e0,\u60c5,\u5df1,\u9762,\u6700,\u5973,\u4f46,\u73b0,\u524d,\u4e9b,\u6240,\u540c,\u65e5,\u624b,\u53c8,\u884c,\u610f,\u52a8,\u65b9,\u671f,\u5b83,\u5934,\u7ecf,\u957f,\u513f,\u56de,\u4f4d,\u5206,\u7231,\u8001,\u56e0,\u5f88,\u7ed9,\u540d,\u6cd5,\u95f4,\u65af,\u77e5,\u4e16,\u4ec0,\u4e24,\u6b21,\u4f7f,\u8eab,\u8005,\u88ab,\u9ad8,\u5df2,\u4eb2,\u5176,\u8fdb,\u6b64,\u8bdd,\u5e38,\u4e0e,\u6d3b,\u6b63,\u611f,\u89c1,\u660e,\u95ee,\u529b,\u7406,\u5c14,\u70b9,\u6587,\u51e0,\u5b9a,\u672c,\u516c,\u7279,\u505a,\u5916,\u5b69,\u76f8,\u897f,\u679c,\u8d70,\u5c06,\u6708,\u5341,\u5b9e,\u5411,\u58f0,\u8f66,\u5168,\u4fe1,\u91cd,\u4e09,\u673a,\u5de5,\u7269,\u6c14,\u6bcf,\u5e76,\u522b,\u771f,\u6253,\u592a,\u65b0,\u6bd4,\u624d,\u4fbf,\u592b,\u518d,\u4e66,\u90e8,\u6c34,\u50cf,\u773c,\u7b49,\u4f53,\u5374,\u52a0,\u7535,\u4e3b,\u754c,\u95e8,\u5229,\u6d77,\u53d7,\u542c,\u8868,\u5fb7,\u5c11,\u514b,\u4ee3,\u5458,\u8bb8,\u7a1c,\u5148,\u53e3,\u7531,\u6b7b,\u5b89,\u5199,\u6027,\u9a6c,\u5149,\u767d,\u6216,\u4f4f,\u96be,\u671b,\u6559,\u547d,\u82b1,\u7ed3,\u4e50,\u8272,\u66f4,\u62c9,\u4e1c,\u795e,\u8bb0,\u5904,\u8ba9,\u6bcd,\u7236,\u5e94,\u76f4,\u5b57,\u573a,\u5e73,\u62a5,\u53cb,\u5173,\u653e,\u81f3,\u5f20,\u8ba4,\u63a5,\u544a,\u5165,\u7b11,\u5185,\u82f1,\u519b,\u5019,\u6c11,\u5c81,\u5f80,\u4f55,\u5ea6,\u5c71,\u89c9,\u8def,\u5e26,\u4e07,\u7537,\u8fb9,\u98ce,\u89e3,\u53eb,\u4efb,\u91d1,\u5feb,\u539f,\u5403,\u5988,\u53d8,\u901a,\u5e08,\u7acb,\u8c61,\u6570,\u56db,\u5931,\u6ee1,\u6218,\u8fdc,\u683c,\u58eb,\u97f3,\u8f7b,\u76ee,\u6761,\u5462,\u75c5,\u59cb,\u8fbe,\u6df1,\u5b8c,\u4eca,\u63d0,\u6c42,\u6e05,\u738b,\u5316,\u7a7a,\u4e1a,\u601d,\u5207,\u600e,\u975e,\u627e,\u7247,\u7f57,\u94b1,\u7d36,\u5417,\u8bed,\u5143,\u559c,\u66fe,\u79bb,\u98de,\u79d1,\u8a00,\u5e72,\u6d41,\u6b22,\u7ea6,\u5404,\u5373,\u6307,\u5408,\u53cd,\u9898,\u5fc5,\u8be5,\u8bba,\u4ea4,\u7ec8,\u6797,\u8bf7,\u533b,\u665a,\u5236,\u7403,\u51b3,\u7aa2,\u4f20,\u753b,\u4fdd,\u8bfb,\u8fd0,\u53ca,\u5219,\u623f,\u65e9,\u9662,\u91cf,\u82e6,\u706b,\u5e03,\u54c1,\u8fd1,\u5750,\u4ea7,\u7b54,\u661f,\u7cbe,\u89c6,\u4e94,\u8fde,\u53f8,\u5df4,\u5947,\u7ba1,\u7c7b,\u672a,\u670b,\u4e14,\u5a5a,\u53f0,\u591c,\u9752,\u5317,\u961f,\u4e45,\u4e4e,\u8d8a,\u89c2,\u843d,\u5c3d,\u5f62,\u5f71,\u7ea2,\u7238,\u767e,\u4ee4,\u5468,\u5427,\u8bc6,\u6b65,\u5e0c,\u4e9a,\u672f,\u7559,\u5e02,\u534a,\u70ed,\u9001,\u5174,\u9020,\u8c08,\u5bb9,\u6781,\u968f,\u6f14,\u6536,\u9996,\u6839,\u8bb2,\u6574,\u5f0f,\u53d6,\u7167,\u529e,\u5f3a,\u77f3,\u53e4,\u534e,\u8ae3,\u62ff,\u8ba1,\u60a8,\u88c5,\u4f3c,\u8db3,\u53cc,\u59bb,\u5c3c,\u8f6c,\u8bc9,\u7c73,\u79f0,\u4e3d,\u5ba2,\u5357,\u9886,\u8282,\u8863,\u7ad9,\u9ed1,\u523b,\u7edf,\u65ad,\u798f,\u57ce,\u6545,\u5386,\u60ca,\u8138,\u9009,\u5305,\u7d27,\u4e89,\u53e6,\u5efa,\u7ef4,\u7edd,\u6811,\u7cfb,\u4f24,\u793a,\u613f,\u6301,\u5343,\u53f2,\u8c01,\u51c6,\u8054,\u5987,\u7eaa,\u57fa,\u4e70,\u5fd7,\u9759,\u963f,\u8bd7,\u72ec,\u590d,\u75db,\u6d88,\u793e,\u7b97,\u4e49,\u7adf,\u786e,\u9152,\u9700,\u5355,\u6cbb,\u5361,\u5e78,\u5170,\u5ff5,\u4e3e,\u4ec5,\u949f,\u6015,\u5171,\u6bdb,\u53e5,\u606f,\u529f,\u5b98,\u5f85,\u7a76,\u8ddf,\u7a7f,\u5ba4,\u6613,\u6e38,\u7a0b,\u53f7,\u5c45,\u8003,\u7a81,\u76ae,\u54ea,\u8d39,\u5012,\u4ef7,\u56fe,\u5177,\u521a,\u8111,\u6c38,\u6b4c,\u54cd,\u5546,\u793c,\u7ec6,\u4e13,\u9ec4,\u5757,\u811a,\u5473,\u7075,\u6539,\u636e,\u822c,\u7834,\u5f15,\u98df,\u4ecd,\u5b58,\u4f17,\u6ce8,\u7b14,\u751a,\u67d0,\u6c89,\u8840,\u5907,\u4e60,\u6821,\u9ed8,\u52a1,\u571f,\u5fae,\u5a18,\u987b,\u8bd5,\u6000,\u6599,\u8c03,\u5e7f,\u8716,\u82cf,\u663e,\u8d5b,\u67e5,\u5bc6,\u8bae,\u5e95,\u5217,\u5bcc,\u68a6,\u9519,\u5ea7,\u53c2,\u516b,\u9664,\u8dd1,\u4eae,\u5047,\u5370,\u8bbe,\u7ebf,\u6e29,\u867d,\u6389,\u4eac,\u521d,\u517b,\u9999,\u505c,\u9645,\u81f4,\u9633,\u7eb8,\u674e,\u7eb3,\u9a8c,\u52a9,\u6fc0,\u591f,\u4e25,\u8bc1,\u5e1d,\u996d,\u5fd8,\u8da3,\u652f,\u6625,\u96c6,\u4e08,\u6728,\u7814,\u73ed,\u666e,\u5bfc,\u987f,\u7761,\u5c55,\u8df3,\u83b7,\u827a,\u516d,\u6ce2,\u5bdf,\u7fa4,\u7687,\u6bb5,\u6025,\u5ead,\u521b,\u533a,\u5965,\u5668,\u8c22,\u5f1f,\u5e97,\u5426,\u5bb3,\u8349,\u6392,\u80cc,\u6b62,\u7ec4,\u5dde,\u671d,\u5c01,\u775b,\u677f,\u89d2,\u51b5,\u66f2,\u9986,\u80b2,\u5fd9,\u8d28,\u6cb3,\u7eed,\u54e5,\u547c,\u82e5,\u63a8,\u5883,\u9047,\u96e8,\u6807,\u59d0,\u5145,\u56f4,\u6848,\u4f26,\u62a4,\u51b7,\u8b66,\u8d1d,\u8457,\u96ea,\u7d22,\u5267,\u554a,\u8239,\u9669,\u70df,\u4f9d,\u6597,\u503c,\u5e2e,\u6c49,\u6162,\u4f5b,\u80af,\u95fb,\u5531,\u6c99,\u5c40,\u4f2f,\u65cf,\u4f4e,\u73a9,\u8d44,\u5c4b,\u51fb,\u901f,\u987e,\u6cea,\u6d32,\u56e2,\u5723,\u65c1,\u5802,\u5175,\u4e03,\u9732,\u56ed,\u725b,\u54ed,\u65c5,\u8857,\u52b3,\u578b,\u70c8,\u59d1,\u9648,\u83ab,\u9c7c,\u5f02,\u62b1,\u5b9d,\u6743,\u9c81,\u7b80,\u6001,\u7ea7,\u7968,\u602a,\u5bfb,\u6740,\u5f8b,\u80dc,\u4efd,\u6c7d,\u53f3,\u6d0b,\u8303,\u5e8a,\u821e,\u79d8,\u5348,\u767b,\u697c,\u8d35,\u5438,\u8d23,\u4f8b,\u8ffd,\u8f83,\u804c,\u5c5e,\u6e10,\u5de6,\u5f55,\u4e1d,\u7259,\u515a,\u7ee7,\u6258,\u8d76,\u7ae0,\u667a,\u51b2,\u53f6,\u80e1,\u5409,\u5356,\u575a,\u559d,\u8089,\u9057,\u6551,\u4fee,\u677e,\u4e34,\u85cf,\u62c5,\u620f,\u5584,\u536b,\u836f,\u60b2,\u6562,\u9760,\u4f0a,\u6751,\u6234,\u8bcd,\u68ee,\u8033,\u5dee,\u77ed,\u7956,\u4e91,\u89c4,\u7a97,\u6563,\u8ff7,\u6cb9,\u65e7,\u9002,\u4e61,\u67b6,\u6069,\u6295,\u5f39,\u94c1,\u535a,\u96f7,\u5e9c,\u538b,\u8d85,\u8d1f,\u52d2,\u6742,\u9192,\u6d17,\u91c7,\u6beb,\u5634,\u6bd5,\u4e5d,\u51b0,\u65e2,\u72b6,\u4e71,\u666f,\u5e2d,\u73cd,\u7ae5,\u9876,\u6d3e,\u7d20,\u8131,\u519c,\u7591,\u7ec3,\u91ce,\u6309,\u72af,\u62cd,\u5f81,\u574f,\u9aa8,\u4f59,\u627f,\u7f6e,\u81d3,\u5f69,\u706f,\u5de8,\u7434,\u514d,\u73af,\u59c6,\u6697,\u6362,\u6280,\u7ffb,\u675f,\u589e,\u5fcd,\u9910,\u6d1b,\u585e,\u7f3a,\u5fc6,\u5224,\u6b27,\u5c42,\u4ed8,\u9635,\u739b,\u6279,\u5c9b,\u9879,\u72d7,\u4f11,\u61c2,\u6b66,\u9769,\u826f,\u6076,\u604b,\u59d4,\u62e5,\u5a1c,\u5999,\u63a2,\u5440,\u8425,\u9000,\u6447,\u5f04,\u684c,\u719f,\u8bfa,\u5ba3,\u94f6,\u52bf,\u5956,\u5bab,\u5ffd,\u5957,\u5eb7,\u4f9b,\u4f18,\u8bfe,\u9e1f,\u558a,\u964d,\u590f,\u56f0,\u5218,\u7f6a,\u4ea1,\u978b,\u5065,\u6a21,\u8d25,\u4f34,\u5b88,\u6325,\u9c9c,\u8d22,\u5b64,\u67aa,\u7981,\u6050,\u4f19,\u6770,\u8ff9,\u59b9,\u85f8,\u904d,\u76d6,\u526f,\u5766,\u724c,\u6c5f,\u987a,\u79cb,\u8428,\u83dc,\u5212,\u6388,\u5f52,\u6d6a,\u542c,\u51e1,\u9884,\u5976,\u96c4,\u5347,\u7883,\u7f16,\u5178,\u888b,\u83b1,\u542b,\u76db,\u6d4e,\u8499,\u68cb,\u7aef,\u817f,\u62db,\u91ca,\u4ecb,\u70e7,\u8bef";
	/**生成字母数组**/
	// function getAllLetter() {
	// 	var letterStr = "a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z,A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z";
	// 	return letterStr.split(",");
	// }
 
	/**生成字母和汉字数组**/
	function getAllLetter() {
        var letterStr = "a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z,A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z";
        var munStr= "0,1,2,3,4,5,6,7,8,9";			
        var hanziStr = hanziUnicode; //	hanziUnicode为unicode.js里面的变量	
        var str=letterStr +  ","+ munStr;				
		// var str=letterStr +  ","+ munStr +","+ hanziStr;			
		return str.split(",");
	}
	/**生成一个随机数**/
	function randomNum(min, max) {
		return Math.floor(Math.random() * (max - min) + min);
	}
	/**生成一个随机色**/
	function randomColor(min, max) {
		var r = randomNum(min, max);
		var g = randomNum(min, max);
		var b = randomNum(min, max);
		return "rgb(" + r + "," + g + "," + b + ")";
	}
	window.GVerify = GVerify;
})(window, document);