import "../../css/index.css";
import "../../tags/classInfoStudent.tag";
import view from "../view";
import controller from "../controller";

import riot from 'riot';

const classInfoStudent = async (userEmail) => {
    //query
    const queryResult = controller.query();
    const classNameQuery = queryResult.className;
    const classInfo = await controller.classes.getClassInfoWithClassName(classNameQuery);

    //opts
    const opts = {
        ...classInfo.data,
        userEmail
    }

    //mount page
    const classInfoStudentPage = riot.mount("div#root", "classinfostudent", opts);

    //add event to header
    view.header();

    //submit answers btn
    const submitAnswersBtns = document.getElementsByClassName("submit-answer-btn");
    for (let btn of submitAnswersBtns) {
        btn.addEventListener("click", (e) => {
            const materialName = e.target.getAttribute("materialName");
            const className = e.target.getAttribute("className");

            window.location.href = `/submit?materialName=${materialName}&className=${className}`;
        })
    }
}

export {classInfoStudent}