/* 
Used documentation:
- https://frappe.io/charts/docs
- https://getbootstrap.com/docs/5.2/getting-started/introduction/

*/

import * as spot from "./spot/spot.js";

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
  let dataset = [{ name: "Hour price (cents/kWh)", values: values }];

  let chartData = {
    labels: labels,
    datasets: dataset,
  };

  // TEST
  spot.hehe()

  return chartData;
};

const buildChart = async () => {
  // Get data
  const sourceToday = "day-prices.json";
  const sourceDayahead = "day-prices-dayahead.json";
  const dataToday = await getData(sourceToday);
  const dataDayahead = await getData(sourceDayahead);

  // Parse datasets
  chartDataToday = getDataset(dataToday);
  chartDataDayahead = getDataset(dataDayahead);

  // Configure chart
  chart = new frappe.Chart("#chart", {
    data: chartDataToday,
    title: "Electricity prices",
    type: "line",
    height: 450,
    colors: ['red'],
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

const updateChart = () => {
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
  chart.update(tempChartData);
};

buildChart();
