import { connect } from 'dva/index';
import React, { Component, Fragment } from 'react';
import { Form, Spin, Switch,Upload,Icon } from 'antd';
import {
    sldIconBtn,
    failTip,
    sucTip,
    sldLlineRtextAddGoodsAddMargin,
    dragSldTableColumn,
    sldHandlePaginationData,
    formItemLayoutModal,
    isEmptyObject,
    validatorNumbe,
    sldComLanguage,
    sldtbaleOpeBtnText,
    sldBeforeUpload,
    getSldCopyData,
    getLocalStorageStingVal,
    list_com_page_more,
    getAuthBtn,
    hasAuth
} from '@/utils/utils';
import global from '@/global.less';
import styles from './css/product.less'
import { apiUrl } from '@/utils/sldconfig.js';
import StandardTable from '@/components/StandardTable';
import SldModal from '@/components/SldModal/SldModal';
import SldPreviewImg from '@/components/SldPreviewImg/SldPreviewImg';
import SldDiyMoreImgModal from '@/components/SldDiyMoreImgModal/SldDiyMoreImgModal';
import CommonSeleMore from '@/components/SldSelMore';
import AuthBtn from '@/components/AuthBtn';


let btnAuth = getAuthBtn();
let pageSize = list_com_page_more;
const uploadButton = (
    <div>
        <Icon type="plus" />
        <div className="ant-upload-text">{sldComLanguage('上传图片')}</div>
    </div>
);
@connect(({ category }) => ({
    category
}))
@Form.create()
export default class CateLists extends Component {
    modal_tip = [
        `${sldComLanguage('最多上传3张图片,每张图片不可以超过1M')}`,
        `${sldComLanguage('请严格根据提示要求上传规定尺寸的广告图片')}`,
        `${sldComLanguage('编辑项中的“操作”指点击该内容所产生的链接地址，可通过下拉选项选择不同的方式')}`
    ];

    sele_type_id = '';

    //添加分类选中的商品类型id
    cur_edit_id = '';
  
    //当前操作数据id
    cur_selectedRows = [];
  
    cur_selectedRowKeys = [];
  
    good_bind_data = [{
        type: 'tag_show_btn_sel',
        label: `${sldComLanguage('绑定品牌')}`,//绑定品牌
        name: 'brandIds',
        btn_text: `${sldComLanguage('选择品牌')}`,//选择品牌
        btn_icon: 'jia',
        sel_data: [],//选择的数据
        sel_data_keys: [],//选择的数据id
        initialValue: '',
        main_key: 'brandId',
        main_name: 'brandName',
        showBtn:1, //显示按钮和item删除  1 显示 2 隐藏
        btn_callback: () => this.showAllUnit('search_brand_more', 'brandIds'),
        del_tag_callback: (id, name, main_key) => this.del_sel_tag(id, name, main_key)
  
    }, {
        type: 'tag_show_btn_sel',
        label: `${sldComLanguage('绑定属性')}`,
        name: 'attrIds',
        btn_text: `${sldComLanguage('选择属性')}`,//选择属性
        btn_icon: 'jia',
        sel_data: [],//选择的数据
        sel_data_keys: [],//选择的数据id
        initialValue: '',
        main_key: 'attributeId',
        main_name: 'attributeName',
        showBtn:1, //按钮和item删除
        btn_callback: () => this.showAllUnit('search_attr_more', 'attrIds'),
        del_tag_callback: (id, name, main_key) => this.del_sel_tag(id, name, main_key)
    },
    {
        type: 'inputnum',
        label: `${sldComLanguage('分佣比例')}`,//分佣比例
        name: 'scaling',
        extra: `${sldComLanguage('请输入0~1的数字,最多3位小数')}`,//请输入0~1的数字,最多3位小数
        placeholder: ``,
        initialValue: '',
        min: 0,
        max: 1,
        precision: 3,
        rules: [{
            required: true,
            message: `${sldComLanguage('请输入分佣比例')}`//请输入分佣比例
        }]
    }, 
    {
        type: 'tag_show_btn_sel',
        label: `${sldComLanguage('映射分类')}`,
        name: 'mappingCategory',
        btn_text: `${sldComLanguage('选择VOP分类')}`,//选择属性
        btn_icon: 'jia',
        sel_data: [],//选择的数据
        sel_data_keys: [],//选择的数据id
        initialValue: '',
        main_key: 'categoryId',
        main_name: 'categoryName',
        showBtn:2, //隐藏按钮和item删除
        btn_callback: () => this.showAllUnit('search_tree_vop', 'mappingCategory'),
        del_tag_callback: (id, name, main_key) => this.del_sel_tag(id, name, main_key)
    }];
  
    cat_data = {
        type: 'TreeSelectDIy',
        label: `${sldComLanguage('上级分类')}`,//上级分类
        name: 'pid',
        placeholder: `${sldComLanguage('请选择')}${sldComLanguage('上级分类')}`,//请选择上级分类
        initialValue: '',
        help: `${sldComLanguage('默认为最顶级')}`,//默认为最顶级
        disabled: false,
        data: [],
        sele_key: 'categoryId',
        sele_name: 'categoryName',
        allowClear: true,
        onSelect: (value, node, extra) => this.sldHandleSelCat(value, node, extra)
    };

