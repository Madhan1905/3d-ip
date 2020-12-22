import React, { useEffect, useState } from 'react';
import SideNavComponent from '../Components/SideNavComponent';
import { getRiders,addRider } from '../Services/FirebaseService';
import * as firebase from "firebase";
require('firebase/auth');

const RidersScreen = () => {
    const [riders,setRiders] = useState([]);
    const [loading,setLoading] = useState(true);
    const [riderInfo,setRiderInfo] = useState(["",""]);
    const [otp,setOtp] = useState("");
    const [otpSent,setOtpSent] = useState(false);
    const [adding,setAdding] = useState(false);

    useEffect(() => {
        if(!adding){
            getRiders().then(rider_details => {
                setRiders(rider_details);
                setLoading(false);
            });
        }
        // window.appVerifier = new firebase.auth.RecaptchaVerifier(
        //     "recaptcha",
        //     {
        //       size: "invisible",
        //       callback: () => {
        //         console.log("Callback invoked")
        //         sendOtp();
        //       }
        //     }
        //   );
    },[adding])

    const updateRiderDetails = (value,index) => {
        let tempArray = riderInfo.slice();
        tempArray[index] = value;
        setRiderInfo(tempArray);
    }

    // const sendOtp = () => {
    //     setLoading(true);
    //     const appVerifier = window.appVerifier;
    //     firebase
    //     .auth()
    //     .signInWithPhoneNumber(`+91${riderInfo[1]}`, appVerifier)
    //     .then((confirmationResult) => {
    //         setLoading(false);
    //         console.log("Success");
    //         setOtpSent(true);
    //         window.confirmationResult = confirmationResult;
    //     })
    //     .catch((error) => {
    //         console.log("Error:" + error.code);
    //     });
    // }

    // const submitPhoneNumberAuthCode = () => {
    //     var code = otp;
    //     window.confirmationResult
    //         .confirm(code)
    //         .then((result) => {
    //             var user = result.user;
    //             console.log(user.uid)
    //             addRider(user,riderInfo)
    //             .then(() => setAdding(false))
    //         })
    //         .catch((error) => {
    //             console.log(error);
    //         });
    // }

    return(
        <div style={{ display: "flex" }}>
            <SideNavComponent title='Riders' />
            <div className="single-product-main-body">
                <div id="recaptcha"/>
                <>
                    {!adding ?
                    <>
                        {!loading ? <>
                            <button className = "btn btn-primary mb-5" onClick = {() => setAdding(true)}>
                                Add Rider
                            </button>
                            <ul>
                                {riders.map((rider,index) => (
                                    <li key = {index}>
                                    {rider.name}-{rider.phone}
                                    </li>
                                ))}
                            </ul>
                        </> : <span className = "spinner-border spinner-border-md"/>}
                    </> :
                    <>
                        <div className = "row mb-3">
                            <span className = "col-2">Name</span>
                            <input 
                                className = "col-3" 
                                type = "text"
                                value = {riderInfo[0]}
                                onChange = {(event) => {
                                    updateRiderDetails(event.target.value,0)
                                }}
                            />
                        </div>
                        <div className = "row mb-3">
                            <span className = "col-2">Phone</span>
                            <input 
                                className = "col-3" 
                                type = "number"
                                value = {riderInfo[1]}
                                onChange = {(event) => {
                                    updateRiderDetails(event.target.value,1)
                                }}
                            />
                        </div>
                        {/*<div className = "row mb-3">
                            <span className = "col-2">OTP</span>
                            <input 
                                className = "col-3" 
                                type = "number"
                                value = {otp}
                                onChange = {(event) => {
                                    setOtp(event.target.value)
                                }}
                            />
                        </div>
                        {!loading ?
                        <button
                            disabled = {loading}
                            onClick = {() => {
                                    otpSent ? submitPhoneNumberAuthCode() : sendOtp()
                                }}
                            className = "btn btn-primary"
                        >
                            {!otpSent ? 'Send OTP' : 'Submit'}
                        </button> : <span className = "spinner-border spinner-border-sm"/>} */}
                        <button
                            disabled = {loading}
                            onClick = {() => {addRider(riderInfo).then(() => setAdding(false))}}
                            className = "btn btn-primary"
                        >
                            Submit
                        </button>
                    </>}
                </>
            </div>
        </div>
    )
}

export default RidersScreen;