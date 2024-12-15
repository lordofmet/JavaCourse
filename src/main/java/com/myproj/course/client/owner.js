document.addEventListener("DOMContentLoaded", loadProperties);
let deletingPropertyId = null;
let editingPropertyId = null;

async function loadProperties() {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || user.role !== "OWNER") {
        window.location.href = "index.html";
        return;
    }

    document.getElementById("owner-name").textContent = user.fullName || "Owner";

    try {
        const response = await fetch(`http://localhost:8080/properties/owner/${user.id}`);
        if (!response.ok) {
            throw new Error(`Failed to load properties: ${response.statusText}`);
        }

        const properties = await response.json();
        const propertyList = document.getElementById("property-list");

        propertyList.innerHTML = properties
            .map(
                (prop) => `
                <div class="property-item" style="border: 1px solid #ddd; padding: 20px; margin: 15px; border-radius: 8px; background-color: #f9f9f9;">
                    <h3 style="color: #333;">${prop.title || "Untitled Property"}</h3>
                    <p><strong>Description:</strong> ${prop.description || "No description provided."}</p>
                    <p><strong>Property Price:</strong> $${prop.price || 0}</p>
                    <p><strong>Booking Price:</strong> $${prop.bookingPricePerDay || 0} per day</p>
                    <p><strong>Capacity:</strong> ${prop.capacity || "N/A"}</p>
                    <p><strong>Type:</strong> ${prop.type || "N/A"}</p>
                    <p><strong>Amenities:</strong> ${prop.amenities || "None"}</p>
                    <p><strong>Average Rating:</strong> ${prop.averageRating.toFixed(2)}</p>
                    <div id="reviews-${prop.id}">
                        <!-- Reviews will be loaded here -->
                    </div>
                    <button onclick="editProperty(${prop.id})" style="padding: 10px 20px; background-color: #FF9800; color: white; border: none; border-radius: 5px; cursor: pointer;">Edit</button>
                    <button onclick="confirmDelete(${prop.id})" style="padding: 10px 20px; background-color: #F44336; color: white; border: none; border-radius: 5px; cursor: pointer;">Delete</button>
                </div>
            `
            )
            .join("");

        properties.forEach((property) => {
            loadReviews(property.id);
        });
    } catch (error) {
        console.error("Error loading properties:", error);
        alert("Failed to load properties. Please try again later.");
    }
}

async function loadReviews(propertyId) {
    const response = await fetch(`http://localhost:8080/reviews/property/${propertyId}`);
    if (!response.ok) {
        console.error("Failed to load reviews for property:", propertyId);
        return;
    }

    const reviews = await response.json();
    const reviewsContainer = document.getElementById(`reviews-${propertyId}`);

    if (reviews.length > 0) {
        reviewsContainer.innerHTML = `
            <h4>Reviews</h4>
            <div class="reviews-list">
                ${reviews
                    .map(
                        (review) => `
                        <div class="review-item">
                            <p><strong>User:</strong> ${review.user?.fullName || "Unknown"}</p>
                            <p><strong>Rating:</strong> ${review.rating || "No rating"}</p>
                            <p><strong>Comment:</strong> ${review.comment || "No comment"}</p>
                        </div>`
                    )
                    .join("")}
            </div>
        `;
    } else {
        reviewsContainer.innerHTML = "No reviews yet.";
    }
}

async function loadBookings(propertyId) {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user.id) {
        console.error("User information is missing or invalid.");
        return;
    }

    try {
        const response = await fetch(`http://localhost:8080/bookings/owner/${user.id}`);
        if (!response.ok) {
            throw new Error(`Failed to load bookings: ${response.statusText}`);
        }

        const bookings = await response.json();
        const bookingsContainer = document.getElementById(`bookings-${propertyId}`);
        const propertyBookings = bookings.filter((booking) => booking.property?.id === propertyId);

        if (propertyBookings.length > 0) {
            bookingsContainer.innerHTML = `
                <h4>Bookings</h4>
                ${propertyBookings
                    .map(
                        (booking) => `
                            <div>
                                <p><strong>User:</strong> ${booking.user?.fullName || "Unknown"}</p>
                                <p><strong>Start Date:</strong> ${booking.startDate || "N/A"}</p>
                                <p><strong>End Date:</strong> ${booking.endDate || "N/A"}</p>
                                <p><strong>Status:</strong> ${booking.status || "Unknown"}</p>
                                <p><strong>Total Price:</strong> $${booking.totalPrice || 0}</p>
                            </div>
                        `
                    )
                    .join("")}
            `;
        } else {
            bookingsContainer.innerHTML = "No bookings yet.";
        }
    } catch (error) {
        console.error("Error loading bookings:", error);
        alert("Failed to load bookings. Please try again later.");
    }
}

