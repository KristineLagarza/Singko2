// JavaScript for Search bar 
document.getElementById('search-input').addEventListener('input', function () {
    // Get the search term from the input field
    var searchTerm = this.value.toLowerCase();
    var gridItems = document.querySelectorAll('.grid-item');
    // Check if the search term is empty
    if (searchTerm === '') {
        gridItems.forEach(function (item) {
            item.style.display = 'block'; // Show all items
        });
        return; // Exit the function
    }
    // Loop through each grid item and hide/show based on the search term
    gridItems.forEach(function (item) {
        var title = item.querySelector('h1').innerText.toLowerCase();
        if (title.includes(searchTerm)) {
            item.style.display = 'block'; // Show the item
        } else {
            item.style.display = 'none'; // Hide the item
        }
    });
});