import {
    getStyle
} from '@/utils/common.js'
/*
 * 防止滚动穿透
 */
export default class ScrollLock {
    constructor(root = document.querySelector('html')){
        this.scrollTop = 0;
        this.scrollStyle = null;
        this.root = root;
    }

    lock() {
        try {
            this.scrollStyle = getStyle(this.root, 'overflow');
            this.scrollTop = this.root.scrollTop;
            this.root.style.overflow = 'hidden';
        } catch (e) {
            console.error(e)
        }
    }
    
    unlock() {
        try {
            this.root.style.overflow = this.scrollStyle;
            this.root.scrollTop = this.scrollTop;
        } catch (e) {
            console.error(e)
        }
    }
}
    

