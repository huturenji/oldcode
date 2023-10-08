
reportPop组件

##组件使用说明
1.组件功能：举报的界面。

2.options
    newsItem：资讯item对象，必须传入messageId
    showReportPopup：界面显示隐藏控制，显隐组件时需要初始化数据

3.事件 
    $emit('reportDone','')，举报完成后通知父组件删除数据