/*
* 定价管理-选择分类组件
* */
import { connect } from 'dva/index';
import React, { Component } from 'react';
import { Checkbox } from 'antd';
import {
    sldComLanguage,
    failTip
} from '@/utils/utils';
// eslint-disable-next-line no-unused-vars
import global from '@/global.less';
import { Scrollbars } from 'react-custom-scrollbars';

@connect(({ pricerule }) => ({
    pricerule
}))
export default class SelectCategory extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedData: [],//选中的结果集
            currentClicked: {},//当前点击的某条数据
            multileveListData: [//多级列表的数据
                {
                    level: 1,
                    listData: []//1级列表的数据集
                },
                {
                    level: 2,
                    listData: []//2级列表的数据集
                },
                {
                    level: 3,
                    listData: []//3级列表的数据集
                }
            ]
        };
    }

    componentDidMount() {
    //父组件有注册函数，把自己赋值给父组件
        this.props.onRef && this.props.onRef(this)
        this.updateSelectData(JSON.parse(JSON.stringify(this.props.selectCategory)))
        this.getData4Net();
    }

    componentWillUnmount() { }

  getData4Net = (params) => {
      const { dispatch } = this.props;
      const { multileveListData } = this.state;
      dispatch({
          type: 'pricerule/get_cate_list',
          payload: { ...params },
          callback: (res) => {
              if (res.state == 200) {
                  multileveListData[0].listData = res.data.list
                  this.updateMultileveListData(multileveListData);
              } else {
                  failTip(res.msg)
              }
          }
      })
  };

  //组件操作触发回调函数
  sendParams = (callback) => {
      //讲用户操作结果保存到组件内部并且触发外部回调函数
      if (this.state.selectedData.length == 0) {
          failTip(sldComLanguage('请选择分类'));
          return 'error';
      }
      callback && callback(this.state.selectedData);
  }

  updateSelectData = (newData) => {
      this.setState({ selectedData: newData }, () => {
      // console.log("updateSelectData=", this.state.selectedData.length)
      })
  }

  updateMultileveListData = (newData) => {
      this.setState({ multileveListData: newData }, () => {
      // console.log("updateMultileveListData=", this.state.multileveListData[0].listData.length, this.state.multileveListData[1].listData.length
      //   , this.state.multileveListData[2].listData.length)
      })
  }

  //列表点击事件处理
  clickListItem = (listItem, level) => {
      const { multileveListData } = this.state;
      //2个事情：1、刷新当前的点击项currentSelect。2、根据点击修改下级列表的数据，第3级列表没有数据操作
      this.setState({ currentClicked: this.newCurrentClicked(listItem, level) }, () => {
          if (level == 1) {//点击的是一级列表
              multileveListData[1].listData = multileveListData[0].listData.find(item => item.categoryId == this.state.currentClicked.categoryId).children || [];
              multileveListData[2].listData = []
          }
          if (level == 2) {//点击的是二级列表
              multileveListData[2].listData = multileveListData[1].listData.find(item => item.categoryId == this.state.currentClicked.children[0].categoryId).children || []
          }
          this.updateMultileveListData(multileveListData);
      });
  }

  //根据列表级别不同，生成对象 currentClicked
  newCurrentClicked = (record, level) => {
      const { currentClicked } = this.state;

      if (level == 1) {
          return {
              categoryId: record.categoryId
          };
      }
      if (level == 2) {
          return {
              categoryId: currentClicked.categoryId,
              children: [{
                  categoryId: record.categoryId
              }]
          };
      }
      if (level == 3) {
          return {
              categoryId: currentClicked.categoryId,
              children: [{
                  categoryId: currentClicked.children[0].categoryId,
                  children: [{
                      categoryId: record.categoryId
                  }]
              }]
          };
      }
      return {}
  }

  //列表的某一项被选中
  selectListItem = (checkVaule, levelItem, level) => {
      //相当于1次点击事件
      this.clickListItem(levelItem, level)

      const { selectedData, currentClicked, multileveListData } = this.state;
      if (level == 1) {
      //刷新选中数据selectData
          if (checkVaule) {
              //选中了
              selectedData.push(JSON.parse(JSON.stringify(levelItem)))
          } else {
              //取消了
              let index = selectedData.findIndex(item => item.categoryId == levelItem.categoryId)
              index >= 0 && selectedData.splice(index, 1)
          }
      }
      if (level == 2) {
      //刷新选中数据selectData
          if (checkVaule) {
              //选中了
              let level1index = selectedData.findIndex(item => item.categoryId == currentClicked.categoryId)
              if (level1index < 0) {
                  let findLevelsItem = multileveListData[0].listData.find(item => item.categoryId == currentClicked.categoryId)
                  findLevelsItem = JSON.parse(JSON.stringify(findLevelsItem));

                  findLevelsItem.children = [];
                  findLevelsItem.children.push(JSON.parse(JSON.stringify(levelItem)));

                  selectedData.push(findLevelsItem);
              } else {
                  selectedData[level1index].children.push(JSON.parse(JSON.stringify(levelItem)))
              }
          } else {
              //取消了
              let levelindex = selectedData.findIndex(item => item.categoryId == currentClicked.categoryId)
              let level2Index = selectedData[levelindex].children.findIndex(item => item.categoryId == levelItem.categoryId)
              level2Index >= 0 && selectedData[levelindex].children.splice(level2Index, 1);
              //如果删除干净了，需要把整个对象给干掉
              if (selectedData[levelindex].children == 0) {
                  selectedData.splice(levelindex, 1);
              }
          }
      }
      if (level == 3) {
      //刷新选中数据selectData
          if (checkVaule) {
              //选中了
              let level1index = selectedData.findIndex(item => item.categoryId == currentClicked.categoryId)
              if (level1index < 0) { //第一次选择一级目录
                  let findLevelsItem = multileveListData[0].listData.find(item => item.categoryId == currentClicked.categoryId);
                  findLevelsItem = JSON.parse(JSON.stringify(findLevelsItem));
                  findLevelsItem.children = [];
                  let findLevel2Item = multileveListData[1].listData.find(item => item.categoryId == (currentClicked.children && currentClicked.children[0].categoryId))
                  findLevel2Item = JSON.parse(JSON.stringify(findLevel2Item));
                  findLevel2Item.children = [];
                  findLevel2Item.children.push(JSON.parse(JSON.stringify(levelItem)))

                  findLevelsItem.children.push(findLevel2Item)
                  selectedData.push(findLevelsItem);
              } else {
                  let findL2Index = selectedData[level1index].children.findIndex(item => item.categoryId == (currentClicked.children && currentClicked.children[0].categoryId))
                  if (findL2Index < 0) {//第一次添加二级目录
                      let findLevel2Item = multileveListData[1].listData.find(item => item.categoryId == (currentClicked.children && currentClicked.children[0].categoryId))
                      findLevel2Item = JSON.parse(JSON.stringify(findLevel2Item));
                      findLevel2Item.children = [];
                      findLevel2Item.children.push(JSON.parse(JSON.stringify(levelItem)))

                      selectedData[level1index].children.push(findLevel2Item);
                  } else {
                      selectedData[level1index].children[findL2Index].children.push(JSON.parse(JSON.stringify(levelItem)))
                  }
              }
          } else {
              //取消了
              let level1Index = selectedData.findIndex(item => item.categoryId == currentClicked.categoryId)
              let findL2Index = selectedData[level1Index].children.findIndex(item => item.categoryId == (currentClicked.children && currentClicked.children[0].categoryId))
              let index = selectedData[level1Index].children[findL2Index].children.findIndex(item => item.categoryId == levelItem.categoryId)
              index >= 0 && selectedData[level1Index].children[findL2Index].children.splice(index, 1)
              //如果删除干净了，需要把整个对象给干掉
              if (selectedData[level1Index].children[findL2Index].children.length == 0) {
                  selectedData[level1Index].children.splice(findL2Index, 1);
              }
              //如果删除干净了，需要把整个对象给干掉
              if (selectedData[level1Index].children.length == 0) {
                  selectedData.splice(level1Index, 1);
              }
          }
      }

      this.updateSelectData(selectedData)
  }

  //判断列表某一项是否被选中了
  isListItemSelected = (levelItem, level) => {
      const { selectedData, currentClicked } = this.state;
      if (level == 1) {
      //一级列表
          return !!(selectedData && selectedData.find(item => item.categoryId == levelItem.categoryId))
      }
      if (level == 2) {
      //2几列表
          let findL1 = selectedData.find(item => item.categoryId == currentClicked.categoryId)
          if (findL1 && findL1.children) {
              return !!(findL1.children.find(item => item.categoryId == levelItem.categoryId))
          }
          return false
      }
      if (level == 3) {
      //3几列表      
          let findL1 = selectedData.find(item => item.categoryId == currentClicked.categoryId)
          if (findL1 && findL1.children) {
              let findL2 = findL1.children.find(item => item.categoryId == (currentClicked.children && currentClicked.children[0].categoryId));
              if (findL2 && findL2.children) {
                  return !!(findL2.children.find(item => item.categoryId == levelItem.categoryId))
              }
          }
          return false;
      }
      return false;
  }

  //判断列表某一项是否是当前点击项
  isListItemClicked = (levelItem, level) => {
      const { currentClicked } = this.state;
      if (level == 1) {
          return currentClicked && currentClicked.categoryId == levelItem.categoryId
      }
      if (level == 2) {
          return currentClicked && currentClicked.children && currentClicked.children.length > 0
        && currentClicked.children[0].categoryId == levelItem.categoryId
      }
      if (level == 3) {
          return currentClicked && currentClicked.children && currentClicked.children.length > 0
        && currentClicked.children[0].children && currentClicked.children[0].children.length > 0
        && currentClicked.children[0].children[0].categoryId == levelItem.categoryId
      }
      return false
  }

  //列表全选按钮的取值
  isListAllSelected = (level) => {
      const { selectedData, currentClicked, multileveListData } = this.state;

      if (level == 2) {
          let findParent = selectedData && selectedData.find(item => item.categoryId == currentClicked.categoryId)
          if (findParent) {
              let allchecked = true;
              //标记位，遍历level2ListSet，如果都在selectData能找到，就是全选，否则不是
              for (let i = 0; i < multileveListData[1].listData.length; i++) {
                  let findNode = findParent.children.find(itemF => itemF.categoryId == multileveListData[1].listData[i].categoryId);
                  if (!findNode) {
                      allchecked = false;
                      break;
                  }
              }
              return allchecked
          }
          return false
      }
      if (level == 3) {
          let level2P = selectedData && selectedData.find(item => item.categoryId == currentClicked.categoryId)
          let findParent = level2P && level2P.children && level2P.children.find(item => item.categoryId == (currentClicked.children && currentClicked.children[0].categoryId))
          if (findParent) {
              let allchecked = true;
              //标记位，遍历level3ListSet，如果都在selectData能找到，就是全选，否则不是
              for (let i = 0; i < multileveListData[2].listData.length; i++) {
                  let findNode = findParent.children.find(itemF => itemF.categoryId == multileveListData[2].listData[i].categoryId);
                  if (!findNode) {
                      allchecked = false;
                      break;
                  }
              }
              return allchecked
          }
          return false
      }

      return false
  }

  //全选按钮选中事件
  selectAll = (checkValue, level) => {
      const { selectedData, currentClicked, multileveListData } = this.state;
      if (level == 2) {
      //二级列表，全选，做了2件事
          if (checkValue) {
              //1、刷新 selectData。将当前二级列表数据全部存起来
              let toCacheNode = multileveListData[0].listData.find(item => item.categoryId == currentClicked.categoryId);
              toCacheNode = JSON.parse(JSON.stringify(toCacheNode));

              let cachedNodeIndex = selectedData.findIndex(item => item.categoryId == currentClicked.categoryId)
              //已存在，先删除在添加
              if (cachedNodeIndex >= 0) {
                  selectedData.splice(cachedNodeIndex, 1, toCacheNode)
              } else {
                  //不存在，直接添加
                  selectedData.push(toCacheNode)
              }

              this.updateSelectData(selectedData)
              //2。默认点击最后一项
              let lastIndex = multileveListData[1].listData.length - 1;
              this.clickListItem(multileveListData[1].listData[lastIndex], 2)
          } else {
              //二级列表，删除全选，做了2件事
              //1、刷新 selectData。将当前二级列表数据全部删掉
              let cachedNodeIndex = selectedData.findIndex(item => item.categoryId == currentClicked.categoryId)
              if (cachedNodeIndex >= 0) {
                  selectedData.splice(cachedNodeIndex, 1)
              } else {
                  console.warn("get error")
              }

              this.updateSelectData(selectedData)
          }
      }
      if (level == 3) {
      //三级列表，全选，做了2件事
          if (checkValue) {
              //1、刷新 selectData。将当前三级列表数据全部存起来
              let indexlevel1 = selectedData.findIndex(item => item.categoryId == currentClicked.categoryId);
              if (indexlevel1 < 0) {
                  let findLevelsItem = multileveListData[0].listData.find(item => item.categoryId == currentClicked.categoryId)
                  findLevelsItem = JSON.parse(JSON.stringify(findLevelsItem));

                  findLevelsItem.children = [];
                  let findLevel2Item = multileveListData[1].listData.find(item => item.categoryId == (currentClicked.children && currentClicked.children[0].categoryId))
                  findLevel2Item = JSON.parse(JSON.stringify(findLevel2Item));

                  findLevelsItem.children.push(findLevel2Item)
                  selectedData.push(findLevelsItem);
              } else {
                  let indexLevel2 = selectedData[indexlevel1].children.findIndex(item => item.categoryId == (currentClicked.children && currentClicked.children[0].categoryId));
                  let findLevel2Item = multileveListData[1].listData.find(item => item.categoryId == (currentClicked.children && currentClicked.children[0].categoryId));
                  findLevel2Item = JSON.parse(JSON.stringify(findLevel2Item));
                  if (indexLevel2 < 0) {
                      selectedData[indexlevel1].children.push(findLevel2Item);
                  } else {
                      selectedData[indexlevel1].children.splice(indexLevel2, 1, findLevel2Item);
                  }
              }
              this.updateSelectData(selectedData)
              //2。默认点击最后一项
              let lastIndex = multileveListData[2].listData.length - 1;
              this.clickListItem(multileveListData[2].listData[lastIndex], 3);
          } else {
              //三级列表，删除全选，做了2件事
              //1、刷新 selectData。将当前三级列表数据全部删掉
              let cachedNodeIndex1 = selectedData.findIndex(item => item.categoryId == currentClicked.categoryId);
              let cachedNodeIndex2 = (cachedNodeIndex1 >= 0) && selectedData[cachedNodeIndex1].children.findIndex(item => item.categoryId == (currentClicked.children && currentClicked.children[0].categoryId))
              if (cachedNodeIndex2 >= 0) {
                  selectedData[cachedNodeIndex1].children.splice(cachedNodeIndex2, 1)
              } else {
                  console.warn("get error")
              }

              this.updateSelectData(selectedData)
          }
      }
  }

  //当前列表是否显示全选按钮
  hasAllSelectBtn = (level) => level == 2 || level == 3

  //3级列表布局
  getListRender = () => {
      const { multileveListData } = this.state;
      const { readOnly } = this.props;
      return (
          <div style={{ flex: "3", display: 'flex' }}>
              {multileveListData && multileveListData.map((mld, index) => <div key={index} style={{ flex: "1", borderLeft: mld.level != 1 ? '1px solid #e2e2e2' : 'none' }}>
                  {
                      //只读模式不能选择
                      //只有2、3级列表有全选按钮
                      this.hasAllSelectBtn(mld.level) && mld.listData.length > 0 &&
              <div style={{ borderBottom: '1px solid #e2e2e2' }}>
                  <Checkbox
                      disabled={readOnly}
                      checked={this.isListAllSelected(mld.level)}
                      onChange={(e) => { this.selectAll(e.target.checked, mld.level) }}
                  >
                      {sldComLanguage('全选')}
                  </Checkbox>
              </div>
                  }
                  <Scrollbars
                      style={{ height: '200px' }}
                  >
                      {
                          mld.listData.map((record, index1) => <div key={index1} style={{ margin: "5px", display: 'flex' }}>
                              {
                                  // 只读模式不能选择
                                  <Checkbox
                                      disabled={readOnly}
                                      checked={this.isListItemSelected(record, mld.level)}
                                      onChange={(e) => { this.selectListItem(e.target.checked, record, mld.level) }}
                                  />
                              }
                              <div
                                  onClick={() => { this.clickListItem(record, mld.level) }}
                                  style={{ color: this.isListItemClicked(record, mld.level) ? '#ff9455' : '#000', marginLeft: "5px", cursor: 'pointer' }}
                              >
                                  {record.categoryName}
                              </div>
                          </div>)}
                  </Scrollbars>
              </div>)}

          </div>
      );
  }

  render() {
      const { selectedData, multileveListData } = this.state;
      return (
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              {multileveListData[0].listData && multileveListData[0].listData.length > 0 ? this.getListRender()
                  : <div style={{ flex: "3" }}>{sldComLanguage('暂时没有数据')}</div>}
              <div style={{ flex: "1", borderLeft: '1px solid #e2e2e2' }}>
                  <div style={{ flex: "1", borderBottom: '1px solid #e2e2e2' }}>{`已选择${ selectedData.length }项`}</div>
                  <Scrollbars
                      style={{ height: '200px', marginTop: '10px' }}
                  >
                      {selectedData && selectedData.map((item, index) => <div
                          key={index}
                          style={{ backgroundColor: this.isListItemClicked(item, 1) ? '#f2f2f2' : '#fff' }}
                          onClick={() => {
                              this.clickListItem(item, 1)
                          }
                          }
                      >
                          {item.categoryName}
                      </div>)}
                  </Scrollbars>
              </div>
          </div>
      );
  }
}
