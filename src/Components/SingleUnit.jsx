import React, { useState } from 'react';
import { useEffect } from 'react';
import { fetchImage } from '../Services/FirebaseService';

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

export default SingleUnit;