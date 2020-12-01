import React from 'react'
import { updatePromoCodes } from '../Services/FirebaseService';

const Promocodes = (props) => {

    const addPromoCode = () => {
        let tempArray = props.promoCodes.slice();
        let newCode = {Name:"",Type:"Cash",Quantity:"0",existing:false};
        tempArray.push(newCode);
        props.setPromoCodes(tempArray);
    }

    const updatePromoCode = (event,dataType,index) => {
        let value = event.target.value.length > 0 ? event.target.value : ""
        let tempArray = props.promoCodes.slice();
        let tempCode = tempArray[index];
        tempCode[dataType] = value;
        props.setPromoCodes(tempArray);
    }

    const submitPromoCodes = (code) => {
        code.existing = true;
        props.setSubmitting(true);
        updatePromoCodes(code,true).then(() => props.setSubmitting(false))
        .catch(error => {
            console.log(error);
            props.setSubmitting(false);
        })
    }

    const deletePromoCodes = (codeId) => {
        props.setSubmitting(true);
        updatePromoCodes(codeId,false).then(() => {
            props.setRefresh(!props.refresh);
            props.setSubmitting(false);
        })
        .catch(error => {
            console.log(error);
            props.setSubmitting(false);
        })
    }

    return(
        <>
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
            {!props.loading ?
            <ul>
                {props.promoCodes.map((code,index) => (
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
                                {!props.submitting ? "Submit" : <span className = "spinner-border spinner-border-sm"/>}
                            </button> :
                            <button className = "btn btn-primary" onClick = {() => deletePromoCodes(code.id)}>
                            {!props.submitting ? "Delete" : <span className = "spinner-border spinner-border-sm"/>}
                            </button> 
                        }
                    </li>
                ))}
            </ul> : <span className = "spinner-border spinner-border-lg"/>}
        </>
    )
}

export default Promocodes;