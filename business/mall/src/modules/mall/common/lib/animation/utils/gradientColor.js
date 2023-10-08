/**
 * 获取两个颜色的过渡颜色区间
 */
export default class GradientColor {
    /**
     * @param startColor 起始颜色，可以#000，也可以是rgb或者rgba
     * @param endColor 同上
     * @step 渐变的份数。值越大，渐变就越精细
     */
    constructor(startColor, endColor, step) {
        var startRGB = this.colorRgb(startColor);//转换为rgb数组模式
        var startR = parseInt(startRGB[0]);
        var startG = parseInt(startRGB[1]);
        var startB = parseInt(startRGB[2]);
        var startOp = startRGB.length > 3 ? parseFloat(startRGB[3]) : 1;
        var endRGB = this.colorRgb(endColor);
        var endR = parseInt(endRGB[0]);
        var endG = parseInt(endRGB[1]);
        var endB = parseInt(endRGB[2]);
        var endOp = endRGB.length > 3 ? parseFloat(endRGB[3]) : 1;
        var sR = (endR - startR) / step;//总差值
        var sG = (endG - startG) / step;
        var sB = (endB - startB) / step;
        var sOp = (endOp - startOp) / step;
        var colorArr = [];
        for (var i = 1; i <= step; i++) {
            //计算每一步的hex值 
            var hex = this.colorHex('rgba('
                + parseInt(sR * i + startR) + ','//必须用整数，否则某些浏览器识别不了
                + parseInt(sG * i + startG) + ','
                + parseInt(sB * i + startB) + ','
                + parseFloat((sOp * i + startOp)) + ')');
            colorArr.push(hex);
        }
        return colorArr;
    }

    /**
     * 将hex表示方式转换为rgb表示方式(这里返回rgb数组模式)
     */
    colorRgb(sColor) {
        //如果传进来的就是rgb或rgba格式，直接切割成数组返回
        if (sColor.startsWith('rgb')) {
            let color = sColor.substring(sColor.indexOf('(') + 1, sColor.indexOf(')'))
            return color.replace(/\s/g, '').split(',');
        }
        var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
        var sColor = sColor.toLowerCase();
        if (sColor && reg.test(sColor)) {
            if (sColor.length === 4) {
                var sColorNew = "#";
                for (var i = 1; i < 4; i += 1) {
                    sColorNew += sColor.slice(i, i + 1).concat(sColor.slice(i, i + 1));
                }
                sColor = sColorNew;
            }
            //处理六位的颜色值
            var sColorChange = [];
            for (var i = 1; i < 7; i += 2) {
                sColorChange.push(parseInt("0x" + sColor.slice(i, i + 2)));
            }
            return sColorChange;
        } else {
            return sColor;
        }
    }
    /**
     * 将rgb表示方式转换为hex表示方式
     */
    colorHex(rgb) {
        var _this = rgb;
        var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
        if (/^(rgb|RGB)/.test(_this)) {
            var aColor = _this.replace(/(?:(|)|rgb|RGB)*/g, "").split(",");
            var strHex = "#";
            for (var i = 0; i < aColor.length; i++) {
                var hex = Number(aColor[i]).toString(16);
                hex = hex < 10 ? 0 + '' + hex : hex;// 保证每个rgb的值为2位
                if (hex === "0") {
                    hex += hex;
                }
                strHex += hex;
            }
            if (strHex.length !== 7) {
                strHex = _this;
            }
            return strHex;
        } else if (reg.test(_this)) {
            var aNum = _this.replace(/#/, "").split("");
            if (aNum.length === 6) {
                return _this;
            } else if (aNum.length === 3) {
                var numHex = "#";
                for (var i = 0; i < aNum.length; i += 1) {
                    numHex += (aNum[i] + aNum[i]);
                }
                return numHex;
            }
        } else {
            return _this;
        }
    }
}