const form = document.querySelector("form");
const email = document.querySelector("#email_input");
const password = document.querySelector("#password_input");
const icon = document.querySelector("lord-icon");

console.log(icon);

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  icon.setAttribute("trigger", "loop");
  data = {
    email: email.value,
    password: password.value,
  };
  try {
    const response = await fetch("/users/login", {
      method: "PATCH",
      redirect: "follow",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (response.status === 200) {
      window.location.href = "/main";
    }
  } catch (err) {
    icon.removeAttribute("trigger");
    console.log(err);
  }
});
