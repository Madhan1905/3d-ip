import React from 'react'
import AuthenticationService from '../Services/AuthenticationService.js';
import { Route, Redirect } from 'react-router-dom';

const AuthenticatedRoute = (props) => {
    if(AuthenticationService.getUserId()){
        return (<Route {...props}/>);
    } else {
        return (<Redirect to = '/login'/>);
    }
}

export default AuthenticatedRoute;