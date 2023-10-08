import React, { Component, Fragment } from 'react';
import { SketchPicker } from 'react-color';
import { 
    Form,
    Upload,
    Radio,
    Input
} from 'antd';
import {
    sldBeforeUpload,
    sldSvgIcon,
    getLocalStorageStingVal,
    sldTsvg,
    failTip
} from '@/utils/utils';
import { apiUrl } from '@/utils/sldconfig.js';
import global from '@/global.less';
import styles from '../index.less';

const FormItem = Form.Item;


export default class BackgroundEdit extends Component{
    constructor(props) {
        super(props);
        this.state = {
            showColorPicker0:false,
            showColorPicker1:false
        };
    }

    //是否显示取色器
    showColorPicker = (type, flag,index) => {
        this.setState({
            [type+index]: flag
        });
    };

    addBackground = (data)=>{
        if(this.props.ifOnlyShowSingleBackgroundSetting && this.props.data.background.length === 1){
            failTip('只允许设置单个背景配置');
            return;
        }
        data.styles.push({
            padding:['','','',''],
            margin:['','','',''],
            background:{
                color:'',//背景颜色
                img:'',//背景图
                opacity:'100',//背景透明度
                scroll:true,//固定模式
                left:0,
                top:0,
                bgHeight:'100%'
            }
        });
        this.props.handleCurSelData(data);
    }

    // 对象修改数据
    onChange = (keys, key, val, type) => {
        let { data } = this.props
        let targetData = keys.reduce((pre, cur) => pre[cur], data)

        if (type === 'del') {
            delete targetData[key]
        } else {
            targetData[key] = val
        }
        this.props.handleCurSelData(data);
    }

    /*
    * 上传图片
    * tar_index标示多个图片的时候图片下标（（用于轮播/导航/图片组合）
    * */
    setImg = (info,tar_index) => {
        const { data } = this.props;
        let img_data = info.file.response;
        if (info.file.status === 'done') {
            data.styles[tar_index].background.img = img_data.data.url;
        }
        this.props.handleCurSelData(data);
    };

    delImg = (tar_index)=>{
        let { data } = this.props;
        data.styles[tar_index].background.img = '';
        this.props.handleCurSelData(data);
    }

    delBackground = (tar_index) => {
        let { data } = this.props;
        let newData = data.styles.filter((item, index) => index != tar_index);
        data.nav_current = 0;
        data.styles = newData;
        this.props.handleCurSelData(data);
    }

