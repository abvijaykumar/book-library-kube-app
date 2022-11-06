import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

import { WebTracerProvider } from '@opentelemetry/sdk-trace-web';
import { CollectorTraceExporter } from '@opentelemetry/exporter-collector';
const { Resource } = require('@opentelemetry/resources');

const REACT_APP_OTEL_URL = process.env.REACT_APP_OTEL_URL;

const serviceName = "bozo-book-ui";
const resource = new Resource({ "service.name": serviceName });
const provider = new WebTracerProvider({ resource });
const collector = new CollectorTraceExporter({
  url: REACT_APP_OTEL_URL,
});


ReactDOM.render(
    <App />,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals(console.log);
