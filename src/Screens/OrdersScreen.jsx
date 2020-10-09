import React, { useEffect, useState } from 'react';
import SideNavComponent from '../Components/SideNavComponent';
import { OrderUnit } from '../Components/SingleUnit';
import { getOrders, getRiders } from '../Services/FirebaseService';

const OrdersScreen = () => {
    const [orders,setOrders] = useState({});
    const [riders,SetRiders] = useState([]);
    const [loading,setloading] = useState(true);

    useEffect(() => {
        getOrders().then(result => {
            getRiders().then(rider_details => {
                SetRiders(rider_details)
                setOrders(result)
                setloading(false)
            }).catch(error => console.log(error))
        }).catch(error => console.log(error))
    },[])

    return(
        <div style={{ display: "flex" }}>
            <SideNavComponent title='Orders' />
            <div className="single-product-main-body">
                <h2 style = {{paddingBottom:'10px'}}>Pending Orders</h2>
                {!loading ? <>
                    {Object.keys(orders).map(key => (
                        Object.keys(orders[key]).map(order => {
                            return(
                                <OrderUnit 
                                    riders = {riders}
                                    userId = {key}
                                    orderId = {order}
                                    key = {order}
                                />
                            )
                        })
                    ))}
                </>: <span className="spinner-border spinner-border-lg" role="status" />}
            </div>
        </div>
    )
}

export default OrdersScreen;