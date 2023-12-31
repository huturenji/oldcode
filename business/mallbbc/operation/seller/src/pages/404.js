import React from 'react';
import Link from 'umi/link';
import { formatMessage } from 'umi/locale';
import Exception from '@/components/Exception';

export default () => (
    <Exception
        type="404"
        linkElement={Link}
        desc={formatMessage({ id: '抱歉，你访问的页面不存在' })}
        backText={formatMessage({ id: '返回首页' })}
    />
);
