const form = document.querySelector("form");
const email = document.querySelector("#email_input");
const nameel = document.querySelector("#name_input");
const password = document.querySelector("#password_input");
const icon = document.querySelector("lord-icon");

console.log(icon);

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  icon.setAttribute("trigger", "loop");
  data = {
    name: nameel.value,
    email: email.value,
    password: password.value,
  };
  try {
    const response = await fetch("/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (response.status === 201) {
      const json = await response.json();

      if (json.user && json.token) {
        // localStorage.setItem("token", json.token);
        window.location.href = "/main";
      }
    } else {
      icon.removeAttribute("trigger");
    }
  } catch (err) {
    icon.removeAttribute("trigger");

    console.log(err);
  }
});
