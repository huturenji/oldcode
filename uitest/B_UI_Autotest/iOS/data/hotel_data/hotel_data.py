# -*- coding: utf-8 -*-
# @time     : 2021/8/15 18:21
# @Author   : 天狼星
# @Email    : 328546246@qq.com
# @File     : hotel_data.py

# 酒店在线付订单测试夹具数据
hotel_fixture_keywords = [
    {
        "check_in_date": 31,
        "check_out_date": 33,
        "keywords": "维也纳国际酒店(武汉楚河汉街积玉桥店)",
        "room": "高级大床房",
        "method": "在线付"
    }
]

# 酒店冒烟流程：在线付测试数据，测试用例类‘test_hotel_online_pay_order_smoke()’
hotel_online_pay_search_keywords = [
    {
        "title": "搜索在线付酒店下单冒烟",
        "check_in_date": 31,
        "check_out_date": 33,
        "keywords": "维也纳国际酒店(武汉楚河汉街积玉桥店)",
        "room": "高级大床房",
        "method": "在线付"
    }
]

# -------------------------------------------到店付测试数据-------------------------------------------------
# 到店付酒店下单数据
hotel_to_pay_keywords = [
    {
        "check_in_date": 40,
        "check_out_date": 43,
        "keywords": "武汉香格里拉大酒店",
        "room": "豪华双床房",
        "method": "到店付",
    }
]
# 酒店冒烟流程：到店付测试数据，测试用例方法‘test_hotel_to_pay_yes()’
hotel_to_pay_yes_keywords = [
    {
        "credit_card": 6331101999990016,
        "CVV2": 685,
        "cardholder": "天狼星",
        "IDcard": 110101199003075058,
        "phone_number": 15088693973,
        "verify": "000000",
        "title": "到店付酒店下单,需要信用卡担保",
    }
]

# -----------------------------------------酒店入住人相关测试数据-------------------------------------------
# 酒店编辑订单页修改默认入住人测试，测试用例方法：test_hotel_occupants()
hotel_change_occupant_keywords = [
    {
        "ooccupant_name": "司马懿",
        "title": "在线付酒店更改默认入住人",
    }
]

# 酒店编辑订单页添加入住人测试，测试用例方法:test_hotel_add_occupants()
hotel_add_occupants_keywords = [
    {
        "room_number": 2,
        "occ_name": "赵身份证",
        "title": "在线付酒店添加入住人下单",
    }
]

# 酒店编辑订单页添加2个入住人测试，测试用例方法:test_hotel_add_two_people()
hotel_add_two_people_keywords = [
    {
        "room_number": 3,
        "input_field": 3,
        "occ_name": "zhao qin",
        "ooccupant_name": "曹操",
        "title": "在线付酒店添加入住人下单",
    }
]

# 酒店编辑订单页:入住人姓名不合规测试数据
hotel_name_abnormal_scene_keywords = [
    {"name": "曹操haha", "expected": '中文姓名“曹操haha”中不能包含非中文字符', "title": "姓名为中英混合"},
    {"name": "曹丕23！@", "expected": '中文姓名“曹丕23！@”中不能包含非中文字符', "title": "姓名有中英加特殊字符"},
    {"name": "zhao qin", "expected": '入住人姓名不能包含空格，英文姓和名请用“/”隔开', "title": "英文名称用空格分割"},
    {"name": "zhao?qin3", "expected": '姓名“zhao?qin3”中不能包含数字、特殊字符，英文姓和名请用“/”隔开', "title": "英文名称包含特殊字符"},
    {"name": "小姐", "expected": '入住人姓名不能使用“小姐”', "title": "敏感姓名"},
]

