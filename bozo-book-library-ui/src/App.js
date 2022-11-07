import React, { useState, useMemo } from 'react';

import './App.css';
import './components/Book-Catalogue.css';

import Home from './components/Home';
import {CurrentUserContext} from './components/CurrentUserContext';

import { usePerformanceMark, Stage } from '@cabify/prom-react';

const App = () => {
  const [user, setUser] = useState(null);
  const value = useMemo(() => ({ user, setUser }), [user, setUser]);
  usePerformanceMark(isLoading ? Stage.Usable : Stage.Complete, 'bozo-book-library-ui');

  return (
    <CurrentUserContext.Provider value={value}>
      <Home />
    </CurrentUserContext.Provider>
  );
}

export default App;
