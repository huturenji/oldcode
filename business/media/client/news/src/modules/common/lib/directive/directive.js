import extendUtils from 'common/lib/extend';
export default {
    /**
     * 获取图片路径。如果路径存在，则填充
     * @param {*} el 
     * @param {*} binding 
     */
    
    realImg: async function (el, binding) {
        let imgURL = binding.value;//获取图片地址
        // imgURL = await (()=>import('themes/default/img/empty_shoppingcar.png'))()
        if (imgURL) {
            let exist = await extendUtils.imageIsExist(imgURL);
            if (exist) {
                el.setAttribute('src', imgURL);
                // eslint-disable-next-line no-unused-expressions
                !el.classList.contains('full') && el.classList.add('full');
            }
        }
    },

    defaultPage(){
        
    }
}