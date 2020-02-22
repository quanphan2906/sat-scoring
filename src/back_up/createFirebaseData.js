import firebase from "firebase";
import "firebase/firestore";

const createFirebaseData = {};

createFirebaseData.createAnswerKeys = async (materialName) => {
    //create data
    var keys = [null];
    for (let i = 0 ; i < 55; i++){
        keys.push("a");
    }

    //retreive and update data
    const db = firebase.firestore();
    const materialSnapshot = await db.collection("materials").where("name", "==", materialName).get();
    const materialInfo = materialSnapshot.docs[0].data();
    const sections = materialInfo.sections;
    for (let i = 0; i < sections.length; i++){
        sections[i].answers = keys;
    }

    //set data
    const id = materialSnapshot.docs[0].id;
    db.collection("materials").doc(id).update({
        sections: sections,
    })
}

export {
    createFirebaseData,
}