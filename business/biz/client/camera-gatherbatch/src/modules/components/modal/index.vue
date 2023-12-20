<template>
    <div class="overlay" v-if="show"  id="overlay">
        <div class="modal-mask"  @click="close"></div>
        <transition name="modal">
            <div class="modal">
                <div class="modal-context">
                    <section v-if="title" class="modal-header">
                        {{title}}
                    </section>
                    <section class="modal-body">
                        <slot></slot>
                    </section>
                    <section v-if='cancelText||confirmText' class="modal-footer">
                        <div class="btn btn-cancel" v-if='cancelText' @click="cancel">{{cancelText}}</div>
                        <div class="btn btn-confirm" v-if='confirmText' @click="confirm">{{confirmText}}</div>
                    </section>
                </div>
            </div>
        </transition>
    </div>
</template>
<script>

export default {
    props:{
        show:{
            type:Boolean,
            default:false,
            required:true
        },
        title:{
            type:String,
            required:true
        },
        cancelText:{
            type:String,
            default:'',
            required:true
        },
        confirmText:{
            type:String,
            default:'',
            required:true
        }
    },
    data(){
        return{

        }
    },
    watch:{
        show(val){
        }
    },
    methods:{
        cancel(){
            this.close();
            this.$emit('cancel',false)
        },
        confirm(){
            this.close();
            this.$emit('confirm',false)
        },
        close(){
            this.show = this.showCancel||this.showConfirm?true:false;
            this.$emit('update:show',this.show );//修改父组件传递过来的show方法
            this.$emit('close',false)
        }
    }
}
</script>
<style scoped lang="less">
//dialog对话
.modal-enter-active,
.modal-leave-active{
    transition:opacity .5s
}

.modal-enter,
.modal-leave-to{
    opacity: 0;
}
.overlay{
    display: flex;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    justify-content: center;
    align-items: center;
    z-index: 999999;
    .modal-mask{
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.7);
        z-index: 999999;
    }
    .modal{
        z-index: 999999;
        display: flex;
        background: #FFF;
        .modal-context{
            position: relative;
            width: 380px;
            height: 475px;
            text-align: center;
            .modal-header{
                display: flex;
                align-items:flex-end;
                justify-content: center;
                height: 64px;
                font-size: 24px;
                color:#222;
            }
            .modal-footer{
                position: absolute;
                bottom: 32px;
                width: 100%;
                display: flex;
                justify-content: center;
                .btn{
                    width: 114px;
                    height: 40px;
                    line-height: 40px;
                    font-size: 16px;
                    background-color: #1145FF;
                    border-radius: 4px;
                    color: #FFF;
                    cursor: pointer;
                }
                .btn-confirm{
                    margin: 0 0 0 48px;
                }
                .btn-cancel{
                    background-color:#7E7E7E
                }
            }
        }

    }
}

</style>