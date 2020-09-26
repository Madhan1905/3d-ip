import React from 'react';


const TextInput = (props) => {
    return(
        <div className="input-group mb-3">
            {props.login && 
            <div className="input-group-prepend">
                <span className="input-group-text">
                    {props.icon}
                </span>
            </div> }
            <input 
                type={props.type}
                className={`form-control ${props.valid}`}
                placeholder={props.placeholder}
                onChange = {(event) => props.updateValue(event.target.value)}
                autoComplete = {props.login ? "on" : "off"}
                value = {props.value}
            />
        </div>
    );
}

export default TextInput;