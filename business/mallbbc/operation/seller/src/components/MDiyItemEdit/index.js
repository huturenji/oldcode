import React, { Component, Fragment } from 'react';
import {
    Form,
    Select,
    Icon,
    Radio,
    Button,
    Input,
    Slider,
    Upload
} from 'antd';
import global from '@/global.less';
import {
    sldTsvg,
    sldBeforeUpload,
    failTip,
    sldSvgIcon,
    getLocalStorageStingVal
} from '@/utils/utils';
import SldSelGoodsSingleDiy from '@/components/SldSelGoodsSingleDiy';
import {

    m_diy_link_type,
    sld_m_diy_tpzh_style,
    sld_com_empty_arrar_2,
    sld_com_empty_arrar_3,
    sld_com_empty_arrar_4,
    sld_com_empty_arrar_5,
    sld_m_diy_svideo_style,
    sld_m_diy_live_style,
    cart_icon_data,
    sld_m_diy_activity_style,
    sld_m_diy_notice_style
} from '@/utils/util_data';
import { SketchPicker } from 'react-color';
import styles from './index.less';
import { connect } from 'dva';
import { apiUrl } from '@/utils/sldconfig';
import SldSelMoreLeftRight from '@/components/SldSelMoreLeftRight';
import SldSelMoreLeftRightLive from '@/components/SldSelMoreLeftRightLive';
// import SldSelMoreLeftRightGoods from '@/components/SldSelMoreLeftRightGoods';
import SldSelMoreLeftRightGoods from '@/components/SldSelMoreLeftRightGoodsSku';
import SldSelMoreLeftRightActivityGoods from '@/components/SldSelMoreLeftRightActivityGoods';
import SldReactQuill from '@/components/SldReactQuill';
import ALibbSvg from '@/components/ALibbSvg';

const { TextArea } = Input;//antd的文本域初始化方法
const FormItem = Form.Item;
const {Option} = Select;
const formItemLayoutModal = {
    labelCol: {
        span: 2
    },
    wrapperCol: {
        span: 18
    }
};
//设置富文本可以有的内容
const toolbarOptions = [
    ['bold', 'italic', 'underline', 'strike'], // toggled buttons

    [{'header': 1}, {'header': 2}], // custom button values
    [{'list': 'ordered'}, {'list': 'bullet'}],
    [{'script': 'sub'}, {'script': 'super'}], // superscript/subscript
    [{'indent': '-1'}, {'indent': '+1'}], // outdent/indent
    [{'direction': 'rtl'}], // text direction

    [{'size': ['small', false, 'large', 'huge']}], // custom dropdown
    [{'header': [1, 2, 3, 4, 5, 6, false]}],

    [{'color': ['#000','#e60000','#ff9900','#ffff00','#008a00','#0066cc','#9933ff','#fff','#facccc','#ffebcc','#ffffcc','#cce8cc','#cce0f5','#ebd6ff','#bbbbbb','#f06666','#ffc266','#ffff66','#66b966','#66a3e0','#c285ff','#888888','#a10000','#b26b00','#b2b200','#006100','#0047b2','#6b24b2','#444444','#5c0000','#663d00','#666600','#003700','#002966','#3d1466']}, {'background': []}], // dropdown with defaults from theme
    [{'font': []}],
    [{'align': []}],
    ['clean'] // remove formatting button
];

@connect(({ mdecorate, pc_home }) => ({
    mdecorate,
    pc_home
}))
@Form.create()
export default class MDiyItem extends Component {
  state = {
      showColorPicker: false,//是否展示颜色选择器，默认不展示
      showColorPicker2: false,//是否展示颜色选择器，默认不展示
      link_type: '',//链接选择的类型，用于选择商品/分类/专题
      modalSpuShow: false,//是否展示商品多选modal框，默认不显示
      modalVisible: false,//是否展示短视频多选modal框，默认不显示
      modalVisibleLive: false,//是否展示直播多选modal框，默认不显示
      modalVisibleGoods: false,//是否展示商品多选modal框，默认不显示
      modalVisibleActivityGoods: false,//是否展示促销商品多选modal框，默认不显示
      activityType: '',//促销互动类型
      sle_more_title: ''//多选组件title
  };

  sele_more_svideo = {
      info: [],//选择的短视频数组
      ids: [],//选择的短视频id数组
      min_num: 1,//最小数量，0为不限制
      max_num: 30//最多选择30个
  };

  sele_more_live = {
      info: [],//选择的直播数组
      ids: [],//选择的直播id数组
      min_num: 1,//最小数量，0为不限制
      max_num: 30//最多选择30个
  };

  sele_more_goods = {
      info: [],//选择的商品数组
      ids: [],//选择的商品id数组
      min_num: 3,//最小数量，0为不限制
      max_num: 9//最多选择30个
  };

  oprate_more_tab_index = 0;//TAB切换当前操作的数据index

  componentDidMount() {

  }

  componentWillReceiveProps(nextProps) {
      if (nextProps.isReset != undefined && nextProps.isReset) {
          this.props.form.resetFields();
      }
  }

  //是否显示取色器
  showColorPicker = (type, flag) => {
      this.setState({
          [type]: flag
      });
  };

  //slodon_获取富文本返回的内容
  handleGetContent = (val, type) => {
      this.onChange(val, type);
  };

  //图片组合选择样式事件
  handleTuPianZuHeStyle = (val) => {
      let { select_data } = this.props;
      //图片组合里面如果是选择了图片的展现形式,需要重新组装数据
      let tmp_data = [];
      if (val == 0) {
          tmp_data = sld_com_empty_arrar_2;
      } else if (val == 1) {
          tmp_data = sld_com_empty_arrar_2;
      } else if (val == 2) {
          tmp_data = sld_com_empty_arrar_2;
      } else if (val == 3) {
          tmp_data = sld_com_empty_arrar_3;
      } else if (val == 4) {
          tmp_data = sld_com_empty_arrar_3;
      } else if (val == 5) {
          tmp_data = sld_com_empty_arrar_4;
      } else if (val == 6) {
          tmp_data = sld_com_empty_arrar_4;
      } else if (val == 7) {
          tmp_data = sld_com_empty_arrar_5;
      }
      select_data.data = [];
      for (let i=0;i<tmp_data.length;i++) {
          select_data.data.push({
              img: '',
              img_path: '',
              title: '',
              url: '',
              url_type: '',
              info: '',
              width: '100%',
              height: 150
          });
      }
      select_data.sele_style = val;
      this.props.handleCurSelData(select_data);
  };

  //短视频展示风格选择事件
  handleVideoStyle = (val) => {
      let { select_data } = this.props;
      select_data.show_style = val;
      //清空选择的商品
      this.sele_more_svideo.ids = [];
      this.sele_more_svideo.info = [];
      select_data.data.ids = [];
      select_data.data.info = [];
      this.props.handleCurSelData(select_data);
  };

  //公告展示风格选择事件
  handleNoticeStyle = (val) => {
      let { select_data } = this.props;
      select_data.show_style = val;
      this.props.handleCurSelData(select_data);
  };

  //直播展示风格选择事件
  handleLiveStyle = (val) => {
      let { select_data } = this.props;
      select_data.show_style = val;
      //清空选择的商品
      this.sele_more_live.ids = [];
      this.sele_more_live.info = [];
      select_data.data.ids = [];
      select_data.data.info = [];
      this.props.handleCurSelData(select_data);
  };

  //活动组活动类型选择事件
  handleActivityStyle = (val) => {
      let { select_data } = this.props;
      select_data.show_style = val;
      //清空选择的商品
      this.sele_more_goods.ids = [];
      this.sele_more_goods.info = [];
      select_data.data.ids = [];
      select_data.data.info = [];
      select_data.border_radius = 8;
      select_data.bg_color = '#fff';
      select_data.tag_bg_color = '#FF5C00';
      select_data.title = '';
      select_data.sub_title = '';
      this.props.handleCurSelData(select_data);
  };

  /*
  * 输入框内容更改事件
  * val组件传回来的值，
  * type 修改值对应的键名
  * index 多个数据的序号,主要用于轮播/导航/图片组合
  * */
  onChange = (val, type, tar_index = 0,parentIndex,custom) => { //parentIndex 用于父子结构
      let { select_data } = this.props;
      if ((select_data.type == 'lunbo') || (select_data.type == 'nav' && (type != 'icon_set' && type != 'style_set' && type != 'slide')) || select_data.type == 'tupianzuhe' || (select_data.type == 'more_tab' && type != 'border_radius')||(select_data.type == 'top_cat_nav' && type != 'swiper_bg_style')||(select_data.type == 'tablan')||(select_data.type == 'tabzixun')||(select_data.type == 'tabGroup')||(select_data.type == 'zixun')||(select_data.type == 'tuzixun')||(select_data.type == 'zidingyi')||(select_data.type == 'TuPianZuHe')||(select_data.type == 'raffle')||(select_data.type == 'hotSale')||(select_data.type == 'titleSet')||(select_data.type == 'topSearch')) {
          if (select_data.type == 'more_tab') {
              if (type == 'data_type') {
                  //TAB切换数据类型的时候需要清空商品信息
                  this.saveCurSelData([], 'info', tar_index, 'more');
                  this.saveCurSelData([], 'ids', tar_index, 'more');
              }
          }
          if(select_data.type == 'zixun'||select_data.type == 'zixun'&&type=='news_style'){
              let tmp_data = [];
              if (val == 1) {
                  tmp_data = [null];
              } else if (val == 3) {
                  tmp_data = sld_com_empty_arrar_3;
              } 
              select_data.data[tar_index].children = [];
              for (let i=0;i<tmp_data.length;i++) {
                  select_data.data[tar_index].children.push({
                      img: '',
                      img_path: '',
                      title: '',
                      url: '',
                      url_type: '',
                      info: '',
                      width: '100%',
                      height: 150
                  });
              }
              this.props.handleCurSelData(select_data);
          }

          if(select_data.type == 'tabzixun'&&type=='news_style'){
              let tmp_data = [];
              if (val == 1) {
                  tmp_data = [null];
              } else if (val == 3) {
                  tmp_data = sld_com_empty_arrar_3;
              } 
              select_data.data[tar_index].children[parentIndex].children = [];
              for (let i=0;i<tmp_data.length;i++) {
                  select_data.data[tar_index].children[parentIndex].children.push({
                      img: '',
                      img_path: '',
                      title: '',
                      url: '',
                      url_type: '',
                      info: '',
                      width: '100%',
                      height: 150
                  });
              }
              this.props.handleCurSelData(select_data);
          }
          this.saveCurSelData(val, type, tar_index, 'more',parentIndex,custom);
          return false;
      }
      if (select_data.type == 'fzx' || select_data.type == 'fzkb' || select_data.type == 'fuwenben' || select_data.type == 'dapei' || select_data.type == 'tuijianshangpin' || select_data.type == 'kefu' || select_data.type == 'gonggao' || (select_data.type == 'nav' && (type == 'icon_set' || type == 'style_set' || type == 'slide')) || (select_data.type == 'tupianzuhe' && type == 'sele_style') || select_data.type == 'svideo' || select_data.type == 'live' || (select_data.type == 'more_tab' && type == 'border_radius') || select_data.type == 'activity'||(select_data.type == 'top_cat_nav' && type == 'swiper_bg_style')|| select_data.type == 'TuPianZuHe'|| select_data.type == 'raffle'|| select_data.type == 'hotSale'|| select_data.type == 'titleSet'||select_data.type == 'topSearch') {
      //辅助线/辅助空白/客服/富文本/图片组合的展现样式

          this.saveCurSelData(val, type, tar_index, 'single');
      }
  };

  //修改内容，数据根节点的操作
  saveCurSelData = (val, type, tar_index = 0, flag, parentIndex,custom) => {
      let { select_data } = this.props;
      if (flag == 'single') {
      //辅助线/辅助空白/富文本/客服操作, 导航的根节点样式
          this.props.handleCurSelData({ [type]: val });
      } else if (flag == 'more') {
      //每个数组下面的操作
          let tar_data
          if(select_data.type=='zidingyi'){
              if(select_data.type=='zidingyi'&&type=='zidingyi_style'){
                  select_data.data.zidingyi_style=val
              }
              tar_data = select_data.data[custom].filter((item, index) => index == tar_index)[0];
          }else if(select_data.type=='raffle'||select_data.type=='hotSale'){
              tar_data = select_data[custom].filter((item, index) => index == tar_index)[0];
          }
          else{
              tar_data = select_data.data.filter((item, index) => index == tar_index)[0];
          }
          if((select_data.type=='tablan'||select_data.type=='tabGroup'||select_data.type=='zixun'||select_data.type=='tuzixun')&&parentIndex!==undefined){
              tar_data = select_data.data.filter((item, index) => index == parentIndex)[0].children[tar_index];
          }
          if(select_data.type=='tabzixun'&&parentIndex!==undefined){
              tar_data = select_data.data.filter((item, index) => index == parentIndex)[0].children[tar_index].children[parentIndex];
          }
          if(!(select_data.type=='zidingyi'&&type=='zidingyi_style')){
              tar_data[type] = val;
          }
          this.props.handleCurSelData(select_data);
      }
  };
 

  //链接选择器选择之后渲染页面
  getDetailItem = (data, index = 0) => {
      let render_con = '';
      if (data.url_type == '') {
          render_con = null;
      } else if (data.url_type == 'url') {
          render_con = <div className={`${styles.sub_part}`} style={{ borderBottomWidth: 0 }}>
              <div className={`${styles.subtitle}`}>链接地址</div>
              <FormItem
                  key={`link_url_${index}`}
                  {...formItemLayoutModal}
                  label=""
              >
                  <Input
                      style={{ width: 300 }}
                      maxLength={250}
                      defaultValue={data.url}
                      placeholder="请输入链接地址"
                      onChange={(e) => this.onChange(e.target.value, 'url', index)}
                  />
              </FormItem>
          </div>;
      } else if (data.url_type == 'applet_url') {
          render_con = <div className={`${styles.sub_part}`} style={{ borderBottomWidth: 0 }}>
              <div className={`${styles.subtitle}`}>链接地址</div>
              <FormItem
                  key={`link_applet_url_${index}`}
                  {...formItemLayoutModal}
                  label=""
              >
                  <Input
                      style={{ width: 300 }}
                      maxLength={250}
                      defaultValue={data.url}
                      placeholder="请输入链接地址"
                      onChange={(e) => this.onChange(e.target.value, 'url', index)}
                  />
          
              </FormItem>

          </div>;
      } else if (data.url_type == 'openBbcPage_url') {
          render_con = <div className={`${styles.sub_part}`} style={{ borderBottomWidth: 0 }}>
              <div className={`${styles.subtitle}`}>链接地址</div>
              <FormItem
                  key={`link_openBbcPage_url_${index}`}
                  {...formItemLayoutModal}
                  label=""
              >
                  <Input
                      style={{ width: 300 }}
                      maxLength={250}
                      defaultValue={data.url}
                      placeholder="请输入链接地址"
                      onChange={(e) => this.onChange(e.target.value, 'url', index)}
                  />
              </FormItem>
          </div>;
      }else if (data.url_type == 'third_url') {
          render_con = <div className={`${styles.sub_part}`} style={{ borderBottomWidth: 0 }}>
              <div className={`${styles.subtitle}`}>第三方链接地址</div>
              <FormItem
                  key={`link_third_url_${index}`}
                  {...formItemLayoutModal}
                  label=""
              >
                  <Input
                      style={{ width: 300 }}
                      maxLength={250}
                      defaultValue={data.url}
                      placeholder="请输入第三方链接地址"
                      onChange={(e) => this.onChange(e.target.value, 'url', index)}
                  />
              </FormItem>
          </div>;
      } else if (data.url_type == 'keyword') {
          render_con = <div className={`${styles.sub_part}`} style={{ borderBottomWidth: 0 }}>
              <div className={`${styles.subtitle}`}>关键词</div>
              <FormItem
                  key={`link_keyword_${index}`}
                  {...formItemLayoutModal}
                  label=""
              >
                  <Input
                      maxLength={250}
                      style={{ width: 300 }}
                      defaultValue={data.url}
                      placeholder="请输入关键词"
                      onChange={(e) => this.onChange(e.target.value, 'url', index)}
                  />
              </FormItem>
          </div>;
      } else if (data.url_type == 'goods') {
          render_con = <div className={`${styles.sub_part}`} style={{ borderBottomWidth: 0 }}>
              <div className={`${styles.subtitle}`}>商品名称</div>
              <FormItem
                  key={`link_goods_${index}`}
                  {...formItemLayoutModal}
                  label=""
              >
                  <Input maxLength={250} style={{ width: 300 }} value={data.info.skuName} disabled />
              </FormItem>
          </div>;
      } else if (data.url_type == 'category') {
          render_con = <div className={`${styles.sub_part}`} style={{ borderBottomWidth: 0 }}>
              <div className={`${styles.subtitle}`}>分类名称</div>
              <FormItem
                  key={`link_category_${index}`}
                  {...formItemLayoutModal}
                  label=""
              >
                  <Input maxLength={250} style={{ width: 300 }} value={data.info.gc_name} disabled />
              </FormItem>
          </div>;
      } else if (data.url_type == 'topic') {
          render_con = <div className={`${styles.sub_part}`} style={{ borderBottomWidth: 0 }}>
              <div className={`${styles.subtitle}`}>专题名称</div>
              <FormItem
                  key={`link_topic_${index}`}
                  {...formItemLayoutModal}
                  label=""
              >
                  <Input maxLength={250} style={{ width: 300 }} value={data.info.name} disabled />
              </FormItem>
          </div>;
      } else if (data.url_type == 'seckill') {
          render_con = <div className={`${styles.sub_part}`} style={{ borderBottomWidth: 0 }}>
              <div className={`${styles.subtitle}`}>秒杀活动名称</div>
              <FormItem
                  key={`link_seckill_${index}`}
                  {...formItemLayoutModal}
                  label=""
              >
                  <Input maxLength={250} style={{ width: 300 }} value={data.info.seckillName} disabled />
              </FormItem>
          </div>;
      } else if (data.url_type == 'store') {
          render_con = <div className={`${styles.sub_part}`} style={{ borderBottomWidth: 0 }}>
              <div className={`${styles.subtitle}`}>店铺名称</div>
              <FormItem
                  key={`link_store_${index}`}
                  {...formItemLayoutModal}
                  label=""
              >
                  <Input maxLength={250} style={{ width: 300 }} value={data.info.store_name} disabled />
              </FormItem>
          </div>;
      } else if (data.url_type == 'voucher') {
          render_con = <div className={`${styles.sub_part}`} style={{ borderBottomWidth: 0 }}>
              <div className={`${styles.subtitle}`}>优惠券名称</div>
              <FormItem
                  key={`link_voucher_${index}`}
                  {...formItemLayoutModal}
                  label=""
              >
                  <Input maxLength={250} style={{ width: 300 }} value={data.info.red_title} disabled />
              </FormItem>
          </div>;
      } else if (data.url_type == 'live') {
          render_con = <div className={`${styles.sub_part}`} style={{ borderBottomWidth: 0 }}>
              <div className={`${styles.subtitle}`}>直播名称</div>
              <FormItem
                  key={`link_live_${index}`}
                  {...formItemLayoutModal}
                  label=""
              >
                  <Input maxLength={250} style={{ width: 300 }} value={data.info.live_name} disabled />
              </FormItem>
          </div>;
      } else if (data.url_type == 'svideo') {
          render_con = <div className={`${styles.sub_part}`} style={{ borderBottomWidth: 0 }}>
              <div className={`${styles.subtitle}`}>短视频名称</div>
              <FormItem
                  key={`link_svideo_${index}`}
                  {...formItemLayoutModal}
                  label=""
              >
                  <Input maxLength={250} style={{ width: 300 }} value={data.info.videoName} disabled />
              </FormItem>
          </div>;
      }
      return render_con;
  };

