import React, { useState, useMemo } from 'react';



import './App.css';
import './components/Book-Catalogue.css';






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