# -------------------------------------部分酒店下单时，需要入住人身份证信息--------------------------------------------------
# 使用默认入住人身份证信息下单(fixture参数化数据)
hotel_idcard_data = [
    {
        "check_in_date": 30,
        "check_out_date": 31,
        "keywords": "麗枫酒店(武汉竹叶山地铁站店)",
        "room": "豪华大床房",
        "method": "在线付"
    }
]
# 部分酒店下单时，修改默认入住人身份证信息，并添加入住人自动带入省份信息:test_two_hotel_idcard()
two_idcard_data = [
    {
        "room_number": 2,
        "occ_name": "赵身份证",
        "id_card": 110101199003075373
    }
]
# 部分酒店下单时，默认、身份证、护照、手动输入4位入住人下单，校验身份证信息
four_idcard_data = [
    {
        "room_number": 3,
        "occ_name_1": "zhao qin",
        "occ_name_2": "诸葛亮",
        "id_card_1": 110101199003071751,
        "id_card_2": 110101198011075811
    }
]
# 酒店下单没有身份证号，有toast提示： test_idcard_toast
hotel_idcard_toast = [
    {"data": " ", "expected": '请填写正确证件号', "title": "身份证为空"},
    {"data": "632323190605260222", "expected": '请填写正确证件号', "title": "身份证号码不对"},
    {"data": "632323190605260", "expected": '请填写正确证件号', "title": "身份证号长度不对"},
    {"data": "234abcd", "expected": '请填写正确证件号', "title": "数字字母混合输入校验"}
]
# -------------------------------------酒店行程测试数据-------------------------------------------
# 测试在线付酒店行程的数据：test_hotel_trip_smoke()
hotel_trip_data = [
    {
        "check_in_date": 3,
        "check_out_date": 4,
        "keywords": "武汉亚洲大酒店",
        "room": "标准间",
        "method": "在线付",
        "ooccupant_name": "司马懿",
    }
]
# 测试在线付酒店行程的数据：test_hotel_topay_trip_smoke()
topay_hotel_trip_data = [
    {
        "check_in_date": 3,
        "check_out_date": 4,
        "keywords": "武汉亚洲大酒店",
        "room": "标准间",
        "method": "到店付",
        "occ_name": "zhao qin",

    }
]
# 两位酒店入住人，下单行程验证数据test_hotel_two_people_trip
two_people_trip = [
    {
        "check_in_date": 3,
        "check_out_date": 4,
        "keywords": "武汉亚洲大酒店",
        "room": "标准间",
        "method": "在线付",
        "room_number": 2,
        "occ_name": "航六零巴巴"
    }
]
# 三位酒店入住人，下单行程验证数据test_hotel_three_people_trip
three_people_trip = [
    {
        "check_in_date": 3,
        "check_out_date": 4,
        "keywords": "武汉亚洲大酒店",
        "room": "标准间",
        "method": "在线付",
        "room_number": 3,
        "occ_name_1": "航六零巴巴",
        "occ_name_2": "zhao qin",
    }
]

# -------------------------------------酒店发票测试数据-------------------------------------------
# 可以开具报销凭证的酒店
invoice_data = [
    {
        "check_in_date": 29,
        "check_out_date": 30,
        "keywords": "武汉四季鑫宝来酒店",
        "room": "舒适大床房",
        "method": "在线付",
    }
]
# 报销凭证页面信息校验数据
hotel_invoice_data = [
    {
        "payer": "91420100347291097J",
        "payer_peo": "深圳兆日科技股份有限公司",
        "collection": "深圳兆日国际旅行社有限责任公司",
    }
]

