export const bslConfig = {
    "dev": {
        "bslService": "https://bplusdev.sinosun.com:18180",
        "app": {
            "default_bsl_switch": false,
            "default_encryption_switch": false,
            "sm2pubkey": "",
            "kid": ""
        }
    },
    "sit": {
        "bslService": "https://bplussit.sinosun.com:18380",
        "app": {
            "default_bsl_switch": true,
            "default_encryption_switch": true,
            "sm2pubkey": "23C0F8DCD02606990A6B5C6F363D0B19870C2197B3885026DA704D5E60C60F5799C077E5A9EBAE30822B4E458FB28A0BDE539EA49ABE44963D9C12AF8B6B8DB0",
            "kid": "ea1a8c40a3ea44e9b6e4b8a642637408"
        }
    },
    "uat": {
        "bslService": "https://bplus-uat.sinosun.com",
        "app": {
            "default_bsl_switch": true,
            "default_encryption_switch": true,
            "sm2pubkey": "23C0F8DCD02606990A6B5C6F363D0B19870C2197B3885026DA704D5E60C60F5799C077E5A9EBAE30822B4E458FB28A0BDE539EA49ABE44963D9C12AF8B6B8DB0",
            "kid": "ea1a8c40a3ea44e9b6e4b8a642637408"
        }
    },
    "pro": {
        "bslService": "https://cloud.sinosun.com",
        "app": {
            "default_bsl_switch": true,
            "default_encryption_switch": true,
            "sm2pubkey": "73489C9CE57FC5910C6683305843FF4FB0F9BF0A034658270E4800A14BF3C81526C1F4F1252FB45144795724C6F3FE686FDA23E3E51BBF14A2D43539FD8D8600",
            "kid": "ce114520e5c846e28486d2f3ce1b1618"
        }
    },
}