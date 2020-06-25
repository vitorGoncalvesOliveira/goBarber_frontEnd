import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Global from './styles/global';

import AppProvider from './hooks';
import Routes from './routes';

const App: React.FC = () => (
  <Router>
    <AppProvider>
      <Routes />
    </AppProvider>
    <Global />
  </Router>
);
export default App;
