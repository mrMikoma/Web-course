// --- DECLARING VARIABLES ---
// Global variables

// Declaring datasets
let chartDataToday = "";
let chartDataDayahead = "";

// Declaring consumption actions
let currentActions = {};
let currentConsumption = [];

// --- EXTERNAL FUNCTIONS ---
// Initial declaration of datasets
export const initializeDatasets = async (todaySrc, dayaheadSrc) => {
  // Get data
  const dataToday = await getData(todaySrc);
  const dataDayahead = await getData(dayaheadSrc);

  // Parse spot datasets
  chartDataToday = getDataset(dataToday);
  chartDataDayahead = getDataset(dataDayahead);

  // Declare null estimates to datasets
  for (let i = 0; i < 24; i++) {
    currentConsumption.push("0");
  }
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
    chartData.datasets.push({
      name: "Price (cents)",
      values: structuredClone(currentConsumption),
      chartType: "bar",
    });
  }

  // Add VAT to data
  if (includeVAT) {
    chartData.datasets[0].values.forEach((value, index) => {
      chartData.datasets[0].values[index] = (Number(value) + 2.24).toFixed(2);
    });
    if (includeConsumption) {
      chartData.datasets[1].values.forEach((value, index) => {
        if (value != 0) {
          let hourConsumption = chartData.datasets[1].values[index] / chartData.datasets[0].values[index];
          chartData.datasets[1].values[index] = (
            Number(value) +
            hourConsumption * 2.24
          ).toFixed(2);
        }
      });
    }
  }

  // Add axis limits
  let topLimit = Math.max(...chartData.datasets[0].values);
  let bottomLimit = Math.min(...chartData.datasets[0].values);
  if (includeConsumption && bottomLimit > 0) {
    bottomLimit = 0;
  }
  Object.assign(chartData, {
    yRegions: [{ label: "", start: bottomLimit, end: topLimit }],
  });

  return chartData;
};

// Add new estimate for consumption
export const addEstimateAction = (
  arrayIndex,
  actionValue,
  startTime,
  endTime,
  isToday
) => {
  // Parse data
  let startTimeDate = new Date("2019-01-01T" + startTime + ":00.000+00:00");
  let endTimeDate = new Date("2019-01-01T" + endTime + ":00.000+00:00");
  if (startTimeDate >= endTimeDate) {
    console.log("Not possible!");
    return;
  }

  // CALCULATE NEW ESTIMATES
  // Declare needed variables
  let i = 0;
  let newConsumptionPrices = [];
  for (let i = 0; i < 24; i++) {
    newConsumptionPrices.push("0");
  }
  // Declare correct day
  let chartData = chartDataToday;
  if (!isToday) {
    chartData = chartDataDayahead;
  }
  let hourlyPrices = chartData.datasets[0].values;

  // Calculate start minutes
  if (startTimeDate.getMinutes() != 0) {
    // Calculate estimate for minutes
    newConsumptionPrices[startTimeDate.getHours() - 3] =
      hourlyPrices[startTimeDate.getHours() - 3] *
      ((60 - startTimeDate.getMinutes()) / 60) *
      actionValue;

    // Iterate time
    startTimeDate.setHours(startTimeDate.getHours() + 1);
    startTimeDate.setMinutes(0);
  }

  // Calculate full hours
  while (i <= 30) {
    // End if no full hours left
    if (startTimeDate >= endTimeDate) {
      break;
    }

    // Calculate hour cost
    newConsumptionPrices[startTimeDate.getHours() - 3] =
      hourlyPrices[startTimeDate.getHours() - 3] * actionValue;

    // Iterate time
    startTimeDate.setHours(startTimeDate.getHours() + 1);
    ++i;
  }

  // Calculate end minutes
  if (endTimeDate.getMinutes() != 0) {
    console.log("last minutes " + endTimeDate.getMinutes()); // DEbug
    // Calculate estimate for minutes
    newConsumptionPrices[startTimeDate.getHours() - 3] =
      hourlyPrices[startTimeDate.getHours() - 3] *
      (endTimeDate.getMinutes() / 60) *
      actionValue;
  }

  // Store values for later use
  currentActions[arrayIndex] = {
    hourlyConsumption: newConsumptionPrices,
  };

  // Calculate new consumption values to existing values
  let oldConsumption = currentConsumption;
  oldConsumption.forEach((value, index) => {
    oldConsumption[index] =
      Number(oldConsumption[index]) + Number(newConsumptionPrices[index]);
  });

  // Update global variables
  currentConsumption = oldConsumption;
};

export const removeEstimateAction = (listID) => {
  // Check if action already exists
  if (currentActions[listID] === undefined) {
    return "Undefined value!";
  }

  // Calculate new consumption values to existing values
  let removedConsumption = currentActions[listID].hourlyConsumption;
  currentConsumption.forEach((value, index) => {
    currentConsumption[index] =
      Number(currentConsumption[index]) - Number(removedConsumption[index]);
  });

  // Remove consumption from list
  delete currentActions[listID];
};

export const calculateTotalConsumptionPrice = (isToday, includeVAT) => {
  // Get correct dataset
  let chartData = structuredClone(getChartDataset(isToday, true, includeVAT));
  let consumption = chartData.datasets[1].values;

  // Calculate total price
  let totalPrice = 0;
  consumption.forEach((value, index) => {
    totalPrice += Number(value);
  });
  return (totalPrice / 100).toFixed(2);
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
