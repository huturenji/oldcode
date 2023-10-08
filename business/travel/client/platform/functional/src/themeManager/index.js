class ThemeManager {
    constructor(themePath) {
        this.state = {
            themePath: themePath,//webpack打包时定义的地址
            currentLink: null
        }
    }

    remove(el){
        return el && el.parentNode.removeChild(el)
    }

    /**
     * 加载主题
     * TODO platform中的颜色，使用changeCssVariable函数修改。颜色可放在对应主题文件夹的json文件中配置
     * @param {*} themeName 主题名
     */
    load(themeName) {
        // this.changeCssVariable(themeJson);//TODO 
        const linkId = themeName+'-style';
        if (!!document.querySelector('link#'+linkId)){
            return;
        }
        //加载主题样式文件
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = `${this.state.themePath}/${themeName}.css`;
        link.dataset.theme = themeName;
        link.id = linkId;
        document.head.appendChild(link);
        document.body.id = themeName;//为样式覆盖增加权重
        //加载完成后移除上一个主题
        link.onload = () => {
            this.removeTheme();
            this.state.currentLink = link;
        }
    }

    removeTheme(){
        const { currentLink } = this.state;
        this.remove(currentLink);
    }

    resetTheme(){
        this.removeTheme();
        this.state.currentLink = null;
    }

    /**
     * 替换css变量
     * @param {*} obj 
     */
    changeCssVariable(obj){
        if (!obj || Object.prototype.toString.call(obj) !== '[object Object]'){
            throw '参数不能为空且必须是对象';
        }

        Object.keys(obj).forEach(key=>{
            if (!key.startsWith('--')){
                key = '--' + key;
            }
            document.body.style.setProperty(key, obj[key]);
        })
    }
}

export default ThemeManager;