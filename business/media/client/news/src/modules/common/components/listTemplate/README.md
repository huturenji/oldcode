
##组件使用说明
本组件集成了mescroll.js来实现滑动分页效果。主要功能请参考http://www.mescroll.com/api.html
另外业务侧集成了批量选择和忽略功能

本组件核心参数：
getDataFunc： 获取数据的回调函数。应返回一个Promise对象，并在resolve函数中返回列表数据
pageConfig: 分页参数，包括num（当前页）和size（每页条数）
mescrollUpConfig：上拉加载参数（参考mescroll文档）
mescrollDownConfig： 下拉刷新参数（参考mescroll文档）

业务参数：
listItemConfig： newsItem需要的参数，具体参考newsItem组件
ignoreId： 需要删除的newItem的id
showCheck: 列表是否显示批量删除的按钮
value: 双向绑定的选中的列表的item，如果showCheck为true的话
keyword: 搜索关键字，用于高亮显示title

