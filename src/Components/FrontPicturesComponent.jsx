import React, { useEffect, useState } from 'react';
import DeleteIcon from '@material-ui/icons/Delete';
import { createOfferImages, deleteOfferImages, fetchOfferImages } from '../Services/FirebaseService';

const FrontPictures = (props) => {

    const [images,setImages] = useState([]);
    const [loading,setLoading] = useState(false);

    useEffect(() => {
        if(loading === false){
            fetchOfferImages().then(response => {
                setImages(response)
                props.setLoading(false);
            })
            .catch(error => console.log(error))
        }
    },[loading])
    
    return(
        <>
            {!props.loading ?<>
                {!loading ?
                <input
                    className = "mb-5"
                    type="file"
                    accept={[".jpg", ".jpeg", ".png"]}
                    onChange={(event) => {
                        setLoading(true);
                        createOfferImages(event.target.files[0])
                        .then(() => setLoading(false))
                        .catch(error => console.log(error))
                    }}
                /> : <span className = "spinner-border spinner-border-md"/>}
                {images.map((image,index) => (
                    <div className = "row" key = {index}>
                        <div className = "slide-picture">
                            <img 
                                alt = "product"
                                className = 'picture-tag'
                                src = {image.url}
                                style = {{flex:1,height:null,width:null,resizeMode:"cover"}}
                            />
                        </div>
                        <span onClick = {() => {
                            setLoading(true);
                            deleteOfferImages(image.name)
                            .then(() => setLoading(false))
                        }}>
                            <DeleteIcon/>
                        </span>
                    </div>
                ))}
            </> : <span className = "spinner-border spinner-border-lg"/>}
        </>
    );
}

export default FrontPictures;