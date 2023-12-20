<template>
    <div class="headbreadcrumb" :class=bisType>
        
        <div class="leftWrap" >
            <div class="lefttit" @click="goback">
                <i class="el-icon-arrow-left icon"></i>
                <p>{{ title }}</p>
            </div>
            <!-- <p class="line"></p> -->
            <div class="tipsWrap">
                <div class="tipsDiv">
                    <p class="tips" v-if="tips" :class="{blue: bisType=='register'}" @click="registerFun">{{ tips }}</p>
                    <p class="bistips" :class="{blue: bisType=='verify'}" @click="verifyFun">{{ bistips }}</p>
                </div>
            </div>
               
           
           
        </div>
        <el-button v-show="showbtn" :type="type" @click="tabClick">{{btnName}}</el-button>
    </div>
</template>

<script>
export default {
    name: "head-breadcrumb",
    props: {
        title: {
            type: String,
            default: ""
        },
        tips: {
            type: String,
            default: ""
        },
        showbtn: {
            type: Boolean,
            default: false
        },
        btnName: {
            type: String,
            default: ""
        },
        type: {
            type: String,
            default: "default"
        },
        bisType:{
            type: String,
            default: "register"
        },
        bistips: {
            type: String,
            default: ""
        },
    },
    watch: {},
    data() {
        return {
            showbtn: false,
            isRegister:true,
        };
    },
    created() {
    },
    mounted() {},
    methods: {
        tabClick() {
            this.$emit("tabClick");
        },
        goback() {
            this.$emit("goback");
        },
        registerFun() {
            this.isRegister = true;
            this.$emit("registerFun");
        },
        verifyFun(){
            this.isRegister = false;
            this.$emit("verifyFun");
        }
    }
};
</script>
<style scoped lang="less">
.register{
    background:url('@/themes/default/img/line_tab_register.png') center no-repeat;
}
.verify{
    background:url('@/themes/default/img/line_tab_verify.png') center no-repeat;
}
.headbreadcrumb {
    height: 60px;
    background-position-y: 20px;
    margin-top: 40px;
    justify-content: space-between;
    font-size: 20px;
    color: #222;
    padding-left: 32px;
    .blue{
        color:#0B95EC;
    }
    .leftWrap{
        display: flex;
        align-items: center;
        font-weight: 500;
        .line{
            margin-left: 16px;
            width: 1px;
            height: 16px;
            background: url('@/themes/default/img/u45.png') center no-repeat;
            background-size: 100%;
        }
        .tips{
            font-weight: 600;
        }
        .bistips{
            margin-left: 65px;
            font-weight: 600;
        }
        .lefttit {
        display: flex;
        align-items: center;
        font-weight: 600;
        cursor: pointer;
        .icon {
            padding-right: 10px;
        }
    }
    }
    .tipsWrap{
        flex: auto;
        text-align: center;
        .tipsDiv{
            width: 360px;
            display: inline-flex;
        }
       
    }

}
</style>