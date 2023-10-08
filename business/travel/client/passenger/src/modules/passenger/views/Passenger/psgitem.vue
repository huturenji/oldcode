<template>
    <div class='psgItem'>
        <div v-if='hasCheck' class="checkBox" >
            <icon :type="ischecked?'btn_common_checkbox_sel':'btn_common_checkbox_nor'" size='.4' />
        </div>
        <div class="linePWrap">
            <div class="lineP">
                <!-- <SnAvatar class="icon" :uaid = item.thirdUserId></SnAvatar>-->
                <div class="linetext">
                    <div class="text" v-if="$options.filters.showSurname((item||{}).idCode)">{{item.firstName}} {{item.lastName}}</div>
                    <div v-else class="text">{{item.name}}</div>
                    <div class="tips">{{ID}}</div>
                </div>
                <div class="editBut cursorp" @click.stop='$emit("editPsg", item)'><icon type="btn_common_edit" size='.32' /></div>
            </div>
        </div>
    </div>
</template>

<script>
import icon from "components/icon/index.vue"
// import SnAvatar from './SnAvatar';

export default {
    components:{
        // SnAvatar,
        icon
    },
    props:['hasCheck','ischecked','ID','item']
}
</script>

<style lang="less" scoped>
@import '~styles/core/common.less';
@import '~styles/mixins/mixinsStyle.less';
.linePWrap{
    flex: 1; 
}
.lineP{
    display: flex;
    .icon{
        width: 0.8rem;
        height: 0.8rem;
        border-radius: 0.06rem;
    }
    .noID{
        display: flex;
    }
    .linetext{
        flex: 1; 
        font-size: 0.3rem;
        padding-left: 0.18rem;
        padding-right: 0;
        min-height: 0.72rem;
        .text{
            align-items: center;
            display: flex;
            max-width: 4rem;
            color: #000;
        }
        .tips{
            color: #999999;
            font-size: 0.26rem;
            padding: 0;
            margin-top: .3rem;
            background: #fff;
        }
    }
    .editBut{
        width: 0.72rem;
        height: 0.72rem;
    }
}
.psgItem{
    display: flex;
    align-items: center;
}
.checkBox{
    width:0.72rem;
    .btn_common_checkbox_sel{
        fill: @theme-color;
    }
    .btn_common_checkbox_nor{
        fill: @third-text-color;
    }

}

</style>