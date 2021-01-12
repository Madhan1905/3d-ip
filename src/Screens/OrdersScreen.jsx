import React, { useEffect, useState } from 'react';
import SideNavComponent from '../Components/SideNavComponent';
import { OrderUnit } from '../Components/SingleUnit';
import { getOrders, getRiders, fetchOrderDetails } from '../Services/FirebaseService';
import * as firebase from "firebase";
require("firebase/database");

const OrdersScreen = () => {
    const [orders,setOrders] = useState({});
    const [orderWithDetails,setOrderWithDetails] = useState([]);
    const [riders,SetRiders] = useState([]);
    const [loading,setloading] = useState(true);
    const [selectedTab,setSelectedTab] = useState("Pending");
    const [orderModified,setOrderModified] = useState(true);
    const [totalOrders,setTotalOrders] = useState(null);
    const [showOrders,setShowOrders] = useState(false);

    // useEffect(() => {
    //     let databaseRef = firebase.database().ref(`/AppOrders/OrderForApprove`)
    //     databaseRef.on(`value`,() => {
    //         alert("New Order Received. Refresh Page to fetch Orders")
    //     })
    // },[])

    useEffect(() => {
        getOrders().then(result => {
            getRiders().then(rider_details => {
                SetRiders(rider_details)
                if(result != null){
                    let total = 0;
                    Object.keys(result).map(key => {
                        total += Object.keys(result[key]).length;
                    })
                    setTotalOrders(total);
                    setOrders(result);
                }
                if(showOrders){
                    setloading(false)
                }
            }).catch(error => console.log(error))
        }).catch(error => console.log(error))
    },[selectedTab,orderModified])

    useEffect(() => {
        if(!showOrders){
            getDetailsForOrders().then(result => {
                setOrderWithDetails([].concat.apply([], result));
            })
        }
    },[orders,showOrders])

    useEffect(() => {
        if(totalOrders !== null){
            setloading(false)
        }
    },[orderWithDetails])

    const getDetailsForOrders = () => {
        return new Promise(async(resolve, reject) => {
            await Promise.all(
                Object.keys(orders).map(async key => (
                    await Promise.all(
                        Object.keys(orders[key]).map(order => (
                            fetchOrderDetails(order,key).then(result => {
                                return result;
                            })
                        ))
                    ).then(response => {
                        return response
                    })
                ))
            ).then(res => {
                resolve(res)
            })
        });
    }

    const getOrderCount = (slotValue,check) => {
        let date = new Date();
        return orderWithDetails.filter(order => {
            if(order.slot === slotValue){
                switch(order.slot){
                    case "Today Prime 240min":
                        let orderDate = new Date();
                        let orderedTime = order.orderedTime.split(":");
                        orderDate.setHours(orderedTime[0]);
                        orderDate.setMinutes(orderedTime[1]);
                        orderDate.setSeconds(orderedTime[2]);
                        let minDiff = Math.round((date - orderDate) / 60000);
                        if((check && minDiff >= 240) || 
                        (!check && minDiff < 240)) {
                            return order;
                        }
                        break;
                    case "Today 6am - 8am":
                        if((check && date.getHours() >= 8) || 
                        (!check && date.getHours() < 8)) {
                            return order
                        }
                        break;
                    case "Today 9am - 11am":
                        if((check && date.getHours() >= 11) || 
                        (!check && date.getHours() < 11)) {
                            return order
                        }
                        break;
                    case "Today 4pm - 6pm":
                        if((check && date.getHours() >= 18) || 
                        (!check && date.getHours() < 18)) {
                            return order
                        }
                        break;
                    case "Today 6pm - 8pm":
                        if((check && date.getHours() >= 20) || 
                        (!check && date.getHours() < 20)) {
                            return order
                        }
                        break;
                }
            }
        }).length
    }

    return(
        <div style={{ display: "flex" }}>
            <SideNavComponent title='Orders' />
            <div className="single-product-main-body">
                <div className = "row mb-5">
                    <button 
                        className = "col-3 btn btn-primary mr-5"
                        onClick = {() => setShowOrders(true)}
                    >
                        Orders
                    </button>
                    <button 
                        className = "col-3 btn btn-primary"
                        onClick = {() => setShowOrders(false)}
                    >
                        Dashboard
                    </button>
                </div>
                {!showOrders ?<>
                    {!loading ?
                    <div>
                        <fieldset className = "group-box row align-items-center">
                            <legend className = "legend"><h2>Prime Orders</h2></legend>
                            <div className = "col-2">
                                <label><b>Pending Orders</b></label>
                                <label><b>Overdue Orders</b></label>
                            </div>
                            <div className = "col-1">
                                <label>
                                    <b>{getOrderCount("Today Prime 240min",false)}</b>
                                </label><br/>
                                <label><b>{getOrderCount("Today Prime 240min",true)}</b></label><br/>
                            </div>
                        </fieldset>
                        <fieldset className = "group-box row align-items-center">
                            <legend className = "legend"><h2>6am - 8am</h2></legend>
                            <div className = "col-2">
                                <label><b>Pending Orders</b></label>
                                <label><b>Overdue Orders</b></label>
                            </div>
                            <div className = "col-1">
                                <label>
                                    <b>{getOrderCount("Today 6am - 8am",false)}</b>
                                </label><br/>
                                <label><b>{getOrderCount("Today 6am - 8am",true)}</b></label><br/>
                            </div>
                        </fieldset>
                        <fieldset className = "group-box row align-items-center">
                            <legend className = "legend"><h2>9am - 11am</h2></legend>
                            <div className = "col-2">
                                <label><b>Pending Orders</b></label>
                                <label><b>Overdue Orders</b></label>
                            </div>
                            <div className = "col-1">
                                <label>
                                    <b>{getOrderCount("Today 9am - 11am",false)}</b>
                                </label><br/>
                                <label><b>{getOrderCount("Today 9am - 11am",true)}</b></label><br/>
                            </div>
                        </fieldset>
                        <fieldset className = "group-box row align-items-center">
                            <legend className = "legend"><h2>4pm - 6pm</h2></legend>
                            <div className = "col-2">
                                <label><b>Pending Orders</b></label>
                                <label><b>Overdue Orders</b></label>
                            </div>
                            <div className = "col-1">
                                <label>
                                    <b>{getOrderCount("Today 4pm - 6pm",false)}</b>
                                </label><br/>
                                <label><b>{getOrderCount("Today 4pm - 6pm",true)}</b></label><br/>
                            </div>
                        </fieldset>
                        <fieldset className = "group-box row align-items-center">
                            <legend className = "legend"><h2>6pm - 8pm</h2></legend>
                            <div className = "col-2">
                                <label><b>Pending Orders</b></label>
                                <label><b>Overdue Orders</b></label>
                            </div>
                            <div className = "col-1">
                                <label>
                                    <b>{getOrderCount("Today 6pm - 8pm",false)}</b>
                                </label><br/>
                                <label><b>{getOrderCount("Today 6pm - 8pm",true)}</b></label><br/>
                            </div>
                        </fieldset>
                    </div>: <span className="spinner-border spinner-border-lg" role="status" />}
                </>
                : <>
                    <ul className="nav nav-tabs">
                        <li className="nav-item">
                            <span 
                                className={`nav-link ${selectedTab === "Pending" && 'active'}`}
                                onClick = {() => setSelectedTab("Pending")}
                            >
                                Pending
                            </span>
                        </li>
                        <li className="nav-item">
                            <span 
                                className={`nav-link ${selectedTab === "Picked" && 'active'}`}
                                onClick = {() => setSelectedTab("Picked")}
                            >
                                Picked
                            </span>
                        </li>
                        <li className="nav-item">
                            <span 
                                className={`nav-link ${selectedTab === "Packaged" && 'active'}`}
                                onClick = {() => setSelectedTab("Packaged")}
                            >
                                Packaged
                            </span>
                        </li>
                        <li className="nav-item">
                            <span 
                                className={`nav-link ${selectedTab === "Assigned" && 'active'}`}
                                onClick = {() => setSelectedTab("Assigned")}
                            >
                                Assigned
                            </span>
                        </li>
                    </ul>
                    <h2 style = {{paddingBottom:'10px'}}>Pending Orders</h2>
                    {!loading ? <>
                        {Object.keys(orders).map(key => (
                            Object.keys(orders[key]).map(order => {
                                if(orders[key][order].status === selectedTab) {
                                    return(
                                        <OrderUnit 
                                            riders = {riders}
                                            userId = {key}
                                            orderId = {order}
                                            key = {order}
                                            selectionArray = {orders[key][order].selectionArray}
                                            orderStatus = {selectedTab}
                                            orderModified = {orderModified}
                                            setOrderModified = {setOrderModified}
                                        />
                                    )
                                }
                            })
                        ))}
                    </>: <span className="spinner-border spinner-border-lg" role="status" />}
                </>}
            </div>
        </div>
    )
}

export default OrdersScreen;