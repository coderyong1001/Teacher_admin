import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
// ConfigProvider全局化配置
import { ConfigProvider } from 'antd';
// 国际化
import zhCN from 'antd/es/locale/zh_CN';

ReactDOM.render(<ConfigProvider locale={zhCN}><App />
</ConfigProvider>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