  //链接选择器选择之后渲染页面不显示label
  getDetailItemHideLabel = (data, index = 0,parentIndex,custom) => {
      let render_con = '';
      const { select_data } = this.props;
      if (data.url_type == '') {
          render_con = null;
      } else if (data.url_type == 'url') {
          render_con = <Input
              maxLength={250}
              key={`${select_data.type}_${select_data.id}_url${index}`}
              className={styles.more_link_input}
              defaultValue={data.url}
              placeholder="请输入链接地址"
              onChange={(e) => this.onChange(e.target.value, 'url', index,parentIndex,custom)}
          />;

      } else if (data.url_type == 'third_url') {
          render_con = <Input
              maxLength={250}
              key={`${select_data.type}_${select_data.id}_url${index}`}
              className={styles.more_link_input}
              defaultValue={data.url}
              placeholder="请输入链接地址"
              onChange={(e) => this.onChange(e.target.value, 'url', index,parentIndex,custom)}
          />;
  
      } else if (data.url_type == 'applet_url') {
          render_con = <div>
              <Input
                  maxLength={250}
                  key={`${select_data.type}_${select_data.id}_url${index}`}
                  className={styles.more_link_input}
                  defaultValue={data.url}
                  placeholder="请输入链接地址"
                  onChange={(e) => this.onChange(e.target.value, 'url', index,parentIndex,custom)}
              />
              <Input
                  maxLength={250}
                  key={`${select_data.type}_${select_data.id}_url${index}`}
                  className={styles.more_link_input}
                  defaultValue={data.appletId}
                  placeholder="请输入小应用id"
                  onChange={(e) => this.onChange(e.target.value, 'appletId', index,parentIndex,custom)}
              />
          </div>
        
      } else if (data.url_type == 'openBbcPage_url') {
          render_con = <Input
              maxLength={250}
              key={`${select_data.type}_${select_data.id}_url${index}`}
              className={styles.more_link_input}
              defaultValue={data.url}
              placeholder="请输入链接地址"
              onChange={(e) => this.onChange(e.target.value, 'url', index,parentIndex,custom)}
          />;
  
      }
      else if (data.url_type == 'keyword') {
          render_con =
              <Input
                  maxLength={15}
                  key={`${select_data.type}_${select_data.id}_keyword${index}`}
                  className={styles.more_link_input}
                  defaultValue={data.url}
                  placeholder="请输入关键词"
                  onChange={(e) => this.onChange(e.target.value, 'url', index)}
              />;
      } else if (data.url_type == 'goods') {
          render_con = <Input
              key={`${select_data.type}_${select_data.id}_goods${index}`}
              className={styles.more_link_input}
              value={data.info.skuName}
              disabled
              title={data.info.skuName}
          />;
      } else if (data.url_type == 'category') {
          render_con =
              <Input
                  key={`${select_data.type}_${select_data.id}_category${index}`}
                  className={styles.more_link_input}
                  value={data.info.categoryName}
                  disabled
                  title={data.info.categoryName}
              />;
      } else if (data.url_type == 'topic') {
          render_con = <Input
              key={`${select_data.type}_${select_data.id}_topic${index}`}
              className={styles.more_link_input}
              value={data.info.name}
              disabled 
          />;
      } else if (data.url_type == 'seckill') {
          render_con = <Input
              key={`${select_data.type}_${select_data.id}_seckill${index}`}
              className={styles.more_link_input}
              value={data.info.seckillName}
              disabled 
          />;
      } else if (data.url_type == 'store') {
          render_con = <Input
              key={`${select_data.type}_${select_data.id}_store${index}`}
              className={styles.more_link_input}
              value={data.info.store_name}
              disabled 
          />;
      } else if (data.url_type == 'voucher') {
          render_con = <Input
              key={`${select_data.type}_${select_data.id}_voucher${index}`}
              className={styles.more_link_input}
              value={data.info.red_title}
              disabled 
          />;
      } else if (data.url_type == 'live') {
          render_con = <Input
              key={`${select_data.type}_${select_data.id}_live${index}`}
              className={styles.more_link_input}
              value={data.info.live_name}
              disabled 
          />;
      } else if (data.url_type == 'svideo') {
          render_con = <Input
              key={`${select_data.type}_${select_data.id}_svideo${index}`}
              className={styles.more_link_input}
              value={data.info.videoName}
              disabled 
          />;
      }
      return render_con;
  };

  /*
  * 链接选择器选择事件
  * tar_index为多条数据的角标，（用于轮播/导航/图片组合）
  * */
  sldHandSeleLink = (val, tar_index = 0,parentIndex,custom) => {
      let data = {};
      let { select_data } = this.props;
      if (select_data.type == 'lunbo' || select_data.type == 'nav' || select_data.type == 'tupianzuhe'|| select_data.type == 'top_cat_nav'|| select_data.type == 'TuPianZuHe'||select_data.type=='tabzixun'|| select_data.type == 'titleSet'||select_data.type == 'topSearch') {
          data = select_data.data.filter((item, index) => index == tar_index)[0];
      }
      if(select_data.type=='raffle'||select_data.type=='hotSale'){
          data = select_data[custom].filter((item, index) => index == tar_index)[0];
          select_data.activityType = custom
      }
      if(select_data.type=='zidingyi'){
          data = select_data.data[custom].filter((item, index) => index == tar_index)[0];
      }
      if((select_data.type=='tablan'||select_data.type=='tabGroup'||select_data.type=='zixun'||select_data.type=='tuzixun')&&parentIndex!==undefined){
          data = select_data.data.filter((item, index) => index == parentIndex)[0].children[tar_index];
      }
      if (val == '') {
      //无操作
          data.url = '';//公告链接
          data.url_type = '';//公告链接类型
          data.info = '';//用于存放额外信息
      } else if (val == 'url') {
      //链接地址
          data.url = '';//公告链接
          data.url_type = 'url';//公告链接类型
          data.info = '';//用于存放额外信息
      } else if (val == 'third_url') {
          //第三方链接地址
          data.url = '';//公告链接
          data.url_type = 'third_url';//公告链接类型
          data.info = '';//用于存放额外信息
      } else if (val == 'applet_url') {
          //第三方链接地址
          data.url = '';//公告链接
          data.url_type = 'applet_url';//公告链接类型
          data.info = '';//用于存放额外信息
          data.appletId=''//小应用id
      }else if (val == 'openBbcPage_url') {
          //第三方链接地址
          data.url = '';//公告链接
          data.url_type = 'openBbcPage_url';//公告链接类型
          data.info = '';//用于存放额外信息
      } else if (val == 'union') {
          //第三方链接地址
          data.url = '';//公告链接
          data.url_type = 'union';//公告链接类型
          data.info = '';//用于存放额外信息
          data.uniontype = '';
      }
      else if (val == 'keyword') {
      //关键词
          data.url = '';//关键词
          data.url_type = 'keyword';//关键词类型
          data.info = '';//用于存放额外信息
      } else if (val == 'goods') {
      //商品
          data.url = '';//商品gid
          data.url_type = 'goods';//商品类型
          data.info = '';//用于存放额外信息
      } else if (val == 'category') {
      //分类
          data.url = '';//分类id
          data.url_type = 'category';//分类类型
          data.info = '';//用于存放额外信息
      } else if (val == 'topic') {
      //专题
          data.url = '';//专题id
          data.url_type = 'topic';//专题类型
          data.info = '';//用于存放额外信息
      } else if (val == 'seckill') {
      //秒杀
          data.url = '';//秒杀id
          data.url_type = 'seckill';//秒杀类型
          data.info = '';//用于存放额外信息
      } else if (val == 'store') {
      //店铺
          data.url = '';//店铺id
          data.url_type = 'store';//店铺类型
          data.info = '';//用于存放额外信息
      } else if (val == 'voucher') {
      //优惠券
          data.url = '';//优惠券id
          data.url_type = 'voucher';//优惠券类型
          data.info = '';//用于存放额外信息
      } else if (val == 'live') {
      //直播
          data.url = '';//直播id
          data.url_type = 'live';//直播类型
          data.info = '';//用于存放额外信息
      } else if (val == 'svideo') {
      //短视频
          data.url = '';//短视频id
          data.url_type = 'svideo';//短视频类型
          data.info = '';//用于存放额外信息
      } else {
      //签到、店铺街、领券中心、推手系统、O2O、短视频、直播、积分商城、【促销】团购、【促销】限时折扣、【促销】拼团、【促销】预售、【促销】阶梯团
          data.url = '';
          data.url_type = val;//链接类型
          data.info = '';//用于存放额外信息
      }
      this.cur_index = tar_index;//当前操作数据的序号
      this.setState({ link_type: val });
      if (select_data.type == 'lunbo' || select_data.type == 'nav' || select_data.type == 'tupianzuhe' || select_data.type == 'top_cat_nav'||select_data.type=='tablan'||select_data.type=='tabzixun'||select_data.type=='tabGroup'||select_data.type=='zixun'||select_data.type == 'tuzixun'||select_data.type == 'zidingyi'||select_data.type == 'TuPianZuHe'||select_data.type == 'raffle'||select_data.type == 'hotSale'|| select_data.type == 'titleSet'||select_data.type == 'topSearch') {
      //轮播导航
          this.props.handleCurSelData(select_data);
      } else {
      //目前用于搭配
          this.props.handleCurSelData(data);
      }
  };


  //商品或分类选中事件
  seleSku = (val) => {
      const { select_data } = this.props;
      let data = {};
      if (select_data.type == 'lunbo' || select_data.type == 'nav' || select_data.type == 'tupianzuhe'|| select_data.type == 'top_cat_nav'|| select_data.type == 'TuPianZuHe'|| select_data.type == 'tablan'|| select_data.type == 'tabzixun'|| select_data.type == 'raffle'|| select_data.type == 'titleSet'||select_data.type == 'topSearch') {
          data = select_data.data.filter((item, index) => index == this.cur_index)[0];
      } else if(select_data.type == 'hotSale'){
          data = select_data[select_data.activityType].filter((item, index) => index == this.cur_index)[0];
      }else {
          data = { ...select_data };
      }
      if (data.url_type == 'goods') {
          data.url = val.goodsId;
          data.info = val;
      } else if (data.url_type == 'category') {
          data.url = val.categoryId;
          data.info = val;
      } else if (data.url_type == 'topic') {
          data.url = val.id;
          data.info = val;
      } else if (data.url_type == 'seckill') {
          data.url = val.seckillId;
          data.info = val;
      } else if (data.url_type == 'store') {
          data.url = val.vid;
          data.info = val;
      } else if (data.url_type == 'voucher') {
          data.url = val.id;
          data.info = val;
      } else if (data.url_type == 'live') {
          data.url = val.liveId;
          data.info = val;
      } else if (data.url_type == 'svideo') {
          data.url = val.videoId;
          data.info = val;
      }
      if (select_data.type == 'lunbo' || select_data.type == 'nav') {
          this.props.handleCurSelData(select_data);
      } else {
          this.props.handleCurSelData(data);
      }
      this.setState({ link_type: '' });
  };

  //选择商品或者分类取消事件
  sldHandleLinkCancle = () => {
      const { select_data } = this.props;
      let data = { ...select_data };
      if (data.type == 'lunbo' || data.type == 'nav') {
      //轮播
          let tar_data = data.data.filter((item, index) => index == this.cur_index)[0];
          tar_data.url = '';
          tar_data.url_type = '';
          tar_data.info = '';
      } else {
          data.url = '';//公告链接
          data.url_type = '';//公告链接类型
          data.info = '';//用于存放额外信息
      }
      this.props.handleCurSelData(data);
      this.setState({ link_type: '' });
  };

  /*
  * 上传图片
  * tar_index标示多个图片的时候图片下标（（用于轮播/导航/图片组合）
  * */
  setImg = (info, tar_index = 0,parentIndex,custom) => {
   
      const { select_data } = this.props;
      let data = { ...select_data };
      let img_data = info.file.response;
      if (info.file.status === 'done') {
          if (select_data.type == 'lunbo' || select_data.type == 'nav' || select_data.type == 'tupianzuhe' || select_data.type == 'top_cat_nav'||select_data.type == 'tablan'||select_data.type == 'tabzixun'||select_data.type == 'tabGroup'||select_data.type == 'zixun'||select_data.type == 'tuzixun'||select_data.type == 'zidingyi'||select_data.type == 'TuPianZuHe'||select_data.type == 'raffle'||select_data.type == 'hotSale'|| select_data.type == 'titleSet'||select_data.type == 'topSearch') {
              //轮播
              data.height = 0
              let target_data
              if(select_data.type == 'zidingyi'){

                  target_data = data.data[custom].filter((item, index) => index == tar_index)[0];
              }else if(select_data.type == 'tabzixun'){
                  target_data = data.img.filter((item, index) => index == tar_index)[0];
              }else if(select_data.type == 'raffle'||select_data.type == 'hotSale'){
                  target_data = select_data[custom].filter((item, index) => index == tar_index)[0];
              }else{
                  target_data = data.data.filter((item, index) => index == tar_index)[0];
              }
              if((select_data.type == 'tablan'||select_data.type == 'tabGroup'||select_data.type == 'zixun'||select_data.type == 'tuzixun') && parentIndex!==undefined){
                  target_data = data.data.filter((item, index) => index == parentIndex)[0].children[tar_index];
              }
              target_data.img = img_data.data.url;
              target_data.img_path = img_data.data.path;
              target_data.width = img_data.data.width;
              target_data.height = img_data.data.height;
              data.width = img_data.data.width;
        
              if(data.data&&data.data.length == 1){
                  data.height = img_data.data.height;
              }else if(data.data&&data.data.length > 1){
                  if(img_data.data.height > data.height){
                      data.height = img_data.data.height;
                  }
              }
          } else {
              //搭配
              data.dapei_img = img_data.data.url;
              data.img_path = img_data.data.path;
              data.width = img_data.data.width;
              data.height = img_data.data.height;
          }
      }
      this.props.handleCurSelData(data);
  };

  //删除搭配图片
  delImg = () => {
      const { select_data } = this.props;
      let data = { ...select_data };
      data.dapei_img = '';
      data.img_path = '';
      this.props.handleCurSelData(data);
  };

  //删除选中的短视频
  delSvideo = (svideoId, tar_index = 0) => {
      const { select_data } = this.props;
      let data = { ...select_data };
      if (data.type == 'more_tab') {
          let tar_data = data.data.filter((item, index) => index == tar_index)[0];
          tar_data.ids = tar_data.ids.filter(item => item != svideoId);
          tar_data.info = tar_data.info.filter(item => item.videoId != svideoId);
      } else {
          data.data.ids = data.data.ids.filter(item => item != svideoId);
          data.data.info = data.data.info.filter(item => item.videoId != svideoId);
      }
      this.props.handleCurSelData(data);
  };

  //删除选中的直播
  delLive = (liveId, tar_index = 0) => {
      const { select_data } = this.props;
      let data = { ...select_data };
      if (data.type == 'more_tab') {
          let tar_data = data.data.filter((item, index) => index == tar_index)[0];
          tar_data.ids = tar_data.ids.filter(item => item != liveId);
          tar_data.info = tar_data.info.filter(item => item.liveId != liveId);
      } else {
          data.data.ids = data.data.ids.filter(item => item != liveId);
          data.data.info = data.data.info.filter(item => item.liveId != liveId);
      }
      this.props.handleCurSelData(data);
  };

  //删除单个商品
  delGoods = (sku, tar_index = 0) => {
      const { select_data } = this.props;
      let data = { ...select_data };
      if (data.type == 'dapei' || data.type == 'tuijianshangpin'|| data.type == 'activity' ||data.type == 'hotSale'|| select_data.type == 'titleSet'||select_data.type == 'topSearch') {
          data.data.ids = data.data.ids.filter(item => item != sku);
          data.data.info = data.data.info.filter(item => item.sku != sku);
      }else if (data.type == 'more_tab') {
          let tar_data = data.data.filter((item, index) => index == tar_index)[0];
          tar_data.ids = tar_data.ids.filter(item => item != sku);
          tar_data.info = tar_data.info.filter(item => item.sku != sku);
      }
      this.props.handleCurSelData(data);
  };


  //短视频多选-回调事件
  seleSvideo = (selectedRows, selectedRowKeys) => {
      const { select_data } = this.props;
      let data = { ...select_data };
      this.sele_more_svideo.ids = [...selectedRowKeys];
      this.sele_more_svideo.info = JSON.parse(JSON.stringify(selectedRows));
      if (data.type == 'svideo') {
          data.data.ids = JSON.parse(JSON.stringify(selectedRowKeys));
          data.data.info = JSON.parse(JSON.stringify(selectedRows));
      } else if (data.type == 'more_tab') {
          let tar_data = data.data.filter((item, index) => index == this.oprate_more_tab_index)[0];
          tar_data.ids = JSON.parse(JSON.stringify(selectedRowKeys));
          tar_data.info = JSON.parse(JSON.stringify(selectedRows));
      }
      this.props.handleCurSelData(data);
      this.sldHandleCancle();
  };

  //直播多选-回调事件
  seleLive = (selectedRows, selectedRowKeys) => {
      const { select_data } = this.props;
      let data = { ...select_data };
      this.sele_more_live.ids = [...selectedRowKeys];
      this.sele_more_live.info = JSON.parse(JSON.stringify(selectedRows));
      if (data.type == 'live') {
          data.data.ids = JSON.parse(JSON.stringify(selectedRowKeys));
          data.data.info = JSON.parse(JSON.stringify(selectedRows));
      } else if (data.type == 'more_tab') {
          let tar_data = data.data.filter((item, index) => index == this.oprate_more_tab_index)[0];
          tar_data.ids = JSON.parse(JSON.stringify(selectedRowKeys));
          tar_data.info = JSON.parse(JSON.stringify(selectedRows));
      }
      this.props.handleCurSelData(data);
      this.sldHandleCancle();
  };

  //商品多选-回调事件
  seleGoods = (selectedRows, selectedRowKeys) => {
      const { select_data } = this.props;
      let data = { ...select_data };
      this.sele_more_goods.ids = [...selectedRowKeys];
      this.sele_more_goods.info = JSON.parse(JSON.stringify(selectedRows));
      if (data.type == 'dapei' || data.type == 'activity' || data.type == 'tuijianshangpin'|| data.type == 'hotSale'|| select_data.type == 'titleSet'||select_data.type == 'topSearch') {
          data.data.ids = JSON.parse(JSON.stringify(selectedRowKeys));
          data.data.info = JSON.parse(JSON.stringify(selectedRows));
      } else if (data.type == 'more_tab') {
          let tar_data = data.data.filter((item, index) => index == this.oprate_more_tab_index)[0];
          tar_data.ids = JSON.parse(JSON.stringify(selectedRowKeys));
          tar_data.info = JSON.parse(JSON.stringify(selectedRows));
      }
      this.props.handleCurSelData(data);
      this.sldHandleCancle();
  };

  sldHandleCancle = () => {
      this.setState({
          modalSpuShow: false,
          modalVisible: false,
          modalVisibleLive: false,
          modalVisibleGoods: false,
          modalVisibleActivityGoods: false
      });
  };

  renderDaPeiGoods = (data) => <div className={`${styles.sel_goods} ${global.flex_com_row_start_center}`} style={{ flexWrap: 'wrap' }}>
      {data.data.info.map((item, index) => <div key={index} className={`${styles.goods_info} ${global.flex_com_row_center}`}>
          <img src={item.mainImage} title={item.name1} />
          <div className={styles.img_mask}>
              <span className={styles.img_del} onClick={() => this.delGoods(item.id)}>
                  {sldTsvg('shanchu3', '#fff', 15, 15)}
              </span>
          </div>

      </div>)}
  </div>;

