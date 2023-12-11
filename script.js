function filterSelection(color) {
    var elements = document.getElementsByClassName('gallery-item');
    for (var i = 0; i < elements.length; i++) {
    if (color === 'all' || elements[i].classList.contains(color)) {
        w3AddClass(elements[i], 'show');
    } else {
        w3RemoveClass(elements[i], 'show');
    }
    }
}

function w3AddClass(element, name) {
    var arr1 = element.className.split(" ");
    if (arr1.indexOf(name) === -1) {
    element.className += " " + name;
    }
}

function w3RemoveClass(element, name) {
    var arr1 = element.className.split(" ");
    var index = arr1.indexOf(name);
    if (index > -1) {
    arr1.splice(index, 1);
    }
    element.className = arr1.join(" ");
}

var btnContainer = document.getElementById("filter-container");
var btns = btnContainer.getElementsByClassName("filter-btn");
for (var i = 0; i < btns.length; i++) {
    btns[i].addEventListener("click", function() {
    var current = document.getElementsByClassName("active");
    if (current.length > 0) {
        current[0].className = current[0].className.replace(" active", "");
    }
    this.className += " active";
    });
}

document.getElementById('price-filter-checkbox').addEventListener('change', function() {
    var elements = document.getElementsByClassName('gallery-item');
    var isChecked = this.checked;

    for (var i = 0; i < elements.length; i++) {
    // Check if the item has a price tag
    var hasPriceTag = elements[i].getElementsByClassName('price-tag').length > 0;

    if (isChecked && hasPriceTag) {
        elements[i].style.display = 'block';
    } else if (isChecked && !hasPriceTag) {
        elements[i].style.display = 'none';
    } else {
        elements[i].style.display = ''; // Or use 'block' to show all
    }
    }
});

// Initially display all items
filterSelection('all');