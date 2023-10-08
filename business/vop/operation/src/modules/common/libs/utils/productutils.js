/**
 * 供应商渠道logo筛选
 * @param {String} url 
 */
export function setLogoFilter(url) {
    let tempUrl = url;
    if (tempUrl.substring(0, 4) != "http") {
        tempUrl = (location.origin ? location.origin : location.protocol + '//' + location.host) + "/mallvop/file/v1/content" + tempUrl;
    }
    return tempUrl;
}

/**
 * 处理规则的商品范围 scopeValue scopeLevel scopeValueDescription
 * 
 * scopeLevel 范围级别：0-供应商，1-商品分类，2-商品编号
 * scopes 
 * scopeValue
    范围取值，如果是分类，则传全路径，按照/分割。如一级/二级/三级。scopeLevel = 0， scopeValue的取值为： 1-京东，3-西域;
    scopeLevel = 1， scopeValue的取值为：categoryId1或者 categoryId1/categoryId2或者 categoryId1/categoryId2/category3;
    scopeValueDescription scopeLevel = 2， scopeValue的取值为： sku;
    范围取值中文描述，,取值规则和范围取值必须对应
 * @param {*} item 
 * @returns 
 */
export function getScopeStr(item) {
    let values = item.scopes;
    let strArr = [];
    values && values.forEach(items => {
        let desArr = items.scopeValueDescription.split("/");
        strArr.push(desArr[0]);
    })
    strArr = this.uniqArray(strArr, (a, b) => {
        return a == b;
    })
    let strs = strArr.join(",")
    return strs;
}
// eslint-disable-next-line no-unused-vars
function uniqArray(array, isUniq) {
    var temp = [];
    var index = [];
    var l = array.length;
    for (var i = 0; i < l; i++) {
        for (var j = i + 1; j < l; j++) {
            if (isUniq(array[i], array[j])) {
                i++;
                j = i;
            }
        }
        temp.push(array[i]);
        index.push(i);
    }
    return temp;
}
/**
 * 将数组类型的分类转换成 树形的数据，给组件使用
 * @param {*} scops 
 * @param {*} dataTree 
 * @returns 
 */
export function scopsToTree(scops, dataTree) {
    let resultTree = [];//结果集，也是一棵树
    scops.forEach(function (cateItem) {
    //item的数据结构 categoryId1/categoryId2/category3      
        let cateIds = cateItem.scopeValue.split("/");
        let cateNames = cateItem.scopeValueDescription.split("/");
        if (cateIds.length == 1) { //是一级分类
            let find = resultTree.find(item => {
                return item.categoryId == cateIds[0]
            })
            if (!find) {
                let childFind = dataTree.find(item => {
                    return item.categoryId == cateIds[0]
                });
                if (!childFind) {
                    console.error('error data', cateItem)
                    return
                }
                resultTree.push(
                    {
                        categoryId: cateIds[0],
                        categoryName: cateNames[0],
                        childrenCategories: childFind.childrenCategories
                    }
                )
            }
        }
        if (cateIds.length == 2) { //是二级分类
            let find1 = resultTree.find(item => {
                return item.categoryId == cateIds[0]
            });
            if (!find1) {
                let childFind = dataTree.find(item => {
                    return item.categoryId == cateIds[0]
                });
                if (!childFind) {
                    console.error('error data', cateItem)
                    return
                }
                resultTree.push(
                    {
                        categoryId: cateIds[0],
                        categoryName: childFind.categoryName,
                        childrenCategories: [{
                            categoryId: cateIds[1],
                            categoryName: childFind.childrenCategories.find(item => {
                                return item.categoryId == cateIds[1]
                            }).categoryName,
                            childrenCategories: childFind.childrenCategories.find(item => {
                                return item.categoryId == cateIds[1]
                            }).childrenCategories
                        }]
                    }
                )
            } else {
                let find2 = find1.childrenCategories && find1.childrenCategories.find(item => {
                    return item.categoryId == cateIds[1]
                });
                if (!find2) {
                    let childFind = dataTree.find(item => {
                        return item.categoryId == cateIds[0]
                    });
                    if (!childFind) {
                        console.error('error data', cateItem)
                        return
                    }
                    find1.childrenCategories.push({
                        categoryId: cateIds[1],
                        categoryName: childFind.childrenCategories.find(item => {
                            return item.categoryId == cateIds[1]
                        }).categoryName,
                        childrenCategories: childFind.childrenCategories.find(item => {
                            return item.categoryId == cateIds[1]
                        }).childrenCategories
                    })
                }
            }
        }
        if (cateIds.length == 3) { //是三级分类
            let find1 = resultTree.find(item => {
                return item.categoryId == cateIds[0]
            });
            if (!find1) {
                resultTree.push(
                    {
                        categoryId: cateIds[0],
                        categoryName: cateNames[0],
                        childrenCategories: [{
                            categoryId: cateIds[1],
                            categoryName: cateNames[1],
                            childrenCategories: [{
                                categoryId: cateIds[2],
                                categoryName: cateNames[2]
                            }]
                        }]
                    }
                )
            } else {
                let find2 = find1.childrenCategories && find1.childrenCategories.find(item => {
                    return item.categoryId == cateIds[1]
                });
                if (!find2) {
                    find1.childrenCategories.push({
                        categoryId: cateIds[1],
                        categoryName: cateNames[1],
                        childrenCategories: [{
                            categoryId: cateIds[2],
                            categoryName: cateNames[2]
                        }]
                    })
                } else {
                    let find3 = find2.childrenCategories && find2.childrenCategories.find(item => {
                        return item.categoryId == cateIds[2]
                    });
                    if (!find3) {
                        find2.childrenCategories.push({
                            categoryId: cateIds[2],
                            categoryName: cateNames[2]
                        })
                    }
                }
            }
        }
    });
    // console.log(2021, resultTree)
    return resultTree;
}

