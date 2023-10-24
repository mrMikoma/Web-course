/* 
Used documentation:
- https://frappe.io/charts/docs
- https://getbootstrap.com/docs/5.2/getting-started/introduction/

*/

import * as spot from "../spot/spot.js";

// Global variables
let chart = "";
let runningListID = 0;

// Add dayselector 1
const daySelector1 = document.getElementById("btnradio1");
daySelector1.addEventListener("click", (event) => {
  updateAll();
});

// Add dayselector 1
const daySelector2 = document.getElementById("btnradio2");
daySelector2.addEventListener("click", (event) => {
  updateAll();
});

// Add checkbox
const includeVATbox = document.getElementById("vat-box");
includeVATbox.addEventListener("click", (event) => {
  updateAll();
});

// Add new action
const addActionButton = document.getElementById("add-action");
addActionButton.addEventListener("click", (event) => {
  addNewConsumption();
  updateAll();
});

// Add wrapper for removing action from list
const wrapperActions = document.getElementById("action-list");
wrapperActions.addEventListener("click", (event) => {
  console.log("removed div with " + event.target.id); // Debug
  // Error handling
  const isButton = event.target.nodeName === "BUTTON";
  if (!isButton) {
    return;
  }
  // Remove list item
  removeConsumptionAction(event);
});

const buildChart = async () => {
  // Initialize datasets
  const sourceToday = "../spot/day-prices.json";
  const sourceDayahead = "../spot/day-prices-dayahead.json";
  await spot.initializeDatasets(sourceToday, sourceDayahead);

  // Configure chart
  chart = new frappe.Chart("#chart", {
    data: spot.getChartDataset(true, true, false),
    title: "Electricity prices",
    type: "line",
    height: 450,
    colors: ["red", "blue"],
    axisOptions: {
      xIsSeries: true,
      xAxisMode: "tick",
      yAxisMode: "span",
    },
    lineOptions: {
      hideDots: 0,
      heatline: 1,
      regionFill: 1,
    },
  });
};

const updateAll = () => {
  // Select correct day
  let isToday = true;
  if (daySelector2.checked) {
    isToday = false;
  }

  // Select VAT
  let includeVAT = false;
  if (includeVATbox.checked) {
    includeVAT = true;
  }

  // Update consumption total price
  updateTotalPrice(spot.getTotalConsumptionPrice(isToday, includeVAT));

  // Update chart
  let dataasd = spot.getChartDataset(isToday, true, includeVAT);
  console.log(dataasd); // Debug
  chart.update(dataasd);
};

const updateTotalPrice = (totalPrice) => {
  // Update consumption price
  let consumptionLable = document.getElementById("consumption-price");
  consumptionLable.innerText = totalPrice + "€";
};

// Add consumption
const addNewConsumption = () => {
  // Select correct day
  let isToday = true;
  if (daySelector2.checked) {
    isToday = false;
  }

  // Get action data
  let action = document.getElementById("action-select");
  let startTime = document.getElementById("startTime").value;
  let endTime = document.getElementById("endTime").value;

  // Add new action to spot
  spot.addEstimateAction(runningListID, action.value, startTime, endTime);

  // Add new action to list
  addListItem(action, startTime, endTime, isToday);

  // Update UI
  updateAll();
};

// Add new action to list
const addListItem = (action, startTime, endTime) => {
  // Create new list element
  let div = document.createElement("div");
  let node = document.createElement("li");
  let button = document.createElement("button");
  node.appendChild(
    document.createTextNode(
      action[action[action.selectedIndex].id].textContent +
        " " +
        startTime +
        "-" +
        endTime
    )
  );
  div.className = "list-group-item d-flex justify-content-around";
  div.id = runningListID;
  button.id = runningListID;
  ++runningListID;
  button.className = "btn btn-outline-danger";
  button.textContent = "Remove";

  // Add new item to list
  div.append(node);
  div.append(button);
  document.getElementById("action-list").appendChild(div);
};

// Remove action from list
const removeConsumptionAction = (event) => {
  console.log("hahahahaaaaaaa " + event.target.id); // Debug

  // Update spot
  spot.removeEstimateAction(event.target.id);

  // Remove list item
  let list = document.getElementById("action-list");
  list.removeChild(document.getElementById(event.target.id));

  // Update UI
  updateAll();
};

buildChart();