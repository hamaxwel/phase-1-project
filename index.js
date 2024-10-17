const apiUrl = 'http://localhost:3001/products'; 
const workshopsApiUrl = 'http://localhost:3001/workshops'; 

// Function to Fetch All Products and display them
function getAllProducts() {
    fetch(apiUrl)
        .then(response => response.json())
        .then(products => {
            displayProducts(products); // Display products on the page
        })
        .catch(error => console.error('Error fetching products:', error));
}

// Function to Display Products on the Page
function displayProducts(products) {
    const productList = document.getElementById('product-list');
    productList.innerHTML = ''; // Clear the list before displaying new products

    products.forEach(product => {
        const productItem = document.createElement('div');
        productItem.className = 'product-item';
        productItem.innerHTML = `
            <h3>${product.name}</h3>
            <img src="${product.imageUrl}" alt="${product.name}" style="width: 200px; height: auto; border-radius: 8px;">
            <p>${product.description}</p>
            <p>Price: <span class="product-price">${product.price} Ksh</span></p>
            <p>Stock: ${product.stock}</p>
            <button onclick="viewProduct(${product.id})">view</button>
            <button onclick="showEditProductForm(${product.id})">update</button>
            <button onclick="deleteProduct(${product.id})">Delete</button>
        `;
        productList.appendChild(productItem);
    });
}

      // Function to view an individual product
function viewProduct(productId) {
    fetch(`http://localhost:3001/products/${productId}`) 
        .then(response => {
            if (!response.ok) {
                throw new Error('Product not found');
            }
            return response.json();
        })
        .then(product => {
            // Display product details on a separate page
            const productDetailsPage = document.getElementById('productdetails');

            // Clear the previous content
            productDetailsPage.innerHTML = '';

            // Create HTML elements for the product details
            const productTitle = document.createElement('h2');
            productTitle.textContent = product.name;

            const productImage = document.createElement('img');
            productImage.src = product.imageUrl;
            productImage.alt = product.name;
            productImage.style.width = '200px';
            productImage.style.height = 'auto';
            productImage.style.borderRadius = '8px';

            const productDescription = document.createElement('p');
            productDescription.textContent = product.description;

            const productPrice = document.createElement('p');
            productPrice.innerHTML = `Price: <span class="product-price">${product.price} Ksh</span>`; // Use innerHTML to parse HTML

            const productStock = document.createElement('p');
            productStock.textContent = `Stock: ${product.stock}`;

            // Append the elements to the page
            productDetailsPage.appendChild(productTitle);
            productDetailsPage.appendChild(productImage);
            productDetailsPage.appendChild(productDescription);
            productDetailsPage.appendChild(productPrice);
            productDetailsPage.appendChild(productStock);

            // Show the product details page
            productDetailsPage.style.display = 'block';
        })
        .catch(error => {
            console.error('Error fetching product:', error);
            // Optionally, display an error message to the user
            const productDetailsPage = document.getElementById('productdetails');
            productDetailsPage.innerHTML = `<p>Error: ${error.message}</p>`;
            productDetailsPage.style.display = 'block'; // Show error message
        });
}
// Function to handle adding a new product
function handleAddProduct(event) {
    event.preventDefault(); // Prevent the default form submission

    // Gather product details from the form inputs
    const name = document.getElementById('product-name').value.trim();
    const description = document.getElementById('product-description').value.trim();
    const price = parseFloat(document.getElementById('product-price').value);
    const stock = parseInt(document.getElementById('product-stock').value, 10);
    const imageUrl = document.getElementById('product-image-url').value.trim();

    // Check if all fields are filled correctly
    if (!name || !description || isNaN(price) || isNaN(stock) || !imageUrl) {
        alert('Please fill in all fields correctly.');
        return;
    }

    // Create a new product object
    const newProduct = {
        name,
        description,
        price,
        stock,
        imageUrl
    };

    // Call the function to add the new product
    addProduct(newProduct);
}

// Function to Add a New Product to the API
function addProduct(product) {
    fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(product),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to add product');
        }
        return response.json();
    })
    .then(() => {
        console.log('Product added successfully');
        getAllProducts(); // Refresh the product list
        clearAddProductForm(); // Clear the form inputs after submission
    })
    .catch(error => console.error('Error adding product:', error));
}

// Function to clear the "Add New Product" form fields
function clearAddProductForm() {
    document.getElementById('product-name').value = '';
    document.getElementById('product-description').value = '';
    document.getElementById('product-price').value = '';
    document.getElementById('product-stock').value = '';
    document.getElementById('product-image-url').value = '';
}

// Function to show the edit product form
function showEditProductForm(productId) {
    fetch(`${apiUrl}/${productId}`)
        .then(response => response.json())
        .then(product => {
            const modalContent = document.querySelector('.modal-content');
            const modal = document.querySelector('.modal');

            // Populate the modal with the product details
            modalContent.innerHTML = `
                <span class="close-button" onclick="closeModal()">&times;</span>
                <h3>Edit Product</h3>
                <form onsubmit="editProduct(event, ${productId})">
                    <label for="editName">Name:</label>
                    <input type="text" id="editName" value="${product.name}" required>

                    <label for="editDescription">Description:</label>
                    <textarea id="editDescription" required>${product.description}</textarea>

                    <label for="editPrice">Price:</label>
                    <input type="number" id="editPrice" value="${product.price}" required>

                    <label for="editStock">Stock:</label>
                    <input type="number" id="editStock" value="${product.stock}" required>

                    <label for="editImageUrl">Image URL:</label>
                    <input type="text" id="editImageUrl" value="${product.imageUrl}" required>

                    <button type="submit">Update Product</button>
                </form>
            `;

            modal.style.display = 'block'; // Show the modal
        })
        .catch(error => console.error('Error fetching product for edit:', error));
}

