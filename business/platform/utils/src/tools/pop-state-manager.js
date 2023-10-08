/**
 * 弹出窗口管理对象。
 * 使用场景：在T信点击返回时，能通过这个对象自动关闭最新的弹出窗口
 * 参数：一个对象或者是数组。
 *    -- 参数对象或数组中的元素可以是字符串或对象。
 *    -- 如果是字符串，则默认该字符串对应的值是false
 *    -- 如果是对象，则支持以下参数：
 *    --  {
 *        name: 属性名
 *        value： 默认值
 *        show:{// 弹窗显示时的监听
 *            callback: 回调函数
 *            title： 对应页面title的值
 *        }
 *        hide:{...}//弹窗隐藏时的监听，内容同show
 *        step:步长，执行关闭当前弹窗后，需要关联关闭的弹窗数。如果不提供step属性，或者step值为0，则不执行关联处理
 *        related：指定关联属性名，作用同step。值可以是数组或字符串（多个用逗号分隔）
 *    }
 *
 *  todo 1. 没有做完整的异常处理；
 *  todo 2. 没有做父子组件属性同名处理；
 *  todo 3. 关闭弹窗的方法与vue有一定的耦合；
 *  todo 4. 可考虑用vuex管理单页的全局状态，当A路由页面通过弹出框跳转到B路由页面，再从B路由页面点击返回时，希望保持A路由页面的弹窗依然是弹出状态
 *  todo 5. 保留show时的title，隐藏弹窗时不用再设置title，直接还原title
 * @type {popStateManager}
 */
import {directionHandler} from 'src/tools/direction'

