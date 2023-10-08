<template>
    <div
        class="main"
        v-if="$route.meta.auth"
    >
        <nav-bar></nav-bar>
        <keep-alive>
            <router-view
                v-if="$route.meta.keepAlive"
                class="child-view loading-area"
            ></router-view>
        </keep-alive>
        <router-view
            v-if="!$route.meta.keepAlive"
            class="child-view loading-area"
        ></router-view>
    </div>
    <div v-else>
        <auth-tip
            ref="authTip"
            :show="!$route.meta.auth"
            @confirm="confirm"
        ></auth-tip>
    </div>
</template>
<script>
import NavBar from "./NavBar";
import AuthTip from "./AuthTip";
export default {
    components: {
        NavBar,
        AuthTip
    },
    methods: {
        confirm() {
            this.$refs.authTip.showAuth = false;
        }
    }
};
</script>