//import libraries
import {initImgUpload, initModal} from '../mx';
import riot from 'riot';

//import js
import {controller} from "./controller_back_up.js/index.js";

const view = {};

view.header = async () => {
    //back to userAccount
    const email = document.getElementById("email");
    const userInfo = await controller.getUserInfoWithEmail(email.innerText);
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
        controller.signOut();
        window.location.href = `/signin`;
    })
}

view.setMessage = (id, message) => {
    const ele = document.getElementById(id);
    ele.innerText = message; 
}

view.login = () => {
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

view.signup = () => {
    const signup = riot.mount("div#root", "signup");
}

view.userAccount = async (userEmail) => {
    //get personal information
    const userInfo = await controller.getUserInfoWithEmail(userEmail);
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

        controller.deleteAccount(userEmail);
        window.location.href = "/signup";
    })
}

view.classInfoStudent = async (userEmail) => {
    //query
    const queryResult = controller.query();
    const classNameQuery = queryResult.className;
    const classInfo = await controller.getClassInfoWithClassName(classNameQuery);

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

view.submit = async (userEmail) => {
    //query
    const r = await controller.submit(userEmail);
    const materialInfo = r.materialInfo;
    const className = r.classNameQuery;

    //opts
    const opts = {
        ...materialInfo.data,
        className,
        userEmail,
    }

    //mount page
    const submitPage = riot.mount("div#root", "submit", opts);

    //add event to header
    view.header();

    //get check button
    const checkBtn = document.getElementById("check-btn");

    //choose section
    const sectionOptions = document.getElementsByClassName("section-option");

    //create answer list
    const createAnswerList = async (materialInfo, sectionName) => {
        const answerList = document.getElementById("answers-list");
        answerList.innerHTML = "";
        const keys = await controller.getAnswerKeys(materialInfo, sectionName);
        const keyTotal = keys.length - 1;
        for (let i = 0; i < keyTotal; i++){
            answerList.innerHTML += `
            <div class="answer-item margin-left-12px flex-row">
                <label for="" class="font-12px" style="margin-right: 8px; padding-top: 5px; width: 12px">${i+1}</label>
                <input class="answer" question="${i+1}" type="text" style="height: 30px; width: 100px;">
                <div class="check-answer-symbol flex-col"></div>
            </div>
            `;
        }
    }

        //set default
    var sectionName = "section 1";
    sectionOptions[0].classList.add("btn-primary");
    createAnswerList(materialInfo, sectionName);

    for (let sectionOption of sectionOptions){
        sectionOption.addEventListener("click", (e) => {
            sectionName = e.target.innerText.toLowerCase();

            //create answers input containers
            createAnswerList(materialInfo, sectionName);

            for (let option of sectionOptions){
                if (option.classList.contains("btn-primary")){
                    option.classList.remove("btn-primary");
                    break;
                }
            }

            e.target.classList.add("btn-primary");

            //renew answer inputs
            if (!checkBtn.classList.contains("btn-primary")){
                checkBtn.classList.add("btn-primary");
                const checkAnswerSymbol = document.getElementsByClassName("check-answer-symbol");
                for (let i = 0; i < checkAnswerSymbol.length; i++) {
                    checkAnswerSymbol[i].innerHTML = "";
                };
                
                //renew answer input
                const answerInputs = document.getElementsByClassName("answer");
                for (let answerInput of answerInputs){
                    answerInput.value = "";
                }; 
            }

            //renew result
            view.renderPercentage("N/A");
        })
    }

    //check answers
    checkBtn.addEventListener("click", async (e) => {
        e.target.classList.remove("btn-primary");

        const answerInputs = document.getElementsByClassName("answer");
        const answers = [null];       
        for (let answerInput of answerInputs){
            const answer = answerInput.value.toLowerCase();
            answers.push(answer);
        };

        await controller.checkAnswers(className, materialInfo, sectionName, answers, userEmail);
        e.target.classList.add("btn-primary");
    })
}

view.checkAnswers = (boolean, i) => {
    const checkAnswerSymbol = document.getElementsByClassName("check-answer-symbol");
    
    if (boolean == true){
        checkAnswerSymbol[i-1].innerHTML += `<i class="fas fa-check" style="color: #52c41a;"></i>`;
    } else{
        checkAnswerSymbol[i-1].innerHTML += `<i class="fas fa-times" style="color: #f5222d"></i>`;
    }
}

view.renderPercentage = (percentage) => {
    const result = document.getElementById("result");
    result.innerText = `Your result: ${percentage}%`;
}

view.overview = async (userEmail) => {
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

view.classInfoAssistant = async (userEmail) => {
    //query
    const queryResult = controller.query();
    const classNameQuery = queryResult.className;
    const classInfo = await controller.getClassInfoWithClassName(classNameQuery);

    //opts
    const opts = {
        ...classInfo.data,
        userEmail
    }
    console.log(opts);

    //mount page
    const classInfoAssistantPage = riot.mount("div#root", "classinfoassistant", opts);

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
            studentEmails = controller.omitSpaceInEmailArray(studentEmails);

            const r = await controller.addStudentToClass(classInfo, studentEmails);
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
        removeStudentButton.addEventListener("click", (e) => {
            removeStudentModal.open();

            studentEmail = e.target.getAttribute("studentEmail")
            document.getElementById("student-email-container").innerText = studentEmail;
            
        })

        //confirm and unconfirm delete account btn
        document.getElementById("unconfirm-remove-student-btn").addEventListener("click", (e) => {
            e.preventDefault();

            removeStudentModal.close();
        }) 

        document.getElementById("confirm-remove-student-btn").addEventListener("click", async (e) => {
            e.preventDefault();
            
            await controller.removeStudentFromClass(classInfo, studentEmail);
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
            const r =  await controller.addMaterialToClass(classInfo, materialName);
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

            await controller.deleteMaterialFromClass(classInfo, e.target.getAttribute("materialName"));
            location.reload();
        })
    }

    
    //create delete modal
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
            
            await controller.deleteClass(classInfo);
            window.location.href="/overview";
        })
    })

}