    constructor(props) {
        super(props);
        this.state = {
            expandedRowKeys: [],//展开的行
            show_table_modal_add: false,//是否显示input后缀搜索modal上的新增按钮，默认不显示
            modalSldAddVisible: false,//是否显示input后缀add的modal框，默认不显示
            tablesldSAddTitle: `${sldComLanguage('添加')}`,//input后缀add的modal框的标题   添加
            search_add_modal_width: 500,//input后缀add的modal框的宽度
            cur_type: '',//show_list表示表格搜索，add表示添加数据
            cur_operate_type: '',//当前操作对象
            search_modal_width: 600,//默认搜索，modal宽度
            show_preview_modal: false,//预览图片modal框是否展示
            preview_img: '',//预览图片
            preview_alt_con: '',//预览图片内容
            tableTitle: '',
            data: {},
            formValues: {},
            modalTableVisible: false,//选择商品类型弹框
            submiting: false,//按钮loading
            loading: false,//按钮loading
            selectedRows: [],
            selectedRowKeys: [],//selectedRows的key
            disableSelectRowKeys: [],//禁止选择key数组
            modalVisible: false,
            title: `${sldComLanguage('新增')}${sldComLanguage('商品分类')}`,//新增商品分类
            type: 'add',//'add'新增  'edit'编辑
            params: {},//搜索条件
            curData: {},//编辑的数据
            modalVisibleAdv: false,//多图选择器是否显示，默认不显示
            cur_data: {},//多图选择器的数据
            origion_data: {
                width: 520,
                height: 210,
                admin_show_width: 260,
                admin_show_height: 105,
                data: [{
                    imgPath: '',
                    imgUrl: '',
                    info: {},
                    link_type: '',
                    link_value: '',
                    title: ''
                }, {
                    imgPath: '',
                    imgUrl: '',
                    info: {},
                    link_type: '',
                    link_value: '',
                    title: ''
                }, {
                    imgPath: '',
                    imgUrl: '',
                    info: {},
                    link_type: '',
                    link_value: '',
                    title: ''
                }]
            },//多图选择器的数据
            modalTitle: `${sldComLanguage('设置分类广告')}`,//多图选择器标题
            addData: [{
                type: 'input',
                label: `${sldComLanguage('分类名称')}`,//分类名称
                name: 'categoryName',
                extra:`${sldComLanguage('最多输入6个字')}`,
                placeholder: `${sldComLanguage('请输入')}${sldComLanguage('分类名称')}`,//请输入分类名称
                initialValue: '',
                maxLength:6,
                rules: [{
                    required: true,
                    whitespace: true,
                    message: `${sldComLanguage('请输入')}${sldComLanguage('分类名称')}`//请输入分类名称
                }]
            }, 
            {
                type: 'input',
                label: `显示名称`,
                name: 'categoryShowName',
                extra:`${sldComLanguage('会员端显示名称，最多输入6个字')}`,
                placeholder: `${sldComLanguage('请输入')}${sldComLanguage('显示名称')}`,
                initialValue: '',
                maxLength:6,
                rules: [{
                    required: false,
                    whitespace: true,
                    message: `${sldComLanguage('请输入')}${sldComLanguage('显示名称')}`
                }]
            },
            {
                type: 'inputnum',
                label: `${sldComLanguage('排序')}`,//排序
                name: 'sort',
                extra: `${sldComLanguage('请输入0~255的数字,值越小,显示越靠前')}`,
                placeholder: `${sldComLanguage('请输入')}${sldComLanguage('排序')}`,//请输入排序
                initialValue: '',
                rules: [{
                    required: true,
                    message: `${sldComLanguage('请输入')}${sldComLanguage('排序')}`//请输入排序
                }, { validator: (rule, value, callback) => validatorNumbe(rule, value, callback) }]
            } ],//modal框的数据
            sele_cat_info: {},//添加/编辑的时候选择的分类信息
            columns: [
                {
                    title: `${sldComLanguage('分类名称')}`,//分类名称
                    align: 'left',
                    dataIndex: 'categoryName',
                    width: 200
                },
                {
                    title: `${sldComLanguage('排序')}`,
                    dataIndex: 'sort',
                    align: 'center',
                    width: 100
                },
                {
                    title: `${sldComLanguage('在售/全部商品')}`,
                    dataIndex: 'onSaleGoodsNum',
                    align: 'center',
                    width: 120,
                    render: (text, record) => <div>{text}/{record.totalGoodsNum}</div>
                },
                {
                    title: `${sldComLanguage('二级分类图片')}`,//二级分类图片
                    dataIndex: 'categoryImage',
                    align: 'center',
                    width: 100,
                    render: (text, record) => {
                        let tmp_file_list = [];
                        if(record.fileList==undefined){
                            if(record.categoryImage){
                                let tmp_data = {};
                                tmp_data.uid = record.categoryId;
                                tmp_data.name = record.categoryImage;
                                tmp_data.status = 'done';
                                tmp_data.url = record.categoryImage;
                                tmp_file_list.push(tmp_data);
                            }
                        }else{
                            tmp_file_list = record.fileList;
                            if(tmp_file_list.length>0&&record.categoryImage){
                                tmp_file_list[0].url = record.categoryImage;
                            }
                        }
                        return record.grade == 2
                            ?<div className={`${global.flex_column_center_center} ${styles.mcat_upload_wrap}`}><Upload
                                withCredentials
                                beforeUpload={sldBeforeUpload}
                                accept=".gif, .jpeg, .png,.jpg,"
                                name="file"
                                action={`${apiUrl}v3/oss/common/upload?source=adminDeco`}
                                listType="picture-card"
                                fileList={tmp_file_list}
                                disabled={!hasAuth('set_cate_img')}
                                onPreview={(info) => this.uploadImgPre(info)}
                                onChange={(info) => this.uploadImg(info,record)}
                                headers={{
                                    Authorization: `Bearer ${ getLocalStorageStingVal('sld_token')}`
                                }}
                            >
                                {tmp_file_list.length >= 1 ? null : uploadButton}
                            </Upload>
                            <span>{sldComLanguage('建议上传160*160的图片(.gif .jpeg .png .jpg)')}</span>
                            </div>
                            :'--'
                    }
                },
                {
                    title: `${sldComLanguage('三级分类图片')}`,//三级分类图片
                    dataIndex: 'categoryImage',
                    align: 'center',
                    width: 100,
                    render: (text, record) => {
                        let tmp_file_list = [];
                        if(record.fileList==undefined){
                            if(record.categoryImage){
                                let tmp_data = {};
                                tmp_data.uid = record.categoryId;
                                tmp_data.name = record.categoryImage;
                                tmp_data.status = 'done';
                                tmp_data.url = record.categoryImage;
                                tmp_file_list.push(tmp_data);
                            }
                        }else{
                            tmp_file_list = record.fileList;
                            if(tmp_file_list.length>0&&record.categoryImage){
                                tmp_file_list[0].url = record.categoryImage;
                            }
                        }
                        return record.grade == 3
                            ?<div className={`${global.flex_column_center_center} ${styles.mcat_upload_wrap}`}><Upload
                                withCredentials
                                beforeUpload={sldBeforeUpload}
                                accept=".gif, .jpeg, .png,.jpg,"
                                name="file"
                                action={`${apiUrl}v3/oss/common/upload?source=adminDeco`}
                                listType="picture-card"
                                fileList={tmp_file_list}
                                disabled={!hasAuth('set_cate_img')}
                                onPreview={(info) => this.uploadImgPre(info)}
                                onChange={(info) => this.uploadImg(info,record)}
                                headers={{
                                    Authorization: `Bearer ${ getLocalStorageStingVal('sld_token')}`
                                }}
                            >
                                {tmp_file_list.length >= 1 ? null : uploadButton}
                            </Upload>
                            <span>{sldComLanguage('建议上传160*160的图片(.gif .jpeg .png .jpg)')}</span>
                            </div>
                            :'--'
                    }
                },
                {
                    title: `${sldComLanguage('分佣比例')}`,//分佣比例
                    align: 'center',
                    dataIndex: 'scaling',
                    width: 100,
                    render: (text, record) => <div>  {record.scaling!=0?record.scaling:'--'} </div>
                },
                {
                    title: `${sldComLanguage('是否启用')}`,
                    align: 'center',
                    width: 100,
                    render: (text, record) => <div><Switch disabled={!hasAuth('switch_cate')} checked={!!record.state} onChange={(checked)=>{this.isEnable(record,checked)}} /></div>
                },
                {
                    title: '是否显示', //是否显示
                    align: 'center',
                    width: 100,
                    render: (text, record) => <div><Switch disabled={!hasAuth('show_cate')} checked={record.show} onChange={(checked)=>{this.isShow(record,checked)}} /></div>
                },
                {
                    title: `${sldComLanguage('操作')}`,//操作
                    align: 'center',
                    width: 100,
                    render: (text, record) => (
                        <Fragment>
                            <AuthBtn eventKey={['edit_cate']} btnAuth={btnAuth}>
                                {sldtbaleOpeBtnText(`${sldComLanguage('编辑')}`, () => this.editCat(record))}{/*编辑*/}
                            </AuthBtn>
                            |<AuthBtn eventKey={['set_cate_adv']} btnAuth={btnAuth}>
                                {record.grade == 1
                                    ?sldtbaleOpeBtnText(`设置分类广告`, () => this.addCatAdv(record))
                                    :'--'
                                }
                            </AuthBtn>
                            {/* {record.grade <= 2 &&
                                <Fragment>
                                    <span className={global.splitLine} />
                                    {sldtbaleOpeBtnText(`${sldComLanguage('添加下级分类')}`, () => this.addNextCat(record))}
                                </Fragment>
                            } */}

                            {/* {(record.children == undefined||(record.children != undefined&&(record.children==null||record.children.length==0))) &&
                                <Fragment>
                                    <span className={global.splitLine} />
                                    {sldPopConfirmDiy('leftBottom', `${sldComLanguage('删除后不可恢复，是否确定删除')}`, () => this.operateCat(record.categoryId, 'del'), `${sldComLanguage('确定')}`, `${sldComLanguage('取消')}`,
                                        sldtbaleOpeBtnText(`${sldComLanguage('删除')}`, () => null))}
                                </Fragment>
                            } */}
                        </Fragment>
                    )
                }
            ]
        };
    }

