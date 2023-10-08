import newsHandler from 'common/lib/requestHandler/newsHandler';

/**
 * 
 * @returns 频道配置数据
 */
export async function getChannelConfigs() {
    const result = await newsHandler.getChannelAccessConfig();
    let channelOptions = {};
    result.result.channelAccessConfigs.forEach(item => {
        if(item.configKey === 'grayscaleFull') {
            channelOptions[item.configKey] = item.configValue === 'true'
        } else {
            channelOptions[item.configKey] = item.configValue
        }

    });
    return channelOptions;
}