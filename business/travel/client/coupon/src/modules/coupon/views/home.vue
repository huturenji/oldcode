<template>
    <div class="indexWrap">
    <router-view></router-view>
    </div>
</template>

<script>
import {setStorage} from 'lib/extend.js';
export default {
    data() {
        return {
                
        };
    },
    created(){
        setStorage('homePageType','mini');
    }
}
</script>