  /*
  *
  * upload_img_tip 上传图片的提示
  * */
  renderLunBo = (item, index, upload_img_tip = '',parentIndex,custom) => { // 增加parentIndex,用于父子结构 tablan
   
      let limintLength = 15;//限制内容长度
      const { select_data } = this.props;
      //标题的label  标题的key 标题的placeholder 显示删除图标show_del_icon
      let title_key, title_price,title_placeholder,title_placeholders, show_color_picker = false, show_del_icon = true,
          title_key_couponName,
          title_key_couponNameSize, //eslint-disable-line no-unused-vars
          title_key_couponNameColor, //eslint-disable-line no-unused-vars
          title_key_couponNamedistance, //eslint-disable-line no-unused-vars
          title_key_couponId,
          title_key_probability,title_placeholder_probability,title_placeholder_couponId,
          title_placeholder_couponNamedistance, //eslint-disable-line no-unused-vars
          title_placeholder_couponNameColor, //eslint-disable-line no-unused-vars
          title_placeholder_couponNameSize, //eslint-disable-line no-unused-vars
          title_placeholder_couponName,
          title_key_bgImgRadius, //eslint-disable-line no-unused-vars
          title_key_imgWidth, //eslint-disable-line no-unused-vars
          title_key_imgHeight, //eslint-disable-line no-unused-vars
          title_placeholder_bgImgRadius, //eslint-disable-line no-unused-vars
          title_placeholder_imgWidth, //eslint-disable-line no-unused-vars
          title_placeholder_imgHeight, //eslint-disable-line no-unused-vars
          title_key_backgroundColor,title_placeholder_backgroundColor,title_key_direction,
          title_placeholder_direction, //eslint-disable-line no-unused-vars
          title_key_align;
      if (select_data.type == 'lunbo') {
      //轮播
          show_del_icon = true;
      } if (select_data.type == 'top_cat_nav') {
      //顶部分类导航
          show_del_icon = true;
          show_color_picker = true;//显示颜色选择器
      } else if (select_data.type == 'nav'||select_data.type == 'TuPianZuHe'||select_data.type == 'topSearch') {
      //导航
          limintLength = 5;
          show_del_icon = true;
          title_key = 'name';
          title_placeholder = '请输入导航名称';
      } else if (select_data.type == 'tupianzuhe') {
      //图片组合
          if (select_data.sele_style < 4) {
              show_del_icon = true;
          } else {
              show_del_icon = false;
          }
          title_key = 'title';
          title_placeholder = '请输入图片标题';
      }else if(select_data.type == 'tablan'){
          limintLength = 16;
          title_key = 'tabName';
          title_placeholder = '请输入子项目名称';
      }else if(select_data.type == 'tabzixun'){
          limintLength = 16;
          title_placeholder = '请输入图片标题';
      }else if(select_data.type == 'tabGroup'){
          limintLength = 16;
          title_key = 'tabName';
          title_placeholder = '请输入子项目名称';
      }else if(select_data.type == 'zixun'){
          limintLength = 20;
          title_key = 'description';
          title_placeholder = '请输入图片描述';
      }else if(select_data.type == 'tuzixun'){
          limintLength = 20;
          title_key = 'description';
          title_placeholder = '请输入图片描述';
      }else if(select_data.type == 'titleSet'){
          limintLength = 20;
          title_key = 'title';
          title_key_direction = 'direction';
          title_key_align = 'align';
          title_placeholder = '请输入图片描述';
      }else if(select_data.type == 'zidingyi'){
          limintLength = 20;
          title_key = 'title';
          title_placeholder = '请输入描述';
          title_price = "price";
          title_placeholders = '请输入活动价';
      }else if(select_data.type == 'hotSale'){
          limintLength = 20;
          title_key = 'title';
          title_placeholder = '请输入描述';
          title_price = "price";
          title_placeholders = '请输入活动价';
      }else if(select_data.type == 'raffle'){
          limintLength = 20;
          title_key_couponName = 'couponName';
          title_key_bgImgRadius = 'bgImgRadius';
          title_key_backgroundColor = 'backgroundColor';
          title_key_imgWidth = 'imgWidth';
          title_key_imgHeight = 'imgHeight';
          title_key_couponNameSize = 'couponNameFontSize';
          title_key_couponNameColor = 'couponNameFontColor';
          title_key_couponNamedistance = 'couponNamedistance';
          title_key_couponId = 'couponId';
          title_key_probability = 'probability';
          title_placeholder_probability = '请输入中奖概率';
          title_placeholder_bgImgRadius = '请输入背景圆半径';
          title_placeholder_backgroundColor = '请输入背景色'
          title_placeholder_imgWidth = '请输入按钮宽度';
          title_placeholder_imgHeight = '请输入按钮高度';
          title_placeholder_couponId = '请输入优惠券Id';
          title_placeholder_couponNamedistance = '请输入抽奖的文字距顶部距离';
          title_placeholder_couponNameColor = '请输入抽奖的文字的颜色';
          title_placeholder_couponNameSize = '请输入抽奖的文字的大小';
          title_placeholder_couponName = '请输入奖品名称';
      }
      let content = '';
      content = <Fragment key={`${select_data.type}_${select_data.id}_img${index}`}>
          <div className={`${global.flex_com_row_start_center} ${styles.sld_com_img}`}>
              <div className={`${styles.common_img_part} ${global.flex_com_column_center_center}`}>
                  <div className={`${styles.upload_img} ${global.flex_column_center_center}`}>
                      <Upload
                          withCredentials
                          beforeUpload={sldBeforeUpload}
                          accept=".gif, .jpeg, .png,.jpg,"
                          showUploadList={false}
                          name="file"
                          action={`${apiUrl}v3/oss/common/upload?source=adminDeco`}
                          onChange={(info) => this.setImg(info, index,parentIndex,custom)}
                          headers={{
                              Authorization: `Bearer ${ getLocalStorageStingVal('sld_token')}`
                          }}
                      >
                          <div className={`${global.flex_column_center_center}`}>
                              {item.img
                                  ?<img src={item.img} />
                                  :sldSvgIcon('#FC701E',40,40,'ziyuan110')
                              }
                              <span className={styles.upload_btn}>选择图片</span>
                          </div>
                      </Upload>
                  </div>
                  <span className={styles.upload_img_tip}>{upload_img_tip}</span>
              </div>
              <div className={`${styles.img_con} ${global.flex_com_column_center_flex_start}`}>
                  {show_color_picker &&
                  <Fragment>
                      <div className={`${global.flex_row_start_center}`} style={{ marginBottom: 8 }}>
                          <span className={`${styles.selected_color_tip}`}>选择背景色：</span>
                          {/*<span className={`${styles.clear_color} ${item.bg_color == '' ? styles.bg_color_current : null}`}></span>*/}
                          <span
                              className={`${styles.selected_color} ${item.bg_color ? styles.bg_color_current : null}`}
                              style={{ background: item.bg_color }}
                              onClick={()=>this.showTopCatNavColorPicker(true,index)}
                          />
                      </div>
                      {item.show_color_picker && (
                          <div className={styles.color_picker_wrap}>
                              <div
                                  className={styles.color_picker_mask}
                                  onClick={() => this.showTopCatNavColorPicker(false,index)}
                              />
                              <SketchPicker
                                  color={item.bg_color}
                                  onChangeComplete={(e) => this.onChange(`rgba(${e.rgb.r},${e.rgb.g},${e.rgb.b},${e.rgb.a})`,'bg_color',index)}
                              />
                          </div>

                      )}
                  </Fragment>
                  }
                  {(select_data.type != 'top_cat_nav'&&select_data.type != 'lunbo'&&select_data.type != 'raffle')&&
                  <Input
                      maxLength={limintLength}
                      className={styles.title}
                      placeholder={title_placeholder}
                      onChange={(e) => this.onChange(e.target.value, title_key, index,parentIndex,custom)}
                      value={item[title_key]}
                  />
                  }
                  {(select_data.type == 'titleSet')&&
                  <div>
                      <div><label>请选择图片文字的排列方式
                          <Radio.Group defaultValue={item[title_key_direction]} onChange={(e) => this.onChange(e.target.value, title_key_direction,index)}>
                              <Radio value="row">横向</Radio>
                              <Radio value="column">竖向</Radio>
                          </Radio.Group>
                      </label></div>
                      <div><label>请选择图片文字的对齐方式
                          <Radio.Group defaultValue={item[title_key_align]} onChange={(e) => this.onChange(e.target.value, title_key_align,index)}>
                              <Radio value="left">左对齐</Radio>
                              <Radio value="right">右对齐</Radio>
                          </Radio.Group>
                      </label></div>
                  </div>
                  }
                  {(select_data.type =='raffle'&&custom==="prize")&&
                  <div>
                      <label>奖品名称
                          <Input
                              maxLength={limintLength}
                              className={styles.title}
                              placeholder={title_placeholder_couponName}
                              onChange={(e) => this.onChange(e.target.value, title_key_couponName, index,parentIndex,custom)}
                              value={item[title_key_couponName]}
                          />
                      </label>
                      <label>奖品ID（优惠券ID）
                          <Input
                              maxLength={limintLength}
                              className={styles.title}
                              placeholder={title_placeholder_couponId}
                              onChange={(e) => this.onChange(e.target.value, title_key_couponId, index,parentIndex,custom)}
                              value={item[title_key_couponId]}
                          />
                      </label>
                      <label>中奖概率
                          <Input
                              maxLength={limintLength}
                              className={styles.title}
                              placeholder={title_placeholder_probability}
                              onChange={(e) => this.onChange(e.target.value, title_key_probability, index,parentIndex,custom)}
                              value={item[title_key_probability]}
                          />
                      </label>
                      {/* 暂时不用，后续待定
                <Input maxLength={limintLength} className={styles.title} placeholder={title_placeholder_couponNameSize}
                onChange={(e) => this.onChange(e.target.value, title_key_couponNameSize, index,parentIndex,custom)} value={item[title_key_couponNameSize]}/>
                <Input maxLength={limintLength} className={styles.title} placeholder={title_placeholder_couponNameColor}
                onChange={(e) => this.onChange(e.target.value, title_key_couponNameColor, index,parentIndex,custom)} value={item[title_key_couponNameColor]}/>
                <Input maxLength={limintLength} className={styles.title} placeholder={title_placeholder_couponNamedistance}
                onChange={(e) => this.onChange(e.target.value, title_key_couponNamedistance, index,parentIndex,custom)} value={item[title_key_couponNamedistance]}/> */}
                  </div>
                  }
          
                  {(select_data.type =='raffle'&&custom==="background")&&
                  <div>
                      {/* <Input maxLength={limintLength} className={styles.title} placeholder={title_placeholder_bgImgRadius}
                onChange={(e) => this.onChange(e.target.value, title_key_bgImgRadius, index,parentIndex,custom)} value={item[title_key_bgImgRadius]}/> */}
                      <label>背景色或者图片
                          <Input
                              maxLength={limintLength}
                              className={styles.title}
                              placeholder={title_placeholder_backgroundColor}
                              onChange={(e) => this.onChange(e.target.value, title_key_backgroundColor, index,parentIndex,custom)}
                              value={item[title_key_backgroundColor]}
                          />
                      </label>
                  </div>
                  }
                  {/* 暂时不用，后续待定 */}
                  {/* {(select_data.type =='raffle'&&custom==="button")&&
          <div>
                <Input maxLength={limintLength} className={styles.title} placeholder={title_placeholder_imgWidth}
                onChange={(e) => this.onChange(e.target.value, title_key_imgWidth, index,parentIndex,custom)} value={item[title_key_imgWidth]}/>
                <Input maxLength={limintLength} className={styles.title} placeholder={title_placeholder_imgHeight}
                onChange={(e) => this.onChange(e.target.value, title_key_imgHeight, index,parentIndex,custom)} value={item[title_key_imgHeight]}/>
          </div>
          } */}
                  {((select_data.type == 'zidingyi'&&custom==="children")||(select_data.type == 'zidingyi'&&custom==="leftRightChildren")&&select_data.type != 'raffle')&&
                  <Input
                      maxLength={limintLength}
                      className={styles.title}
                      placeholder={title_placeholders}
                      onChange={(e) => this.onChange(e.target.value, title_price, index,parentIndex,custom)}
                      value={item[title_price]}
                  />
                  }
                  {(select_data.type != 'raffle')&&
                  <Select
                      value={item.url_type}
                      style={{ width: 232 }}
                      placeholder="请选择链接类型"
                      onSelect={(e) => this.sldHandSeleLink(e, index,parentIndex,custom)}
                      getPopupContainer={triggerNode => triggerNode.parentNode}
                  >
                
                      {m_diy_link_type().map((items, index1) =>
                          <Option key={index1} value={items.key}>{items.name}</Option>,
                      )}
                
                  </Select>
                  }
                  {this.getDetailItemHideLabel(item, index,parentIndex,custom)}
              </div>
              {show_del_icon &&
              <div
                  className={`${global.flex_com_column_flex_end} ${styles.del_sld_com_img}`}
                  onClick={() => this.delSldComImg(index,parentIndex,custom)}
              >
                  {sldTsvg('qingchu', '#666', 16, 16)}
              </div>
              }
          </div>
      </Fragment>;
      return content;
  };


  //删除图片item,针对于多条数据的处理（用于轮播/导航/图片组合）
  delSldComImg = (tar_index,parentIndex,custom) => {
      let { select_data } = this.props;
      let data =[]
      if((select_data.type=='tablan'||select_data.type=='tabGroup'||select_data.type=='zixun'||select_data.type=='tuzixun')&&parentIndex!==undefined){
          select_data.data[parentIndex].children.splice(tar_index,1)
          data = select_data.data
      }
      else if(select_data.type=='zidingyi'){
          if(custom==='imglist'){
              return false
          }if(custom==='children'){
              select_data.data.children.splice(tar_index,1)
              data = select_data.data 
          }else{
              select_data.data.leftRightChildren.splice(tar_index,1)
              data = select_data.data
          }
      }else if(select_data.type=='raffle'){
          if (custom=='background') {
              return false
          }
          data = select_data[custom].splice(tar_index,1)
        
      }
      else{
          data = select_data.data.filter((item, index) => index != tar_index);
          select_data.nav_current = 0;
     
      }
      select_data.data = data;
      this.props.handleCurSelData(select_data);
  };

  //添加轮播图片
  addLunbo = (data) => {
      data.data.push({
          img: '',//图片绝对地址
          img_path: '',//图片相对地址
          title: '',//图片标题
          url: '', //链接值
          url_type: '',//链接类型
          info: '',//用于存放额外信息
          width: '100%',
          height: 285.5
      });
      this.props.handleCurSelData(data);
  };

  //添加抽奖活动中奖类型
  addRaffle = (data) => {
      data.prize.push({
          couponName:'',//抽奖的文字
          couponId:'',//抽奖优惠券的id
          probability:'',//中奖概率
          couponNameFontSize:'',//抽奖的文字的大小
          couponNameFontColor:'',//抽奖的文字的颜色
          couponNamedistance:'',//抽奖的文字的距离
          img: '',//图片绝对地址
          img_path: '',//图片相对地址
          title: '',//图片标题
          url: '', //链接值
          url_type: '',//链接类型
          info: '',//用于存放额外信息
          width: '100%',
          height: 285.5
      });
      this.props.handleCurSelData(data);
  };

  //添加顶部设置图片文字
  addTitleSet = (data) => {
      data.data.push({
          img: '',//图片绝对地址
          img_path: '',//图片相对地址
          title: '',//文字
          direction:'row',//文字和图片的对齐方向
          align:'left',//文字和图片的对齐方向
          url: '', //链接值
          url_type: '',//链接类型
          width: '100%',
          height: '100%'
      });
      this.props.handleCurSelData(data);
  };


  //添加顶部分类导航轮播
  addTopCatNav = (data) => {
      if(data.data.length == 8){
          failTip('最多支持8张轮播图');
          return false;
      }
      data.data.push({
          img: '',//图片绝对地址
          img_path: '',//图片相对地址
          title: '',//图片标题
          url: '', //链接值
          url_type: '',//链接类型
          info: '',//用于存放额外信息
          width: '355',
          height: 140,
          bg_color: '#FC1C1C',//轮播背景色
          show_color_picker:false,//是否显示颜色选择器，默认不显示
          swiper_bg_style:1//轮播背景风格，1为纯色弧度，2为渐变
      });
      this.props.handleCurSelData(data);
  };

  //顶部分类——颜色选择器的显示与否
  showTopCatNavColorPicker = () =>{
      // select_data.data[index].show_color_picker = flag;
  }

  //添加导航item
  addNav = (data) => {
      if (data.type == 'nav' && data.data.length >= 10) {
          failTip('最多添加10个导航');
          return false;
      } if (data.type == 'tupianzuhe' && data.data.length >= 30) {
          failTip('最多添加30张图片');
          return false;
      } 
      data.data.push({
          img: '',//图片绝对地址
          img_path: '',//图片相对地址
          name: '',//导航名称
          url: '', //链接值
          url_type: '',//链接类型
          info: '',//用于存放额外信息
          width: '100%',
          height: 150
      });
      this.props.handleCurSelData(data);
    
  };

  // 添加tab栏item
  addTabItem = (data,parentIndex) => {
      
      if (data.type == 'tablan' && data.data[parentIndex].children.length >= 5) {
          failTip('最多添加5个子项目，否则页面展示效果不佳');
          return false;
      }if (data.type == 'tabGroup' && data.data[parentIndex].children.length >= 5) {
          failTip('最多添加5个子项目，否则页面展示效果不佳');
          return false;
      }if(data.type == 'zixun' && data.data[parentIndex].children.length >= 3){
          failTip('最多添加3个子项目，否则页面展示效果不佳');
      }else if(data.type == 'tuzixun' && data.data[parentIndex].children.length >= 3){
          failTip('最多添加3个子项目，否则页面展示效果不佳');
      }else if(data.type == 'tabzixun' && data.data[parentIndex].children.length >= 3){
          failTip('最多添加3个子项目，否则页面展示效果不佳');
      }
      else {
          data.data[parentIndex].children.push({
              img: '',//图片绝对地址
              img_path: '',//图片相对地址
              name: '',//导航名称
              url: '', //链接值
              url_type: '',//链接类型
              info: '',//用于存放额外信息
              width: '100%',
              height: 150
          });
          this.props.handleCurSelData(data);
      }
  };

  // 添加tabzixun的item
  addTabNewsItem = (data,parentIndex) => {

      console.log(data,parentIndex);
      if(data.type == 'tabzixun' && data.data[parentIndex].children.length >= 3){
          failTip('最多添加3个子项目，否则页面展示效果不佳');
      }
      else {
          data.data[parentIndex].children.push({
              tabName:'',
              articleType: "NEWS",
              news_style: '1', //样式,默认1图
              title:'', //新闻标题
              lastUpdateTime:new Date().getTime(), //更新时间
              children: [{
                  img_path: "",
                  info: "",
                  name: "",
                  url: "",
                  url_type: ""
              }]//数据信息
          });
          this.props.handleCurSelData(data);
      }
  };

  // 添加导航item
  addzidingyiItem = (data) => {

      if (data.type == 'zidingyi' && data.data.children.length >= 10) {
          failTip('最多添加10个子项目，否则页面展示效果不佳');
          return false;
      }
      
      data.data.children.push({
          title:'',
          price:'',
          img: '',//图片绝对地址
          img_path: '',//图片相对地址
          url: '', //链接值
          url_type: '',//链接类型
          info: '',//用于存放额外信息
          width: '100%',
          height: 150
      });
      this.props.handleCurSelData(data);
    
  };

  // 添加导航item
  addzidingyileftRightItem = (data,) => {
     
      if (data.type == 'zidingyi' && data.data.leftRightChildren.length >= 12) {
          failTip('最多添加12个子项目，否则页面展示效果不佳');
          return false;
      }
      
      data.data.leftRightChildren.push({
          title:'',
          price:'',
          img: '',//图片绝对地址
          img_path: '',//图片相对地址
          url: '', //链接值
          url_type: '',//链接类型
          info: '',//用于存放额外信息
          width: '100%',
          height: 150
      });
      this.props.handleCurSelData(data);
    
  };

