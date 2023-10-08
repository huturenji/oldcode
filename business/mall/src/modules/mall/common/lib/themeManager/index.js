class ThemeManager {
    constructor() {
        this.state = {
            themePath: themeConfig.path,//webpack打包时定义的地址
            currentLink: null
        }
    }

    remove = el => el && el.parentNode.removeChild(el);

    /**
     * 加载主题
     * @param {*} themeName 主题名
     */
    load(themeName) {
        const linkId = themeName+'-style';
        if(!!document.querySelector('link#'+linkId)){
            return;
        }
        
        document.body.id = themeName;//为样式覆盖增加权重

        //引入主题less，这样可以在dev中访问到
        if(process.env.NODE_ENV == 'development'){
            require('themes/' + themeName + '/styles/index.less');
            return 
        }
        //加载主题样式文件
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = `${this.state.themePath}/${themeName}.css`;
        link.dataset.theme = themeName;
        link.id = linkId;
        document.head.appendChild(link);
        
        //加载完成后移除上一个主题
        link.onload = () => {
            this.removeTheme();
            this.state.currentLink = link;
        }
    }

    removeTheme = () => {
        const { currentLink } = this.state;
        this.remove(currentLink);
    }

    resetTheme = () => {
        this.removeTheme();
        this.state.currentLink = null;
    }

    /**
     * 替换css变量
     * @param {*} obj 
     */
    changeCssVariable(obj){
        if(!obj || Object.prototype.toString.call(obj) !== '[object Object]'){
            throw '参数不能为空且必须是对象';
        }

        Object.keys(obj).forEach(key=>{
            if(!key.startsWith('--')){
                key = '--' + key;
            }
            document.body.style.setProperty(key, obj[key]);
        })
    }
};

export default new ThemeManager();