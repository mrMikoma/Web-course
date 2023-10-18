/* 
Used documentation:
- https://frappe.io/charts/docs

*/

let chart = "";
let chartDataToday = "";
let chartDataDayahead = "";

// Add dayselector 1
const daySelector1 = document.getElementById("btnradio1");
daySelector1.addEventListener("click", (event) => {
  console.log("Day 1 selected!"); // Debug
  updateChart();
});

// Add dayselector 1
const daySelector2 = document.getElementById("btnradio2");
daySelector2.addEventListener("click", (event) => {
  console.log("Day 2 selected!"); // Debug
  updateChart();
});

// Add checkbox
const includeVATbox = document.getElementById("vat-box");
includeVATbox.addEventListener("click", (event) => {
  //event.preventDefault();
});

// Add update data button
const updateButton = document.getElementById("update-data");
updateButton.addEventListener("click", () => {
  buildChart();
});

/*
// Add estimate button
const estimateButton = document.getElementById("add-data");
estimateButton.addEventListener("click", () => {
  addData();
});
*/

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

    // Parse price
    if (includeVATbox.checked) {
      console.log("hahaa");
      values.push((Number(price.price) * 1.24).toFixed(2));
    } else {
      values.push((Number(price.price) / 10).toFixed(2));
    }
  });
  let dataset = [{ name: "asd", values: values }];

  chartData = {
    labels: labels,
    datasets: dataset,
  };

  return chartData;
};

const buildChart = async () => {
  //  Get data
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
    colors: ["#eb5146"],
  });
};

const updateChart = async () => {
  if (daySelector2.checked) {
    chart.update(chartDataDayahead);
  } else {
    chart.update(chartDataToday);
  }
};

buildChart();