  //添加TAB切换分类导航，最多15个
  addMoreTabNav = (data) => {
      if (data.data.length >= 15) {
          failTip('最多添加15个tab导航');
          return false;
      } 
      if (data.data.length == 0) {
          data.nav_current = 0;
      }
      data.data.push({
          title: '',//分类标题
          sub_title: '',//子标题
          data_type: 'goods',//商品类型
          cart_icon_type: 1,//商品的话显示的购物车图标
          ids: [],//数据id集合
          info: []//数据信息
      });
      this.props.handleCurSelData(data);
    
  };

  //添加TAB栏，最多16个
  addTabLan = (data) => {
      if (data.data.length >=16) {
          failTip('最多添加16个tab栏');
          return false;
      } 
      if (data.data.length == 0) {
          data.nav_current = 0;
      }
      
      data.data.push({
          tabName: '',//标题
          children: [{
              tabName:'',
              img: "",
              img_path: "",
              info: "",
              name: "",
              url: "",
              url_type: ""
          }]//数据信息
      });
      this.props.handleCurSelData(data);
    
  };

  //添加TAB栏，最多16个
  addTabNews = (data) => {
      if (data.data.length >=16) {
          failTip('最多添加16个tab栏');
          return false;
      } 
      if (data.data.length == 0) {
          data.nav_current = 0;
      }
      
      data.data.push({
          tabName: '',//标题
          categoryId:''//标题id
      });
      this.props.handleCurSelData(data);
    
  };

  //添加TABGroup栏，最多16个
  addTabGroup = (data) => {
      if (data.data.length >=16) {
          failTip('最多添加1个tab栏');
          return false;
      } 
      if (data.data.length == 0) {
          data.nav_current = 0;
      }
      
      data.data.push({
          tabName: '',//标题
          children: [{
              tabName:'',
              img: "",
              img_path: "",
              info: "",
              name: "",
              url: "",
              url_type: ""
          }]//数据信息
      });
     
      this.props.handleCurSelData(data);
    
  };
  
  //添加新闻，最多5个
  addNews = (data) => {
      if (data.data.length >=5) {
          failTip('最多添加5条新闻');
          return false;
      } 
     
      data.data.push({
          articleType: "NEWS",
          news_style: '1', //样式,默认1图
          title:'', //新闻标题
          lastUpdateTime:new Date().getTime(), //更新时间
          children: [{
              img_path: "",
              info: "",
              name: "",
              url: "",
              url_type: ""
          }]//数据信息
      });
    
      this.props.handleCurSelData(data);
    
  };

  //短视频添加事件
  selMoreSvideo = (data) => {
      let { sle_more_title } = this.state;
      this.sele_more_svideo.info = data.data.info;
      this.sele_more_svideo.ids = data.data.ids;
      if (data.show_style == 'four' || data.show_style == 'five') {
          this.sele_more_svideo = {
              info: this.sele_more_svideo.info,//选择的短视频数组
              ids: this.sele_more_svideo.ids,//选择的短视频id数组
              min_num: 3,//最小数量，0为不限制
              max_num: 15//最多选择15个
          };
          sle_more_title = '选择短视频(最少选择3个，最多选择15个)';
      } else if (data.show_style == 'two') {
          this.sele_more_svideo = {
              info: this.sele_more_svideo.info,//选择的短视频数组
              ids: this.sele_more_svideo.ids,//选择的短视频id数组
              total_num: 3//只能选择3个
          };
          sle_more_title = '选择短视频(只能选择3个)';
      } else {
          this.sele_more_svideo = {
              info: this.sele_more_svideo.info,//选择的短视频数组
              ids: this.sele_more_svideo.ids,//选择的短视频id数组
              total_num: 2//只能选择2个
          };
          sle_more_title = '选择短视频(只能选择2个)';
      }
      this.setState({
          modalVisible: true,
          sle_more_title
      });
  };

  //选择商品事件-多选
  selMoreGoods = (data) => {
      console.log(data);
      let { activityType, sle_more_title, modalVisibleGoods, modalVisibleActivityGoods } = this.state;
      if (data.type == 'dapei') {
      //搭配
          this.sele_more_goods = {
              info: data.data.info,
              ids: data.data.ids,
              min_num: 3,
              max_num: 15
          };
          sle_more_title = '选择商品(最少选择3个，最多选择9个)';
          modalVisibleGoods = true;
      } else if (data.type == 'tuijianshangpin') {
      //商品推荐
          this.sele_more_goods = {
              info: data.data.info,
              ids: data.data.ids,
              min_num: 1
          };
          sle_more_title = '选择商品(最少选择1个)';
          modalVisibleGoods = true;
      }else if (data.type == 'hotSale') {
          //商品推荐
          this.sele_more_goods = {
              info: data.data.info,
              ids: data.data.ids,
              min_num: 1,
              max_num:9
          };
          sle_more_title = '选择商品(最少选择1个)';
          modalVisibleGoods = true;
      } else if (data.type == 'activity') {
          if (data.show_style == 'group_buy') {
              //团购
              this.sele_more_goods = {
                  info: data.data.info,
                  ids: data.data.ids,
                  total_num: 2//只能选择2个
              };
              sle_more_title = '选择团购商品(只能选择2个)';
          } else {
              //拼团、限时折扣
              this.sele_more_goods = {
                  info: data.data.info,
                  ids: data.data.ids,
                  min_num: 3,
                  max_num: 15
              };
              sle_more_title = `选择${ data.show_style == 'pin' ? '拼团' : '限时折扣' }商品(最少选择3个，最多选择15个)`;
          }
          activityType = data.show_style;
          modalVisibleActivityGoods = true;
      }
      this.setState({
          modalVisibleActivityGoods,
          modalVisibleGoods,
          activityType,
          sle_more_title
      });
      // console.log(sele_more_goods);
  };

  //TAB切换选择数据功能
  selMoreTabData = (data, tar_index) => {
      let { modalVisibleLive, modalVisible, modalVisibleGoods } = this.state;
      let tar_data = data.data.filter((item, index) => index == tar_index)[0];
      if (tar_data.data_type == 'goods') {
          this.sele_more_goods = {
              info: tar_data.info,//选择的商品数组
              ids: tar_data.ids,//选择的商品id数组
              min_num: 2//最少选择2个
          };
          modalVisibleGoods = true;
      } else if (tar_data.data_type == 'live') {
          this.sele_more_live = {
              info: tar_data.info,//选择的直播数组
              ids: tar_data.ids,//选择的直播id数组
              min_num: 2//最少选择2个
          };
          modalVisibleLive = true;
      } else if (tar_data.data_type == 'svideo') {
          this.sele_more_svideo = {
              info: tar_data.info,//选择的短视频数组
              ids: tar_data.ids,//选择的短视频id数组
              min_num: 2//最少选择2个
          };
          modalVisible = true;
      }
      this.oprate_more_tab_index = tar_index;//TAB切换当前操作的数据index
      this.setState({
          modalVisibleLive,
          modalVisible,
          modalVisibleGoods
      });
  };

  //直播添加事件
  selMoreLive = (data) => {
      let { sle_more_title } = this.state;
      this.sele_more_live.info = data.data.info;
      this.sele_more_live.ids = data.data.ids;
      if (data.show_style == 'one' || data.show_style == 'five') {
          this.sele_more_live = {
              info: this.sele_more_live.info,//选择的直播数组
              ids: this.sele_more_live.ids,//选择的直播id数组
              total_num: 2//只能选择2个
          };
          sle_more_title = '选择直播(只能选择2个)';
      } else if (data.show_style == 'two') {
          this.sele_more_live = {
              info: this.sele_more_live.info,//选择的直播数组
              ids: this.sele_more_live.ids,//选择的直播id数组
              min_num: 3,//最少选择3个
              max_num: 15//最多选择15个
          };
          sle_more_title = '选择直播(最少选择3个，最多选择15个)';
      }
      this.setState({
          modalVisibleLive: true,
          sle_more_title
      });
  };

  changeSingle(val, type){
      this.props.handleCurSelData({ [type]: val });
  }

  renderMoreTabSeleData = (data, type, tar_index) => {
      let con = '';
      if (type == 'goods') {
          con = <Fragment>
              <div className={`${styles.selected_svideo_list_title}`}>
                  <span style={{ width: 50 }}>序号</span>
                  <span style={{ width: 176 }}>商品信息</span>
                  <span style={{ width: 80 }}>价格</span>
                  <span style={{ width: 50 }}>操作</span>
              </div>
              <div className={`${styles.selected_svideo_list}`}>
                  {data.map((svideo_item, svideo_index) => <div className={`${styles.selected_svideo_item} ${global.flex_row_start_center}`}>
                      <span style={{ width: 50 }}>{svideo_index + 1}</span>
                      <div className={`${styles.svideo_info} ${global.flex_row_start_center}`}>
                          <div className={`${styles.left} ${global.flex_row_center_center}`}>
                              <img src={svideo_item.mainImage} />
                          </div>
                          <div className={`${styles.right} ${global.flex_column_start_start}`}>
                              <span className={styles.video_name}>{svideo_item.skuName}</span>
                          </div>
                      </div>
                      <span style={{ width: 80 }}>{svideo_item.salePrice * 1}</span>
                      <div
                          onClick={() => this.delGoods(svideo_item.sku, tar_index)}
                          className={`${styles.operate} ${global.flex_row_center_center}`}
                      >
                          <ALibbSvg fill="#2d2d2d" width={18} height={18} type="shanchu5" />
                      </div>
                  </div>)}
              </div>
          </Fragment>;
      } else if (type == 'svideo') {
          con = <Fragment>
              <div className={`${styles.selected_svideo_list_title}`}>
                  <span style={{ width: 50 }}>序号</span>
                  <span style={{ width: 176 }}>短视频信息</span>
                  <span style={{ width: 80 }}>播放量</span>
                  <span style={{ width: 50 }}>操作</span>
              </div>
              <div className={`${styles.selected_svideo_list}`}>
                  {data.map((svideo_item, svideo_index) => <div className={`${styles.selected_svideo_item} ${global.flex_row_start_center}`}>
                      <span style={{ width: 50 }}>{svideo_index + 1}</span>
                      <div className={`${styles.svideo_info} ${global.flex_row_start_center}`}>
                          <div className={`${styles.left} ${global.flex_row_center_center}`}>
                              <img src={svideo_item.videoImage} />
                              <div className={`${styles.play_icon}`}>
                                  <ALibbSvg fill="#fff" width={22} height={22} type="bofang11" />
                              </div>
                          </div>
                          <div className={`${styles.right} ${global.flex_column_start_start}`}>
                              <span className={styles.video_name}>{svideo_item.videoName}</span>
                              <span className={styles.video_label}>{svideo_item.labelName}</span>
                          </div>
                      </div>
                      <span style={{ width: 80 }}>{svideo_item.click_num}</span>
                      <div
                          onClick={() => this.delSvideo(svideo_item.videoId, tar_index)}
                          className={`${styles.operate} ${global.flex_row_center_center}`}
                      >
                          <ALibbSvg fill="#2d2d2d" width={18} height={18} type="shanchu5" />
                      </div>
                  </div>)}
              </div>
          </Fragment>;
      } else if (type == 'live') {
          con = <Fragment>
              <div className={`${styles.selected_svideo_list_title}`}>
                  <span style={{ width: 50 }}>序号</span>
                  <span style={{ width: 176 }}>直播信息</span>
                  <span style={{ width: 80 }}>播放量</span>
                  <span style={{ width: 50 }}>操作</span>
              </div>
              <div className={`${styles.selected_svideo_list}`}>
                  {data.map((svideo_item, svideo_index) => <div className={`${styles.selected_svideo_item} ${global.flex_row_start_center}`}>
                      <span style={{ width: 50 }}>{svideo_index + 1}</span>
                      <div className={`${styles.svideo_info} ${global.flex_row_start_center}`}>
                          <div className={`${styles.left} ${global.flex_row_center_center}`}>
                              <img src={svideo_item.liveCover} />
                              <div className={`${styles.play_icon}`}>
                                  <ALibbSvg fill="#fff" width={22} height={22} type="bofang11" />
                              </div>
                          </div>
                          <div className={`${styles.right} ${global.flex_column_start_start}`}>
                              <span className={styles.video_name}>{svideo_item.liveName}</span>
                              <span className={styles.video_label}>{svideo_item.labelName}</span>
                          </div>
                      </div>
                      <span style={{ width: 80 }}>{svideo_item.viewingNum}</span>
                      <div
                          onClick={() => this.delLive(svideo_item.liveId, tar_index)}
                          className={`${styles.operate} ${global.flex_row_center_center}`}
                      >
                          <ALibbSvg fill="#2d2d2d" width={18} height={18} type="shanchu5" />
                      </div>
                  </div>)}
              </div>
          </Fragment>;
      }
      return con;
  };

