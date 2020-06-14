import React from 'react';

const ErrorScreen = (props) => {
    return(
        <div className = 'notFoundError'>
            <img 
                src = {require('../Images/404.png')}
                alt = 'page not found'
            />
            <button 
                className = 'home-button btn btn-primary'
                onClick = {() => props.history.push('/dashboard')}
            >
                Back To Home
            </button>
        </div>
    );
}

export default ErrorScreen;