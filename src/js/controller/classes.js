import firebase from "firebase";
import "firebase/firestore";
import controller from "../controller";

const getClassInfoWithClassName = async (className) => {
    const db = firebase.firestore();
    const classSnapshot = await db.collection("classes").where("name", "==", className).get();
    const classInfo = {
        id: classSnapshot.docs[0].id,
        data: classSnapshot.docs[0].data(),
    }
        
    return classInfo;
}

const omitSpaceInEmailArray = (emailArray) => {
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

const createClass = async (classInfoData) => {
    //check if class has already existed
    const db = firebase.firestore();
    const classSnapshot = await db.collection("classes").where("name", "==", classInfoData.name).get();
    if (classSnapshot.docs.length == 0){
        //set data
        const classRef = await db.collection("classes").add(classInfoData);
        return {
            isSuccess: true,
            classInfo: {
                id: classRef.id,
                data: classInfoData,  
            },
        };
    } else{
        view.setMessage("form-error", "Class has already existed");
        return {
            isSuccess: false
        };
    }
}

const addStudentToClass = async (classInfo, studentEmails) => {
    //prepare two arrays of emails
    studentEmails =  omitSpaceInEmailArray(studentEmails);
    var nonExistEmails = [];

    const db = firebase.firestore();

    for (let studentEmail of studentEmails){
        const userInfo = await controller.users.getUserInfoWithEmail(studentEmail);
        if (userInfo != undefined){
            await db.collection("classes").doc(classInfo.id).update({
                students: firebase.firestore.FieldValue.arrayUnion(userInfo.id),
            })
            await controller.users.addClass(userInfo.data.email, classInfo);
        } else{
            nonExistEmails.push(studentEmail);
        }
    }

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


const removeStudentFromClass = async (classInfo, studentEmail) => {
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
            total: classInfo.data.students.total - 1, //TODO: DATA STRUCTURE HAS CHANGED
        }
    })
}

const deleteClass = async (classInfo) => {
    const db = firebase.firestore();
    for (let studentId of classInfo.students){
        db.collection("users").doc(studentId).update({
            classes: firebase.firestore.FieldValue.arrayRemove(classInfo.data.name),
        })
    }
    await db.collection("classes").doc(classInfo.id).delete();
}

const addMaterialToClass = async (classInfo, materialName) => {
    const db = firebase.firestore();
    const classId = classInfo.id;
    const materialInfo = await controller.materials.getMaterialInfoWithMaterialName(materialName);
    if (materialInfo != undefined){
        //create place to store wrong answers of class's material
        const wrongAnswersRef = await db.collection("wrongAnswers").add({
            materialName: materialName,
            sections: {},
        })
        
        await db.collection("classes").doc(classId).update({
            [`materials.${materialName}`]: wrongAnswersRef.id,
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

const deleteMaterialFromClass = async(classInfo, materialName) => {
    const db = firebase.firestore();
    await db.collection("classes").doc(classInfo.id).update({
        materials: firebase.firestore.FieldValue.arrayRemove(materialName),
    })
}

const classes = {
    getClassInfoWithClassName,
    createClass,
    deleteClass,
    addStudentToClass,
    removeStudentFromClass,
    addMaterialToClass,
    deleteMaterialFromClass,
    omitSpaceInEmailArray,

}

export {
    classes,
}