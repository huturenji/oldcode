GLOBAL_LOG_KEY = 'global_log'


def init():
    global _global_dict
    _global_dict = {}


def set_value(name, value):
    _global_dict[name] = value


def get_value(name):
    try:
        return _global_dict[name]
    except KeyError:
        return None


# 设置全局log对象
def set_log_value(value):
    _global_dict[GLOBAL_LOG_KEY] = value


# 获取全局log对象
def get_log_value():
    try:
        return _global_dict[GLOBAL_LOG_KEY]
    except KeyError:
        return None
