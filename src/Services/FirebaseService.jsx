import firebase from "firebase/app";
require('firebase/auth');

export const authenticate = (userName,password) => {
    return new Promise((resolve,reject) => {
        firebase.auth().signInWithEmailAndPassword(userName,password)
        .then(result => {
            resolve(result)
        }).catch( error => {
            reject(error)
        })
    });
}

export const register = (userName,password) => {
    return new Promise((resolve,reject) => {
        firebase.auth().createUserWithEmailAndPassword(userName,password)
        .then(result => {
            resolve(result)
        }).catch( error => {
            reject(error)
        })
    });
}