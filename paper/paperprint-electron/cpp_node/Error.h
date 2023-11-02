// 错误吗定义

#ifndef __BASE_ERROR__
#define __BASE_ERROR__


// 错误码
enum
{

	// 1. MCU、光源、电机相关错误码

	//打开设备失败
	ERR_DEV_MCU_OPEN_FAILED = 0xB001,

	//关闭设备失败
	ERR_DEV_MCU_CLOSE_FAILED = 0xB002,

	//设备未开启
	ERR_DEV_HAS_NOT_OPENED = 0xB003,

	//无此id的灯光
	ERR_DEV_HAS_NO_THIS_LIGHT = 0xB004,

	//无此id的电机
	ERR_DEV_HAS_NO_THIS_MOTOR = 0xB005,

	//返回包校验失败
	ERR_DEV_MCU_CHECK_WRONG = 0xB006,

	//同时操作多个灯光/电机id个数与其他参数个数不一致
	ERR_DEV_PRA_NUM_UNMATCH = 0xB007,

	//缓冲区长度不够
	ERR_DEV_BUF_LEN_TOO_SMALL = 0xB008,

	//设备不在位
	ERR_USB_DEV_OFFLINE = 0xB009,

	//无法读写USB设备
	ERR_USB_DEV_CAN_NOT_RW = 0xB010,


	// 2. 相机相关错误码

	// 相机枚举失败
	ERR_CAM_ENUM_FAILED = 0xB100,

	// 相机初始化失败
	ERR_CAM_INIT_FAILED = 0xB101,

	// 相机已开启
	ERR_CAM_ALREADY_OPENED = 0xB102,

	// 相机未开启
	ERR_CAM_NOT_OPENED_YET = 0xB103,

	// 拍照超时
	ERR_CAM_CAP_TIMEOUT = 0xB104,


	// 3. 其它类型错误码

	// 分配内存失败
	ERR_DEV_ALLOCATE_MEM_FAILED = 0xB200

};


#endif
