import React, { useEffect, useState } from 'react';
import SideNavComponent from '../Components/SideNavComponent';
import { fetchPromoCodes, getOrderCategories, updateOrderCategories, updatePromoCodes } from '../Services/FirebaseService';

const ConfigScreen = () => {

    const [categories,setCategories] = useState({});
    const [loading,setLoading] = useState(false);
    const [selectedTab,setSelectedTab] = useState("promo");
    const [promoCodes,setPromoCodes] = useState([]);
    const [submitting,setSubmitting] = useState(false);
    const [refresh,setRefresh] = useState(false);

    useEffect(() => {
        setLoading(true);
        if(selectedTab === "promo"){
            fetchPromoCodes().then(response => {
                setPromoCodes(response)
                setLoading(false);
            })
            .catch(error => console.log(error))
        } else {
            getOrderCategories().then(response => {
                setCategories(response)
                setLoading(false);
            })
            .catch(error => console.log(error))    
        }
        
    },[selectedTab,refresh])

    const addPromoCode = () => {
        let tempArray = promoCodes.slice();
        let newCode = {Name:"",Type:"Cash",Quantity:"0",existing:false};
        tempArray.push(newCode);
        setPromoCodes(tempArray);
    }

    const updatePromoCode = (event,dataType,index) => {
        let value = event.target.value.length > 0 ? event.target.value : ""
        let tempArray = promoCodes.slice();
        let tempCode = tempArray[index];
        tempCode[dataType] = value;
        setPromoCodes(tempArray);
    }

    const submitPromoCodes = (code) => {
        code.existing = true;
        setSubmitting(true);
        updatePromoCodes(code,true).then(() => setSubmitting(false))
        .catch(error => {
            console.log(error);
            setSubmitting(false);
        })
    }

    const deletePromoCodes = (codeId) => {
        setSubmitting(true);
        updatePromoCodes(codeId,false).then(() => {
            setRefresh(!refresh);
            setSubmitting(false);
        })
        .catch(error => {
            console.log(error);
            setSubmitting(false);
        })
    }

    return(
        <div style={{ display: "flex" }}>
            <SideNavComponent title='App Configuration' />
            <div className="single-product-main-body">
            <ul className="nav nav-tabs">
                <li className="nav-item">
                    <span 
                        className={`nav-link ${selectedTab === "pincodes" && 'active'}`}
                        onClick = {() => setSelectedTab("pincodes")}
                    >
                        Pincodes
                    </span>
                </li>
                <li className="nav-item">
                    <span 
                        className={`nav-link ${selectedTab === "promo" && 'active'}`}
                        onClick = {() => setSelectedTab("promo")}
                    >
                        Promo Codes
                    </span>
                </li>
            </ul>
            {selectedTab === "pincodes" &&<>
                <h1>Pincodes</h1>
                {!loading ?
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
                </ul> : <span className = "spinner-border spinner-border-lg"/>}
                <button className = "btn btn-primary" onClick={() => updateOrderCategories(categories)}>
                    Submit
                </button>
                </>}
                {selectedTab === "promo" &&<>
                    <div className = "row" style={{alignItems:"center"}}>
                        <h1 className = "col-3">Promo Codes</h1>
                        <button 
                            className = "btn btn-primary" 
                            style = {{height:"75%"}}
                            onClick = {() => addPromoCode()}
                        >
                            Add
                        </button>
                    </div>
                    {!loading ?
                    <ul>
                        {promoCodes.map((code,index) => (
                            <li className = "row mb-3" style={{alignItems:"center"}}>
                                <span className = "col-1">Name</span>
                                <input
                                    type="text"
                                    disabled = {code.existing}
                                    className = "form-control col-2"
                                    value = {code.Name}
                                    onChange = {(event) => updatePromoCode(event,"Name",index)}
                                />

                                <span className = "col-1">Type</span>
                                <select
                                    disabled = {code.existing}
                                    className="col-2"
                                    value = {code.Type}
                                    onChange = {(event) => updatePromoCode(event,"Type",index)}
                                >
                                    <option value="Percent">Percentage</option>
                                    <option value="Cash">Cash</option>
                                </select>

                                <span className = "col-1">Value</span>
                                <span className="input-group col-3">
                                    <input 
                                        disabled = {code.existing}
                                        type="number"
                                        className={`form-control`}
                                        onChange = {(event) => updatePromoCode(event,"Quantity",index)}
                                        value = {code.Quantity}
                                    />
                                    <div className="input-group-append">
                                        <span className="input-group-text">
                                            {code.Type === "Cash" ? <>&#8377;</> : "%"}
                                        </span>
                                    </div>
                                </span>

                                {!code.existing ?
                                    <button className = "btn btn-primary" onClick = {() => submitPromoCodes(code)}>
                                        {!submitting ? "Submit" : <span className = "spinner-border spinner-border-sm"/>}
                                    </button> :
                                    <button className = "btn btn-primary" onClick = {() => deletePromoCodes(code.id)}>
                                    {!submitting ? "Delete" : <span className = "spinner-border spinner-border-sm"/>}
                                    </button> 
                                }
                            </li>
                        ))}
                    </ul> : <span className = "spinner-border spinner-border-lg"/>}
                </>}
            </div>
        </div>
    )
}

export default ConfigScreen;