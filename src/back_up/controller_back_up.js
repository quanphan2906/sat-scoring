//import libraries
import {mxFirebase, initImgUpload, initModal} from '../mx';
import firebase from "firebase";
import "firebase/firestore";
import riot from 'riot';
import route from "riot-route";

//import js
import {view} from "../js/view";

const controller = {};

controller.login = async (loginInfo) => {
    if (!loginInfo.email) {
        document.getElementById("email-error").innerText += `Please input your email`;
    }
      
    if (!loginInfo.password) {
        document.getElementById("password-error").innerText += `Please input your password`;
    }

    if (loginInfo.email && loginInfo.password){
        try {
            const loginResult = await firebase.auth().signInWithEmailAndPassword(loginInfo.email, loginInfo.password);
            
            const email = loginResult.user.email;
            const userInfo = await controller.getUserInfoWithEmail(email);
            if (userInfo.data.isAssistant){
                window.location.href = `/overview`;
            } else{
                window.location.href = "/userAccount";
            }
        } catch (error) {
            document.getElementById("form-error").innerText = error.message;
        }
    }
};

controller.userCheckIn = (viewFunction) => {
    firebase.auth().onAuthStateChanged((user) => {
        if (user){
            const userEmail = firebase.auth().currentUser.email;
            viewFunction(userEmail);
        } else{
            window.location.href="/signin";
        }
    })
}

controller.assistantCheckIn = (viewFunction) => {
    firebase.auth().onAuthStateChanged( async (user) => {
        if (user){
            const userEmail = firebase.auth().currentUser.email;
            const userInfo = await controller.getUserInfoWithEmail(userEmail);
            if (userInfo.data.isAssistant === true){
                viewFunction(userEmail);
            } else{
                window.location.href = "/userAccount";
            }
        } else{
            window.location.href = "/signin";
        }
    })
}

controller.getUserInfoWithEmail = async (userEmail) => {
    const db = firebase.firestore();
    const user = await db.collection("users").where("email", "==", userEmail).get();
    if (user.docs.length != 0){
        return {
            id: user.docs[0].id,
            data: user.docs[0].data(),
        }
    } else{
        return undefined;
    }
}

controller.deleteAccount = (userEmail) => {
    const db = firebase.firestore();
    db.collection(users).where("email", "==", userEmail).delete();
}

controller.signOut = () => {firebase.auth().signOut()}

controller.getClassInfoWithClassName = async (className) => {
    const db = firebase.firestore();
    const classSnapshot = await db.collection("classes").where("name", "==", className).get();
    const classInfo = {
        id: classSnapshot.docs[0].id,
        data: classSnapshot.docs[0].data(),
    }
        
    return classInfo;
}

controller.getMaterialInfoWithMaterialName = async (materialName) => {
    const db = firebase.firestore();
    const materialSnapshot = await db.collection("materials").where("name", "==", materialName).get();
    if (materialSnapshot.docs.length != 0){
        return {
            id: materialSnapshot.docs[0].id,
            data: materialSnapshot.docs[0].data(),
        }
    } else{
        return undefined;
    }
    
}

controller.query = () => {
    const query = route.query();
    return query;
}

