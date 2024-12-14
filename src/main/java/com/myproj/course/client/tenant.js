document.addEventListener("DOMContentLoaded", () => {
    loadProperties();
    loadBookings();
});

async function loadBookings() {
    const user = JSON.parse(sessionStorage.getItem("user"));
    if (!user || !user.id) {
        console.error("User information is missing or invalid.");
        return;
    }

    try {
        const response = await fetch(`http://localhost:8080/bookings?userId=${user.id}`);
        if (!response.ok) {
            throw new Error(`Failed to load bookings: ${response.statusText}`);
        }

        const bookings = await response.json();
        const bookingList = document.getElementById("booking-list");
        const bookingSection = document.getElementById("booking-section");
        const bookingHeader = document.getElementById("booking-header");

        // Фильтрация бронирований с статусом "Paid"
        const paidBookings = bookings.filter(booking => booking.status === "Paid");

        if (paidBookings.length === 0) {
            // Если нет оплаченных бронирований, скрыть раздел
            bookingSection.style.display = "none";
        } else {
            // Если есть оплаченные бронирования, показываем их
            bookingHeader.style.display = "block";
            bookingList.innerHTML = paidBookings
                .map(
                    (booking) => `
                    <div>
                        <h3>${booking.property?.title || "Unknown Property"}</h3>
                        <p>Start Date: ${booking.startDate || "N/A"}</p>
                        <p>End Date: ${booking.endDate || "N/A"}</p>
                        <p>Total Price: $${booking.totalPrice || 0}</p>
                        <p>Status: ${booking.status || "Unknown"}</p>
                    </div>
                `
                )
                .join("");
        }
    } catch (error) {
        console.error("Error loading bookings:", error);
        alert("Failed to load bookings. Please try again later.");
    }
}

async function payForBasket() {
    const user = JSON.parse(sessionStorage.getItem("user"));
    if (!user || !user.id) {
        alert("User information is missing.");
        return;
    }

    try {
        const response = await fetch(`http://localhost:8080/${user.id}/pay`, {
            method: "POST",
        });

        if (response.ok) {
            alert("Payment successful!");
            loadBookings(); // Reload bookings to show updated statuses
        } else {
            alert("Payment failed. Please try again later.");
        }
    } catch (error) {
        console.error("Error processing payment:", error);
        alert("Payment failed. Please try again later.");
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

    document.getElementById("tenant-name").textContent = user.fullName || "Tenant";

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
                    <h3>${prop.title || "Untitled Property"}</h3>
                    <p>${prop.description || "No description provided."}</p>
                    <p><strong>Property Price:</strong> $${prop.price || 0}</p>
                    <p><strong>Booking Price per Day:</strong> $${prop.bookingPricePerDay || 0}</p>
                    <p><strong>Type:</strong> ${prop.type || "Unknown"}</p>
                    <p><strong>Capacity:</strong> ${prop.capacity || "N/A"}</p>
                    <p>Amenities: ${prop.amenities || "None"}</p>
                    <div>
                        <h4>Reviews:</h4>
                        <ul>
                            ${
                                prop.reviews?.length
                                    ? prop.reviews
                                          .map(
                                              (review) => `
                                    <li>
                                        <strong>${review.user?.fullName || "Anonymous"}:</strong>
                                        ${review.comment || "No comment"} (Rating: ${review.rating || "N/A"})
                                    </li>
                                `
                                          )
                                          .join("")
                                    : "No reviews yet"
                            }
                        </ul>
                        <p><strong>Average Rating:</strong> ${prop.averageRating.toFixed(1) || "N/A"}</p>
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
            document.getElementById("add-review-form").style.display = "none"; // Закрыть форму
            loadProperties();
        } else {
            alert("Failed to add review.");
        }
    } catch (error) {
        console.error("Error adding review:", error);
    }
}

function showReviewForm(propertyId) {
    const form = document.getElementById("add-review-form");
    form.style.display = "block";
    form.dataset.propertyId = propertyId;
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
        const bookingResponse = await fetch("http://localhost:8080/bookings", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(bookingData),
        });

        if (bookingResponse.ok) {
            const booking = await bookingResponse.json();
            await addToBasket(user.id, booking.id);
            alert("Booking successful!");
            document.getElementById("add-booking-form").style.display = "none"; // Закрыть форму
            loadBookings();
        } else {
            alert("Failed to book the property.");
        }
    } catch (error) {
        console.error("Error booking property:", error);
    }
}

function showBookingForm(propertyId) {
    const form = document.getElementById("add-booking-form");
    form.style.display = "block";
    form.dataset.propertyId = propertyId;
}

async function addToBasket(userId, bookingId) {
    try {
        const response = await fetch(`http://localhost:8080/baskets/${userId}/add/${bookingId}`, {
            method: "POST",
        });
        if (!response.ok) {
            console.error("Failed to add booking to basket.");
        }
    } catch (error) {
        console.error("Error adding to basket:", error);
    }
}


function logout() {
    sessionStorage.clear();
    window.location.href = "index.html";
}

function goToBasket() {
    window.location.href = "basket.html";
}
