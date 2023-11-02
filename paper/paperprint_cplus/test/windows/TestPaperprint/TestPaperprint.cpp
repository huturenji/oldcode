// TestPaperprint.cpp : 此文件包含 "main" 函数。程序执行将在此处开始并结束。
//

#include <iostream>
#include "SinoPaperprint.h"


double roundToFixed(double number, int decimalPlaces) 
{
	double factor = std::pow(10, decimalPlaces);
	double roundedNumber = std::round(number * factor) / factor;
	return roundedNumber;
}

int testRoundToFixed() {
	double number = 3.14159265358979323846;
	int decimalPlaces = 3;
	double roundedNumber = roundToFixed(number, decimalPlaces);

	std::cout << "原始数值: " << number << std::endl;
	std::cout << "四舍五入后: " << roundedNumber << std::endl;

	return 0;
}

void testDerImg()
{
	std::string regImagePath = R"(D:\ZhiWen\SinosunCode\paperprint_cplus\test\Img\0001_1_628_j0.tiff)";
	std::string verifiImgPath = R"(D:\ZhiWen\SinosunCode\paperprint_cplus\test\Img\0001_1_628_j2_90_0.tiff)";

	std::string verifiJ1FilePath = R"(D:\ZhiWen\SinosunCode\paperprint_cplus\test\Img2\000001_0003_20230518095857_0_7_0001_3_J1.tiff)";

	PaperprintParam_t param;
	PaperprintResult_t result;
	compare(regImagePath.c_str(), verifiImgPath.c_str(), param, &result, verifiJ1FilePath.c_str());


	std::cout << "真图: " << std::endl <<
		roundToFixed(result.result_1_1, 3) << "  " <<
		roundToFixed(result.result_2_2, 3) << "  " <<
		roundToFixed(result.result_3_3, 3) << "  " <<
		roundToFixed(result.result_4_4, 3) << std::endl;

	std::cout << "假图: " << std::endl <<
		roundToFixed(result.result_1_2, 3) << "  " <<
		roundToFixed(result.result_1_3, 3) << "  " <<
		roundToFixed(result.result_1_4, 3) << "  " <<

		roundToFixed(result.result_2_1, 3) << "  " <<
		roundToFixed(result.result_2_3, 3) << "  " <<
		roundToFixed(result.result_2_4, 3) << "  " <<

		roundToFixed(result.result_3_1, 3) << "  " <<
		roundToFixed(result.result_3_2, 3) << "  " <<
		roundToFixed(result.result_3_4, 3) << "  " <<

		roundToFixed(result.result_4_1, 3) << "  " <<
		roundToFixed(result.result_4_2, 3) << "  " <<
		roundToFixed(result.result_4_3, 3) << std::endl;
}




