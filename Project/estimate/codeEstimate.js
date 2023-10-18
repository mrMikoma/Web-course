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
  updateConsumptionChart(event);
};

const consumptionRanges = document.getElementById("range-wrapper");
consumptionRanges.addEventListener("change", (event) => {
  updateConsumptionChart(event);
});

const updateConsumptionChart = (event) => {
  // Select data day
  let tempChartData = chartDataToday;
  if (daySelector2.checked) {
    tempChartData = chartDataDayahead;
  }
  let elem = event.target;

  // Set new values
  let values = tempChartData.datasets[1].values;
  values[elem.id] = elem.value;

  // Update both datasets
  chartDataToday.datasets[1].values = values;
  chartDataDayahead.datasets[1].values = values;

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
