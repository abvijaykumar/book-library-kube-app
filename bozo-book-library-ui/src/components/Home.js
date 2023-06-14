import React, { useState, useContext} from 'react';
import {
    Route, 
    NavLink,
    HashRouter
  } from "react-router-dom";

  
import Login from './Login';
import BookList from './BookList';
import Library from './Library';
import {CurrentUserContext} from './CurrentUserContext';


/*tracing.js*/
const opentelemetry = require("@opentelemetry/sdk-node");
const {
  getNodeAutoInstrumentations,
} = require("@opentelemetry/auto-instrumentations-node");
const {
  OTLPTraceExporter,
} = require("@opentelemetry/exporter-trace-otlp-proto");
const {
  OTLPMetricExporter
} = require("@opentelemetry/exporter-metrics-otlp-proto");
const {
  PeriodicExportingMetricReader
} = require('@opentelemetry/sdk-metrics');

const sdk = new opentelemetry.NodeSDK({
  traceExporter: new OTLPTraceExporter({
    // optional - default url is http://localhost:4318/v1/traces
    url: process.env.TRACE_BACKEND_ENDPOINT,
    // optional - collection of custom headers to be sent with each request, empty by default
    headers: {},
  }),
  instrumentations: [getNodeAutoInstrumentations()],
});
sdk.start();



const Home = () => {
    const { user } = useContext(CurrentUserContext);
    print(process.env.TRACE_BACKEND_ENDPOINT);
    return(
        <div className="App">
        {user ? (
          <div>
            <HashRouter>
              <ul className="header">
                <li><NavLink to="/">Browse</NavLink></li>
                <li><NavLink to="/library">My Library</NavLink></li>
              </ul>
              <div className="content">
                <Route exact path="/" component={BookList} />
                <Route path="/library" component={Library} />
              </div>
            </HashRouter>
          </div>
        ) : (
          <Login/>
        )}
      </div>

    )
};

export default Home;