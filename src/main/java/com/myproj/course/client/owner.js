document.addEventListener("DOMContentLoaded", loadProperties);

async function loadProperties() {
    const user = JSON.parse(sessionStorage.getItem("user"));
    if (!user || user.role !== "OWNER") {
        window.location.href = "index.html";
    }

    // Display owner's full name
    document.getElementById("owner-name").textContent = user.fullName;

    try {
        const response = await fetch(`http://localhost:8080/properties/owner/${user.id}`);
        const properties = await response.json();

        if (!Array.isArray(properties)) {
            throw new Error("Expected an array of properties");
        }

        const propertyList = document.getElementById("property-list");
        propertyList.innerHTML = properties
            .map(
                (prop) => `
                <div class="property-item">
                    <h3>${prop.title}</h3>
                    <p><strong>Description:</strong> ${prop.description}</p>
                    <p><strong>Property Price:</strong> ${prop.price} USD</p>
                    <p><strong>Booking Price:</strong> ${prop.bookingPricePerDay} USD per day</p>
                    <p><strong>Amenities:</strong> ${prop.amenities.join(", ")}</p>
                    <div id="bookings-${prop.id}">
                        <!-- Список бронирований будет отображаться здесь -->
                    </div>
                </div>
            `
            )
            .join("");

        // Загрузка бронирований для каждого свойства
        properties.forEach((property) => {
            loadBookings(property.id);
        });

    } catch (error) {
        console.error("Error loading properties:", error);
        alert("Failed to load properties. Please try again later.");
    }
}

async function loadBookings(propertyId) {
    const user = JSON.parse(sessionStorage.getItem("user"));

    try {
        const response = await fetch(`http://localhost:8080/bookings/owner/${user.id}`);
        const bookings = await response.json();

        if (!Array.isArray(bookings)) {
            throw new Error('Expected an array of bookings');
        }

        const bookingsContainer = document.getElementById(`bookings-${propertyId}`);
        const propertyBookings = bookings.filter((booking) => booking.property.id === propertyId);

        // Заголовок Bookings
        if (propertyBookings.length > 0) {
            bookingsContainer.innerHTML = `
                <h4>Bookings</h4>
                ${propertyBookings
                    .map(
                        (booking) => `
                            <div>
                                <p><strong>User:</strong> ${booking.user.fullName}</p>
                                <p><strong>Start Date:</strong> ${booking.startDate}</p>
                                <p><strong>End Date:</strong> ${booking.endDate}</p>
                                <p><strong>Status:</strong> ${booking.status}</p>
                                <p><strong>Total Price:</strong> ${booking.totalPrice} USD</p>
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
    const title = document.getElementById("property-title").value;
    const description = document.getElementById("property-description").value;
    const price = document.getElementById("property-price").value;
    const amenities = document.getElementById("property-amenities").value.split(",");
    const bookingPrice = document.getElementById("property-booking-price").value;

    const user = JSON.parse(sessionStorage.getItem("user"));
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
                price: parseFloat(price),
                amenities,
                bookingPricePerDay: parseFloat(bookingPrice),
                owner: { id: user.id }
            }),
        });

        if (response.ok) {
            alert("Property added successfully.");
            loadProperties();
        } else {
            alert("Failed to add property. Please check your inputs.");
        }
    } catch (error) {
        console.error("Error adding property:", error);
        alert("Failed to add property. Please try again.");
    }
}

async function deleteProperty(id) {
    try {
        await fetch(`http://localhost:8080/properties/${id}`, { method: "DELETE" });
        loadProperties();
    } catch (error) {
        console.error("Error deleting property:", error);
        alert("Failed to delete property. Please try again.");
    }
}

function logout() {
    sessionStorage.clear();
    window.location.href = "index.html";
}
