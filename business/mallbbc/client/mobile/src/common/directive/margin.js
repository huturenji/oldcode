// 设置装修组件的内外边距
function setMargin(el, binding){
    try {
        if (binding.value?.props?.isShowStyle) {
            let data = binding.value.styles[0];
            let width = document.querySelector('uni-page-body').clientWidth
            // // margin
            // el.style.marginTop=el.style.marginTop?el.style.marginTop:(!!(data?.margin[0])?Number(data.margin[0]*width/375)+'px':'0');
            el.style.marginTop = Number(data.margin[0] * width / 375) + 'px'
            el.style.marginBottom=el.style.marginBottom?el.style.marginBottom:(!!(data?.margin[2])?Number(data.margin[2]*width/375)+'px':'0');
            el.style.marginLeft=el.style.marginLeft?el.style.marginLeft:(!!(data?.margin[3])?Number(data.margin[3]*width/375)+'px':'0');
            el.style.marginRight=el.style.marginRight?el.style.marginRight:(!!(data?.margin[1])?Number(data.margin[1]*width/375)+'px':'0');

            // //padding
            el.style.paddingTop=el.style.paddingTop?el.style.paddingTop:(!!(data?.padding[0])?Number(data.padding[0]*width/375)+'px':'0');
            el.style.paddingBottom=el.style.paddingBottom?el.style.paddingBottom:(!!(data?.padding[2])?Number(data.padding[2]*width/375)+'px':'0');
            el.style.paddingLeft=el.style.paddingLeft?el.style.paddingLeft:(!!(data?.padding[3])?Number(data.padding[3]*width/375)+'px':'0');
            el.style.paddingRight=el.style.paddingRight?el.style.paddingRight:(!!(data?.padding[1])?Number(data.padding[1]*width/375)+'px':'0');
        } else {
            el.style.marginTop = 0
            el.style.marginBottom = 0
            el.style.marginLeft = 0
            el.style.marginRight = 0

            el.style.paddingTop = 0
            el.style.paddingBottom = 0
            el.style.paddingLeft = 0
            el.style.paddingRight = 0
        }

    } catch (e){
        console.warn(e)
    }
}


export default {
    name: 'margin',
    directive: {
        inserted(el, binding){
            setMargin(el, binding);
        },
        update(el, binding){
            setMargin(el, binding);
        }
    }
}