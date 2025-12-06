import { getProducts } from "./apis.js";

let allProducts = {};

function createProductCard(productName, product) {
  const card = document.createElement("div");
  card.className = "product-card";
  card.setAttribute("onclick", "selectCategory(this)");
  card.setAttribute("data-title", productName || "No Title");
  card.setAttribute("data-image", product.image_url || product.image || "");

  const imageUrl = product.image_url || product.image || "placeholder.jpg";
  const productTitle =
    product.product_title || productName || "Unnamed Product";

  card.innerHTML = `
    <img src="${imageUrl}" alt="${productTitle}" loading="lazy" />
    <div class="product-card-body">
      <p class="product-card-title">${productTitle}</p>
    </div>
  `;

  return card;
}

function displayProducts(products) {
  const container = document.getElementById("product-container");
  container.innerHTML = ''; // Clear previous content

  if (Object.keys(products).length === 0) {
    container.innerHTML ='<p style="text-align: center; color: #999; grid-column: 1 / -1;">No products found.</p>';
    return;
  }

  for (const productName in products) {
    const product = products[productName];
    const card = createProductCard(productName, product);
    container.appendChild(card);
  }
}


// function displayProducts(products) {
//   const productsContainer = document.getElementById('products-container'); // Assuming 'products-container' is the ID of your target element
  
//   if (productsContainer) { // Check if the element was successfully found
//     let html = '';
//     products.forEach(product => {
//       html += `<div>${product.name}</div>`;
//     });
//     productsContainer.innerHTML = html;
//   } else {
//     console.error('Error: Could not find the products container element with ID "products-container".');
//   }
// }


function filterProducts(searchTerm) {
  if (!searchTerm.trim()) {
    displayProducts(allProducts);
    return;
  }

  const filtered = {};
  const searchLower = searchTerm.toLowerCase();

  for (const productName in allProducts) {
    const product = allProducts[productName];
    const productTitle = (
      product.product_title ||
      productName ||
      ""
    ).toLowerCase();

    if (
      productTitle.includes(searchLower) ||
      productName.toLowerCase().includes(searchLower)
    ) {
      filtered[productName] = product;
    }
  }

  displayProducts(filtered);
}

// function loadProducts() {
//   getProducts()
//     .then((products) => {
//       console.log(products);
//       allProducts = products;
//       displayProducts(products);
//     })
//     .catch((error) => {
//       console.error("Error loading products:", error);
//       const container = document.getElementById("product-container");
//       container.innerHTML = '<p style="text-align: center; color: #999;">Failed to load products. Please try again later.</p>';
//     });
// }

function loadProducts() {
  getProducts()
    .then((products) => {
      console.log(products);
      allProducts = products;
      displayProducts(products);
    })
    .catch((error) => {
      console.error("Error loading products:", error);
      const container = document.getElementById("product-container");
      if (container) { // Add this check
        container.innerHTML = '<p style="text-align: center; color: #999;">Failed to load products. Please try again later.</p>';
      } else {
        console.error("Error: Could not find element with ID 'product-container' to display error message.");
      }
    });
}


document.addEventListener("DOMContentLoaded", () => {
  loadProducts();

  // Search functionality
  const searchInput = document.getElementById("search-input");
  const searchButton = document.querySelector(".search-button");

  if (searchInput && searchButton) {
    searchButton.addEventListener("click", () => {
      filterProducts(searchInput.value);
    });

    searchInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        filterProducts(searchInput.value);
      }
    });

    searchInput.addEventListener("input", (e) => {
      if (e.target.value.trim() === "") {
        displayProducts(allProducts);
      }
    });
  }
});