    render(){
        let {data,disabled,ifOnlyShowSingleBackgroundSetting} = this.props
        return(
            <Fragment>
                <div className={`${styles.warp}`}>
                    {
                        !ifOnlyShowSingleBackgroundSetting && <div className={`${styles.subtitle}`} style={{color:"red"}}>最多增加两个设置。第一个是页面初始状态，另一个是页面滑动后的状态</div>
                    }
                    <FormItem
                        key="background_data"
                        label=""
                    >   
                        {data.styles.length > 0 && data.styles.map((item, index) => (
                            <div className={`${global.flex_com_column_start_center} ${styles.sld_com_img}`} style={{padding:"0 10px",width:360}} key={index}>
                                <div style={{color:"red"}}>背景会优先取图片,其次取取色器颜色</div>
                                <div style={{position:'relative',width:60}}>
                                    <Upload
                                        withCredentials
                                        beforeUpload={sldBeforeUpload}
                                        accept=".gif, .jpeg, .png,.jpg,"
                                        showUploadList={false}
                                        name="file"
                                        action={`${apiUrl}v3/oss/common/upload?source=adminDeco`}
                                        onChange={(info) => this.setImg(info, index)}
                                        headers={{
                                            Authorization: `Bearer ${ getLocalStorageStingVal('sld_token')}`
                                        }}
                                    >
                                        <div className={`${global.flex_column_center_center}`}>
                                            {item.background.img
                                                ?<img src={item.background.img} style={{width:40,height:40}} />
                                                :sldSvgIcon('#FC701E',40,40,'ziyuan110')
                                            }
                                            <span className={styles.upload_btn}>选择图片</span>
                                        </div>
                                    </Upload>
                                    <div
                                        className={`${global.flex_com_column_flex_end} ${styles.del_sld_com_img}`}
                                        onClick={() => this.delImg(index)}
                                    >
                                        {sldTsvg('qingchu', '#666', 16, 16)}
                                    </div>
                                </div>
                                
                                <FormItem
                                    key="search_bg_color"
                                    label=""
                                >
                                    <div className={styles.fzx_color_show}>
                                        <div className={styles.show_color} onClick={() => this.showColorPicker('showColorPicker', true,index)}>
                                            <span style={{ backgroundColor: item.background.color }} />
                                        </div>
                                        <a href="javascript:void(0)" onClick={() => this.onChange(['styles',index,'background'], 'color','')}>默认</a>
                                    </div>
                                    {/* 不能将控制取色器的键值传入装修数据中，通过在state中定义两个状态值来区分，为临时方案，后续优化 */}
                                    {this.state[`showColorPicker${index}`] && (
                                        <div className={styles.color_picker_wrap}>
                                            <div
                                                className={styles.color_picker_mask}
                                                onClick={() => this.showColorPicker('showColorPicker', false,index)}
                                            />
                                            <SketchPicker
                                                color={item.background.color}
                                                onChangeComplete={(e) => this.onChange(['styles',index,'background'], 'color',`rgba(${e.rgb.r},${e.rgb.g},${e.rgb.b},${e.rgb.a})`)}
                                            />
                                        </div>
                                    )}
                                </FormItem>
                                
                                <div><label>请输入背景透明度（0-100）
                                    <Input
                                        className={styles.title}
                                        onChange={(e) => this.onChange(['styles',index,'background'], 'opacity',e.target.value)}
                                        value={item.background['opacity']}
                                    />
                                </label></div>
                                {!disabled&&<div><label>背景是否随页面滚动而滚动
                                    <Radio.Group value={item.background['scroll']} onChange={(e) => this.onChange(['styles',index,'background'], 'scroll',e.target.value)}>
                                        <Radio value>是</Radio>
                                        <Radio value={false}>否</Radio>
                                    </Radio.Group>
                                </label></div>}
                                
                                {data.styles.length > 1 &&<div
                                    className={`${global.flex_com_column_flex_end} ${styles.del_sld_com_img}`}
                                    onClick={() => this.delBackground(index)}
                                >
                                    {sldTsvg('qingchu', '#666', 16, 16)}
                                </div>}
                                {index<1&&disabled&&<div>
                                    <div className={`${styles.topSearchtitle}`}>内边距(上右下左)</div>
                                    {item.padding.length>0&&item.padding.map((paddingItem,paddingIndex)=>(
                                        <Input
                                            maxLength={200}
                                            style={{ width: 75 }}
                                            value={paddingItem}
                                            onChange={(e) => this.onChange(['styles',index,'padding'],paddingIndex ,e.target.value)}
                                        />
                                    ))}
                                    <div className={`${styles.topSearchtitle}`}>外边距(上右下左)</div>
                                    {item.margin.length>0&&item.margin.map((marginItem,marginIndex)=>(
                                        <Input
                                            maxLength={200}
                                            style={{ width: 75 }}
                                            value={marginItem}
                                            onChange={(e) => this.onChange(['styles',index,'margin'],marginIndex ,e.target.value)}
                                        />
                                    ))}
                                </div>}
                            </div>
                        ))}
                      
                        {data.styles.length < 2 &&<div
                            className={`${styles.add_goods_wrap} ${global.flex_row_center_center}`}
                            onClick={() => this.addBackground(data)}
                        >
                            + 添加配置
                        </div>}
                    </FormItem>
                </div>
      
      
            </Fragment>
        )
    }   
        
    
}
BackgroundEdit.defaultProps = {
    ifOnlyShowSingleBackgroundSetting:false // 是否仅仅展示单个背景设置
}