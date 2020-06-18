import firebase from "firebase/app";
import AuthenticationService from "./AuthenticationService";
require('firebase/auth');
require("firebase/firestore");

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
            .then(res => resolve(res))
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

export const storeRenderDetails = (time,rating) => {
    return new Promise((resolve, reject) => {
        const dataBase = firebase.firestore();
        let collectionRef = dataBase.collection('Users');
        let userDocument = collectionRef.doc(AuthenticationService.getUserId());
        userDocument.collection('Render Details').add({
            time : time,
            rating : rating
        }).then(res => resolve(res))
    });
}

export const fetchRenderDetails = () => {
    return new Promise((resolve, reject) => {
        const dataBase = firebase.firestore();
        let collectionRef = dataBase.collection('Users');
        let userDocument = collectionRef.doc(AuthenticationService.getUserId());
        let renderRef = userDocument.collection('Render Details');
        let renderArray = [];
        renderRef.get()
        .then((details) => {
            if (details.size > 0) {
                details.docs.map(doc =>
                    renderArray.push({
                        'Upload Time(ms)': doc.data().time,
                        'User Rating': doc.data().rating,
                    })
                )
                resolve(renderArray);
            } else {
                resolve(renderArray)
            }
        })
    });
}