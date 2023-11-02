#pragma once
#include <string>
#include <map>
#include <memory>
#include "Poco/Mutex.h"
#include "Noncopyable.h"
#include "ConstantDefs.h"
class ConfigManager : public Noncopyable
{
public:
    explicit ConfigManager();
    virtual ~ConfigManager();

    static std::shared_ptr<ConfigManager> getInstance();
    void setConfig(ConfigKey key, int value);

    int getConfig(ConfigKey key, int defaltValue);

    
private:

    static Poco::FastMutex sMutex;
    static std::shared_ptr<ConfigManager> INSTANCE;
    Poco::Mutex mCacheMutex;
    std::map<ConfigKey, int> m_configs;
};

