import React from 'react'
import { Route, BrowserRouter as Router } from 'react-router-dom'
import './App.css';
import Landing from './pages/landing/';
import LivabilityResults from './pages/livability-results/';
import PreferencePage from './pages/preferencePage/';
import neighborhoodResults from './pages/user-neighborhoods/';


function App() {

  return (
    <Router>
      <Route exact path="/" component={Landing} />
      <Route exact path="/preferences" component={PreferencePage} />
      <Route exact path="/results" component={neighborhoodResults} />
      <Route exact path="/results/details" component={LivabilityResults} />
    </Router>
  );
}

export default App;
