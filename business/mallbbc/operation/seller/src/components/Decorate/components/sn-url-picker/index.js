/*
* SnUrlPicker 选择框
* 
* */
import { connect } from 'dva/index';
import React, { Component } from 'react';
import {
    Select,Input,InputNumber
} from 'antd';
import {
    deepCopy, failTip,sldTsvg
} from '@/utils/utils';

import SldSelGoodsSingleDiy from '@/components/SldSelGoodsSingleDiy';
import SldSelMoreLeftRightGoods from '@/components/SldSelMoreLeftRightGoodsSku';
import types from './type';
import styles from './index.less';

const Option = Select.Option;
const { TextArea } = Input;

@connect(({ mdecorate,decorate }) => ({
    mdecorate,
    decorate
}))

export default class SnUrlPicker extends Component {
    // 根据选择的类型映射默认参数 
    typeMapParams = types

      // 选择商品
      sele_more_goods = {
          info: [],//选择的商品item
          ids: [], //选择商品的sku
          max_num:10,
          min_num: 2
      };

      constructor(props) {
	    super(props);
	    this.state = {
              storeData:[], //店铺列表 后续建议由父组件传入
              selectedRows:[],    
              selectedRowKeys:[],
              link_type:'', //多用途弹窗
              sle_more_title:'', // 商品选择的title
              modalVisibleGoods:false, // 商品选择弹窗
              onlyOneStore:false //搜索商品是否只能搜索京东企业购
	    };
      }

      componentDidMount() {
          // todo
      }

      // 类型选择事件
      typeSelect = (type)=>{
          const { value,onchange } = this.props
          const params = this.typeMapParams[type] || {url :'', url_type : '', info : ''}
          params.url_type = type
          if(type == 'store'){
              this.get_store_list()
          }
          if(type == 'confirm_order'){
              // 图片组合批量下单
              this.setState({ 
                  modalVisibleGoods: true,
                  onlyOneStore:true
              });
          }else{
              this.setState({ link_type: type });
          }
          onchange(Object.assign(value,params))
      }

    onChange = (val, keyName)=>{
        const { value,onchange } = this.props
        let params = {...value}
        params[keyName] = val
        if(keyName=='storeId'&&params.url_type=='store'){
            const { storeData } = this.state
            const store = storeData.find((el) => el.storeId == val)
            params.supplierTypes = store.supplierTypes
        }
        onchange(params)
    }

    onChangeNumber = (val,keyName,index)=>{
        const { value,onchange } = this.props
        let params = {...value}
        if(keyName=='number' && params.url_type=='confirm_order'){
            params.info.products[index]['number'] = val
        }
        // 更新数据
        this.sele_more_goods.info = deepCopy(params.info.products);
        onchange(params)
    }

    //图片组合添加批量下单删除商品
    delSldComImg = (sku)=>{
        const { value,onchange } = this.props
        let params = {...value}  
        params.info.ids = params.info.ids.filter(item => item != sku);
        params.info.products = params.info.products.filter(item => item.sku != sku);
        // 更新数据
        this.sele_more_goods.ids = [...params.info.ids];
        this.sele_more_goods.info = deepCopy(params.info.products);
        onchange(params)
    }

