/* 
Used documentation:
- https://frappe.io/charts/docs
- https://getbootstrap.com/docs/5.2/getting-started/introduction/

*/

import * as spot from "./spot/spot.js";

let chart = "";

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
includeVATbox.addEventListener("change", (event) => {
  updateChart();
});

// Build chart
const buildChart = async () => {
  // Initialize datasets
  await spot.initializeDatasets();

  // Configure chart
  chart = new frappe.Chart("#chart", {
    data: spot.getChartDataset(true, false, false),
    title: "Electricity prices",
    type: "line",
    height: 450,
    colors: ["red"],
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

  // Update chart
  chart.update(spot.getChartDataset(isToday, false, includeVAT));
};

buildChart();
