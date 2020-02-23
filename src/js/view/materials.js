import "../../css/index.css";
import "../../tags/materials.tag";
import controller from "../controller";
import view from "../view";

import riot from 'riot';

const materials = async (userEmail) => {
    //retrieve all materials
    const materialsType = "Reading";
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
        const materialTypeEleContainer = materialTypeEle.parentElement;
        materialTypeEleContainer.addEventListener("click", async (e) => {
            materialsType = e.target.innerText;
            materialsPage.opts.materialsWithType = await controller.materials.getMaterialsWithType(materialsType);
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
        const materialsInfoData = await controller.materials.getMaterialsWithKeywords(materialsType, searchKeywords);
        if (materialsInfoData != undefined){
            materialsPage.opts.materialsWithType = materialsInfoData;
            materialsPage.update();
        }
    })
}

export {materials}