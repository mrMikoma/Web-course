const fetchData = async () => {
  // Declaring variables
  const urlGeoJSON =
    "https://geo.stat.fi/geoserver/wfs?service=WFS&version=2.0.0&request=GetFeature&typeName=tilastointialueet:kunta4500k&outputFormat=json&srsName=EPSG:4326";
  const urlPositive =
    "https://statfin.stat.fi/PxWeb/sq/4bb2c735-1dc3-4c5e-bde7-2165df85e65f";
  const urlNegative =
    "https://statfin.stat.fi/PxWeb/sq/944493ca-ea4d-4fd9-a75c-4975192f7b6e";

  // Fetching data
  const res1 = await fetch(urlGeoJSON);
  const dataGeoJSON = await res1.json();
  const res2 = await fetch(urlPositive);
  dataPosMigration = await res2.json();
  const res3 = await fetch(urlNegative);
  dataNegMigration = await res3.json();

  initMap(dataGeoJSON);
};

const initMap = (dataGeoJSON) => {
  // Create map with geoJSON data
  let map = L.map("map", {
    minZoom: -3,
  });

  let geoJson = L.geoJSON(dataGeoJSON, {
    onEachFeature: getFeature,
    style: getStyle,
    weight: 2,
  }).addTo(map);

  // Add openstreetmap background
  let osm = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: "© OpenStreetMap",
  }).addTo(map);

  // Fit map to geoJSON bounds
  map.fitBounds(geoJson.getBounds());
};

// JSONs for migration data
let dataPosMigration = "";
let dataNegMigration = "";

const getFeature = (feature, layer) => {
  // Get municipality ID and name for matching data in migration data
  if (!feature.properties.nimi) return;
  const municipalityJSONID = "KU" + feature.properties.kunta;
  const municipalityName = feature.properties.nimi;

  // Tool tip for municipality name
  layer.bindTooltip(municipalityName).openTooltip();

  // Migration values
  let matchID = dataPosMigration.dataset.dimension.Tuloalue.category.index;
  let id = matchID[municipalityJSONID];
  let posMigration = dataPosMigration.dataset.value[id];
  let negMigration = dataNegMigration.dataset.value[id];

  // Add pop up or municipality data about migration
  layer
    .bindPopup(
      `<ul>
            <li>Municipality: ${municipalityName}</li>
            <li>Positive migration: ${posMigration}</li>
            <li>Negative migration: ${negMigration}</li>
        </ul>`
    )
    .openPopup();
};

const getStyle = (feature) => {
  // Get municipality for matching data in migration data
  if (!feature.properties.nimi) return;
  const municipalityJSONID = "KU" + feature.properties.kunta;

  // Migration values
  let matchID = dataPosMigration.dataset.dimension.Tuloalue.category.index;
  let id = matchID[municipalityJSONID];
  let posMigration = dataPosMigration.dataset.value[id];
  let negMigration = dataNegMigration.dataset.value[id];

  // Calculate hue value
  let hueValue = Math.pow(posMigration / negMigration, 3) * 60;
  if (hueValue > 120) {
    hueValue = 120;
  }
  console.log(hueValue); // Debug
  let muniColor = "#00ff00";
  //hsl(hueValue, 75, 50);      // Does not work!!!

  return {
    color: muniColor,
  };
};

fetchData();
