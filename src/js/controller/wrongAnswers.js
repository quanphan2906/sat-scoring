import firebase from "firebase";
import "firebase/firestore";
import controller from "../controller";

const getWrongAnswersWithId = async (wrongAnswersId) => {
    const db = firebase.firestore();
    const wrongAnswersSnapshot = await db.collection("wrongAnswers").doc(wrongAnswersId).get();
    if (wrongAnswersSnapshot.exists){
        return {
            id: wrongAnswersSnapshot.id,
            data: wrongAnswersSnapshot.data(),
        }
    } else {
        return undefined;
    }
}

const wrongAnswers = {
    getWrongAnswersWithId,
}

export {wrongAnswers}