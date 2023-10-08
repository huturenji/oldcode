// 沉浸式
export default {
    data() {
        return {
            immersive:true //是否是沉浸式
        };
    },
    created() {
        if (this.immersive) {
            this.titleBarTheme(false);
        } else {
            this.titleBarTheme(true);
        }
    },
    methods: {
        // 设置titleBar样式
        titleBarTheme(reverse) {
            if (reverse) {
                this.$titleBar.set({
                    title: {
                        show: true,
                        showTitle: true,
                        themeMode: 'dark'
                    },
                    status: {
                        show: true,
                        themeMode: 'dark'
                    }
                })
            } else {
                this.$titleBar.set({
                    title: {
                        show: false,
                        showTitle: false,
                        themeMode: 'light'
                    },
                    status: {
                        show: false,
                        themeMode: 'light'
                    }
                })
            }
        }
    },
}