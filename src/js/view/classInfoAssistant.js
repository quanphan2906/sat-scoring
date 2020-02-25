import "../../css/index.css";
import "../../tags/classInfoAssistant.tag";
import riot from 'riot';
import {initModal} from '../../mx';
import controller from "../controller";
import view from "../view";

const classInfoAssistant = async (userEmail) => {
    //query
    const queryResult = controller.query();
    const classNameQuery = queryResult.className;
    const classInfo = await controller.classes.getClassInfoWithClassName(classNameQuery);
    var students = [];
    for (let id of classInfo.data.students){
        const studentInfo = await controller.getWithId("users", id);
        students.push(studentInfo);
    }

    //opts
    const opts = {
        ...classInfo.data,
        students,
        userEmail
    }

    //mount page
    const classInfoAssistantPage = riot.mount("div#root", "classinfoassistant", opts);

    //add wrongAnswers of sections of each material
    const sectionContainers = document.getElementsByClassName("sections-container");
    var i = 0;
    if (classInfo.data.materials != undefined && classInfo.data.materials != null){
        for (let wrongAnswersId of Object.values(classInfo.data.materials)){
            const wrongAnswersInfo = await controller.wrongAnswers.getWrongAnswersWithId(wrongAnswersId);          
            if (wrongAnswersInfo != undefined){    
                for (let [sectionName, wrongAnswers] of Object.entries(wrongAnswersInfo.data)){
                    sectionContainers[i].innerHTML = `
                        <b>${sectionName}</b> 
                        <span class="margin-left-12px"></span>
                    `;
                    for (let wrongAnswer of wrongAnswers){
                        const wrongAnswerContainer = document.createElement("span");
                        wrongAnswerContainer.innerText = `${wrongAnswer}, `;
                        sectionContainers[i].appendChild(wrongAnswerContainer);
                    }
                }
                i++;
            }
        }
    }

    //add event to header
    view.header();

    //create add student modal
    const addStudentModal = initModal(document.getElementById("add-student-modal"));
    //add event to add student button
    document.getElementById("add-student-btn").addEventListener("click", async (e) => {
        addStudentModal.open();

        const addStudentForm = document.getElementById("add-student-form");
        const noAddBtn = addStudentForm.btnNoAddAnymore;
        noAddBtn.addEventListener("click", (e) => {
            e.preventDefault();

            addStudentModal.close();
        })
         
        addStudentForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            var studentEmails = addStudentForm.email.value.split(", ");

            const r = await controller.classes.addStudentToClass(classInfo, studentEmails);
            if (r.existUndefinedEmails){
                for (let email of r.nonExistEmails){
                    const formError = document.createElement("div");
                    formError.classList.add("form-error");
                    formError.innerText = `${email} does not exist! Please verify with the students`
                    document.getElementById("add-student-form-error-container").appendChild(formError);
                }
            } else{
                location.reload();
            }
        })
    })

    //remove student
    const removeStudentModal = initModal(document.getElementById("remove-student-modal"))
    const removeStudentButtons = document.getElementsByClassName("remove-student-from-class");
    for (let removeStudentButton of removeStudentButtons){
        var studentEmail = "";
        var studentId = "";
        removeStudentButton.addEventListener("click", (e) => {
            removeStudentModal.open();

            studentEmail = e.target.getAttribute("studentEmail");
            studentId = e.target.getAttribute("studentId");
            document.getElementById("student-email-container").innerText = studentEmail;
        })

        //confirm and unconfirm delete account btn
        document.getElementById("unconfirm-remove-student-btn").addEventListener("click", (e) => {
            e.preventDefault();

            removeStudentModal.close();
        }) 

        document.getElementById("confirm-remove-student-btn").addEventListener("click", async (e) => {
            e.preventDefault();
            
            await controller.classes.removeStudentFromClass(classInfo, studentId);
            location.reload();
        })
    }

    //add material
    const addMaterialModal = initModal(document.getElementById("add-material-modal"));
    document.getElementById("add-material-btn").addEventListener("click", (e) => {
        addMaterialModal.open();

        const addMaterialForm = document.getElementById("add-material-form");

        const noAddBtn = addMaterialForm.btnNoAddAnymore;
        noAddBtn.addEventListener("click", (e) => {
            e.preventDefault();

            addMaterialModal.close();
        })

        addMaterialForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const materialName = addMaterialForm.materialName.value;
            const r =  await controller.classes.addMaterialToClass(classInfo, materialName);
            if (r.undefinedMaterial == false){
                addMaterialModal.close();
                location.reload();
            } else{
                const formError = document.createElement("div");
                formError.classList.add("form-error");
                formError.innerText = `${materialName} does not exist! Please verify with Julius`;
                document.getElementById("add-material-form-error-container").appendChild(formError);
            }
        })
    })
    
    //remove material
    const deleteMaterialButtons = document.getElementsByClassName("delete-material-from-class");
    for (let deleteMaterialButton of deleteMaterialButtons){
        deleteMaterialButton.addEventListener("click", async (e) => {
            e.preventDefault();

            await controller.classes.deleteMaterialFromClass(classInfo, e.target.getAttribute("materialName"));
            location.reload();
        })
    }

    
    //delete class
    const deleteClassModal = initModal(document.getElementById("delete-class-modal"));
    //add event to delete button
    document.getElementById("delete-class-btn").addEventListener("click", async (e) => {
        deleteClassModal.open();

        //confirm and unconfirm delete account btn
        document.getElementById("unconfirm-delete-class-btn").addEventListener("click", (e) => {
            e.preventDefault();

            deleteClassModal.close();
        }) 

        document.getElementById("confirm-delete-class-btn").addEventListener("click", async (e) => {
            e.preventDefault();
            
            await controller.classes.deleteClass(classInfo);
            window.location.href="/overview";
        })
    })
}

export {classInfoAssistant}