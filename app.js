import { productsData } from "./products.js";

const showModalBtn = document.querySelector(".show-modal");
const closeModalBtn = document.querySelector(".close-modal");
const modal = document.querySelector(".modal");
const backDrop = document.querySelector(".backdrop");

document.addEventListener("DOMContentLoaded", () => {
  console.log(productsData);
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
