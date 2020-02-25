import firebase from "firebase";
import "firebase/firestore";
import controller from "../controller";

const createUserDatabase = async (registerInfo) => {
    const db = firebase.firestore();
    await db.collection("users").add({
        email: registerInfo.email,
        isAssistant: false,
        name: `${registerInfo.firstName} ${registerInfo.lastName}`,
        password: registerInfo.password,
    })
}

const userCheckIn = (viewFunction) => {
    firebase.auth().onAuthStateChanged((user) => {
        if (user){
            const userEmail = firebase.auth().currentUser.email;
            viewFunction(userEmail);
        } else{
            window.location.href="/signin";
        }
    })
}

const assistantCheckIn = (viewFunction) => {
    firebase.auth().onAuthStateChanged( async (user) => {
        if (user){
            const userEmail = firebase.auth().currentUser.email;
            const userInfo = await controller.users.getUserInfoWithEmail(userEmail);
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

const getUserInfoWithEmail = async (userEmail) => {
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

const signOut = () => {firebase.auth().signOut()}

const deleteAccount = async (userEmail) => {
    const db = firebase.firestore();
    firebase.auth().onAuthStateChanged( async (user) => {
        if (user) {
            await user.delete();
            db.collection(users).where("email", "==", userEmail).delete();
        } else {
            window.location.href = "/signin";
        }
    })
}

const addClass = async (userEmail, classInfo) => {
    const db = firebase.firestore();
    const userInfo = await getUserInfoWithEmail(userEmail);
    await db.collection("users").doc(userInfo.id).update({
        classes: firebase.firestore.FieldValue.arrayUnion(classInfo.id)
    })
}

const retrieveClassesOfUser = async(userId) => {
    const db = firebase.firestore();
    const classesSnapshot = await db.collection("classes").where("students", "array-contains", userId).get();
    const classNames = classesSnapshot.docs.map((doc) => {
        return doc.data().name
    })
    return classNames;
}

const users = {
    createUserDatabase,
    userCheckIn,
    assistantCheckIn,
    getUserInfoWithEmail,
    signOut,
    deleteAccount,
    addClass,
    retrieveClassesOfUser,
}

export {
    users,
}
