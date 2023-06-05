import { productsData } from "./products.js";

const showModalBtn = document.querySelector(".show-modal");
const closeModalBtn = document.querySelector(".close-modal");
const modal = document.querySelector(".modal");
const backDrop = document.querySelector(".backdrop");
const productsDom = document.querySelector(".product-center");
class Products {
  getProducts() {
    return productsData;
  }
}

class Ui {
  displayProducts(products) {
    let result = "";
    products.forEach((element) => {
      result += `
     <section class="product">
            <div class="image-container">
              <img class="product-img" src=${element.image} alt="product-img" />
            </div>
            <div class="product-desc">
              <p class="product-title">${element.title}</p>
              <p class="product-price">${element.price} $</p>
            </div>
            <button class="add-to-cart" data-id=${element.id}>add to cart</button>
          </section>
    `;
      productsDom.innerHTML = result;
    });
  }
}

class Storage {
  static saveProducts(products) {
    localStorage.setItem("products", JSON.stringify(products));
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const products = new Products();
  const productsData = products.getProducts();

  const ui = new Ui();
  ui.displayProducts(productsData);
  Storage.saveProducts(productsData);
});

showModalBtn.addEventListener("click", showModal);
closeModalBtn.addEventListener("click", closeModal);
backDrop.addEventListener("click", closeModal);

function showModal() {
  modal.classList.remove("hidden");
  backDrop.classList.remove("hidden");
}
function closeModal() {
  modal.classList.add("hidden");
  backDrop.classList.add("hidden");
}
