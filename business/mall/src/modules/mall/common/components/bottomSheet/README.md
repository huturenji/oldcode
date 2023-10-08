
bottomSheet组件

##组件使用说明
1.组件功能：展示传入的按钮菜单以及返回点击的菜单item；

2.options
    newsItem：资讯item对象，必须含有messageId，否则功能不可用
    barType：是否展示文字（赞、踩、收藏、分享）true/false 默认false

3.事件 
    $emit('action',option),option为传入的options菜单对象 
    $emit('close','')，点击取消按钮通知父组件关闭界面   