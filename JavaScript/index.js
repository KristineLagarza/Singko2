// JavaScript for Image Slideshow
var slideIndex = 0;
showSlides();
function showSlides() {
  var i;
  var slides = document.getElementsByClassName("mySlide");
  // Hide all images
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  // Increment slideIndex and reset if it exceeds the number of images
  slideIndex++;
  if (slideIndex > slides.length) {
    slideIndex = 1;
  }
  // Display the current image
  slides[slideIndex - 1].style.display = "block";
  // Change image every 3 seconds (3000 milliseconds)
  setTimeout(showSlides, 2000);
}