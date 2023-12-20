function loadHistoryData() {
    fetch('history.json')
        .then(response => response.json())
        .then(data => displayHistoryData(data))
        .catch(error => console.error('Error loading history data:', error));
}

function displayHistoryData(historyData) {
    const historyGallery = document.querySelector('.historyGallery');
    if (!historyGallery) {
        console.error('History gallery element not found');
        return;
    }

    historyGallery.style.display = 'none'; // Use flexbox to manage the layout
    historyGallery.style.flexDirection = 'column'; // Stack children elements in a column

    // Flatten the array of groups into a single array of activities
    const allActivities = historyData.flatMap(group => group.activities);

    // Sort the activities by the 'createdAt' date in descending order
    allActivities.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    allActivities.forEach(activity => {
        const row = document.createElement('div');
        row.classList.add('history-row');
        row.style.display = 'flex';
        row.style.justifyContent = 'space-between';
        row.style.marginBottom = '10px';

        // Image container
        const imageContainer = document.createElement('div');
        imageContainer.classList.add('image-history-container'); // Make sure this class is used in your CSS

        const img = document.createElement('img');
        img.classList.add('history-image'); // Add this class to your CSS to style the images
        img.src = activity.token.contentURI;
        img.alt = activity.token.meta.name || `Inscription #${activity.token.inscriptionNumber}`;
        imageContainer.appendChild(img);

        // Name container, use 'Inscription #' if the name is not available
        const nameContainer = document.createElement('div');
        nameContainer.textContent = activity.token.meta.name || `Inscription #${activity.token.inscriptionNumber}`;

        // Format the price from satoshis to bitcoins and remove trailing zeros
        const priceInBTC = activity.listedPrice ? (parseInt(activity.listedPrice) / 100000000).toString() : 'N/A';
        // Use regex to remove trailing zeros after decimal
        const formattedPrice = priceInBTC !== 'N/A' ? parseFloat(priceInBTC).toFixed(8).replace(/(\.\d*?[1-9])0+$/, "$1").replace(/\.0+$/, "") : 'N/A';

        // Price container
        const priceContainer = document.createElement('div');
        priceContainer.textContent = `Sold for ${formattedPrice} BTC`;

        // Date container
        const dateContainer = document.createElement('div');
        dateContainer.textContent = new Date(activity.createdAt).toLocaleString();

        // Append all containers to the row
        row.appendChild(imageContainer);
        row.appendChild(nameContainer);
        row.appendChild(priceContainer);
        row.appendChild(dateContainer);

        // Append row to the historyGallery
        historyGallery.appendChild(row);
    });
}