int main()
{
	//testRoundToFixed();

	//testDerImg();


	std::string dngFullPath = "";
	if (false)
	{
		dngFullPath = R"(D:\ZhiWen\TestImg\20230615\000010_0006_20230615101902_0_0_0004_0_J0.DNG)";
		dngFullPath = "D:\\ZhiWen\\TestImg\\000006_0007_20230524160707_8_8_0013_00_J0.dng";
		//dng2tiff(dngFullPath, R"(D:\ZhiWen\TestImg\20230615\000010_0006_20230615101902_0_0_0004_0_J0.tiff)");
	}

	std::string regImagePath = R"(D:\ZhiWen\TestImg\000010_0006_20230615101902_0_0_0004_0_J0.tiff)";
	std::string verifiImgPath = R"(D:\ZhiWen\TestImg\000010_0006_20230615101902_0_0_0004_0_J1.tiff)";

	bool test0814 = true;
	if (test0814)
	{
		regImagePath = R"(D:\ZhiWen\SinosunCode\paperprint_cplus\test\Img\0001_1_628_j0.tiff)";
		verifiImgPath = R"(D:\ZhiWen\SinosunCode\paperprint_cplus\test\Img\0001_1_628_j2_90_0.tiff)";

	}

	bool test0816 = false;
	if (test0816)
	{
		regImagePath = R"(D:\ZhiWen\SinosunCode\paperprint_cplus\test\Img0816\000044_0006_20230707104100_0_0_0060_00_j0.tiff)";
		verifiImgPath = R"(D:\ZhiWen\SinosunCode\paperprint_cplus\test\Img0816\000044_0006_20230707104100_0_0_0062_00_j2.tiff)"; 
	}

	bool test0818_Test1 = false;
	if (test0818_Test1)
	{
		regImagePath = R"(D:\ZhiWen\SinosunCode\0818\0818\test1\000012_0007_20230817091331_0_0_0102_00_J0_bgr.tiff)";
		verifiImgPath = R"(D:\ZhiWen\SinosunCode\0818\0818\test1\000012_0007_20230817091347_0_0_0102_00_J2_bgr.tiff)";
	}

	bool Exif = false;
	if (Exif)
	{
		regImagePath = R"(D:\ZhiWen\SinosunCode\Exif\000023_0007_20230720170700_1_7_0140_3_J1.tiff)";
		verifiImgPath = R"(D:\ZhiWen\SinosunCode\Exif\000023_0007_20230720170700_1_7_0140_3_J1.tiff)";
	}

	bool Jpg = false;
	if (Jpg)
	{
		regImagePath = R"(D:\ZhiWen\SinosunCode\TestPicture\Jpg\captured_image.jpg)";
		verifiImgPath = R"(D:\ZhiWen\SinosunCode\TestPicture\Jpg\2edc4f987a65cba3e369c0c7062c223b.jpg)";
	}

	bool Jpg2 = true;
	if (Jpg2)
	{
		regImagePath = R"(D:\ZhiWen\SinosunCode\TestPicture\Jpg2\register.jpg)";
		verifiImgPath = R"(D:\ZhiWen\SinosunCode\TestPicture\Jpg2\verify.jpg)";
	}


	PaperprintParam_t param;
	if (true)
	{
		param.imageDownsampling = 1;
		param.imageDownsamplingToGray = 1;
		param.imageDownsamplingNum = 2;
	}

	PaperprintResult_t result;
	compare(regImagePath.c_str(), verifiImgPath.c_str(), param, &result);

	QrCodePoints_t qodePoints;
	char qrText[100];
	parseQrCodeImage(regImagePath.c_str(), &qodePoints, qrText, 100);

	std::cout << "result_1_1 :" << result.result_1_1 << std::endl <<
		"result_2_2 :" << result.result_2_2 << std::endl <<
		"result_3_3 :" << result.result_3_3 << std::endl <<
		"result_4_4 :" << result.result_4_4 << std::endl <<

		"result_1_2 :" << result.result_1_2 << std::endl <<
		"result_1_3 :" << result.result_1_3 << std::endl <<
		"result_1_4 :" << result.result_1_4 << std::endl <<

		"result_2_1 :" << result.result_2_1 << std::endl <<
		"result_2_3 :" << result.result_2_3 << std::endl <<
		"result_2_4 :" << result.result_2_4 << std::endl <<

		"result_3_1 :" << result.result_3_1 << std::endl <<
		"result_3_2 :" << result.result_3_2 << std::endl <<
		"result_3_4 :" << result.result_3_4 << std::endl <<

		"result_4_1 :" << result.result_4_1 << std::endl <<
		"result_4_2 :" << result.result_4_2 << std::endl <<
		"result_4_3 :" << result.result_4_3 << std::endl;

	std::cout << "真图: " << std::endl <<
		roundToFixed(result.result_1_1, 3) << "  " <<
		roundToFixed(result.result_2_2, 3) << "  " <<
		roundToFixed(result.result_3_3, 3) << "  " <<
		roundToFixed(result.result_4_4, 3) << std::endl;

	std::cout << "假图: " << std::endl <<
		roundToFixed(result.result_1_2, 3) << "  " <<
		roundToFixed(result.result_1_3, 3) << "  " <<
		roundToFixed(result.result_1_4, 3) << "  " <<
								
		roundToFixed(result.result_2_1, 3) << "  " <<
		roundToFixed(result.result_2_3, 3) << "  " <<
		roundToFixed(result.result_2_4, 3) << "  " <<
									
		roundToFixed(result.result_3_1, 3) << "  " <<
		roundToFixed(result.result_3_2, 3) << "  " <<
		roundToFixed(result.result_3_4, 3) << "  " <<
									
		roundToFixed(result.result_4_1, 3) << "  " <<
		roundToFixed(result.result_4_2, 3) << "  " <<
		roundToFixed(result.result_4_3, 3) << std::endl;

}

// 运行程序: Ctrl + F5 或调试 >“开始执行(不调试)”菜单
// 调试程序: F5 或调试 >“开始调试”菜单

// 入门使用技巧: 
//   1. 使用解决方案资源管理器窗口添加/管理文件
//   2. 使用团队资源管理器窗口连接到源代码管理
//   3. 使用输出窗口查看生成输出和其他消息
//   4. 使用错误列表窗口查看错误
//   5. 转到“项目”>“添加新项”以创建新的代码文件，或转到“项目”>“添加现有项”以将现有代码文件添加到项目
//   6. 将来，若要再次打开此项目，请转到“文件”>“打开”>“项目”并选择 .sln 文件
