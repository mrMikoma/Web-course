const dataTable = document.getElementById("stats-body");

fetchMunicipalityData();
//fetchEmploymentData();

async function fetchMunicipalityData() {
  // Fetch data
  const dataMuniPromise = await fetch(
    "https://statfin.stat.fi/PxWeb/sq/4e244893-7761-4c4f-8e55-7a8d41d86eff"
  );
  const dataMuniJSON = await dataMuniPromise.json();
  const dataEmpPromise = await fetch(
    "https://statfin.stat.fi/PxWeb/sq/5e288b40-f8c8-4f1e-b3b0-61b86ce5c065"
  );
  const dataEmpJSON = await dataEmpPromise.json();
  let i = 0;

  // Display data on html
  Object.entries(dataMuniJSON.dataset.dimension.Alue.category.label).forEach(
    (municipality) => {
      let population = dataMuniJSON.dataset.value[i];
      let employmentAmount = dataEmpJSON.dataset.value[i];
      let employmentPercentage = ((employmentAmount / population)*100).toFixed(2);
      //console.log(municipality[1] + " " + population + " " + employmentAmount); // debug

      // Create new elements
      let tr = document.createElement("tr");
      let td1 = document.createElement("td");
      let td2 = document.createElement("td");
      let td3 = document.createElement("td");
      let td4 = document.createElement("td");

      // Append data
      td1.innerText = municipality[1];
      td2.innerText = population;
      td3.innerText = employmentAmount;
      td4.innerText = employmentPercentage + "%";
      tr.appendChild(td1);
      tr.appendChild(td2);
      tr.appendChild(td3);
      tr.appendChild(td4);
      dataTable.appendChild(tr);

      // Style data row
      if (i % 2 != 0) {
        tr.className = "even-datarow";
      } else {
        tr.className = "odd-datarow";
      }
      
      if (employmentPercentage > 45) {
        tr.className = "over45-datarow"
      } else if (employmentPercentage < 25) {
        tr.className = "under25-datarow"
      }
      

      i++;
    }
  );
}
