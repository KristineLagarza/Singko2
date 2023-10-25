// index.html ("Search Destination Button")
document.addEventListener("DOMContentLoaded", function () {
    var button = document.querySelector(".custom-button");
    button.addEventListener("click", function () {
      window.location.href = "sample.html";
    });
});