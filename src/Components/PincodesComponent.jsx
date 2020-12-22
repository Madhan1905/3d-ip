import React, { useEffect, useState } from 'react'
import { fetchPincodeEnablement, updateOrderCategories } from '../Services/FirebaseService';
import ToggleOffIcon from '@material-ui/icons/ToggleOff';
import ToggleOnIcon from '@material-ui/icons/ToggleOn';

const Pincodes = (props) => {

    const [enabled,setEnabled] = useState(false);
    const [loading,setLoading] = useState(false);

    useEffect(() => {
        fetchPincodeEnablement()
        .then(result => setEnabled(result.Enabled))
        .catch(error => console.log(error))
    },[])

    return(
        <>
            <div className = "d-flex justify-content-between align-items-center">
                <h1>Pincodes</h1>
                <div className = "d-flex align-items-center">
                    <h5 style = {{alignSelf:"center"}}>Enable</h5>
                    {enabled ? <ToggleOnIcon style = {{color:"blue"}} onClick = {() => setEnabled(!enabled)}/> : 
                    <ToggleOffIcon onClick = {() => setEnabled(!enabled)}/>}
                </div>
            </div>
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
            <button className = "btn btn-primary" onClick={() => {
                    setLoading(true);
                    updateOrderCategories(props.categories,enabled)
                    .then(() => setLoading(false))
                }}>
                {!loading ? <span>Submit</span> : <span className = "spinner-border spinner-border-sm"/>}
            </button>
        </>
    )
}

export default Pincodes;