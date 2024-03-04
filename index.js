import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  onValue,
  remove,
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

const appSettings = {
  databaseURL:
    "https://realtime-database-65c12-default-rtdb.asia-southeast1.firebasedatabase.app/",
};

const app = initializeApp(appSettings);
const database = getDatabase(app);
const shoppingListInDB = ref(database, "shoppingList");

const inputFieldEl = document.getElementById("input-field");
const addButtonEl = document.getElementById("add-button");
const shoppingListEl = document.getElementById("shopping-list");
const bulb = document.getElementById("bulb");

addButtonEl.addEventListener("click", function () {
  let inputValue = inputFieldEl.value;

  if (inputValue.length === 0) {
    return;
  }

  push(shoppingListInDB, inputValue);

  clearInputFieldEl();
});

onValue(shoppingListInDB, function (snapshot) {
  if (snapshot.exists()) {
    let itemsArray = Object.entries(snapshot.val());

    clearShoppingListEl();

    for (let i = 0; i < itemsArray.length; i++) {
      let currentItem = itemsArray[i];
      let currentItemID = currentItem[0];
      let currentItemValue = currentItem[1];

      appendItemToShoppingListEl(currentItem);
    }
  } else {
    shoppingListEl.innerHTML = "Nothing here... yet";
  }
});

function clearShoppingListEl() {
  shoppingListEl.innerHTML = "";
}

function clearInputFieldEl() {
  inputFieldEl.value = "";
  bulb.src = "assets/bulb_bw.png";
  bulb.classList.remove("animate-bulb");
}

function appendItemToShoppingListEl(item) {
  let itemID = item[0];
  let itemValue = item[1];

  let newEl = document.createElement("li");

  newEl.textContent = itemValue;

  newEl.addEventListener("dblclick", function () {
    let exactLocationOfItemInDB = ref(database, `shoppingList/${itemID}`);

    remove(exactLocationOfItemInDB);
  });

  shoppingListEl.append(newEl);
}

inputFieldEl.addEventListener("input", function (e) {
  if (this.value === "" || this.value === null || this.value === undefined) {
    bulb.classList.add("off");
    bulb.src = "assets/bulb_bw.png";
    bulb.classList.remove("on");
  } else if (this.value.length >= 1) {
    bulb.classList.add("on");
    bulb.src = "assets/bulb.png";
    bulb.classList.remove("off");
  }
});

inputFieldEl.addEventListener("focus", function (e) {
  if (this.value === "" || this.value === null || this.value === undefined) {
    bulb.classList.toggle("animate-bulb");
  } else if (this.value.length >= 1) {
    if (bulb.classList.contains("on") && !bulb.classList.contains("off")) {
      // console.log(this.value);
    }
  }
});

addButtonEl.addEventListener("mouseover", function () {
  if(inputFieldEl.value.length >= 1){
    bulb.classList.remove("animate-bulb");
    bulb.src = "assets/bulb.png";
  }
});
addButtonEl.addEventListener("mouseleave", function () {
  if(inputFieldEl.value.length >= 1){
    bulb.classList.add("animate-bulb");
    bulb.src = "assets/bulb.png";
  }
});
