
// --- DECLARING VARIABLES ---
// Declaring datasets
let chartDataToday = "";
let chartDataDayahead = "";

// Declaring consumption actions
let currentActions = "";
let currentConsumption = "";

// --- EXTERNAL FUNCTIONS ---
// Initial declaration of datasets
export const initializeDatasets = async (isToday, includeVAT) => {
  // Get data
  const sourceToday = "day-prices.json";
  const sourceDayahead = "day-prices-dayahead.json";
  const dataToday = await getData(sourceToday);
  const dataDayahead = await getData(sourceDayahead);

  // Parse datasets
  chartDataToday = getDataset(dataToday);
  chartDataDayahead = getDataset(dataDayahead);
};

// Get correct dataset
export const getChartDataset = (isToday, includeConsumption, includeVAT) => {
  // Declare correct day
  let chartData = structuredClone(chartDataToday);
  if (!isToday) {
    chartData = structuredClone(chartDataDayahead);
  }

  // Add consumption data
  if (includeConsumption) {
    console.log("tba"); // Debug
  }

  // Add VAT to data
  if (includeVAT) {
    console.log("tba"); // Debug
    let values = chartData.datasets[0].values;
    values.forEach((value, index) => {
      values[index] = (Number(value) * 1.24).toFixed(2);
    });
    chartData.datasets[0].values = values;
  }

  return chartData;
};

// --- INTERNAL FUNCTIONS ---
// Get data from source
const getData = async (source) => {
  const res = await fetch(source);
  const data = await res.json();
  return data;
};

// Parse dataset
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

  return chartData;
};

// Test function
export const hehe = () => {
  console.log("HEEHEHEE HAISTA PASKA"); // Debug
};