# -------------------------------------酒店缺省图标-------------------------------------------
# 酒店详情页查询无房型时，缺省图标和信息校验：
detail_page_default = [
    {
        "check_in_date": 1,
        "check_out_date": 2,
        "keywords": "麗枫酒店(武汉竹叶山地铁站店)",
        "expected_1": 'background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAMAAABrrFhUAAABpF'
                      'BMVEUAAADd4Ojd4eje4und4eje4unn6u7b4Ofc4Oje4enp6+/o6+/i5eze4+nb4Obb3+bZ3uXy9vfq6+/i5evg4+rr7PDc4'
                      'Ofh5Ovt7vHZ3eXf4+rg5Ors7vHs7fDr7fDj5ezs7vDb3+fs7fDh5Ori5evd4enr7fDb3ubf4unj5uzs7PHa3ubq7fDa3eXq'
                      '7O/g4+va3+Xf4unY3eTq6+7a3eXr7fDp6+/p6+/q6+/p6+/Z3OTp6+/X2+LZ3OTp6u7q7PDo6+/X3OPi5Onp6u/FytLa3u'
                      'TW2uDd4ejn6u7o6u7W2+Po6e7U2ODR1Nvn6e7p6+/Lz9fo6u7L0Njp6+/n6e3X2+PQ1NvP09vX2+PLz9fO09rS1d3Q1NzS1'
                      't3HzNTm6O7O0drLz9jT197Hy9TJzdXIzdbo6u7M0Njs7fHGy9THy9TJztbKz9fFytPL0NjL0NjY2uHR1dzs7vHW2uDJzdXH'
                      'y9P3+v/S1tzO0trDyNDX2uDN0djLz9fEydLU2N7P1Nvm6O27wMnp6+/AxczCx87l6O29wsrc4OfZ3eTs7vHs8PXx9PnmRHi'
                      'VAAAAdHRSTlMAcW1caGQue3hgJDY0WHaBlAQeOkkVfj4NmFBNPk5mLEWEVkdBYl6JVShujXaQl0SHU6KHf36fjo+nnX6qm7'
                      'eGv6YIrvAaMxHXz7bHTELgsO/HJ/Pnr9q/Xvbmxbaj9u/Pa+/A2uWCXuHQtKaWjXtJzobW8B5uNsQAABjNSURBVHja7NbBS'
                      'sNAFIXhqwhKN46g4NCtUEuYTXA1pIsUSiF0G/D9n8QzTTo3hEkpKRiYe/+TjLa7fmQR+ods0zR7EpwCKIACKIACkOAUQAEU'
                      'QAEUgASnAE0rG8C0basAJDinAAqgALIBqqpSABKcVICvU98OAOvLB0EStkp1JDEpQF1XWC0ZgOscalEApk6lACQmU3bVuDC'
                      '5AFyNCQJwZSIFkAXgwyQDlD7cPGEAHj853CXnhQEgrsSkPQGJcgdYFTHr/c7jxga5SwfKsq29tBvVYbBG9gDRwWKDPG445A'
                      'tg7HSgiBq5AhhjMZzTgQBHtgD2TID14V9co3IGiNm4XsNCQhIAZwca8atMAVbmaiyRK8DW3FbOAM4ZHNgNAGvKrZXrMhgI'
                      '2CINYL7pjuK7xTAfLu8XogVAKtMN1xjA/L7R7BIvnbF3WiIGSNc/FVgEME9vdwMkIOyJlmlVhBw3SdEBoMc9zcyEbLrFno'
                      'BilJvg6ABc6GGuwOiVc6ix8BOQzrkiAYBePmlW/GbBQzgXBNgUmwKFg/+OchgDoOfjHQDc0GE5gBAU0HWFMwAwzho/H3MB'
                      '0i0OMKoIG7aJAH2vh6wB/pg1t9cmgigObzebJvGyNRWj1QcJGqyUYCJ5kr5YtAVRCAWz5iZprYjXKm6wmJD86/7msjmbnd'
                      'nNVHfVby5NCgXPlzNnztYSO9IFCZBUN39TAC6U/0pAg4NQseFLLFIA0bhvnZd9PeuY66YZlY0AQmjQueD/wnC5uHfb+jMO'
                      '3316/976x1yoVhuYMZAIEhDikvW7HJx++dD2x+PxO+sfAwFEgw1M1QMmCSCuWuenvH/08cRnQMAn6x8DAXpggQshuIDARs'
                      'Bd61xsvvvUP55OpzL88fs9KxtarUqlstHawEygyqfYqlVMrQihggQQrFgYt/A3XnzZ7Z1NJpMpCXiSWeWrVFoYlRZ2thQP'
                      '8UZAjAre+qj1ommQ9LePhp35GZgwEL8UsLtDPEhXQISWHHABsFX4UOMnCRh4GRWwlBmCy2Urgae3vvWPf8zni/jl5w/G3k'
                      '5mAgqgwgabhMgKtgEIkCb0LuglFmRIASq5GAN7l+zHvR8cxL8QMOnK+E/4lYqViQCCZKgqWFZsYAVpwZfehcwAuOBCwuT3'
                      '1Gq3Xf86m81+SM64gQmj05Pxt+v3QmQqQNERgXkQwEbsAeECwmLoqDhhA3vX3ZfHP2ecxecv4+/2+92gAj6i6Ok+SYtiEX'
                      'FiJVPRpwUXgpRgSxGgJAaf9g154tkH/5MRjj+oAJ1nj3uLG2BAbVYmAgiIIBfmebF8i0AHCdCwdmAxGgg9Ev88SADv+dMO'
                      '3QCjRoTsBBCGHtR6wQcX0Io7IO41cfaC+DEhgCrg7n75S5fif4vmIlMBLkYCBTFWEb5HhACWFLJ0Rs6IK5oaR37+FD/CP/6'
                      '0aZ12cAP48gC8rke7zpQFuJwiWyswMlHBkgKIDVk6YYOLKGxajJuzwEBQAHpfDqzNXeqAIGBYVUhZgEqRb8kkmhACCrruQ'
                      'tgoXLAYV78v3QCjV2Vr79sxawAWHaCHuxRgx8xEwBrD1cIPB7YVJjB1AhLLZuG+xbh/TPnvneIbzzuTpR7wBLHz8OlGS'
                      'V+AiyFxxebqIBXJMkiA/oDIwrkvLkPZA82Ht/HucECPAJwnDd1TyPV0BXBcOcI24CE2NZLhAlbVi4viya+P8I+/oSwi+ye'
                      'yB1x0AHVdw5m2AAU3pEOKiEuLIpsxAuTr+EZLxFEedsR/oL3rRZ+BxrvsGpGdVitTASoyfBJBKrSgWGgFJPVZdyzivifCp'
                      'wQYj/tB3RQeeEsBHWkLsDEMkCqwJAlpoQrQd1q3yhbg2S9aQAofvG1V1J4TVNIVYNvcALZzqaC8UD0IAVQ742kKA80ej'
                      '3/5AnjdiLlF0hdAkAkMcxWEy79BAoh+u7ehythmBo7mc80vgbZiu+9MBKgYq1DrJhcQSozWFgT4ftHd6dRF5VyQQwGs'
                      'I/6FAF8yKMRyNTMBfy7DZUsKWFBtdwsuZ+D7w0jtLO1ZHuKPFoBRUCoYWQtwaBqqSNYhBFBejHwv8LM1cqPkb3QWAqZ'
                      'A/A6sFXOJpC/AAQgdA5iKWONLVgzsWgHEFt0iYJd/oerpBPFPFx3Q68NiAukLIGxMjmMuQ7lFSICCi/j9AelgVJUKOH'
                      '5uyTYLM3MB8ZCMRBHqNbIkwBu1sBMF/y3ZYBquyPg/Lp4BP1uW/sHs7woguAXztBACgnPR87kAYjhcfv+QC2ifWkdSw'
                      'Jsy1+fGka6AvOPkMQyxozawxQmQtNtrdmLVHLD4O4f4kdMu7wCvyRKq9JzZCJAIDZjmNoSGiAsSoCCKRRUhLanoI34PP'
                      'wL23/p+dz84QC4NkoGRjQDCIRmG2GxJHBKgZaPbWwtsCDpnk+GeJXh6Mj7SPKMtm7iYsQASASgjzJMiIqC+ZYcY+YOIk'
                      't7ZoGwFHBytekh1UxZQq9UQJ9ZqjF0cWCCoFwW/W7CJgoyf6D2yy8ZP6elnQKm2gGnAbgCdkQQBAQN/GFSHep1OSgidg'
                      'OXmAou4lK4AQQ0iMJdlmKmga0QnANSRCkLFtLsmDgl1lEO9gEinhZmZABUyQTIScMSCB70AYLdHVXzx2jvhsrnb69p2o'
                      '5AoICoCK2UBuVKuRJiaSPahCNjo+SMPB6CBsN0WssDrePDhd4oOw0gAkbKAAG4iDRdSQJAbAg8Pwm2/5zhD38eR6Ponj'
                      'uPajkQrwMH8KwJKmHwYuKipLoBeAGE7+WJ76AwHAxSEUR+nAVlA6AQgLdiQG2aGAsJhG6kgGZG6iakRYA+6WzwbKCfES'
                      'hYQhgxkKiDZRWlVYpANKUBmRnHaHcZfIXkTAYSNkZUAExX03VgTgQCuojGq5/N1O78CcwEgZQGXJbnLOUwDF0piqDK4g'
                      'BIo+n6/FsJcAB2TvyKAyPFtJVoV7B0JKHo7pdJgJ7bLqiUKyDt0RqjXylCASk7JClMVXMCh74/0pwRgo8KpF6AACdkIM'
                      'MLEBIngGeDV83iTfI8ElM/1kLpupck2uCw2UxdsJCAFaPXo0QhIaLUyEEAwCVjGKpIFlGhiIxQROgEg5lF9P10Bze0Yk'
                      'BemHhiKAKNLBK+1AoIrVWm0UhfQFGyTCK0LcxVYegF6HRxVQNKTyHr6AohtTKDaqOIPWw2ZzbACfmCGmWPO551CqL/UC'
                      'sjFP5SlmwE3Oc0mZgRmQezg3k9jZog+KXwBDBCqgKSecz11AUQTU6viu2n0YgYgfEiIGGB/ETrvJAtQnlFLfGUugFg2Y'
                      'Zt/+mFk8ASCD6jl6ELVCCCkCnKRroBbv5g5u9YmgigMr7V+NIlCEzVqwF6ooAgGwUuvRKOIRVDEoiCIiPiBXrhrots0I'
                      'pTW+qd95/Od3ZndrM1u9ZmZGBXB8+yZzTnTbQfnB+cx8VLi4szfJEA2/fFCZtLARHDoBFn9qyZ1rV4BGiMizM1q0WNgFl'
                      '9+DDARs6oAn/oF+HgZccwEuZsLetcz4O5+/+JLARUygIVW0wJODco4j0kBc7PfZUwoQF57TCEAtYUpMFbnN6nNCdAMMIp'
                      'lVBCgs58CxHCw2a9ZYpVVKsBT0ZAAojycqiaAyZ/79Avf/XHxKYBUEUCaEzDQiwwwKYDRhmu/72X7H6Ez/8ESK/CAACSG'
                      'mAcogHBHUMbxTPgkkPBkpj/07PeCTUgKASQkgEBEgwIuglPq5VShDAjgPpcJEKh1Ce/3eVLjIU2XWIHPE0ATsmG/WrsAA'
                      'gmeCGZANvJxmBmGF30qBpioVywIIL4AU4KHaFSA6wLTcNJN/tDl1pubiDDJpngGMtVMKgkgV+RqSsBQcHF4sZyTdgOMt3'
                      '593Td7Y6jQIpZLBai2LNyk1iyAlKg4aRNgjPj3z2/kgTawbGrOsAByI9ej1izg0qXhENPzoFwMKcBs/68LMU6hQAsgJQJ'
                      '86hagGco1JHSBaTNgPP69kAB5N6ggQFXgbEpcahfgM8y7OKQzAAJ2Fol/J0b4sRKg6owiARqE37CAPvAN5PPikKkBcNff'
                      '2tk34ziOpQCkAQRYfAHhDrURAZZLEFHkghkA1LPtm5NNlxjTI4kTxRRv8DsJdgFmZQE+DQkgUkTfE7BlDOjClsj7utUQF'
                      'iEMCPD3qiQoF8Aq9IAFECaGFsAU8ItcmtD5UARTZgVlFoqtcgEE/WkzAnqKfh+zGAgwCtjqTHL1X4pJDYRJsakNpFiXL5'
                      'IKAsigVb8A0g+bMBkAwn0+8UpgrQBTvcEA8cq+BAywGhVA+pjWxZJOAI130OV1A74FoPc/hhDAsjMgAH1IuEFtXEAYI0D'
                      'ugfITX7Z/jB8TQ17/NNYqIMAQEpClQQFtQ689V4B77OMd+OsTf6xQHuiNDwGp/shccUqteQLYoILaBfT0kCDY9pwMKEyA'
                      'CcYsFHyqoo8z98QNVWmhEwkKEIlR0JnVK6DT6SDuDoayQPCboADEXnjoGT4PUAKAqgPkgADiC/DbkQYFgLb+Bb8yJRykg'
                      'Py1Nzc/7+wnH3isA1foN9UFEJUX3XoFtJ2hXqwTqliyp2G54Bm4GrLOJXExGyyzAgKctsyjZgEaEzx1uH+x7FZBO2QXs4'
                      'zvmAa8SxNXAPEFhJsyzAYFEKYDRq8DlnkcuLvIgcBunFQT4DdmdNG8AF/HMhsBxL8AroBemQDDJc9EzQKOGjpiFLFs9//s'
                      '60JMuAV6pFgAgQdpo3YBHTsUsCBXVsB32wjuLRL/78ScCyRVBfjUnwEjDEAVQoHJi3wGjPcWiH+G8DEEV0oFyF7kwAQoCY'
                      'ZOVoXECpiJDzy8kEzlw+5Ptn95plMkACZWcqXNojMgIEuDAtY0R9eMAOoYWQvLzlEIf9RNDhkYmXokQG0BzBttUiLAM9Fr'
                      'QACBBSyjgByxNeBsYgxghTVQAYZvAMRYN1hyVhJAGhVAjqqswASX7RYwP/U2cOBDZIhTx4NUweDF6w3nU9YXADtSEGbDAq'
                      '6uXQ2Hn+EymwDU/mx2pAqMNCTDRAtM/FQAAay9AwKyNCnAsCYGZpAV0wfNxMy1P4QWPBKXWArQBDNAqunZ4VJ7BujhEhSQ'
                      'af29r/9TghgC/1ycUIAgJMBgW3WOZjJgLTNclIBc6+89+REInwoYvjDx8t3HT68Yf1CA15GZDQOaEEDCOlYY/wxroobB'
                      'P/jA8ONXN8fXrzosvvG2NAPQi1GFsXG3XgEtO4pcYB4eEz71xBKICWDOP+TySD70rgao0qOxP61XQKtlY29x5BRQgHrWn'
                      'YmPyS+OiZBt+D5J8vpxDU1q7QJclAXgmsDLRubbHRi7psoRENL/U2R5vP7w4ejualQEGzOMxgWEYR4YATz5Z9jBuBO+Jv'
                      'bP7nyOFGdXnn5Rnypfbr29FwXJdWV4bVBAtzUPJWCmiqDdHz/L+fHjB9YOYidJ8nIUSe5d+2J6awjFj9Q9G86AUbYvc6h'
                      'XQBfh61WCEiDjr/yEyJ6qeHQevFyPJBv45hvzfKXKp+dvC7t0gVbBUbMARN51lk6HbkgAEgBUPxIbm94PK1FR3j7Hw2U+PP'
                      '7Rvxd4HapxMao9A1oYj8WyHkBLDEwsCpAlcPp3AmIMMT9EgtUH+nSZGwqk6bPb85rUBreAy2MVu9FAGRsqfiFgu/rxFxPgz'
                      'T0Z/y0VvpHJIhJ+shR0ZrI9PR0dPOvqioF0c+fXXgV+bavqT079E9LkE8d8ykZgPkY/RVnYlfn8GwE8Csi2dlMxp1m+fZsK'
                      '2Pm9kSk+2tIbQMSPd2PYTOUEoyjDagnRP2Bd9YDyNIjdLfEkQEGiFdgEeOFefxytbrOaiOPX0X/NOi7/2J58Vj0HTAzyttX'
                      'nY1YTJYAHqOBz9D+zrjaAToGUPR7Dzx8EJoxfXd1b9qvr4l7qCogF76N/Qnfp0f0nT+4/utCdKwCoWzb/0x604PJJlgBbTg'
                      'XgCDAyX96ODp6717ct1++WCVBVYPY5uPBpcMCBLAIHjH8CkUqA+48fRgfO8A975/vTNBDG8YsveCF705nFRbeqxJBAyEhc3F'
                      'g0c9nQTVFwjmj0BajoxN9omFJxWgsj1L/a5+457ul2aynY1Oj8cL0esNt4vn3uueduXVjteVidDRJgixTg+C7+OkMCJP7jJ'
                      'brRlE+mXIA+z+m+ZXFj9gYw/QXYUp/8kuZDjQFM2w/XmMcQoN5cEyr2CSDC52sWMxfBZLvXx8UADxCgBmA6ucDhCjzDSZDb'
                      'rwQgD1DzR9wTYWqZm08S2FCWUwExgCOjIG3+Be39wkQg6pd9AogBoAQQqRIK8JLFS9HmRsvqoC76CUDmA5sD47+jAwbhySP'
                      'AZ7WkhN5cALK+A9ljzB6QaoHR3GopgsBupYKGwLbA590wKHTlZYEDUkIcApfQfOkAm1IASp+smBMB0waEBNiQJzPQAyhz1e'
                      'e97rAFQUe0DAZ8EOajAPAEcHvVN09Xy7JingVqtqLn0aIWIAAO/i0n3I7Az+9KhyQDbisH4CKSfqgRlJjzgIY9lEagAPzaO'
                      'eH3A8AqUYRpVXkz8TYuJr459rbH/0GoFIuVVXsoq74CbEPhAnwKzWcwS0jwBhMBvgMmn2RzS+6YCNvB+thDAGvZQ2n5ewC+8'
                      '7UZfktsq2uhAM+8UymGkP1PwFceMK0uPizu1eCiLXFsL4s+AqhV0OaXsPb3LDBMFOsGToRbcgAA36UHqMessZipOGQ+VXbFT'
                      'wD6Hyjb++Ie2f1D+G5x0MMxyz0H9qMAwP5PV0RJC4C6e4PFzIztkOGyAaeZwwQAxMCFI4Bd+AKUBrjS/CAE8Ka/FofmwDgZc'
                      '7jFDta2ao2FEUDb/iKr4UudSAAZBo2r0gFUrmhJB1gzWOyUHW44FGG6VKPMAgTApY9UQImgOQNYv3NgvbrCdxin+gAllO'
                      'mi+vValYVgqsj3bopTLBrGudWAqKAtjnEWygPgkKk+YZEz9IG50DM00XiNCgIYAESf12HsN/I9ST4id2mj5aJI2izQA/TFT'
                      '3dAA2EueYJATvMGE7yYxxyQ5Jp/wUJg1HqKWkQK1JTtNgaAGvMXAD/71rf/BbUmhOYGUpSuCnOpNyuU/3e7K29T4S6X3SOu'
                      'sEgwctJ2SU4X9p7kBd0ARwLQnaDkzgiFABETcSC8NRiSfvJqBTusrD0JmQAnWz2xVsEVbCvJomFiWXoAHMsTTKczFHRqshH'
                      'Z2d1B9pAfez8UlhgFadKe3yHy/p4RfrzKdZssbRYRabPpCJpmmoURQF533XwSYI9/QfEKgJK9vMeOS9Puo8miowqhoERhWB'
                      'dAu8uxf5B77JcoByBkHFh5W49m7bbKIqQEAjAfhr/10/GYTwqoEcAlgOIVQOUD8++OJ0FPpa3i3Is4IyqzEB5A5kMQ0BTYI'
                      'Q9A66EQIkBKN1h7cv0YazeZsUkJFlmEQBRYCOMBRNd/CMirTyGAPICW/tbzl69o9gtFiVI2XkosQhqO0wjrAfoI0OcAXjAE'
                      'EMJ0Wcnm0QJiluznJcsiZN1x1pkP+sUXs6BHAlKAYiB6gBc0XtZ4vjAxO5assrDcdDzcZFHSctwW82G+c1gMpAg44AH6EJD'
                      'LAtlYFSw3KrVc2zybSBkskHMtR+UsrXMsQgx4Utfv1Z8Nf8vj8Flwp38I7NKlPxgNywMsNpdyV8yz59J+i7dFR7I4zqIkBf'
                      'Y7dZ8c4VVHw+r3f0uzn7IgYgcNl3FQOMKiHwulvHl+Sh8c9YJwglahziLlpAsKJLUUMTHZLlQaT7XLL44hAQAOmgTkLEjsy'
                      'dHPK2w8bRxCpdCeTPS7Q3UCwl+VRUzCdR13jCmM5KxZLN+UdDSGOoAyX0ogYyBhAbRghtbTm6Eoz52YTRrqYjnOSRY1s'
                      '2C/k8F28sxMrrIgaS40mwtPtXWA3MgmAYJXQuQCFASg3G3C0+NrQCWg9uD3ldxMVvjoKdfNsKjJukCWVROT+XJF56FPDN'
                      'DtpxhAIYDYldOArBcqR2UpP5mYcJ0JFjWmCxRyZR9IAfk2ttgT1mcBZb/kxyCeCcDqbJSPRcN1c9dZtFTnXKCxVBMs1Za'
                      'gUJtXmg8MzYIoCGAE0BXYVXngyob2OkFtouG4H5dy5nhUgdA4mW2XGkKAUgAbXgm4Ed7tnsGVIDmAxh52XblfOi4fXfej'
                      'aLSzJ43fvvSnp3MFAAUoBLK0cf/+o7se5u/OH4fnz+8/vlVQ5ApHBARYV52nT1d/w/pT0zkJPCnomvsrWHfd1ZyH6VPV4'
                      '1lvFufm5opzxSJU60KAovwezwK9Lc4I9cdzPP3hb20N9D9yQDAS5rV8/lr+GpQ8RwiwLtr0c6gU+Dj993lvn3j6t+BP1f'
                      'ubifDxIJmduXzl8hUBNHi7JQS4LNpQoEFt7QxQf+3nf6w/z5NCYIxNzugIAVozfzuTY4e5Qfq0Of1PY55OM3/qGXMEyNT'
                      '9rn5mckTIpJlOdXxihNCmRWMqO2JMGcxDKnN+5MikPJc/M5IcOEE9MT6iJOoMuD42wiT5B8NHmiRLjjgsNeKw9IjDjBG'
                      'H/edXe3AgAAAAACDI33qQKwAAAABeAqJmUmrUB96oAAAAAElFTkSuQmCC");',
        "expected_2": "未找到符合要求的房型",
        "expected_3": "暂无酒店数据",
        "title": "酒店详情页无房型时，缺省信息校验"
    }
]
