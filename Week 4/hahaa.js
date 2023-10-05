const searchButton = document.getElementById("submit-data");

searchButton.addEventListener("click", (event) => {
  const searchInput = document.getElementById("input-show");
  fetchData(searchInput.value);
  event.preventDefault();
});

async function fetchData(showName) {
  // Fetch show data
  const dataShowPromise = await fetch(
    "https://api.tvmaze.com/search/shows?q=" + showName
  );
  const dataShowJSON = await dataShowPromise.json();

  // Clear div show-container
  let showDisplay = document.getElementById("show-container");
  showDisplay.innerHTML = ""

  // Handle datai
  Object.entries(dataShowJSON).forEach((entry) => {
    const [key, value] = entry;

    // Display data
    // Create elements

    let showDataDiv = document.createElement("div");
    showDataDiv.className = "show-data";
    let showImage = document.createElement("img");
    showImage.src = value.show.image != null ? value.show.image.medium : ""; // give img source
    let showInfoDiv = document.createElement("div");
    showInfoDiv.className = "show-info";
    let showTitle = document.createElement("h1");
    showTitle.innerText = value.show.name; // give show title
    let showParag = document.createElement("p");
    showParag.innerHTML = value.show.summary; // give show summary

    // Add to page
    showInfoDiv.appendChild(showTitle);
    showInfoDiv.appendChild(showParag);
    showDataDiv.appendChild(showImage);
    showDataDiv.appendChild(showInfoDiv);
    showDisplay.appendChild(showDataDiv);
  });
}
