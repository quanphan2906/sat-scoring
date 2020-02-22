import "../../css/index.css";
import "../../css/overview.css";
import "../../tags/overview.tag";
import {initModal} from '../../mx';
import riot from 'riot';

const overview = async (userEmail) => {
    //get personal information
    const userInfo = controller.getUserInfoWithEmail(userEmail);

    //number of students & number of classes
    const r = await controller.overview();
    const studentsTotal = r.studentsTotal;
    const classesTotal = r.classesTotal;
    const classesInfo = r.classesInfo;

    //opts
    const opts = {
        ...userInfo,
        studentsTotal,
        classesInfo,
        classesTotal,
        userEmail,
    }

    //mount page
    const addClass = riot.mount("div#root", "overview", opts);

    //add event to header
    view.header();

    //add event to more info button
    const moreInfoBtns = document.getElementsByClassName("more-info-btn");
    for (let moreInfoBtn of moreInfoBtns){
        moreInfoBtn.addEventListener("click", (e) => {
            const className = e.target.getAttribute("className");
            window.location.href = `/classInfoAssistant?className=${className}`;
        })
    }

    //create modal
    const modal = initModal(document.getElementById("modal"));
    //add event to create class
    const createClassBtn = document.getElementById("btn-create-class");
    createClassBtn.addEventListener("click", (e) => {
        modal.open();
            //take data from the form
        const createClassForm = document.getElementById("create-class-form");
        createClassForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            var studentEmails = createClassForm.emails.value.split(", ");
            studentEmails = controller.omitSpaceInEmailArray(studentEmails);
            
            const students = {
                data: [],
                total: studentEmails.length,
            }

            for (let studentEmail of studentEmails){
                students.data.push({
                    name: "",
                    email: studentEmail,
                })
            }

            const classInfo = {
                name: createClassForm.className.value, 
                schedule: {
                    day: createClassForm.scheduleDay.value,
                    time: createClassForm.scheduleTime.value,
                },
                students,
            }
            
            const isSuccess = await controller.createClass(classInfo);
            if (isSuccess){
                modal.close();
                window.location.href = `/classInfoAssistant?className=${classInfo.name}`;
            }
        })
    })
}

export {overview}