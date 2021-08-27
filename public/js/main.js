let folders = document.getElementsByClassName("folder-title");

let i;

for (i = 0; i < folders.length; i++) {
  folders[i].addEventListener("click", function () {
    console.log(this);
    console.log("hello");
    this.classList.toggle("active");
    let content = this.nextElementSibling;
    if (content.style.display === "block") {
      content.style.display = "none";
    } else {
      content.style.display = "block";
    }
  });
}
