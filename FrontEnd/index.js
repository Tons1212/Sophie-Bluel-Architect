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
const logged = window.sessionStorage.logged;
const logout = document.querySelector(".logout");
const btnModify = document.querySelector(".btnModify");
const modal = document.querySelector(".modal");
const xmark = document.getElementById("modal-close");
const galleryPhoto = document.querySelector(".galleryPhoto");

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

function deletePhoto() {
  const iconDelete = document.querySelectorAll(".fa-trash-can");
  iconDelete.forEach((icon) => {
    icon.addEventListener("click", (e) => {
      const iconId = icon.id;
      const deletePic = {
        method: "DELETE",
        headers: { "content-type": "application/json" },
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

if (logged === "true") {
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
