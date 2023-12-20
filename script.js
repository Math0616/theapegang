document.addEventListener('DOMContentLoaded', function() {
    Promise.all([
        fetch('images.json').then(response => response.json()),
        fetch('tokens.json').then(response => response.json())
    ])
    .then(([imagesData, tokensData]) => {
        const mergedData = mergeData(imagesData, tokensData);
        createGallery(mergedData);
    })
    .catch(error => console.error('Error loading data:', error));

});

function mergeData(imagesData, tokensData) {
    const tokensMap = new Map(tokensData.map(token => [token.id, token]));
    return imagesData.map(image => {
        const token = tokensMap.get(image.id);
        return token ? { ...image, ...token } : image;
    });
}

function createGallery(mergedData) {
    // Sort mergedData by listedPrice, and then by the second number if listedPrice is undefined or not present
    mergedData.sort((a, b) => {
        let aPrice = a.listedPrice !== 'undefined' && a.listedPrice !== undefined ? parseFloat(a.listedPrice) : Infinity;
        let bPrice = b.listedPrice !== 'undefined' && b.listedPrice !== undefined ? parseFloat(b.listedPrice) : Infinity;

        if (aPrice === Infinity && bPrice === Infinity) {
            // Extract the second number if it exists, otherwise use the first/only number
            let aNumber = extractSecondNumber(a.number);
            let bNumber = extractSecondNumber(b.number);

            return aNumber - bNumber;
        } else {
            // Sort by price when available
            return aPrice - bPrice;
        }
    });

    const gallery = document.querySelector('.gallery');
    mergedData.forEach(image => {
	const imageUrl = `https://ord-mirror.magiceden.dev/content/${image.id}`;

	// Create gallery item container
	const galleryItem = document.createElement('div');
	galleryItem.classList.add('gallery-item');

	// Setting the 'number' data attribute
	galleryItem.dataset.number = Array.isArray(image.number) ? image.number.join(', ') : image.number.toString();

	// Set the listedPrice data attribute, even if it's undefined
	galleryItem.dataset.listedPrice = image.listedPrice;
	galleryItem.dataset.id = image.id;

	// Set eyeColor and other optional attributes as data attributes
	const attributes = ['eyeColor', 'Female', 'Hat', 'Speaking', 'Smoking', 'NoFace', 'Demon', 'ThreePlusEyes', 'Lines', 'Earphone', 'Music', 'Hands', 'Ghost', 'Emoji', 'Crown', 'OneEye', 'Sick', 'Animal', 'Alien', 'Weapon', 'Ape', 'OpenScalp', 'Miner', 'ShadowDAO', 'LFG', 'Clown', 'Hoodie', 'OGHoodies', 'RealRef', 'Fiction', 'FreeRoss', 'Letterhead', 'Glasses', "sunGlasses", "Clean", 'Robot', 'Punk', 'Undead', 'FaceCover', 'GasMask'];
	attributes.forEach(attr => {
		if (image[attr]) {
		galleryItem.dataset[attr] = image[attr];
		}
	});

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

	let hoverTimeout; // Variable to store the hover state timeout

	// Add mouseover event listener with a delay for the tooltip
	img.addEventListener('mouseover', function(event) {
		hoverTimeout = setTimeout(function() {
			showTooltip(event, image);
		}, 1000); // Delay of 1 second
	});

	// Add mouseout event listener to hide tooltip and clear the hover timeout
	img.addEventListener('mouseout', function() {
		clearTimeout(hoverTimeout);
		hideTooltip();
	});

	// Append image to its container
	imageContainer.appendChild(img);

	// Append image container to link
	link.appendChild(imageContainer);

	// Append link to gallery item
	galleryItem.appendChild(link);

	// Price tag with Bitcoin symbol
	if (image.listedPrice && image.listedPrice !== 'undefined') {
		const priceTag = document.createElement('div');
		priceTag.classList.add('price-tag');
		priceTag.textContent = `₿${image.listedPrice}`;
		galleryItem.appendChild(priceTag);
	}

	// Append gallery item to gallery
	gallery.appendChild(galleryItem);

	});
	
	initializeLazyLoad(); // After adding all images to the gallery, initialize lazy loading
    initializeFilterButtons();// Initialize filter buttons
    simulateInitialFilterClick(); // Simulate click on 'Show All' button

}

function extractSecondNumber(numberData) {
    // Ensure numberData is a string
    let numberString = String(numberData);

    // Split the number string by commas and trim each part
    let numbers = numberString.split(',').map(n => n.trim());

    // Use the second number if available, otherwise the first
    return numbers.length > 1 ? parseInt(numbers[1], 10) : parseInt(numbers[0], 10);
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
