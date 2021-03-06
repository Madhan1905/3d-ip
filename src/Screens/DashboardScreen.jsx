import React, { useState } from 'react';
import SideNavComponent from '../Components/SideNavComponent';
import SingleUnit from '../Components/SingleUnit';
import Edit from '@material-ui/icons/Edit';
import MicIcon from '@material-ui/icons/Mic';
import { createProduct, fetchAllProducts, getSubCategories, updateProduct } from '../Services/FirebaseService';

const DashboardScreen = (props) => {
    const [inputFileds, setInputFields] = useState(["", "", "", "", "", "", "no", "", "","","yes"]);
    const [errorFields, setErrorFields] = useState([false, false, false, false, false, false, false, false, false,false]);
    const [picture, setPicture] = useState(null);
    const [pictureName, setPictureName] = useState("Upload Picture");
    const [loading, setLoading] = useState(false);
    const [progressWidth, setProgressWidth] = useState("0%");
    const [showButtons, setShowButtons] = useState(true);
    const [showAddBody, setShowAddBody] = useState(null);
    const [products, setProducts] = useState([]);
    const [filteredProducts,setFilteredProducts] = useState([]);
    const [productId, setProductId] = useState(null);
    const [subcategories,setSubcategories] = useState([]);

    const webkitSpeechRecognition = window.webkitSpeechRecognition;
    var recognition = new webkitSpeechRecognition();
        recognition.maxAlternatives = 10;
        recognition.continuous = false;
        recognition.interimResults = true;

    const startRecording = () => {
        console.log("started")
        recognition.lang = 'ta-IN';
        recognition.start();
    }

    recognition.onresult = (event) => {
    
        var interim_transcript = '';
        var final_transcript =  '';
        if (typeof(event.results) == 'undefined') {
          recognition.onend = null;
          recognition.stop();
          return;
        }
        for (var i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            final_transcript += event.results[i][0].transcript;
          } else {
            interim_transcript += event.results[i][0].transcript;
          }
        }
        updateValue(final_transcript, 1);
        
    };

    const updateValue = (value, index) => {
        let tempArray = inputFileds.slice();
        tempArray[index] = value;
        setInputFields(tempArray)
    }

    const updateErrorFields = (value, index) => {
        let tempArray = errorFields.slice();
        tempArray[index] = value;
        setErrorFields(tempArray);
    }

    const updateAllErrorFields = () => {
        let tempArray = [inputFileds[0].length < 1, false, inputFileds[2].length < 1, 
            inputFileds[3].length < 1, inputFileds[4].length < 1, picture == null, 
            inputFileds[5].length < 1, false, inputFileds[8].length < 1, 
            (inputFileds[9].length < 1 || !subcategories.includes(inputFileds[9])) ];
        setErrorFields(tempArray);
    }

    const updateSubcategories = (sub) => {
        getSubCategories().then(result => {
            if(result.Categories[sub]){
                setSubcategories(result.Categories[sub]);
            }
            setLoading(false);
        })
        .catch(error => console.log(error))
    }

    const submit = () => {
        setProgressWidth("25%")
        if (inputFileds[0].length > 0 && inputFileds[2].length > 0 && inputFileds[3].length > 0 && inputFileds[4].length > 0 && 
            inputFileds[5].length > 0 && inputFileds[9].length > 0 && subcategories.includes(inputFileds[9]) && (picture != null || productId)) {
            setLoading(true)
            if(productId) {
                updateProduct(inputFileds, picture, setProgressWidth, productId)
                .then(() => {
                    setInputFields(["", "", "", "", "", "", "no", "","","","yes"]);
                    setProductId(null);
                    setPicture(null);
                    setPictureName("Upload Picture");
                    setLoading(false);
                }).catch(error => {
                    setLoading(false);
                    console.log(error)
                })

            } else {
                createProduct(inputFileds, picture, setProgressWidth)
                .then(() => {
                    setInputFields(["", "", "", "", "", "", "no", "","","","yes"]);
                    setPicture(null);
                    setPictureName("Upload Picture");
                    setLoading(false);
                }).catch(error => {
                    setLoading(false);
                    console.log(error)
                })
            }
        } else {
            updateAllErrorFields();
        }
    }

    const addProductBody = () => {
        return (
            <main className='main-body'>
                {!loading && <>
                    <form
                        className='container form-group'
                        onSubmit={e => {
                            e.preventDefault();
                            submit();
                        }}
                    >

                        <div className="row product-input mb-4">
                            <label className="col-2">Product Name:</label>
                            <input
                                type="text"
                                className={`form-control col-4 ${errorFields[0] ? "is-invalid" : ""}`}
                                placeholder={"Enter name of the Product"}
                                onChange={(event) => {
                                    updateValue(event.target.value, 0);
                                    updateErrorFields(false, 0)
                                }}
                                value = {inputFileds[0]}
                            />
                            <label className="col-2">Tamil Name:</label>
                            <div className="input-group col-4" style = {{padding:0}}>
                                <input
                                    type="text"
                                    className={`form-control ${errorFields[1] ? "is-invalid" : ""}`}
                                    placeholder={"(Optional) Tamil Name"}
                                    onChange={(event) => {
                                        updateValue(event.target.value, 1);
                                        updateErrorFields(false, 1)
                                    }}
                                    value = {inputFileds[1]}
                                />
                                <div className="input-group-append">
                                    <button className="btn btn-outline-secondary" type="button" onClick = {() => startRecording()}>
                                        <MicIcon style = {{height:"20px"}}/>
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="row product-input mb-4">
                            <label className="col-2">Quantity Type:</label>
                            <select
                                className="col-4"
                                onChange={(event) => {
                                    updateValue(event.target.value, 2);
                                    updateErrorFields(false, 2)
                                }}
                                style={{ borderColor: errorFields[2] ? "red" : "grey" }}
                                value = {inputFileds[2]}
                            >
                                <option value="default">--Select--</option>
                                <option value="gram">Gram</option>
                                <option value="kg">KiloGram</option>
                                <option value="pc">Piece</option>
                            </select>
                            <label className="col-2">Quantity:</label>
                            <input
                                type="number"
                                min="0"
                                className={`form-control col-4 ${errorFields[3] ? "is-invalid" : ""}`}
                                placeholder={"Enter quantity for the Product"}
                                onChange={(event) => {
                                    updateValue(event.target.value, 3);
                                    updateErrorFields(false, 3)
                                }}
                                value = {inputFileds[3]}
                            />
                        </div>

                        <div className="row product-input mb-4">
                            <label className="col-2">Product Price:</label>
                            <input
                                type="number"
                                min="0"
                                className={`form-control col-4 ${errorFields[4] ? "is-invalid" : ""}`}
                                placeholder={"Enter price of the Product"}
                                onChange={(event) => {
                                    updateValue(event.target.value, 4);
                                    updateErrorFields(false, 4)
                                }}
                                value = {inputFileds[4]}
                            />
                            <label className="col-2">Selling Price:</label>
                            <input
                                type="number"
                                min="0"
                                className={`form-control col-4 ${errorFields[8] ? "is-invalid" : ""}`}
                                placeholder={"Enter selling price of the Product"}
                                onChange={(event) => {
                                    updateValue(event.target.value, 8);
                                    updateErrorFields(false, 8)
                                }}
                                value = {inputFileds[8]}
                            />
                        </div>

                        <div className="row product-input mb-4">
                            <label className="col-2">Category:</label>
                            <select
                                className="col-4"
                                onChange={(event) => {
                                    updateValue(event.target.value, 5);
                                    updateErrorFields(false, 6);
                                    updateSubcategories(event.target.value)
                                }}
                                style={{ borderColor: errorFields[6] ? "red" : "grey" }}
                                value = {inputFileds[5]}
                            >
                                <option value="default">--Select--</option>
                                <option value="Fruits">Fruits</option>
                                <option value="Vegetables">Vegetables</option>
                                <option value="Meat">Meat</option>
                                <option value="Breads & Egg">Breads & Egg</option>
                                <option value="Bakery">Bakery</option>
                                <option value="Spices & Masala">Spices & Masala</option>
                                <option value="Juices">Juices</option>
                            </select>

                            <label className="col-2">Bestsellers:</label>
                            <select
                                className="col-4"
                                onChange={(event) => {
                                    updateValue(event.target.value, 6);
                                }}
                                value = {inputFileds[6]}
                            >
                                <option value="yes">Yes</option>
                                <option value="no">No</option>
                            </select>
                        </div>

                        <div className="row product-input mb-4">
                            <label className="col-2">Sub Category:</label>
                            <select
                                className="col-4"
                                onChange={(event) => {
                                    updateValue(event.target.value, 9);
                                    updateErrorFields(false, 9);
                                }}
                                style={{ borderColor: errorFields[9] ? "red" : "grey" }}
                                value = {inputFileds[9]}
                            >
                                <option value="default">--Select--</option>
                                {subcategories.map(subCat => (
                                    <option value={subCat} key={subCat}>{subCat}</option>
                                ))}
                            </select>

                            <label className="col-2">Stock Available:</label>
                            <select
                                className="col-4"
                                onChange={(event) => {
                                    updateValue(event.target.value, 10);
                                }}
                                value = {inputFileds[10]}
                            >
                                <option value="yes">Yes</option>
                                <option value="no">No</option>
                            </select>
                        </div>

                        <div className="row product-input">
                            <label className="col-2">Description:</label>
                            <input
                                type="text"
                                className={`form-control col-4 ${errorFields[7] ? "is-invalid" : ""}`}
                                maxLength={70}
                                placeholder={"Enter description of the Product"}
                                onChange={(event) => {
                                    updateValue(event.target.value, 7);
                                    updateErrorFields(false, 7)
                                }}
                                value = {inputFileds[7]}
                            />
                            <label className="col-2">Select Picture:</label>
                            <div className="custom-file col-4">
                                <input
                                    type="file"
                                    className={'custom-file-input'}
                                    accept={[".jpg", ".jpeg", ".png"]}
                                    onChange={(event) => {
                                        setPicture(event.target.files[0]);
                                        setPictureName(event.target.files[0].name)
                                    }}
                                />
                                <label
                                    className="custom-file-label"
                                    htmlFor="fileName"
                                    style={{ textAlign: "left", borderColor: errorFields[5] ? "red" : "grey" }}
                                >
                                    {pictureName}
                                </label>
                            </div>
                        </div>

                        <div className='product-submit'>
                            <button
                                className='btn btn-success'
                                style={{ width: '40%' }}
                                type="submit"
                            >
                                {loading && <span className="spinner-border spinner-border-sm" role="status" />}
                                {!loading && <span>Submit</span>}
                            </button>
                        </div>
                    </form>
                </>}
            </main>
        )
    }

    const allProductsBody = () => {
        return (
            <main className='single-product-main-body'>
                <div className = "row">
                    <span className = "col-1">Search</span>
                    <input 
                        type = "text" 
                        onChange = {(event) => {
                            let tempArray = products.slice();
                            tempArray =  tempArray.filter(product => product.name.toUpperCase().startsWith(event.target.value.toUpperCase()))
                            setFilteredProducts(tempArray);
                        }}
                    />
                </div>
                {
                    filteredProducts.map((product,index) => {
                        return (
                            <div key = {index}>
                                <div 
                                    style = {{textAlignLast:"right"}}
                                    onClick = {() => {
                                        setInputFields([product.name, product.tamilName, 
                                            product.quantity.split(" ")[1], product.quantity.split(" ")[0], 
                                            product.price, product.category,product.bestseller,product.description,product.sellingPrice,
                                            product.subCategory,product.stock]);
                                        setProductId(product.id);
                                        setPicture('~~edit')
                                        setPictureName(`${product.name}.jpg`);
                                        updateSubcategories(product.category)
                                        setShowAddBody(true);
                                    }}
                                >
                                    <Edit/>
                                </div>
                                <SingleUnit product = {product}/>
                            </div>
                        )
                    })
                }
            </main>
        )
    }

    return (
        <div style={{ display: 'flex' }}>
            <SideNavComponent title='Dashboard' />
            {!loading && <>
                {showButtons &&
                <main className='main-body'>
                    <button
                        className="btn btn-success mb-5 w-25"
                        onClick={() => {
                            setLoading(true);
                            setProgressWidth("50%");
                            setShowButtons(false);
                            setShowAddBody(false);
                            fetchAllProducts().then(response => {
                                setProgressWidth("75%")
                                setLoading(false);
                                setProducts(response)
                                setFilteredProducts(response);
                            })
                        }}
                    >
                        Show All products
                    </button>
                    <button
                        className="btn btn-success w-25"
                        onClick={() => {
                            setShowButtons(false);
                            setShowAddBody(true)
                        }}
                    >
                        Add product
                    </button>
                </main>}
                {!showButtons && <>
                    {showAddBody && addProductBody()}
                    {!showAddBody && allProductsBody()}
                </>}
            </>}
            {loading && <>
                <main className='main-body'>
                    <div className='w-100' style={{ display: "flex", justifyContent: "center" }}>
                        <div className="progress" style={{ width: "75%" }}>
                            <div className="progress-bar" role="progressbar" style={{ width: progressWidth }}></div>
                        </div>
                    </div>
                </main>
            </>}
        </div>
    )
}

export default DashboardScreen;