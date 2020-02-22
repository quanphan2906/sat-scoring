import firebase from "firebase";
import "firebase/firestore";
import view from "./js/view"

const renderData = async (userEmail) => {
    //get query
    const queryResult = controller.query();
    const materialNameQuery = queryResult.materialName;
    const classNameQuery = queryResult.className;

    //fetch data
    const db = firebase.firestore();
    const classSnapshot = await db.collection("classes")
                        .where("name", "==", classNameQuery)
                        .where("materials", "array-contains", materialNameQuery)
                        .get();

    if (classSnapshot.docs.length == 0){
        window.location.href = "/userAccount";
    } else {
        const materialInfo = await controller.getMaterialInfoWithMaterialName(materialNameQuery);
        return {materialInfo, classNameQuery};
    }
}

const reportWrongAnsToClass = async (className, materialName, sectionName, wrongAnswers) => {
    const db = firebase.firestore();
    const classInfo = await controller.getClassInfoWithClassName(className);
    const wrongAnswersFirebase = classInfo.data.wrongAnswers[materialName][sectionName];
    var newWrongAnswers = [...wrongAnswers, ...wrongAnswersFirebase]; 

    newWrongAnswers = newWrongAnswers.sort((a, b) => {return a - b});
    console.log("newWrongAnswers", newWrongAnswers);

    var wrongAnswersOfficial = [newWrongAnswers[0]];
    for (let i = 1; i < newWrongAnswers.length; i++){
        if (newWrongAnswers[i] != newWrongAnswers[i-1]){
            wrongAnswersOfficial.push(newWrongAnswers[i]);
        }
    }
    console.log("wrongAnswersOfficial", wrongAnswersOfficial);
    await db.collection("classes").doc(classInfo.id).update({
        [`wrongAnswers.${materialName}.${sectionName}`]: wrongAnswersOfficial,
    })
}

const checkAnswers = async (className, materialInfo, sectionName, answers, userEmail) => {
    //retrieve data
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

    //push wrongAnswers to Firebase
    const db = firebase.firestore();
    const userInfo = await controller.getUserInfoWithEmail(userEmail);
    db.collection("users").doc(userInfo.id).update({
        oldTests: firebase.firestore.FieldValue.arrayUnion({
            name: `${materialInfo.data.name} - ${sectionName}`,
            score: percentage,
            type: materialInfo.data.type,
            wrongAnswers: wrongAnswers,
        })
    })
}

const submit = {
    renderData,
    checkAnswers,
    reportWrongAnsToClass,
}

export {
    submit,
}
