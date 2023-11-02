#pragma once
#include <vector>
class Params {
public:
    static const double MIN_TRUE; // �������ϵ������Ϊ�����С��ֵ
    static const bool IMAGE_FLOAT32 = true; // ��ȡdng��tiff image����Ϊfloat32����������(����Ĭ����uint16)
    static const bool QRCODE_ALGIN_FORCE = false; // ǿ��ʹ�ö�ά����׼��falseʱ����ʹ��orb��׼����ͼ������Ż�ʹ�ö�ά����׼��trueʱֱ������ʹ�ö�ά����׼
    static const int QRCODE_WIDTH = -1; // ͸�ӱ任ʱ��ά���׼�߳�, -1��ʾ��ע��ͼ��СΪ׼��������ָ��ֵΪ��׼����200��300
    static const int CUT_SIZE[3]; // �ü�ֽ�Ʊȶ�����Ĵ�С��-1��ʾ�Զ�ά���С�ü�, [padding,width,height]
    static const double RECALCULATE_THRESHOLD[2]; // ����������ȷ��ʱ��Ҫ������λ������ֵ��Χ
    static const int MATCH_POSITION = 3; // ģ��ƥ�䷶Χ������ͼ�ȶ���������λ�����ط�Χ
    static const int GAUSSIAN_SIZE = 9; // sobel��ĸ�˹ģ��������Խ��Խģ��
    static const int GAUSSIAN_SIGMA = 3; // sobel��ĸ�˹ģ��������Խ��Խģ��
    static const bool SOBEL_CALC_AVG = true; // ture��sobel x��y�ֱ��������Ժ�ȡƽ��ֵ��falseΪsobelx��y����ֱ�Ӽ��������
    static const bool SOBEL_1 = false; // sobel 3*3 ���������ھ����ԵһȦ��ֵ�ǲ�׼ȷ�ģ���ȥ��
    static const double EXCEPITON_MIN_TRUE; // ��ͼ��ͬ������С���ϵ��С����ֵ��Ϊ�쳣
    static const double EXCEPITON_MAX_FALSE; // ��ͼ���ϵ��������ֵ��Ϊ�쳣
    static const double EXCEPITON_SPAN; // ��ͼ����ͼ���ϵ�����С��0.2����Ϊ���쳣
    static const bool SAVE_ORIGIN_IMAGE = true; // �Ƿ񱣴�ԭʼ�Ա�ͼ
    static const bool SAVE_CUT_IMAGE = true; // �Ƿ񱣴���׼�Ա�ͼ
    static const bool SAVE_COMPARE_IMAGE = true; // �Ƿ񱣴�ÿ���ü���ֽ��ͼ�ĶԱ�ͼ
    static const bool SAVE_TIFF_PPIMAGE = true; // �Ƿ񱣴�ü����ֽ��tiffͼ
    static const bool SAVE_FALSE_IMAGE = true; // �Ƿ񱣴��ͼ�Ĺ���ͼ��false�Ļ����϶�������
    static const bool SAVE_COMPARE_HIST_IMAGE = true; // �Ƿ񱣴�ÿ��ԱȽ��ֱ��ͼ
};

