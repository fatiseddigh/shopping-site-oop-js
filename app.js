import { productsData } from "./products.js";

const showModalBtn = document.querySelector(".show-modal");
const closeModalBtn = document.querySelector(".close-modal");
const modal = document.querySelector(".modal");
const backDrop = document.querySelector(".backdrop");

const productsDom = document.querySelector(".product-center");
const cartBadge = document.querySelector(".cart-badge");
const cartTotalPrice = document.querySelector(".modal__footer__total");

let carts = [];
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
  getAddToCartBtn() {
    const addToCartBtn = document.querySelectorAll(".add-to-cart");
    const buttons = [...addToCartBtn];
    buttons.forEach((btn) => {
      const btnId = btn.dataset.id;
      const IsInCart = carts.find((product) => product.id === btnId);
      if (IsInCart) {
        btn.innerText = "In Cart";
        btn.disabled = "true";
      }

      btn.addEventListener("click", (e) => {
        btn.innerText = "In Cart";
        btn.disabled = "true";
        // get product from products
        const addProduct = Storage.getProducts(btnId);
        // add to cart
        carts = [...carts, { ...addProduct, quantity: 1 }];
        // save cart to localStorage
        Storage.saveCart(carts);
        // update cart value
        // add to cart item
        this.setCartValue(carts);
      });
    });
  }
  setCartValue(cart) {
    let tempCartItem = 0;
    const totalPrice = cart.reduce((acc, cur) => {
      tempCartItem += cur.quantity;

      return acc + cur.quantity * cur.price;
    }, 0);
    cartBadge.innerText = tempCartItem;
    cartTotalPrice.innerText = `${totalPrice.toFixed(2)} $`;
  }
}

class Storage {
  static saveProducts(products) {
    localStorage.setItem("products", JSON.stringify(products));
  }
  static getProducts(id) {
    const _product = JSON.parse(localStorage.getItem("products"));
    return _product.find((p) => p.id == parseInt(id));
  }
  static saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const products = new Products();
  const productsData = products.getProducts();

  const ui = new Ui();
  ui.displayProducts(productsData);
  ui.getAddToCartBtn();
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
