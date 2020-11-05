import * as firebase from "firebase";
require('firebase/auth');
require("firebase/firestore");
require("firebase/storage");
require("firebase/database");

export const authenticate = (userName, password) => {
    return new Promise((resolve, reject) => {
        firebase.auth().signInWithEmailAndPassword(userName, password)
            .then(result => {
                resolve(result)
            }).catch(error => {
                reject(error)
            })
    });
}

export const register = (userName, password) => {
    return new Promise((resolve, reject) => {
        firebase.auth().createUserWithEmailAndPassword(userName, password)
            .then(result => {
                resolve(result)
            }).catch(error => {
                reject(error)
            })
    });
}

export const createUser = (userName) => {
    return new Promise((resolve, reject) => {
        const dataBase = firebase.firestore();
        let collectionRef = dataBase.collection('Users');
        var date = new Date();
        collectionRef.doc(userName).set({
            LoggedIn: true,
            LoginTime: date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear() + " at "
                + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds(),
        })
        .then(res => {
            resolve(res)
        })
        .catch(error => {
            console.log(error)
            reject(error)
        })
    });
}

export const logOutUser = (userName) => {
    return new Promise((resolve, reject) => {
        const dataBase = firebase.firestore();
        let collectionRef = dataBase.collection('Users');
        collectionRef.doc(userName).update({LoggedIn: false})
            .then(res => resolve(res))
    });
}

export const getAllUsers = () => {
    return new Promise((resolve, reject) => {
        const dataBase = firebase.firestore();
        let collectionRef = dataBase.collection('Users');
        let usersArray = [];
        collectionRef.get()
            .then((users) => {
                users.docs.map(user =>
                    usersArray.push({
                        name: user.id,
                        LoggedIn: user.data().LoggedIn,
                        LoginTime: user.data().LoginTime
                    })
                )
                resolve(usersArray);
            })
            .catch(error => {
                reject(error);
            })
    });
}

const createKeyword = (name) => {
    let subName = '';
    var array = [];
    name.split('').map(letter => { 
        subName += letter; 
        array.push(subName)
    })
    return array;
}

export const fetchAllProducts = () => {
    return new Promise((resolve, reject) => {
        const dataBase = firebase.firestore();
        let collectionRef = dataBase.collection('Available Products');
        let productsArray = [];
        collectionRef.get()
            .then((products) => {
                products.docs.map(product =>
                    productsArray.push({
                        id: product.id,
                        name: product.data().name,
                        price: product.data().price,
                        sellingPrice: product.data().sellingPrice,
                        quantity: product.data().quantity,
                        tamilName: product.data().tamilName,
                        category: product.data().category,
                        bestseller: product.data().bestseller,
                        description: product.data().description
                    })
                )
                resolve(productsArray);
            })
            .catch(error => {
                reject(error);
            })
    });
}

export const createProduct = (productDetails,imageFile,setProgressWidth) => {
    return new Promise((resolve, reject) => {
        const dataBase = firebase.firestore();
        var keyWordArray = [];
        var tamilArray = [];

        var nameSpaces = productDetails[0].split(' ');
        nameSpaces.push(productDetails[0]);

        nameSpaces.map(name => {
            keyWordArray = keyWordArray.concat(createKeyword(name.toUpperCase()));
        })

        if(productDetails[1].length > 0) {
            var tamilNameSapces = productDetails[1].split(' ');
            tamilNameSapces.push(productDetails[1]);
            tamilNameSapces.map(name => {
                tamilArray = tamilArray.concat(createKeyword(name));
            })
        }
        

        let collectionRef = dataBase.collection('Available Products');
        collectionRef.add({
            name: productDetails[0],
            keyWords: keyWordArray,
            tamilKeywords: tamilArray,
            tamilName: productDetails[1],
            quantity: `${productDetails[3]} ${productDetails[2]}`,
            price: productDetails[4],
            sellingPrice: productDetails[8],
            category: productDetails[5],
            bestseller: productDetails[6],
            description: productDetails[7]
        })
        .then(res => {
            setProgressWidth("50%")
            var storageRef = firebase.storage().ref();
            var imageRef = storageRef.child(`Images/${res.id}`)
            imageRef.put(imageFile).then(response => {
                setProgressWidth("75%")
                resolve(response)
            }).catch(err => {
                reject(err)
            })
        }).catch(error => {
            reject(error)
        })
    });
}

