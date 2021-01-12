import React, { useEffect, useState } from 'react';
import SideNavComponent from '../Components/SideNavComponent';
import { OrderUnit } from '../Components/SingleUnit';
import { getOrders, getRiders } from '../Services/FirebaseService';
import * as firebase from "firebase";
require("firebase/database");

const OrdersScreen = () => {
    const [orders,setOrders] = useState({});
    const [riders,SetRiders] = useState([]);
    const [loading,setloading] = useState(true);
    const [selectedTab,setSelectedTab] = useState("Pending");
    const [orderModified,setOrderModified] = useState(true);

    useEffect(() => {
        let databaseRef = firebase.database().ref(`/AppOrders/OrderForApprove`)
        databaseRef.on(`value`,() => {
            alert("New Order Received. Refresh Page to fetch Orders")
        })
    },[])

    useEffect(() => {
        getOrders().then(result => {
            getRiders().then(rider_details => {
                SetRiders(rider_details)
                if(result != null)setOrders(result)
                setloading(false)
            }).catch(error => console.log(error))
        }).catch(error => console.log(error))
    },[selectedTab,orderModified])

    return(
        <div style={{ display: "flex" }}>
            <SideNavComponent title='Orders' />
            <div className="single-product-main-body">
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
            </div>
        </div>
    )
}

export default OrdersScreen;