controller.submit = async (userEmail) => {
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

controller.checkAnswers = async (className, materialInfo, sectionName, answers, userEmail) => {
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

    await reportWrongAnsToClass(className, materialInfo.data.name, sectionName, wrongAnswers);
}

controller.overview = async () => {
    //fetch data
    const db = firebase.firestore();
        //student number
    const studentSnapshot = await db.collection("users").get();
    const studentsTotal = studentSnapshot.docs.length;
        //classes info
    const classesSnapshot = await db.collection("classes").get();
    const classesTotal = classesSnapshot.docs.length;
    const classesInfo = [];
    for (let i = 0; i < classesSnapshot.docs.length; i++){
        classesInfo.push(classesSnapshot.docs[i].data());
    }
    return {studentsTotal, classesTotal, classesInfo}
}

controller.createClass = async (classInfo) => {
    //check if class has already existed
    const db = firebase.firestore();
    const classSnapshot = await db.collection("classes").where("name", "==", classInfo.name).get();
    if (classSnapshot.docs.length == 0){
        //retrieve names of students
        var studentsData = [];
        for (let i = 0; i < classInfo.students.data.length; i++){
            const email = classInfo.students.data[i].email;
            const studentSnapshot = await db.collection("users").where("email", "==", email).get();
            if (studentSnapshot.docs.length != 0){
                const studentName = studentSnapshot.docs[0].data().name;
                classInfo.students.data[i].name = studentName;
                studentsData.push(classInfo.students.data[i]);
            }
        }

        classInfo.students.data = studentsData;
        classInfo.students.total = studentsData.length;

        //set data
        await db.collection("classes").add(classInfo);
        return true;
    } else{
        view.setMessage("form-error", "Class has already existed");
        return false;
    }
}

controller.addStudentToClass = async (classInfo, studentEmails) => {
    var studentData = classInfo.data.students.data;
    var nonExistEmails = [];

    for (let studentEmail of studentEmails){
        const userInfo = await controller.getUserInfoWithEmail(studentEmail);
        if (userInfo != undefined){    
            studentData.push({
                email: studentEmail,
                name: userInfo.data.name,
            });
        } else{
            nonExistEmails.push(studentEmail);
        }
    }
    
    const studentTotal = classInfo.data.students.total + 1;

    const db = firebase.firestore();
    db.collection("classes").doc(classInfo.id).update({
        students: {
            data: studentData,
            total: studentTotal,
        }
    })

    if (nonExistEmails == 0){
        return {
            existUndefinedEmails: false,
        };
    } else{
        return {
            existUndefinedEmails: true,
            nonExistEmails: nonExistEmails
        };
    }
}

controller.omitSpaceInEmailArray = (emailArray) => {
    var noSpaceEmailArray = [];
    for (let email of emailArray){
        var noSpaceEmail = "";
        for (let i = 0; i < email.length; i++){
            if (email.charAt(i) != " "){
                noSpaceEmail += email.charAt(i);
            }
        }
        noSpaceEmailArray.push(noSpaceEmail);
    }

    return noSpaceEmailArray;
}


controller.removeStudentFromClass = async (classInfo, studentEmail) => {
    const db = firebase.firestore();
    const studentData = classInfo.data.students.data;
    for (let i = 0; i < studentData.length; i++){
        if (studentData[i].email == studentEmail){
            studentData.splice(i, 1);
            break;
        }
    }

    await db.collection("classes").doc(classInfo.id).update({
        students: {
            data: studentData,
            total: classInfo.data.students.total - 1,
        }
    })
}

controller.deleteClass = async (classInfo) => {
    const db = firebase.firestore();
    await db.collection("classes").doc(classInfo.id).delete();
}

controller.addMaterialToClass = async (classInfo, materialName) => {
    const db = firebase.firestore();
    const classId = classInfo.id;
    const materialInfo = await controller.getMaterialInfoWithMaterialName(materialName);
    if (materialInfo != undefined){
        await db.collection("classes").doc(classId).update({
            materials: firebase.firestore.FieldValue.arrayUnion(materialName)
        })
        return {
            undefinedMaterial: false,
        }
    }
    else{
        return {
            undefinedMaterial: true,
        }
    }
}

controller.deleteMaterialFromClass = async(classInfo, materialName) => {
    const db = firebase.firestore();
    await db.collection("classes").doc(classInfo.id).update({
        materials: firebase.firestore.FieldValue.arrayRemove(materialName),
    })
}

// const createKeyWords = (title) => {
//     const arrTitle = [];
//     let curTitle = '';
//     title.split("").forEach((letter) => {
//       curTitle += letter;
//       arrTitle.push(curTitle);
//     });
//     return arrTitle;
// }

const createKeyWords = (title) => {
    const arrTitle = [];
    const arrayOfLetters = title.split("");
    for (let i = 0; i < arrayOfLetters.length; i++){
        var curTitle = arrayOfLetters[i];
        if (i != (arrayOfLetters.length - 1)){
            for (let j = i + 1; j < arrayOfLetters.length; j++){
                curTitle += arrayOfLetters[j];
                arrTitle.push(curTitle);
            }
        } else{
            arrTitle.push(arrayOfLetters[i])
        }
    }
    return arrTitle;
}

controller.uploadMaterial = async (materialInfoUpload) => {
    //upload material picture to firebase storage
    const storageRef = firebase.storage().ref("previewImages/" + materialInfoUpload.materialPicture.name);
    const r = await storageRef.put(materialInfoUpload.materialPicture);
    const fileUrls = await r.ref.getDownloadURL();
    
    //upload information to firestore
    const db = firebase.firestore();
    const materialName = materialInfoUpload.name;
    const keywords = createKeyWords(materialName);
    const materialInfo = await controller.getMaterialInfoWithMaterialName(materialName);
    if (materialInfo == undefined){
        //for section 1 upload
        db.collection("materials").add({
            name: materialInfoUpload.name,
            type: materialInfoUpload.type,
            sections: [materialInfoUpload.section],
            fileUrls: fileUrls,
            keywords: keywords,
        })
    } else{
        //for section 2 and beyond upload, since material has been created
        db.collection("materials").doc(materialInfo.id).update({
            sections: firebase.firestore.FieldValue.arrayUnion(materialInfoUpload.section)
        })
    }

    //TODO: need to generate keywords for search engine
}

controller.getMaterialsWithType = async (materialType) => {
    const db = firebase.firestore();
    const materialWithTypeSnapshot = await db.collection("materials").where("type", "==", materialType).get();
    const materialsWithTypeInfo = materialWithTypeSnapshot.docs.map((doc) => {
        return doc.data();
    })
    return materialsWithTypeInfo;
}

controller.getMaterialsWithKeywords = async (materialType, searchKeywords) => {
    const db = firebase.firestore();
    const materialsSnapshot = await db.collection("materials").where("type", "==", materialType)
                                                              .where("keywords", "array-contains", searchKeywords)
                                                              .get();                                                    
    if (materialsSnapshot.docs.length != 0){
        const materialsInfoData = materialsSnapshot.docs.map((doc) => {
            return doc.data();
        })
        return materialsInfoData;
    } else {
        return undefined;
    }                                                        

}

controller.getAnswerKeys = (materialInfo, sectionNameQuery) => {
    for (let section of materialInfo.data.sections){
        if (section.sectionName == sectionNameQuery){
            return section.answers;
        }
    }
}

const updateKeys = async (materialInfo, sectionNameQuery, keys) => {
    const db = firebase.firestore();
    // for (let section of materialInfo.data.sections){
    const sectionsData = materialInfo.data.sections; 
    for (let i = 0; i < sectionsData.length; i++){    
        if (sectionsData[i].sectionName == sectionNameQuery){
            sectionsData[i].answers = keys;
        }
    }

    await db.collection("materials").doc(materialInfo.id).update({
        sections: sectionsData,
    })
}

const editName = async (materialInfo, newName) => {
    const db = firebase.firestore();
    await db.collection("materials").doc(materialInfo.id).update({
        name: newName,
    })
}

const editType = async (materialInfo, newType) => {
    const db = firebase.firestore();
    await db.collection("materials").doc(materialInfo.id).update({
        type: newType,
    })
}

const deleteSection = async (materialInfo, sectionName) => {
    const db = firebase.firestore();
    const sectionsData = materialInfo.data.sections;
    for (let i = 0; i < sectionsData.length; i++) {
        if (sectionsData[i].sectionName == sectionName){
            sectionsData.splice(i, 1);
            break;
        }
    }
    await db.collection("materials").doc(materialInfo.id).update({
        sections: sectionsData,
    })
}

const addSection = async (materialInfo, section) => {
    const db = firebase.firestore();
    await db.collection("materials").doc(materialInfo.id).update({
        sections: firebase.firestore.FieldValue.arrayUnion(section),
    })
}

controller.editMaterial = {
    updateKeys,
    editName,
    editType,
    deleteSection,
    addSection,
}


export {
    controller,
}