async function addProperty() {
    const title = document.getElementById("property-title").value.trim();
    const description = document.getElementById("property-description").value.trim();
    const price = parseFloat(document.getElementById("property-price").value);
    const amenities = document.getElementById("property-amenities").value.trim();
    const bookingPrice = parseFloat(document.getElementById("property-booking-price").value);
    const capacity = parseInt(document.getElementById("property-capacity").value, 10);
    const type = document.getElementById("property-type").value.toUpperCase();

    if (!title || !description || isNaN(price) || isNaN(bookingPrice) || isNaN(capacity) || !type) {
        alert("Please fill in all fields correctly.");
        return;
    }

    // Проверка на отрицательные или слишком большие значения
    if (price <= 0 || price > 10000) {
        alert("Property price must be a positive number and not greater than 10000.");
        return;
    }

    if (bookingPrice <= 0 || bookingPrice > 10000) {
        alert("Booking price must be a positive number and not greater than 10000.");
        return;
    }

    if (capacity <= 0 || capacity > 20) {
        alert("Capacity must be a positive integer and not greater than 20.");
        return;
    }

    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user.id) {
        alert("User information is missing.");
        return;
    }

    try {
        const response = await fetch("http://localhost:8080/properties", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                title,
                description,
                price,
                amenities,
                bookingPricePerDay: bookingPrice,
                capacity,
                type,
                owner: { id: user.id },
            }),
        });

        if (response.ok) {
            alert("Property added successfully.");
            loadProperties();
        } else {
            const errorData = await response.json();
            console.error("Error response:", errorData);
            alert("Failed to add property. Please check your inputs.");
        }
    } catch (error) {
        console.error("Error adding property:", error);
        alert("Failed to add property. Please try again.");
    }
}

function logout() {
    userExit();
    localStorage.clear();
    window.location.href = "index.html";
}

function showEditPropertyModal(id) {
    editingPropertyId = id;

    // Получить текущие данные свойства
    const property = properties.find((prop) => prop.id === id);
    if (!property) return;

    // Установить текущие значения в поля
    document.getElementById("edit-property-title").value = property.title;
    document.getElementById("edit-property-description").value = property.description;
    document.getElementById("edit-property-price").value = property.price;
    document.getElementById("edit-property-amenities").value = property.amenities;
    document.getElementById("edit-property-booking-price").value = property.bookingPricePerDay;
    document.getElementById("edit-property-capacity").value = property.capacity;
    document.getElementById("edit-property-type").value = property.type;

    document.getElementById("edit-property-modal").style.display = "block";
}


function closeEditModal() {
    document.getElementById("edit-property-modal").style.display = "none";
}

function editProperty(propertyId) {
    // Получить данные о свойстве
    fetch(`http://localhost:8080/properties/${propertyId}`)
        .then(response => response.json())
        .then(property => {

            // Заполнить поля модального окна значениями из объекта property
            document.getElementById("edit-property-title").value = property.title;
            document.getElementById("edit-property-description").value = property.description;
            document.getElementById("edit-property-price").value = property.price;
            document.getElementById("edit-property-amenities").value = property.amenities;
            document.getElementById("edit-property-booking-price").value = property.bookingPricePerDay;
            document.getElementById("edit-property-capacity").value = property.capacity;
            document.getElementById("edit-property-type").value = property.type;


            // Открыть модальное окно редактирования
            const modal = document.getElementById("edit-property-modal");
            modal.style.display = "block";

            // Сохранить ID свойства для использования при сохранении изменений
            window.propertyToEdit = propertyId;  // Убедитесь, что ID сохраняется
        })
        .catch(error => {
            console.error("Error loading property for editing:", error);
            alert("Failed to load property for editing.");
        });
}

// Функция для открытия модального окна подтверждения удаления
function confirmDelete(propertyId) {
    // Открыть модальное окно
    const modal = document.getElementById("delete-property-modal");
    modal.style.display = "block";

    // Сохранить ID для удаления в переменной
    window.propertyToDelete = propertyId;
}

