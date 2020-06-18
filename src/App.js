import React from 'react';
import LoginScreen from './Screens/LoginScreen';
import firebase from 'firebase/app';
import { BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import DashboardScreen from './Screens/DashboardScreen';
import ErrorScreen from './Screens/ErrorScreen';
import AuthenticatedRoute from './Components/AuthenticatedRoute';
import UsersScreen from './Screens/UsersScreen';
import AnalyticsScreen from './Screens/AnalyticsScreen';

var firebaseConfig = {
  apiKey: "AIzaSyAOzqVTALw1DnMW97LDXmlAKXKTHZB4Ass",
  authDomain: "d-ip-fa2c8.firebaseapp.com",
  databaseURL: "https://d-ip-fa2c8.firebaseio.com",
  projectId: "d-ip-fa2c8",
  storageBucket: "d-ip-fa2c8.appspot.com",
  messagingSenderId: "627773397396",
  appId: "1:627773397396:web:d08e9172deb9e2c470d781",
  measurementId: "G-G0CX10VVTW"
}

const App = () => {
  return (
    <div>
      <Router>
        <Switch>
          <Route path = '/' exact component = {LoginScreen}/>
          <Route path = '/login' component = {LoginScreen}/>
          <AuthenticatedRoute path = '/dashboard' component = {DashboardScreen}/>
          <AuthenticatedRoute path = '/users' component = {UsersScreen}/>
          <AuthenticatedRoute path = '/analytics' component = {AnalyticsScreen}/>
          <Route component= {ErrorScreen}/>
        </Switch>
      </Router>
    </div>
  );
}

firebase.initializeApp(firebaseConfig);
export default App;
