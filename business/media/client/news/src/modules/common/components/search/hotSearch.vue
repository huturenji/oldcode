<template>
    <div class='hot-search-list'>
        <div class='title'>热门搜索</div>
        <ul>
            <li v-for='(word, index) in dataList' class='icon-btn' :key='word' @click='clickKeyword(word)'>
                <span v-if='index<=2' class='index' :index='index'>{{index+1}}</span>
                <span class='text'>{{word}}</span>
            </li>
        </ul>
    </div>
</template>
<script>
// import extendUtils from 'common/lib/utils';
export default {
    props: {
        dataList: {
            type: Array
        }
    },
    data: function () {
        return {
        }
    },
    methods: {
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
    .hot-search-list{
        padding: .2rem .3rem;
        .title{
            font-size: .28rem;
            font-weight: bold;
        }

        ul{
            display: flex;
            flex-wrap: wrap;
            li{
                display: flex;
                justify-content: flex-start;
                align-items: center;
                margin-top: .26rem;
                flex: 1 0 50%;
                padding-right: .34rem;
                &:nth-of-type(even){
                    .blpx(2px, #D3D3D3, .1rem, .1rem);
                    padding-left: .24rem;
                    padding-right: 0;
                }

                .text{
                    .no-wrap;
                }

                .index{
                    flex: none;
                    margin-right: .08rem;
                    width: .28rem;
                    height: .28rem;
                    line-height: .28rem;
                    border-radius:.04rem;
                    font-size: .24rem;
                    color: #fff;
                    font-weight: 400;
                    text-align: center;
                    &[index='0']{
                        background-color: #FF4E3A;
                    }
                    &[index='1']{
                        background-color: #FF783A;
                    }
                    &[index='2']{
                        background-color: #FFA501;
                    }
                }
            }
        }
    }
</style>