// Function to edit a product
function editProduct(event, productId) {
    event.preventDefault();

    // Get updated values from the form
    const updatedProduct = {
        name: document.getElementById('editName').value,
        description: document.getElementById('editDescription').value,
        price: parseFloat(document.getElementById('editPrice').value),
        stock: parseInt(document.getElementById('editStock').value, 10),
        imageUrl: document.getElementById('editImageUrl').value,
    };

    fetch(`${apiUrl}/${productId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedProduct),
    })
    .then(response => response.json())
    .then(() => {
        console.log('Product updated successfully');
        closeModal();
        getAllProducts(); // Refresh the product list
    })
    .catch(error => console.error('Error updating product:', error));
}

// Function to delete a product
function deleteProduct(productId) {
    fetch(`${apiUrl}/${productId}`, {
        method: 'DELETE',
    })
    .then(response => {
        if (response.ok) {
            console.log('Product deleted successfully');
            getAllProducts(); // Refresh the product list
        } else {
            throw new Error('Failed to delete product');
        }
    })
    .catch(error => console.error('Error deleting product:', error));
}

// Function to close the modal
function closeModal() {
    const modal = document.querySelector('.modal');
    modal.style.display = "none";
}

// Function to search products
function searchProducts() {
    const searchInput = document.getElementById('search-bar').value.toLowerCase();

    fetch(apiUrl)
        .then(response => response.json())
        .then(products => {
            const filteredProducts = products.filter(product => 
                product.name.toLowerCase().includes(searchInput) ||
                product.description.toLowerCase().includes(searchInput)
            );
            displayProducts(filteredProducts); // Display only the filtered products
        })
        .catch(error => console.error('Error fetching products:', error));
}

// Function to Fetch All Workshops and display them
function getAllWorkshops() {
    fetch(workshopsApiUrl)
        .then(response => response.json())
        .then(workshops => {
            displayWorkshops(workshops); // Display workshops on the page
        })
        .catch(error => console.error('Error fetching workshops:', error));
}

// Function to Display Workshops on the Page
function displayWorkshops(workshops) {
    const workshopList = document.getElementById('workshop-list');
    workshopList.innerHTML = ''; // Clear the list before displaying new workshops

    workshops.forEach(workshop => {
        const workshopItem = document.createElement('div');
        workshopItem.className = 'workshop-item';
        workshopItem.innerHTML = `
            <h3>${workshop.name}</h3>
            <img src="${workshop.imageUrl}" alt="${workshop.title}" style="width: 100%; height: auto; border-radius: 8px;">
            <p>Date: ${new Date(workshop.date).toLocaleDateString()}</p>
            <p>Description: ${workshop.description}</p>
            <p>Location: ${workshop.location}</p>
            <button onclick="showEditWorkshopForm(${workshop.id})">Edit</button>
            <button onclick="deleteWorkshop(${workshop.id})">Delete</button>
        `;
        workshopList.appendChild(workshopItem);
    });
}

// Function to show the edit workshop form
function showEditWorkshopForm(workshopId) {
    fetch(`${workshopsApiUrl}/${workshopId}`) // Fixed template literals
        .then(response => response.json())
        .then(workshop => {
            const modalContent = document.querySelector('.modal-content');
            const modal = document.querySelector('.modal');

            // Populate the modal with the workshop details
            modalContent.innerHTML = `
                <span class="close-button" onclick="closeModal()">&times;</span>
                <h3>Edit Workshop</h3>
                <form onsubmit="editWorkshop(event, ${workshopId})">
                    <label for="editTitle">Title:</label>
                    <input type="text" id="editTitle" value="${workshop.title}" required>

                    <label for="editDate">Date:</label>
                    <input type="date" id="editDate" value="${new Date(workshop.date).toISOString().split('T')[0]}" required>

                    <label for="editDescription">Description:</label>
                    <textarea id="editDescription" required>${workshop.description}</textarea>

                    <label for="editLocation">Location:</label>
                    <input type="text" id="editLocation" value="${workshop.location}" required>

                    <button type="submit">Update Workshop</button>
                </form>
            `;

            modal.style.display = 'block'; // Show the modal
        })
        .catch(error => console.error('Error fetching workshop for edit:', error));
}

// Function to edit a workshop
function editWorkshop(event, workshopId) {
    event.preventDefault();

    // Get updated values from the form
    const updatedWorkshop = {
        title: document.getElementById('editTitle').value,
        date: document.getElementById('editDate').value,
        description: document.getElementById('editDescription').value,
        location: document.getElementById('editLocation').value,
    };

    fetch(`${workshopsApiUrl}/${workshopId}`, { // Fixed template literals
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedWorkshop),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to update workshop');
        }
        return response.json();
    })
    .then(() => {
        console.log('Workshop updated successfully');
        closeModal();
        getAllWorkshops(); // Refresh the workshop list
    })
    .catch(error => console.error('Error updating workshop:', error));
}

// Function to delete a workshop
function deleteWorkshop(workshopId) {
    fetch(`${workshopsApiUrl}/${workshopId}`, { // Fixed template literals
        method: 'DELETE',
    })
    .then(response => {
        if (response.ok) {
            console.log('Workshop deleted successfully');
            getAllWorkshops(); // Refresh the workshop list
        } else {
            throw new Error('Failed to delete workshop');
        }
    })
    .catch(error => console.error('Error deleting workshop:', error));
}

// Close modal function remains unchanged
function closeModal() {
    const modal = document.querySelector('.modal');
    modal.style.display = "none";
}


// Initial fetch of products and workshops when the document loads
document.addEventListener('DOMContentLoaded', () => {
    getAllProducts(); // Fetch and display products
    getAllWorkshops(); // Fetch and display workshops
});
