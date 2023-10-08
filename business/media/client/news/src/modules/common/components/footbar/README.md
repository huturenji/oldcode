
footbar组件

##组件使用说明
1.组件功能：点赞、点踩、收藏、分享、以及更多菜单；

2.options
    newsItem：资讯item对象，必须含有messageId，否则功能不可用
    barType：是否展示文字（赞、踩、收藏、分享）true/false 默认false

3.事件 
    $emit('action',type),type为share或more

