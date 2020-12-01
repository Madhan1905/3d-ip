import React, { useState } from 'react';
import { useEffect } from 'react';
import { fetchImage, fetchOrderDetails, updateOrderStatus, updateRiderDetails } from '../Services/FirebaseService';

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
                <label>Category:</label><br/>
                <label>Sub Category:</label><br/>
                <label>Stock:</label>
            </div>
            <div className = "ml-5">
                <label>{props.product.name}</label><br/>
                <label>{props.product.tamilName === "" ? "----" : props.product.tamilName}</label><br/>
                <label>{props.product.quantity}</label><br/>
                <label>&#8377; {props.product.price}</label><br/>
                <label>&#8377; {props.product.sellingPrice}</label><br/>
                <label>{props.product.category}</label><br/>
                <label>{props.product.subCategory}</label><br/>
                <label>{props.product.stock}</label>
            </div>
        </div>
    )
}

export const OrderUnit = (props) => {
    const [orderDetails,setOrderDetails] = useState({});
    const [loading,setLoading] = useState(true);
    const [disabled,setDisabled] = useState(false);
    const [selectedRider,setSelecteRider] = useState("default");
    const [statusLoad,setStatusLoad] = useState(false);
    const [selectionArray,setSelectionArray] = useState([]);

    useEffect(() => {
        fetchOrderDetails(props.orderId,props.userId).then(result => {
            if(result.riderAssigned && result.riderAssigned !== "default"){
                setSelecteRider(result.riderAssigned);
                setDisabled(true)
            }
            if(props.selectionArray === undefined){
                let tempArray = [];
                result.prodcuts.map(() => tempArray.push(false));
                setSelectionArray(tempArray);
            } else {
                setSelectionArray(props.selectionArray);
            }
            setOrderDetails(result)
            setLoading(false)
        })
        .catch(error => console.log(error))
    },[])

    const assignOrder = (status) => {
        setLoading(true);
        setStatusLoad(true);
        updateOrderStatus(props.userId,props.orderId,status,selectedRider,selectionArray)
        .then(() => {
            updateRiderDetails(props.userId,props.orderId,selectedRider)
            .then(() => {
                setLoading(false);
                setStatusLoad(false);
                props.setOrderModified(!props.orderModified)
                setDisabled(true);
            }).catch(error => console.log(error))
        }).catch(error => console.log(error))
    }

    return(
        <div>
            <div className = "row">
                <div className = "col-8">
                    <div className = "row">
                        <label className = "col-2">Order Id:</label>
                        {`# ${props.orderId}`}
                    </div>
                    <div className = "row">
                        <label className = "col-2">Order Date:</label>
                        {`${orderDetails.orderedDate}`}
                    </div>
                    <div className = "row">
                        <label className = "col-2">Order Time:</label>
                        {`${orderDetails.orderedTime}`}
                    </div>
                    <div className = "row">
                        <label className = "col-2">Order Slot:</label>
                        {`${orderDetails.slot}`}
                    </div>
                    {!loading?
                        <span>
                            <div className = "row">
                                <label className = "col-2">Order Items:</label>
                                <ul className = "pl-0" style = {{listStylePosition: 'inside',listStyle: 'none'}}>
                                    {orderDetails.prodcuts.map((product,parentIndex) => {
                                        return(
                                            product.count.map((itemCount,index) => {
                                                let quantity = "1 Kg";
                                                if(itemCount > 0) {
                                                    switch(index) {
                                                        case 0 : quantity = "1 Kg"; break; 
                                                        case 1 : quantity = "750 g"; break; 
                                                        case 2 : quantity = "500 g"; break; 
                                                        case 3 : quantity = "250 g"; break; 
                                                    }
                                                    return(
                                                        <li key = {product.id}>
                                                            <input 
                                                                readOnly = {props.orderStatus === "Picked" ? false : true}
                                                                type="checkbox" 
                                                                className="mr-2" 
                                                                checked = {selectionArray[parentIndex]}
                                                                style={{pointerEvents:props.orderStatus === "Picked" ? "auto" : "none"}}
                                                                onClick = {() => {
                                                                    if(props.orderStatus === "Picked"){
                                                                        let tempArray = selectionArray.slice();
                                                                        tempArray[parentIndex] = !tempArray[parentIndex];
                                                                        setSelectionArray(tempArray);
                                                                    }
                                                                }}
                                                            />
                                                            {`${product.name} - ${product.count[index]} x ${quantity}`}
                                                        </li>  
                                                    )
                                                }
                                            })
                                        )
                                    })}
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
                    {(props.orderStatus === "Packaged" || props.orderStatus === "Assigned") && <div className = "row">
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
                    </div>}
                    <br/>
                    <br/>
                    {!statusLoad ? <>
                        {props.orderStatus === "Pending" &&
                        <div className = "col-11" style = {{textAlignLast:"end"}}>
                            <button 
                                className = {`btn btn-primary btn-sm` }
                                onClick = {() => assignOrder("Picked")}
                            >
                                Pick
                            </button>
                        </div>}
                        {props.orderStatus === "Picked" &&
                        <div className = "col-11" style = {{textAlignLast:"end"}}>
                            <button 
                                className = {`btn btn-primary btn-sm` }
                                onClick = {() => assignOrder(selectionArray.every(e => e === true) ? "Packaged": "Pending")}
                            >
                                Complete
                            </button>
                        </div>}
                        {props.orderStatus === "Packaged" &&
                        <div className = "col-11" style = {{textAlignLast:"end"}}>
                            <button 
                                className = {`btn btn-primary btn-sm` }
                                onClick = {() => assignOrder("Assigned")}
                                disabled = {selectedRider === "default"}
                            >
                                Ok
                            </button>
                        </div>}
                    </> :
                    <div className = "col-11" style = {{textAlignLast:"end"}}>
                        <span className = "spinner-border spinner-border-sm"/>
                    </div>}
                </div>
            </div>
            <hr/>
        </div>
    )
}

export default SingleUnit;