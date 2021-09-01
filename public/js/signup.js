const form = document.querySelector("form");
const email = document.querySelector("#email_input");
const nameel = document.querySelector("#name_input");
const password = document.querySelector("#password_input");
const icon = document.querySelector("lord-icon");
const emailValidationLabel = document.querySelector("#email-validation");
const nameValidationLabel = document.querySelector("#name-validation");
const passwordValidationLabel = document.querySelector("#password-validation");
const unableToRegisterText = document.querySelector(".registration-error-text");

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
  if (nameel.value === "") {
    validation = false;
    nameValidationLabel.classList.remove("hidden");
  } else {
    nameValidationLabel.classList.add("hidden");
  }
  return validation;
};

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!validateFields()) {
    return;
  }
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
    } else if (response.status === 400) {
      unableToRegisterText.innerHTML = "Email is already used. Try another one";
      unableToRegisterText.classList.remove("hidden");
      icon.removeAttribute("trigger");
    } else {
      unableToLoginText.innerHTML = "Unable to sign up. Please try again later";
      unableToRegisterText.classList.remove("hidden");
      icon.removeAttribute("trigger");
    }
  } catch (err) {
    icon.removeAttribute("trigger");

    console.log(err);
  }
});
