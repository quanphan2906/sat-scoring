import "../../css/index.css";
import "../../tags/materials.tag";
import controller from "../controller";
import view from "../view";

import riot from 'riot';

const addEventToEditInfo = () => {    
    //edit info buttons
    const editInfoButtons = document.getElementsByClassName("edit-info");
    for (let editInfoButton of editInfoButtons){
        editInfoButton.addEventListener("click", (e) => {
            const materialName = e.target.getAttribute("materialName");
            window.location.href = `/materialInfo?materialName=${materialName}`;
        })
    }
}

const materials = async (userEmail) => {
    //retrieve all materials
    var materialsType = "Reading";
    const materialsWithType = await controller.materials.getMaterialsWithType(materialsType);

    //opts
    const opts = {
        materialsWithType,
        userEmail,
    }

    //mount page
    const materialsPage = riot.mount("div#root", "materials", opts)[0];

    //header
    view.header();

    //upload button
    document.getElementById("upload-btn").addEventListener("click", () => {
        window.location.href = "/upload";
    })

    //choose type
    const materialTypeEles = document.getElementsByClassName("material-type");
    for (let materialTypeEle of materialTypeEles){
        materialTypeEle.parentElement.addEventListener("click", async (e) => {
            for (let materialTypeEle of materialTypeEles){
                if (materialTypeEle.parentElement.parentElement.classList.contains("border-right")){
                    materialTypeEle.parentElement.parentElement.classList.remove("border-right");
                    materialTypeEle.parentElement.parentElement.classList.add("border-standard");
                }
            }

            if (materialTypeEle.parentElement.parentElement.classList.contains("border-standard")){
                materialTypeEle.parentElement.parentElement.classList.remove("border-standard");
            } 
            materialTypeEle.parentElement.parentElement.classList.add("border-right");

            //update data
            materialsType = materialTypeEle.innerText;
            materialsPage.opts.materialsWithType = await controller.materials.getMaterialsWithType(materialsType);
            materialsPage.update();
            addEventToEditInfo();
        })
    }

    addEventToEditInfo();

    //search bar
    const searchBarButton = document.getElementById("search-bar-btn");
    searchBarButton.addEventListener("click", async (e) => {
        const searchKeywords = document.getElementById("search-bar").value;
        const materialsInfoData = await controller.materials.getMaterialsWithKeywords(materialsType, searchKeywords);
        if (materialsInfoData != undefined){
            materialsPage.opts.materialsWithType = materialsInfoData;
            materialsPage.update();
        }
    })
}

export {materials}