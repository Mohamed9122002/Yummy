// global variables //
const rowData = document.getElementById("rowData");
const searchContainer = document.getElementById("searchContainer");
const baseUrl = `https://www.themealdb.com`;
const inputName = document.getElementById("name");
const inputEmail = document.getElementById("email");
const inputPhone = document.getElementById("phone");
const inputAge = document.getElementById("age");
const inputPassword = document.getElementById("password");
const inputRestPassword = document.getElementById("restPassword");
const home = document.getElementById("home");
const contact = document.getElementById("contact");
// open nav-menu
function open() {
  $(".nav-menu").animate({ left: 0 }, 500);
  $(".open-close-icon").removeClass("fa-align-justify");
  $(".open-close-icon").addClass("fa-x");
  for (let i = 0; i < 5; i++) {
    $(".links li").eq(i).animate({ top: 0 });
  }
}
// close  nav-menu
function close() {
  let outerW = $(".nav-menu .nav-tap").outerWidth();
  $(".nav-menu").animate({ left: -outerW }, 500);
  $(".open-close-icon").removeClass("fa-x");
  $(".open-close-icon").addClass("fa-align-justify");
}
$(document).ready(function() {
  close();

  $(" i.open-close-icon").click(() => {
    if ($(".nav-menu").css("left") == "0px") {
      close();
    } else {
      open();
    }
  });
});
// button close displayDetail
function closeDetail() {
  document.querySelector(".details").classList.remove("d-none");
  rowData.classList.add("d-none");
  document.getElementById("btnClose").addEventListener("click", function(e) {
    rowData.classList.remove("d-none");
    document.querySelector(".details").classList.add("d-none");
  });
}
// getall recipe
async function allRecipe() {
  close();
  $(".loading").fadeIn(300).css({ display: "flex" });
  let response = await fetch(`${baseUrl}/api/json/v1/1/search.php?s=a`);
  let data = await response.json();
  console.log(data);
  displayAllRecipe(data.meals);
  $(".loading").fadeOut(300);
}
allRecipe();

// display the all recipe
function displayAllRecipe(arr) {
  let result = "";
  for (let i = 0; i < arr.length; i++) {
    result += `
                        <div class="col-md-3">
                        <div onClick="getDetail(${arr[i]
                          .idMeal})" class="meal position-relative overflow-hidden rounded-2">
                            <img src="${arr[i]
                              .strMealThumb}" class="w-100" alt="">
                            <div class="meal-layer position-absolute d-flex align-items-center  p-2 text-black">
                                <h2>${arr[i].strMeal}</h2>
                            </div>
                        </div>
                </div>
        `;
  }
  rowData.innerHTML = result;
}

async function getDetail(id) {
  close();
  $(".loading").fadeIn(300).css({ display: "flex" });
  try {
    let response = await fetch(`${baseUrl}/api/json/v1/1/lookup.php?i=${id}`);
    let data = await response.json();
    // console.log(data.meals);
    displayDetail(data.meals[0]);
    closeDetail();
    $(".loading").fadeOut(300);
  } catch (err) {
    console.log(err);
  }
}

