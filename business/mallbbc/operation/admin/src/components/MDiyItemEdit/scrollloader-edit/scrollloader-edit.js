/* eslint-disable no-restricted-globals */
import React, { Component, Fragment } from 'react';
import { Form, Radio, Upload, message } from 'antd';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { sldTsvg, sldSvgIcon, sldBeforeUpload, getLocalStorageStingVal } from '@/utils/utils';
import { apiUrl } from '@/utils/sldconfig.js';
import global from '@/global.less';
import styles from '../index.less';
import BackgroundEdit from './style-edit.js';
import ALibbSvg from '@/components/ALibbSvg';
import SldSelMoreLeftRightGoods from '@/components/SldSelMoreLeftRightGoodsSku';

const FormItem = Form.Item;

export default class ScrollloaderEdit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sele_more_goods : {
                info: [],//选择的商品数组
                ids: []//选择的商品id数
            },
            modalVisibleGoods: false
        };
    }

    /* 上传图片 */
    setImg = (info, keys, key) => {
        let img_data = info.file.response;
        if (info.file.status === 'done') {
            if (img_data.state === 200) {
                this.onChange(keys, key, img_data.data.url)
            } else {
                message.error(img_data.msg);
            }
        }
    }

    // 删除单个商品
    delGoods = (sku) => {
        const { data } = this.props;
        let newData = { ...data };

        newData.data[0].ids = newData.data[0].ids.filter(item => item != sku);
        newData.data[0].info = newData.data[0].info.filter(item => item.sku != sku);

        this.props.handleCurSelData(newData);
    };

    //选择商品事件
    selMoreGoods = (data) => {
        this.setState({
            modalVisibleGoods: true,
            sele_more_goods: {
                info: data.data[0].info,
                ids: data.data[0].ids,
                max_num: 30,
                sle_more_title: '选择商品(最多选择30个)'
            }
        })
    };

    //商品多选-回调事件
    seleGoods = (selectedRows, selectedRowKeys) => {
        let { data } = this.props;
        data.data[0].ids = JSON.parse(JSON.stringify(selectedRowKeys));
        data.data[0].info = JSON.parse(JSON.stringify(selectedRows));

        this.props.handleCurSelData(data);
        this.sldHandleCancle();
    };

    //关闭模态框事件
    sldHandleCancle = () => {
        this.setState({
            modalVisibleGoods: false,
            sele_more_goods: {
                info: [],
                ids: []
            }
        });
    };

    // 拖拽结束事件
    onDragEndTuijian = result => {
        let { data } = this.props;
        const { source, destination } = result;
        if (!destination) {
            return;
        }
        if (source.droppableId === destination.droppableId) {
            let sourceIndex = source.index;
            let destinationIndex = destination.index;
            if (sourceIndex == destinationIndex) {
                return;
            }
            let item = JSON.parse(JSON.stringify(data.data[0]));


            //更新ids
            let [draggedItemId] = item.ids.splice(sourceIndex, 1);
            item.ids.splice(destinationIndex, 0, draggedItemId);

            //更新info
            let [draggedItemInfo] = item.info.splice(sourceIndex, 1);
            item.info.splice(destinationIndex, 0, draggedItemInfo);

            data.data[0] = item;

            this.props.handleCurSelData(data);
        }
    }

    // 修改数据
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

    render() {
        let { data } = this.props
        let { sele_more_goods, modalVisibleGoods } = this.state
        //轮播
        let con = <Fragment>
            <div>
                <div className={`${styles.topSearchtitle}`}>是否设置组件属性（背景和间距）</div>
                <FormItem
                    key="show_style"
                    label=""
                >
                    <Radio.Group value={data.props.isShowStyle} onChange={(e) => this.onChange(['props'],'isShowStyle',e.target.value)}>
                        <Radio value>是</Radio>
                        <Radio value={false}>否</Radio>
                    </Radio.Group>,
                </FormItem>
            </div>
            { data.props.isShowStyle && 
                <div>
                    <BackgroundEdit data={data} disabled handleCurSelData={this.props.handleCurSelData} />
                </div>
            }
            <div className={`${styles.common_img_part} ${global.flex_com_column_center_start}`}>
                <div className={`${styles.upload_img} ${global.flex_column_center_start}`}>
                    <div>开始抽奖按钮图片</div>
                    <div
                        className={`${global.flex_com_column_flex_end}`}
                        onClick={() => this.onChange(['props'], 'btnImg', '', 'del')}
                    >
                        {sldTsvg('qingchu', '#666', 16, 16)}
                    </div>
                    <Upload
                        withCredentials
                        beforeUpload={sldBeforeUpload}
                        accept=".gif, .jpeg, .png,.jpg,"
                        showUploadList={false}
                        name="file"
                        action={`${apiUrl}v3/oss/common/upload?source=adminDeco`}
                        onChange={(info) => this.setImg(info, ['props'], 'btnImg')}
                        headers={{
                            Authorization: `Bearer ${ getLocalStorageStingVal('sld_token')}`
                        }}
                    >
                        <div className={`${global.flex_column_center_center}`}>
                            { data.props.btnImg
                                ?<img src={data.props.btnImg} style={{width:60,height:60}} />
                                :sldSvgIcon('#FC701E',40,40,'ziyuan110')
                            }
                            <span className={styles.upload_btn}>选择图片</span>
                        </div>
                    </Upload>
                </div>
            </div>
            
            {/* 手动上传商品轮播 */}
            <div className={`${styles.sub_part}`} style={{ borderBottomWidth: 0 }}>
                <div className={`${styles.subtitle}`}>选择商品(最多选择30个商品, 商品图片建议尺寸220*102)</div>
                <FormItem
                    key="tjsp_goods"
                    label=""
                >
                    <div className={`${styles.selected_svideo} ${global.flex_column_start_start}`} style={{width:360}}>
                        <div className={`${styles.add_svideo_wrap} ${global.flex_row_start_center}`}>
                            <span className={`${styles.required}`}>*</span>
                            <span className={`${styles.title}`}>商品添加:</span>
                            <a
                                href="javascript:void(0)"
                                className={`${styles.add_svideo_btn}`}
                                onClick={() => this.selMoreGoods(data)}
                            >+ 添加</a>
                        </div>

                        { data.data && data.data[0].info.length > 0 &&
                            <Fragment>
                                <div className={`${styles.selected_svideo_list_title}`}>
                                    <span style={{ width: 50 }}>序号</span>
                                    <span style={{ width: 176 }}>商品信息</span>
                                    <span style={{ width: 80 }}>价格</span>
                                    <span style={{ width: 50 }}>操作</span>
                                </div>

                                <DragDropContext onDragEnd={this.onDragEndTuijian}>
                                    <Droppable droppableId="droppableTuijian" type="tuijianGoods">
                                        {/* eslint-disable-next-line no-unused-vars */}
                                        {(provided, snapshot) => (
                                            <div
                                                className={`${styles.selected_svideo_list}`}
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                            >
                                                { data.data[0].info.map((svideo_item, svideo_index) => (
                                                    <Draggable
                                                        key={svideo_item.sku}
                                                        draggableId={svideo_item.sku}
                                                        index={svideo_index}
                                                    >
                                                        {/* eslint-disable-next-line no-shadow,no-unused-vars */}
                                                        {(provided, snapshot) => (
                                                            <div
                                                                className={`${styles.selected_svideo_item} ${global.flex_row_start_center}`}
                                                                ref={provided.innerRef}
                                                                {...provided.draggableProps}
                                                                {...provided.dragHandleProps}
                                                            >
                                                                <span style={{ width: 50 }}>{svideo_index + 1}</span>
                                                                <div className={`${styles.svideo_info} ${global.flex_row_start_center}`}>
                                                                    <div className={`${styles.left} ${global.flex_row_center_center}`}>
                                                                        
                                                                        <Upload
                                                                            style={{ width: '100%', display: 'inline-block' }}
                                                                            withCredentials
                                                                            beforeUpload={sldBeforeUpload}
                                                                            accept=".gif, .jpeg, .png,.jpg,"
                                                                            showUploadList={false}
                                                                            name="file"
                                                                            action={`${apiUrl}v3/oss/common/upload?source=adminDeco`}
                                                                            // eslint-disable-next-line no-undef
                                                                            onChange={(info) => this.setImg(info, ['data', 0, 'info', svideo_index], 'uploadImage')}
                                                                            headers={{
                                                                                Authorization: `Bearer ${getLocalStorageStingVal('sld_token')}`
                                                                            }}
                                                                        >
                                                                            <img style={{ width: '50px', height: '50px' }} src={!!svideo_item.uploadImage ? svideo_item.uploadImage : svideo_item.mainImage} />
                                                                        </Upload> :
                                                                    </div>
                                                                    <div className={`${styles.right} ${global.flex_column_start_start}`}>
                                                                        <span className={styles.video_name}>{svideo_item.skuName}</span>
                                                                    </div>
                                                                </div>
                                                                <span style={{ width: 80 }}>{svideo_item.showPrice || svideo_item.salePrice * 1}</span>
                                                                <div
                                                                    onClick={() => this.delGoods(svideo_item.sku)}
                                                                    className={`${styles.operate} ${global.flex_row_center_center}`}
                                                                >
                                                                    <ALibbSvg fill="#2d2d2d" width={18} height={18} type="shanchu5" />
                                                                </div>
                                                            </div>
                                                        )}
                                                    </Draggable>
                                                ))}
                                                {provided.placeholder}
                                            </div>
                                        )}
                                    </Droppable>
                                </DragDropContext>
                            </Fragment>
                        }
                    </div>
                </FormItem>
            </div>
            {/*商品多选的modal框-start onlyPartInfo选择商品时只需要部分信息*/}
            <SldSelMoreLeftRightGoods
                selectedRows={sele_more_goods.info}
                selectedRowKeys={sele_more_goods.ids}
                modalVisible={modalVisibleGoods}
                width={1000}
                onlyPartInfo
                height={document.body.clientHeight - 400}
                filterUnion={false}
                sldHandleSeleMoreModalCancle={this.sldHandleCancle}
                seleSvideo={this.seleGoods}
                title='选择商品(最多选择30个)'
                extra={sele_more_goods}
            />
            {/*商品多选的modal框-end*/}
        </Fragment>
        return con
    }
}