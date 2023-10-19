/* 
Used documentation:
- https://frappe.io/charts/docs
- https://getbootstrap.com/docs/5.2/getting-started/introduction/

*/

// Global variables
let chart = "";
let chartDataToday = "";
let chartDataDayahead = "";
let savedActions = [];
let runningListID = 0;

// Add dayselector 1
const daySelector1 = document.getElementById("btnradio1");
daySelector1.addEventListener("click", (event) => {
  updateChart();
});

// Add dayselector 1
const daySelector2 = document.getElementById("btnradio2");
daySelector2.addEventListener("click", (event) => {
  updateChart();
});

// Add checkbox
const includeVATbox = document.getElementById("vat-box");
includeVATbox.addEventListener("click", (event) => {
  updateChart();
});

// Add new action
const addActionButton = document.getElementById("add-action");
addActionButton.addEventListener("click", (event) => {
  updateConsumptionChart();
});

// Add wrapper for removing action from list
const wrapperActions = document.getElementById("action-select");
wrapperActions.addEventListener("click", (event) => {
  // Error handling
  const isButton = event.target.nodeName === "BUTTON";
  if (!isButton) {
    return;
  }
  // Remove list item
  removeListItem(event);

  console.log("removed div with " + event.target.id); // Debug
});

// Get data
const getData = async (source) => {
  const res = await fetch(source);
  const data = await res.json();
  return data;
};

// Handle dataset
const getDataset = (data) => {
  let labels = [];
  let values = [];
  data.prices.forEach((price, index) => {
    // Parse time
    let isoDate = new Date(price.time);
    let time =
      isoDate.getHours().toString() + ":" + isoDate.getMinutes().toString() + 0;
    labels.push(time);

    // Fix price
    values.push((Number(price.price) / 10).toFixed(2));
  });
  let dataset = [
    { name: "Hour price (cents/kWh)", values: values, chartType: "line" },
  ];

  chartData = {
    labels: labels,
    datasets: dataset,
  };

  return chartData;
};

const buildChart = async () => {
  // Get data
  const sourceToday = "../day-prices.json";
  const sourceDayahead = "../day-prices-dayahead.json";
  const dataToday = await getData(sourceToday);
  const dataDayahead = await getData(sourceDayahead);

  // Parse datasets
  chartDataToday = getDataset(dataToday);
  chartDataDayahead = getDataset(dataDayahead);

  // Add estimate to datasets
  let consumption = [];
  for (let i = 0; i < 24; i++) {
    consumption.push("0");
  }
  chartDataToday.datasets.push({
    name: "Consumption (kW/h)",
    values: consumption,
    chartType: "bar",
  });
  chartDataDayahead.datasets.push({
    name: "Consumption (kW/h)",
    values: consumption,
    chartType: "bar",
  });

  console.log(chartDataToday); // Debug

  // Configure chart
  chart = new frappe.Chart("#chart", {
    data: chartDataToday,
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
    barOptions: {},
  });
};

const updateChart = () => {
  // ELECTRICITY PRICES
  // Select data day
  let tempChartData = structuredClone(chartDataToday);
  if (daySelector2.checked) {
    tempChartData = structuredClone(chartDataDayahead);
  }

  // Select VAT
  let indexVAT = 1;
  if (includeVATbox.checked) {
    indexVAT = 1.24;
  }

  // Calculate new values
  let values = tempChartData.datasets[0].values;
  values.forEach((value, index) => {
    values[index] = (Number(value) * indexVAT).toFixed(2);
  });
  tempChartData.datasets[0].values = values;

  // Update chart
  updateConsumptionChart();
};

const updateConsumptionChart = () => {
  // Select data day
  let tempChartData = chartDataToday;
  if (daySelector2.checked) {
    tempChartData = chartDataDayahead;
  }

  // Get action data
  let action = document.getElementById("action-select");
  let startTime = document.getElementById("startTime").value;
  let endTime = document.getElementById("endTime").value;

  // Parse time
  let startTimeDate = new Date("2019-01-01T" + startTime + ":00.000+00:00");
  let endTimeDate = new Date("2019-01-01T" + endTime + ":00.000+00:00");
  if (startTimeDate >= endTimeDate) {
    console.log("Not possible!");
    return;
  }

  // Calculate new values
  calculateConsumptionPrices(
    tempChartData,
    action[action[action.selectedIndex].id].value,
    startTimeDate,
    endTimeDate,
    true
  );

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

  // Update chart
  chart.update(tempChartData);

  // Update total consumption price
  updateTotalPrice();
};

