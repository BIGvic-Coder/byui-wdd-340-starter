const { getClassifications } = require("../models/inventory-model"); // ✅ new import

function buildNav(classifications) {
  let nav = `<ul>`;
  nav += `<li><a href="/" title="Home page">Home</a></li>`;
  classifications.forEach((classification) => {
    nav += `<li><a href="/inventory/type/${classification.classification_name.toLowerCase()}" title="See our inventory of ${
      classification.classification_name
    } vehicles">${classification.classification_name}</a></li>`;
  });
  nav += `</ul>`;
  return nav;
}

async function getNav() {
  try {
    const classifications = await getClassifications(); // ✅ fetch from DB
    return buildNav(classifications);
  } catch (error) {
    console.error("getNav error:", error);
    return buildNav([]); // fallback to empty nav if error
  }
}

function buildClassificationGrid(data) {
  let grid = "<ul id='inv-display'>";
  data.forEach((vehicle) => {
    grid += `
      <li>
        <a href="/inventory/detail/${vehicle.inv_id}" title="View ${
      vehicle.inv_make
    } ${vehicle.inv_model} details">
          <img src="${vehicle.inv_thumbnail}" alt="Image of ${
      vehicle.inv_make
    } ${vehicle.inv_model} on CSE Motors">
        </a>
        <div class="namePrice">
          <hr>
          <h2>
            <a href="/inventory/detail/${vehicle.inv_id}" title="View ${
      vehicle.inv_make
    } ${vehicle.inv_model} details">
              ${vehicle.inv_make} ${vehicle.inv_model}
            </a>
          </h2>
          <span>$${vehicle.inv_price.toLocaleString()}</span>
        </div>
      </li>`;
  });
  grid += "</ul>";
  return grid;
}

function buildVehicleDetail(vehicle) {
  return `
    <section class="vehicle-detail-container">
      <img class="vehicle-img" src="${vehicle.inv_image}" alt="Image of ${
    vehicle.inv_make
  } ${vehicle.inv_model}">
      <div class="vehicle-detail-info">
        <h2>${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model}</h2>
        <p class="price">Price: $${vehicle.inv_price.toLocaleString()}</p>
        <p class="description">${vehicle.inv_description}</p>
        <p><strong>Color:</strong> ${vehicle.inv_color}</p>
        <p><strong>Mileage:</strong> ${parseInt(
          vehicle.inv_miles
        ).toLocaleString()} miles</p>
      </div>
    </section>
  `;
}

module.exports = {
  buildNav,
  getNav,
  buildClassificationGrid,
  buildVehicleDetail,
};
