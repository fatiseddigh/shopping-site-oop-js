import { productsData } from "./products.js";

const showModalBtn = document.querySelector(".show-modal");
const closeModalBtn = document.querySelector(".close-modal");
const modal = document.querySelector(".modal");
const backDrop = document.querySelector(".backdrop");

const productsDom = document.querySelector(".product-center");
const cartBadge = document.querySelector(".cart-badge");
const cartTotalPrice = document.querySelector(".modal__footer__total");
const modalBody = document.querySelector(".modal__body");
const clearBtn = document.querySelector(".modal__footer__clear-btn");

let carts = [];
let buttonsDom = [];
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
    const addToCartBtn = [...document.querySelectorAll(".add-to-cart")];
    buttonsDom = addToCartBtn;
    addToCartBtn.forEach((btn) => {
      const btnId = btn.dataset.id;
      const IsInCart = carts.find((product) => product.id === parseInt(btnId));
      if (IsInCart) {
        btn.innerText = "In Cart";
        btn.disabled = "true";
      }

      btn.addEventListener("click", (e) => {
        btn.innerText = "In Cart";
        btn.disabled = "true";
        // get product from products
        const addedProduct = { ...Storage.getProducts(btnId), quantity: 1 };
        // add to cart
        carts = [...carts, addedProduct];
        // save cart to localStorage
        Storage.saveCart(carts);
        // update cart value
        this.setCartValue(carts);
        // add to cart item
        this.addCartItem(addedProduct);
        //get cart from storage
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

  addCartItem(cartItem) {
    const div = document.createElement("div");
    div.classList.add("modal__body__sec");
    div.innerHTML = `  <div class="modal__body__image__container">
            <img class="modal-img" src=${cartItem.image} alt="product-img" />
          </div>
          <div class="modal__body__desc">
            <p>${cartItem.title}</p>
            <p>${cartItem.price} $</p>
          </div>
          
            <div class="modal__body__icons__counts">
              <i class="fas fa-chevron-up" data-id=${cartItem.id}></i>
              <p>${cartItem.quantity}</p>
              <i class="fas fa-chevron-down" data-id=${cartItem.id}></i>
            </div>
            <i class="fas fa-trash-alt" data-id=${cartItem.id}> </i>
          `;
    modalBody.appendChild(div);
  }
  setUpApp() {
    //get cart from storage
    carts = Storage.getCarts() || [];
    //add cart item
    carts.forEach((item) => this.addCartItem(item));
    this.setCartValue(carts);
  }
  cartLogic() {
    clearBtn.addEventListener("click", () => this.clearCart());
    modalBody.addEventListener("click", (e) => {
      // console.log(e.target);
      if (e.target.classList.contains("fa-chevron-up")) {
        const addQuantity = e.target;
        const addedItem = carts.find((c) => c.id == addQuantity.dataset.id);
        addedItem.quantity++;
        this.setCartValue(carts);
        Storage.saveCart(carts);
        addQuantity.nextElementSibling.innerHTML = addedItem.quantity;
      } else if (e.target.classList.contains("fa-trash-alt")) {
        const removeItem = e.target;
        const _removedItem = carts.find((c) => c.id == removeItem.dataset.id);
        this.removeItem(_removedItem.id);
        Storage.saveCart(carts);
        modalBody.removeChild(removeItem.parentElement);
      } else if (e.target.classList.contains("fa-chevron-down")) {
        const subQuantity = e.target;
        const subtractedItem = carts.find(
          (c) => c.id == subQuantity.dataset.id
        );
        subtractedItem.quantity--;
        if (subtractedItem.quantity === 1) {
          this.removeItem(subtractedItem.id);
          modalBody.removeChild(subQuantity.parentElement.parentElement);
          return;
        }
        this.setCartValue(carts);
        Storage.saveCart(carts);
        subQuantity.previousElementSibling.innerText = subtractedItem.quantity;
      }
    });
  }
  clearCart() {
    carts.forEach((cItem) => this.removeItem(cItem.id));
    while (modalBody.children.length) {
      modalBody.removeChild(modalBody.children[0]);
    }
    closeModal();
  }
  removeItem(id) {
    carts = carts.filter((item) => item.id !== id);
    this.setCartValue(carts);
    Storage.saveCart(carts);
    const button = buttonsDom.find(
      (btn) => parseInt(btn.dataset.id) === parseInt(id)
    );
    button.innerText = "Add to Cart";
    button.disabled = "false";
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
  static getCarts() {
    return JSON.parse(localStorage.getItem("cart"));
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const products = new Products();
  const productsData = products.getProducts();

  const ui = new Ui();
  ui.setUpApp();
  ui.displayProducts(productsData);
  ui.getAddToCartBtn();
  ui.cartLogic();
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
