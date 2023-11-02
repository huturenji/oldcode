import base64
import os

from ddddocr import DdddOcr


class DoVcode:
    # 获取验证码
    def get_vcode(res):
        """
        获取验证码对象
        :param res: 验证码对象
        :return:
        """
        base64_img = res.json()['data']['captcha']
        code_key = res.json()['data']['key']
        with open("code.png", "wb") as f:
            f.write(base64.b64decode(base64_img))
            f.close()
        code_text = DoVcode.img_to_str()
        os.remove("code.png")
        return code_text, code_key

    # 图片转字符串
    @staticmethod
    def img_to_str():
        # 打开截取的图片
        with open("code.png", "rb") as f:
            img_bytes = f.read()
            f.close()
        # 转换输出验证码
        st = DdddOcr().classification(img_bytes)
        # print(st)
        return st
