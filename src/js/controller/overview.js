import firebase from "firebase";
import "firebase/firestore";

const renderData = async () => {
    //fetch data
    const db = firebase.firestore();
        //student number
    const studentSnapshot = await db.collection("users").get();
    const studentsTotal = studentSnapshot.docs.length - 1; //since there is one mail of assistant
        //classes info
    const classesSnapshot = await db.collection("classes").get();
    const classesTotal = classesSnapshot.docs.length;
    const classesInfo = [];
    for (let i = 0; i < classesSnapshot.docs.length; i++){
        classesInfo.push(classesSnapshot.docs[i].data());
    }
    return {studentsTotal, classesTotal, classesInfo}
}

const overview = {
    renderData,
}

export {
    overview,
}