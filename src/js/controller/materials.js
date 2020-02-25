import firebase from "firebase";
import "firebase/firestore";
import controller from "../controller";

const getMaterialInfoWithMaterialName = async (materialName) => {
    const db = firebase.firestore();
    const materialSnapshot = await db.collection("materials").where("name", "==", materialName).get();
    if (materialSnapshot.docs.length != 0){
        return {
            id: materialSnapshot.docs[0].id,
            data: materialSnapshot.docs[0].data(),
        }
    } else{
        return undefined;
    }
    
}

const getMaterialsWithType = async (materialType) => {
    const db = firebase.firestore();
    const materialWithTypeSnapshot = await db.collection("materials").where("type", "==", materialType).get();
    const materialsWithTypeInfo = materialWithTypeSnapshot.docs.map((doc) => {
        return doc.data();
    })
    return materialsWithTypeInfo;
}

const getMaterialsWithKeywords = async (materialType, searchKeywords) => {
    const db = firebase.firestore();
    const materialsSnapshot = await db.collection("materials").where("type", "==", materialType)
                                                              .where("keywords", "array-contains", searchKeywords)
                                                              .get();                                                    
    if (materialsSnapshot.docs.length != 0){
        const materialsInfoData = materialsSnapshot.docs.map((doc) => {
            return doc.data();
        })
        return materialsInfoData;
    } else {
        return undefined;
    }                                                        
}

const getAnswerKeys = (materialInfo, sectionNameQuery) => {
    for (let section of materialInfo.data.sections){
        if (section.sectionName == sectionNameQuery){
            return section.answers;
        }
    }
}

const createKeyWords = (title) => {
    const arrTitle = [];
    const arrayOfLetters = title.split("");
    for (let i = 0; i < arrayOfLetters.length; i++){
        var curTitle = arrayOfLetters[i];
        if (i != (arrayOfLetters.length - 1)){
            for (let j = i + 1; j < arrayOfLetters.length; j++){
                curTitle += arrayOfLetters[j];
                arrTitle.push(curTitle);
            }
        } else{
            arrTitle.push(arrayOfLetters[i])
        }
    }
    return arrTitle;
}

const uploadMaterial = async (materialInfoUpload) => {
    //upload material picture to firebase storage
    const storageRef = firebase.storage().ref("previewImages/" + materialInfoUpload.materialPicture.name);
    const r = await storageRef.put(materialInfoUpload.materialPicture);
    const fileUrls = await r.ref.getDownloadURL();
    
    //upload information to firestore
    const db = firebase.firestore();
    const materialName = materialInfoUpload.name;
    const keywords = createKeyWords(materialName);
    const materialInfo = await controller.materials.getMaterialInfoWithMaterialName(materialName);
    if (materialInfo == undefined){
        //for section 1 upload
        db.collection("materials").add({
            name: materialInfoUpload.name,
            type: materialInfoUpload.type,
            sections: [materialInfoUpload.section],
            fileUrls: fileUrls,
            keywords: keywords,
        })
    } else{
        //for section 2 and beyond upload, since material has been created
        db.collection("materials").doc(materialInfo.id).update({
            sections: firebase.firestore.FieldValue.arrayUnion(materialInfoUpload.section)
        })
    }
}

const updateKeys = async (materialInfo, sectionNameQuery, keys) => {
    const db = firebase.firestore();
    // for (let section of materialInfo.data.sections){
    const sectionsData = materialInfo.data.sections; 
    for (let i = 0; i < sectionsData.length; i++){    
        if (sectionsData[i].sectionName == sectionNameQuery){
            sectionsData[i].answers = keys;
        }
    }

    await db.collection("materials").doc(materialInfo.id).update({
        sections: sectionsData,
    })
}

const editName = async (materialInfo, newName) => {
    const db = firebase.firestore();
    await db.collection("materials").doc(materialInfo.id).update({
        name: newName,
    })
}

const editType = async (materialInfo, newType) => {
    const db = firebase.firestore();
    await db.collection("materials").doc(materialInfo.id).update({
        type: newType,
    })
}

const deleteSection = async (materialInfo, sectionName) => {
    const db = firebase.firestore();
    const sectionsData = materialInfo.data.sections;
    for (let i = 0; i < sectionsData.length; i++) {
        if (sectionsData[i].sectionName == sectionName){
            sectionsData.splice(i, 1);
            break;
        }
    }
    await db.collection("materials").doc(materialInfo.id).update({
        sections: sectionsData,
    })
} //TODO: delete section = delete answer keys of it, not deleteing it literrally

const addSection = async (materialInfo, section) => {
    const db = firebase.firestore();
    await db.collection("materials").doc(materialInfo.id).update({
        sections: firebase.firestore.FieldValue.arrayUnion(section),
    })
}

const materials = {
    getMaterialInfoWithMaterialName,
    getMaterialsWithType,
    getMaterialsWithKeywords,
    getAnswerKeys,
    uploadMaterial,
    updateKeys,
    editName,
    editType,
    deleteSection,
    addSection,
}

export {
    materials
}