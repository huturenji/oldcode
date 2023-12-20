<template>
    <div class="home-wrap">
        <div class="title">
            <span>纸纹标签批量注册系统</span>
        </div>
        <div class="paperprint">
            <div class="gather" @click="goto('gather')">
                <div class="img"/>
                <span class="text">纸纹标签采集</span>
            </div>
            <div class="check" @click="goto('check')">
                <div class="img"/>
                <span class="text">纸纹标签审核</span>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    methods:{
        goto(path){
            this.$router.push({path:path})
        }
    }
}
</script>
<style scoped lang="less">
.home-wrap{
    .title{
        margin: auto;
        width: 200px;
        height: 29px;
        font-size: 20px;
        padding-top: 60px;
        color: #fff;
    }
    .paperprint{
        display: flex;
        margin-top: 143.5px;
        justify-content: center;
        text-align: center;
        .gather{
            .img{
                background: url('@/themes/default/img/home/gather.png') no-repeat;
                background-size: cover;
                width: 240px;
                height: 240px;
            }
        }
        .check{
            margin-left:128px ;
            .img{
                background: url('@/themes/default/img/home/check.png') no-repeat;
                background-size: cover;
                width: 240px;
                height: 240px;
            }
        }
        .text{
            display: block;
            margin-top: -15px;
            font-size: 20px;
            color: #fff;
        }

        
    }
}
</style>