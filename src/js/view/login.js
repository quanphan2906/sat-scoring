import "../../css/index.css";
import "../../tags/signin.tag";
import controller from "../controller";

import riot from 'riot';

const login = () => {
    //mount page
    const login = riot.mount("div#root", "signin");

    //redirect to sign up
    document.getElementById("to-signup-page").addEventListener("click", (e) => {
        window.location.href = "/signup";
    })

    //fetch data to controller
    const loginForm = document.getElementById("login-form");
    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const loginInfo = {
            email: loginForm.email.value,
            password: loginForm.password.value,
        }

        controller.login(loginInfo);
    })
}

export {login}