view.upload = (userEmail) => {
    //opts
    const opts = {
        userEmail,
    }

    //mount page
    const uploadPage = riot.mount("div#root", "upload", opts);

    //check if the material has already existed, and provide some solutions if any
    const materialNameEle = document.getElementById("material-name");
    const informModal = initModal(document.getElementById("inform-modal"))
    materialNameEle.addEventListener("change", async (e) => {
        informModal.open();

        const modalContainer = document.getElementById("modal-container");
        const materialName = materialNameEle.value;
        const materialInfo = await controller.getMaterialInfoWithMaterialName(materialName);
        if (materialInfo == undefined){
            modalContainer.innerHTML = `<div id="inform-message" class="margin-bot-24px font-20px"></div>`;

            view.setMessage("inform-message", `You are uploading a new material called ${materialName}`)

            const okayButton = document.createElement("button");
            okayButton.classList.add("btn-primary");
            okayButton.innerText = "Okay";
            modalContainer.appendChild(okayButton);
            okayButton.addEventListener("click", (e) => {
                informModal.close();
            })
        } else{
            modalContainer.innerHTML = `<div id="inform-message" class="margin-bot-24px font-20px"></div>`;

            view.setMessage("inform-message", `${materialName} has been created.`)

            const turnToMaterialPage = document.createElement("button");
            turnToMaterialPage.innerText = "Take me to the page of this material";
            turnToMaterialPage.classList.add("btn-primary");
            turnToMaterialPage.addEventListener("click", (e) => {
                window.location.href = `/materialInfo?materialName=${materialName}`;
            })

            const outButton = document.createElement("button");
            outButton.innerText = "Okay, let me create a new material"; 
            outButton.addEventListener("click", (e) => {
                informModal.close()
            })

            const buttonContainer = document.createElement("div");
            buttonContainer.classList.add("flex-col");
            buttonContainer.appendChild(turnToMaterialPage);
            buttonContainer.appendChild(outButton);

            modalContainer.appendChild(buttonContainer);
        }
    })

    //init file upload
    initImgUpload();

    //type of material
    const materialType = document.getElementById("type");
    materialType.addEventListener("change", (e) => {
        document.getElementById("type-title").innerText = materialType.value;
    })

    //material info form
    const materialInfoForm = document.getElementById("material-info");
    materialInfoForm.addEventListener("submit", (e) => {
        e.preventDefault();
    })

    //add section options
    const sectionOption = document.getElementById("section-option");
    materialInfoForm.numberOfSections.addEventListener("change", (e) => {
        e.preventDefault();

        const numOption = materialInfoForm.numberOfSections.value;

        sectionOption.innerHTML = ``;
        for (var i = 0; i < numOption; i++){
            sectionOption.innerHTML += `
                <option value="section ${i+1}">Section ${i+1}</option>
            `;
        }
    })

    //add key containers
    const keyList = document.getElementById("keys-list-container");
    const keyTotalEle = document.getElementById("key-total");
    keyTotalEle.setAttribute("size", keyTotalEle.getAttribute("placeholder").length);
    keyTotalEle.addEventListener("change", (e) => {
        const keyTotal = e.target.value;
        for (var i = 0; i < keyTotal; i++){
            keyList.innerHTML += `
            <div id="key-item" class="margin-left-12px flex-row" style="flex-wrap: nowrap;">
                <label for="" class="font-12px" style="margin-right: 8px; padding-top: 5px; width: 12px">${i+1}</label>
                <input class="key" type="text" style="height: 30px; width: 100px;">
                <div class="flex-col"></div>
            </div>
            `;
        };
    })

    //start uploading
    const uploadButton = document.getElementById("upload-btn");
    uploadButton.addEventListener("click", async (e) => {
        const files = [];
        document.querySelectorAll("input[type=file]").forEach( (ele) => {
          if(ele.files[0]){
            files.push(ele.files[0]);
          }
        });

        var answers = [null];
        const answerEles = document.getElementsByClassName("key");
        for (let answerEle of answerEles){
            answers.push(answerEle.value.toLowerCase());
        }

        const section = {
            sectionName: sectionOption.value,
            answers: answers,
        };
        
        const materialInfo = document.getElementById("material-info");

        uploadButton.classList.remove("btn-primary");

        await controller.uploadMaterial({
            name: materialNameEle.value,
            type: materialInfo.type.value,
            section: section,
            materialPicture: files[0],
        })

        uploadButton.classList.add("btn-primary");
    })
    
}

