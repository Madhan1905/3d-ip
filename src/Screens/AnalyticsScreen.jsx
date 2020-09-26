import React, { useState, useEffect } from 'react';
import SideNavComponent from '../Components/SideNavComponent';
import { BarChart, Bar, Cell, CartesianGrid, XAxis, YAxis, Tooltip, Legend} from "recharts";
import { fetchRenderDetails } from '../Services/FirebaseService';

const AnalyticsScreen = () => {

    const [data,setData] = useState([]);

    useEffect(() => {
        let dataVal = [
            {
              name: 'Sep 7', users: 15
            },
            {
              name: 'Sep 8', users: 20
            },
            {
              name: 'Sep 9', users: 25
            },
            {
              name: 'Sep 10', users: 20
            },
            {
              name: 'Sep 11', users: 30
            },
            {
              name: 'Sep 12', users: 25
            },
            {
              name: 'Sep 13', users: 10
            },
          ];
        setData(dataVal);
        //fetchRenderDetails().then(details => setData(details));
    },[])

    return (
        <div style={{ display: "flex" }}>
            <SideNavComponent title='Analytics' />
            <div className="main-body">
                <h2 style={{ textAlign: "left" }}>Upload Time & Rating for each render</h2>
                <BarChart
                    width={500}
                    height={300}
                    data={data}
                    margin={{
                    top: 5, right: 30, left: 20, bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    
                    <Bar dataKey="users" fill="#82ca9d" />
                </BarChart>
            </div>
        </div>
    )
}

export default AnalyticsScreen;