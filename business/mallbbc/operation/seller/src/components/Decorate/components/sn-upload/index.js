import React, { Fragment,Component } from 'react';
import { Upload, message } from 'antd';
import { sldTsvg, sldSvgIcon, sldBeforeUpload, getLocalStorageStingVal } from '@/utils/utils';
import { apiUrl } from '@/utils/sldconfig.js';
// eslint-disable-next-line no-unused-vars
import global from '@/global.less';
import styles from './index.less';

export default class SnUpload extends Component{
    // 修改数据
    onChange = (value) => {
        this.props.onchange(value)
    }

    /* 上传图片 */
    setImg = (info) => {
        let img_data = info.file.response;
        if (info.file.status === 'done' && info.file.type.indexOf('image') !== -1) {
            if (img_data.state === 200) {
                this.onChange(img_data.data.url)
            } else {
                message.error(img_data.msg);
            }
        }
    }
    
    render(){
        let { label, value, format = '.gif,.jpeg,.png,.jpg,.svg', showDelBtn = true, style } = this.props
        
        return(
            <Fragment>
                { label &&
                    <div className={`${styles.subtitle}`}>{ label }</div>
                }
                <div className={`${styles.upload_img}`} style={style}>
                    {/* 删除按钮 */}
                    { showDelBtn &&
                        <div
                            className={`${global.flex_com_column_flex_end}`}
                            onClick={() => this.onChange('')}
                        >
                            {sldTsvg('qingchu', '#666', 16, 16)}
                        </div>
                    }
                    <Upload
                        withCredentials
                        beforeUpload={sldBeforeUpload}
                        accept={format}
                        showUploadList={false}
                        name="file"
                        action={`${apiUrl}v3/oss/common/upload?source=adminDeco`}
                        onChange={(info) => this.setImg(info)}
                        headers={{
                            Authorization: `Bearer ${ getLocalStorageStingVal('sld_token')}`
                        }}
                    >
                        <div className={`${global.flex_column_center_center}`}>
                            { value
                                ?<img src={value} style={{width:60,height:60}} />
                                :sldSvgIcon('#FC701E',40,40,'ziyuan110')
                            }
                            <span className={styles.upload_btn}>选择图片</span>
                            <span className={styles.modal_tip_color}>支持 { format }</span>
                        </div>
                    </Upload>
                </div>
            </Fragment>
        )
    }
}