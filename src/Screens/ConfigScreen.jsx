import React, { useEffect, useState } from 'react';
import SideNavComponent from '../Components/SideNavComponent';
import { getOrderCategories, updateOrderCategories } from '../Services/FirebaseService';

const ConfigScreen = () => {

    const [categories,setCategories] = useState({});


    useEffect(() => {
        getOrderCategories().then(response => setCategories(response))
        .catch(error => console.log(error))
    },[])

    return(
        <div style={{ display: "flex" }}>
            <SideNavComponent title='App Configuration' />
            <div className="single-product-main-body">
                <h1>Pincodes</h1>
                <ul>
                    {Object.keys(categories).map((category,index) => {
                        let categoryObj = categories[category];
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
                                                let tempCategories = {...categories};
                                                tempCategories[category][firstKey] = value;
                                                setCategories(tempCategories)
                                            }}
                                        />
                                        <span className = "col-1">Price</span>
                                        <input
                                            type="text"
                                            className = "form-control col-1"
                                            value = {firstKey}
                                            onChange = {(event) => {
                                                let value = event.target.value.length > 0 ? event.target.value : ""
                                                let tempCategories = {...categories};
                                                tempCategories[category][`${value}`] = categoryObj[firstKey];
                                                delete tempCategories[category][firstKey];
                                                setCategories(tempCategories);
                                            }}
                                        />
                                    </li>
                                </ul>
                            </li>
                        )
                    })}
                </ul>
                <button className = "btn btn-primary" onClick={() => updateOrderCategories(categories)}>
                    Submit
                </button>
            </div>
        </div>
    )
}

export default ConfigScreen;