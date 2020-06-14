import React from 'react';


const TextInput = (props) => {
    return(
        <div className="input-group mb-3">
            <div className="input-group-prepend">
                <span className="input-group-text">
                    {props.icon}
                </span>
            </div>
            <input 
                type={props.type}
                className={`form-control ${props.valid}`}
                placeholder={props.placeholder}
                onChange = {(event) => props.updateValue(event.target.value)}
                autoComplete = "on"
                value = {props.value}
            />
        </div>
    );
}

export default TextInput;