view.materials = async (userEmail) => {
    //retrieve all materials
    const materialsType = "Reading";
    const materialsWithType = await controller.getMaterialsWithType(materialsType);

    //opts
    const opts = {
        materialsWithType,
        userEmail,
    }

    //mount page
    const materialsPage = riot.mount("div#root", "materials", opts)[0];

    //upload button
    document.getElementById("upload-btn").addEventListener("click", () => {
        window.location.href = "/upload";
    })

    //choose type
    const materialTypeEles = document.getElementsByClassName("material-type");
    for (let materialTypeEle of materialTypeEles){
        const materialTypeEleContainer = materialTypeEle.parentElement;
        materialTypeEleContainer.addEventListener("click", async (e) => {
            materialsType = e.target.innerText;
            materialsPage.opts.materialsWithType = await controller.getMaterialsWithType(materialsType);
            materialsPage.update();
        })
    }


    //edit info buttons
    const editInfoButtons = document.getElementsByClassName("edit-info");
    for (let editInfoButton of editInfoButtons){
        editInfoButton.addEventListener("click", (e) => {
            const materialName = e.target.getAttribute("materialName");
            window.location.href = `/materialInfo?materialName=${materialName}`;
        })
    }

    //search bar
    const searchBarButton = document.getElementById("search-bar-btn");
    searchBarButton.addEventListener("click", async (e) => {
        const searchKeywords = document.getElementById("search-bar").value;
        const materialsInfoData = await controller.getMaterialsWithKeywords(materialsType, searchKeywords);
        if (materialsInfoData != undefined){
            materialsPage.opts.materialsWithType = materialsInfoData;
            materialsPage.update();
        }
    })
}

