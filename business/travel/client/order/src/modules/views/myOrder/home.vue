<template>
    <div class="indexWrap">
        <router-view></router-view>
    </div>
</template>

<script>
import extendUtils from 'orderCommon/extend.js';
export default {
    data() {
        return {

        };
    },
    created() {
        extendUtils.setStorage('homePageType', 'mini');
    }
}
</script>