async function saveEditedProperty() {
    const title = document.getElementById("edit-property-title").value.trim();
    const description = document.getElementById("edit-property-description").value.trim();
    const price = parseFloat(document.getElementById("edit-property-price").value);
    const amenities = document.getElementById("edit-property-amenities").value.trim();
    const bookingPrice = parseFloat(document.getElementById("edit-property-booking-price").value);
    const capacity = parseInt(document.getElementById("edit-property-capacity").value, 10);
    const type = document.getElementById("edit-property-type").value.toUpperCase();

    if (!title || !description || isNaN(price) || isNaN(bookingPrice) || isNaN(capacity) || !type) {
        alert("Please fill in all fields correctly.");
        return;
    }

    if (price <= 0 || price > 10000) {
        alert("Property price must be a positive number and not greater than 10000.");
        return;
    }

    if (bookingPrice <= 0 || bookingPrice > 10000) {
        alert("Booking price must be a positive number and not greater than 10000.");
        return;
    }

    if (capacity <= 0 || capacity > 20) {
        alert("Capacity must be a positive integer and not greater than 20.");
        return;
    }

    // Создаем объект с измененными данными
    const updatedProperty = {
        title,
        description,
        price,
        amenities,
        bookingPricePerDay: bookingPrice,
        capacity,
        type
    };

    // Используем ID, которое мы сохранили в window.propertyToEdit
    const propertyId = window.propertyToEdit;

    if (!propertyId) {
        console.error("Property ID is missing.");
        alert("Property ID is missing.");
        return;
    }

    try {
        const response = await fetch(`http://localhost:8080/properties/${propertyId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedProperty)
        });

        if (response.ok) {
            alert("Property updated successfully.");
            loadProperties(); // Перезагрузить список свойств
        } else {
            const errorData = await response.json();
            console.error("Error response:", errorData);
            alert("Failed to update property.");
        }
    } catch (error) {
        console.error("Error updating property:", error);
        alert("Failed to update property. Please try again.");
    }

    // Закрыть модальное окно
    closeEditModal();
}



function confirmDeleteProperty(id) {
    deletingPropertyId = id;
    document.getElementById("delete-property-modal").style.display = "block";
}

function closeDeleteModal() {
    const modal = document.getElementById("delete-property-modal");
    modal.style.display = "none";
}

async function deleteConfirmedProperty() {
    try {
        // Отправить запрос на удаление свойства по ID
        const response = await fetch(`http://localhost:8080/properties/${window.propertyToDelete}`, {
            method: "DELETE"
        });

        if (response.ok) {
            alert("Property deleted successfully.");
            loadProperties(); // Перезагрузить список свойств
        } else {
            alert("Failed to delete property.");
        }
    } catch (error) {
        console.error("Error deleting property:", error);
        alert("Failed to delete property. Please try again.");
    }

    // Закрыть модальное окно
    closeDeleteModal();
}

async function loadSalesStatistics() {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user.id) {
        alert("User information is missing.");
        return;
    }

    try {
        const response = await fetch(`http://localhost:8080/bookings/owner/${user.id}/statistics`);
        if (!response.ok) {
            throw new Error(`Failed to load sales statistics: ${response.statusText}`);
        }

        const statistics = await response.json();
        document.getElementById("total-sales-month").textContent = statistics.totalSalesThisMonth.toFixed(2) || 0;
        document.getElementById("total-sales-year").textContent = statistics.totalSalesThisYear.toFixed(2) || 0;
        document.getElementById("expected-payments-next-month").textContent = statistics.expectedPaymentsNextMonth.toFixed(2) || 0;
        document.getElementById("expected-payments-next-year").textContent = statistics.expectedPaymentsNextYear.toFixed(2) || 0;
        document.getElementById("average-monthly-income").textContent = statistics.averageMonthlyIncome.toFixed(2) || 0;

        document.getElementById("sales-statistics").style.display = "block";
    } catch (error) {
        console.error("Error loading sales statistics:", error);
        alert("Failed to load sales statistics. Please try again later.");
    }
}

function closeSalesStatistics() {
    document.getElementById("sales-statistics").style.display = "none";
}

function goToOwnerDashboard() {
    window.location.href = "owner_account.html";
}

async function userExit() {
    try {
        const response = await fetch("http://localhost:8080/server/exit", {
            method: "POST",
        });
        if (response.ok) {
            console.log("User exited.");
        } else {
            console.error("Failed to decrease active users.");
        }
    } catch (error) {
        console.error("Error updating active users:", error);
    }
}