    componentDidMount() {
        this.get_list({ categoryId: 0 });//grade为1表示获取一级数据
        // this.get_tree_list(0,2);
    }

    componentWillUnmount() {

    }

    //获取分类树数据 showdata为 是否隐藏刷新列表的参数
    // get_tree_list = (pid = 0, grade = 1,showdata=false) => {
    //   if(showdata){this.setState({ loading: true })}
    //   const { dispatch } = this.props;
    //   let { data } = this.state;
    //   dispatch({
    //     type: 'category/get_cate_tree_list',
    //     payload: {pId:pid,grade:grade},
    //     callback: (res) => {
    //       if(showdata){
    //         data.list = res.data.list
    //         this.setState({
    //           data: data,
    //           loading:false
    //         });
    //       }
    //       this.cat_data.data = res.data.list
    //     },
    //   });
    // };

  //获取数据列表
  get_list = (params, grade = '') => {
      this.setState({ loading: true });
      const { dispatch } = this.props;
      let { data, expandedRowKeys } = this.state;
      dispatch({
          type: 'category/get_cate_list_by_id',
          payload: {...params,pageSize:pageSize,pageIndex:1},
          callback: (res) => {
              this.setState({ loading: false });
              //一级和二级分类，统一加上children字段，否则无法显示多级菜单伸缩功能
              if(res.data.list && res.data.list.length && res.data.list[0].grade != '3'){
                  res.data.list.forEach(item=>{
                      item.children=[];
                  })
              }
              //grade为1直接赋值
              if (grade != '') {
                  for (let i = 0; i < data.list.length; i++) {
                      if (grade == 1) {
                          if (data.list[i].categoryId == params.categoryId) {
                              data.list[i].children = res.data.list;
                              break;
                          }
                      } else {
                          if (data.list[i].children != undefined) {
                              for (let j = 0; j < data.list[i].children.length; j++) {
                                  if (data.list[i].children[j].categoryId == params.categoryId) {
                                      data.list[i].children[j].children = res.data.list;
                                      break;
                                  }
                              }
                          }
                      }
                  }
              } else {
                  data.list = res.data.list;
              }
              this.setState({
                  data: data,
                  expandedRowKeys: grade == '' ? [] : expandedRowKeys
              });
              //从get_tree_list 迁移过来。
              this.cat_data.data = res.data.list
          }
      });
  };

