import "../../css/index.css";
import "../../tags/materialInfo.tag";
import {initModal} from '../../mx';
import controller from "../controller";
import view from "../view";

import riot from 'riot';

const renderKeyListContainer = (answerkeys) => {
    const keyListContainer = document.getElementById("key-list-container");

    keyListContainer.innerHTML = "";

    for (let i = 0; i < answerkeys.length -1; i++){
        const answer = answerkeys[i+1].toUpperCase();
        keyListContainer.innerHTML +=`
        <div class="answer-item margin-left-12px flex-row">
            <label for="" class="font-12px" style="margin-right: 8px; padding-top: 5px; width: 12px">${i+1}</label>
            <input class="key" question="${i+1}" type="text" style="height: 30px; width: 100px;" value="${answer}">
        </div>
        `;
    }

    keyListContainer.innerHTML += `
    <i class="fas fa-times pointer" style="color: #f5222d; width: 14px; margin: 8px 4px 0px 16px;"></i>
    <i class="fas fa-plus pointer" style="margin: 8px 0px 0px 16px;"></i>
    `;

    const deleteKeysSymbols = document.getElementsByClassName("fa-times");
    deleteKeysSymbols[0].addEventListener("click", (e) => {
        answerkeys.pop();
        renderKeyListContainer(answerkeys);
    })

    const addKeysSymbol = document.getElementsByClassName("fa-plus");
    addKeysSymbol[0].addEventListener("click", (e) => {
        answerkeys.push("");
        renderKeyListContainer(answerkeys);
        // if this way, when press +, new data just inserted will disappear TODO
    })
}

const materialInfo = async (userEmail) => {
    //query
    const queryResult = controller.query();
    const materialNameQuery = decodeURIComponent(queryResult.materialName);
    const materialInfo = await controller.materials.getMaterialInfoWithMaterialName(materialNameQuery);

    //opts
    const opts = {
        ...materialInfo.data,
        userEmail,
    }

    //mount page
    const materialChangePage = riot.mount("div#root", "materialinfo", opts);

    //header
    view.header();

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
            const answerkeys = await controller.materials.getAnswerKeys(materialInfo, sectionName);

            //remove the number of questions input
            document.getElementById("number-of-questions-input").value = "";
        
            renderKeyListContainer(answerkeys);
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

        document.getElementById("loader").innerHTML = `<div id="loader" class="lds-dual-ring center"></div>`;
        e.target.classList.remove("btn-primary");
        await controller.materials.updateKeys(materialInfo, sectionName, keys);
        document.getElementById("loader").innerHTML = "";
        e.target.classList.add("btn-primary");
    })

    //add event to change name, type and sections of the material
    const updateModal = initModal(document.getElementById("update-modal"));

    //FOR FUTURE DEVELOPMENT
    // document.getElementById("update-name").addEventListener("click", (e) => {
    //     updateModal.open();

    //     document.getElementById("update-form").innerHTML = `
    //     <div class="font-20px">You are updating <b>material's name</b></div>
    //     <input id="material-new-name" placeholder="New name for the material" class="border-standard margin-bot-12px margin-top-12px"></input>
    //     <button id="confirm-btn" class="bg-color-danger color-white">Confirm</button>
    //     <button id="unconfirm-btn" class="btn-primary color-black">NO!Back to safety</button>
    //     `
        
    //     document.getElementById("confirm-btn").addEventListener("click", async (e) => {
    //         e.preventDefault();
    //         await controller.materials.editName(materialInfo, document.getElementById("material-new-name").value);
    //         window.location.href = `/materialInfo?materialName=${document.getElementById("material-new-name").value}`
    //     })

    //     document.getElementById("unconfirm-btn").addEventListener("click", (e) => {
    //         e.preventDefault();
    //         updateModal.close();
    //     })
    // })

    // document.getElementById("update-type").addEventListener("click", (e) => {
    //     updateModal.open();

    //     document.getElementById("update-form").innerHTML = `
    //     <div class="font-20px">You are updating <b>material's type</b></div>
    //     <input id="material-new-type" placeholder="New type for the material" class="border-standard margin-bot-12px margin-top-12px"></input>
    //     <button id="confirm-btn" class="bg-color-danger color-white">Confirm</button>
    //     <button id="unconfirm-btn" class="btn-primary color-black">NO!Back to safety</button>
    //     `
        
    //     document.getElementById("confirm-btn").addEventListener("click", async (e) => {
    //         e.preventDefault();
    //         await controller.materials.editType(materialInfo, document.getElementById("material-new-type").value);
    //         location.reload();
    //     })
        
    //     document.getElementById("unconfirm-btn").addEventListener("click", (e) => {
    //         e.preventDefault();
    //         updateModal.close();
    //     })
    // })

    // const updateSectionSymbols = document.getElementsByClassName("update-section");
    // for (let updateSectionSymbol of updateSectionSymbols){
    //     updateSectionSymbol.addEventListener("click", (e) => {
    //         updateModal.open();

    //         const sectionName = e.target.parentElement.childNodes[1].innerText;
    //         const updateForm = document.getElementById("update-form");
    //         updateForm.innerHTML = `
    //             <div class="font-20px">You are deleting <b>${sectionName}</b></div>
    //             <div class="font-14px opacity-50 margin-bot-12px">Are you sure?</div>
    //             <button id="confirm-btn" class="bg-color-danger color-white">Confirm</button>
    //             <button id="unconfirm-btn" class="btn-primary color-black">NO! Take me back to safety</button>
    //         `

    //         document.getElementById("confirm-btn").addEventListener("click", async (e) => {
    //             e.preventDefault();
    //             await controller.materials.deleteSection(materialInfo, sectionName.toLowerCase());
    //             location.reload();
    //         })
            
    //         document.getElementById("unconfirm-btn").addEventListener("click", (e) => {
    //             e.preventDefault();
    //             updateModal.close();
    //         })
    //     })
    // }

    //add section button
    document.getElementById("add-section").addEventListener("click", (e) => {
        updateModal.open();
        
        const updateForm = document.getElementById("update-form");
        updateForm.innerHTML = `
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

            for (let option of sectionOptions){
                if (option.classList.contains("btn-primary")){
                    option.classList.remove("btn-primary");
                    break;
                }
            }

            keyListContainer.innerHTML = "";

            updateModal.close();

            numberOfQuestionsInputContainer.addEventListener("submit", (e) => {
                e.preventDefault();
            });

            var keyTotal = 0;
            numberOfQuestionsInput.addEventListener("change", (e) => {
                e.preventDefault();

                //add key containers
                keyListContainer.innerHTML = "";
                keyTotal = e.target.value;
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
                    if (keyEle.value != ""){    
                        keys.push(keyEle.value.toLowerCase());
                    }
                }
        
                const section = {
                    sectionName: "section" + " " + newSectionName.value,
                    answers: keys,
                    total: Number(keyTotal),
                };

                const validation = controller.materials.uploadNewSectionValidation(section);
                if (validation){
                    document.getElementById("loader").innerHTML = `<div id="loader" class="lds-dual-ring center"></div>`;
                    await controller.materials.addSection(materialInfo, section);
                    document.getElementById("loader").innerHTML = "";
                    location.reload();
                }                
            })

        })
        
        document.getElementById("unconfirm-btn").addEventListener("click", (e) => {
            e.preventDefault();
            updateModal.close();
        })
    })
}

export {materialInfo}