import firebase from "firebase";
import "firebase/firestore";

const getWithId = async (collectionName, id) => {
    const db = firebase.firestore();
    const result = await db.collection(collectionName).doc(id).get();
    return {
        id: result.id,
        data: result.data(),
    }
}

export {
    getWithId,
}