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

/*
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


*/
