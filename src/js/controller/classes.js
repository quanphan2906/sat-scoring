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

const createClass = async (classInfo) => {
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

const addStudentToClass = async (classInfo, studentEmails) => {
    var studentData = classInfo.data.students.data;
    studentEmails =  omitSpaceInEmailArray(studentEmails);
    var nonExistEmails = [];

    for (let studentEmail of studentEmails){
        const userInfo = await controller.users.getUserInfoWithEmail(studentEmail);
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
            total: classInfo.data.students.total - 1,
        }
    })
}

const deleteClass = async (classInfo) => {
    const db = firebase.firestore();
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