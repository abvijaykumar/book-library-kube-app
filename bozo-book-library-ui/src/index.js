import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

import { MetricsProvider } from '@cabify/prom-react';

const normalizePath = (path: string) => {
  const match = path.match(/\/products\/(\d+)/);
  if (match) {
    return `/products/:id`;
  }
  return path;
};

const AppRoot = () => (
  <MetricsProvider
    appName="my-app-name"
    owner="my-team"
    getNormalizedPath={normalizePath}
    metricsAggregatorUrl="https://some-metrics-aggregator.com/push-metrics"
  >
    <OtherProviders>
      <App />
    </OtherProviders>
  </MetricsProvider>
);

ReactDOM.render(
    <AppRoot />,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals(console.log);