export const updateProduct = (productDetails,imageFile,setProgressWidth,productId) => {
    return new Promise((resolve, reject) => {
        const dataBase = firebase.firestore();
        var keyWordArray = [];
        var tamilArray = [];

        var nameSpaces = productDetails[0].split(' ');
        nameSpaces.push(productDetails[0]);

        nameSpaces.map(name => {
            keyWordArray = keyWordArray.concat(createKeyword(name.toUpperCase()));
        })

        if(productDetails[1].length > 0) {
            var tamilNameSapces = productDetails[1].split(' ');
            tamilNameSapces.push(productDetails[1]);
            tamilNameSapces.map(name => {
                tamilArray = tamilArray.concat(createKeyword(name));
            })
        }

        let collectionRef = dataBase.collection('Available Products');
        collectionRef.doc(productId).update({
            name: productDetails[0],
            keyWords: keyWordArray,
            tamilKeywords: tamilArray,
            tamilName: productDetails[1],
            quantity: `${productDetails[3]} ${productDetails[2]}`,
            price: productDetails[4],
            sellingPrice: productDetails[8],
            category: productDetails[5],
            bestseller: productDetails[6],
            description: productDetails[7]
        })
        .then(res => {
            if(imageFile) {
                setProgressWidth("50%")
                var storageRef = firebase.storage().ref();
                var imageRef = storageRef.child(`Images/${productId}`)
                imageRef.put(imageFile).then(response => {
                    setProgressWidth("75%")
                    resolve(response)
                }).catch(err => {
                    reject(err)
                })
            } else {
                setProgressWidth("50%")
                resolve(res)
            }
            
        }).catch(error => {
            reject(error)
        })
    });
}

export const fetchImage = (productId) => {
    return new Promise((resolve, reject) => {
        var storageRef = firebase.storage().ref();
        var imageRef = storageRef.child('Images/'+productId)
        imageRef.getDownloadURL().then(url => {
            resolve(url)
        }).catch(error => {
            reject(error)
        })
    });
}

export const getOrders = () => {
    return new Promise((resolve, reject) => {
        let databaseRef = firebase.database().ref(`/AppOrders/OrderForApprove`)
        databaseRef.once(`value`).then(result => {
            resolve(result.val());
        }).catch(error => reject(error))
    })
}

export const fetchOrderDetails = (id,userId) => {
    return new Promise(async (resolve, reject) => {
        const dataBase = firebase.firestore();
        let collectionRef = dataBase.collection('App_Users');
        let UserDocument = collectionRef.doc(userId)

        let ordersRef = UserDocument.collection('Order Details').doc(id);
        ordersRef.get()
            .then((order) => {
                resolve({...order.data(),id:order.id})
            })
            .catch(error => {
                reject(error)
            })
    })
}

export const getRiders = () => {
    return new Promise(async (resolve, reject) => {
        var rider_Details = [];
        const dataBase = firebase.firestore();
        let collectionRef = dataBase.collection('App_Users');
        collectionRef.where('Rider', '==', true).get()
        .then(riders => {
            riders.docs.map(rider => {
                rider_Details.push({
                    id: rider.id,
                    name: rider.data().name
                })
            })
            resolve(rider_Details)
        }).catch(error => reject(error))
    })
}

export const updateRiderDetails = (userId,id,riderName) => {
    return new Promise(async (resolve, reject) => {
        const dataBase = firebase.firestore();
        let collectionRef = dataBase.collection('App_Users');
        let UserDocument = collectionRef.doc(userId);

        let ordersRef = UserDocument.collection('Order Details').doc(id);
        ordersRef.update({riderAssigned: riderName})
        .then(res => {
            resolve(res);
        }).catch(error => {
            reject(error);
        })
    })
}

export const updateOrderStatus = (userId,id,status,selectedRider) => {
    return new Promise(async (resolve, reject) => {
        const databaseRef = firebase.database().ref(`/AppOrders/OrderForApprove/${userId}/${id}`)
        databaseRef.once(`value`).then(() => {
            databaseRef.update({ status:status,selectedRider:selectedRider })
            .then(res => {
                resolve(res);
            }).catch(error => {
                reject(error);
            })
        })
    })
}

export const getOrderCategories = () => {
    return new Promise((resolve, reject) => {
        let databaseRef = firebase.database().ref(`/Pincodes`)
        databaseRef.once(`value`).then(result => {
            console.log(result.val())
            resolve(result.val());
        }).catch(error => reject(error))
    })
}

export const updateOrderCategories = (value) => {
    return new Promise((resolve, reject) => {
        let databaseRef = firebase.database().ref(`/Pincodes`)
        databaseRef.once(`value`).then(result => {
            databaseRef.update(value)
            .then(res => {
                resolve(res);
            }).catch(error => {
                reject(error);
            })
        }).catch(error => reject(error))
    })
}