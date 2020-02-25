import firebase from "firebase";
import "firebase/firestore";
import view from "../view";
import controller from ".";

const signup = async (registerInfo) => {
    if (!registerInfo.firstName) {
        view.setMessage("firstName-error", "Please input your first name")
    }

    if(!registerInfo.lastName) {
        view.setMessage("lastName-error", "Please input your last name")
    }

    if (!registerInfo.email) {
        view.setMessage("email-error", "Please input your email");
    }
      
    if (!registerInfo.password) {
        view.setMessage("password-error", "Please input your password");
    }
      
    if (!registerInfo.confirmPassword || registerInfo.confirmPassword !== registerInfo.password) {
        view.setMessage("confirmPassword-error", "Confirm password didn't match");
    }

    if (registerInfo.firstName && registerInfo.lastName && registerInfo.email && registerInfo.password && registerInfo.confirmPassword == registerInfo.password){
        try {
            await firebase.auth().createUserWithEmailAndPassword(registerInfo.email, registerInfo.password);
            
            await controller.users.createUserDatabase(registerInfo);
            //Remember to write firebase.auth().currentUser.sendEmailVerification()
            //to verify users when host app
            window.location.href = "/userAccount";
        } catch (error) {
            view.setMessage("form-error", error.message);
        }
    }
};

export {
    signup,
}