/**
 * 将树形数据转换成分组数据。给组件使用
 * @param {*} scops 
 * @param {*} dataTree 
 */
export function treeToScops(scops, dataTree) {
    let resultArr = [];//结果集，也是一棵树
    scops.forEach(function (cateItem) {
    //item的数据结构 categoryId1/categoryId2/category3      
        let cateIds = cateItem.scopeValue.split("/");
        if (cateIds.length == 1) { //是一级分类
            let find = dataTree.find(item => {
                return item.categoryId == cateIds[0]
            })
            find.childrenCategories.forEach(item2 => {
                item2.childrenCategories.forEach(item3 => {
                    resultArr.push([cateIds[0], item2.categoryId, item3.categoryId]);
                })
            })
        }
        if (cateIds.length == 2) { //是二级分类
            let find1 = dataTree.find(item => {
                return item.categoryId == cateIds[0]
            });
            let find2 = find1 && find1.childrenCategories && find1.childrenCategories.find(item => {
                return item.categoryId == cateIds[1]
            });
            find2.childrenCategories.forEach(item => {
                let cateObj = [cateIds[0], cateIds[1], item.categoryId];
                // console.log(2021, cateObj)
                resultArr.push(cateObj);
            })
        }
        if (cateIds.length == 3) { //是三级分类
            resultArr.push(cateIds);
        }
    });
    // console.log(2022, resultArr)
    return resultArr;
}

/**
 * 树形组件的结果集 转换成 接口入参 结构
 * @param {*} json 
 * @returns 
 */