  //上传图片
  uploadImg = (info,record) => {
      let { data } = this.state;
      let cur_data = [];
      if(record.grade == 2){
          let tmp_data = data.list.filter(item=>item.categoryId == record.pid);
          cur_data = tmp_data[0].children.filter(item=>item.categoryId == record.categoryId);
      }else if(record.grade == 3){
          cur_data = [record];
      }else{
          for(let i in data.list){
              if(data.list[i].children.length > 0){
                  let tmp_data = data.list[i].children.filter(item=>item.categoryId == record.pid);
                  cur_data = tmp_data[0].children.filter(item=>item.categoryId == record.categoryId);
              }
          }
      }
      cur_data[0].fileList = info.fileList;
      if (info.file.status != undefined) {
          console.log(record);
          if(info.file.status == 'done'){
              cur_data[0].categoryImageUrl = info.file.response.data.url;
              cur_data[0].fileList[0].url = cur_data[0].categoryImageUrl;
              //调用上传保存接口
              let edit_data = {};
              edit_data.categoryId = record.categoryId;
              edit_data.sort = record.sort;
              edit_data.categoryName = record.categoryName;
              if(record.grade == 3){
                  let bindBrandIds = [];
                  record.goodsBrandList && record.goodsBrandList.forEach(item=>{
                      bindBrandIds.push(item.brandId);
                  });
                  let bindAttributeIds = []
                  record.goodsAttributeList && record.goodsAttributeList.forEach(item=>{
                      bindAttributeIds.push(item.attributeId);
                  });
                  edit_data.bindAttributeIds = bindAttributeIds;
                  edit_data.bindBrandIds = bindBrandIds;
                  edit_data.mappingCategoryId = record.mappingCategoryId;
                  edit_data.mappingCategoryName = record.mappingCategoryName;
              }
              edit_data.scaling = record.scaling;
              edit_data.storeId = 0;
              edit_data.categoryImage = info.file.response.data.url;
              this.operateCat(edit_data,'edit');
          }else if(info.file.status == 'removed'){
              cur_data[0].categoryImageUrl = '';
              //调用上传保存接口
              let edit_data = {};
              edit_data.sort = record.sort;
              edit_data.categoryName = record.categoryName;
              edit_data.scaling = record.scaling;
              edit_data.storeId = 0;
              edit_data.categoryId = record.categoryId;
              if(record.grade == 3){
                  let bindBrandIds = [];
                  record.goodsBrandList && record.goodsBrandList.forEach(item=>{
                      bindBrandIds.push(item.brandId);
                  });
                  let bindAttributeIds = []
                  record.goodsAttributeList && record.goodsAttributeList.forEach(item=>{
                      bindAttributeIds.push(item.attributeId);
                  });
                  edit_data.bindAttributeIds = bindAttributeIds;
                  edit_data.bindBrandIds = bindBrandIds;
                  edit_data.mappingCategoryId = record.mappingCategoryId;
                  edit_data.mappingCategoryName = record.mappingCategoryName;
              }
              edit_data.categoryImage = '';
              this.operateCat(edit_data,'edit');
          }
      }
      data = JSON.parse(JSON.stringify(data));
      this.setState({data})
  };

