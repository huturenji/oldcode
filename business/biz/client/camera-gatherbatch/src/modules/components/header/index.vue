<template>
    <div>
        <div class="header">
            <i v-if="backFlag" class="el-icon-arrow-left" @click="goBack"></i>
            <span>{{text}}</span>
        </div>
    </div>
</template>
<script>
export default {
    props:{
        backFlag:{
            type:Boolean,
            required:true,
            default:true
        },
        text:{
            type:String,
            required:true
        }
    },
    methods:{
        goBack(){
            this.$router.back();
        }
    }
}
</script>
<style scoped lang="less">
.header{
        position: relative;
        margin: auto;
        padding: 60px 0 31px 0;
        width: 100%;
        height: 120px;
        color: #fff;
        font-size: 20px;
        text-align: center;
        i{
            line-height: 29px;
            left:20px;
            position: absolute;
        }
    }
</style>