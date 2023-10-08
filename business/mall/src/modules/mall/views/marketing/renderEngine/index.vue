<template>
  <div v-if="show"> 
    <div v-for="(item, index) in value" :key="index" class="componentItem">
        <component :is="item.type" :data="item.data" @click.native.stop="canOperate && handleSelectWidget(index)" v-bind="$attrs" v-on="$listeners" ></component>
        <div v-if="canOperate" class="btns">
            <el-button @click.native="handleWidgetDelete(index)" type="warning">删除</el-button>
        </div>
    </div>
  </div>
</template>

<script>
import activity from 'common/components/activity/index.vue';
export default {
    name: 'render-engine',
    components:{
        activity,
    },
    props: {
        // 动态绑定的模板数据
        value:{
           type: Object,
           required: true,
           default:()=>[]
        },

        // 是否能够操作
        canOperate:{
           type: Boolean,
           default: false
        },

        select: {
            type: Object,
            required: true,
            default:()=>{}
        }
    },
    data(){
        return {
            selectWidget: this.select
        }
    },
    watch: {
        value:{
            handler(val){
                this.$nextTick(()=>{
                 
                })
            },
            deep: true
        },

        select (val) {
            this.selectWidget = val
        },

        selectWidget: {
            handler (val) {
                this.$emit('update:select', val)
            },
            deep: true
        }
    },
    computed:{
        show(){
            return this.value.length > 0;
        }
    },
    mounted(){

    },
    methods:{
        handleWidgetDelete(index){
            if (this.value.length - 1 === index) {
                if (index === 0) {
                    this.selectWidget = {}
                } else {
                    this.selectWidget = this.value[index - 1]
                }
            } else {
                this.selectWidget = this.value[index + 1]
            }

            this.$nextTick(() => {
                this.value.splice(index, 1)
            })
           
        },

        handleSelectWidget(index){
            this.selectWidget = this.value[index];
        }
    }
}
</script>

<style lang="less" scoped>
.componentItem{
    position: relative;
    .btns{
        position: absolute;
        bottom: 0;
        right: 0;
        z-index: 10;
    }
}
</style>