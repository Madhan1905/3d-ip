import React from 'react';
import LoginScreen from './Screens/LoginScreen';
import firebase from 'firebase/app';
import { BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import DashboardScreen from './Screens/DashboardScreen';
import ErrorScreen from './Screens/ErrorScreen';
import AuthenticatedRoute from './Components/AuthenticatedRoute';
import UsersScreen from './Screens/UsersScreen';
import AnalyticsScreen from './Screens/AnalyticsScreen';
import OrdersScreen from './Screens/OrdersScreen';
import ConfigScreen from './Screens/ConfigScreen';
import RidersScreen from './Screens/RidersScreen';
import UserHome from './UserScreens/UserHome';

var firebaseConfig = {
  apiKey: "AIzaSyAHYWo7RgaH9GUsmpqOQFnu9V7IGyu10Gs",
  authDomain: "iconfresh-web.firebaseapp.com",
  databaseURL: "https://iconfresh-web.firebaseio.com",
  projectId: "iconfresh-web",
  storageBucket: "iconfresh-web.appspot.com",
  messagingSenderId: "736411123781",
  appId: "1:736411123781:web:3510258915eb17a13e632c",
  measurementId: "G-K1Q7FTVQP5"
}

const App = () => {
  return (
    <div>
      <Router>
        <Switch>
          <Route path = '/' exact component = {UserHome}/>
          <Route path = '/admin' component = {LoginScreen}/>
          <Route path = '/login' component = {LoginScreen}/>
          <AuthenticatedRoute path = '/dashboard' component = {DashboardScreen}/>
          <AuthenticatedRoute path = '/users' component = {UsersScreen}/>
          <AuthenticatedRoute path = '/analytics' component = {AnalyticsScreen}/>
          <AuthenticatedRoute path = '/riders' component = {RidersScreen}/>
          <AuthenticatedRoute path = '/orders' component = {OrdersScreen}/>
          <AuthenticatedRoute path = '/config' component = {ConfigScreen}/>
          <Route component= {ErrorScreen}/>
        </Switch>
      </Router>
    </div>
  );
}

firebase.initializeApp(firebaseConfig);
export default App;
