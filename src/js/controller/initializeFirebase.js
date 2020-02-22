//import firebase
import firebase from 'firebase';

const firebaseInit = () => {
    //create firebaseConfig
    var firebaseConfig = {
        apiKey: "AIzaSyBb2wLZ7QiCeZ9pCV3RB1jfyiLD7F_nSHI",
        authDomain: "sat-scoring.firebaseapp.com",
        databaseURL: "https://sat-scoring.firebaseio.com",
        projectId: "sat-scoring",
        storageBucket: "sat-scoring.appspot.com",
        messagingSenderId: "777688057994",
        appId: "1:777688057994:web:c32ff7184d567ccb744573",
        measurementId: "G-FLZ97H3QQQ"
        };
        
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
}

export {
    firebaseInit,
}
