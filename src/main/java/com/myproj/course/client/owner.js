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
                    <div id="bookings-${prop.id}">
                        <!-- Bookings will be loaded here -->
                    </div>
                </div>
            `
            )
            .join("");

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
    const title = document.getElementById("property-title").value;
    const description = document.getElementById("property-description").value;
    const price = document.getElementById("property-price").value;
    const amenities = document.getElementById("property-amenities").value;
    const bookingPrice = document.getElementById("property-booking-price").value;
    const capacity = document.getElementById("property-capacity").value;
    const type = document.getElementById("property-type").value;

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
                capacity: parseInt(capacity),
                type,
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
