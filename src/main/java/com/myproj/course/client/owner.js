document.addEventListener("DOMContentLoaded", loadProperties);

async function loadProperties() {
    const user = JSON.parse(sessionStorage.getItem("user"));
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
                <div class="property-item">
                    <h3>${prop.title || "Untitled Property"}</h3>
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
            ${reviews
                .map(
                    (review) => `
                    <div>
                        <p><strong>User:</strong> ${review.user?.fullName || "Unknown"}</p>
                        <p><strong>Rating:</strong> ${review.rating || "No rating"}</p>
                        <p><strong>Comment:</strong> ${review.comment || "No comment"}</p>
                    </div>`
                )
                .join("")}
        `;
    } else {
        reviewsContainer.innerHTML = "No reviews yet.";
    }
}

async function loadBookings(propertyId) {
    const user = JSON.parse(sessionStorage.getItem("user"));
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
