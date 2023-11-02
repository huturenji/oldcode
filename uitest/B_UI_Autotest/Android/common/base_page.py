# -*- coding: utf-8 -*-
# @time     : 2021/6/22 17:30
# @Author   : 天狼星
# @Email    : 328546246@qq.com
# @File     : base_page.py

import os
import time

import allure
# 导入日志模块
from common.mylogger import my_log
# 导入截图保存目录
from common.contants import IMG_DIR
from appium.webdriver import Remote
from appium.webdriver.common.multi_action import MultiAction
from appium.webdriver.common.touch_action import TouchAction
from selenium.webdriver.common.touch_actions import TouchActions
from selenium.common.exceptions import NoSuchElementException, TimeoutException
from selenium.webdriver import ActionChains
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.wait import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from appium.webdriver.common.mobileby import MobileBy
from selenium.webdriver.common.by import By
from selenium.webdriver.support.color import Color


class BasePage:

    def __init__(self, driver: Remote):
        self.driver = driver

    def wait_data_load(self, boolean=True, wait_time=0.5):
        """
        等待webview页面数据加载完成
        :param boolean:是否需要滑屏操作,默认需要滑屏
        :param wait_time:每次查询加载状态的时间间隔
        """
        old_page = ''
        time.sleep(wait_time)
        new_page = self.driver.page_source
        while old_page != new_page:
            if boolean:
                self.swipe_up()
            time.sleep(wait_time)
            old_page = new_page
            new_page = self.driver.page_source
        my_log.info("webview页面数据加载完成")

    def wait_precence_element(self, locator, step_desc=None, timeout=30, poll_frequency=0.3):
        """
        等待元素被加载
        :param locator:元素定位器，tuple类型
        :param step_desc:操作步骤描述信息
        :param timeout:总超时时间
        :param poll_frequency:轮巡间隔时间，频率(默认0.5s)
        :return: 返回已定位的元素对象
        """
        try:
            wait = WebDriverWait(self.driver, timeout, poll_frequency=poll_frequency).until(
                EC.presence_of_element_located(locator))
            my_log.info("等待:{} - 元素'{}'被加载成功。".format(step_desc, locator))
            return wait
        except TimeoutException:
            my_log.error("等待:{} - 元素'{}'被加载失败！".format(step_desc, locator))
            raise TimeoutException

    def wait_element_visible(self, locator, step_desc=None, timeout=30, poll_frequency=0.3):
        """
        等待元素可见
        :param locator:元素定位器，tuple类型
        :param step_desc:操作步骤描述信息
        :param timeout:总超时时间
        :param poll_frequency:轮巡间隔时间，频率(默认0.5s)
        :return:返回已定位的元素对象
        """
        try:
            wait = WebDriverWait(self.driver, timeout, poll_frequency=poll_frequency).until(
                EC.visibility_of_element_located(locator))
            my_log.info("等待:{} - 元素'{}'可见成功。".format(step_desc, locator))
            return wait
        except TimeoutException:
            my_log.error("等待:{} - 元素'{}'可见失败！".format(step_desc, locator))
            raise TimeoutException

    def wait_element_clickable(self, locator, step_desc=None, timeout=30, poll_frequency=0.3):
        """
        等待元素可以被点击
        :param locator:元素定位器，tuple类型
        :param step_desc:操作步骤描述信息
        :param timeout:总超时时间
        :param poll_frequency:轮巡间隔时间，频率(默认0.5s)
        :return:返回已定位的元素对象
        """
        try:
            wait = WebDriverWait(self.driver, timeout, poll_frequency=poll_frequency).until(
                EC.element_to_be_clickable(locator))
            my_log.info("等待:{} - 元素'{}'可以成功被点击。".format(step_desc, locator))
            return wait
        except TimeoutException:
            my_log.error("等待:{} - 元素'{}'不能被点击！".format(step_desc, locator))
            raise TimeoutException

    def find_element(self, locator, step_desc=None):
        """
        直接查找元素，不需要等待
        :param locator: 元素定位器，tuple类型
        :param step_desc: 所在步骤的说明
        :return:返回已定位的元素对象
        """
        try:
            ele_loc = self.driver.find_element(*locator)
            my_log.info("查找:{} - 元素'{}'成功".format(step_desc, locator))
            return ele_loc
        except NoSuchElementException:
            my_log.exception("查找:{} - 元素'{}'失败！".format(step_desc, locator))
            raise NoSuchElementException

    def find_elements(self, locator, step_desc=None):
        """查找所有满足条件的元素，返回list列表"""
        try:
            ele_list = self.driver.find_elements(*locator)
            my_log.info("查找:{} - 元素'{}'成功".format(step_desc, locator))
            return ele_list
        except NoSuchElementException:
            my_log.exception("查找:{} - 元素'{}'失败！".format(step_desc, locator))
            raise NoSuchElementException

    def click_element(self, element_located):
        """
        点击元素
        :param element_located: 已定位的元素对象
        """
        try:
            element_located.click()
            my_log.info("元素点击成功")
        except BaseException as e:
            my_log.error("元素点击失败！")
            raise e

    def wait_click_element_success(self, element_located, step_desc=None, timeout=30, frequcy=0.5):
        """
        循环点击某个元素
        :param element_located:已定位的元素对象
        :param step_desc:操作步骤描述信息
        :param timeout:总超时时间
        :param frequcy:等待点击时间间隔
        """
        used_time = 0
        while used_time < timeout:
            try:
                time.sleep(frequcy)
                element_located.click()
                my_log.info("循环点击元素:'{}'成功".format(step_desc))
                return
            except:
                time.sleep(frequcy)
                used_time += frequcy
        my_log.error("循环点击元素:'{}'超时".format(step_desc))
        # 截图保存, 使用单独的文件夹存储截图，截图名字加上时间戳
        self.screen_shot(step_desc)
        raise

    def is_element_exist(self, locator, step_desc=None):
        """判断元素是否存在"""
        lis = self.driver.find_elements(*locator)
        if len(lis) == 0:
            my_log.info("没有找到元素：'{}'".format(step_desc))
            return False
        elif len(lis) == 1:
            my_log.info("已找到1个元素：'{}'".format(step_desc))
            return True
        else:
            my_log.error("找到{}个元素：'{}'".format(len(lis), step_desc))
            return False

    def element_count(self, locator, step_desc=None):
        """查询元素有多少个"""
        try:
            lis = self.driver.find_elements(*locator)
            my_log.info("找到{}个元素：{}".format(len(lis), step_desc))
            return len(lis)
        except:
            my_log.error("查询元素'{}'数量出现异常!".format(step_desc))

    def input_keys(self, element_located, value):
        """
        输入内容
        :param element_located:已定位的元素对象
        :param value:输入的内容
        """
        try:
            element_located.send_keys(value)
            my_log.info("输入内容'{}'成功".format(value))
        except:
            my_log.error("输入内容'{}'失败".format(value))

    def refresh_page(self):
        try:
            self.driver.refresh()
            # self.driver.execute_script("location.reload();")
            time.sleep(1)
            my_log.info("刷新页面成功")
        except:
            my_log.error("刷新页面失败")

    def width(self):
        """获取屏幕宽度"""
        return self.driver.get_window_size()['width']

    def height(self):
        """获取屏幕高度"""
        return self.driver.get_window_size()['height']

    def swipe_left(self, num=1):
        """
        向左滑动屏幕
        :param num: 滑动次数，默认1次
        :return:
        """
        # return self.driver.swipe(self.width() * 0.9, self.height() * 0.5, self.width() * 0.1, self.height() * 0.5)
        for i in range(num):
            self.driver.swipe(self.width() * 0.9, self.height() * 0.5, self.width() * 0.1, self.height() * 0.5)
            time.sleep(0.3)

    def swipe_right(self):
        """向右滑动屏幕"""
        return self.driver.swipe(self.width() * 0.1, self.height() * 0.5, self.width() * 0.9, self.height() * 0.5)

    def swipe_up(self):
        """向上滑动屏幕"""
        return self.driver.swipe(self.width() * 0.5, self.height() * 0.8, self.width() * 0.5, self.height() * 0.1)

    def swipe_down(self):
        """向下滑动屏幕"""
        return self.driver.swipe(self.width() * 0.5, self.height() * 0.1, self.width() * 0.5, self.height() * 0.9)

    # def swipe_up_find_element(self, locator, step_desc=None, total=10):
    #     # 上滑屏幕，直至找到所需要的元素
    #     used_frequency = 0
    #     while used_frequency < total:
    #         self.swipe_up()
    #         time.sleep(1)
    #         try:
    #             ele = self.find_element(locator, step_desc)
    #             my_log.info("滑屏寻找元素'{}'成功".format(step_desc))
    #             return ele
    #         except:
    #             used_frequency += 1
    #     my_log.error("滑屏寻找元素'{}'失败！！".format(step_desc))
    #     raise NoSuchElementException

    def swipe_up_find_element(self, locator, count, step_desc=None, total=30):
        """上滑屏幕，直至找到所需要的元素"""
        used_frequency = 0
        while used_frequency < total:
            ele = self.driver.find_elements(*locator)
            if len(ele) != count:
                time.sleep(0.5)
                self.swipe_up()
                used_frequency += 1
            elif len(ele) == count:
                my_log.info("滑屏寻找元素'{}'成功".format(step_desc))
                return ele[-1]
        my_log.error("滑屏寻找元素'{}'失败！！".format(step_desc))
        raise

    def switch_webview(self, webview=None):
        """
        切换app原生和webview环境
        :param webview: 默认None值表示切换至app原生环境，输入'webview'表示切换至webview环境；输入值为str类型
        :return:
        """
        if webview == "webview":
            self.driver.switch_to.context(self.driver.contexts[1])
            my_log.info("已进入webview环境")
        elif webview is None:
            self.driver.switch_to.context(None)
            my_log.info("已进入App原生环境")
        else:
            my_log.error("切换环境所需参数输入有误！！！")

    def switch_to_new_window(self, element_located, step_desc=None, timeout=40, poll_frequency=0.5, method=None):
        """
        点击某元素打开新标签页时，将窗口切换至最新打开的标签页
        :param element_located:已定位的元素对象，点击该元素时会打开新标签页
        :param step_desc:操作步骤描述信息
        :param timeout: 总超时时间
        :param poll_frequency: 轮巡时间，频率(默认0.5s)
        """
        try:
            handles = self.driver.window_handles
            # print("~~~~~~~~切换之前所有的标签页", handles)
            if method is None:
                self.click_element(element_located)
            elif method == "js":
                self.js_click(element_located)
            WebDriverWait(self.driver, timeout, poll_frequency=poll_frequency).until(
                EC.new_window_is_opened(handles))
            # print("————————点击之后等待，所有的标签页", self.driver.window_handles)
            self.driver.switch_to.window(self.driver.window_handles[-1])
            # print("++++++切换之后的标签页", self.driver.current_window_handle)
            my_log.info("{}切换至新标签页成功".format(step_desc))
        except:
            my_log.error("{}切换至新标签页失败！！！".format(step_desc))

    def switch_to_new_window_wait(self, element_located, step_desc=None, timeout=30, frequcy=0.5, method=None):
        handles = self.driver.window_handles
        if method is None:
            self.click_element(element_located)
        elif method == "js":
            self.js_click(element_located)
        used_time = 0
        while used_time < timeout:
            old_handles = self.driver.window_handles
            time.sleep(frequcy)
            new_handles = self.driver.window_handles
            if old_handles == new_handles:
                if handles[-1] != new_handles[-1]:
                    try:
                        self.driver.switch_to.window(new_handles[-1])
                        if self.driver.current_url is None:
                            print("\n" + "进入了空白页")
                            used_time += frequcy
                            continue
                        my_log.info("{}切换至新标签页成功".format(step_desc))
                        return
                    except:
                        used_time += frequcy
                        continue
            used_time += frequcy
        my_log.error("{}切换至新标签页失败！".format(step_desc))

    @allure.step("需要获取的toast提示")
    def get_webview_toast_words(self, msg, value='商旅'):
        """获取webview页面 toast 元素"""
        if value == '商旅':
            try:
                self.wait_precence_element(
                    (By.XPATH, "//div[@class ='showToastBox']//*[contains(text(), '{}')]".format(msg)), "toast提示",
                    timeout=10, poll_frequency=0.2)
                # 获取toast截图
                self.get_screenshots("toast提示截图")
                my_log.info("获取toast提示成功")
                return True
            except:
                my_log.error("没有获取到toast提示语！！！")
                return False
        elif value == '商城':
            try:
                self.wait_precence_element(
                    (By.XPATH, "//div[@class='uni-sample-toast']/*[contains(text(),'{}')]".format(msg)),
                    step_desc="toast提示", timeout=10, poll_frequency=0.2)
                # 获取toast截图
                self.get_screenshots("toast提示截图")
                my_log.info("获取toast提示成功")
                return True
            except:
                my_log.error("没有获取到toast提示语！！！")
                return False

    def screen_shot(self, img_description=None):
        """
        保存截图
        :param img_description: 截图所在步骤的说明
        """
        time_now = time.strftime("%Y-%m-%d-%H-%M-%S", time.localtime())
        img_path = os.path.join(IMG_DIR, str(time_now) + str(img_description) + '.png')
        try:
            self.driver.save_screenshot(img_path)
        except:
            my_log.error("截图并保存失败！")
        else:
            my_log.info("截图并保存成功，截图存放在{}".format(img_path))

    def scroll_into_view(self, element_located):
        """滚动页面至元素在窗口可视化范围内"""
        time.sleep(0.5)
        self.driver.execute_script("arguments[0].scrollIntoView();", element_located)
        time.sleep(1)

    def js_click(self, element_located):
        """
        通过JavaScript方法执行点击事件
        :param element_located: 已定位的元素对象
        :return:
        """
        self.driver.execute_script("arguments[0].click();", element_located)
        my_log.info("点击元素成功")

    def get_css_attribute(self, element_located, attribute="color"):
        """
        获取元素css属性
        :param element_located: 已定位的元素对象
        :param attribute: css属性名(color:颜色，font-size:字体大小)
        :return: 查询的属性值，字符串格式
        """
        try:
            if attribute == "color":
                ele_css = element_located.value_of_css_property(attribute)
                my_log.info("获取元素css属性{}成功".format(attribute))
                return Color.from_string(ele_css).hex
            else:
                return element_located.value_of_css_property(attribute)
        except:
            my_log.error("获取元素css属性{}失败".format(attribute))

    def js_keyboard_enter(self, element_located):
        """
        搜索框输入后，通过js方法确认搜索（用于搜索框没有搜索确认按钮）
        :param element_located:已定位到的搜索框元素document对象，例如：document.getElementsByTagName('input')[0];
        :return:
        """
        # js方法实现搜索确认事件
        js = "function inputeven(){let el=%slet evtType='keyup';" \
             "let keyCode=13;let evtObj;if(document.createEvent){if(window.KeyEvent){evtObj=document.createEvent" \
             "('KeyEvents');evtObj.initKeyEvent(evtType,true,true,window,true,false,false,false,keyCode,0)}" \
             "else{evtObj=document.createEvent('UIEvents');evtObj.initUIEvent(evtType,true,true,window,1);" \
             "delete evtObj.keyCode;if(typeof evtObj.keyCode==='undefined'){Object.defineProperty(evtObj,'keyCode'," \
             "{value:keyCode})}else{evtObj.key=String.fromCharCode(keyCode)}if(typeof evtObj.ctrlKey==='undefined')" \
             "{Object.defineProperty(evtObj,'ctrlKey',{value:true})}else{evtObj.ctrlKey=true}}el.dispatchEvent(evtObj)}" \
             "else if(document.createEventObject){evtObj=document.createEventObject();evtObj.keyCode=keyCode;el." \
             "fireEvent('on'+evtType,evtObj)}}inputeven();" % (element_located)
        # 执行搜索确认的js方法
        self.driver.execute_script(js)

    def get_screenshots(self, step_desc=None):
        """
        获取截图，并上传至allure测试报告
        :param step_desc: 截图说明
        :return:
        """
        with allure.step('{}......'.format(step_desc)):
            allure.attach(self.driver.get_screenshot_as_png(), "截图如下：", allure.attachment_type.PNG)

    def control_sliding(self, methods=1, ele_located=None, xoffset=0, yoffset=0, speed=None, step_desc=None):
        """
        滑动、滚动控件的方法，比如：滑动时间控件；
        注意：1、多次连续调用滑动方法，前后执行滑动方法时，中间不能加强制等待；
             2、执行完滑动方法，最后需要加2~3秒的强制等待时间。
        :param methods:选择滑动的具体方法
        :param ele_located: 已定位的元素对象
        :param xoffset: X轴偏移量--以元素的像素中心点为原点，向右偏移为正，向左偏移为负；scroll方法方向相反。
        :param yoffset: Y轴偏移量--以元素的像素中心点为原点，向下偏移为正，向上偏移为负；scroll方法方向相反。
        :param speed: 每秒偏移的像素
        :param step_desc: 日志描述
        :return:
        """
        if methods == 1:
            try:
                TouchActions(self.driver).flick_element(ele_located, xoffset, yoffset, speed).perform()
                my_log.info("filck滑动'{}'成功".format(step_desc))
            except:
                my_log.error("filck滑动'{}'失败".format(step_desc))
        elif methods == 2:
            try:
                TouchActions(self.driver).scroll_from_element(ele_located, xoffset, yoffset).perform()
                my_log.info("scroll滑动'{}'成功".format(step_desc))
            except:
                my_log.error("scroll滑动'{}'失败".format(step_desc))