function displayDetail(data) {
  // get recipe of item
  console.log(data);
  let counterRecipe = "";
  for (let i = 0; i < 30; i++) {
    // console.log(data[`strMeasure${i}`] == " ");
    if (data[`strMeasure${i}`] && data[`strMeasure${i}`].trim() !== "") {
      counterRecipe += `<li class="alert alert-info m-2 p-2">${data[
        `strMeasure${i}`
      ]}  ${data[`strIngredient${i}`]}</li>`;
    }
  }
  let tags = data.strTags?.split(" ");
  // console.log(tags);
  let counterTags = ''
  if (tags == undefined) {
    tags = []
  }
  for(let i =0 ;i<tags.length;i++) {
    counterTags += `<li class="alert alert-danger m-2 p-2">${tags[i]}</li>`;
  }
  console.log(data.strTags?.split(" "));
  let result = `
                        <div class="col-md-4">
                            <img src="${data.strMealThumb}" class="w-100 rounded-3" alt="">
                            <h2>${data.strMeal}</h2>
                        </div>
                        <div class="col-md-8">
                            <h2>Instructions</h2>
                            <p class="lead">${data.strInstructions}</p>
                            <h3>Area: <span>${data.strArea}</span></h3>
                            <h3>Category: ${data.strCategory}</h3>
                            <h3>Recipe: </h3>
                            <ul class="list-unstyled d-flex g-30 flex-wrap">
                                ${counterRecipe}
                            </ul>
                            <h3>tags:</h3>
                            <ul class="list-unstyled d-flex   flex-wrap">
                            ${counterTags}
                            </ul>
                            <a href="${data.strSource}" class="btn btn-success p-2 me-2">Source</a>
                            <a href="${data.strYoutube}" class="btn btn-danger p-2">youtube</a>
                        </div>
 `;
  document.getElementById("detailsContent").innerHTML = result;
}
// inner inputs search
function showSearchInputs() {
  home.classList.remove("d-none");
  contact.classList.add("d-none");
  searchContainer.innerHTML = `
     <div class="row py-4 ">
        <div class="col-md-6 ">
            <input onkeyup="searchByName(this.value)" class="form-control    text-dark" type="search" placeholder="Search By Name">
        </div>
        <div class="col-md-6 ">
            <input onkeyup="searchByFLetter(this.value)" class="form-control    text-dark" type="search" placeholder="Search By Name">
        </div>
    </div>
    `;
  rowData.innerHTML = "";
}
document.querySelector(".search").addEventListener("click", function() {
  showSearchInputs();
  close();
});
// search by the name
async function searchByName(term) {
  close();
  $(".loading").fadeIn(300).css({ display: "flex" });
  rowData.innerHTML = "";
  try {
    let response = await fetch(`${baseUrl}/api/json/v1/1/search.php?s=${term}`);
    let data = await response.json();
    console.log(data);
    if (data != null) {
      displayAllRecipe(data.meals);
      $(".loading").fadeOut(300);
    }
  } catch (err) {
    console.log(err);
  }
}
// search by the first letter
async function searchByFLetter(term) {
  close();
  $(".loading").fadeIn(300).css({ display: "flex" });

  try {
    let response = await fetch(`${baseUrl}/api/json/v1/1/search.php?f=${term}`);
    let data = await response.json();
    if (data != null) {
      displayAllRecipe(data.meals);
      $(".loading").fadeOut(300);
    }
  } catch (err) {
    console.log(err);
  }
}
////////////////////////////////////////////////////////////////////////
async function getCategories() {
  searchContainer.innerHTML = "";
  $(".loading").fadeIn(300).css({ display: "flex" });

  let response = await fetch(`${baseUrl}/api/json/v1/1/categories.php`);
  let data = await response.json();
  console.log(data.categories);
  displayCategories(data.categories);
  document.querySelector(".details").classList.add("d-none");
  rowData.classList.remove("d-none");
  $(".loading").fadeOut(300);
}
// getCategories()
//onclick="getCategoriesMeals(${item.strCategory})"
function displayCategories(arr) {
  home.classList.remove("d-none");
  contact.classList.add("d-none");
  rowData.innerHTML = "";
  let result = "";
  for (const item of arr) {
    result += `
        <div class="col-md-3 col-lg-4">
                <div onclick="getCategoriesMeals('${item.strCategory}')"   class="meal position-relative overflow-hidden rounded-2 cursor-pointer">
                    <img class="w-100" src="${item.strCategoryThumb}" alt="" srcset="">
                    <div class="meal-layer position-absolute text-center text-black p-2">
                        <h3>${item.strCategory}</h3>
                        <p>${item.strCategoryDescription
                          .split(" ")
                          .slice(0, 20)
                          .join(" ")}</p>
                    </div>
                </div>
        </div>
        `;
  }

  rowData.innerHTML = result;
}
document.querySelector(".categories").addEventListener("click", function(e) {
  getCategories();
  close();
});
// function clicked item in the the displayCategories

async function getCategoriesMeals(category) {
  $(".loading").fadeIn(300).css({ display: "flex" });
  try {
    let response = await fetch(
      `${baseUrl}/api/json/v1/1/filter.php?c=${category}`
    );
    let data = await response.json();
    // console.log(data.meals.slice(0, 20));
    displayAllRecipe(data.meals.slice(0, 20));

    $(".loading").fadeOut(300);
  } catch (err) {
    console.log(err);
  }
}
// getCategoriesMeals("Beef");
////////////////////////////////////////////////////////////////////////
async function getArea() {
  rowData.innerHTML = "";
  $(".loading").fadeIn(300).css({ display: "flex" });

  let response = await fetch(`${baseUrl}/api/json/v1/1/list.php?a=list`);
  let data = await response.json();
  console.log(data.meals[0].strArea);
  displayArea(data.meals);
  document.querySelector(".details").classList.add("d-none");
  rowData.classList.remove("d-none");
  $(".loading").fadeOut(300);
}

