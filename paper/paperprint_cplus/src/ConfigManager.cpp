#include "ConfigManager.h"

Poco::FastMutex ConfigManager::sMutex;
std::shared_ptr<ConfigManager> ConfigManager::INSTANCE = nullptr;

std::shared_ptr<ConfigManager> ConfigManager::getInstance()
{
    Poco::FastMutex::ScopedLock lock(sMutex);
    if (!INSTANCE)
    {
        INSTANCE.reset(new ConfigManager());
    }
    return INSTANCE;
}

ConfigManager::~ConfigManager()
{

}


ConfigManager::ConfigManager()
{
    m_configs[SINO_PAPERPRINT_IMAGE_DOWNSAMPLING] = 0;
    m_configs[SINO_PAPERPRINT_IMAGE_DOWNSAMPLING_TOGRAY] = 0;
    m_configs[SINO_PAPERPRINT_IMAGE_DOWNSAMPLING_NUM] = 1;
}


void ConfigManager::setConfig(ConfigKey key, int value)
{
    if (SINO_PAPERPRINT_MAX <= key)
    {
        return;
    }

    Poco::Mutex::ScopedLock lock(mCacheMutex);
    m_configs[key] = value;
}

int ConfigManager::getConfig(ConfigKey key, int defaltValue)
{
    Poco::Mutex::ScopedLock lock(mCacheMutex);
    if (m_configs.end() != m_configs.find(key))
    {
        return m_configs.at(key);
    }

    return defaltValue;
}