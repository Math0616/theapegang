document.addEventListener('DOMContentLoaded', function() {
	fetch('images.json')
	.then(response => response.json())
	.then(data => {
		const gallery = document.querySelector('.gallery');
		data.forEach(image => {
		const imageUrl = `https://ord-mirror.magiceden.dev/content/${image.tokenId}`;

		// Create gallery item container
		const galleryItem = document.createElement('div');
		galleryItem.classList.add('gallery-item');

		// Set eyeColor and other optional attributes as data attributes
		const attributes = ['eyeColor'];
		attributes.forEach(attr => {
			if (image[attr]) {
			galleryItem.dataset[attr] = image[attr];
			}
		});

		// Create link element
		const link = document.createElement('a');
		link.href = `https://magiceden.io/ordinals/item-details/${image.tokenId}`;
		link.target = "_blank";

		// Create image container
		const imageContainer = document.createElement('div');
		imageContainer.classList.add('image-container');

		// Create and set image element
		const img = document.createElement('img');
		img.dataset.src = imageUrl;
		img.alt = `Ordinal Maxi Biz #${image.tokenId}`;
		img.classList.add('lazyload');

		// Append image to its container
		imageContainer.appendChild(img);

		// Append image container to link
		link.appendChild(imageContainer);

		// Append link to gallery item
		galleryItem.appendChild(link);

		// Price tag with Bitcoin symbol
		if (image.price) {
			const priceTag = document.createElement('div');
			priceTag.classList.add('price-tag');
			priceTag.textContent = `₿${image.price}`;
			galleryItem.appendChild(priceTag);
		}

		// Append gallery item to gallery
		gallery.appendChild(galleryItem);
		});
		
		initializeLazyLoad(); // After adding all images to the gallery, initialize lazy loading
	})
	.catch(error => console.error('Error loading image data:', error));
});  

function initializeLazyLoad() {
const lazyImages = document.querySelectorAll('img.lazyload');
const imageObserver = new IntersectionObserver((entries, observer) => {
	entries.forEach(entry => {
	if (entry.isIntersecting) {
		const img = entry.target;
		img.src = img.getAttribute('data-src');
		img.classList.remove('lazyload');
		observer.unobserve(entry.target);
	}
	});
});

lazyImages.forEach(img => {
	imageObserver.observe(img);
});
}

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