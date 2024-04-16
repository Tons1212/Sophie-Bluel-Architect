// Variables
const gallery = document.querySelector(".gallery");
const filter = document.querySelector(".filter");

// Fonction pour récuperer le tableau Works
async function getWorks() {
  const reponse = await fetch("http://localhost:5678/api/works");
  return await reponse.json();
}

getWorks();

// Fonction pour afficher les photos dynamiquement
async function displayWorks() {
  gallery.innerHTML = "";
  const works = await getWorks();
  works.forEach((work) => {
    displayImg(work);
  });
}

displayWorks();

function displayImg(work) {
  const figure = document.createElement("figure");
  const img = document.createElement("img");
  const figCaption = document.createElement("figcaption");
  img.src = work.imageUrl;
  figCaption.textContent = work.title;
  figure.appendChild(img);
  figure.appendChild(figCaption);
  gallery.appendChild(figure);
}

// Fonction pour récuperer le tableau Catégories
async function getCategories() {
  const reponse = await fetch("http://localhost:5678/api/categories");
  return await reponse.json();
}

// Fonction pour afficher les catégories dynamiquement
async function displayCategories() {
  const categories = await getCategories();
  categories.forEach((category) => {
    const btn = document.createElement("button");
    btn.innerText = category.name;
    btn.id = category.id;
    filter.appendChild(btn);
  });
}

displayCategories();

// Fonction pour filtrer les photos par catégories
async function categoriesFilters() {
  const picsGallery = await getWorks();
  console.log(picsGallery);
  const buttons = document.querySelectorAll(".filter button");
  buttons.forEach((button) => {
    button.addEventListener("click", (e) => {
      btnId = e.target.id;
      gallery.innerHTML = "";
      if (btnId !== "0") {
        const imgFiltered = picsGallery.filter((work) => {
          return work.categoryId == btnId;
        });
        imgFiltered.forEach((work) => {
          displayImg(work);
        });
      } else {
        displayWorks();
      }
      console.log(btnId);
    });
  });
}

categoriesFilters();

// Code si l'administrateur est connecté
// Variables
let token = localStorage.getItem("token");
const logged = window.sessionStorage.logged;
const logout = document.querySelector(".logout");
const btnModify = document.querySelector(".btnModify");
const modal = document.querySelector(".modal");
const xmark = document.getElementById("modal-close");
const galleryPhoto = document.querySelector(".galleryPhoto");

if (logged === "true") {
  filter.style.display = "none";
  btnModify.style.display = "flex";
  btnModify.addEventListener("click", () => {
    modal.style.display = "flex";
  });
  logout.innerText = "logout";
  logout.addEventListener("click", () => {
    window.sessionStorage.logged = false;
  });
}

xmark.addEventListener("click", () => {
  modal.style.display = "none";
});

modal.addEventListener("click", (e) => {
  if (e.target.className === "modal") {
    modal.style.display = "none";
  }
});

// Afficher les photos dans la modale
async function displayPhotoModal() {
  galleryPhoto.innerHTML = "";
  const allPics = await getWorks();
  allPics.forEach((pic) => {
    const figure = document.createElement("figure");
    const img = document.createElement("img");
    const span = document.createElement("span");
    const del = document.createElement("i");
    del.classList.add("fa-solid", "fa-trash-can");
    del.id = pic.id;
    img.src = pic.imageUrl;
    span.appendChild(del);
    figure.appendChild(span);
    figure.appendChild(img);
    galleryPhoto.appendChild(figure);
  });
  deletePhoto();
}

displayPhotoModal();

// Supprimer une photo de la modale avec la method DELETE
function deletePhoto() {
  const iconDelete = document.querySelectorAll(".fa-trash-can");
  iconDelete.forEach((icon) => {
    icon.addEventListener("click", (e) => {
      const iconId = icon.id;
      const deletePic = {
        method: "DELETE",
        headers: {
          "content-type": "application/json",
          Authorization: "Bearer ${token}",
        },
      };
      fetch("http://localhost:5678/api/works/" + iconId, deletePic)
        .then((reponse) => {
          if (!reponse.ok) {
            console.log("la suppression n'a pas fonctionnée");
          }
          return reponse.json();
        })
        .then((data) => {
          console.log("suppression reussie", data);
          displayPhotoModal();
          displayWorks();
        });
    });
  });
}

// faire apparaître la 2ème modale
const btnAddphoto = document.querySelector(".modalContent .addPhoto");
const modalAddPhoto = document.querySelector(".modalAddPhoto");
const modalContent = document.querySelector(".modalContent");
const returnArrow = document.querySelector(".fa-arrow-left");
const closeMark = document.querySelector(".modalAddPhoto .fa-xmark");

function displayModalAddPhoto() {
  btnAddphoto.addEventListener("click", () => {
    modalContent.style.display = "none";
    modalAddPhoto.style.display = "flex";
  });
  returnArrow.addEventListener("click", () => {
    modalContent.style.display = "flex";
    modalAddPhoto.style.display = "none";
  });
  closeMark.addEventListener("click", () => {
    modal.style.display = "none";
  });
}

displayModalAddPhoto();

// Afficher la preview de l'image
const previewImg = document.querySelector(".previewContainer img");
const inputFile = document.querySelector(".previewContainer input");
const labelFile = document.querySelector(".previewContainer label");
const iconFile = document.querySelector(".previewContainer .fa-image");
const descFile = document.querySelector(".previewContainer p");

// On écoute les changements de l'input
inputFile.addEventListener("change", () => {
  const file = inputFile.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      previewImg.src = e.target.result;
      previewImg.style.display = "flex";
      labelFile.style.display = "none";
      iconFile.style.display = "none";
      descFile.style.display = "none";
    };
    reader.readAsDataURL(file);
  }
});

// Création de la liste déroulante des catégories
async function displayModalCategories() {
  const baliseSelect = document.querySelector(".modalAddPhoto select");
  const categories = await getCategories();
  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category.id;
    option.textContent = category.name;
    baliseSelect.appendChild(option);
  });
}
displayModalCategories();

// Ajouter un vehicule avec la methode POST
const form = document.querySelector(".modalAddPhoto form");
const title = document.getElementById("title");
const category = document.getElementById("category");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(form);
  fetch("http://localhost:5678/api/works", {
    method: "POST",
    body: JSON.stringify(formData),
    headers: {
      Authorization: `bearer ${token}`,
      accept: "application/json",
      "Content-Type": "multipart/form-data",
    },
  })
    .then((reponse) => reponse.json())
    .then((data) => {
      console.log(data);
      displayPhotoModal();
      displayWorks();
    });
});
