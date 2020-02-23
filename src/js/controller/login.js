import firebase from "firebase";
import "firebase/firestore";
import controller from "../controller";

const login = async (loginInfo) => {
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
            const userInfo = await controller.users.getUserInfoWithEmail(email);
            if (userInfo.data.isAssistant){
                window.location.href = `/overview`;
            } else{
                window.location.href = "/userAccount";
            }
        } catch (error) {
            document.getElementById("form-error").innerText = error.message;
        }
    }
}

export {
    login,
}