import React from 'react'
import { updateOrderCategories } from '../Services/FirebaseService';

const Pincodes = (props) => {
    return(
        <>
            <h1>Pincodes</h1>
            {!props.loading ?
            <ul>
                {Object.keys(props.categories).map((category,index) => {
                    let categoryObj = props.categories[category];
                    let firstKey = Object.keys(categoryObj)[0];
                    return(
                        <li key = {index}>
                            <h5>{category}</h5>
                            <ul>
                                <li className = "row">
                                    <span className = "col-1">Pincodes</span>
                                    <input
                                        type="text"
                                        className = "form-control col-6"
                                        value = {categoryObj[firstKey]}
                                        onChange = {(event) => {
                                            let value = event.target.value.length > 0 ? event.target.value : ""
                                            let tempCategories = {...props.categories};
                                            tempCategories[category][firstKey] = value;
                                            props.setCategories(tempCategories)
                                        }}
                                    />
                                    <span className = "col-1">Price</span>
                                    <input
                                        type="text"
                                        className = "form-control col-1"
                                        value = {firstKey}
                                        onChange = {(event) => {
                                            let value = event.target.value.length > 0 ? event.target.value : ""
                                            let tempCategories = {...props.categories};
                                            tempCategories[category][`${value}`] = categoryObj[firstKey];
                                            delete tempCategories[category][firstKey];
                                            props.setCategories(tempCategories);
                                        }}
                                    />
                                </li>
                            </ul>
                        </li>
                    )
                })}
            </ul> : <span className = "spinner-border spinner-border-lg"/>}
            <button className = "btn btn-primary" onClick={() => updateOrderCategories(props.categories)}>
                Submit
            </button>
        </>
    )
}

export default Pincodes;