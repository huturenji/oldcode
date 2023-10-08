import React, { Component } from 'react';
import { connect } from 'dva/index';
import { Form } from 'antd';

import {
    getOSvgMDiy,
    setSession
} from '@/utils/utils';
import 'react-quill/dist/quill.snow.css';
// eslint-disable-next-line no-unused-vars
import global from '@/global.less';
import styles from './common/css/index.less';
import './common/css/slider.less';
import {renderComponent} from './common/renderComponent'

@connect(({ mdecorate }) => ({
    mdecorate
}))
@Form.create()

export default class MDiyItem extends Component {
  state = {
      
  };

  componentDidMount() {

  }

  handleItem = (index, type) => {
      let { selected, select_data,isChildren } = this.props;
      if (type == 'del') {
          selected = selected.filter(item => item.id != index);//删除操作
      } else {
          for (let i = 0; i < selected.length; i++) {
              if (selected[i].id == index) {
                  let tmp = {};
                  if (type == 'down') {
                      selected[i].props.firstInit = false
                      //向下移动,最后一个不处理
                      if (i < selected.length - 1) {
                          tmp = { ...selected[i] };
                          selected[i] = { ...selected[i + 1] };
                          selected[i + 1] = { ...tmp };
                      }
                  } else if (type == 'up') {
                      selected[i].props.firstInit = false
                      //向上移动，第一个不处理
                      if (i != 0) {
                          tmp = { ...selected[i] };
                          selected[i] = { ...selected[i - 1] };
                          selected[i - 1] = { ...tmp };
                      }
                  } else if (type == 'is_show') {
                      selected[i].props.firstInit = false
                      selected[i].props.is_show = !selected[i].props.is_show;//是否显示
                  } else if (type == 'edit') {
                      selected[i].props.firstInit = false
                      select_data = selected[i]
                      setSession(`${select_data.name}_${select_data.id}`,true)
                  }
                  break;
              }
          }
      }
      this.props.changeEditFlag(isChildren)
      this.props.handleCurSelData('',selected,select_data,isChildren)
      // eslint-disable-next-line no-unused-expressions
      this.props.updateEditData?.(selected)
  };

  renderItem = () => {
      const { data } = this.props;
      return renderComponent(data.name, {data, handleCurSelData: this.props.handleCurSelData,changeChildrenFlag:this.props.changeChildrenFlag});
  };

  renderCon() {
      const { data, select_data } = this.props;
      return (
          <div style={{ position: 'relative' }} className={`${styles.center_item}`}>
              {data.name=="background"&&
                  <div style={{position:'absolute', top:-10,right:-50,border:'1px solid black'}} onClick={() => this.handleItem(data.id, 'edit', data)}>{data.props.admin_text}</div>
              }
              <div
                  className={`${select_data != '' && select_data.id == data.id ? styles.selected : null}`}
                  onClick={() => this.handleItem(data.id, 'edit', data)}
              >
                  {this.renderItem()}
              </div>
              <div className={styles.operate_wrap}>
                  {data.name!="background"&&getOSvgMDiy(() => this.handleItem(data.id, 'up'), 'move-up', '#fff', 15, 15)}
                  {data.name!="background"&&getOSvgMDiy(() => this.handleItem(data.id, 'down'), 'xia1', '#fff', 15, 15)}
                  {data.props.is_show
                      ? getOSvgMDiy(() => this.handleItem(data.id, 'is_show'), 'kejian', '#fff', 16, 16)
                      : getOSvgMDiy(() => this.handleItem(data.id, 'is_show'), 'bukejian11', '#fff', 16, 16)
                  }
                  {(data.name!="statusbar"&&data.name!="titlebar")&&getOSvgMDiy(() => this.handleItem(data.id, 'del'), 'guanbi3', '#fff', 16, 16)}
              </div>
          </div>
      );
  }

  render() {
      return this.renderCon();
  }
}

