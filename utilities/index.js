const { getClassifications } = require("../models/inventory-model");

// ✅ Build the nav bar
function buildNav(classifications) {
  let nav = `<ul>`;
  nav += `<li><a href="/" title="Home page">Home</a></li>`;
  classifications.forEach((classification) => {
    nav += `<li><a href="/inv/type/${classification.classification_name.toLowerCase()}" title="See our inventory of ${
      classification.classification_name
    } vehicles">${classification.classification_name}</a></li>`;
  });
  nav += `</ul>`;
  return nav;
}

// ✅ Get nav bar from DB
async function getNav() {
  try {
    const classifications = await getClassifications();
    return buildNav(classifications);
  } catch (error) {
    console.error("getNav error:", error);
    return buildNav([]); // fallback
  }
}

// ✅ Grid of vehicles by classification
function buildClassificationGrid(data) {
  let grid = "<ul id='inv-display'>";
  data.forEach((vehicle) => {
    const name = `${vehicle.inv_make} ${vehicle.inv_model}`;
    // Fallback image if thumbnail missing or empty
    const thumb =
      vehicle.inv_thumbnail && vehicle.inv_thumbnail.trim() !== ""
        ? vehicle.inv_thumbnail
        : "/images/vehicles/no-image.jpg";
    grid += `
      <li>
        <a href="/inv/detail/${vehicle.inv_id}" title="View ${name} details">
          <img src="${thumb}" alt="${name} - Thumbnail" onerror="this.onerror=null;this.src='/images/vehicles/no-image.jpg';">
        </a>
        <div class="namePrice">
          <hr>
          <h2>
            <a href="/inv/detail/${
              vehicle.inv_id
            }" title="View ${name} details">
              ${name}
            </a>
          </h2>
          <span>$${vehicle.inv_price.toLocaleString()}</span>
        </div>
      </li>`;
  });
  grid += "</ul>";
  return grid;
}

// ✅ Vehicle detail section
function buildVehicleDetail(vehicle) {
  const name = `${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model}`;
  const image =
    vehicle.inv_image && vehicle.inv_image.trim() !== ""
      ? vehicle.inv_image
      : "/images/vehicles/no-image.jpg";
  return `
    <section class="vehicle-detail-container">
      <img class="vehicle-img" src="${image}" alt="${name}" onerror="this.onerror=null;this.src='/images/vehicles/no-image.jpg';">
      <div class="vehicle-detail-info">
        <h2>${name}</h2>
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
