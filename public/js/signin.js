const form = document.querySelector("form");
const email = document.querySelector("#email_input");
const password = document.querySelector("#password_input");

console.log(form);

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  data = {
    email: email.value,
    password: password.value,
  };
  try {
    const response = await fetch("/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if ((response.status = 200)) {
      const json = await response.json();

      if (json.user && json.token) {
        localStorage.setItem("token", json.token);
        window.location.href = "/sup";
      }
    }
  } catch (err) {
    console.log(err);
  }
});
