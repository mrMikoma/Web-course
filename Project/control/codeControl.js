/* 
Used documentation:
- https://frappe.io/charts/docs
- https://getbootstrap.com/docs/5.2/getting-started/introduction/

*/

// Global variables
let relayOn = true;

// Add relay control button
const relayButton = document.getElementById("relay-button");
relayButton.addEventListener("click", () => {
  // Toggle button
  if (relayOn) {
    relayOn = false;
    relayButton.className = "btn btn-success";
    relayButton.textContent = "Turn on"
  } else {
    relayOn = true;
    relayButton.className = "btn btn-danger";
    relayButton.textContent = "Turn off"
  }
  console.log("haha"); // Debug
});
