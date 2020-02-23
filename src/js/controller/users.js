import firebase from "firebase";
import "firebase/firestore";
import controller from "../controller";

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

const deleteAccount = (userEmail) => {
    const db = firebase.firestore();
    db.collection(users).where("email", "==", userEmail).delete();
}

const users = {
    userCheckIn,
    assistantCheckIn,
    getUserInfoWithEmail,
    signOut,
    deleteAccount,
}

export {
    users,
}
