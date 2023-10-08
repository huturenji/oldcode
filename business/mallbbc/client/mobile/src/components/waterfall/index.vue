<template>
    <view class="waterfall">
        <view id="left-column" class="column">
            <slot name="left" :leftList="leftList"></slot>
        </view>
        <view id="right-column" class="column">
            <slot name="right" :rightList="rightList"></slot>
        </view>
        <slot></slot>
    </view>
</template>

<script>
/**
 * waterfall 瀑布流
 * @description 这是一个瀑布流形式的组件，内容分为左右两列，结合uView的懒加载组件效果更佳。相较于某些只是奇偶数左右分别，或者没有利用vue作用域插槽的做法，uView的瀑布流实现了真正的 组件化，搭配LazyLoad 懒加载和loadMore 加载更多组件，让您开箱即用，眼前一亮。
 * @property {Array} flow-list 用于渲染的数据
 * @property {String Number} add-time 单条数据添加到队列的时间间隔，单位ms，见上方注意事项说明（默认200）
 * @example <waterfall :flowList="flowList"></waterfall>
 */
import { getQuerySelector } from '@/utils/common.js'
export default {
    name: "waterfall",
    props: {
        value: {
            // 瀑布流数据
            type: Array,
            required: true,
            default: function() {
                return [];
            }
        },
        // 每次向结构插入数据的时间间隔，间隔越长，越能保证两列高度相近，但是对用户体验越不好
        // 单位ms
        addTime: {
            type: [Number, String],
            default: 200
        },
        // id值，用于清除某一条数据时，根据此idKey名称找到并移除，如数据为{idx: 22, name: 'lisa'}
        // 那么该把idKey设置为idx
        idKey: {
            type: String,
            default: 'id'
        },

        // 数据更新方式 join-拼接更新 update-纯更新左右列表的数据 replace-清空左右列表的数据重新渲染
        // join 目前的应用场景是所有的商品瀑布流的列表
        // update 目前的应用场景是所有的装修的推荐商品的瀑布流列表
        // replace 目前应用场景是首页more_tab装修出来的商品瀑布流列表，因为此时有切换tab的功能，切换之后需要替换掉商品数据
        mode: {
            type: String,
            default: 'join'
        }

    },
    data() {
        return {
            tempList: [],
            leftList: [], //渲染的左侧列表数据
            rightList: [], //渲染的右侧列表数据
            threshold: 1, //阈值，就是当瀑布流右侧比左侧只低1px 的时候，此时商品往左侧列表推数据 修复ios渲染误差，导致左右高度有点误差的问题的问题
            isTabChange: false
        }
    },
    watch: {
        async copyFlowList(nVal, oVal) {
            if (this.mode == 'update'){
                await this.updateLeftAndRightData(nVal, 'sku')
            } else if (this.mode == 'replace'){ // 如果数据是替换的换，此时需要将leftList和rightList的数据清空  目前的用处是首页比N家底部的tab装修组件
                this.tempList = this.cloneData(nVal);
                this.clearLeftAndRightList();
                await this.$nextTick()
                this.splitData();
            } else if (this.mode === 'replaceAndUpdate') {
                // 如果tab切换，old数据为[], 并设置切换状态为false
                let oldValArr = this.isTabChange ? [] : oVal
                if (this.isTabChange) {
                    this.leftList = []
                    this.rightList = []
                    this.isTabChange = false
                    this.tempList = this.cloneData(nVal)
                } else {
                    oldValArr = oVal
                    // 取差值，即这一次数组变化新增的部分
                    let startIndex = Array.isArray(oldValArr) && oldValArr.length > 0 ? oldValArr.length : 0;
                    // 拼接上原有数据
                    this.tempList = this.tempList.concat(this.cloneData(nVal.slice(startIndex)));
                }
                this.splitData();
            } else { //默认的 this.mode = join
                // 取差值，即这一次数组变化新增的部分
                let startIndex = Array.isArray(oVal) && oVal.length > 0 ? oVal.length : 0;
                // 拼接上原有数据
                this.tempList = this.tempList.concat(this.cloneData(nVal.slice(startIndex)));
                this.splitData();
            }
        }
    },
    mounted() {
        setTimeout(() => {
            this.tempList = this.cloneData(this.copyFlowList);
            this.splitData();
        }, 0)
    },
    computed: {
        // 破坏flowList变量的引用，否则watch的结果新旧值是一样的
        copyFlowList() {
            return this.cloneData(this.value);
        }
    },
    methods: {
        onTabChange(){
            this.isTabChange = true
        },
        async splitData() {
            // this.$nextTick() 为了避免切换tab时，左右高度未及时更新
            await this.$nextTick()
            if (!this.tempList.length) { return; }
            let leftRect = await getQuerySelector('#left-column', false, this);
            let rightRect = await getQuerySelector('#right-column', false, this);
            // 如果左边小于或等于右边，就添加到左边，否则添加到右边
            let item = this.tempList[0];
            // 解决多次快速上拉后，可能数据会乱的问题，因为经过上面的两个await节点查询阻塞一定时间，加上后面的定时器干扰
            // 数组可能变成[]，导致此item值可能为undefined
            if (!item) { return ; }
            
            if (leftRect.height < rightRect.height) {
                this.leftList.push(item);
            } else if (leftRect.height > (rightRect.height+this.threshold)) {
                this.rightList.push(item);
            } else if (this.leftList.length <= this.rightList.length){
                // 这里是为了保证第一和第二张添加时，左右都能有内容
                // 因为添加第一张，实际队列的高度可能还是0，这时需要根据队列元素长度判断下一个该放哪边
                this.leftList.push(item);
            } else {
                this.rightList.push(item);
            }
            
            // 移除临时列表的第一项
            this.tempList.splice(0, 1);
            // 如果临时数组还有数据，继续循环
            if (this.tempList.length) {
                
                if (this.mode == 'join'){
            
                    setTimeout(() => {
                        this.splitData();
                    }, this.addTime)
                } else {
                    await this.$nextTick()
                    this.splitData();
                }
                
            }
        },

        resetData(){
            this.clear();
            this.tempList = this.cloneData(this.copyFlowList);
            this.splitData();
        },

        // 清空瀑布流左右两侧的数据
        clearLeftAndRightList(){
            this.leftList = [];
            this.rightList = [];
        },

        // 根据key更新瀑布流左右两侧的数据
        updateLeftAndRightData(list, key) {
            return new Promise(async resolve => {
                if (this.leftList.length > 0){
                    let newList = this.leftList.map(item => {
                        let index = list.findIndex(temp=>{
                            return temp[key] == item[key];
                        })
                        if (index > -1){
                            return {...list[index]}
                        }
                        return false;
                        
                    })
                    this.leftList = newList.filter(item => {
                        return !!item && Object.keys(item).length > 0
                    })
    
                }
                if (this.rightList.length > 0){
                    let newList = this.rightList.map(item => {
                        let index = list.findIndex(temp=>{
                            return temp[key] == item[key];
                        })
                        if (index > -1){
                            return {...list[index]}
                        }
                        return false;
                        
                    })
                    this.rightList = newList.filter(item => {
                        return !!item && Object.keys(item).length > 0
                    })
                }
    
                resolve()
            })
        },
        getTotalHeight(list, index) {
            let total = 0
            for (let i = 0; i < index; i++) {
                total += list[i].height + 10
            }
            return total
        },
        // 数据被过滤
        resetWaterFallData() {
            return new Promise(async resolve => {
                await this.$nextTick()
                try {
                    let noDataLeftIndex = this.leftList.findIndex(item => !item.salePrice) === -1 ? this.leftList.length - 1 : this.leftList.findIndex(item => !item.salePrice)
                    let noDataRightIndex = this.rightList.findIndex(item => !item.salePrice) === -1 ? this.rightList.length - 1 : this.rightList.findIndex(item => !item.salePrice)
                    // 左右高度不相等时  10 是商品组件的 margin: 10px 0
                    let leftList = await getQuerySelector('#left-column > .goods_item', true)
                    let rightList = await getQuerySelector('#right-column > .goods_item', true)
                    if (leftList.length === 0 && rightList.length === 0) { return }
                    if (this.getTotalHeight(leftList, noDataLeftIndex) > this.getTotalHeight(rightList, noDataRightIndex)) {
                        let leftItemHeight = leftList[noDataLeftIndex - 1].height
                        if (this.getTotalHeight(leftList, noDataLeftIndex) - this.getTotalHeight(rightList, noDataRightIndex) > leftItemHeight + 10) {
                            this.rightList.splice(noDataRightIndex, 0, this.leftList.splice(noDataLeftIndex - 1, 1)[0])
                        }
                    } else if (this.getTotalHeight(leftList, noDataLeftIndex) < this.getTotalHeight(rightList, noDataRightIndex)) {
                        let rightItemHeight = rightList[noDataRightIndex - 1].height
                        if (this.getTotalHeight(rightList, noDataRightIndex) - this.getTotalHeight(leftList, noDataLeftIndex) >= rightItemHeight + 10) {
                            this.leftList.splice(noDataLeftIndex, 0, this.rightList.splice(noDataRightIndex-1, 1)[0])
                        }
                    }
                    resolve()
                } catch (error) {
                    console.log(error)
                    resolve()
                }
            })
        },

        // 复制而不是引用对象和数组
        cloneData(data) {
            return JSON.parse(JSON.stringify(data));
        },
        // 清空数据列表
        clear() {
            this.leftList = [];
            this.rightList = [];
            // 同时清除父组件列表中的数据
            // this.$emit('input', []);
            this.tempList = [];
        },
        // 清除某一条指定的数据，根据id实现
        remove(id) {
            // 如果findIndex找不到合适的条件，就会返回-1
            let index = -1;
            index = this.leftList.findIndex(val => val[this.idKey] == id);
            if (index != -1) {
                // 如果index不等于-1，说明已经找到了要找的id，根据index索引删除这一条数据
                this.leftList.splice(index, 1);
            } else {
                // 同理于上方面的方法
                index = this.rightList.findIndex(val => val[this.idKey] == id);
                if (index != -1) { this.rightList.splice(index, 1); }
            }
            // 同时清除父组件的数据中的对应id的条目
            index = this.value.findIndex(val => val[this.idKey] == id);
            if (index != -1) { this.$emit('input', this.value.splice(index, 1)); }
        },
        // 修改某条数据的某个属性
        modify(id, key, value) {
            // 如果findIndex找不到合适的条件，就会返回-1
            let index = -1;
            index = this.leftList.findIndex(val => val[this.idKey] == id);
            if (index != -1) {
                // 如果index不等于-1，说明已经找到了要找的id，修改对应key的值
                this.leftList[index][key] = value;
            } else {
                // 同理于上方面的方法
                index = this.rightList.findIndex(val => val[this.idKey] == id);
                if (index != -1) { this.rightList[index][key] = value; }
            }
            // 修改父组件的数据中的对应id的条目
            index = this.value.findIndex(val => val[this.idKey] == id);
            if (index != -1) {
                // 首先复制一份value的数据
                let data = this.cloneData(this.value);
                // 修改对应索引的key属性的值为value
                data[index][key] = value;
                // 修改父组件通过v-model绑定的变量的值
                this.$emit('input', data);
            }
        }
    }
}
</script>

<style lang="scss">

.waterfall {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    width: 100%;
}

.column {
    display: flex;
    flex: 1;
    flex-direction: column;
    height: auto;
    overflow: hidden;
}


</style>
