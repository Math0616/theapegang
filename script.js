document.addEventListener('DOMContentLoaded', function() {
    fetch('https://theapegang-6lj8pwwe8-theapegangs-projects-82aa3757.vercel.app/data')
    .then(response => response.json())
    .then(response => console.log(response))
    .catch(err => console.error(err));

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

        // Set initial display to block
        galleryItem.style.display = 'block';

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

		// Append gallery item to gallery
		gallery.appendChild(galleryItem);
		});
		
		initializeLazyLoad(); // After adding all images to the gallery, initialize lazy loading
	})
	.catch(error => console.error('Error loading image data:', error));

    // Initialize filter buttons
    initializeFilterButtons();
    simulateInitialFilterClick(); // Simulate click on 'Show All' button
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

function simulateInitialFilterClick() {
    const showAllButton = document.querySelector('.filter-btn.active');
    if (showAllButton) {
        showAllButton.click();
    }
}

function initializeFilterButtons() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('onclick').match(/'([^']+)'/)[1];
            filterSelection(filter);

            // Update active button style
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

function filterSelection(filter) {
    const galleryItems = document.querySelectorAll('.gallery-item');
    galleryItems.forEach(item => {
        if (filter === 'all' || item.dataset.eyeColor === filter) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
}
