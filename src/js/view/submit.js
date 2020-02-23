import "../../css/index.css";
import "../../tags/submit.tag";
import controller from "../controller";
import view from "../view";
import riot from 'riot';

const renderPercentage = (percentage) => {
    const result = document.getElementById("result");
    result.innerText = `Your result: ${percentage}%`;
}

const submit = async (userEmail) => {
    //query
    const r = await controller.submit.renderData(userEmail);
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
        const keys = await controller.materials.getAnswerKeys(materialInfo, sectionName);
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
            renderPercentage("N/A");
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

        await controller.submit.checkAnswers(className, materialInfo, sectionName, answers, userEmail);
        e.target.classList.add("btn-primary");
    })
}

export {
    submit,
    renderPercentage,
}