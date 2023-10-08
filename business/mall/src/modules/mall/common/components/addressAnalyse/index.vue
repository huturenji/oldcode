<template>
    <div class="address-parse-area"> 
        <div class='block'>
            <textarea placeholder="粘贴地址信息，可自动识别并填写" v-model='value'></textarea>
            <div class='btn-group'>
                <div class='btn link-btn icon-btn' @click='clear' :class='isEmpty&&"hidden"'>清空</div>
                <div class='btn ghost-btn normal-btn' @click='analyse' :class='isEmpty&&"hidden"'>识别</div>
            </div>
        </div>
    </div>
</template>

<script>
import extendUtils from 'common/lib/utils';
import requestHandler from 'common/lib/requestHandler/addressHandler.js';
export default {
    name:'address-parse-area',
    data(){
        return {
            value: '',
        }
    },
    computed: {
        isEmpty(){
            return this.value==null || this.value==undefined || this.value==''
        }
    },
    methods:{
        clear(){
            this.value = ''
        },
        analyse(){
            requestHandler.addressAnalyse({addressInfo: this.value, supplierId: requestHandler.supplierId}).then(res=>{
                this.$emit('analyse', (res||{}).result)
                this.clear()
            })
        }
    }

}
</script>

<style lang="less" scoped>
@import '~themes/default/styles/common/variable.less';
@import '~mallStyles/mixins/hairLine.less';

.address-parse-area{
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    .block{
        background: @background-color;
        padding: .24rem .2rem .3rem;
    }

    textarea{
        width: 100%;
        height: 1.5rem;    

    }

    .btn-group{
        display: flex;
        justify-content: flex-end;   
        line-height: .56rem;
        font-size: .28rem;
        padding: 0 .1rem;

        .btn{
            margin-left: .3rem;
            color: @theme-color;
            &.hidden{
                visibility: hidden;
            }
        }

        .ghost-btn{
            .bpx(1px, .32rem, @theme-color);
            width: 1.6rem;
            text-align: center;
        }

        .link-btn{
            color: @theme-color;
            background: transparent;
        }
    }
}
</style>
