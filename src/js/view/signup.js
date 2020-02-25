import "../../css/index.css";
import "../../tags/signup.tag";
import controller from "../controller";

import riot from 'riot';

const signup = () => {
    //mount page
    const signup = riot.mount("div#root", "signup");

    //redirect to login page
    document.getElementById("already-have-account").addEventListener("click", (e) => {
        e.preventDefault();
        window.location.href = "/signin";
    })

    //register via controller
    const registerForm = document.getElementById("register-form");
    registerForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const registerInfo = {
            firstName: registerForm.firstName.value,
            lastName: registerForm.lastName.value,
            email: registerForm.email.value,
            password: registerForm.password.value,
            confirmPassword: registerForm.confirmPassword.value,
        }

        controller.signup(registerInfo);
    })
}

export {signup}