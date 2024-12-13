document.addEventListener("DOMContentLoaded", () => {
    loadProperties();
    loadBookings();
});

// Функция для загрузки всех бронирований
async function loadBookings() {
    const user = JSON.parse(sessionStorage.getItem("user"));

    try {
        const response = await fetch(`http://localhost:8080/bookings?userId=${user.id}`);
        if (!response.ok) {
            throw new Error(`Failed to load bookings: ${response.statusText}`);
        }

        const bookings = await response.json();

        const bookingList = document.getElementById("booking-list");
        bookingList.innerHTML = bookings
            .map(
                (booking) => `
                <div>
                    <h3>${booking.property.title}</h3>
                    <p>Start Date: ${booking.startDate}</p>
                    <p>End Date: ${booking.endDate}</p>
                    <p>Total Price: $${booking.totalPrice}</p>
                    <p>Status: ${booking.status}</p>
                    <button onclick="deleteBooking(${booking.id})">Delete Booking</button>
                </div>
            `
            )
            .join("");
    } catch (error) {
        console.error("Error loading bookings:", error);
        alert("Failed to load bookings. Please try again later.");
    }
}

// Функция для удаления бронирования
async function deleteBooking(bookingId) {
    const user = JSON.parse(sessionStorage.getItem("user"));
    
    // Подтверждение удаления бронирования
    const confirmDelete = confirm("Are you sure you want to delete this booking?");
    if (!confirmDelete) return;

    try {
        const response = await fetch(`http://localhost:8080/bookings/${bookingId}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
        });

        if (response.ok) {
            alert("Booking deleted successfully.");
            loadBookings(); // Перезагружаем список бронирований
        } else {
            alert("Failed to delete booking.");
        }
    } catch (error) {
        console.error("Error deleting booking:", error);
        alert("Failed to delete booking. Please try again later.");
    }
}

async function loadProperties() {
    const user = JSON.parse(sessionStorage.getItem("user"));
    if (!user || user.role !== "TENANT") {
        window.location.href = "index.html";
        return;
    }

    document.getElementById("tenant-name").textContent = user.fullName;

    try {
        const response = await fetch("http://localhost:8080/properties");
        if (!response.ok) {
            throw new Error(`Failed to load properties: ${response.statusText}`);
        }

        const properties = await response.json();

        const propertyList = document.getElementById("property-list");
        propertyList.innerHTML = properties
            .map(
                (prop) => `
                <div class="property-card">
                    <h3>${prop.title}</h3>
                    <p>${prop.description}</p>
                    <p><strong>Property Price:</strong> $${prop.price}</p>
                    <p><strong>Booking Price per Day:</strong> $${prop.bookingPricePerDay}</p>
                    <p>Amenities: ${prop.amenities ? prop.amenities.join(", ") : "None"}</p>
                    <div>
                        <h4>Reviews:</h4>
                        <ul>
                            ${prop.reviews
                                ?.map(
                                    (review) => `
                                    <li>
                                        <strong>${review.user?.fullName || "Anonymous"}:</strong>
                                        ${review.comment} (Rating: ${review.rating})
                                    </li>
                                `
                                )
                                .join("") || "No reviews yet"}
                        </ul>
                    </div>
                    <button onclick="showReviewForm(${prop.id})">Add Review</button>
                    <button onclick="showBookingForm(${prop.id})">Book Property</button>
                </div>
            `
            )
            .join("");
    } catch (error) {
        console.error("Error loading properties:", error);
        alert("Failed to load properties. Please try again later.");
    }
}

function showReviewForm(propertyId) {
    document.getElementById("add-review-form").style.display = "block";
    document.getElementById("add-review-form").dataset.propertyId = propertyId;
}

async function addReview() {
    const comment = document.getElementById("review-comment").value;
    const rating = document.getElementById("review-rating").value;
    const propertyId = document.getElementById("add-review-form").dataset.propertyId;

    if (!comment || !rating || !propertyId) {
        alert("Please fill in all fields.");
        return;
    }

    const user = JSON.parse(sessionStorage.getItem("user"));
    const reviewData = {
        comment,
        rating: parseInt(rating),
        user: { id: user.id },
        property: { id: parseInt(propertyId) },
    };

    try {
        const response = await fetch(`http://localhost:8080/properties/${propertyId}/reviews`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(reviewData),
        });

        if (response.ok) {
            alert("Review added successfully!");
            loadProperties();
        } else {
            alert("Failed to add review.");
        }
    } catch (error) {
        console.error("Error adding review:", error);
    }
}

function showBookingForm(propertyId) {
    document.getElementById("add-booking-form").style.display = "block";
    document.getElementById("add-booking-form").dataset.propertyId = propertyId;
}

async function addBooking() {
    const startDate = document.getElementById("booking-start-date").value;
    const endDate = document.getElementById("booking-end-date").value;
    const propertyId = document.getElementById("add-booking-form").dataset.propertyId;

    if (!startDate || !endDate || !propertyId) {
        alert("Please fill in all fields.");
        return;
    }

    const user = JSON.parse(sessionStorage.getItem("user"));
    const bookingData = {
        startDate,
        endDate,
        user: { id: user.id },
        property: { id: parseInt(propertyId) },
    };

    try {
        const response = await fetch("http://localhost:8080/bookings", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(bookingData),
        });

        if (response.ok) {
            alert("Booking successful!");
            loadBookings();
        } else {
            alert("Failed to book the property.");
        }
    } catch (error) {
        console.error("Error booking property:", error);
    }
}

function logout() {
    sessionStorage.clear();
    window.location.href = "index.html";
}
