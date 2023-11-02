import yaml


class YamlTools:
    def __init__(self, filepath):
        self.filepath = filepath

    # 读取指定yaml文件
    def read(self):
        with open(self.filepath, "r", encoding="utf-8") as file:
            y_data = yaml.load(file, Loader=yaml.FullLoader)
        yaml_data = {
            "tid": y_data["tid"],
            "bank_name": y_data["bank_name"],
            "deploy_env": y_data["deploy_env"],
            "product_name": y_data["product_name"],
            "bank_mall_sm2_public_key": y_data["bank_mall_sm2_public_key"],
            "bank_travel_sm2_public_key": y_data["bank_travel_sm2_public_key"]
        }
        return yaml_data