  renderItem = (data) => {
      const { getFieldDecorator } = this.props.form;
      const { showColorPicker, showColorPicker2 } = this.state;
      let con = '';
      this.props.form.resetFields(['activity_border_radius','tjsp_isshow_sales','tjsp_show_style','tjsp_border_radius','tjsp_border_style','live_border_radius']);
      if (data.type == 'top_cat_nav') {
      //轮播
          con = <Fragment>
              <div className={`${styles.sub_part}`}>
                  <div className={`${styles.subtitle}`}>轮播背景设置</div>
                  <FormItem
                      key="top_cat_nav_swiper_bg_style"
                      label=""
                  >
                      <Radio.Group defaultValue={data.swiper_bg_style} onChange={(e) => this.onChange(e.target.value, 'swiper_bg_style')}>
                          <Radio value={1}>纯色弧度</Radio>
                          <Radio value={2}>渐变</Radio>
                      </Radio.Group>
                  </FormItem>
              </div>
              <div className={`${styles.sub_part}`} style={{ borderBottomWidth: 0 }}>
                  <div className={`${styles.subtitle}`}>轮播图片</div>
                  <FormItem
                      key="top_cat_nav_swiper_img"
                      style={{ width: '100%' }}
                      label=""
                  >
                      <div className={global.flex_com_column_start_start}>
                          {data.data.length > 0 && data.data.map((item, index) => this.renderLunBo(item, index, '宽710*高280'))}
                          <div
                              className={`${styles.add_goods_wrap} ${global.flex_row_center_center}`}
                              onClick={() => this.addTopCatNav(data)}
                          >
                + 添加图片
                          </div>
                      </div>
                  </FormItem>
              </div>
          </Fragment>;
      }else if (data.type == 'lunbo') {
      //轮播
          con = <Fragment>
              <div className={`${styles.sub_part}`}>
                  <div className={`${styles.subtitle}`}>是否展示高斯模糊</div>
                  <FormItem
                      key="more_tab_showVague"
                      label=""
                  >
                      {getFieldDecorator('more_tab_showVague', { initialValue: data.showVague })(
                          <Radio.Group onChange={(e) => this.changeSingle(e.target.value, 'showVague')}>
                              <Radio value>展示</Radio>
                              <Radio value={false}>隐藏</Radio>
                          </Radio.Group>,
                      )}
                  </FormItem>
              </div>
              <div className={`${styles.sub_part}`} style={{ borderBottomWidth: 0 }}>
                  <div className={`${styles.subtitle}`}>轮播图片</div>
                  <FormItem
                      key="lunbo_img"
                      style={{ width: '100%' }}
                      label=""
                  >
                      <div className={global.flex_com_column_start_start}>
                          {data.data.length > 0 && data.data.map((item, index) => this.renderLunBo(item, index, '宽710,高不限制'))}
                          <div
                              className={`${styles.add_goods_wrap} ${global.flex_row_center_center}`}
                              onClick={() => this.addLunbo(data)}
                          >
                + 添加图片
                          </div>
                      </div>
                  </FormItem>
              </div>
          </Fragment>;
      } else if (data.type == 'nav') {
      //导航
          con = <Fragment>
              <div className={`${styles.sub_part}`}>
                  <div className={`${styles.subtitle}`}>显示风格</div>
                  <FormItem
                      key="nav_style_set"
                      label=""
                  >
                      <Radio.Group defaultValue={data.style_set} onChange={(e) => this.onChange(e.target.value, 'style_set')}>
                          <Radio value="nav">导航</Radio>
                          <Radio value="tag-nav">分组</Radio>
                      </Radio.Group>
                  </FormItem>
              </div>
              {data.style_set == 'nav' &&
              <div className={`${styles.sub_part}`}>
                  <div className={`${styles.subtitle}`}>显示图标</div>
                  <FormItem
                      key="nav_icon_set"
                      label=""
                  >
                      <Radio.Group defaultValue={data.icon_set} onChange={(e) => this.onChange(e.target.value, 'icon_set')}>
                          <Radio value="up">图标居上</Radio>
                          <Radio value="left">图标居左</Radio>
                          <Radio value="no-icon">不显示图标</Radio>
                      </Radio.Group>
                  </FormItem>
              </div>
              }
              {data.style_set == 'nav' &&
              <div className={`${styles.sub_part}`}>
                  <div className={`${styles.subtitle}`}>图标大小</div>
                  <FormItem
                      key="slide"
                      label=""
                  >
                      <Slider min={30} max={80} defaultValue={data.slide} onChange={(e) => this.onChange(e, 'slide')} />
                  </FormItem>
              </div>
              }
              <div className={`${styles.sub_part}`} style={{ borderBottomWidth: 0 }}>
                  <div className={`${styles.subtitle}`}>导航图片</div>
                  <FormItem
                      key="nav_img"
                      label=""
                  >
                      <div className={global.flex_com_column_start_start}>
                          {data.data.length > 0 && data.data.map((item, index) => this.renderLunBo(item, index))}
                          <div
                              className={`${styles.add_goods_wrap} ${global.flex_row_center_center}`}
                              onClick={() => this.addNav(data)}
                          >
                + 添加导航
                          </div>
                      </div>
                  </FormItem>
              </div>
          </Fragment>;
      } else if (data.type == 'tupianzuhe') {
      //图片组合
          con = <Fragment>
              <div className={`${styles.sub_part}`}>
                  <div className={`${styles.subtitle}`}>展示风格</div>
                  <FormItem
                      key="svideo_show_style"
                      label=""
                  >
                      <div className={`${styles.com_default_styles} ${global.flex_com_row_start_center}`}>
                          {sld_m_diy_tpzh_style.map(item => <div
                              key={item.sele_style}
                              className={`${styles.svideo_show_style_item} ${global.flex_com_row_center} ${data.sele_style == item.sele_style ? styles.sel_svideo_show_style : null}`}
                              onClick={() => this.handleTuPianZuHeStyle(item.sele_style)}
                          >
                              <img src={item.img} />
                          </div>)}
                      </div>
                  </FormItem>
              </div>
              <div className={`${styles.sub_part}`} style={{ borderBottomWidth: 0 }}>
                  <div className={`${styles.subtitle}`}>上传图片</div>
                  <FormItem
                      key="nav_img"
                      label=""
                  >
                      <div className={global.flex_com_column_start_start}>
                          {data.data.length > 0 && data.data.map((item, index) => {
                              let upload_tip = '';
                              if (data.sele_style == 0 || data.sele_style == 1) {
                                  upload_tip = '宽750,高不限制';
                              } else if (data.sele_style == 2) {
                                  upload_tip = '宽300*高300';
                              } else if (data.sele_style == 3) {
                                  upload_tip = '宽200*高200';
                              } else if (data.sele_style == 4) {
                                  if (index == 0) {
                                      upload_tip = '宽300*高320';
                                  } else {
                                      upload_tip = '宽300*高150';
                                  }
                              } else if (data.sele_style == 5) {
                                  if (index == 0 || index == 3) {
                                      upload_tip = '宽200*高200';
                                  } else {
                                      upload_tip = '宽400*高200';
                                  }
                              } else if (data.sele_style == 6) {
                                  if (index == 0 || index == 3) {
                                      upload_tip = '宽300*高150';
                                  } else {
                                      upload_tip = '宽300*高300';
                                  }
                              } else if (data.sele_style == 7) {
                                  if (index == 4) {
                                      upload_tip = '宽200*高420';
                                  } else {
                                      upload_tip = '宽200*高200';
                                  }
                              }
                              return this.renderLunBo(item, index, upload_tip);
                          })}
                      </div>
                      {data.sele_style < 4 &&
                      <div
                          className={`${styles.add_goods_wrap} ${global.flex_row_center_center}`}
                          onClick={() => this.addNav(data)}
                      >
              + 添加图片
                      </div>
                      }
                  </FormItem>
              </div>
          </Fragment>;
      } else if (data.type == 'fzx') {
      //辅助线
          con = <Fragment>
              <div className={`${styles.sub_part}`}>
                  <div className={`${styles.subtitle}`}>颜色</div>
                  <FormItem
                      key="fzx_color"
                      label=""
                  >
                      <div className={styles.fzx_color_show}>
                          <div className={styles.show_color} onClick={() => this.showColorPicker('showColorPicker', true)}>
                              <span style={{ backgroundColor: data.color }} />
                          </div>
                          <a href="javascript:void(0)" onClick={() => this.onChange('#e3e5e9', 'color')}>重置</a>
                      </div>

                      {showColorPicker && (
                          <div className={styles.color_picker_wrap}>
                              <div
                                  className={styles.color_picker_mask}
                                  onClick={() => this.showColorPicker('showColorPicker', false)}
                              />
                              <SketchPicker
                                  color={data.color}
                                  onChangeComplete={(e) => this.onChange(`rgba(${e.rgb.r},${e.rgb.g},${e.rgb.b},${e.rgb.a})`, 'color')}
                              />
                          </div>
                      )}

                  </FormItem>
              </div>
              <div className={`${styles.sub_part}`}>
                  <div className={`${styles.subtitle}`}>上下边距</div>
                  <FormItem
                      key="fzx_tbmargin"
                      label=""
                  >
                      <Slider min={0} max={50} defaultValue={data.tbmargin} onChange={(e) => this.onChange(e, 'tbmargin')} />
                  </FormItem>
              </div>
              <div className={`${styles.sub_part}`}>
                  <div className={`${styles.subtitle}`}>左右边距</div>
                  <FormItem
                      key="fzx_lrmargin"
                      label=""
                  >
                      <Slider min={0} max={50} defaultValue={data.lrmargin} onChange={(e) => this.onChange(e, 'lrmargin')} />
                  </FormItem>
              </div>
              <div className={`${styles.sub_part}`} style={{ borderBottomWidth: 0 }}>
                  <div className={`${styles.subtitle}`}>样式</div>
                  <FormItem
                      key="fzx_border_type"
                      label=""
                  >
                      {getFieldDecorator('fzx_border_type', { initialValue: data.val })(
                          <Radio.Group onChange={(e) => this.onChange(e.target.value, 'val')}>
                              <Radio value="solid">实线</Radio>
                              <Radio value="dashed">虚线</Radio>
                              <Radio value="dotted">点线</Radio>
                          </Radio.Group>,
                      )}
                  </FormItem>
              </div>
          </Fragment>;
      } else if (data.type == 'fzkb') {
      //辅助线
          con = <Fragment>
              <div className={`${styles.sub_part}`}>
                  <div className={`${styles.subtitle}`}>颜色</div>
                  <FormItem
                      key="fzkb_color"
                      label=""
                  >
                      <div className={styles.fzx_color_show}>
                          <div className={styles.show_color} onClick={() => this.showColorPicker('showColorPicker', true)}>
                              <span style={{ backgroundColor: data.color }} />
                          </div>
                          <a href="javascript:void(0)" onClick={() => this.onChange('#fff', 'color')}>重置</a>
                      </div>

                      {showColorPicker && (
                          <div className={styles.color_picker_wrap}>
                              <div
                                  className={styles.color_picker_mask}
                                  onClick={() => this.showColorPicker('showColorPicker', false)}
                              />
                              <SketchPicker
                                  color={data.color}
                                  onChangeComplete={(e) => this.onChange(`rgba(${e.rgb.r},${e.rgb.g},${e.rgb.b},${e.rgb.a})`, 'color')}
                              />
                          </div>

                      )}

                  </FormItem>
              </div>
              <div className={`${styles.sub_part}`} style={{ borderBottomWidth: 0 }}>
                  <div className={`${styles.subtitle}`}>空白高度</div>
                  <FormItem
                      key="fzkb_text"
                      label=""
                  >
                      <Slider min={10} defaultValue={data.text} onChange={(e) => this.onChange(e, 'text')} />
                  </FormItem>
              </div>
          </Fragment>;
      } else if (data.type == 'fuwenben') {
      //富文本
          con = <Fragment>
              <div
                  className={global.goods_sku_tab}
                  style={{ display: 'flex', flex: 1, marginTop: 20, position: 'relative' }}
              >
                  <SldReactQuill
                      value={data.text}
                      getRQContent={(con1) => this.handleGetContent(con1, 'text')}
                      toolbarOptions={toolbarOptions}
                  />
              </div>
          </Fragment>;
      } else if (data.type == 'kefu') {
      //客服
          con = <Fragment>
              <div className={`${styles.sub_part}`}>
                  <div className={`${styles.subtitle}`}>客服文本</div>
                  <FormItem
                      key="kefu_text"
                      label=""
                  >
                      <Input
                          maxLength={10}
                          style={{ width: 300 }}
                          placeholder="请输入客服文本，最多10个字"
                          value={data.text}
                          onChange={(e) => this.onChange(e.target.value, 'text')}
                      />
                  </FormItem>
              </div>
              <div className={`${styles.sub_part}`} style={{ borderBottomWidth: 0 }}>
                  <div className={`${styles.subtitle}`}>客服电话</div>
                  <FormItem
                      key="kefu_tel"
                      label=""
                  >
                      <Input
                          maxLength={13}
                          style={{ width: 300 }}
                          placeholder="请输入客服电话"
                          value={data.tel}
                          onChange={(e) => this.onChange(e.target.value, 'tel')}
                      />
                  </FormItem>
              </div>
          </Fragment>;
      } else if (data.type == 'gonggao') {
      //公告
          con = <Fragment>
              <div className={`${styles.sub_part}`}>
                  <div className={`${styles.subtitle}`}>展示风格</div>
                  <FormItem
                      key="svideo_show_style"
                      label=""
                  >
                      <div className={`${styles.com_default_styles} ${global.flex_com_row_start_center}`}>
                          {sld_m_diy_notice_style.map(item => <div
                              key={item.key}
                              className={`${styles.notice_show_style_item} ${global.flex_com_row_center} ${data.show_style == item.key ? styles.sel_svideo_show_style : null}`}
                              onClick={() => this.handleNoticeStyle(item.key)}
                          >
                              <img src={item.value} />
                          </div>)}
                      </div>
                  </FormItem>
              </div>
              <div className={`${styles.sub_part}`}>
                  <div className={`${styles.subtitle}`}>公告内容</div>
                  <FormItem
                      key="gonggao_text"
                      label=""
                  >
                      <Input
                          maxLength={200}
                          style={{ width: 300 }}
                          placeholder="请输入公告内容,最多200字"
                          onChange={(e) => this.onChange(e.target.value, 'text')}
                          value={data.text}
                      />
                  </FormItem>
              </div>
              <div className={`${styles.sub_part}`} style={{ borderBottomWidth: 0 }}>
                  <div className={`${styles.subtitle}`}>公告链接</div>
                  <FormItem
                      key="gonggao_url"
                      label=""
                  >
                      <Select
                          value={data.url_type}
                          style={{ width: 300 }}
                          placeholder="请选择链接类型"
                          onSelect={this.sldHandSeleLink}
                          getPopupContainer={triggerNode => triggerNode.parentNode}
                      >
                          {m_diy_link_type().map((item, index) =>
                              <Option key={index} value={item.key}>{item.name}</Option>,
                          )}
                      </Select>
                  </FormItem>
              </div>
              {this.getDetailItem(data)}
          </Fragment>;
      } else if (data.type == 'dapei') {
      //搭配
          con = <Fragment>
              <div className={`${styles.sub_part}`}>
                  <div className={`${styles.subtitle}`}>搭配图片</div>
                  <FormItem
                      key="dapei_img"
                      label=""
                  >
                      <div className={`${styles.dape_img} ${global.flex_com_column_start_start}`}>
                          {data.dapei_img != '' &&
                          <div className={`${styles.upload_img} ${global.flex_com_row_center}`}>
                              <img src={data.dapei_img} />
                              <div className={styles.img_mask}>
                                  <span className={styles.img_del} onClick={() => this.delImg(data)}>
                                      {sldTsvg('shanchu4', '#fff', 15, 15)}
                                  </span>
                              </div>
                          </div>
                          }
                          <Upload
                              withCredentials
                              beforeUpload={sldBeforeUpload}
                              accept=".gif, .jpeg, .png,.jpg,"
                              showUploadList={false}
                              name="file"
                              action={`${apiUrl}v3/oss/common/upload?source=adminDeco`}
                              onChange={(info) => this.setImg(info)}
                              headers={{
                                  Authorization: `Bearer ${ getLocalStorageStingVal('sld_token')}`
                              }}
                          >
                              <Button>
                                  <Icon type="upload" /> 上传图片
                              </Button>
                          </Upload>
                          <span
                              className={styles.modal_tip_color}
                          >此处建议上传宽度为750，高度不限制的图片；支持格式gif，jpg，png。</span>
                      </div>
                  </FormItem>
              </div>
              <div className={`${styles.sub_part}`}>
                  <div className={`${styles.subtitle}`}>图片标题</div>
                  <FormItem
                      key="dapei_title"
                      label=""
                  >
                      <Input
                          maxLength={15}
                          style={{ width: 300 }}
                          placeholder="请输入图片标题"
                          onChange={(e) => this.onChange(e.target.value, 'dapei_title')}
                          value={data.dapei_title}
                      />
                  </FormItem>
              </div>
              <div className={`${styles.sub_part}`}>
                  <div className={`${styles.subtitle}`}>图片描述</div>
                  <FormItem
                      key="dapei_desc"
                      label=""
                  >
                      <Input
                          maxLength={50}
                          style={{ width: 300 }}
                          placeholder="请输入图片描述"
                          onChange={(e) => this.onChange(e.target.value, 'dapei_desc')}
                          value={data.dapei_desc}
                      />
                  </FormItem>
              </div>
              <div className={`${styles.sub_part}`} style={{ borderBottomWidth: 0 }}>
                  <div className={`${styles.subtitle}`}>选择商品</div>
                  <FormItem
                      key="dapei_goods"
                      label=""
                  >
                      <div className={`${styles.selected_svideo} ${global.flex_column_start_start}`}>
                          <div className={`${styles.add_svideo_wrap} ${global.flex_row_start_center}`}>
                              <span className={`${styles.required}`}>*</span>
                              <span className={`${styles.title}`}>商品添加:</span>
                              <a
                                  href="javascript:void(0)"
                                  className={`${styles.add_svideo_btn}`}
                                  onClick={() => this.selMoreGoods(data)}
                              >+ 添加</a>
                              <span className={`${styles.tip}`}>最少添加3个，最多添加9个</span>
                          </div>

                          {data.data.info.length > 0 &&
                          <Fragment>
                              <div className={`${styles.selected_svideo_list_title}`}>
                                  <span style={{ width: 50 }}>序号</span>
                                  <span style={{ width: 176 }}>商品信息</span>
                                  <span style={{ width: 80 }}>价格</span>
                                  <span style={{ width: 50 }}>操作</span>
                              </div>
                              <div className={`${styles.selected_svideo_list}`}>
                                  {data.data.info.map((svideo_item, svideo_index) => <div className={`${styles.selected_svideo_item} ${global.flex_row_start_center}`}>
                                      <span style={{ width: 50 }}>{svideo_index + 1}</span>
                                      <div className={`${styles.svideo_info} ${global.flex_row_start_center}`}>
                                          <div className={`${styles.left} ${global.flex_row_center_center}`}>
                                              <img src={svideo_item.mainImage} />
                                          </div>
                                          <div className={`${styles.right} ${global.flex_column_start_start}`}>
                                              <span className={styles.video_name}>{svideo_item.skuName}</span>
                                          </div>
                                      </div>
                                      <span style={{ width: 80 }}>{svideo_item.salePrice * 1}</span>
                                      <div
                                          onClick={() => this.delGoods(svideo_item.sku)}
                                          className={`${styles.operate} ${global.flex_row_center_center}`}
                                      >
                                          <ALibbSvg fill="#2d2d2d" width={18} height={18} type="shanchu5" />
                                      </div>
                                  </div>)}
                              </div>
                          </Fragment>
                          }
                      </div>
                  </FormItem>
              </div>
          </Fragment>;
      } else if (data.type == 'tuijianshangpin') {
      //推荐商品
          con = <Fragment>
              <div className={`${styles.sub_part}`}>
                  <div className={`${styles.subtitle}`}>商品标题</div>
                  <FormItem
                      key="tjsp_title"
                      label=""
                  >
                      <Input
                          maxLength={16}
                          style={{ width: 263, marginLeft: 9 }}
                          placeholder="请输入商品标题，最多16个字"
                          onChange={(e) => this.onChange(e.target.value, 'title')}
                          value={data.title}
                      />,
                  </FormItem>
              </div>
              <div className={`${styles.sub_part}`}>
                  <div className={`${styles.subtitle}`}>商品销量</div>
                  <FormItem
                      key="tjsp_isshow_sales"
                      label=""
                  >
                      {getFieldDecorator('tjsp_isshow_sales', { initialValue: data.isshow_sales })(
                          <Radio.Group onChange={(e) => this.onChange(e.target.value, 'isshow_sales')}>
                              <Radio value>展示</Radio>
                              <Radio value={false}>隐藏</Radio>
                          </Radio.Group>,
                      )}
                  </FormItem>
              </div>
              <div className={`${styles.sub_part}`}>
                  <div className={`${styles.subtitle}`}>底部是否展示&#34没有更多了&#34提示字样</div>
                  <FormItem
                      key="tjsp_isShowMore"
                      label=""
                  >
                      {getFieldDecorator('tjsp_isShowMore', { initialValue: data.isShowMore })(
                          <Radio.Group onChange={(e) => this.onChange(e.target.value, 'isShowMore')}>
                              <Radio value>展示</Radio>
                              <Radio value={false}>隐藏</Radio>
                          </Radio.Group>,
                      )}
                  </FormItem>
              </div>
              <div className={`${styles.sub_part}`}>
                  <div className={`${styles.subtitle}`}>商品展示模式</div>
                  <FormItem
                      key="tjsp_show_style"
                      label=""
                  >
                      {getFieldDecorator('tjsp_show_style', { initialValue: data.show_style })(
                          <Radio.Group onChange={(e) => this.onChange(e.target.value, 'show_style')}>
                              <Radio value="big">大图</Radio>
                              <Radio value="small">一行两个</Radio>
                              <Radio value="list">列表</Radio>
                              <Radio value="bijia">比价</Radio>
                          </Radio.Group>,
                      )}
                  </FormItem>
              </div>
              <div className={`${styles.sub_part}`}>
                  <div className={`${styles.subtitle}`}>商品边角</div>
                  <FormItem
                      key="tjsp_border_radius"
                      label=""
                  >
                      {getFieldDecorator('tjsp_border_radius', { initialValue: data.border_radius })(
                          <Radio.Group onChange={(e) => this.onChange(e.target.value, 'border_radius')}>
                              <Radio value={10}>圆角</Radio>
                              <Radio value={0}>直角</Radio>
                          </Radio.Group>,
                      )}
                  </FormItem>
              </div>
              <div className={`${styles.sub_part}`}>
                  <div className={`${styles.subtitle}`}>商品样式</div>
                  <FormItem
                      key="tjsp_border_style"
                      label=""
                  >
                      {getFieldDecorator('tjsp_border_style', { initialValue: data.border_style })(
                          <Radio.Group onChange={(e) => this.onChange(e.target.value, 'border_style')}>
                              <Radio value="border_none">无边白底</Radio>
                              <Radio value="card-shadow">卡片投影</Radio>
                              <Radio value="border_eee">描边白底</Radio>
                              <Radio value="border_none_grey_bg">无边灰底</Radio>
                          </Radio.Group>,
                      )}
                  </FormItem>
              </div>
              <div className={`${styles.sub_part}`}>
                  <div className={`${styles.subtitle}`}>页面边距</div>
                  <FormItem
                      key="tjsp_page_margin"
                      label=""
                  >
                      <Slider
                          min={0}
                          max={30}
                          defaultValue={data.page_margin}
                          onChange={(e) => this.onChange(e, 'page_margin')}
                      />
                  </FormItem>
              </div>
              <div className={`${styles.sub_part}`}>
                  <div className={`${styles.subtitle}`}>商品间距</div>
                  <FormItem
                      key="tjsp_goods_margin"
                      label=""
                  >
                      <Slider
                          min={0}
                          max={20}
                          defaultValue={data.goods_margin}
                          onChange={(e) => this.onChange(e, 'goods_margin')}
                      />
                  </FormItem>
              </div>
              <div className={`${styles.sub_part}`}>
                  <div className={`${styles.subtitle}`}>加车图标</div>
                  <div className={`${styles.tjsp}`}>
                      <div className={`${styles.add_svideo_wrap} ${global.flex_row_start_center}`}>
                          {cart_icon_data().map((icon_item, icon_index) => <div
                              key={icon_index}
                              className={`${styles.cart_icon_wrap} ${data.cart_icon_type == icon_item.type ? styles.current : null}`}
                              onClick={() => this.onChange(icon_item.type, 'cart_icon_type')}
                              style={{ padding: icon_item.padding }}
                          >
                              <ALibbSvg fill="#F10D3B" width={icon_item.width} height={icon_item.width} type={icon_item.icon} />
                          </div>)}
                      </div>
                  </div>
              </div>

              <div className={`${styles.sub_part}`} style={{ borderBottomWidth: 0 }}>
                  <div className={`${styles.subtitle}`}>选择商品</div>
                  <FormItem
                      key="tjsp_goods"
                      label=""
                  >
                      <div className={`${styles.selected_svideo} ${global.flex_column_start_start}`}>
                          <div className={`${styles.add_svideo_wrap} ${global.flex_row_start_center}`}>
                              <span className={`${styles.required}`}>*</span>
                              <span className={`${styles.title}`}>商品添加:</span>
                              <a
                                  href="javascript:void(0)"
                                  className={`${styles.add_svideo_btn}`}
                                  onClick={() => this.selMoreGoods(data)}
                              >+ 添加</a>
                              <span className={`${styles.tip}`}>最少添加3个，最多添加9个</span>
                          </div>

                          {data.data.info.length > 0 &&
                          <Fragment>
                              <div className={`${styles.selected_svideo_list_title}`}>
                                  <span style={{ width: 50 }}>序号</span>
                                  <span style={{ width: 176 }}>商品信息</span>
                                  <span style={{ width: 80 }}>价格</span>
                                  <span style={{ width: 50 }}>操作</span>
                              </div>
                              <div className={`${styles.selected_svideo_list}`}>
                                  {data.data.info.map((svideo_item, svideo_index) => <div className={`${styles.selected_svideo_item} ${global.flex_row_start_center}`}>
                                      <span style={{ width: 50 }}>{svideo_index + 1}</span>
                                      <div className={`${styles.svideo_info} ${global.flex_row_start_center}`}>
                                          <div className={`${styles.left} ${global.flex_row_center_center}`}>
                                              <img src={svideo_item.mainImage} />
                                          </div>
                                          <div className={`${styles.right} ${global.flex_column_start_start}`}>
                                              <span className={styles.video_name}>{svideo_item.skuName}</span>
                                          </div>
                                      </div>
                                      <span style={{ width: 80 }}>{svideo_item.salePrice * 1}</span>
                                      <div
                                          onClick={() => this.delGoods(svideo_item.sku)}
                                          className={`${styles.operate} ${global.flex_row_center_center}`}
                                      >
                                          <ALibbSvg fill="#2d2d2d" width={18} height={18} type="shanchu5" />
                                      </div>
                                  </div>)}
                              </div>
                          </Fragment>
                          }
                      </div>
                  </FormItem>
              </div>
          </Fragment>;
      } else if (data.type == 'svideo') {
      //短视频
          con = <Fragment>
              <div className={`${styles.sub_part}`}>
                  <div className={`${styles.subtitle}`}>展示风格</div>
                  <FormItem
                      key="svideo_show_style"
                      label=""
                  >
                      <div className={`${styles.com_default_styles} ${global.flex_com_row_start_center}`}>
                          {sld_m_diy_svideo_style.map(item => <div
                              key={item.sele_style}
                              className={`${styles.svideo_show_style_item} ${global.flex_com_row_center} ${data.show_style == item.sele_style ? styles.sel_svideo_show_style : null}`}
                              onClick={() => this.handleVideoStyle(item.sele_style)}
                          >
                              <img src={item.img} />
                          </div>)}
                      </div>
                  </FormItem>
              </div>
              <div className={`${styles.sub_part}`}>
                  <div className={`${styles.subtitle}`}>短视频卡片边角</div>
                  <FormItem
                      key="svideo_border_radius"
                      label=""
                  >
                      {getFieldDecorator('svideo_border_radius', { initialValue: data.border_radius })(
                          <Radio.Group onChange={(e) => this.onChange(e.target.value, 'border_radius')}>
                              <Radio value={8}>圆角</Radio>
                              <Radio value={0}>直角</Radio>
                          </Radio.Group>,
                      )}
                  </FormItem>
              </div>
              <div className={`${styles.sub_part}`}>
                  <div className={`${styles.subtitle}`}>设置标题</div>
                  <FormItem
                      key="svideo_title"
                      label=""
                  >
                      <Input
                          maxLength={10}
                          style={{ width: 300 }}
                          placeholder="请输入标题，最多10个字"
                          value={data.title}
                          onChange={(e) => this.onChange(e.target.value, 'title')}
                      />
                  </FormItem>
              </div>
              <div className={`${styles.sub_part}`} style={{ borderBottomWidth: 0 }}>
                  <div className={`${styles.subtitle}`}>添加短视频</div>
                  <FormItem
                      key="svideo_list"
                      label=""
                  >
                      <div className={`${styles.selected_svideo} ${global.flex_column_start_start}`}>
                          <div className={`${styles.add_svideo_wrap} ${global.flex_row_start_center}`}>
                              <span className={`${styles.required}`}>*</span>
                              <span className={`${styles.title}`}>视频添加:</span>
                              <a
                                  href="javascript:void(0)"
                                  className={`${styles.add_svideo_btn}`}
                                  onClick={() => this.selMoreSvideo(data)}
                              >+ 添加</a>
                              {/*<span className={`${styles.tip}`}>最多添加{this.sele_more_svideo.min_num}个</span>*/}
                          </div>

                          {data.data.info.length > 0 &&
                          <Fragment>
                              <div className={`${styles.selected_svideo_list_title}`}>
                                  <span style={{ width: 50 }}>序号</span>
                                  <span style={{ width: 176 }}>短视频信息</span>
                                  <span style={{ width: 80 }}>播放量</span>
                                  <span style={{ width: 50 }}>操作</span>
                              </div>
                              <div className={`${styles.selected_svideo_list}`}>
                                  {data.data.info.map((svideo_item, svideo_index) => <div className={`${styles.selected_svideo_item} ${global.flex_row_start_center}`}>
                                      <span style={{ width: 50 }}>{svideo_index + 1}</span>
                                      <div className={`${styles.svideo_info} ${global.flex_row_start_center}`}>
                                          <div className={`${styles.left} ${global.flex_row_center_center}`}>
                                              <img src={svideo_item.videoImage} />
                                              <div className={`${styles.play_icon}`}>
                                                  <ALibbSvg fill="#fff" width={22} height={22} type="bofang11" />
                                              </div>
                                          </div>
                                          <div className={`${styles.right} ${global.flex_column_start_start}`}>
                                              <span className={styles.video_name}>{svideo_item.videoName}</span>
                                              <span className={styles.video_label}>{svideo_item.labelName}</span>
                                          </div>
                                      </div>
                                      <span style={{ width: 80 }}>{svideo_item.click_num}</span>
                                      <div
                                          onClick={() => this.delSvideo(svideo_item.videoId)}
                                          className={`${styles.operate} ${global.flex_row_center_center}`}
                                      >
                                          <ALibbSvg fill="#2d2d2d" width={18} height={18} type="shanchu5" />
                                      </div>
                                  </div>)}
                              </div>
                          </Fragment>
                          }

                      </div>

                  </FormItem>
              </div>
          </Fragment>;
      } else if (data.type == 'live') {
      //直播
          con = <Fragment>
              <div className={`${styles.sub_part}`}>
                  <div className={`${styles.subtitle}`}>展示风格</div>
                  <FormItem
                      key="live_show_style"
                      label=""
                  >
                      <div className={`${styles.com_default_styles} ${global.flex_com_row_start_center}`}>
                          {sld_m_diy_live_style.map(item => <div
                              key={item.sele_style}
                              className={`${styles.svideo_show_style_item} ${global.flex_com_row_center} ${data.show_style == item.sele_style ? styles.sel_svideo_show_style : null}`}
                              onClick={() => this.handleLiveStyle(item.sele_style)}
                          >
                              <img src={item.img} />
                          </div>)}
                      </div>
                  </FormItem>
              </div>
              <div className={`${styles.sub_part}`}>
                  <div className={`${styles.subtitle}`}>直播卡片边角</div>
                  <FormItem
                      key="live_border_radius"
                      label=""
                  >
                      {getFieldDecorator('live_border_radius', { initialValue: data.border_radius })(
                          <Radio.Group onChange={(e) => this.onChange(e.target.value, 'border_radius')}>
                              <Radio value={8}>圆角</Radio>
                              <Radio value={0}>直角</Radio>
                          </Radio.Group>,
                      )}
                  </FormItem>
              </div>
              <div className={`${styles.sub_part}`}>
                  <div className={`${styles.subtitle}`}>设置标题</div>
                  <FormItem
                      key="live_title"
                      label=""
                  >
                      <Input
                          maxLength={10}
                          style={{ width: 300 }}
                          placeholder="请输入标题，最多10个字"
                          value={data.title}
                          onChange={(e) => this.onChange(e.target.value, 'title')}
                      />
                  </FormItem>
              </div>
              <div className={`${styles.sub_part}`} style={{ borderBottomWidth: 0 }}>
                  <div className={`${styles.subtitle}`}>添加直播</div>
                  <FormItem
                      key="live_list"
                      label=""
                  >
                      <div className={`${styles.selected_svideo} ${global.flex_column_start_start}`}>
                          <div className={`${styles.add_svideo_wrap} ${global.flex_row_start_center}`}>
                              <span className={`${styles.required}`}>*</span>
                              <span className={`${styles.title}`}>直播添加:</span>
                              <a
                                  href="javascript:void(0)"
                                  className={`${styles.add_svideo_btn}`}
                                  onClick={() => this.selMoreLive(data)}
                              >+ 添加</a>
                              {/*<span className={`${styles.tip}`}>最多添加30个</span>*/}
                          </div>

                          {data.data.info.length > 0 &&
                          <Fragment>
                              <div className={`${styles.selected_svideo_list_title}`}>
                                  <span style={{ width: 50 }}>序号</span>
                                  <span style={{ width: 176 }}>直播信息</span>
                                  <span style={{ width: 80 }}>播放量</span>
                                  <span style={{ width: 50 }}>操作</span>
                              </div>
                              <div className={`${styles.selected_svideo_list}`}>
                                  {data.data.info.map((svideo_item, svideo_index) => <div className={`${styles.selected_svideo_item} ${global.flex_row_start_center}`}>
                                      <span style={{ width: 50 }}>{svideo_index + 1}</span>
                                      <div className={`${styles.svideo_info} ${global.flex_row_start_center}`}>
                                          <div className={`${styles.left} ${global.flex_row_center_center}`}>
                                              <img src={svideo_item.liveCover} />
                                              <div className={`${styles.play_icon}`}>
                                                  <ALibbSvg fill="#fff" width={22} height={22} type="bofang11" />
                                              </div>
                                          </div>
                                          <div className={`${styles.right} ${global.flex_column_start_start}`}>
                                              <span className={styles.video_name}>{svideo_item.liveName}</span>
                                              <span className={styles.video_label}>{svideo_item.labelName}</span>
                                          </div>
                                      </div>
                                      <span style={{ width: 80 }}>{svideo_item.viewingNum}</span>
                                      <div
                                          onClick={() => this.delLive(svideo_item.liveId)}
                                          className={`${styles.operate} ${global.flex_row_center_center}`}
                                      >
                                          <ALibbSvg fill="#2d2d2d" width={18} height={18} type="shanchu5" />
                                      </div>
                                  </div>)}
                              </div>
                          </Fragment>
                          }

                      </div>

                  </FormItem>
              </div>
          </Fragment>;
      } else if (data.type == 'more_tab') {
      //TAB切换
          con = <Fragment>
              <div className={`${styles.sub_part}`}>
                  <div className={`${styles.subtitle}`}>底部是否展示&#34没有更多了&#34提示字样</div>
                  <FormItem
                      key="more_tab_isShowMore"
                      label=""
                  >
                      {getFieldDecorator('more_tab_isShowMore', { initialValue: data.isShowMore })(
                          <Radio.Group onChange={(e) => this.changeSingle(e.target.value, 'isShowMore')}>
                              <Radio value>展示</Radio>
                              <Radio value={false}>隐藏</Radio>
                          </Radio.Group>,
                      )}
                  </FormItem>
              </div>
              <div className={`${styles.sub_part}`} style={{ borderBottomWidth: 0 }}>
                  <div className={`${styles.subtitle}`}>数据卡片边角</div>
                  <FormItem
                      key="more_tab_border_radius"
                      label=""
                  >
                      {getFieldDecorator('more_tab_border_radius', { initialValue: data.border_radius })(
                          <Radio.Group onChange={(e) => this.onChange(e.target.value, 'border_radius')}>
                              <Radio value={8}>圆角</Radio>
                              <Radio value={0}>直角</Radio>
                          </Radio.Group>,
                      )}
                  </FormItem>
              </div>
              <div className={`${styles.sub_part}`}>
                  <div className={`${styles.subtitle}`}>商品展示模式</div>
                  <FormItem
                      key="more_tab_show_style"
                      label=""
                  >
                      {getFieldDecorator('more_tab_show_style', { initialValue: data.show_style })(
                          <Radio.Group onChange={(e) => this.changeSingle(e.target.value, 'show_style')}>
                              <Radio value="small">一行两个</Radio>
                              <Radio value="bijia">比价列表</Radio>
                          </Radio.Group>,
                      )}
                  </FormItem>
              </div>
              {data.data.length > 0 && data.data.map((more_tab_item, more_tab_index) => <div key={more_tab_index} className={`${styles.selected_more_tab} ${global.flex_column_start_start}`}>
                  <div
                      className={`${global.flex_com_column_flex_end} ${styles.del_sld_more_tab_item}`}
                      onClick={() => this.delSldComImg(more_tab_index)}
                  >
                      {sldTsvg('qingchu', '#666', 16, 16)}
                  </div>
                  <div
                      className={`${styles.add_svideo_wrap} ${global.flex_row_start_center}`}
                      style={{ paddingTop: 15, paddingBottom: 5 }}
                  >
                      <span className={`${styles.required}`}>*</span>
                      <span className={`${styles.title}`}>分类标题:</span>
                      <FormItem
                          key="gonggao_text"
                          label=""
                      >
                          <Input
                              maxLength={4}
                              style={{ width: 263, marginLeft: 9 }}
                              placeholder="请输入分类标题，最多4个字"
                              onChange={(e) => this.onChange(e.target.value, 'title', more_tab_index)}
                              value={more_tab_item.title}
                          />
                      </FormItem>
                  </div>
                  <div className={`${styles.add_svideo_wrap} ${global.flex_row_start_center}`} style={{ paddingBottom: 5 }}>
                      <span className={`${styles.required}`} style={{ marginLeft: 29 }}>*</span>
                      <span className={`${styles.title}`}>子标题:</span>
                      <FormItem
                          key="gonggao_sub_title"
                          label=""
                      >
                          <Input
                              maxLength={6}
                              style={{ width: 263, marginLeft: 9 }}
                              placeholder="请输入分类子标题，最多6个字"
                              onChange={(e) => this.onChange(e.target.value, 'sub_title', more_tab_index)}
                              value={more_tab_item.sub_title}
                          />
                      </FormItem>
                  </div>
                  <div className={`${styles.add_svideo_wrap} ${global.flex_row_start_center}`}>
                      <span className={`${styles.required}`}>*</span>
                      <span className={`${styles.title}`}>数据类型:</span>
                      <FormItem
                          key={`more_tab_data_type_${ more_tab_index}`}
                          label=""
                      >
                          {getFieldDecorator(`more_tab_data_type_${ more_tab_index}`, { initialValue: more_tab_item.data_type })(
                              <Radio.Group
                                  onChange={(e) => this.onChange(e.target.value, 'data_type', more_tab_index)}
                                  style={{ marginLeft: 10 }}
                              >
                                  <Radio value="goods">商品</Radio>
                                  <Radio value="live">直播</Radio>
                                  <Radio value="svideo">短视频</Radio>
                              </Radio.Group>,
                          )}
                      </FormItem>
                  </div>
                  {more_tab_item.data_type == 'goods' &&
                  <div
                      className={`${styles.add_svideo_wrap} ${global.flex_row_start_center} ${styles.add_cart_icon_special}`}
                  >
                      <span className={`${styles.required}`}>*</span>
                      <span className={`${styles.title}`} style={{ marginRight: 10 }}>加车图标:</span>
                      {cart_icon_data().map((icon_item, icon_index) => <div
                          key={icon_index}
                          className={`${styles.cart_icon_wrap} ${more_tab_item.cart_icon_type == icon_item.type ? styles.current : null}`}
                          onClick={() => this.onChange(icon_item.type, 'cart_icon_type', more_tab_index)}
                          style={{ padding: icon_item.padding }}
                      >
                          <ALibbSvg fill="#F10D3B" width={icon_item.width} height={icon_item.width} type={icon_item.icon} />
                      </div>)}
                  </div>
                  }
                  <div
                      className={`${styles.add_svideo_wrap} ${global.flex_row_start_center} ${styles.add_data_special}`}
                      style={{ height: 70 }}
                  >
                      <span className={`${styles.required}`}>*</span>
                      <span className={`${styles.title}`}>数据添加:</span>
                      <a
                          href="javascript:void(0)"
                          className={`${styles.add_svideo_btn}`}
                          onClick={() => this.selMoreTabData(data, more_tab_index)}
                      >+ 添加</a>
                      <span className={`${styles.tip}`}>需要选择偶数个,最少2个</span>
                  </div>
                  {more_tab_item.info.length > 0 && this.renderMoreTabSeleData(more_tab_item.info, more_tab_item.data_type, more_tab_index)}
              </div>)}
              <div
                  className={`${styles.add_goods_wrap} ${global.flex_row_center_center}`}
                  onClick={() => this.addMoreTabNav(data)}
              >
          + 添加分类导航
              </div>
          </Fragment>;
      } else if (data.type == 'activity') {
      //活动组
          con = <Fragment>
              <div className={`${styles.sub_part}`}>
                  <div className={`${styles.subtitle}`}>活动类型</div>
                  <FormItem
                      key="activity_show_style"
                      label=""
                  >
                      <div className={`${styles.com_default_styles} ${global.flex_com_row_start_center}`}>
                          {sld_m_diy_activity_style.map(item => <div
                              key={item.sele_style}
                              className={`${styles.svideo_show_style_item} ${global.flex_com_row_center} ${data.show_style == item.sele_style ? styles.sel_svideo_show_style : null}`}
                              onClick={() => this.handleActivityStyle(item.sele_style)}
                          >
                              <img src={item.img} />
                          </div>)}
                      </div>
                  </FormItem>
              </div>
              <div className={`${styles.sub_part}`}>
                  <div className={`${styles.subtitle}`}>数据卡片边角</div>
                  <FormItem
                      key="activity_border_radius"
                      label=""
                  >
                      {getFieldDecorator('activity_border_radius', { initialValue: data.border_radius })(
                          <Radio.Group onChange={(e) => this.onChange(e.target.value, 'border_radius')}>
                              <Radio value={8}>圆角</Radio>
                              <Radio value={0}>直角</Radio>
                          </Radio.Group>,
                      )}
                  </FormItem>
              </div>
              <div className={`${styles.sub_part}`}>
                  <div className={`${styles.subtitle}`}>活动标签背景颜色设置</div>
                  <FormItem
                      key="activity_tag_bg_color"
                      label=""
                  >
                      <div className={styles.fzx_color_show}>
                          <div className={styles.show_color} onClick={() => this.showColorPicker('showColorPicker2', true)}>
                              <span style={{ backgroundColor: data.tag_bg_color }} />
                          </div>
                          <a href="javascript:void(0)" onClick={() => this.onChange('', 'tag_bg_color')}>默认</a>
                      </div>

                      {showColorPicker2 && (
                          <div className={styles.color_picker_wrap}>
                              <div
                                  className={styles.color_picker_mask}
                                  onClick={() => this.showColorPicker('showColorPicker2', false)}
                              />
                              <SketchPicker
                                  color={data.tag_bg_color}
                                  onChangeComplete={(e) => this.onChange(`rgba(${e.rgb.r},${e.rgb.g},${e.rgb.b},${e.rgb.a})`, 'tag_bg_color')}
                              />
                          </div>
                      )}
                  </FormItem>
              </div>
              <div className={`${styles.sub_part}`}>
                  <div className={`${styles.subtitle}`}>活动主标题</div>
                  <FormItem
                      key="activity_title"
                      label=""
                  >
                      <Input
                          maxLength={15}
                          style={{ width: 300 }}
                          placeholder="请输入主标题，最多15个字"
                          onChange={(e) => this.onChange(e.target.value, 'title')}
                          value={data.title}
                      />
                  </FormItem>
              </div>
              {data.show_style != 'pin' &&
              <div className={`${styles.sub_part}`}>
                  <div className={`${styles.subtitle}`}>活动子标题</div>
                  <FormItem
                      key="activity_sub_title"
                      label=""
                  >
                      <Input
                          maxLength={50}
                          style={{ width: 300 }}
                          placeholder="请输入子标题，最多50个字"
                          onChange={(e) => this.onChange(e.target.value, 'sub_title')}
                          value={data.sub_title}
                      />
                  </FormItem>
              </div>
              }
              <div className={`${styles.sub_part}`} style={{ borderBottomWidth: 0 }}>
                  <div className={`${styles.subtitle}`}>选择商品</div>
                  <FormItem
                      key="activity_goods"
                      label=""
                  >
                      <div className={`${styles.selected_svideo} ${global.flex_column_start_start}`}>
                          <div className={`${styles.add_svideo_wrap} ${global.flex_row_start_center}`}>
                              <span className={`${styles.required}`}>*</span>
                              <span className={`${styles.title}`}>商品添加:</span>
                              <a
                                  href="javascript:void(0)"
                                  className={`${styles.add_svideo_btn}`}
                                  onClick={() => this.selMoreGoods(data)}
                              >+ 添加</a>
                              {/*<span className={`${styles.tip}`}>最少添加3个，最多添加9个</span>*/}
                          </div>

                          {data.data.info.length > 0 &&
                          <Fragment>
                              <div className={`${styles.selected_svideo_list_title}`}>
                                  <span style={{ width: 50 }}>序号</span>
                                  <span style={{ width: 176 }}>商品信息</span>
                                  <span style={{ width: 80 }}>价格</span>
                                  <span style={{ width: 50 }}>操作</span>
                              </div>
                              <div className={`${styles.selected_svideo_list}`}>
                                  {data.data.info.map((svideo_item, svideo_index) => <div className={`${styles.selected_svideo_item} ${global.flex_row_start_center}`}>
                                      <span style={{ width: 50 }}>{svideo_index + 1}</span>
                                      <div className={`${styles.svideo_info} ${global.flex_row_start_center}`}>
                                          <div className={`${styles.left} ${global.flex_row_center_center}`}>
                                              <img src={svideo_item.mainImage} />
                                          </div>
                                          <div className={`${styles.right} ${global.flex_column_start_start}`}>
                                              <span className={styles.video_name}>{svideo_item.skuName}</span>
                                          </div>
                                      </div>
                                      <span style={{ width: 80 }}>{svideo_item.salePrice * 1}</span>
                                      <div
                                          onClick={() => this.delGoods(svideo_item.sku)}
                                          className={`${styles.operate} ${global.flex_row_center_center}`}
                                      >
                                          <ALibbSvg fill="#2d2d2d" width={18} height={18} type="shanchu5" />
                                      </div>
                                  </div>)}
                              </div>
                          </Fragment>
                          }
                      </div>
                  </FormItem>
              </div>
          </Fragment>;
      }else if(data.type == 'tablan'){
          con = <Fragment>

              {data.data.length > 0 && data.data.map((more_tab_item, more_tab_index) => <div key={more_tab_index} className={`${styles.selected_more_tab} ${global.flex_column_start_start}`} style={{marginTop:'8px'}}>
                  <div
                      className={`${global.flex_com_column_flex_end} ${styles.del_sld_more_tab_item}`}
                      onClick={() => this.delSldComImg(more_tab_index)}
                  >
                      {sldTsvg('qingchu', '#666', 16, 16)}
                  </div>
                  <div
                      className={`${styles.add_svideo_wrap} ${global.flex_row_start_center}`}
                      style={{ paddingTop: 15, paddingBottom: 5 }}
                  >
                      <span className={`${styles.required}`}>*</span>
                      <span className={`${styles.title}`}>父标题:</span>
                      <FormItem
                          key="gonggao_text"
                          label=""
                      >
                          <Input
                              maxLength={16}
                              style={{ width: 263, marginLeft: 9 }}
                              placeholder="请输入父标题，最多16个字"
                              onChange={(e) => this.onChange(e.target.value, 'tabName', more_tab_index)}
                              value={more_tab_item.tabName}
                          />
                      </FormItem>
                  </div>
          
                  <div className={`${styles.sub_part}`} style={{ borderBottomWidth: 0 }}>
                      <div className={`${styles.subtitle}`}>导航图片</div>
                      <FormItem
                          key="nav_img"
                          label=""
                      >
                          <div className={global.flex_com_column_start_start}>
                              {data.data.length > 0 && data.data[more_tab_index].children.map((item, index) => 
                                  this.renderLunBo(item, index,'',more_tab_index) // 这里要传父index
                              )}
                              <div
                                  className={`${styles.add_goods_wrap} ${global.flex_row_center_center}`}
                                  onClick={() => this.addTabItem(data,more_tab_index)}
                              >
                      + 添加子项目
                              </div>
                          </div>
                      </FormItem>
                  </div>
              </div>)}


              <div
                  className={`${styles.add_goods_wrap} ${global.flex_row_center_center}`}
                  onClick={() => this.addTabLan(data)}
              >
          + 添加tab栏
              </div>
          </Fragment>;
      }else if(data.type == 'tabzixun'){
          con = <Fragment>
              <div>
                  <div className={`${styles.topSearchtitle}`}>点击更多跳转</div>
                  <FormItem
                      key="more_news"
                      label=""
                  >
                      <Input
                          maxLength={200}
                          style={{ width: 300 }}
                          placeholder="请输入点击更多跳转链接"
                          value={data.more_news}
                          onChange={(e) => this.changeSingle(e.target.value, 'more_news')}
                      />
                  </FormItem>
              </div>
              {data.data.length > 0 && data.data.map((more_tab_item, more_tab_index) => <div key={more_tab_index} className={`${styles.selected_more_tab} ${global.flex_column_start_start}`} style={{marginTop:'8px'}}>
                  <div
                      className={`${global.flex_com_column_flex_end} ${styles.del_sld_more_tab_item}`}
                      onClick={() => this.delSldComImg(more_tab_index)}
                  >
                      {sldTsvg('qingchu', '#666', 16, 16)}
                  </div>
                  <div
                      className={`${styles.add_svideo_wrap} ${global.flex_row_start_center}`}
                      style={{ paddingTop: 15, paddingBottom: 5 }}
                  >
                      <span className={`${styles.required}`}>*</span>
                      <span className={`${styles.title}`}>父标题:</span>
                      <FormItem
                          key="gonggao_text"
                          label=""
                      >
                          <Input
                              maxLength={16}
                              style={{ width: 263, marginLeft: 9 }}
                              placeholder="请输入父标题，最多16个字"
                              onChange={(e) => this.onChange(e.target.value, 'tabName', more_tab_index)}
                              value={more_tab_item.tabName}
                          />
                      </FormItem>
                  </div>
                  <div
                      className={`${styles.add_svideo_wrap} ${global.flex_row_start_center}`}
                      style={{ paddingTop: 15, paddingBottom: 5 }}
                  >
                      <span className={`${styles.required}`}>*</span>
                      <span className={`${styles.title}`}>标题id:</span>
                      <FormItem
                          key="gonggao_text"
                          label=""
                      >
                          <Input
                              maxLength={16}
                              style={{ width: 263, marginLeft: 9 }}
                              placeholder="请输入标题id，最多16个字"
                              onChange={(e) => this.onChange(e.target.value, 'categoryId', more_tab_index)}
                              value={more_tab_item.categoryId}
                          />
                      </FormItem>
                  </div>
              </div>)}
              <div>
                  <div className={`${styles.topSearchtitle}`}>新闻标题</div>
                  <FormItem
                      key="title"
                      label=""
                  >
                      <Input
                          maxLength={200}
                          style={{ width: 300 }}
                          placeholder="请输入新闻标题"
                          value={data.title}
                          onChange={(e) => this.changeSingle(e.target.value, 'title')}
                      />
                  </FormItem>
              </div>
              <div>
                  <div className={`${styles.topSearchtitle}`}>发布机构</div>
                  <FormItem
                      key="info"
                      label=""
                  >
                      <Input
                          maxLength={200}
                          style={{ width: 300 }}
                          placeholder="请输入发布机构"
                          value={data.info}
                          onChange={(e) => this.changeSingle(e.target.value, 'info')}
                      />
                  </FormItem>
              </div>
              <div>
                  <div className={`${styles.topSearchtitle}`}>新闻标识id</div>
                  <FormItem
                      key="link"
                      label=""
                  >
                      <Input
                          maxLength={200}
                          style={{ width: 300 }}
                          placeholder="请输入新闻标识id"
                          value={data.link}
                          onChange={(e) => this.changeSingle(e.target.value, 'link')}
                      />
                  </FormItem>
              </div>
              <div className={`${styles.sub_part}`} style={{ borderBottomWidth: 0 }}>
                  <div className={`${styles.subtitle}`}>新闻图片</div>
                  <FormItem
                      key="nav_img"
                      label=""
                  >
                      <div className={global.flex_com_column_start_start}>
                          {data.img.length > 0 && data.img.map((item, index) => this.renderLunBo(item, index))}
                      </div>
                  </FormItem>
              </div>
              <div
                  className={`${styles.add_goods_wrap} ${global.flex_row_center_center}`}
                  onClick={() => this.addTabNews(data)}
              >
          + 添加tab栏
              </div>
          </Fragment>;
      }else if(data.type == 'tabGroup'){
          con = <Fragment>
  
              {data.data.length > 0 && data.data.map((more_tab_item, more_tab_index) => <div key={more_tab_index} className={`${styles.selected_more_tab} ${global.flex_column_start_start}`} style={{marginTop:'8px'}}>
                  <div
                      className={`${global.flex_com_column_flex_end} ${styles.del_sld_more_tab_item}`}
                      onClick={() => this.delSldComImg(more_tab_index)}
                  >
                      {sldTsvg('qingchu', '#666', 16, 16)}
                  </div>
                  <div
                      className={`${styles.add_svideo_wrap} ${global.flex_row_start_center}`}
                      style={{ paddingTop: 15, paddingBottom: 5 }}
                  >
                      <span className={`${styles.required}`}>*</span>
                      <span className={`${styles.title}`}>父标题:</span>
                      <FormItem
                          key="gonggao_text"
                          label=""
                      >
                          <Input
                              maxLength={16}
                              style={{ width: 263, marginLeft: 9 }}
                              placeholder="请输入父标题，最多16个字"
                              onChange={(e) => this.onChange(e.target.value, 'tabName', more_tab_index)}
                              value={more_tab_item.tabName}
                          />
                      </FormItem>
                  </div>
            
                  <div className={`${styles.sub_part}`} style={{ borderBottomWidth: 0 }}>
                      <div className={`${styles.subtitle}`}>导航图片</div>
                      <FormItem
                          key="nav_img"
                          label=""
                      >
                          <div className={global.flex_com_column_start_start}>
                              {data.data.length > 0 && data.data[more_tab_index].children.map((item, index) => 
                                  this.renderLunBo(item, index,'',more_tab_index) // 这里要传父index
                              )}
                              <div
                                  className={`${styles.add_goods_wrap} ${global.flex_row_center_center}`}
                                  onClick={() => this.addTabItem(data,more_tab_index)}
                              >
                        + 添加子项目
                              </div>
                          </div>
                      </FormItem>
                  </div>
              </div>)}
  
  
              <div
                  className={`${styles.add_goods_wrap} ${global.flex_row_center_center}`}
                  onClick={() => this.addTabGroup(data)}
              >
            + 添加tabGroup
              </div>
          </Fragment>;
      }else if(data.type == 'zixun'){
          con = <Fragment>
              <div>
                  <div className={`${styles.sub_part}`}>
                      <div className={`${styles.subtitle}`}>图片边角</div>
                      <FormItem
                          key="news_border_radius"
                          label=""
                      >
                          {getFieldDecorator('news_border_radius', { initialValue: data.news_border_radius })(
                              <Radio.Group onChange={(e) => this.changeSingle(e.target.value, 'news_border_radius')}>
                                  <Radio value="8">圆角</Radio>
                                  <Radio value="0">直角</Radio>
                              </Radio.Group>,
                          )}
                      </FormItem>
                  </div>
                  <div className={`${styles.sub_part}`}>
                      <div className={`${styles.subtitle}`}>更多资讯</div>
                      <FormItem
                          key="more_news"
                          label=""
                      >
                          <Input
                              maxLength={200}
                              style={{ width: 300 }}
                              placeholder="请输入跳转链接"
                              value={data.more_news}
                              onChange={(e) => this.changeSingle(e.target.value, 'more_news')}
                          />
                      </FormItem>
                  </div>
                  {
                      data.data.length>0 && data.data.map((item,pIndex)=><div key={pIndex}> 
                          <div
                              className={`${global.flex_com_column_flex_end} ${styles.del_sld_more_tab_item}`}
                              onClick={() => this.delSldComImg(pIndex)}
                          >
                              {sldTsvg('qingchu', '#666', 16, 16)}
                          </div>
                          <div className={`${styles.sub_part}`}>
                              <div className={`${styles.subtitle}`}>展示风格</div>
                              <FormItem
                                  key={`news_style${pIndex}`}
                                  label=""
                              >
                                  {getFieldDecorator(`news_style${pIndex}`, { initialValue: item.news_style })(
                                      <Radio.Group onChange={(e) => this.onChange(e.target.value, 'news_style',pIndex)}>
                                          <Radio value="3">3图布局</Radio>
                                          <Radio value="1">1图布局</Radio>
                                      </Radio.Group>,
                                  )}
                              </FormItem>
                          </div>
                           
                          <div className={`${styles.sub_part}`}>
                              <div className={`${styles.subtitle}`}>新闻标题</div>
                              <FormItem
                                  key="title"
                                  label=""
                              >
                                  <Input
                                      maxLength={200}
                                      style={{ width: 300 }}
                                      placeholder="请输入标题，最多200个字"
                                      value={item.title}
                                      onChange={(e) => this.onChange(e.target.value, 'title',pIndex)}
                                  />
                              </FormItem>
                          </div>
                          <div className={`${styles.sub_part}`}>
                              <div className={`${styles.subtitle}`}>发布机构</div>
                              <FormItem
                                  key="live_title"
                                  label=""
                              >
                                  <Input
                                      maxLength={10}
                                      style={{ width: 300 }}
                                      placeholder="请输入发布机构，最多10个字"
                                      value={item.mediaName}
                                      onChange={(e) => this.onChange(e.target.value, 'mediaName',pIndex)}
                                  />
                              </FormItem>
                          </div>
                          <div className={`${styles.sub_part}`}>
                              <div className={`${styles.subtitle}`}>新闻标识id</div>
                              <FormItem
                                  key="live_title"
                                  label=""
                              >
                                  <Input
                                      maxLength={20}
                                      style={{ width: 300 }}
                                      placeholder="请输入新闻标识id，最多20个字"
                                      value={item.articleId}
                                      onChange={(e) => this.onChange(e.target.value, 'articleId',pIndex)}
                                  />
                              </FormItem>
                          </div>
                          <div className={`${styles.sub_part}`} style={{ borderBottomWidth: 0 }}>
                              <div className={`${styles.subtitle}`}>新闻图片</div>
                              <FormItem
                                  key="nav_img"
                                  label=""
                              >
                                  <div className={global.flex_com_column_start_start}>
                                      {data.data.length > 0 && data.data[pIndex].children.map((item1, index) => 
                                          this.renderLunBo(item1, index,'',pIndex) // 这里要传父index
                                      )}
                                      {
                                          (item.news_style==3&&item.children.length<3||item.news_style==1&&item.children.length<1) && <div
                                              className={`${styles.add_goods_wrap} ${global.flex_row_center_center}`}
                                              onClick={() => this.addTabItem(data,pIndex)}
                                          >
                                    + 添加图片
                                          </div>
                                      }
                                  </div>
                              </FormItem>
                          </div>
                      </div>)
                  }

                  <div
                      className={`${styles.add_goods_wrap} ${global.flex_row_center_center}`}
                      onClick={() => this.addNews(data)}
                  >
                    + 添加新闻
                  </div>
              </div>
          </Fragment>
      }else if(data.type == 'tuzixun'){
          con = <Fragment>
              <div>
                  <div className={`${styles.sub_part}`}>
                      <div className={`${styles.subtitle}`}>图片边角</div>
                      <FormItem
                          key="news_border_radius"
                          label=""
                      >
                          {getFieldDecorator('news_border_radius', { initialValue: data.news_border_radius })(
                              <Radio.Group onChange={(e) => this.changeSingle(e.target.value, 'news_border_radius')}>
                                  <Radio value="8">圆角</Radio>
                                  <Radio value="0">直角</Radio>
                              </Radio.Group>,
                          )}
                      </FormItem>
                  </div>
                  <div className={`${styles.sub_part}`}>
                      <div className={`${styles.subtitle}`}>更多资讯</div>
                      <FormItem
                          key="more_news"
                          label=""
                      >
                          <Input
                              maxLength={200}
                              style={{ width: 300 }}
                              placeholder="请输入跳转链接"
                              value={data.more_news}
                              onChange={(e) => this.changeSingle(e.target.value, 'more_news')}
                          />
                      </FormItem>
                  </div>
                  {
                      data.data.length>0 && data.data.map((item,pIndex)=><div key={pIndex}> 
                          <div
                              className={`${global.flex_com_column_flex_end} ${styles.del_sld_more_tab_item}`}
                              onClick={() => this.delSldComImg(pIndex)}
                          >
                              {sldTsvg('qingchu', '#666', 16, 16)}
                          </div>
                          <div className={`${styles.sub_part}`}>
                              <div className={`${styles.subtitle}`}>展示风格</div>
                              <FormItem
                                  key={`news_style${pIndex}`}
                                  label=""
                              >
                                  {getFieldDecorator(`news_style${pIndex}`, { initialValue: item.news_style })(
                                      <Radio.Group onChange={(e) => this.onChange(e.target.value, 'news_style',pIndex)}>
                                          <Radio value="3">3图布局</Radio>
                                          <Radio value="1">1图布局</Radio>
                                      </Radio.Group>,
                                  )}
                              </FormItem>
                          </div>
                             
                          <div className={`${styles.sub_part}`}>
                              <div className={`${styles.subtitle}`}>新闻标题</div>
                              <FormItem
                                  key="title"
                                  label=""
                              >
                                  <Input
                                      maxLength={200}
                                      style={{ width: 300 }}
                                      placeholder="请输入标题，最多200个字"
                                      value={item.title}
                                      onChange={(e) => this.onChange(e.target.value, 'title',pIndex)}
                                  />
                              </FormItem>
                          </div>
                          <div className={`${styles.sub_part}`}>
                              <div className={`${styles.subtitle}`}>发布机构</div>
                              <FormItem
                                  key="live_title"
                                  label=""
                              >
                                  <Input
                                      maxLength={10}
                                      style={{ width: 300 }}
                                      placeholder="请输入发布机构，最多10个字"
                                      value={item.mediaName}
                                      onChange={(e) => this.onChange(e.target.value, 'mediaName',pIndex)}
                                  />
                              </FormItem>
                          </div>
                          <div className={`${styles.sub_part}`}>
                              <div className={`${styles.subtitle}`}>新闻标识id</div>
                              <FormItem
                                  key="live_title"
                                  label=""
                              >
                                  <Input
                                      maxLength={20}
                                      style={{ width: 300 }}
                                      placeholder="请输入新闻标识id，最多20个字"
                                      value={item.articleId}
                                      onChange={(e) => this.onChange(e.target.value, 'articleId',pIndex)}
                                  />
                              </FormItem>
                          </div>
                          <div className={`${styles.sub_part}`} style={{ borderBottomWidth: 0 }}>
                              <div className={`${styles.subtitle}`}>新闻图片</div>
                              <FormItem
                                  key="nav_img"
                                  label=""
                              >
                                  <div className={global.flex_com_column_start_start}>
                                      {data.data.length > 0 && data.data[pIndex].children.map((item1, index) => 
                                          this.renderLunBo(item1, index,'',pIndex) // 这里要传父index
                                      )}
                                      {
                                          (item.news_style==3&&item.children.length<3||item.news_style==1&&item.children.length<1) && <div
                                              className={`${styles.add_goods_wrap} ${global.flex_row_center_center}`}
                                              onClick={() => this.addTabItem(data,pIndex)}
                                          >
                                      + 添加图片
                                          </div>
                                      }
                                  </div>
                              </FormItem>
                          </div>
                      </div>)
                  }
  
                  <div
                      className={`${styles.add_goods_wrap} ${global.flex_row_center_center}`}
                      onClick={() => this.addNews(data)}
                  >
                      + 添加新闻
                  </div>
              </div>
          </Fragment>
      }else if(data.type == 'zidingyi'){
          con = <Fragment>
              <div>
                  <div className={`${styles.sub_part}`}>
                      <div className={`${styles.subtitle}`}>展示风格</div>
                      <FormItem
                          key="zidingyi_style"
                          label=""
                      >
                          {getFieldDecorator('zidingyi_style', { initialValue: data.data.zidingyi_style })(
                              <Radio.Group onChange={(e) => this.onChange(e.target.value, 'zidingyi_style')}>
                                  <Radio value="1">上下布局</Radio>
                                  <Radio value="3">左右布局</Radio>
                              </Radio.Group>,
                          )}
                      </FormItem>
                  </div>

                  {data.data.zidingyi_style=="1"? 
                      <div>
                          <div className={`${styles.sub_part}`}>
                              <div className={`${styles.subtitle}`}>图片</div>
                              <FormItem
                                  key="nav_img"
                                  label=""
                              >
                                  <div className={global.flex_com_column_start_start}>
                                      { data.data.imglist.map((item, index) => this.renderLunBo(item, index,'','','imglist'))}
                                  </div>
                              </FormItem>
                          </div>
                          <div className={`${styles.sub_part}`} style={{ borderBottomWidth: 0 }}>
                              <div className={`${styles.subtitle}`}>商品信息</div>
                              <FormItem
                                  key="nav_img"
                                  label=""
                              >
                                  <div className={global.flex_com_column_start_start}>
                                      {data.data.children.length > 0 && data.data.children.map((item, index) => this.renderLunBo(item, index,'','','children'))}
                                      <div
                                          className={`${styles.add_goods_wrap} ${global.flex_row_center_center}`}
                                          onClick={() => this.addzidingyiItem(data)}
                                      >
                                + 添加子项目
                                      </div>
                                  </div>
                              </FormItem>
                          </div>
                      </div>
                      :<div>
                          <div className={`${styles.sub_part}`}>
                              <div className={`${styles.subtitle}`}>图片</div>
                              <FormItem
                                  key="nav_img"
                                  label=""
                              >
                                  <div className={global.flex_com_column_start_start}>
                                      { data.data.leftRightImglist.map((item, index) => this.renderLunBo(item, index,'','','leftRightImglist'))}
                                  </div>
                              </FormItem>
                          </div>
                          <div>
                              <div className={`${styles.topSearchtitle}`}>商品距离顶部距离</div>
                              <FormItem
                                  key="paddingTopVal"
                                  label=""
                              >
                                  <Input
                                      maxLength={200}
                                      style={{ width: 300 }}
                                      placeholder="请输入商品距离顶部距离"
                                      value={data.paddingTopVal}
                                      onChange={(e) => this.changeSingle(e.target.value, 'paddingTopVal')}
                                  />
                              </FormItem>
                          </div>
                          <div className={`${styles.sub_part}`} style={{ borderBottomWidth: 0 }}>
                              <div className={`${styles.subtitle}`}>商品信息</div>
                              <FormItem
                                  key="nav_img"
                                  label=""
                              >
                                  <div className={global.flex_com_column_start_start}>
                                      {data.data.leftRightChildren.length > 0 && data.data.leftRightChildren.map((item, index) => this.renderLunBo(item, index,'','','leftRightChildren'))}
                                      <div
                                          className={`${styles.add_goods_wrap} ${global.flex_row_center_center}`}
                                          onClick={() => this.addzidingyileftRightItem(data)}
                                      >
                                + 添加子项目
                                      </div>
                                  </div>
                              </FormItem>
                          </div>
                      </div>
                  }
                
              </div>   
          </Fragment>
      }else if(data.type == 'topSearch'){
          con = <Fragment>
              <div>
                  <div className={`${styles.topSearchtitle}`}>搜索框内容</div>
                  <FormItem
                      key="inputVal"
                      label=""
                  >
                      <Input
                          maxLength={200}
                          style={{ width: 300 }}
                          placeholder="请输入搜索框内容"
                          value={data.inputVal}
                          onChange={(e) => this.changeSingle(e.target.value, 'inputVal')}
                      />
                  </FormItem>
              </div>
              <div>
                  <div className={`${styles.topSearchtitle}`}>跳转链接地址</div>
                  <FormItem
                      key="linkVal"
                      label=""
                  >
                      <Input
                          maxLength={200}
                          style={{ width: 300 }}
                          placeholder="请输入跳转链接地址"
                          value={data.linkVal}
                          onChange={(e) => this.changeSingle(e.target.value, 'linkVal')}
                      />
                  </FormItem>
              </div>
            
              {/* 暂时不用
                <div className={`${styles.sub_part}`} style={{ borderBottomWidth: 0 }}>
                <div className={`${styles.subtitle}`}>是否固定在顶部</div>
                <FormItem
                    key={'topSearch_fixed'}
                    label={''}
                >
                    {getFieldDecorator('topSearch_fixed', { initialValue: data.fixed })(
                    <Radio.Group onChange={(e) => this.changeSingle(e.target.value, 'fixed')}>
                        <Radio value={true}>是</Radio>
                        <Radio value={false}>否</Radio>
                    </Radio.Group>,
                    )}
                </FormItem>
            </div> */}
              <div className={`${styles.sub_part}`} style={{ borderBottomWidth: 0 }}>
                  <div className={`${styles.subtitle}`}>是否展示右方内容</div>
                  <FormItem
                      key="topSearch_showRightText"
                      label=""
                  >
                      {getFieldDecorator('topSearch_showRightText', { initialValue: data.showRightText })(
                          <Radio.Group onChange={(e) => this.changeSingle(e.target.value, 'showRightText')}>
                              <Radio value>是</Radio>
                              <Radio value={false}>否</Radio>
                          </Radio.Group>,
                      )}
                  </FormItem>
              </div>
              {data.showRightText&&<div className={`${styles.sub_part}`} style={{ borderBottomWidth: 0 }}>
                  <div className={`${styles.subtitle}`}>点击弹窗或跳转链接</div>
                  <FormItem
                      key="topSearch_showUnion"
                      label=""
                  >
                      {getFieldDecorator('topSearch_showUnion', { initialValue: data.showUnion })(
                          <Radio.Group onChange={(e) => this.changeSingle(e.target.value, 'showUnion')}>
                              <Radio value>弹窗</Radio>
                              <Radio value={false}>链接</Radio>
                          </Radio.Group>,
                      )}
                  </FormItem>
              </div>
              }
              {(data.showRightText&&data.showUnion==false)&&<div>
                  <div className={`${styles.subtitle}`}>图片和链接</div>
                  <FormItem
                      key="data"
                      label=""
                  >   
                      {data.data.length > 0 && data.data.map((item, index) => this.renderLunBo(item, index))}
                  </FormItem>
              </div>
              }
            
          </Fragment>
      }else if(data.type == 'htmldoc'){
          //网页片段组件
          con = <Fragment>
              <div>
                  <div className={`${styles.topSearchtitle}`}>网页片段内容</div>
                  <FormItem
                      key="data"
                      label=""
                  >
                      <TextArea
                          autoSize={{ minRows: 2}}
                          style={{ width: 300 }}
                          placeholder="请输入网页片段内容"
                          value={data.data}
                          onChange={(e) => this.changeSingle(e.target.value, 'data')}
                          allowClear
                      />
                  </FormItem>
              </div>
          </Fragment>
      }else if(data.type == 'TuPianZuHe'){
          con = <Fragment>
              <div>
                  <div className={`${styles.topSearchtitle}`}>图片行数</div>
                  <FormItem
                      key="rowsNumber"
                      label=""
                  >
                      <Input
                          maxLength={200}
                          style={{ width: 300 }}
                          placeholder="请输入图片行数，1-9的整数"
                          value={data.rowsNumber}
                          onChange={(e) => this.changeSingle(e.target.value, 'rowsNumber')}
                      />
                  </FormItem>
              </div>
              <div>
                  <div className={`${styles.topSearchtitle}`}>图片列数</div>
                  <FormItem
                      key="columnsNumber"
                      label=""
                  >
                      <Input
                          maxLength={200}
                          style={{ width: 300 }}
                          placeholder="请输入图片列数,1-9的整数"
                          value={data.columnsNumber}
                          onChange={(e) => this.changeSingle(e.target.value, 'columnsNumber')}
                      />
                  </FormItem>
              </div>
              <div>
                  <div className={`${styles.topSearchtitle}`}>上边距</div>
                  <FormItem
                      key="paddingTop"
                      label=""
                  >
                      <Input
                          maxLength={200}
                          style={{ width: 300 }}
                          placeholder="请输入上边距"
                          value={data.paddingTop}
                          onChange={(e) => this.changeSingle(e.target.value, 'paddingTop')}
                      />
                  </FormItem>
              </div>
              <div>
                  <div className={`${styles.topSearchtitle}`}>下边距</div>
                  <FormItem
                      key="paddingBottom"
                      label=""
                  >
                      <Input
                          maxLength={200}
                          style={{ width: 300 }}
                          placeholder="请输入下边距"
                          value={data.paddingBottom}
                          onChange={(e) => this.changeSingle(e.target.value, 'paddingBottom')}
                      />
                  </FormItem>
              </div>
              <div>
                  <div className={`${styles.topSearchtitle}`}>左边距</div>
                  <FormItem
                      key="paddingLeft"
                      label=""
                  >
                      <Input
                          maxLength={200}
                          style={{ width: 300 }}
                          placeholder="请输入左边距"
                          value={data.paddingLeft}
                          onChange={(e) => this.changeSingle(e.target.value, 'paddingLeft')}
                      />
                  </FormItem>
              </div>
              <div>
                  <div className={`${styles.topSearchtitle}`}>右边距</div>
                  <FormItem
                      key="paddingRight"
                      label=""
                  >
                      <Input
                          maxLength={200}
                          style={{ width: 300 }}
                          placeholder="请输入右边距"
                          value={data.paddingRight}
                          onChange={(e) => this.changeSingle(e.target.value, 'paddingRight')}
                      />
                  </FormItem>
              </div>
            
              <div className={`${styles.sub_part}`} style={{ borderBottomWidth: 0 }}>
                  <div className={`${styles.subtitle}`}>导航图片</div>
                  <FormItem
                      key="nav_img"
                      label=""
                  >
                      <div className={global.flex_com_column_start_start}>
                          {data.data.length > 0 && data.data.map((item, index) => this.renderLunBo(item, index))}
                          {
                              (data.data.length<Math.floor(data.columnsNumber)*Math.floor(data.rowsNumber)&&1<=data.columnsNumber<=9&&1<=data.rowsNumber<=9)&&
                              <div
                                  className={`${styles.add_goods_wrap} ${global.flex_row_center_center}`}
                                  onClick={() => this.addNav(data)}
                              >
                            + 添加图片
                              </div>
                          }
                      </div>
                  </FormItem>
              </div>
          </Fragment>
      }else if(data.type == 'raffle'){
          //抽奖活动组件
          con = <Fragment>
              <div className={`${styles.topSearchtitle}`}>抽奖活动内容</div>
            
              <div>
                  <div className={`${styles.subtitle}`}>背景图片</div>
                  <FormItem
                      key="background"
                      label=""
                  >   
                      {data.background.length > 0 && data.background.map((item, index) => this.renderLunBo(item, index,'','',"background"))}
                  </FormItem>
              </div>
              {/* 暂时不用
            <div>
                <div className={`${styles.subtitle}`}>中心抽奖图片</div>
                <FormItem
                key={'button'}
                label={''}
                >   
                    {data.button.length > 0 && data.button.map((item, index) => {
                            return this.renderLunBo(item, index,'','',"button");
                        })}
                </FormItem>
            </div> */}
              <div>
                  <div className={`${styles.subtitle}`}>抽奖内容</div>
                  <FormItem
                      key="prize"
                      label=""
                  >   
                      {data.prize.length > 0 && data.prize.map((item, index) => this.renderLunBo(item, index,'','',"prize"))}   
                      <div
                          className={`${styles.add_goods_wrap} ${global.flex_row_center_center}`}
                          onClick={() => this.addRaffle(data)}
                      >
                    + 添加中奖类型
                      </div>
                  </FormItem>
              </div>
          </Fragment>
      }else if(data.type == 'hotSale'){
          //抽奖活动组件
          con = <Fragment>
              <div className={`${styles.topSearchtitle}`}>热销活动内容</div>
            
              <div>
                  <div className={`${styles.subtitle}`}>左方文字</div>
                  <FormItem
                      key="leftText"
                      label=""
                  >   
                      {data.leftText.length > 0 && data.leftText.map((item, index) => this.renderLunBo(item, index,'','',"leftText"))}
                  </FormItem>
              </div>
              <div>
                  <div className={`${styles.subtitle}`}>右方文字</div>
                  <FormItem
                      key="rightText"
                      label=""
                  >   
                      {data.rightText.length > 0 && data.rightText.map((item, index) => this.renderLunBo(item, index,'','',"rightText"))}
                  </FormItem>
              </div>
              <div className={`${styles.sub_part}`} style={{ borderBottomWidth: 0 }}>
                  <div className={`${styles.subtitle}`}>选择商品</div>
                  <FormItem
                      key="tjsp_goods"
                      label=""
                  >
                      <div className={`${styles.selected_svideo} ${global.flex_column_start_start}`}>
                          <div className={`${styles.add_svideo_wrap} ${global.flex_row_start_center}`}>
                              <span className={`${styles.required}`}>*</span>
                              <span className={`${styles.title}`}>商品添加:</span>
                              <a
                                  href="javascript:void(0)"
                                  className={`${styles.add_svideo_btn}`}
                                  onClick={() => this.selMoreGoods(data)}
                              >+ 添加</a>
                              <span className={`${styles.tip}`}>最少添加1个，最多添加9个</span>
                          </div>

                          {data.data.info.length > 0 &&
                          <Fragment>
                              <div className={`${styles.selected_svideo_list_title}`}>
                                  <span style={{ width: 50 }}>序号</span>
                                  <span style={{ width: 176 }}>商品信息</span>
                                  <span style={{ width: 80 }}>价格</span>
                                  <span style={{ width: 50 }}>操作</span>
                              </div>
                              <div className={`${styles.selected_svideo_list}`}>
                                  {data.data.info.map((svideo_item, svideo_index) => <div className={`${styles.selected_svideo_item} ${global.flex_row_start_center}`}>
                                      <span style={{ width: 50 }}>{svideo_index + 1}</span>
                                      <div className={`${styles.svideo_info} ${global.flex_row_start_center}`}>
                                          <div className={`${styles.left} ${global.flex_row_center_center}`}>
                                              <img src={svideo_item.mainImage} />
                                          </div>
                                          <div className={`${styles.right} ${global.flex_column_start_start}`}>
                                              <span className={styles.video_name}>{svideo_item.skuName}</span>
                                          </div>
                                      </div>
                                      <span style={{ width: 80 }}>{svideo_item.salePrice * 1}</span>
                                      <div
                                          onClick={() => this.delGoods(svideo_item.sku)}
                                          className={`${styles.operate} ${global.flex_row_center_center}`}
                                      >
                                          <ALibbSvg fill="#2d2d2d" width={18} height={18} type="shanchu5" />
                                      </div>
                                  </div>)}
                              </div>
                          </Fragment>
                          }
                      </div>
                  </FormItem>
              </div>
            
          </Fragment>
      }else if(data.type == 'titleSet'){
          //抽奖活动组件
          con = <Fragment>
              <div className={`${styles.topSearchtitle}`}>热销活动内容</div>
            
              <div className={`${styles.sub_part}`}>
                  <div className={`${styles.subtitle}`}>是否展示左方按钮</div>
                  <FormItem
                      key="more_tab_isShowMore"
                      label=""
                  >
                      {getFieldDecorator('more_tab_isShowMore', { initialValue: data.showBackBtn })(
                          <Radio.Group onChange={(e) => this.changeSingle(e.target.value, 'showBackBtn')}>
                              <Radio value>展示</Radio>
                              <Radio value={false}>隐藏</Radio>
                          </Radio.Group>,
                      )}
                  </FormItem>
              </div>
              {/* 暂时不用
                <div className={`${styles.sub_part}`} style={{ borderBottomWidth: 0 }}>
                <div className={`${styles.subtitle}`}>是否固定在顶部</div>
                <FormItem
                    key={'titleSet_fixed'}
                    label={''}
                >
                    {getFieldDecorator('titleSet_fixed', { initialValue: data.fixed })(
                    <Radio.Group onChange={(e) => this.changeSingle(e.target.value, 'fixed')}>
                        <Radio value={true}>是</Radio>
                        <Radio value={false}>否</Radio>
                    </Radio.Group>,
                    )}
                </FormItem>
            </div> */}
              <div>
                  <div className={`${styles.subtitle}`}>内容</div>
                  <FormItem
                      key="rightText"
                      label=""
                  >   
                      {data.data.length > 0 && data.data.map((item, index) => this.renderLunBo(item, index))}
                      {data.data.length<3&&<div
                          className={`${styles.add_goods_wrap} ${global.flex_row_center_center}`}
                          onClick={() => this.addTitleSet(data)}
                      >
                    + 添加图片文字
                      </div>}
                  </FormItem>
              </div>
            
            
          </Fragment>
      }
      return con;
  };

