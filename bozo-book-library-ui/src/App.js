import React, { useState, useMemo } from 'react';

import { WebTracerProvider } from '@opentelemetry/sdk-trace-web';
import { CollectorTraceExporter } from '@opentelemetry/exporter-collector';
const { Resource } = require('@opentelemetry/resources');

import './App.css';
import './components/Book-Catalogue.css';


import Home from './components/Home';
import {CurrentUserContext} from './components/CurrentUserContext';

const serviceName = "bozo-book-ui";
const resource = new Resource({ "service.name": serviceName });
const provider = new WebTracerProvider({ resource });
const collector = new CollectorTraceExporter({
  url: "http://opentelemetry-opentelemetry-collector.opentelemetry.svc.cluster.local:4318/v1/traces",
});

const App = () => {
  const [user, setUser] = useState(null);
  const value = useMemo(() => ({ user, setUser }), [user, setUser]);

  return (
    <CurrentUserContext.Provider value={value}>
      <Home />
    </CurrentUserContext.Provider>
  );
}

export default App;
