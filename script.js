let title = document.getElementById("title");
let price = document.getElementById("price");
let taxes = document.getElementById("taxes");
let ads = document.getElementById("ads");
let discount = document.getElementById("discount");
let total = document.getElementById("total");
let count = document.getElementById("count");
let category = document.getElementById("category");
let search = document.getElementById("search");
let createButton = document.getElementById("create");
let DeleteAll = document.getElementById("delete-all");
let formPriceInput = document.querySelectorAll("#form-price input");
let ButtonIsCreate = true;
let indexForUpdate;
let typeOfSearch = "";
let listItemWord = "listItem"; //end point to use im local storage
let listItem = [];
let newListForSearch = [];
let item = {}; //object to add in list in local storage

if (localStorage.getItem(listItemWord)) {
  listItem = JSON.parse(localStorage.getItem(listItemWord));
  showItem();
}
createButton.addEventListener("click", createItem);
//create
function createItem(e) {
  e.preventDefault();
  item = {
    title: title.value,
    price: price.value,
    taxes: taxes.value,
    ads: ads.value,
    discount: discount.value,
    total: total.innerText,
    category: category.value,
  };

  if (
    title.value.trim() != "" &&
    price.value.trim() != "" &&
    category.value.trim() != ""
  ) {
    if (ButtonIsCreate) {
      if (+count.value > 0) {
        for (let index = 0; index < +count.value; index++) {
          listItem.push(item);
        }
      } else listItem.push(item);
    } else {
      listItem.splice(indexForUpdate, 1, item);
      ButtonIsCreate = true;
      createButton.innerText = "create";
    }
    localStorage.setItem(listItemWord, JSON.stringify(listItem));
    clearInputs();
    showItem();
    total.innerText = 0;
    total.style.background = "red";
    title.focus();
  } else {
    //وضع تحقق من الحقول يدويا
    // لان منع اعاده التجميل e.preventDefault() لاظهر رساله التحقق من الحقل وانه فارغ
    showCustomReport();
  }
}
function getTotal() {
  let priceBeforeDiscount =
    parseInt(price.value || 0) -
    parseInt(taxes.value || 0) -
    parseInt(ads.value || 0);
  //   console.log(priceBeforeDiscount);
  let totalPrice =
    discount.value > 0
      ? priceBeforeDiscount -
        priceBeforeDiscount * (parseInt(discount.value || 1) / 100)
      : priceBeforeDiscount;

  if (totalPrice >= 0 && discount.value <= 100) {
    total.style.background = "green";
    total.innerText = totalPrice.toFixed(2);
  } else {
    total.style.background = "red";
    total.innerText = "Error";
  }
}
function showCustomReport() {
  if (title.value == "") {
    title.setCustomValidity("هذا الحقل مطلوب");
    title.reportValidity();
  }
  if (price.value == "") {
    price.setCustomValidity("هذا الحقل مطلوب");
    price.reportValidity();
  }
  if (category.value == "") {
    category.setCustomValidity("هذا الحقل مطلوب");
    category.reportValidity();
  }
}
function clearInputs() {
  title.value = null;
  price.value = null;
  taxes.value = null;
  ads.value = null;
  discount.value = null;
  count.value = null;
  category.value = null;
  item = {};
}
//read or select
function showItem() {
  if (localStorage.getItem(listItemWord)) {
    listItem = JSON.parse(localStorage.getItem(listItemWord));
    let tbody = document.querySelector("tbody");
    tbody.innerHTML = "";
    listItem.forEach((element, index) => {
      tbody.innerHTML += `<tr onclick="updateItem(${index})">  
        <td>${index}</td>
        <td>${element.title}</td>
        <td>${element.price}</td>
        <td>${element.taxes}</td>
        <td>${element.ads}</td>
        <td>${element.discount}</td>
        <td>${element.total}</td>
        <td>${element.category}</td>
        <td><button onclick="updateItem(${index})" id="update">update</button></td>
        <td><button onclick="deleteItem(${index})" id="delete">delete</button></td>
    </tr>`;
    });
    if (listItem.length == 0) {
      DeleteAll.style.display = "none";
    } else {
      DeleteAll.style.display = "block";
    }
    DeleteAll.innerText = `delete all (${listItem.length})`;
  }
}
function showItemBySearch(listOfItem) {
  let tbody = document.querySelector("tbody");
  tbody.innerHTML = "";
  listOfItem.forEach((element, index) => {
    tbody.innerHTML += `<tr onclick="updateItem(${index})">  
        <td>${index}</td>
        <td>${element.title}</td>
        <td>${element.price}</td>
        <td>${element.taxes}</td>
        <td>${element.ads}</td>
        <td>${element.discount}</td>
        <td>${element.total}</td>
        <td>${element.category}</td>
        <td><button onclick="updateItem(${index})" id="update">update</button></td>
        <td><button onclick="deleteItem(${index})" id="delete">delete</button></td>
    </tr>`;
  });
  DeleteAll.style.display = "none";
}
//update
function updateItem(e) {
  ButtonIsCreate = false;
  createButton.innerText = "update";
  indexForUpdate = e;
  title.value = listItem[indexForUpdate].title;
  price.value = listItem[indexForUpdate].price;
  taxes.value = listItem[indexForUpdate].taxes ?? 0;
  ads.value = listItem[indexForUpdate].ads ?? 0;
  discount.value = listItem[indexForUpdate].discount ?? 0;
  count.value = listItem[indexForUpdate].count ?? 0;
  category.value = listItem[indexForUpdate].category;
  getTotal();
  scroll({ top: 0, behavior: "smooth" });
}
//delete
function deleteItem(e) {
  listItem.splice(e, 1);
  localStorage.setItem(listItemWord, JSON.stringify(listItem));
  showItem();
}
function deleteAll() {
  if (listItem.length !== 0) {
    listItem = [];
    localStorage.setItem(listItemWord, JSON.stringify(listItem));
    showItem();
  }
}
function switchTitle_category(type) {
  showItem();
  if (type != typeOfSearch) {
    search.focus();
    typeOfSearch = type;
    search.placeholder = `search by ${type}`;
  }
}
//search
function searchByTitleOrCategory() {
  if (search.value != "") {
    newListForSearch = listItem.filter((element, index) => {
      return typeOfSearch === "title"
        ? element.title.includes(search.value)
        : typeOfSearch === "category"
        ? element.category.includes(search.value)
        : element;
    });
    showItemBySearch(newListForSearch);
  } else {
    newListForSearch = null;
    showItem();
  }
}