  render() {
      const { select_data } = this.props;
      const { link_type, activityType, modalVisible, modalVisibleLive, modalVisibleGoods, modalVisibleActivityGoods, sle_more_title } = this.state;
      return (
          <div className={styles.r_edit_wrap}>
              <Form ref="sld_mdiy_edit" layout="horizontal">
                  {this.renderItem(select_data)}
              </Form>
              <SldSelGoodsSingleDiy
                  link_type={link_type}
                  seleSku={this.seleSku}
                  sldHandleCancle={this.sldHandleLinkCancle}
                  client="mobile"
              />
              {/*短视频多选的modal框-start*/}
              <SldSelMoreLeftRight
                  selectedRows={this.sele_more_svideo.info}
                  selectedRowKeys={this.sele_more_svideo.ids}
                  modalVisible={modalVisible}
                  width={1000}
                  height={document.body.clientHeight - 400}
                  sldHandleSeleMoreModalCancle={this.sldHandleCancle}
                  seleSvideo={this.seleSvideo}
                  title={sle_more_title}
                  extra={this.sele_more_svideo}
              />
              {/*短视频多选的modal框-end*/}
              {/*直播多选的modal框-start*/}
              <SldSelMoreLeftRightLive
                  selectedRows={this.sele_more_live.info}
                  selectedRowKeys={this.sele_more_live.ids}
                  modalVisible={modalVisibleLive}
                  width={1000}
                  height={document.body.clientHeight - 400}
                  sldHandleSeleMoreModalCancle={this.sldHandleCancle}
                  seleSvideo={this.seleLive}
                  title={sle_more_title}
                  extra={this.sele_more_live}
              />
              {/*直播多选的modal框-end*/}
              {/*商品多选的modal框-start*/}
              <SldSelMoreLeftRightGoods
                  selectedRows={this.sele_more_goods.info}
                  selectedRowKeys={this.sele_more_goods.ids}
                  modalVisible={modalVisibleGoods}
                  width={1000}
                  height={document.body.clientHeight - 400}
                  sldHandleSeleMoreModalCancle={this.sldHandleCancle}
                  seleSvideo={this.seleGoods}
                  title={sle_more_title}
                  extra={this.sele_more_goods}
              />
              {/*商品多选的modal框-end*/}
              {/*促销活动商品多选的modal框-start*/}
              <SldSelMoreLeftRightActivityGoods
                  selectedRows={this.sele_more_goods.info}
                  activityType={activityType}
                  selectedRowKeys={this.sele_more_goods.ids}
                  modalVisible={modalVisibleActivityGoods}
                  width={1000}
                  height={document.body.clientHeight - 400}
                  sldHandleSeleMoreModalCancle={this.sldHandleCancle}
                  seleSvideo={this.seleGoods}
                  title={sle_more_title}
                  extra={this.sele_more_goods}
              />
              {/*促销活动商品多选的modal框-end*/}
          </div>
      );
  }
}

