#include <numeric>
#include <cmath>

#include "Tools.h"
#include "Poco/File.h"
#include "Poco/DirectoryIterator.h"
#include "Poco/Path.h"
#include <filesystem>
#include <windows.h>

bool Tools::fileExist(std::string filePath)
{
	bool exist = true;
	try
	{
		Poco::File file(filePath);
		if (!file.exists() || !file.isFile()) {
			exist = false;
		}
	}
	catch (const std::exception&)
	{
		return false;
	}
	
	return exist;
}

std::string Tools::fileName(std::string filePath)
{
	std::string fileName = filePath;
	if (fileExist(filePath))
	{
		try
		{
			Poco::Path path(filePath);
			fileName = path.getFileName();
		}
		catch (const std::exception&)
		{
			return fileName;
		}
		
	}
	return fileName;
}

double Tools::mean(std::vector<double> values)
{
	if (values.empty())
	{
		return 0;
	}
	double sum = accumulate(values.begin(), values.end(), 0.0);
	return sum / values.size();

}

double Tools::roundToFixed(double number, int decimalPlaces) 
{
	double factor = std::pow(10, decimalPlaces);
	double roundedNumber = std::round(number * factor) / factor;
	return roundedNumber;
}

std::string Tools::fileExtension(std::string filePath)
{
	
	//if (!fileExist(filePath))
	//{
	//	return "";
	//}
	//Poco::Path path(filePath);
	//std::string extension = path.getExtension();
	//return extension;
	
	size_t dotPos = filePath.find_last_of('.');
	if (dotPos != std::string::npos && dotPos < filePath.length() - 1) {
		return filePath.substr(dotPos + 1);
	}
	return "";
}

std::string Tools::currentPath()
{
	std::string currentPath = "";

	char buffer[MAX_PATH];
	GetModuleFileNameA(NULL, buffer, MAX_PATH);
	std::string fullPath(buffer);
	
	size_t lastSlashPos = fullPath.find_last_of("\\/");
	if (lastSlashPos != std::string::npos) {
		currentPath = fullPath.substr(0, lastSlashPos);
	}

	return currentPath;
}