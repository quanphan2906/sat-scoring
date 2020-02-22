import firebase from "firebase";
import "firebase/firestore";

const getClassInfoWithClassName = async (className) => {
    const db = firebase.firestore();
    const classSnapshot = await db.collection("classes").where("name", "==", className).get();
    const classInfo = {
        id: classSnapshot.docs[0].id,
        data: classSnapshot.docs[0].data(),
    }
        
    return classInfo;
}

const classes = {
    getClassInfoWithClassName
}

export {
    classes,
}