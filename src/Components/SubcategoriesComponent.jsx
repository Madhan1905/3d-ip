import React, { useEffect, useState } from 'react';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import { getSubCategories, setSubCategories } from '../Services/FirebaseService';

const Subcategories = () => {

    const [categories,setCategories] = useState({});
    const [editing,setEditing] = useState(false);
    const [editingText,setEditingText] = useState("");
    const [loading,setLoading] = useState(true);

    useEffect(() => {
        getSubCategories().then(result => {
            setCategories(result.Categories)
            setLoading(false);
        })
        .catch(error => console.log(error))
    },[])

    const additem = (items,sub,newItem) => {
        debugger
        if(!editing){
            let tempItems = items.slice();
            tempItems.push(newItem ? `${newItem}~~edit` : `~~edit`);
            if(newItem){
                let index = items.indexOf(newItem);
                tempItems.splice(index, 1);
            }

            setEditingText(newItem);
            setEditing(true);
            let tempCategories = {...categories}
            tempCategories[sub] = tempItems;
            setCategories(tempCategories);
        } else {
            let tempItems = items.slice();
            let index = items.findIndex(item => item.includes("~~edit"));
            if(index != -1){
                tempItems.splice(index, 1);
                tempItems.push(newItem);

                let tempCategories = {...categories}
                tempCategories[sub] = tempItems;
                setSubCategories(tempCategories).then(() => {
                    setEditing(false);
                    setCategories(tempCategories);
                })
            }
        }
    }

    const deleteitem = (items,sub,newItem) => {
        let tempItems = items.slice();
        let index = items.indexOf(newItem);
        tempItems.splice(index, 1);

        let tempCategories = {...categories}
        tempCategories[sub] = tempItems;
        setSubCategories(tempCategories).then(() => {
            setEditing(false);
            setCategories(tempCategories);
        })
    }

    const getSublist = (sub) => {
        let items = categories[sub]
        if(items){
            return(
                items.map((item,index) => {return(
                <span key = {index}>
                    {!item.includes("~~edit") ? 
                        <li>
                            <div className = "row">
                                <span className = "col-2">{item}</span>
                                <EditIcon 
                                    onClick = {() => additem(items,sub,item)}
                                />
                                <DeleteIcon 
                                    onClick = {() => deleteitem(items,sub,item)}
                                />
                            </div>
                        </li>
                    : <div>
                        <input 
                            type = "text" 
                            className = "col-3 mr-5"
                            value = {editingText}
                            onChange = {(event) => {
                                setEditingText(event.target.value)
                            }}
                        />
                        <button 
                            className = "btn btn-primary"
                            onClick = {() => additem(items,sub,editingText)}
                        >
                            Add
                        </button>
                    </div>}
                </span> )})
            );
        }
    }

    return(
        <>
            {!loading ? 
            <ul>
                <li className = "category-title">
                    <div className = "row">
                        <span className = "col-2">Fruits</span>
                        <AddCircleIcon 
                            style = {{color:"green"}}
                            onClick = {() => additem(categories.Fruits,'Fruits')}
                        />
                    </div>
                    <ul>
                        {getSublist('Fruits')}
                    </ul>
                </li>
                <li className = "category-title">
                    <div className = "row">
                        <span className = "col-2">Vegetables</span>
                        <AddCircleIcon 
                            style = {{color:"green"}}
                            onClick = {() => additem(categories.Vegetables,'Vegetables')}
                        />
                    </div>
                    <ul>
                        {getSublist('Vegetables')}
                    </ul>
                </li>
                <li className = "category-title">
                    <div className = "row">
                        <span className = "col-2">Meat</span>
                        <AddCircleIcon 
                            style = {{color:"green"}}
                            onClick = {() => additem(categories.Meat,'Meat')}
                        />
                    </div>
                    <ul>
                        {getSublist('Meat')}
                    </ul>
                </li>
                <li className = "category-title">
                    <div className = "row">
                        <span className = "col-2">Breads & Egg</span>
                        <AddCircleIcon 
                            style = {{color:"green"}}
                            onClick = {() => additem(categories['Breads & Egg'],'Breads & Egg')}
                        />
                    </div>
                    <ul>
                        {getSublist('Breads & Egg')}
                    </ul>
                </li>
                <li className = "category-title">
                    <div className = "row">
                        <span className = "col-2">Bakery</span>
                        <AddCircleIcon 
                            style = {{color:"green"}}
                            onClick = {() => additem(categories.Bakery,'Bakery')}
                        />
                    </div>
                    <ul>
                        {getSublist('Bakery')}
                    </ul>
                </li>
                <li className = "category-title">
                    <div className = "row">
                        <span className = "col-2">Juices</span>
                        <AddCircleIcon 
                            style = {{color:"green"}}
                            onClick = {() => additem(categories.Juices,'Juices')}
                        />
                    </div>
                    <ul>
                        {getSublist('Juices')}
                    </ul>
                </li>
                <li className = "category-title">
                    <div className = "row">
                        <span className = "col-2">Spices & Masala</span>
                        <AddCircleIcon 
                            style = {{color:"green"}}
                            onClick = {() => additem(categories['Spices & Masala'],'Spices & Masala')}
                        />
                    </div>
                    <ul>
                        {getSublist('Spices & Masala')}
                    </ul>
                </li>
            </ul> : <span className = "spinner-border spinner-border-lg"/>}
        </>
    )
}

export default Subcategories;