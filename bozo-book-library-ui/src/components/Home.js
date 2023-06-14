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

import { NodeTracerProvider } from '@opentelemetry/sdk-trace-node';
import { SimpleSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { CollectorTraceExporter } from '@opentelemetry/exporter-collector';
import { BatchSpanProcessor } from '@opentelemetry/sdk-trace-node';

const provider = new NodeTracerProvider();

// Set the exporter configuration
const exporter = new CollectorTraceExporter({
  serviceName: 'bozo-book-library-ui',
  url: process.env.TRACE_BACKEND_ENDPOINT,
});


// Create a batch span processor for sending spans in batches
const processor = new BatchSpanProcessor(exporter);

// Add the processor to the provider
provider.addSpanProcessor(processor);

// Register the provider
provider.register();



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