    //预览图片
    uploadImgPre = (info) => {
        this.viewImg(true, info.url || info.thumbUrl);
    }; 

    //预览图片/关闭预览图片
    viewImg = (flag, img = '', text = '') => {
        this.setState({
            preview_img: img,
            preview_alt_con: text,
            show_preview_modal: flag
        });
    };

    //设置分类广告
  addCatAdv = (val) => {
      let { modalTitle, cur_data, origion_data } = this.state;
      cur_data = { ...origion_data, data: getSldCopyData(origion_data.data) };
      if (val.mobileImage) {
          modalTitle = `${sldComLanguage('编辑分类广告')}`;
          let adv_data = JSON.parse(val.mobileImage);
          for (let i = 0; i < cur_data.data.length; i++) {
              if (adv_data[i].imgUrl) {
                  cur_data.data[i] = adv_data[i];
              }
          }
      } else {
          modalTitle = `${sldComLanguage('设置分类广告')}`;
      }
      this.setState({
          modalVisibleAdv: true,
          modalTitle,
          cur_data: cur_data,
          curData: val
      });
  };

  //显示modal弹框_弹框专属
  showAllUnit = (val, name) => {
      let { tableTitle, search_modal_width,addData,disableSelectRowKeys } = this.state;
      if (val == 'search_brand_more') {
          tableTitle = `${sldComLanguage('请选择')}${sldComLanguage('关联品牌')}`;//请选择关联品牌
          search_modal_width = 800;
      } else if (val == 'search_attr_more') {
          tableTitle = `${sldComLanguage('请选择')}${sldComLanguage('关联属性')}`;//请选择关联属性
          search_modal_width = 800;
      } else if (val == 'search_tree_vop') {
          tableTitle = `${sldComLanguage('请选择')}${sldComLanguage('要映射的VOP分类(单选)')}`;//请选择关联属性
          search_modal_width = 800;
      }
    
      for (let i = 0; i < addData.length; i++) {
          if (addData[i].name == name) {
              this.cur_selectedRows = addData[i].sel_data;
              this.cur_selectedRowKeys = addData[i].sel_data_keys;
              disableSelectRowKeys = JSON.parse(JSON.stringify(addData[i].sel_data_keys));
              break;
          }
      }
      this.setState({
          modalTableVisible: true,
          cur_operate_type: val,
          cur_type: 'show_list',
          tableTitle: tableTitle,
          search_modal_width: search_modal_width,
          disableSelectRowKeys
      });
  };

  del_sel_tag = (id, name, main_key) => {
      let { addData } = this.state;
      for (let i = 0; i < addData.length; i++) {
          if (addData[i].name == name) {
              addData[i].sel_data = addData[i].sel_data.filter(item => (item[main_key] != id));
              addData[i].sel_data_keys = addData[i].sel_data_keys.filter(item => item != id);
              this.cur_selectedRows = addData[i].sel_data;
              this.cur_selectedRowKeys = addData[i].sel_data_keys;
              break;
          }
      }
      this.setState({ addData });
  };

  //选择分类事件
  sldHandleSelCat = (value, node) => {
      let { addData } = this.state;
      let tmp_info = node.props.extra;
      addData = addData.filter(item => item.name != 'brandIds' && item.name != 'attrIds' && item.name != 'scaling' );
      if (tmp_info.grade > 1) {
      //二三级分类可以添加类型 设置佣金
          for (let i = 0; i < addData.length; i++) {
              if (addData[i].name == 'pid') {
                  addData.splice(i + 1, 0, ...this.good_bind_data);
                  // addData.splice(i + 1, 0, this.good_bind_data[0]);
                  // addData.splice(i + 2, 0, this.good_bind_data[1]);
                  // addData.splice(i + 3, 0, this.good_bind_data[2]);
              }
          }
      }
      this.setState({
          sele_cat_info: tmp_info,
          addData
      });
  };

  handleSelectRows = (rows, rowkeys) => {
      this.setState({
          selectedRows: rows,
          selectedRowKeys: rowkeys
      });
  };

  handleTablePagination = (pagination, filtersArg, sorter, type = 'main') => {
      if (type == 'main') {
          const { formValues } = this.state;
          const params = sldHandlePaginationData(pagination, filtersArg, sorter, formValues);
          pageSize = params.pageSize;
          this.setState({
              params: params
          });
          this.get_list(params);
      }
  };

