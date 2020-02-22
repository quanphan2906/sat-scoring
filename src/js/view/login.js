import "../../css/index.css";
import "../../tags/signin.tag";

import riot from 'riot';

const login = () => {
    //mount page
    const login = riot.mount("div#root", "signin");

    //control login
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

