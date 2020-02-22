const setMessage = (id, message) => {
    const ele = document.getElementById(id);
    ele.innerText = message; 
}

export {setMessage}