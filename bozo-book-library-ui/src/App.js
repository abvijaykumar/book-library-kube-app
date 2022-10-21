import React, { useState, useMemo } from 'react';

import './App.css';
import './components/Book-Catalogue.css';

import Home from './components/Home';
import {CurrentUserContext} from './components/CurrentUserContext';

const { ZipkinExporter } = require('@opentelemetry/exporter-zipkin');
const options = {
  headers: {
    'my-header': 'header-value',
  },
  url: 'your-zipkin-url',
  // optional interceptor
  getExportRequestHeaders: () => {
    return {
      'my-header': 'header-value',
    }
  }
}
const exporter = new ZipkinExporter(options);
tracer.addSpanProcessor(new BatchSpanProcessor(exporter));

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
