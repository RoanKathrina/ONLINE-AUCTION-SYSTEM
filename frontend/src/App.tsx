import React from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import LoginPage from "./component/LoginPage/LoginPage";
import SignupPage from "./container/SignupPage/SignupPage";
import HomePage from "./container/HomePage/HomePage";

function App() {
  return (
    <div className="App">
    <Router>
      <Switch>
          <Route path='/home' exact component={HomePage} />    
          <Route path='/signup' exact component={SignupPage} />    
          <Route path='/' component={LoginPage}/>
      </Switch>
    </Router>
    </div>
  );
}

export default App;