  //初始化分类
  initCat = ()=>{
      const { dispatch } = this.props;
      dispatch({
          type: 'category/init_category_tree',
          payload: {},
          callback: (res) => {
              if (res.state == 200) {
                  sucTip(res.msg || "初始化成功");
                  this.get_list({ categoryId: 0 });
              } else {
                  failTip(res.msg);
              }
          }
      });
  };

  //新增功能
  addCat = () => {
      let { addData } = this.state;
      addData = addData.filter(item => item.name != 'pid' && item.name != 'brandIds' && item.name != 'attrIds' && item.name != 'scaling' && item.name != 'mappingCategory' );
      for (let i = 0; i < addData.length; i++) {
          if (addData[i].name == 'categoryName') {
              addData.splice(i + 1, 0, this.cat_data);
              addData[i].initialValue = '';
          } else {
              addData[i].initialValue = '';
          }
      }
      this.sele_type_id = '';
      this.cur_selectedRows = [];
      this.cur_selectedRowKeys = [];
      this.setState({
          modalVisible: true,
          type: 'add',
          title: `${sldComLanguage('新增')}${sldComLanguage('商品分类')}`,
          addData,
          sele_cat_info: {}
      });//添加商品分类
  };

  //添加下级功能
  addNextCat = (val) => {
      let { addData } = this.state;
      addData = addData.filter(item => item.name != 'pid' && item.name != 'brandIds' && item.name != 'attrIds' && item.name != 'scaling' && item.name != 'mappingCategory');
      this.cur_selectedRows = [];
      this.cur_selectedRowKeys = [];
      //清空之前选择的数据
      this.good_bind_data.forEach((item,index)=>{
          if(this.good_bind_data[index].name == 'brandIds'||this.good_bind_data[index].name == 'attrIds' || this.good_bind_data[index].name == 'mappingCategory'){
              this.good_bind_data[index].sel_data = [];
              this.good_bind_data[index].sel_data_keys = [];
          }
      });
      for (let i = 0; i < addData.length; i++) {
          if (addData[i].name == 'categoryName') {
              addData.splice(i + 1, 0, this.cat_data);
              if (val.grade == 2) {
                  // addData.splice(i + 2, 0, this.good_bind_data[0]);
                  // addData.splice(i + 3, 0, this.good_bind_data[1]);
                  // addData.splice(i + 4, 0, this.good_bind_data[2]);
                  // addData.splice(i + 4, 0, this.good_bind_data[3]);
                  addData.splice(i + 1, 0, ...this.good_bind_data);
              }
              addData[i].initialValue = '';
          } else {
              if (addData[i].name == 'pid') {
                  addData[i].initialValue = val.categoryName;
                  addData[i].disabled = true;
              } else {
                  addData[i].initialValue = '';
              }
          }
      }
      this.sele_type_id = '';
      this.setState({
          modalVisible: true,
          type: 'add',
          title: `${sldComLanguage('添加')}${sldComLanguage('下级分类')}`,
          addData,
          sele_cat_info: val
      });//添加下级分类
  };

  //编辑商品分类
  editCat = (val) => {
      let { addData } = this.state;
      addData = addData.filter(item => item.name != 'pid' && item.name != 'brandIds' && item.name != 'attrIds' && item.name != 'scaling'&& item.name != 'mappingCategory');
      for (let i = 0; i < addData.length; i++) {
          if (addData[i].name == 'categoryName') {
              addData[i].initialValue = val[addData[i].name];
              if (val.grade == 3) {
                  addData.splice(i + 2, 0, ...this.good_bind_data); //只处理了编辑 新增之前屏蔽了，若放开新增也要在正确的位置插入i+2
              }
          } else {
              if(addData[i].name == 'brandIds'){
                  addData[i].sel_data = val.goodsBrandList || [];
                  addData[i].sel_data_keys = [];
                  val.goodsBrandList && val.goodsBrandList.forEach(item=>{
                      addData[i].sel_data_keys.push(item.brandId);
                  });
              }else if(addData[i].name == 'attrIds'){
                  addData[i].sel_data = val.goodsAttributeList || [];
                  addData[i].sel_data_keys = [];
                  val.goodsAttributeList && val.goodsAttributeList.forEach(item=>{
                      addData[i].sel_data_keys.push(item.attributeId);
                  });
              }else if(addData[i].name == 'mappingCategory'){
                  addData[i].sel_data = [{categoryId:val.mappingCategoryId,categoryName:val.mappingCategoryName}];//这里只有ID，没有name等数据
                  addData[i].sel_data_keys = [val.mappingCategoryId];
              }else{
                  addData[i].initialValue = val[addData[i].name];
              }
          }
      }
      this.sele_type_id = '';
      this.setState({
          type: 'edit',
          title: `${sldComLanguage('编辑')}${sldComLanguage('商品分类')}`,//编辑商品分类
          addData: addData,
          modalVisible: true,
          curData: val,
          sele_cat_info: { grade: val.grade }
      });
  };

