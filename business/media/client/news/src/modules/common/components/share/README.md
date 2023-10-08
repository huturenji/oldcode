
share组件

##组件使用说明
1.组件功能：分享操作界面，目前只有伴正事、微信分享

2.options
    newsItem：资讯item对象，必须传入messageId

3.事件 
    $emit('close','')，点击取消按钮通知父组件关闭界面

4.调用伴正事分享功能传参(初步拟定)
    shareMessageData:{
        sharingType:string,//分享的类型，伴正事分享bizmate，微信分享wechat，朋友圈分享wechatTimeline
        title : string, // 分享标题          
        desc : string, // 分享描述           
        link : string, // 分享链接          
        imgUrl : string', // 分享图标,图片绝对地址       
        contentType : 'link', // 分享类型,music、video或link，不填默认为link
        appId: string,//分享的小应用Id
        appName: string,//小应用名字，无合法appId时显示用
        musicUrl：string,// type为music时必填
        videoUrl：string,// type为video时必填
    }