view.materialInfo = async (userEmail) => {
    //query
    const queryResult = controller.query();
    const materialNameQuery = queryResult.materialName;
    const materialInfo = await controller.getMaterialInfoWithMaterialName(materialNameQuery);

    //opts
    const opts = {
        ...materialInfo.data,
        userEmail,
    }

    //mount page
    const materialChangePage = riot.mount("div#root", "materialinfo", opts);

    //keyListContainer
    const keyListContainer = document.getElementById("key-list-container");

    //section button
    const sectionOptions = document.getElementsByClassName("section-option");
    var sectionName = "";
    for (let sectionOption of sectionOptions){
        sectionOption.addEventListener("click", async (e) => {
            e.preventDefault();

            for (let option of sectionOptions){
                if (option.classList.contains("btn-primary")){
                    option.classList.remove("btn-primary");
                    break;
                }
            }

            e.target.classList.add("btn-primary");

            //renew answer inputs
            keyListContainer.innerHTML = "";

            //display keys
            sectionName = e.target.innerText.toLowerCase();
            const answerkeys = await controller.getAnswerKeys(materialInfo, sectionName);
            for (let i = 0; i < answerkeys.length; i++){
                const answer = answerkeys[i+1].toUpperCase();
                keyListContainer.innerHTML +=`
                <div class="answer-item margin-left-12px flex-row">
                    <label for="" class="font-12px" style="margin-right: 8px; padding-top: 5px; width: 12px">${i+1}</label>
                    <input class="key" question="${i+1}" type="text" style="height: 30px; width: 100px;" value="${answer}">
                    <div class="check-answer-symbol flex-col"></div>
                </div>
                `;
            }
        })
    }

    //update answer button
    const updateButton = document.getElementById("update-btn");
    updateButton.addEventListener("click", async (e) =>{
        e.preventDefault();

        var keys = ["null"];
        const keyInputs = document.getElementsByClassName("key");
        for (let keyInput of keyInputs){
            const key = keyInput.value.toLowerCase();
            keys.push(key);
        };

        e.target.classList.remove("btn-primary");
        await controller.editMaterial.updateKeys(materialInfo, sectionName, keys);
        e.target.classList.add("btn-primary");
    })

    //add event to change name, type and sections of the material
    const updateModal = initModal(document.getElementById("update-modal"));

    document.getElementById("update-name").addEventListener("click", (e) => {
        updateModal.open();

        document.getElementById("update-form").innerHTML = `
        <div class="font-20px">You are updating <b>material's name</b></div>
        <input id="material-new-name" placeholder="New name for the material" class="border-standard margin-bot-12px margin-top-12px"></input>
        <button id="confirm-btn" class="bg-color-danger color-white">Confirm</button>
        <button id="unconfirm-btn" class="btn-primary color-black">NO!Back to safety</button>
        `
        
        document.getElementById("confirm-btn").addEventListener("click", async (e) => {
            e.preventDefault();
            await controller.editMaterial.editName(materialInfo, document.getElementById("material-new-name").value);
            window.location.href = `/materialInfo?materialName=${document.getElementById("material-new-name").value}`
        })

        document.getElementById("unconfirm-btn").addEventListener("click", (e) => {
            e.preventDefault();
            updateModal.close();
        })
    })

    document.getElementById("update-type").addEventListener("click", (e) => {
        updateModal.open();

        document.getElementById("update-form").innerHTML = `
        <div class="font-20px">You are updating <b>material's type</b></div>
        <input id="material-new-type" placeholder="New type for the material" class="border-standard margin-bot-12px margin-top-12px"></input>
        <button id="confirm-btn" class="bg-color-danger color-white">Confirm</button>
        <button id="unconfirm-btn" class="btn-primary color-black">NO!Back to safety</button>
        `
        
        document.getElementById("confirm-btn").addEventListener("click", async (e) => {
            e.preventDefault();
            await controller.editMaterial.editType(materialInfo, document.getElementById("material-new-type").value);
            location.reload();
        })
        
        document.getElementById("unconfirm-btn").addEventListener("click", (e) => {
            e.preventDefault();
            updateModal.close();
        })
    })

    const updateSectionSymbols = document.getElementsByClassName("update-section");
    for (let updateSectionSymbol of updateSectionSymbols){
        updateSectionSymbol.addEventListener("click", (e) => {
            updateModal.open();

            const sectionName = e.target.parentElement.childNodes[1].innerText;
            const updateForm = document.getElementById("update-form");
            updateForm.innerHTML = `
                <div class="font-20px">You are deleting <b>${sectionName}</b></div>
                <div class="font-14px opacity-50 margin-bot-12px">Are you sure?</div>
                <button id="confirm-btn" class="bg-color-danger color-white">Confirm</button>
                <button id="unconfirm-btn" class="btn-primary color-black">NO! Take me back to safety</button>
            `

            document.getElementById("confirm-btn").addEventListener("click", async (e) => {
                e.preventDefault();
                await controller.editMaterial.deleteSection(materialInfo, sectionName.toLowerCase());
                location.reload();
            })
            
            document.getElementById("unconfirm-btn").addEventListener("click", (e) => {
                e.preventDefault();
                updateModal.close();
            })
        })
    }

    //add section button
    document.getElementById("add-section").addEventListener("click", (e) => {
        updateModal.open();
        
        const updateForm = document.getElementById("update-form");
        updateForm.innerHTML += `
        <div class="font-20px">You are adding a section</div>
        <div class="flex-row">
            <div class="opacity-50" style="padding-top: 11px; margin-right: 12px;" >Section number</div>
            <input id="new-section" placeholder="1" class="border-standard margin-bot-12px margin-top-12px" style="width: 22px;"></input>      
        </div>
        <button id="confirm-btn" class="bg-color-danger color-white">Confirm</button>
        <button id="unconfirm-btn" class="btn-primary color-black">NO! Take me back to safety</button>
        `

        document.getElementById("confirm-btn").addEventListener("click", async (e) => {
            e.preventDefault();

            const newSectionName = document.getElementById("new-section");

            const numberOfQuestionsInputContainer = document.getElementById("number-of-questions-input");
            const numberOfQuestionsInput = document.createElement("input");
            numberOfQuestionsInput.setAttribute("placeholder", "number of questions");
            numberOfQuestionsInput.classList.add("input-standard");            
            numberOfQuestionsInput.classList.add("text-center");
            numberOfQuestionsInputContainer.appendChild(numberOfQuestionsInput);

            const updateButtonContainer = document.getElementById("update-button-container");
            const uploadNewSectionButton = document.createElement("button");
            uploadNewSectionButton.classList.add("center");
            uploadNewSectionButton.classList.add("btn-primary");
            uploadNewSectionButton.innerText = "Upload keys for this section";
            updateButtonContainer.innerHTML = "";
            updateButtonContainer.appendChild(uploadNewSectionButton);

            updateModal.close();

            numberOfQuestionsInputContainer.addEventListener("submit", (e) => {
                e.preventDefault();
            });

            numberOfQuestionsInput.addEventListener("change", (e) => {
                e.preventDefault();

                //add key containers
                const keyTotal = e.target.value;
                for (var i = 0; i < keyTotal; i++){
                    keyListContainer.innerHTML += `
                    <div id="key-item" class="margin-left-12px flex-row" style="flex-wrap: nowrap;">
                        <label for="" class="font-12px" style="margin-right: 8px; padding-top: 5px; width: 12px">${i+1}</label>
                        <input class="key" type="text" style="height: 30px; width: 100px;">
                        <div class="flex-col"></div>
                    </div>
                    `;
                }
            })
            

            uploadNewSectionButton.addEventListener("click", async (e) => {
                e.preventDefault();
    
                var keys = [null];
                const keyEles = document.getElementsByClassName("key");
                for (let keyEle of keyEles){
                    keys.push(keyEle.value.toLowerCase());
                }
        
                const section = {
                    sectionName: "section" + " " + newSectionName.value,
                    answers: keys,
                };

                await controller.editMaterial.addSection(materialInfo, section);
                location.reload();
            })

        })
        
        document.getElementById("unconfirm-btn").addEventListener("click", (e) => {
            e.preventDefault();
            updateModal.close();
        })
    })
}

export {
    view,
}