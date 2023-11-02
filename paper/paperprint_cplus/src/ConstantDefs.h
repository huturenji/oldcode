
#ifndef SINO_PAPERPRINT_CONSTANTS_CONSTANTDEFS_H_
#define SINO_PAPERPRINT_CONSTANTS_CONSTANTDEFS_H_

typedef enum _ConfigKey
{
    SINO_PAPERPRINT_IMAGE_DOWNSAMPLING = 0,        /* 原始图片进行下采样 */
    SINO_PAPERPRINT_IMAGE_DOWNSAMPLING_TOGRAY = 1, /* 下采样后的图片转为灰度图 */
    SINO_PAPERPRINT_IMAGE_DOWNSAMPLING_NUM = 2,    /* 下采样的倍数 */
   
    SINO_PAPERPRINT_MAX                            /* 无效值 */

} ConfigKey;



#endif //SINO_PAPERPRINT_CONSTANTS_CONSTANTDEFS_H_