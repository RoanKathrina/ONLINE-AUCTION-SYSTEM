import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import HomePage from "./container/HomePage/HomePage";
import LoginPage from "./container/LoginPage/LoginPage";
import SignupPage from "./container/SignupPage/SignupPage";

function App() {
  return (
    <div className="App">
    <Router>
      <Switch>
          <Route path="/home" component={HomePage} />
          <Route path='/signup' exact component={SignupPage} />    
          <Route path='/login' component={LoginPage}/>
      </Switch>
    </Router>
    </div>
  );
}

export default App;
