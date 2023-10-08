import React,{ Component } from 'react';
import global from '@/global.less';

export default class Scrollloader extends Component {
    render() {
        let con = null;
        
        con = 
            <div style={{height: 150,position: 'relative'}}>
                <div className={`${global.flex_com_column_center_center}`} style={{'position': 'absolute','height': 80, 'width': '60%', 'top': 10, 'left': '20%', 'backgroundColor': '#ccc'}}>商品图片滚动区域</div>
                <div className={`${global.flex_com_column_center_center}`} style={{'position': 'absolute','height': 40, 'width': 100, 'bottom': 10, 'left': '50%', 'transform': 'translateX(-50%)', 'backgroundColor': '#ccc'}}>开始按钮</div>
            </div>
        return con;
    }
}