import React, { useState, useEffect } from 'react';
import SideNavComponent from '../Components/SideNavComponent';
import { LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Line} from "recharts";
import { fetchRenderDetails } from '../Services/FirebaseService';

const AnalyticsScreen = () => {

    const [data,setData] = useState([]);

    useEffect(() => {
        fetchRenderDetails().then(details => setData(details));
    },[])

    return (
        <div style={{ display: "flex" }}>
            <SideNavComponent title='Analytics' />
            <div className="main-body">
                <h2 style={{ textAlign: "left" }}>Upload Time & Rating for each render</h2>
                <LineChart
                    width={730}
                    height={250}
                    data={data}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="Upload Time(ms)" stroke="#8884d8" />
                    <Line type="monotone" dataKey="User Rating" stroke="#82ca9d" />
                </LineChart>
            </div>
        </div>
    )
}

export default AnalyticsScreen;