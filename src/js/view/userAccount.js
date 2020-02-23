import "../../css/index.css";
import "../../tags/userAccount.tag";
import {initModal} from '../../mx';
import riot from 'riot';
import view from "../view";
import controller from "../controller";

const userAccount = async (userEmail) => {
    //get personal information
    const userInfo = await controller.users.getUserInfoWithEmail(userEmail);
    const opts = {
        ...userInfo,
    }

    //mount page
    const userAccountPage = riot.mount("div#root", "useraccount", opts);
    
    //add event to header
    view.header();

    //redirect to classes
    const classNames = document.getElementsByClassName("class-name");
    for (let className of classNames){
        className.addEventListener("click", (e) => {
            const name = e.target.innerText;
            window.location.href = `/classInfoStudent?className=${name}`;
        })
    }

    //init delete modal
    const deleteModal = initModal(document.getElementById("delete-modal"));

    //delete account btn
    const deleteAccountBtn = document.getElementById("delete-btn");
    deleteAccountBtn.addEventListener("click", (e) => {
        deleteModal.open();
    })

    //confirm and unconfirm delete account btn
    const unconfirmDeleteAccountBtn = document.getElementById("unconfirm-delete-btn");
    unconfirmDeleteAccountBtn.addEventListener("click", (e) => {
        e.preventDefault();

        deleteModal.close();
    }) 
    const confirmDeleteAccountBtn = document.getElementById("confirm-delete-btn");
    confirmDeleteAccountBtn.addEventListener("click", (e) => {
        e.preventDefault();

        controller.users.deleteAccount(userEmail);
        window.location.href = "/signup";
    })
}

export {userAccount}