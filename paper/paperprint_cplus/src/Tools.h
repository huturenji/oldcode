#pragma once
#include <string>
#include <vector>
class Tools
{
public:
	static bool fileExist(std::string filePath);
	static std::string fileName(std::string filePath);
	static double mean(std::vector<double> values);
	static double roundToFixed(double number, int decimalPlaces);
	static std::string fileExtension(std::string filePath);
	static std::string currentPath();
};

