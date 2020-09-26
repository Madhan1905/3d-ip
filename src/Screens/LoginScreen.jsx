import React, { useState } from 'react';
import './Styles.css';
import TextInput from '../Components/TextInputComponent';
import PersonIcon from '@material-ui/icons/Person';
import VpnKeyIcon from '@material-ui/icons/VpnKey';
import { authenticate, register, createUser } from '../Services/FirebaseService';
import AuthenticationService from '../Services/AuthenticationService';

const LoginScreen = (props) => {

    const [userId, setUserId] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errorFields, setErrorFields] = useState([false, false, false, false, false]);
    const [valid, setValid] = useState(["", "", ""]);
    const [isLogin, setIsLogin] = useState(true);

    const updateErrorFields = (index, value) => {
        let tempArray = errorFields.slice();
        tempArray[index] = value;
        setErrorFields(tempArray)
    }

    const updateValidFields = (index, value) => {
        let tempArray = valid.slice();
        tempArray[index] = value;
        setValid(tempArray)
    }

    const login = () => {
        if (userId.length > 1 && password.length > 1) {
            updateErrorFields(0, false)
            updateErrorFields(0, false)
            setLoading(true)
            authenticate(userId, password)
                .then(() => {
                    createUser(userId).then(() => {
                        AuthenticationService.storeUserToken(userId);
                        props.history.push('/dashboard');
                    })
                }).catch(() => {
                    setLoading(false)
                    setError(true)
                })
        } else if (userId.length < 1) {
            updateErrorFields(0, true)
        } else {
            updateErrorFields(1, true)
        }
    }

    const signup = () => {
        if (!errorFields[2] && !errorFields[3] && !errorFields[4]) {
            setLoading(true);
            register(userId, password)
                .then(() => {
                    setLoading(false);
                    setIsLogin(true);
                })
                .catch(() => {
                    setLoading(false);
                    setError(true);
                })
        }
    }

    const getLoginForm = () => {
        return (
            <form
                className='login-form container form-group'
                onSubmit={e => {
                    e.preventDefault();
                    login();
                }}
            >
                {error && <div style={{ color: "red" }}>
                    Incorrect Username/Password
                        </div>}
                {errorFields[0] &&
                    <span className='errorText text-danger'>
                        Username is empty
                            </span>}
                <TextInput
                    login = {true}
                    placeholder='Username'
                    icon={<PersonIcon />}
                    type='text'
                    updateValue={(value) => {
                        setUserId(value)
                        updateErrorFields(0, false)
                    }}
                    valid={errorFields[0] ? "is-invalid" : ""}
                />
                {errorFields[1] &&
                    <span className='errorText text-danger'>
                        Password is empty
                            </span>}
                <TextInput
                    login = {true}
                    placeholder='Password'
                    icon={<VpnKeyIcon />}
                    type='password'
                    updateValue={(value) => {
                        setPassword(value)
                        updateErrorFields(1, false)
                    }}
                    valid={errorFields[1] ? "is-invalid" : ""}
                />
                <div className='login-button'>
                    <button
                        className='btn btn-success'
                        style={{ width: '40%' }}
                        type="submit"
                    >
                        {loading && <span className="spinner-border spinner-border-sm" role="status" />}
                        {!loading && <span>Login</span>}
                    </button>
                    {/* <span className='custom-link'>Forgot Password?</span> */}
                </div>
            </form>
        );
    }

    const getSignupForm = () => {
        return (
            <form
                className='login-form container form-group'
                onSubmit={e => {
                    e.preventDefault();
                    signup();
                }}
            >
                {error &&
                    <div style={{ color: "red" }}>
                        Username already exists
                    </div>}
                {errorFields[2] &&
                    <span className='errorText text-danger'>
                        Username is not a valid e-mail address
                    </span>}
                <TextInput
                    login = {true}
                    placeholder='Username'
                    icon={<PersonIcon />}
                    type='text'
                    updateValue={(value) => {
                        let regExp = /\S+@\S+\.\S+/;
                        setUserId(value)
                        if (regExp.test(value)) {
                            updateErrorFields(2, false);
                            updateValidFields(2, "is-valid");
                        } else {
                            updateErrorFields(2, true);
                            updateValidFields(2, "");
                        }
                    }}
                    valid={errorFields[2] ? "is-invalid" : valid[2]}
                />
                {errorFields[3] &&
                    <span className='errorText text-danger'>
                        Password should be atleast 8 characters
                            </span>}
                <TextInput
                    login = {true}
                    placeholder='Password'
                    icon={<VpnKeyIcon />}
                    type='password'
                    updateValue={(value) => {
                        setPassword(value)
                        if (value.length > 7) {
                            updateErrorFields(3, false);
                            updateValidFields(3, "is-valid");
                        } else {
                            updateErrorFields(3, true);
                            updateValidFields(3, "");
                        }
                    }}
                    valid={errorFields[3] ? "is-invalid" : valid[3]}
                />
                {errorFields[4] &&
                    <span className='errorText text-danger'>
                        Passwords does not match
                    </span>}
                <TextInput
                    login = {true}
                    placeholder='Confirm Password'
                    icon={<VpnKeyIcon />}
                    type='password'
                    updateValue={(value) => {
                        if (value !== password) {
                            updateErrorFields(4, true);
                            updateValidFields(4, "");
                        } else {
                            updateErrorFields(4, false);
                            updateValidFields(4, "is-valid");
                        }
                    }}
                    valid={errorFields[4] ? "is-invalid" : valid[4]}
                />
                <div className='login-button' style={{ justifyContent: "center" }}>
                    <button
                        className='btn btn-success'
                        style={{ width: '40%' }}
                        type="submit"
                    >
                        {loading && <span className="spinner-border spinner-border-sm" role="status" />}
                        {!loading && <span>Register</span>}
                    </button>
                </div>
            </form>
        );
    }

    return (
        <div className='login-screen'>
            <div className='login-container'>
                <div className='login-container-form'>
                    <div>
                        Icon Fresh - Freshness at your Doorsteps
                    </div>
                    <div className='login-header'>
                        <img
                            className='user-icon'
                            src="https://img.icons8.com/officel/80/000000/circled-user-male-skin-type-3.png"
                            alt='user'
                        />
                        LOGIN
                    </div>
                    {isLogin && getLoginForm()}
                    {!isLogin && getSignupForm()}
                    <div className='signup'>
                        <div>
                            {isLogin ? 'New User?' : 'Already Registered?'}
                            <span className='custom-link' onClick={() => {
                                setError(false);
                                setIsLogin(!isLogin)
                            }}>
                                {isLogin ? 'Sign-up' : 'Login'}
                            </span>
                        </div>
                    </div>
                </div>
                <div className='login-container-image'>
                    <img
                        className='login-image'
                        src={require('../Images/login.jpg')}
                        alt='loginImage'
                    />
                </div>
            </div>
        </div>
    );
}

export default LoginScreen;