<!--
 * @Author: whchen
 * @Descripttion: 
 * @Date: 2023-04-10 13:41:00
 * @LastEditTime: 2023-04-20 10:28:26
 * @FilePath: \mobile-miniprogram\src\common\components\decorate\navbar\index.vue
-->
<template>
    <view class="transform">
        <u-navbar
            :bgColor="bgColor"
            :titleStyle="titleStyle"
            :title="title"
            :placeholder="placeholder"
            :leftIconSize="leftIconSize"
            :leftIconColor="leftIconColor"
            :titleWidth="titleWidth"
            autoBack
            :height="navigationBarHeight"
        />
    </view>  
</template>

<script>
import { isNotEmpty } from "@/utils/common.js";
import systemMixin from '@/common/mixin/system';
import changeMethods from '@/common/components/decorate/navbar/changeMethods';
export default {
    name: "deco-navbar",
    mixins: [systemMixin, changeMethods],
    components: {},
    props: {
        // 装修数据
        decoItem: {
            type: Object,
            default: () => {}
        },
        parentScrollTop: {
            type: Number,
            default: 0
        },
        title: {
            type: String,
            default: ''
        },
    },
    data() {
        return {
            statusbar: {}, // 状态栏装修配置
            titlebar: {}, // title栏装修配置项
            bgColor: 'transparent',
            titleStyle: {}, 
            placeholder: false,
            leftIconSize: 0, // 左侧返回图标的大小
            leftIconColor: '', // 左侧返回图标的颜色
            titleWidth: 0, // titile文字的宽度
            canSet1: true,
            canSet0: false
        };
    },
    computed: {
       
    },
    watch: {
        decoItem: {
            handler(val, oldVal){
                if(isNotEmpty(val) && JSON.stringify(val) != JSON.stringify(oldVal)){
                    this.initStatusbar(val)
                    this.initTitlebar(val)
                }    
            },
            deep: true,
            immediate: true
        },
        parentScrollTop: {
            handler(val){
                if(val > 3){
                    let opacity = val / 100;
                    opacity = opacity > 1 ? 1 : opacity;
                    this.setStatusbar1();
                    this.setTitlebar1(opacity);
                } else {
                    this.setStatusbar0();
                    this.setTitlebar0();
                }
            },
            deep: true,
            immediate: true
        },
       
    },
    created(){
        
    },

    methods: {}
};
</script>

<style lang="scss" scoped>
    .transform {
        transition: 'background-color' 3s;
    }
</style>