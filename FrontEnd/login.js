// Variables d'objets des éléments pour le login
const element = {
  email: document.getElementById("email"),
  password: document.getElementById("password"),
  submit: document.querySelector(".submit"),
};
const error = document.querySelector("form p");

// const form = document.querySelector("form");
// const errMessage = document.querySelector("form p");

let loginBtn = element.submit.addEventListener("click", (e) => {
  e.preventDefault();
  fetch("http://localhost:5678/api/users/login", {
    method: "POST",
    headers: {
      accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: element.email.value,
      password: element.password.value,
    }),
  })
    .then((reponse) => reponse.json())
    .then((data) => {
      sessionStorage.setItem("Token", data.token);

      if (data.userId == 1) {
        window.sessionStorage.logged = true;
        localStorage.setItem("token", data.token);
        location.href = "index.html";
      } else {
        error.innerText = "Erreur dans l'identifiant et/ou le mot de passe";
        function errDelete() {
          error.innerText = "";
        }
        setTimeout(errDelete, 25000);
      }
    })
    .catch((err) => console.log(err));
});
