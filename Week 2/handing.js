// Submit button
submitButton = document.getElementById("submit-data");

submitButton.addEventListener("click", () => {
  // Gather data from input fields
  let usernameInput = document.getElementById("input-username");
  let emailInput = document.getElementById("input-email");
  let adminInput = document.getElementById("input-admin");

  // Check user input for empty input
  if (usernameInput.value == "" || emailInput.value == "") {
    console.log("No empty field!");
    return;
  }

  // Handle image upload if file given
  let file = document.getElementById("input-image").files[0];
  let imageSrc = "";
  if (file) {
    // Save image
    imageSrc = URL.createObjectURL(file);
  }

  // Check if username already exists
  let userTBody = document.getElementById("user-tbody");
  let trs = userTBody.querySelectorAll("tr");

  for (let i = 0; i < trs.length; i++) {
    // If given username exists, add to existing row
    if (
      trs[i].querySelector("[name='username']").innerHTML ===
      usernameInput.value
    ) {
      trs[i].querySelector("[name='email']").innerHTML = emailInput.value;
      trs[i].querySelector("[name='admin']").innerHTML =
        adminInput.checked == true ? adminInput.value : "-";

      // Add image source if given
      if (imageSrc != "") {
        temp_image_tag = trs[i]
          .querySelector("[name='image']")
          .getElementsByTagName("img")[0];
        temp_image_tag.setAttribute("src", imageSrc);
        temp_image_tag.setAttribute("height", "64");
        temp_image_tag.setAttribute("width", "64");
      }

      return;
    }
  }

  // Create new tags to the table (tbody)
  tr = document.createElement("tr");

  td_username = document.createElement("td");
  td_username.setAttribute("name", "username");

  td_email = document.createElement("td");
  td_email.setAttribute("name", "email");

  td_admin = document.createElement("td");
  td_admin.setAttribute("name", "admin");

  td_image = document.createElement("td");
  td_image.setAttribute("name", "image");
  td_image.setAttribute("height", "64");
  td_image.setAttribute("width", "64");

  image_tag = document.createElement("img");
  image_tag.setAttribute("alt", "no image");
  image_tag.setAttribute("height", "64");
  image_tag.setAttribute("width", "64");

  // Add image source if given
  if (imageSrc != "") {
    image_tag.setAttribute("src", imageSrc);
  }

  // Append new tags to the table
  td_username.appendChild(document.createTextNode(usernameInput.value));
  td_email.appendChild(document.createTextNode(emailInput.value));
  td_admin.appendChild(
    document.createTextNode(adminInput.checked == true ? adminInput.value : "-")
  );
  td_image.appendChild(image_tag);

  tr.appendChild(td_username);
  tr.appendChild(td_email);
  tr.appendChild(td_admin);
  tr.appendChild(td_image);

  userTBody.appendChild(tr);
});

// Clear button
clearButton = document.getElementById("empty-table");

clearButton.addEventListener("click", () => {
  let userTBody = document.getElementById("user-tbody");

  while (userTBody.hasChildNodes()) {
    userTBody.removeChild(userTBody.firstChild);
  }
});
