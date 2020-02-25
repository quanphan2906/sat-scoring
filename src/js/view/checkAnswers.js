
const checkAnswers = (boolean, i) => {
    const checkAnswerSymbol = document.getElementsByClassName("check-answer-symbol");
    
    if (boolean == true){
        checkAnswerSymbol[i-1].innerHTML += `<i class="fas fa-check" style="color: #52c41a; width: 14px;"></i>`;
    } else{
        checkAnswerSymbol[i-1].innerHTML += `<i class="fas fa-times" style="color: #f5222d; width: 14px;"></i>`;
    }
}

export {
    checkAnswers,
}