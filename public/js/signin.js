const form = document.querySelector("form");
const email = document.querySelector("#email_input");
const password = document.querySelector("#password_input");
const icon = document.querySelector("lord-icon");
const emailValidationLabel = document.querySelector("#email-validation");
const passwordValidationLabel = document.querySelector("#password-validation");
const unableToLoginText = document.querySelector(".login-error-text");

console.log(icon);
const validateFields = () => {
  let validation = true;

  if (email.value === "") {
    validation = false;
    emailValidationLabel.classList.remove("hidden");
  } else {
    emailValidationLabel.classList.add("hidden");
  }
  if (password.value === "") {
    validation = false;
    passwordValidationLabel.classList.remove("hidden");
  } else {
    passwordValidationLabel.classList.add("hidden");
  }
  return validation;
};

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!validateFields()) {
    console.log("NOIT VALIDATED");
    return;
  }

  icon.setAttribute("trigger", "loop");
  data = {
    email: email.value,
    password: password.value,
  };
  try {
    const response = await fetch("/users/login", {
      method: "POST",
      redirect: "follow",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (response.status === 200) {
      unableToLoginText.classList.add("hidden");

      window.location.href = "/main";
    } else if (response.status === 404) {
      unableToLoginText.classList.remove("hidden");
      icon.removeAttribute("trigger");
    } else {
      unableToLoginText.innerHTML = "Unable to login. Please try again later";
      unableToLoginText.classList.remove("hidden");
      icon.removeAttribute("trigger");
    }
  } catch (err) {
    icon.removeAttribute("trigger");
    console.log(err);
  }
});
