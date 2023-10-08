<template>
    <div class="tablePage" style="display: flex;">
        <div class="pageLeft">每页显示<span>{{page.pageSize}}</span>条，共<span
                :datanum="page.pageCount">{{page.pageCount}}</span>页
        </div>
        <div class="pageRight">
            <span class="pageFirst cursorp" @click="goPage(1)">首页</span>
            <span class="pagePre cursorp" @click="goPage(page.currPage-1)">上一页</span>
            <span class="pageCur" :datacurpage="page.currPage">{{page.currPage}}/{{page.pageCount}}</span>
            <span class="pageNext cursorp" @click="goPage(page.currPage+1)">下一页</span>
            <span class="pageLast cursorp" @click="goPage(page.pageCount)">末页</span>
            <span>第<input type="tel" class="pageGotu" v-model="gotoNum"
                    onkeyup="this.value=this.value.replace(/\D/g,'')"
                    onafterpaste="this.value=this.value.replace(/\D/g,'')">页</span>
            <span class="pageBtn cursorp" @click="goPage(gotoNum,true)">确定</span>
        </div>
        <transition name="fade">
            <div class="message" v-if="message">{{message}}</div>
        </transition>
    </div>
</template>
<script>
// import requestHandler from 'orderCommon/requestHandler.js';
export default {
    props: ['page'],
    data() {
        return {
            gotoNum: 1,
            message: null
        }
    },
    created() {
    },
    mounted() {
    },
    watch: {
        message: function () {
            let _this = this;
            setTimeout(() => _this.message = null, 2000);
        }
    },
    methods: {
        /**
             * 翻页功能
             * @param newPageNum
             * @param enterPage
             */
        goPage(newPageNum, enterPage) {
            this.message = null;
            //输入页码跳转的情况
            if (!!enterPage) {
                if (newPageNum > this.page.pageCount) {
                    this.message = "已超最大页数";
                    return;
                }
            } else if (!enterPage) { //点击上/下页的情况
                if (newPageNum > this.page.pageCount) {
                    this.message = "当前在末页";
                    return;
                } else if (newPageNum <= 0) {
                    this.message = "当前在首页";
                    return;
                }
            }
            this.$emit("turnPage", newPageNum);
        }
    }
}
</script>
<style>
    .message {
        width: 128px;
        height: 46px;
        padding: 12px 24px;
        background: #505050;
        color: #fff;
        border-radius: 4px;
        box-shadow: 2px 2px 2px #505050;
        text-align: center;
        position: absolute;
        left: calc(50% - 64px);
        top: calc(50% - 223px);
        z-index: 9999999;
    }

    .tablePage {
        height: 60px;
        border-top: 1px solid #eaeaee;
        display: none;
        font-size: 14px;
        align-items: center;
        justify-content: space-between;
        color: #999;
    }

    .pageRight span {
        cursor: pointer;
        margin-right: 5px;
    }

    .pageRight input {
        color: inherit;
    }

    .pageGotu {
        width: 40px;
        height: 24px;
        margin-left: 5px;
        margin-right: 5px;
        border: 1px solid #eaeaee;
    }

    .pageBtn {
        border: 1px solid #eaeaee;
        padding: 3px 5px;
    }
</style>