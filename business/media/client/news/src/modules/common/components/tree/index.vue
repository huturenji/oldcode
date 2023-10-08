<template>
    <div :class="getTreeClass" v-if='model'>
        <div v-if='model.name' @click='clickElement($event, model)' class='element' :class='getElementClass'>
            <span v-html='highlightWord(model.name)'></span>
        </div>
        <div v-if='hasChild'>
        <tree :model='data' v-for='data in model.children' :key='data.id' :keyword='keyword' @click='deliverClick'></tree>
        </div>
    </div>
</template>
<script>
export default {
    name: 'tree',
    props: {
        //数据源
        model: {
            type: Object,
            default: ()=>{}
        },
        keyword: {
            type: String
        }
    },
    data(){
        return {
            showEmpty: false
        }
    },
    computed: {
        /**
             * 是否有子树
             */ 
        hasChild(){
            if(!this.model){
                return false;
            }
            return this.model.children && this.model.children instanceof Array && this.model.children.length>0
        },
        getElementClass(){
            return {
                "hide": this.model.hide,
                "uncollapsed": this.model.uncollapsed,
                "parent": this.hasChild, 
                "child": !this.hasChild, 
                "added": this.model.added
            };
        },
        getTreeClass(){
            return { 
                "hide": this.model.hide,
                "root": this.model.root,//根节点
                "tree": !this.model.root && this.hasChild,//父节点
                "leaf": !this.model.root && !this.hasChild,//叶子节点
                "uncollapsed": this.model.uncollapsed
            }
        },
        highlightWord(){
            return value=>{
                if(!this.keyword){
                    return value;
                }
                let index = value.indexOf(this.keyword);
                if(index==-1){
                    return value;
                }
                return value.slice(0, index) + `<span class='hit-word'>${value.slice(index, index+this.keyword.length)}</span>` + value.slice(index+this.keyword.length)
            }
        }
    },
    methods: {
        /**
             * 传递点击事件到最上层
             */ 
        deliverClick(item){
            this.$emit("click", item);
        },
        /**
             * 点击一个元素
             */ 
        clickElement(event, model){
            //父节点切换；叶子节点抛出click事件
            if(event.currentTarget.classList.contains('parent')){
                this.toggleCollapse(model);
            }else{
                this.$emit("click", model);
            }
        },
        /**
             * 切换开关状态
             */ 
        toggleCollapse(model, value){
            this.$set(model, 'uncollapsed', value!=undefined ? value : !model.uncollapsed);
            //如果是关闭，则关闭其下所有子树
            if(!model.uncollapsed && model.children){
                model.children.forEach(child=>{
                    this.toggleCollapse(child, false)
                })
            }
        }
    }
}
</script>
<style lang="less" scoped>
    @import '~newsStyles/themes/default.less';
    @import '~newsStyles/mixins/mixinsStyle.less';
    .root{
        position: relative;
        background: #fff;
        height: 100%;
    }
    .element, .leaf{
        position: relative;
        font-size: .3rem;
        line-height: .88rem;
        cursor: pointer;
    }

    .tree {
        margin-left: .3rem;
        height: .88rem;
        overflow: hidden;
        transition: height 1s;
        &.uncollapsed{
            height: auto;
        }
    }

    .element{
        .bbpx();
        &:before{
            content: '';
            position: absolute;
            right: .3rem;
            top: .32rem;
            width: .24rem;
            height: .24rem;
            background: url('./img/icon_common_rightarrow.svg') 0 0 no-repeat;
            background-size: contain;
        }

        &.parent.uncollapsed{
            &:before{
                background: url('./img/icon_common_downarrow.svg') 0 0 no-repeat;
                background-size: contain;
            }
        }
        &.child{
            &:before{
                background: url('./img/btn_common_addnew.svg') 0 0 no-repeat;
                background-size: contain;
            }
        }
        &.added{
            &:before{
                background: none;
                content: '已添加';
                color: @info-color;
                font-size: .26rem;
                width: auto;
                height: auto;
                top: 0;
            }
        }
        /deep/ .hit-word{
            color: @theme-color;
        }
    }

    .leaf{
        margin-left: .34rem;
        cursor: pointer;
        &:active{
            box-shadow: 100rem 100rem 0 rgba(0,0,0,0.1) inset;
        }
    }
    
    .hide{
        display: none;
    }
</style>