    showCompent = (type,data)=>{
        let domElement = null
        const {storeData} = this.state
        if (type == '') {
            domElement = null;
        } 
        else if (type == 'url') {
            domElement = 
            <div>
                <Input
                    className={styles.more_link_input}
                    defaultValue={data.url}
                    placeholder="请输入链接地址"
                    onChange={(e) => this.onChange(e.target.value, 'url')}
                />
                <div style={{width:"100%"}}>
                    <div>请输入免责协议</div>
                    <TextArea
                        style={{ width: 232,height:100 }}
                        defaultValue={data.agreement}
                        placeholder="请输入免责协议"
                        onChange={(e) => this.onChange(e.target.value, 'agreement')}
                    />
                </div>
            </div>;
  
        } 
        else if (type == 'third_url') {
            domElement = 
            <div>
                <Input
                    className={styles.more_link_input}
                    defaultValue={data.url}
                    placeholder="请输入链接地址"
                    onChange={(e) => this.onChange(e.target.value, 'url')}
                />
                <div style={{width:232}}>
                    <div>请输入免责协议</div>
                    <TextArea
                        style={{ width: 232, height:100 }}
                        defaultValue={data.agreement}
                        placeholder="请输入免责协议"
                        onChange={(e) => this.onChange(e.target.value, 'agreement')}
                    />
                </div>
            </div>
        } 
        else if (type == 'applet_url') {
            domElement = 
            <div>
                <Input
                    className={styles.more_link_input}
                    defaultValue={data.url}
                    placeholder="请输入链接地址"
                    onChange={(e) => this.onChange(e.target.value, 'url')}
                />
                <Input
                    className={styles.more_link_input}
                    defaultValue={data.appletId}
                    placeholder="请输入小应用id"
                    onChange={(e) => this.onChange(e.target.value, 'appletId')}
                />
                <div>
                    <div>请输入免责协议</div>
                    <TextArea
                        style={{ width: 232,height:100 }}
                        defaultValue={data.agreement}
                        placeholder="请输入免责协议"
                        onChange={(e) => this.onChange(e.target.value, 'agreement')}
                    />
                </div>
            </div>
          
        } 
        else if (type == 'openBbcPage_url') {
            domElement = 
            <div>
                <Input
                    className={styles.more_link_input}
                    defaultValue={data.url}
                    placeholder="请输入链接地址"
                    onChange={(e) => this.onChange(e.target.value, 'url')}
                />
                <div>
                    <div>请输入免责协议</div>
                    <TextArea
                        style={{ width: 232,height:100 }}
                        defaultValue={data.agreement}
                        placeholder="请输入免责协议"
                        onChange={(e) => this.onChange(e.target.value, 'agreement')}
                    />
                </div>
            </div>
    
        } 
        else if (type == 'store') {
            domElement =
          <Select
              defaultValue={(data.storeId?data.storeId:'')}
              style={{ width: 232 }}
              placeholder="请选择数据来源"
              onSelect={(e)=>this.onChange(e, 'storeId')}
              getPopupContainer={triggerNode => triggerNode.parentNode}
          >
              {storeData.length>0&&storeData.map((item, index1) =>
                  <Option key={index1} value={item.storeId}>{item.storeName}</Option>,
              )}
          </Select>
        }
        else if (type == 'keyword') {
            domElement =
          <Input
              maxLength={15}
              className={styles.more_link_input}
              defaultValue={data.url}
              placeholder="请输入关键词"
              onChange={(e) => this.onChange(e.target.value, 'url')} 
          />;
        }
        else if (type == 'confirm_order') {
            let { info } = data
            if(!(Object.prototype.toString.call(info) === '[object Object]')){
                info = {products:[]}
            }
            domElement = 
            <div>
                {
                    info.products.map((item,index)=>(
                        <div style={{border:'#999 solid 1px',marginBottom:5,position:'relative',padding:5}} key={index}>
                            {
                                info.products.length>2&&
                                <div
                                    className={`${global.flex_com_column_flex_end} ${styles.del_image_combination_item}`}
                                    onClick={() => this.delSldComImg(item.sku)}
                                >
                                    {sldTsvg('qingchu', '#666', 16, 16)}
                                </div>
                            }
                            <div style={{display:'flex',padding:5,alignItems:'center'}}>
                                <img src={item.mainImage} style={{width:50,height:50,marginRight:5}} />
                                <div style={{width:195}}>{item.skuName}</div>
                            </div>
                            <div>
                                购买数量（1-10件）：
                                <InputNumber 
                                    min={1} 
                                    max={10}
                                    style={{ width: 100 }}
                                    step={1} 
                                    value={item.number}
                                    onChange={(value) => {
                                        if (!value) {
                                            failTip('请输入正确的购买数量1-10件')
                                            return;
                                        }
                                        value = parseFloat(value)
                                        // eslint-disable-next-line no-restricted-globals
                                        if (isNaN(value) || value < 1 || value > 10) {
                                            if(value<1){
                                                value = 1
                                            }else if (value > 10){
                                                value = 10
                                            }
                                            failTip('请输入正确的购买数量1-10件')
                                            return;
                                        }
                                        this.onChangeNumber(value, 'number',index)
                                    }}
                                />
                            </div>
                        </div>
                    ))
                }
            </div>
        } 
        else if (type == 'goods') {
            domElement = 
            <Input
                className={styles.more_link_input}
                value={data.info.skuName}
                disabled
                title={data.info.skuName}
            />;
        } 
        else if (type == 'category') {
            domElement =
          <Input
              className={styles.more_link_input}
              value={data.info.categoryName}
              disabled
              title={data.info.categoryName} 
          />;
        } 
        else if (type == 'topic') {
            domElement = 
            <Input
                className={styles.more_link_input}
                value={data.info.name!=undefined?`${data.info.name}（${data.info.decoId}）`:''}
                disabled 
            />;
        } 
        else if (type == 'seckill') {
            domElement = 
            <Input
                className={styles.more_link_input}
                value={data.info.promotionName}
                disabled 
            />;
        } 
        else if (type == 'buyeveryday') {
            domElement = 
            <Input
                className={styles.more_link_input}
                value={data.info.promotionName}
                disabled 
            />;
        } 
        else if (type == 'buytogether') {
            domElement = 
            <Input
                className={styles.more_link_input}
                value={data.info.promotionName}
                disabled 
            />;
        } 
        else if (type == 'voucher') {
            domElement = 
            <Input
                className={styles.more_link_input}
                value={data.info.red_title}
                disabled 
            />;
        } 
        else if (type == 'live') {
            domElement =
             <Input
                 className={styles.more_link_input}
                 value={data.info.live_name}
                 disabled
             />;
        } 
        else if (type == 'svideo') {
            domElement = 
            <Input
                className={styles.more_link_input}
                value={data.info.videoName}
                disabled 
            />;
        }
        else if (type == 'signin') {
            domElement = 
            <Input
                className={styles.more_link_input}
                value={data.info.signActivityName}
                disabled 
            />;
        } 
        return domElement
    }

