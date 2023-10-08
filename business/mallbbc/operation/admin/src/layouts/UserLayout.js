import React from 'react';
import DocumentTitle from 'react-document-title';
import styles from './UserLayout.less';

const cacheHead = window.location.pathname.split('/')[1] ? window.location.pathname.split('/')[1] : '';
class UserLayout extends React.PureComponent {
    // @TODO title

    render() {
        const { children } = this.props;
        return (
            <DocumentTitle title={`平台后台${cacheHead}`}>
                <div className={styles.container}>
                    {children}
                </div>
            </DocumentTitle>    
        );
    }
}

export default UserLayout;
