/* 
Used documentation:
- https://frappe.io/charts/docs
- https://getbootstrap.com/docs/5.2/getting-started/introduction/

*/

// Global variables
let relayOn = false;
let updateDateString = "01.01.1970";
let updateTimeString = "00:01";

// Add relay update button
const relayUpdateButton = document.getElementById("relay-update");
relayUpdateButton.addEventListener("click", () => {
  updateRelayPage();
});

// Update timer info when page loaded
onload = () => {
  updateInfoLabel();
};

// Add relay control button
const relayToggleButton = document.getElementById("relay-button");
relayToggleButton.addEventListener("click", () => {
  // Toggle button
  if (relayOn) {
    relayOn = false;
    relayToggleButton.className = "btn btn-success";
    relayToggleButton.textContent = "Turn on";
  } else {
    relayOn = true;
    relayToggleButton.className = "btn btn-danger";
    relayToggleButton.textContent = "Turn off";
  }
  updateRelayPage();
});

// Update relay status on page
const updateRelayPage = () => {
  // Get needed elements
  let statusLabel = document.getElementById("relay-status");
  let statusInfo = document.getElementById("info-status");

  // Toggle button
  if (relayOn) {
    statusLabel.className =
      "p-3 border border-secondary border-1 text-white bg-success";
    statusLabel.textContent = "Relay is ON";
    statusInfo.className = "border border-secondary border-1 status-on";
  } else {
    statusLabel.className = "p-3 border border-secondary border-1 bg-danger";
    statusLabel.textContent = "Relay is OFF";
    statusInfo.className = "border border-secondary border-1 status-off";
  }

  // Update timer
  updateDateTime();
  updateInfoLabel();
};

// Update current date and time
const updateDateTime = () => {
  // Get time and date
  let today = new Date();
  updateTimeString =
    String(today.getHours()).padStart(2, "0") +
    ":" +
    String(today.getMinutes()).padStart(2, "0");
  updateDateString =
    String(today.getDate()).padStart(2, "0") +
    "." +
    String(today.getMonth() + 1).padStart(2, "0") +
    "." +
    today.getFullYear();
};

// Update info label with date and time
const updateInfoLabel = () => {
  // Get needed elements
  let updateLabel = document.getElementById("update-timer");

  // Update status
  updateLabel.textContent = updateDateString + " " + updateTimeString;
};
