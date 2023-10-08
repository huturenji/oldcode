<template>
    <div class='history-list' v-if='historyList'>
        <nav>
            <span class='title'>搜索历史</span>
            <Icon type='icon_tpan_delect' size=".36" @click.native='clearHistroy'/>
        </nav>
        <ul>
            <li v-for='word in historyList' class='icon-btn' :key='word' @click='clickKeyword(word)'>{{word}}</li>
        </ul>
    </div>
</template>
<script>
import extendUtils from 'common/lib/utils';
import Icon from 'commonComp/icon';
export default {
    name: 'searchHistory',
    components: { Icon },
    props: {
        keyword: {
            type: String
        },
        beforeInitFunc: {
            type: Function
        },
        histroyKey: {
            type: String,
            default: 'searchHistory'
        }
    },
    data: function () {
        return {
            historyList: null
        }
    },
    watch: {
        keyword(_new) {
            if (_new != null && _new != '') {
                this.addHistroy(_new);
            }
        }
    },
    created: function () {
        this.loadHistroy();
    },
    methods: {
        /**
             * 加载历史
             */
        async loadHistroy() {
            // eslint-disable-next-line no-unused-expressions
            this.beforeInitFunc && await this.beforeInitFunc();
            let history = extendUtils.getStorage(this.histroyKey);
            this.historyList = history && JSON.parse(history);
        },

        /**
             * 存储历史
             */
        addHistroy(keyword) {
            let historyJSON = extendUtils.getStorage(this.histroyKey);
            let historyList = historyJSON ? JSON.parse(historyJSON) : [];
            let index = historyList.findIndex(key => key == keyword);
            if (index > -1) {
                historyList.splice(index, 1);
            }
            historyList.unshift(keyword);
            //最多10条历史
            if(historyList.length>10){
                historyList.length = 10;
            }
            extendUtils.setStorage(this.histroyKey, JSON.stringify(historyList));
            this.historyList = historyList;//刷新页面数据
        },

        /**
             * 清空历史
             */ 
        clearHistroy(){
            extendUtils.removeStorage(this.histroyKey);
            this.historyList = null;
        },

        /**
             * 点击关键字
             */ 
        clickKeyword(keyword){
            this.$emit('click', keyword);
        }
    }
}
</script>
<style lang='less' scoped>
    @import '~newsStyles/themes/default.less';
    @import '~newsStyles/mixins/mixinsStyle.less';
    .history-list{
        padding: .2rem .3rem;
        nav{
            display: flex;
            justify-content: space-between;
            
            .title{
                font-size: .28rem;
                font-weight: bold;
            }
        }
        ul{
            display: flex;
            flex-wrap: wrap;
            li{
                .no-wrap;
                margin-top: .26rem;
                flex: 1 0 50%;
                padding-right: .34rem;
                &:nth-child(even){
                    .blpx(2px, #D3D3D3, .1rem, .1rem);
                    padding-left: .24rem;
                    padding-right: 0;
                }
            }
        }
    }
</style>