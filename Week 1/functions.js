
//  This code is inspired by Erno's code shared on version.lab.fi

if(document.readyState !== "loading") {
    initializeCode();
} else {
    document.addEventListener("DOMContentLoaded", function() {
        initializeCode();
    })
}

function initializeCode() {
    const myButton = document.getElementById("my-button");
    const myHeader = document.getElementById("my-header");
    const addButton = document.getElementById("add-data");
    const addList = document.getElementById("add-list");
    const newText = document.getElementById("new-text");

    myButton.addEventListener("click", function() {
        console.log("hello world");
        myHeader.innerHTML = "Moi maailma"
    })

    addButton.addEventListener("click", function() {
        let newData = document.createElement("li");
        newData.appendChild(document.createTextNode(newText.value));
        addList.appendChild(newData);
    })

}