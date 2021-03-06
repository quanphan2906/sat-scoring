import controller from "../controller";

const header = async () => {
    //back to userAccount
    const email = document.getElementById("email");
    const userInfo = await controller.users.getUserInfoWithEmail(email.innerText);
    email.addEventListener("click", (e) => {
        if (userInfo.data.isAssistant){
            window.location.href = "/overview";
        } else{
        window.location.href = "/userAccount";
        }
    })

    //sign out btn
    const signOut = document.getElementById("sign-out");
    signOut.addEventListener("click", (e) => {
        controller.users.signOut();
        window.location.href = `/signin`;
    })
}

export {header}