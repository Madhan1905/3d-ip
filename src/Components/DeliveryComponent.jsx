import React, { useEffect, useState } from 'react';
import { fetchDeliveryFee, updateDeliveryFee, updatePrimeFee } from '../Services/FirebaseService';

const Delivery = () => {

    const [fee,setFee] = useState(0);
    const [primeFee,setPrimeFee] = useState(0);
    const [loading,setLoading] = useState(false);

    useEffect(() => {
        fetchDeliveryFee().then(result => {
            setFee(result.Fee)
            setPrimeFee(result.PrimeFee)
        })
        .catch(error => console.log(error))
    },[]); 

    return(
        <div>
            <div className = "row mt-5">
                <span className = "col-3">Delivery Fee</span>
                <input 
                    className = "col-3" 
                    type = "number" 
                    value = {fee} 
                    onChange = {(event) => setFee(event.target.value)}
                />
                <button 
                    className = "ml-3 btn btn-primary"
                    onClick = {() => {
                        setLoading(true);
                        updateDeliveryFee(fee)
                        .then(() => setLoading(false))
                    }}
                >
                    {!loading ? <span>Submit</span> : <span className = "spinner-border spinner-border-sm"/>}
                </button>
            </div>
            <div className = "row mt-5">
                <span className = "col-3">Prime Fee</span>
                <input 
                    className = "col-3" 
                    type = "number" 
                    value = {primeFee} 
                    onChange = {(event) => setPrimeFee(event.target.value)}
                />
                <button 
                    className = "ml-3 btn btn-primary"
                    onClick = {() => {
                        setLoading(true);
                        updatePrimeFee(primeFee)
                        .then(() => setLoading(false))
                    }}
                >
                    {!loading ? <span>Submit</span> : <span className = "spinner-border spinner-border-sm"/>}
                </button>
            </div>
        </div>
    )
}

export default Delivery;