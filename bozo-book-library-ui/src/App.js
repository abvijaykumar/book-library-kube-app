import React, { useState, useMemo } from 'react';

import { WebTracerProvider } from '@opentelemetry/sdk-trace-web';
import { CollectorTraceExporter } from '@opentelemetry/exporter-collector';


import './App.css';
import './components/Book-Catalogue.css';


import Home from './components/Home';
import {CurrentUserContext} from './components/CurrentUserContext';

const { Resource } = require('@opentelemetry/resources');

const REACT_APP_OTEL_URL = process.env.REACT_APP_OTEL_URL;

const serviceName = "bozo-book-ui";
const resource = new Resource({ "service.name": serviceName });
const provider = new WebTracerProvider({ resource });
const collector = new CollectorTraceExporter({
  url: REACT_APP_OTEL_URL,
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
