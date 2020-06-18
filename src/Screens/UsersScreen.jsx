import React, { useState, useEffect } from 'react';
import SideNavComponent from '../Components/SideNavComponent';
import { getAllUsers } from '../Services/FirebaseService';

const UsersScreen = (props) => {
    const [users, setUsers] = useState([]);
    const [loading,setLoading] = useState(true);

    useEffect(() => {
        getAllUsers().then(result => {
            setUsers(result);
            setLoading(false);
        });
    },[])

    const getRows = () => {
        return(
        users.map((user,index) => {
            return (
                <tr key = {index}>
                    <th scope="row">{index+1}</th>
                    <td>{user.name}</td>
                    <td>{user.LoggedIn ? "Active" : "Inactive"}</td>
                    <td>{user.LoginTime}</td>
                </tr>
            );
        }));
    }

    return (
        <div style={{ display: "flex" }}>
            <SideNavComponent title='Users' />
            <div className='users-main-body'>
                {loading ?
                <div style = {{display:"flex", justifyContent:"center"}}>
                    <span className="spinner-border text-primary" role="status" /> 
                </div>:
                <table className="table">
                    <thead className="thead-dark">
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Name</th>
                            <th scope="col">Staus</th>
                            <th scope="col">Last Login</th>
                        </tr>
                    </thead>
                    <tbody>
                        {getRows()}
                    </tbody>
                </table>}
            </div>
        </div>
    )
}

export default UsersScreen;