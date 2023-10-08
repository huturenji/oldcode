
ignorePop组件

##组件使用说明
1.组件功能：展示屏蔽、举报的界面，按传入的位置和样式类型进行展示。

2.options
    newsItem：资讯item对象，必须传入posAndSize，否则位置和箭头样式不正确

3.事件 
    $emit('ignoreNews','')，屏蔽操作
    $emit('reportNews','')，举报操作