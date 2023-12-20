document.addEventListener('DOMContentLoaded', function() {
    Promise.all([
        fetch('https://ordinalmaxibiz.vercel.app/api/theapegang').then(res => res.json()),
        fetch('images.json').then(res => res.json())
    ])
    .then(([apiData, imagesData]) => {
        const mergedData = mergeData(apiData, imagesData);
        const gallery = document.querySelector('.gallery');
        
        mergedData.forEach(image => {
        const imageUrl = `https://ord-mirror.magiceden.dev/content/${image.id}`;

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
		link.href = `https://magiceden.io/ordinals/item-details/${image.id}`;
		link.target = "_blank";

		// Create image container
		const imageContainer = document.createElement('div');
		imageContainer.classList.add('image-container');

		// Create and set image element
		const img = document.createElement('img');
		img.dataset.src = imageUrl;
		img.alt = `Ordinal Maxi Biz #${image.id}`;
		img.classList.add('lazyload');

		// Append image to its container
		imageContainer.appendChild(img);

        // Display listed price if available
        if (image.listed) {
            const rawPrice = image.listedPrice / 100000000; // Convert to decimal
            const formattedPrice = rawPrice % 1 === 0 ? rawPrice.toFixed(2) : rawPrice.toString();
            const priceInfo = `<p class="listed-price">₿${formattedPrice}</p>`; // Add class for styling
            imageContainer.innerHTML += priceInfo; // Append the price info to the image container
        }

        // Append image container to link
        link.appendChild(imageContainer);

        // Append link to gallery item
        galleryItem.appendChild(link);

        // Append gallery item to gallery
        gallery.appendChild(galleryItem);
        });

        initializeLazyLoad(); // Initialize lazy loading
    })
    .catch(error => {
        console.error('Error loading image data:', error);
    });

    // Initialize filter buttons
    initializeFilterButtons();
    simulateInitialFilterClick(); // Simulate click on 'Show All' button
});

function mergeData(apiData, imagesData) {
    const flatApiData = apiData.flatMap(group => group.tokens);
    return imagesData.map(image => {
        const tokenInfo = flatApiData.find(token => token.id === image.id);
        return {
            ...image,
            listed: tokenInfo ? tokenInfo.listed : false,
            listedPrice: tokenInfo && tokenInfo.listed ? tokenInfo.listedPrice : null
        };
    });
}

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
