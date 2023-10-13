let chart = "";
let regions = "";
let labels = "";
let populations = "";

// Add submit button
const submitButton = document.getElementById("submit-data");
submitButton.addEventListener("click", () => {
  buildChart();
});

// Add estimate button
const estimateButton = document.getElementById("add-data");
estimateButton.addEventListener("click", () => {
  addData();
});

const getData = async (municipalityID) => {
  const url =
    "https://statfin.stat.fi/PxWeb/api/v1/en/StatFin/synt/statfin_synt_pxt_12dy.px";

  const res = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(getJSONquery(municipalityID)),
  });
  if (!res.ok) {
    return;
  }
  const data = await res.json();

  return data;
};

const buildChart = async () => {
  // Get municipality ID
  let municipalityID = await getMunicipalityID();

  //  Get data
  const data = await getData(municipalityID);

  // Parse data
  regions = Object.values(data.dimension.Alue.category.label);
  labels = Object.values(data.dimension.Vuosi.category.label);
  populations = data.value;

  // Handle data
  regions.forEach((region, index) => {
    let regionPopulation = [];

    for (let i = 0; i < populations.lenght; i++) {
      regionPopulation.push(populations[i]);
    }

    regions[index] = {
      name: region,
      values: populations,
    };
  });

  // Configure chart
  const chartData = {
    labels: labels,
    datasets: regions,
  };

  chart = new frappe.Chart("#chart", {
    data: chartData,
    title: "Population growth",
    type: "line",
    height: 450,
    colors: ["#eb5146"],
  });
};

const getMunicipalityID = async () => {
  // Handle user input
  const inputArea = document.getElementById("input-area");
  if (
    inputArea.value.toLowerCase() == "whole country" ||
    inputArea.value == ""
  ) {
    return "SSS";
  }

  // Get municipality id data
  const url =
    "https://statfin.stat.fi/PxWeb/api/v1/en/StatFin/synt/statfin_synt_pxt_12dy.px";
  const res = await fetch(url);
  if (!res.ok) {
    return;
  }
  const data = await res.json();

  const municipalityNames = Object.values(data.variables[1].valueTexts);
  const municipalityIDs = Object.values(data.variables[1].values);

  // Search municipality id with name
  let municipalityID = "SSS";
  municipalityNames.forEach((municipalityName, index) => {
    if (municipalityName.toLowerCase() == inputArea.value.toLowerCase()) {
      municipalityID = municipalityIDs[index];
    }
  });
  return municipalityID;
};

const addData = () => {
  // Estimate new population value
  let meanDeltaSum = 0;
  for (let i = 0; i < populations.length - 1; i++) {
    meanDeltaSum += populations[i + 1] - populations[i];
  }
  let newEstimate = Math.round(
    meanDeltaSum / (populations.length - 1) +
      Number(populations[populations.length - 1])
  );

  // Add data to chart
  labels.push(Number(labels[labels.length - 1]) + 1);
  regions[0].values.push(newEstimate);
  chart.update({
    labels: labels,
    datasets: regions,
  });
};

const getJSONquery = (areaID) => {
  return {
    query: [
      {
        code: "Vuosi",
        selection: {
          filter: "item",
          values: [
            "2000",
            "2001",
            "2002",
            "2003",
            "2004",
            "2005",
            "2006",
            "2007",
            "2008",
            "2009",
            "2010",
            "2011",
            "2012",
            "2013",
            "2014",
            "2015",
            "2016",
            "2017",
            "2018",
            "2019",
            "2020",
            "2021",
          ],
        },
      },
      {
        code: "Alue",
        selection: {
          filter: "item",
          values: [areaID],
        },
      },
      {
        code: "Tiedot",
        selection: {
          filter: "item",
          values: ["vaesto"],
        },
      },
    ],
    response: {
      format: "json-stat2",
    },
  };
};

buildChart();
