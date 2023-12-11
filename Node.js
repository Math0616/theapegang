function fetchPriceData(tokenId, galleryItem) {
    const options = {
        method: 'GET', 
        headers: {
            accept: 'application/json',
            'Authorization': 'Bearer ca4dcecc-5284-49e0-9c1d-0bbfb2001e7e'  // The API key is a string literal.
        }
    };
    const apiUrl = `https://api-mainnet.magiceden.dev/v2/ord/btc/tokens?tokenIds=${tokenId}&showAll=true&sortBy=priceAsc`;

    fetch(apiUrl, options)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            // Assuming the API returns an array and that the price is a property of the first item
            if (data && data.length > 0 && data[0].price) {
                addPriceTag(galleryItem, data[0].price);
            }
        })
        .catch(err => console.error('Error fetching price data:', err));
}