export function treeResult2Scops(json) {
    let selectedClassifyListResult = [];

    let tempSelectedClassifyList = json.selectedClassifyList;
    let categoryTreeData = json.categoryTreeData;
    // console.log("tempSelectedClassifyList1", tempSelectedClassifyList);
    if (
        !!tempSelectedClassifyList &&
    tempSelectedClassifyList.length > 0 &&
    !!categoryTreeData &&
    categoryTreeData.length > 0
    ) {
    //这里还要筛选出来，某个分类是不是全选的，全选的只需要父ID即可，不需要罗列所有的子ID
        let toDelNode = []; //要删除的节点
        let treeLevels = 3; //树结构的层次
        for (let treeLe = treeLevels; treeLe > 1; treeLe--) {
            // ;
            for (let i = 0; i < tempSelectedClassifyList.length; i++) {
                // ;
                //先去重，去掉全选的重复分类。然后再执行下面的解析
                //全选去重，要从叶子节点开始，逐次往上比较。分多伦进行，第一轮是叶子节点，第二轮是叶子父节点，一直到第一级节点
                let select = tempSelectedClassifyList[i];
                if (select.length != treeLe) {
                    //不是本轮去重要处理的数据，跳过去。
                    continue;
                }
                let findInToDel = toDelNode.find((item) => {
                    if (treeLe == 3) {
                        return (
                            select.length == item.length + 1 &&
                            item[0] == select[0] &&
                            item[1] == select[1]
                        );
                    } else if (treeLe == 2) {
                        return (
                            select.length == item.length + 1 &&
                            item[0] == select[0]
                        );
                    }
                    return item
                });
                if (findInToDel) {
                    //删除自己
                    tempSelectedClassifyList.splice(i, 1);
                    i--;
                } else {
                    let desNode = categoryTreeData.find((item) => {
                        return item.categoryId == select[0];
                    });
                    if (treeLe == 3) {
                        //找到第二级
                        desNode =
              desNode.childrenCategories &&
              desNode.childrenCategories.find((item) => {
                  return item.categoryId == select[1];
              });
                    }
                    let childLen = desNode.childrenCategories.length;

                    let selctChilds = tempSelectedClassifyList.filter(
                        (tempSel) => {
                            if (treeLe == 3) {
                                return (
                                    tempSel.length == treeLe &&
                  tempSel[0] == select[0] &&
                  tempSel[1] == select[1]
                                );
                            } else if (treeLe == 2) {
                                return (
                                    tempSel.length == treeLe &&
                  tempSel[0] == select[0]
                                );
                            }
                            return 1;
                        }
                    );
                    if (selctChilds && selctChilds.length == childLen) {
                        //全选 删掉重复的item,新增一个父节点，继续遍历
                        if (treeLe == 3) {
                            //新增父节点
                            tempSelectedClassifyList.push([
                                select[0],
                                select[1]
                            ]);
                            //存储到带删除列表
                            toDelNode.push([select[0], select[1]]);
                        } else if (treeLe == 2) {
                            tempSelectedClassifyList.push([select[0]]);
                            toDelNode.push([select[0]]);
                        }
                        //删除自己
                        tempSelectedClassifyList.splice(i, 1);
                        i--;
                    }
                }
            }
        }
        // console.log(
        //   "tempSelectedClassifyList2",
        //   tempSelectedClassifyList
        // );
        tempSelectedClassifyList.forEach(function (item) {
            let cateName = "";
            categoryTreeData.forEach(function (treeItem) {
                if (
                    !!treeItem.childrenCategories &&
          !!item[0] &&
          treeItem.categoryId == item[0]
                ) {
                    cateName += treeItem.categoryName;
                    treeItem.childrenCategories.forEach(function (
                        childItem
                    ) {
                        if (
                            !!childItem.childrenCategories &&
              !!item[1] &&
              childItem.categoryId == item[1]
                        ) {
                            cateName += "/" + childItem.categoryName;
                            childItem.childrenCategories.forEach(
                                function (thirdItem) {
                                    if (
                                        !!item[2] &&
                    thirdItem.categoryId == item[2]
                                    ) {
                                        cateName +=
                      "/" +
                      thirdItem.categoryName;

                                    }
                                }
                            );
                        } else if (
                            !!item[1] &&
                childItem.categoryId == item[1]
                        ) {

                        }
                    });
                } else if (!!item[0] && treeItem.categoryId == item[0]) {

                }
            });
            selectedClassifyListResult.push({
                scopeValue: item.join("/"),
                scopeValueDescription: cateName
            });
        });
    // console.log(
    //   "tempSelectedClassifyList3",
    //   selectedClassifyListResult
    // );
    }
    return selectedClassifyListResult;
}
/**
 * 判断是否某个树形节点已经包含在数组中
 * @param {*} json 
 */
export function isTreeNodeEqual(arr, node, nodelevel) {
    if (nodelevel == 1) {
        let find = arr.find(item => {
            let cateArr = item.split("/")
            return cateArr.length == nodelevel && cateArr[0] == node.categoryId;
        })

        return !!find;
    } else if (nodelevel == 2) {
        let find = arr.find(item => {
            let cateArr = item.split("/")
            return cateArr.length == nodelevel && cateArr[1] == node.categoryId && cateArr[0] == node.parentId;
        })

        return !!find;
    } else if (nodelevel == 3) {
        let find = arr.find(item => {
            let cateArr = item.split("/")
            //这里没有判断3级Id,因为树形结构，一个node只有上一层parentId，我们假定分类的ID是不会重复的
            return cateArr.length == nodelevel && cateArr[2] == node.categoryId && cateArr[1] == node.parentId;
        })

        return !!find;
    }
    return true
}

/**
 * 判断某个sku是否在数组中
 * @param {*} arr 
 * @param {*} sku 
 */
export function isArrSKUEqual(arr, sku) {
    return !!arr.find(item => {
        return item == sku;
    })
}