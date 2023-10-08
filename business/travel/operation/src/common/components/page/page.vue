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
                           oninput="value=value.replace(/^(0+)|[^\d]+/g,'')">页</span>
            <span class="pageBtn cursorp" @click="goPage(gotoNum,true)">确定</span>
        </div>
        <transition name="fade">
            <div class="message" v-if="message">{{message}}</div>
        </transition>
    </div>
</template>
<script>
    export default {
        props: ['page'],
        data() {
            return {
                gotoNum: 1,
                message: null,
            }
        },
        created() {
            this.gotoNum = this.page.currPage || 1
        },
        mounted() {
        },
        watch: {
            message: function(){
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
                if (enterPage) {
                    if(!newPageNum){
                        this.message = "请输入页数";
                        return;
                    }else if (newPageNum > this.page.pageCount) {
                        this.message = "超出总页数";
                        this.gotoNum = this.page.currPage;
                        console.log("goPage.gotoNum="+this.gotoNum)
                        return;
                    } 
                } else {//点击上/下页的情况
                    if (newPageNum > this.page.pageCount) {
                        this.message = "当前在末页";
                        return;
                    } else if (newPageNum <= 0) {
                        this.message = "当前在首页";
                        return;
                    }
                }
                this.gotoNum = newPageNum;
                console.log("turnPage.gotoNum="+this.gotoNum)
                this.$emit("turnPage", newPageNum);
            }
        }
    }
</script>
<style scoped>
    .message {
        width: 128px;
        height: 46px;
        padding: 12px 24px;
        background: #505050;
        color: #fff;
        border-radius: 2px;
        box-shadow: 2px 2px 2px #505050;
        text-align: center;
        position:fixed;
        left:50vw;
        top:50vh;
        z-index: 9999999;
    }

    .tablePage {
        height: 60px;       
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



