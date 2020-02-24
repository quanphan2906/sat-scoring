import firebase from "firebase";
import "firebase/firestore";
import view from "../view";
import controller from "../controller";

const renderData = async (userEmail) => {
    //get query
    const queryResult = controller.query();
    const materialNameQuery = queryResult.materialName;
    const classNameQuery = queryResult.className;

    //fetch data
    const db = firebase.firestore();
    const classSnapshot = await db.collection("classes")
                          .where("name", "==", classNameQuery)
                          .get();

    if (classSnapshot.docs.length == 0){
        window.location.href = "/userAccount";
    } else {
        const classInfo = classSnapshot.docs[0].data();
        if (classInfo.materials[materialNameQuery]){
            const materialInfo = await controller.materials.getMaterialInfoWithMaterialName(materialNameQuery);
            return {materialInfo, classNameQuery};
        } else {
            window.history.back();
        }
    }
}

const reportWrongAnsToClass = async (className, materialName, sectionName, wrongAnswers) => {
    //retrieve existing wrongAnswers
    const db = firebase.firestore();
    const classInfo = await controller.classes.getClassInfoWithClassName(className);
    const wrongAnswersId = classInfo.data.materials[materialName];
    const wrongAnswersFirebaseInfo = await controller.wrongAnswers.getWrongAnswersWithId(wrongAnswersId);
    var wrongAnswersFirebase = [];
    if (wrongAnswersFirebaseInfo.data.sections[sectionName]){
        wrongAnswersFirebase = wrongAnswersFirebaseInfo.data.sections[sectionName];
    }

    //append new wrongAnswers
    var newWrongAnswers = [...wrongAnswers, ...wrongAnswersFirebase]; 
    newWrongAnswers = newWrongAnswers.sort((a, b) => {return a - b});
    var wrongAnswersOfficial = [newWrongAnswers[0]];
    for (let i = 1; i < newWrongAnswers.length; i++){
        if (newWrongAnswers[i] != newWrongAnswers[i-1]){
            wrongAnswersOfficial.push(newWrongAnswers[i]);
        }
    }

    //push to firebase
    await db.collection("wrongAnswers").doc(wrongAnswersId).update({
        [`sections.${sectionName}`]: wrongAnswersOfficial,
    })
}

const checkAnswers = async (className, materialInfo, sectionName, answers, userEmail) => {
    //retrieve data from web
    var keys = [];
    for (let section of materialInfo.data.sections){
        if (section.sectionName == sectionName) {
            keys = section.answers;
            break;
        }
    }

    var wrongAnswers = [];
    //compare answers with answerKeys
    for (let i = 1; i < answers.length; i++){
        if (keys[i] == answers[i]){
            //render result
            view.checkAnswers(true, i);
        } else {
            //add wrong answers
            wrongAnswers.push(i);

            //render result
            view.checkAnswers(false, i);
        }
    }

    //calculate percentage
    const wrongTotal = wrongAnswers.length;
        //key.length - 1 since the first value (indexed 0) of keys and answers array is null
    const percentage = Math.floor(((keys.length - 1) - wrongTotal) / (keys.length - 1) * 100);
    view.renderPercentage(percentage); 

    //push wrongAnswers to users's collection
    const db = firebase.firestore();
    const userInfo = await controller.users.getUserInfoWithEmail(userEmail);
    console.log("object to update to Firebase", {
        name: `${materialInfo.data.name} - ${sectionName}`,
        score: percentage,
        type: materialInfo.data.type,
        wrongAnswers: wrongAnswers,
    })
    db.collection("users").doc(userInfo.id).update({
        oldTests: firebase.firestore.FieldValue.arrayUnion({
            name: `${materialInfo.data.name} - ${sectionName}`,
            score: percentage,
            type: materialInfo.data.type,
            wrongAnswers: wrongAnswers,
        })
    })

    //save wrongAnswers to class
    if (wrongAnswers.length != 0){
        await reportWrongAnsToClass (className, materialInfo.data.name, sectionName, wrongAnswers)
    }
}

const submit = {
    renderData,
    checkAnswers,
}

export {
    submit,
}
