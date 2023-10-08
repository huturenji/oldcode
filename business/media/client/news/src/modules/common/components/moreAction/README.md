
moreAction组件

##组件使用说明
1.组件功能：更多操作界面，目前只有举报操作

2.options
    newsItem：资讯item对象，必须传入messageId

3.事件 
    $emit('moreAction',type)，report,举报完成后通知父组件删除数据
    $emit('close','')，点击取消按钮通知父组件关闭界面