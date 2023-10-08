### 安装
```
cnpm i yqt-calendar -D
```
### 引用方法
#### 第一种： npm 安装
#### 在入口文件引用
```
* import Calendar from 'yqt-calendar'
* Vue.use(Calendar)
```
#### 在vue中引用
```
<script>
import 'yqt-calendar/dist/style.css'
</script>
```
#### 第二种： 本地引用
```
import Calendar from 'vue文件的路径'
 export default {
        components: {
        Calendar
    }
 ```
#### 使用实例
```
<calendar ref="Calendar"></calendar>
```
### Props

|    name    |    Description   |   type   |default|
| -----------------  | ---------------- | :--------: | :----------: |
| onlyMarked       | 只能点击mark的时间 |Boolean| false
| displayMode        | 显示的类型 |Number | 1、都显示，2、只能选择时间，3、只能选择日期,4.选择日期范围，5.只选月份
| markArray        | 被标记日期列表 |Array | null
| disMarkArray        | 被alert的日期列表 |Array | null
| agoDayHide        | 某个日期以前的不允许点击，同时适用于对应月份选择 时间戳长度是 13 位，0代表禁用 |Number |0
| futureDayHide        | 某个日期以后的不允许点击 时间戳长度是 13 位，0代表禁用 |Number |0
| isHideOtherday        | 超过今天的日期是否可以被点击 时间戳长度是 13 位，0代表禁用 |Boolean |false

### Events

| name | item   |Description
| :--------:   | -----  |:----------: |
|   @commitDate   |  date| 点击‘确认’或‘取消’的回调，取消回调为空，确认包含‘date’和‘time’，‘timeStamp’三个字段,若是时间段模式则返回包含两个时间的对象
|   @choseTime   |  time| 选择时间后的回调
|   @changeMonth   |  time| 选择年月后的回调
|   @choseDay   |  time| 选择日期后的回调
|   @changeDate   |  timeStamp| 时间或日期变更后的回调（由于组件初始化时会执行一次，使用时请在配合对日历是否展开的判断）

### 注入默认显示时间(如果是日期范围模式建议不要使用)
 ```
 this.$refs.Calendar.setDate('timeStamp'); //时间戳是短的，10位
 ```
### 注入时间范围方法
1.先修改 markedRange=['yyyy/MM/dd','yyyy/MM/dd']
2.this.$refs.hotelCalendar.resetViewByRange();