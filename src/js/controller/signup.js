import firebase from "firebase";
import "firebase/firestore";
import controller from "../controller";

const signup = async (registerInfo) => {
    if (!registerInfo.firstName) {
        view.setMessage("firstName-error", "Please input your first name")
    } else {
        view.setMessage("firstName-error", "");
    }

    if(!registerInfo.lastName) {
        view.setMessage("lastName-error", "Please input your last name")
    } else {
        view.setMessage("lastName-error", "");
    }

    if (!registerInfo.email) {
        view.setMessage("email-error", "Please input your email");
    } else {
        view.setMessage("email-error", "");
    }
      
    if (!registerInfo.password) {
        view.setMessage("password-error", "Please input your password");
    } else {
        view.setMessage("password-error", "");
    }
      
    if (!registerInfo.confirmPassword || registerInfo.confirmPassword !== registerInfo.password) {
        view.setMessage("confirmPassword-error", "Confirm password didn't match");
    } else {
        view.setMessage("confirmPassword-error", "");
    }

    if (registerInfo.firstName && registerInfo.lastName && registerInfo.email && registerInfo.password && registerInfo.confirmPassword == registerInfo.password){
        try {
            await firebase.auth().createUserWithEmailAndPassword(registerInfo.email, registerInfo.password);

            firebase.auth().currentUser.updateProfile({
                displayName: `${registerInfo.firstName} ${registerInfo.lastName}`
            })
            
            //Remember to write firebase.auth().currentUser.sendEmailVerification()
            //to verify users when host app
            view.setMessage("form-success", "Register success");
        } catch (error) {
            view.setMessage("form-error", error.message);
        }
    }
};

export {
    signup,
}