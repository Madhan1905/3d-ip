import React, { useEffect, useState } from 'react';
import Delivery from '../Components/DeliveryComponent';
import FrontPictures from '../Components/FrontPicturesComponent';
import Pincodes from '../Components/PincodesComponent';
import Promocodes from '../Components/PromocodesComponent';
import SideNavComponent from '../Components/SideNavComponent';
import Subcategories from '../Components/SubcategoriesComponent';
import { fetchPromoCodes, getOrderCategories } from '../Services/FirebaseService';

const ConfigScreen = () => {

    const [categories,setCategories] = useState({});
    const [loading,setLoading] = useState(false);
    const [selectedTab,setSelectedTab] = useState("Delivery");
    const [promoCodes,setPromoCodes] = useState([]);
    const [submitting,setSubmitting] = useState(false);
    const [refresh,setRefresh] = useState(false);

    useEffect(() => {
        setLoading(true);
        if(selectedTab === "promo"){
            fetchPromoCodes().then(response => {
                setPromoCodes(response)
                setLoading(false);
            })
            .catch(error => console.log(error))
        } else {
            getOrderCategories().then(response => {
                setCategories(response)
                setLoading(false);
            })
            .catch(error => console.log(error))    
        }
        
    },[selectedTab,refresh])

    return(
        <div style={{ display: "flex" }}>
            <SideNavComponent title='App Configuration' />
            <div className="single-product-main-body">
                <ul className="nav nav-tabs">
                    <li className="nav-item">
                        <span 
                            className={`nav-link ${selectedTab === "pincodes" && 'active'}`}
                            onClick = {() => setSelectedTab("pincodes")}
                        >
                            Pincodes
                        </span>
                    </li>
                    <li className="nav-item">
                        <span 
                            className={`nav-link ${selectedTab === "promo" && 'active'}`}
                            onClick = {() => setSelectedTab("promo")}
                        >
                            Promo Codes
                        </span>
                    </li>
                    <li className="nav-item">
                        <span 
                            className={`nav-link ${selectedTab === "subcat" && 'active'}`}
                            onClick = {() => setSelectedTab("subcat")}
                        >
                            Sub Categories
                        </span>
                    </li>
                    <li className="nav-item">
                        <span 
                            className={`nav-link ${selectedTab === "slides" && 'active'}`}
                            onClick = {() => setSelectedTab("slides")}
                        >
                            Slide Pictures
                        </span>
                    </li>
                    <li className="nav-item">
                        <span 
                            className={`nav-link ${selectedTab === "Delivery" && 'active'}`}
                            onClick = {() => setSelectedTab("Delivery")}
                        >
                            Delivery
                        </span>
                    </li>
                </ul>
                {selectedTab === "pincodes" &&
                    <Pincodes
                        loading = {loading}
                        categories = {categories}
                        setCategories = {setCategories}
                    />
                }
                {selectedTab === "promo" && 
                    <Promocodes
                        promoCodes = {promoCodes}
                        setPromoCodes = {setPromoCodes}
                        submitting = {submitting}
                        setSubmitting = {setSubmitting}
                        refresh = {refresh}
                        setRefresh = {setRefresh}
                        loading = {loading}
                    />
                }
                {selectedTab === "subcat" &&
                    <Subcategories
                        loading = {loading}
                    />
                }
                {selectedTab === "slides" &&
                    <FrontPictures
                        loading = {loading}
                        setLoading = {setLoading}
                    />
                }
                {selectedTab === "Delivery" &&
                    <Delivery/>
                }
            </div>
        </div>
    )
}

export default ConfigScreen;