//Editor: Marc Marron
// JavaScript for Search bar 
document.getElementById('search-input').addEventListener('input', function () {
 
    var searchTerm = this.value.toLowerCase();
    var gridItems = document.querySelectorAll('.grid-item');
 
    if (searchTerm === '') {
        gridItems.forEach(function (item) {
            item.style.display = 'block'; 
        });
        return; 
    }
    
    gridItems.forEach(function (item) {
        var title = item.querySelector('h1').innerText.toLowerCase();
        if (title.includes(searchTerm)) {
            item.style.display = 'block'; 
        } else {
            item.style.display = 'none'; 
        }
    });
});

//Editor: Jemma Niduaza
// JavaScript for Go to top button
let mybutton = document.getElementById("topBtn");
window.onscroll = function() {scrollFunction()};

function scrollFunction() {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    mybutton.style.display = "block";
  } else {
    mybutton.style.display = "none";
  }
}

function topFunction() {
  document.body.scrollTop = 0; 
  document.documentElement.scrollTop = 0; 
}