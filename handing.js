
console.log("moro jaska"); // debug

submitButton = document.getElementById("submit-data");

submitButton.addEventListener("click", () => {
    console.log("moro moro paska!") // debug

    // Gather data from input fields
    let usernameInput = document.getElementById("input-username");
    let emailInput = document.getElementById("input-email");
    let adminInput = document.getElementById("input-admin");
    console.log("Hahaa Jaska: " + usernameInput.value + " " + emailInput.value + " " + adminInput.checked) // debug

    // Add new data to the table
    document.getElementById("user-table").innerHTML += 
    "<tr><td>" + usernameInput.value + 
    "</td><td>" + emailInput.value + 
    "</td><td>" + (adminInput.checked == true ? adminInput.value : '-') +  
    "</td></tr>";
})
