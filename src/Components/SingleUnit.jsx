import React, { useState } from 'react';
import { useEffect } from 'react';
import { fetchImage, fetchOrderDetails, updateOrderStatus } from '../Services/FirebaseService';

const SingleUnit = (props) => {

    const [imageUrl,setImageUrl] = useState("https://firebasestorage.googleapis.com/v0/b/iconfresh-web.appspot.com/o/no-image.jpg?alt=media&token=6d1ad3cf-c7e2-4b8a-8a21-5d4862d89ef1")

    useEffect(() => {
        fetchImage(props.product.id)
        .then(response => {
            setImageUrl(response)
        }).catch(error => {
            console.log(error)
        })
    },[props.product.id])

    return (
        <div className = "single-unit mb-4 row">
            <div className = "picture">
                <img 
                    alt = "product"
                    className = 'picture-tag'
                    src = {imageUrl}
                    style = {{flex:1,height:null,width:null,resizeMode:"cover"}}
                />
            </div>
            <div className = "ml-2">
                <label>Name:</label><br/>
                <label>Tamil Name:</label><br/>
                <label>Quantity:</label><br/>
                <label>Price:</label><br/>
                <label>Selling Price:</label><br/>
                <label>Category:</label>
            </div>
            <div className = "ml-5">
                <label>{props.product.name}</label><br/>
                <label>{props.product.tamilName === "" ? "----" : props.product.tamilName}</label><br/>
                <label>{props.product.quantity}</label><br/>
                <label>&#8377; {props.product.price}</label><br/>
                <label>&#8377; {props.product.sellingPrice}</label><br/>
                <label>{props.product.category}</label>
            </div>
        </div>
    )
}

export const OrderUnit = (props) => {
    const [orderDetails,setOrderDetails] = useState({});
    const [loading,setLoading] = useState(true);
    const [disabled,setDisabled] = useState(false);
    const [selectedRider,setSelecteRider] = useState("default");

    useEffect(() => {
        fetchOrderDetails(props.orderId,props.userId).then(result => {
            if(result.riderAssigned){
                setSelecteRider(result.riderAssigned);
                setDisabled(true)
            }
            setOrderDetails(result)
            setLoading(false)
        })
        .catch(error => console.log(error))
    },[])

    const assignOrder = () => {
        setLoading(true);
        updateOrderStatus(props.userId,props.orderId,selectedRider)
        .then(() => {
            setLoading(false);
            setDisabled(true);
        })
    }

    return(
        <div>
            <div className = "row">
                <div className = "col-8">
                    <div className = "row">
                        <label className = "col-2">Order Id:</label>
                        {`# ${props.orderId}`}
                    </div>
                    {!loading?
                        <span>
                            <div className = "row">
                                <label className = "col-2">Order Items:</label>
                                <ul className = "pl-0" style = {{listStylePosition: 'inside'}}>
                                    {orderDetails.prodcuts.map(product => (
                                        <li key = {product.id}>
                                            {`${product.name} - ${product.count[0]}kg`}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className = "row">
                                <label className = "col-2">Address:</label>
                                {`${orderDetails.address.name},${orderDetails.address.no},${orderDetails.address.street},${orderDetails.address.city}-${orderDetails.address.pin}`}
                            </div>
                            <div className = "row">
                                <label className = "col-2">Order Status:</label>
                                {disabled ? `Assigned` : `Unassigned`}
                            </div>
                        </span> :
                        <span className="spinner-border spinner-border-sm" role="status" />
                    }
                </div>
                <div className = "col-4">
                    <div className = "row">
                        <label className = "col-4">Assign to:</label>
                        <select 
                            className = "col-6"
                            disabled = {disabled}
                            value = {selectedRider}
                            onChange = {(event) => setSelecteRider(event.target.value)}
                        >
                            <option value="default">--Select--</option>
                            {props.riders.map(rider => (
                                <option key = {rider.id}>{rider.name}</option>
                            ))}
                        </select>
                    </div>
                    <br/>
                    <br/>
                    {!disabled&&
                    <div className = "col-11" style = {{textAlignLast:"end"}}>
                        <button 
                            className = {`btn ${selectedRider === "default" ? 'btn-secondary' : 'btn-primary'} btn-sm` }
                            disabled = {selectedRider === "default" ? true : false}
                            onClick = {() => assignOrder()}
                        >
                            Ok
                        </button>
                    </div>}
                </div>
            </div>
            <hr/>
        </div>
    )
}

export default SingleUnit;