  //分类操作事件 type add:添加 edit:编辑 del:删除
  operateCat = (id, type) => {
      let params = {};
      const { dispatch } = this.props;
      let dis_type = '';
      if (type == 'add') {
          dis_type = 'category/add_goods_cat';
          params = id;
      } else if (type == 'edit') {
          dis_type = 'category/edit_goods_cat';
          params = id;
      } else if (type == 'del') {
          dis_type = 'category/del_goods_cat';
          params.categoryId = id;
      }
      this.setState({ submiting: true });
      dispatch({
          type: dis_type,
          payload: params,
          callback: (res) => {
              if (res.state == 200) {
                  sucTip(res.msg);
                  this.get_list({ categoryId: 0 });
                  // this.get_tree_list(0,2);
                  this.setState({
                      modalVisible: false
                  });
              } else {
                  failTip(res.msg);
              }
              this.setState({ submiting: false });
          }
      });
  };

  sldHandleConfirm = (val) => {
      const { curData, type, sele_cat_info, addData } = this.state;
      let sld_params = {};
      sld_params.categoryName = val.categoryName;
      if(val.categoryShowName){
          sld_params.categoryShowName = val.categoryShowName; //会员端显示名称
      }
      sld_params.sort = val.sort;
      for (let i = 0; i < addData.length; i++) {
          if (addData[i].name == 'brandIds') {
              sld_params.bindBrandIds = addData[i].sel_data_keys;
          } else if (addData[i].name == 'attrIds') {
              sld_params.bindAttributeIds = addData[i].sel_data_keys;
          } else if (addData[i].name == 'mappingCategory') {//新增三级分类映射vop分类，bbcg2新增逻辑。
              sld_params.mappingCategoryId = addData[i].sel_data_keys.join(',');
              sld_params.mappingCategoryName = addData[i].sel_data.length && addData[i].sel_data[0].categoryName;
          }
      }
      if(val.scaling){
          sld_params.scaling = val.scaling;//分佣比例
      }
      sld_params.storeId = 0;//店铺id(平台分类此值传0)

      if (type == 'edit') {
          sld_params.categoryId = curData.categoryId;
          sld_params.pid = curData.pid;
          this.operateCat(sld_params, 'edit');
      } else {
          sld_params.pid = isEmptyObject(sele_cat_info) ? 0 : sele_cat_info.categoryId;//父分类id,一级分类==0
          this.operateCat(sld_params, 'add');
      }
  };

  sldHandleCancle = () => {
      this.setState({ modalVisible: false,modalVisibleAdv: false });
  };


  //表格拖动
  resizeTable = (index, size, type, data) => {
      let datas = dragSldTableColumn(index, size, data);
      this.setState({ [type]: datas });
  };

  //列表展示对话框隐藏_弹框专属
  sldHandleTableCancle = () => {
      this.setState({ modalTableVisible: false });
  };

  //inout后缀的新增modal框隐藏
  sldHandleAddCancle = () => {
      this.setState({ modalSldAddVisible: false });
  };

  sldHandleConfirmAdv = (val) => {
      const { curData } = this.state;
      this.operateCat({ categoryId: curData.categoryId, sort : curData.sort,categoryName : curData.categoryName,storeId : 0, mobileImage: JSON.stringify(val) }, 'edit');
  };

  //选中数据的操作_弹框专属
  seleCurData = (selectedRows, selectedRowKeys) => {
      let { cur_operate_type, addData } = this.state;
      if (cur_operate_type == 'search_brand_more') {
          for (let i = 0; i < addData.length; i++) {
              if (addData[i].name == 'brandIds') {
                  addData[i].sel_data = selectedRows;
                  addData[i].sel_data_keys = selectedRowKeys;
                  break;
              }
          }
      } else if (cur_operate_type == 'search_attr_more') {
          for (let i = 0; i < addData.length; i++) {
              if (addData[i].name == 'attrIds') {
                  addData[i].sel_data = selectedRows;
                  addData[i].sel_data_keys = selectedRowKeys;
                  break;
              }
          }
      } else if (cur_operate_type == 'search_tree_vop') {
      // console.log('search_tree_vop',selectedRows,selectedRowKeys)
          for (let i = 0; i < addData.length; i++) {
              if (addData[i].name == 'mappingCategory') {
                  //bbcg2 这里映射VOP三级分类，按照接口文档是单选的。这里强制选择第一条数据
                  addData[i].sel_data = (selectedRows && selectedRows.length) ? [selectedRows[0]] : [];
                  addData[i].sel_data_keys = (selectedRowKeys && selectedRowKeys.length) ? [selectedRowKeys[0]]: [];
                  break;
              }
          }
      }
      this.setState({
          addData
      });
  };

  onExpand = (expanded, record) => {
      let { expandedRowKeys } = this.state;
      if (expanded) {
          expandedRowKeys.push(record.categoryId);
          this.get_list({ categoryId: record.categoryId }, record.grade);
      } else {
          expandedRowKeys = expandedRowKeys.filter(item => item != record.categoryId);
      }
      this.setState({ expandedRowKeys });
  };

  isEnable(record,checked){
      const { dispatch } = this.props;
      dispatch({
          type: 'category/updateState',
          payload: {
              categoryId:record.categoryId,
              state:checked ? 1 : 0
          },
          callback: (res) => {
              if (res.state == 200) {
                  sucTip(res.msg);
                  this.get_list({ categoryId: record.pid }, record.grade > 1 ? record.grade -1 :'');
                  // 更新表格数据 传true 方便表格展开 
                  // this.get_tree_list(0,2,true);
              } else {
                  failTip(res.msg);
              }
          }
      });
  }
  
