import "../../css/index.css";
import "../../css/upload.css";
import "../../tags/upload.tag";
import {initImgUpload, initModal} from '../../mx';

import riot from 'riot';

const upload = (userEmail) => {
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

export {upload}