export const PopStateManager = (function (popVariables) {

  const POP_RESULT = {
    SUCCESS: 1,
    FAILED: 2,
    ERROR: 3,
    PREVENT: 4,
  }

  /**
   * 构造函数
   */
  function popStateManager() {
    this.DEFAULT_CONFIG = {
      value: false,//变量的值，默认false
      parent: null, //属性的父对象。属性可能不止一层结构，当有多层时，传入父对象
      step: 0,//步长。当执行closeTopPop时，关联执行step次close
      related: null, //关联属性列表。当执行closeTopPop时，同时关联执行related中的属性
      ignore: null, //忽略，不进行弹窗控制
      show: {
        callback: null, //显示弹窗时回调方法
        title: null, //显示弹窗时的标题
        timeout: null, //超时控制
      },
      hide: {
        callback: null, //显示弹窗时回调方法
        title: null, //显示弹窗时的标题
        timeout: null, //超时控制
      },
    }
    this.init();
  }

  /**
   * 栈中弹出的值是否在容器中
   * @param value
   * @return {boolean}
   * @private
   */
  function _isStackObjInContainer(value) {
    return !!value && value !== false;
  }

  /**
   * 根据路径获取对象下的子属性值
   * @param obj 原对象
   * @param path 属性路径 类似 aaa.bbb.ccc
   * @return {*} 最终值 即ccc的值
   * @private
   */
  function _getObjByPath(obj, popVar) {
    let path = popVar.parent;
    if (!path) {
      return null;
    }
    let arr = path.split(".");
    let temp = obj;
    arr.forEach((item) => {
      temp = temp[item];
      if(temp instanceof Array){//如果ref是个数组，则需提供索引，默认第一个
        temp = temp[popVar.parentIndex] || 0
      }
    })
    return temp;
  }

  /**
   * 原型对象
   */
  popStateManager.prototype = {

    init() {
      this.popVariablesContainer = {}; //状态对象的集合
      this.hideStateStack = []; //状态栈
      this.scope = null; //Vue对象实例
    },

    /**
     * 初始化数据并存入容器中
     * @param popVariables 弹窗对象
     * @scpoe 操作弹窗的作用域，通常是父页面的this
     * @storeCount 当存在这个值时，下一个页面传入scope时，不会初始化当前容器。每次传入scope时都会减去一次store，直到storeCount为0
     */
    setData(popVariables, scope, storeCount) {
        if(!!storeCount){
            this.storeCount = storeCount;
        }
      if (!!scope && typeof (scope) == 'object') {
          //如果storeCount大于0，则不初始化，将当前scope的popVariables和上一次传进来的合并
        if(this.storeCount<=0){
            //scope有值时，认为已经更换了父级作用域（即切换到新的页面），此时清空所有数据，重新建立管理结构
            this.init();
        }else{
            --this.storeCount;
        }
        this.scope = scope;
      }
      if (!popVariables || popVariables.length == 0) {
        return {};
      }
      let managerObj = {};
      const DEFAULT_VALUE = false;
      if (!(popVariables instanceof Array)) {
        popVariables = [popVariables];
      }
      popVariables.forEach((popVar) => {
        try {
          if (typeof popVar == 'string') { //如果给的是string，则给默认值false
            let tempObj = managerObj[popVar] = {};
            tempObj.value = DEFAULT_VALUE; //默认值：false
          } else if (typeof popVar == 'object') { //如果给的是对象，根据对象具体属性进行赋值
            //name是必须有的
            if (popVar.name) {
              if (popVar.hasOwnProperty('value') && typeof popVar.value != 'boolean') {
                console.error("对象value属性值类型错误,只能是boolean!", popVar);
              } else {
                managerObj[popVar.name] = Object.assign({}, this.DEFAULT_CONFIG, popVar);
              }
            } else {
              console.error("对象缺少name!", popVar);
            }
          } else { //不支持其他类型
            console.error("对象类型错误,只能是string或object", popVar);
          }
        } catch (e) {
          console.error("对象处理出错", popVar, e);
        }
      });
      this.popVariablesContainer = Object.assign(this.popVariablesContainer, managerObj);

      return this.getData(managerObj); //简单结构的属性值对象,给Vue的data使用
    },

    /**
     *
     * @param topVarName
     * @return 如果返回值是false，说明没有弹出窗口。如果是null，说明有弹出窗口，但执行失败了
     */
    async loopCloseTopPop(topVarName) {
      if (_isStackObjInContainer(topVarName)) {
        try {
          let popVar = this.popVariablesContainer[topVarName];
          //如果beforeHide终止了关闭，则回滚，将弹窗变量重新压入栈
          if(popVar.hide && popVar.hide.beforeHide && await popVar.hide.beforeHide()===false){
            this.hideStateStack.push(topVarName)
            return POP_RESULT.PREVENT;
          }

          this.updateValue(popVar, topVarName);
          //执行值为false时的监听
          this.triggerListener(popVar, topVarName, 'hide');

          this.popRelatedVars(popVar);
        } catch (e) {
          console.error(e);
          //如果逻辑出错了要回滚 （没有想到具体可能出错的场景，因此暂只把属性重新推入栈中）
          //TODO 由于关联属性的存在，回滚处理不应该这么简单。如果有一个属性弹出失败了，其他的都应该失败。而且除了重新推入栈，Vue对象的属性值也需要回滚。这里暂时没有处理
          this.hideStateStack.push(topVarName);
          return POP_RESULT.ERROR;
        }
        return POP_RESULT.SUCCESS;
      }
      return POP_RESULT.FAILED;
    },

    /**
     * 更新值
     * @param popVar 弹框对象
     * @param name 属性名字
     * @param value 属性值
     */
    updateValue(popVar, name, value=false) {
      //同时改变容器和vue对象的这个属性值
      popVar.value = false;
      if (!!popVar.parent) {
        let interObj = _getObjByPath(this.scope, popVar);
        if (!!interObj) {
          interObj[name] = value;
          interObj.$forceUpdate && interObj.$forceUpdate(); //TODO
        }
      } else {
        this.scope[name] = value;
        this.scope.$forceUpdate && this.scope.$forceUpdate(); //TODO 和Vue耦合太高，这种写法不好。关联执行时，这里会不会有问题？
      }
    },

    /**
     * 继续弹出与原属性关联的其他属性，通过step属性和related属性判断。
     * 如果step属性和related属性同时存在，以related属性为主
     * @param popVar 原属性对象
     */
    popRelatedVars(popVar) {
      //关联执行
      //如果step和related都存在，以related为主
      let stackLength = this.hideStateStack.length;
      if (stackLength != 0) {
        let waitPopVars = []; //待继续执行的变量
        //关联属性
        if (!!popVar.related) {
          if (popVar.related instanceof Array) {
            waitPopVars = popVar.related; //直接覆盖waitPopVars。即，如果step和related都存在，以related为主
          } else if (typeof popVar.related == 'string') {
            waitPopVars = popVar.related.split(","); //逗号分隔
          }
        } else if (!!popVar.step) { //步长处理
          for (let i = stackLength - 1; i >= 0; i--) {
            //执行step次，大于step次时停止循环
            if ((stackLength - i) > popVar.step) {
              break;
            }
            //将步长中涉及的变量存入数组
            waitPopVars.push(this.hideStateStack[i]);
          }
        }
        waitPopVars.some(async (popVar) => {
          if(await this.loopCloseTopPop(popVar) == POP_RESULT.PREVENT){
            return true;
          }
        })
      }
    },

    /**
     * 关闭(即变成false)栈最上面的属性值
     * @return 是否隐藏了pop窗口
     */
    async closeTopPop(defaultCallBack) {
        //TODO 耦合业务代码，判断VUX的Confirm组件  (是只关confirm，还是跟随上一个窗口或本页面一起关闭？)
        try{
            this.scope.$vux.confirm.isVisible() && this.scope.$vux.confirm.hide();
        }catch(e){}

        if(this.beforeClosePop && await this.beforeClosePop()===false){
          return false;
        }
        let topVarName = this.getTopObjInStack();
        let isHidePop = await this.loopCloseTopPop(topVarName); //返回值，表示是否隐藏了pop窗口

        //如果返回值是false，说明没有弹出窗口。如果是null，说明有弹出窗口，但执行失败了，此时也不执行defaultCallBack
        if (isHidePop === POP_RESULT.FAILED) {
            isHidePop = false;
            //如果栈是空的（即没有弹窗）时需要执行的方法
            defaultCallBack && defaultCallBack();
        }
        return isHidePop;
    },
    /**
     * 从栈中拿到最上面的一个对象,并且这个对象在Container中存在,如果不存在,继续拿,直到栈空了为止
     * @return 有三种返回值   null: 没有拿到数据; false:拿到数据了,但在容器中不存在; [string]:拿到的属性名
     * 其中,从整个逻辑上来说,false的情况是不会出现的,但为了代码的健壮性,增加了这一层判断
     */
    getTopObjInStack() {
      if (!this.hideStateStack || this.hideStateStack.length == 0) {
        return null;
      }
      let topVarName = this.hideStateStack.pop();
      if (!this.popVariablesContainer[topVarName]) {
        topVarName = this.getTopObjInStack();
        //如果拿到值,topVar是具体值,否则是false
        if (_isStackObjInContainer(topVarName)) {
          return topVarName;
        }
        return false;
      }
      return topVarName;
    },

    /**
     * (内部方法)返回简单数据结构,给vue的data使用
     */
    getData(dataArr) {
      const that = this;
      let result = {};
      for (let name in dataArr) {
        let obj = that.popVariablesContainer[name];
        if (!obj) {
          continue;
        }
        Object.defineProperty(result, name, {
          configurable: true,
          enumerable: true,
          get: function () {
            return obj.value;
          },
          set: function (val) {
            obj.value = !!val;
            let index = that.hideStateStack.indexOf(name);
            //监听属性的set方法,如果设置为true,就放到栈里面,否则从栈里面拿出来
            if (val) {
              //如果属性值为true,就放进栈,但属性已存在则不再添加
              if (index == -1) {
                // if(obj.type=='page'){
                //   history.pushState(null,null,location.href)
                // }
                !obj.ignore && that.hideStateStack.push(name);
                //执行值为true时的回调
                that.triggerListener(obj, name, 'show');
              }
            } else if (index > -1) {
              // if(obj.type=='page'){
              //   history.go(-1)
              // }
              //如果属性值为false,且栈里面有,就拿出来
              !obj.ignore && that.hideStateStack.splice(index, 1);
              that.triggerListener(obj, name, 'hide');
            }else if(directionHandler.isBack() && window.isJsBridge){//TODO 耦合代码
              //在T信中，关闭全屏弹窗时，必须手动回退一次历史，否则无法正常关闭
              if(obj.type=='page'){
                // history.go(-1)
              }
            }
          },
        });
      }
      return result;
    },

    /**
     * 显示/隐藏时的事件监听
     * @param obj popVar对象
     * @param name popVar 属性名
     * @param listener show或hide监听
     * @private
     */
    triggerListener(obj, name, listener) {
      const that = this;
      let oppositeListener = listener == 'show' ? 'hide' : 'show'; //对立的监听名称
      if (!!obj[listener]) {
        try {
          obj[listener].callback && obj[listener].callback();
        } catch (e) {
          console.error(e);
        }
        obj[listener].title && (document.title = obj[listener].title);

        //超时判断，超时后将值反转
        if (!!obj[listener].timeout) {
          let waitTime = setTimeout(() => {
            //如果已经开始倒计时了，则停止倒计时
            if (!!obj[listener].waitTime) {
              clearTimeout(obj.waitTime);
              obj.waitTime = null;
              return;
            }
            //开始倒计时后，给相反的监听事件赋值waittime。当相反的事件执行时，停止倒计时
            if (!obj[oppositeListener]) {
              obj[oppositeListener] = {};
            }
            obj[oppositeListener].waitTime = waitTime;

            that.updateValue(obj, name, 'show' ? false : true);

            that.scope.$forceUpdate && that.scope.$forceUpdate(); //TODO 
          }, obj[listener].timeout);
        }
      }
    },
  }

  return popStateManager;
})();

export const stateManager = new PopStateManager();