  isShow(record,checked){
      const { dispatch } = this.props;
      dispatch({
          type: 'category/updateShow',
          payload: {
              categoryId:record.categoryId,
              show:checked 
          },
          callback: (res) => {
              if (res.state == 200) {
                  sucTip(res.msg);
                  this.get_list({ categoryId: record.pid }, record.grade > 1 ? record.grade -1 :'');
              } else {
                  failTip(res.msg);
              }
          }
      });
  }

  render() {
      const { selectedRows, modalVisible,modalTitle,modalVisibleAdv,cur_data, title,preview_img,show_preview_modal,modal_width,preview_alt_con, addData, columns, submiting, data, loading, modalTableVisible, cur_operate_type, tableTitle, cur_type, search_modal_width, show_table_modal_add, modalSldAddVisible, tablesldSAddTitle, search_add_modal_width, expandedRowKeys,disableSelectRowKeys } = this.state;

      return (
          <div className={global.common_page}>
              {sldLlineRtextAddGoodsAddMargin('#FA6F1E', `${sldComLanguage('分类管理')}`, 0, 0, 5)}{/* 分类管理*/}
              <AuthBtn eventKey={['view_cate']} btnAuth={btnAuth} showPage>
                  <Spin spinning={loading}>
                      { /*公共功能条-start*/}
                      <div className={global.operate_bg}>
                          <AuthBtn eventKey={['add_cate']} btnAuth={btnAuth}>
                              {!(data.list && data.list.length) && sldIconBtn(() => this.initCat(), `${sldComLanguage('初始化分类')}`, 7, 0)}{/* 新增*/}
                              {/* {sldIconBtn(() => this.addCat(), `${sldComLanguage('新增')}`, 7, 0)}新增 */}
                          </AuthBtn>
                      </div>
                      { /*公共功能条-end*/}
                      { /*标准表格-start*/}
                      <StandardTable
                          totalHeight={document.body.clientHeight-150-20}
                          expandedRowKeys={expandedRowKeys}
                          selectedRows={selectedRows}
                          data={data}
                          rowKey="categoryId"
                          isCheck={false}
                          columns={columns}
                          onSelectRow={this.handleSelectRows}
                          onChange={(pagination, filtersArg, sorter) => this.handleTablePagination(pagination, filtersArg, sorter, 'main')}
                          sldpagination={false}
                          resizeTable={(index, size) => this.resizeTable(index, size, 'columns', columns)}
                          isColumnResize
                          onExpand={this.onExpand}
                      />
                      { /*标准表格-end*/}
                      {/*图片预览-start*/}
                      <SldPreviewImg
                          img={preview_img}
                          show_preview_modal={show_preview_modal}
                          modal_width={modal_width}
                          preview_alt_con={preview_alt_con}
                          closePreviewModal={() => this.viewImg(false)}
                      />
                      {/*图片预览-end*/}
                      { /*新增/编辑对话框-start*/}
                      <SldModal
                          zIndex={1}
                          width={500}
                          title={title}
                          submiting={submiting}
                          modalVisible={modalVisible}
                          sldHandleConfirm={(val) => this.sldHandleConfirm(val)}
                          sldHandleCancle={this.sldHandleCancle}
                          formItemLayoutModal={formItemLayoutModal}
                          content={addData}
                      />
                      { /*新增/编辑对话框-end*/}

                  </Spin>
              </AuthBtn>
              {/*input后缀弹出框-start*/}
              <CommonSeleMore
                  extraProps={{'disableSelectRowKeys':disableSelectRowKeys,'specilSetCheckBox':true}}
                  selectedRows={JSON.parse(JSON.stringify(this.cur_selectedRows))}
                  selectedRowKeys={JSON.parse(JSON.stringify(this.cur_selectedRowKeys))}
                  modalTableVisible={modalTableVisible}
                  cur_operate_type={cur_operate_type}
                  tableTitle={tableTitle}
                  cur_type={cur_type}
                  search_modal_width={search_modal_width}
                  sldHandleTableCancle={this.sldHandleTableCancle}
                  seleCurData={this.seleCurData}
                  show_table_modal_add={show_table_modal_add}
                  modalSldAddVisible={modalSldAddVisible}
                  tablesldSAddTitle={tablesldSAddTitle}
                  search_add_modal_width={search_add_modal_width}
                  sldHandleAddCancle={this.sldHandleAddCancle}
              />
              {/*input后缀弹出框-end*/}
              <SldDiyMoreImgModal
                  width={1000}
                  title={modalTitle}
                  sldSeleSingleRow
                  submiting={submiting}
                  modalVisible={modalVisibleAdv}
                  sldHandleConfirm={(val) => this.sldHandleConfirmAdv(val)}
                  sldHandleCancle={this.sldHandleCancle}
                  hideTimeLoop
                  content={cur_data}
                  modal_tip={this.modal_tip}
                  client="mobile"
              />
          </div>
      );
  }
}