    get_store_list = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'decorate/get_store_info',
            payload: {},
            callback: (res) => {
                if (res.state == 200) {
                    let storeData = [res.data]
                    storeData.forEach(item=>{
                        item.key = res.data.storeId
                        item.value = res.data.storeName
                    })
                    this.setState({
                        storeData
                    });
                } 
            }
        });
    };
    
    // 关闭多用途模态框
    sldHandleLinkCancle = () => {
        this.setState({ link_type: '' });
    };
    
    // 关闭商品选择模态框
    sldHandleCancle = ()=>{
        this.setState({ modalVisibleGoods: false });
    }

    seleSku = (val) => {
        const { value,onchange } = this.props
        let params = {...value}
        if (params.url_type == 'goods') {
            params.url = val.goodsId;
            params.info = val;
        } else if (params.url_type == 'category') {
            params.url = val.categoryId;
            params.info = val;
        } else if (params.url_type == 'topic') {
            params.url = val.id;
            params.info = val;
        } else if (params.url_type == 'seckill') {
            params.url = val.seckillId;
            params.info = val;
        } else if (params.url_type == 'buyeveryday') {
            params.url = val.promotionId;
            params.info = val;
        } else if (params.url_type == 'buytogether' && val[0]) {
            params.url = val[0].buyTogetherId;//此处为单选框
            params.info = val[0];
        } else if (params.url_type == 'voucher') {
            params.url = val.couponId;
            params.info = val;
        } else if (params.url_type == 'live') {
            params.url = val.liveId;
            params.info = val;
        } else if (params.url_type == 'svideo') {
            params.url = val.videoId;
            params.info = val;
        } else if (params.url_type == 'signin' && val[0]) {
            params.url = val[0].signActivityId;
            params.info = val[0];
        }
        onchange(params)

        this.sldHandleLinkCancle()
    };

    confirm = (selectedRows, selectedRowKeys) =>{
        const { value,onchange } = this.props
        let params = {...value}
        if(params.url_type == 'confirm_order'){
            selectedRows.forEach((item)=>{
                item.number = '1'
            })
        }
        this.sele_more_goods.ids = [...selectedRowKeys];
        this.sele_more_goods.info = deepCopy(selectedRows);
        params.info = {
            ids:[...selectedRowKeys],
            products:deepCopy(selectedRows)
        }
        onchange(params)
        this.sldHandleCancle()
    }

    render() {
        const { value, options = [], style = {} } = this.props
        const {selectedRowKeys,selectedRows,link_type,modalVisibleGoods,onlyOneStore,sle_more_title} = this.state
        return (     
            <div style={style}>
                <Select
                    value={value.url_type}
                    style={{ width: 180 }}
                    placeholder="请选择链接类型"
                    onSelect={(type) => {this.typeSelect(type)}}
                    getPopupContainer={triggerNode => triggerNode.parentNode}
                >
                    {options.map((item, index) =>
                        <Option key={index} value={item.key}>{item.name}</Option>,
                    )}
                </Select>
                {this.showCompent(value.url_type,value)}
                {/* 秒杀分类商品选择 */}
                <SldSelGoodsSingleDiy
                    link_type={link_type}
                    seleSku={this.seleSku}
                    sldHandleCancle={this.sldHandleLinkCancle}
                    client="mobile"
                    selectedRowKeys={selectedRowKeys}
                    selectedRows={selectedRows}
                />
                {/* 批量下单等商品选择 */}
                <SldSelMoreLeftRightGoods
                    selectedRows={this.sele_more_goods.info}
                    selectedRowKeys={this.sele_more_goods.ids}
                    modalVisible={modalVisibleGoods}
                    onlyOneStore={onlyOneStore}
                    width={1000}
                    height={document.body.clientHeight - 400}
                    sldHandleSeleMoreModalCancle={this.sldHandleCancle}
                    seleSvideo={this.confirm}
                    title={sle_more_title}
                    extra={this.sele_more_goods}
                />
            </div>
        );
    }
}