const updateTotalPrice = () => {
  // Select data day
  let tempChartData = chartDataToday;
  if (daySelector2.checked) {
    tempChartData = chartDataDayahead;
  }

  // Calculate electricity consumption total price
  let totalPrice = 0;
  let prices = tempChartData.datasets[0].values;
  let consumptions = tempChartData.datasets[1].values;
  prices.forEach((value, index) => {
    totalPrice += Number(((value * consumptions[index]) / 100).toFixed(2));
  });

  // Update consumption price
  let consumptionLable = document.getElementById("consumption-price");
  consumptionLable.innerText = totalPrice + "€";
  return;
};

const calculateConsumptionPrices = (
  tempChartData,
  action,
  startTimeDate,
  endTimeDate,
  isAdded
) => {
  // Declare needed variables
  let i = 0;
  let newConsumptionPrices = [];
  for (let i = 0; i < 24; i++) {
    newConsumptionPrices.push("0");
  }

  // Calculate start minutes (NOT IMPLEMENTED YET)
  /*
  if (startTimeDate.getMinutes() != 0) {
    startTimeDate.setHours(startTimeDate.getUTCHours() + 1);
    console.log("start minutes " + (60 - startTimeDate.getMinutes())); // DEbug
    startTimeDate.setMinutes(0);
    console.log("updated " + startTimeDate.toTimeString()); // DEbug
  }
  */

  while (i <= 30) {
    // End if no full hours left
    if (startTimeDate >= endTimeDate) {
      break;
    }

    // Calculate hour cost
    console.log("Alkava tunti: " + (startTimeDate.getHours() - 2));
    newConsumptionPrices[startTimeDate.getHours() - 3] = 5; // FIX!!!!

    // Iterate
    startTimeDate.setHours(startTimeDate.getHours() + 1);
    console.log(
      "added one! " +
        startTimeDate.toTimeString() +
        " to " +
        startTimeDate.getUTCHours() +
        " index:" +
        i
    ); // DEbug

    ++i;
    console.log(i); // Debug
  }

  // Calculate end minutes  (NOT IMPLEMENTED YET)
  /*
  if (endTimeDate.getMinutes() != 0) {
    console.log("last minutes " + endTimeDate.getMinutes()); // DEbug
  }
  */

  // Store values for later use
  let actionValue = action;
  if (isAdded) {
    savedActions.push({
      actionValue: actionValue.toString(),
      startTime: startTimeDate.toString(),
      endTime: endTimeDate,
    });
  }

  console.log(savedActions); // Debug

  // Calculate new consumption values to existing values
  let oldConsumption = tempChartData.datasets[1].values;
  if (isAdded) {
    oldConsumption.forEach((value, index) => {
      oldConsumption[index] =
        Number(oldConsumption[index]) + Number(newConsumptionPrices[index]);
    });
  } else {
    oldConsumption.forEach((value, index) => {
      oldConsumption[index] =
        Number(oldConsumption[index]) - Number(newConsumptionPrices[index]);
    });
  }
  // Update both datasets
  chartDataToday.datasets[1].values = oldConsumption;
  chartDataDayahead.datasets[1].values = oldConsumption;
  console.log(tempChartData.datasets[1].values); // Debug
};

const removeListItem = (event) => {
  console.log("hahahahaaaaaaa " + event.target.id); // Debug
  // Select data day
  let tempChartData = chartDataToday;
  if (daySelector2.checked) {
    tempChartData = chartDataDayahead;
  }

  // Recalculate total consumption price
  console.log(
    savedActions[event.target.id].actionValue +
      " " +
      savedActions[event.target.id].startTime +
      "--" +
      savedActions[event.target.id].endTime
  ); // Debug
  calculateConsumptionPrices(
    savedActions[event.target.id].actionValue,
    new Date(savedActions[event.target.id].startTim),
    new Date(savedActions[event.target.id].endTime),
    false
  );

  // Remove list item
  let list = document.getElementById("action-list");
  list.removeChild(document.getElementById(event.target.id));
};

buildChart();