function displayArea(arr) {
  home.classList.remove("d-none");
  contact.classList.add("d-none");
  let result = "";
  for (const item of arr) {
    result += `
        <div class="col-md-3">
                <div onclick="getAreaMeals('${item.strArea}')" class="rounded-2 text-center cursor-pointer">
                        <i class="fa-solid fa-house-laptop fa-4x"></i>
                        <h3>${item.strArea}</h3>
                </div>
        </div>
        `;
  }

  rowData.innerHTML = result;
}

document.querySelector(".areas").addEventListener("click", function(e) {
  getArea();
  close();
});
// function clicked item in the the displayArea

async function getAreaMeals(area) {
  $(".loading").fadeIn(300).css({ display: "flex" });
  try {
    let response = await fetch(`${baseUrl}/api/json/v1/1/filter.php?a=${area}`);
    let data = await response.json();
    // console.log(data.meals.slice(0, 20));
    displayAllRecipe(data.meals.slice(0, 20));
    $(".loading").fadeOut(300);
  } catch (err) {
    console.log(err);
  }
}
////////////////////////////////////////////////////////////////
async function getIngredients() {
  $(".loading").fadeIn(300).css({ display: "flex" });
  let response = await fetch(`${baseUrl}/api/json/v1/1/list.php?i=list`);
  let data = await response.json();
  console.log(data.meals);
  displayIngredients(data.meals.slice(0, 20));
  document.querySelector(".details").classList.add("d-none");
  rowData.classList.remove("d-none");
  $(".loading").fadeOut(300);
}
function displayIngredients(arr) {
  home.classList.remove("d-none");
  contact.classList.add("d-none");
  let result = "";
  for (const item of arr) {
    result += `
        <div class="col-md-3">
                <div onclick="getIngredientsMeals('${item.strIngredient}')" class="rounded-2 text-center cursor-pointer">
                        <i class="fa-solid fa-drumstick-bite fa-4x"></i>
                        <h3>${item.strIngredient}</h3>
                        <p>${item.strDescription
                          .split(" ")
                          .slice(0, 20)
                          .join(" ")}</p>
                </div>
        </div>
        `;
  }

  rowData.innerHTML = result;
}
document.querySelector(".ingredients").addEventListener("click", function(e) {
  getIngredients();
  close();
});
// function clicked item in the the displayIngredients
async function getIngredientsMeals(ingredients) {
  $(".loading").fadeIn(300).css({ display: "flex" });
  try {
    let response = await fetch(
      `${baseUrl}/api/json/v1/1/filter.php?i=${ingredients}`
    );
    let data = await response.json();
    // console.log(data.meals.slice(0, 20));
    displayAllRecipe(data.meals.slice(0, 20));
    $(".loading").fadeOut(300);
  } catch (err) {
    console.log(err);
  }
}

////////////////////////////////////////////////////////////////////////
function showContacts() {
  home.classList.add("d-none");
  contact.classList.remove("d-none");
}
document.querySelector(".contact").addEventListener("click", function(e) {
  close();
  showContacts();
});

const inputs = document.querySelectorAll("input");
console.log(inputs);
//// validation ///
function validationAllInputs(el) {
  const regex = {
    name: /^(?:[a-zA-Z0-9\s@,=%$#&_\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDCF\uFDF0-\uFDFF\uFE70-\uFEFF]|(?:\uD802[\uDE60-\uDE9F]|\uD83B[\uDE00-\uDEFF])){2,20}$/,
    email: /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/,
    phone: /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/,
    age: /^([1-7][0-9]|80)$/,
    password: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
    restPassword: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/
  };
  if (regex[el.id].test(el.value)) {
    el.classList.add("is-valid");
    el.classList.remove("is-invalid");
    return true;
  } else {
    el.classList.remove("is-valid");
    el.classList.add("is-invalid");
    return true;
  }
}
inputName.addEventListener("input", function() {
  validationAllInputs(this);
});
inputEmail.addEventListener("input", function() {
  validationAllInputs(this);
});

inputPhone.addEventListener("input", function() {
  validationAllInputs(this);
});
inputAge.addEventListener("input", function() {
  validationAllInputs(this);
});
inputPassword.addEventListener("input", function() {
  validationAllInputs(this);
});
inputRestPassword.addEventListener("input", function() {
  validationAllInputs(this);
});
