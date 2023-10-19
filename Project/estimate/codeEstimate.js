/* 
Used documentation:
- https://frappe.io/charts/docs
- https://getbootstrap.com/docs/5.2/getting-started/introduction/

*/

let chart = "";
let chartDataToday = "";
let chartDataDayahead = "";

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

const getData = async (source) => {
  const res = await fetch(source);
  const data = await res.json();
  return data;
};

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

  // Add estimate dataset
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

  console.log(startTime); // dEBUG
  console.log(endTime); // dEBUG

  // Parse time
  let startTimeDate = new Date("2019-01-01T" + startTime + ":00.000+00:00");
  let endTimeDate = new Date("2019-01-01T" + endTime + ":00.000+00:00");
  if (startTimeDate >= endTimeDate) {
    console.log("Not possible!");
    return;
  }

  // Calculate start minutes
  if (startTimeDate.getMinutes() != 0) {
    startTimeDate.setHours(startTimeDate.getUTCHours() + 1);
    console.log("start minutes " + (60 - startTimeDate.getMinutes())); // DEbug
    startTimeDate.setMinutes(0);
    console.log("updated " + startTimeDate.toTimeString()); // DEbug
  }

  // Calculate new hourly consumption price (NOT IMPLEMENTED YET)
  let i = 0;
  let newConsumptionPrices = [];
  for (let i = 0; i < 24; i++) {
    newConsumptionPrices.push("0");
  }

  while (i <= 30) {
    // End if no full hours left
    if (startTimeDate >= endTimeDate) {
      break;
    }

    // Calculate hour cost
    console.log("Alkava tunti: " + (startTimeDate.getHours() - 2));
    newConsumptionPrices[startTimeDate.getHours() - 3] = 5;

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
  if (endTimeDate.getMinutes() != 0) {
    console.log("last minutes " + endTimeDate.getMinutes()); // DEbug
  }

  // Add new consumption values to existing values
  let oldConsumption = tempChartData.datasets[1].values;
  oldConsumption.forEach((value, index) => {
    oldConsumption[index] =
      Number(oldConsumption[index]) + Number(newConsumptionPrices[index]);
  });
  // Update both datasets
  chartDataToday.datasets[1].values = oldConsumption;
  chartDataDayahead.datasets[1].values = oldConsumption;
  console.log(tempChartData.datasets[1].values); // Debug

  // Add new item to list
  let node = document.createElement("li");
  node.appendChild(
    document.createTextNode(
      action[action[action.selectedIndex].id].textContent +
        " " +
        startTime +
        "-" +
        endTime
    )
  );
  node.className = "list-group-item";

  document.getElementById("action-list").appendChild(node);

  console.log("LOL: " + newConsumptionPrices); // dEBUG

  // Update chart
  chart.update(tempChartData);
  
  // Calculate electricity consumption price
  let totalPrice = 0;
  let prices = tempChartData.datasets[0].values;
  let consumptions = tempChartData.datasets[1].values;
  prices.forEach((value, index) => {
    totalPrice += Number(((value * consumptions[index]) / 100).toFixed(2));
  });

  // Update consumption price
  let consumptionLable = document.getElementById("consumption-price");
  consumptionLable.innerText = totalPrice + "€";
  
};

buildChart();
