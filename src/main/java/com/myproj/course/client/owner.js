document.addEventListener("DOMContentLoaded", loadProperties);

async function loadProperties() {
    const user = JSON.parse(sessionStorage.getItem("user"));
    if (!user || user.role !== "OWNER") {
        window.location.href = "index.html";
    }

    // Display owner's full name
    document.getElementById("owner-name").textContent = user.fullName;

    try {
        const response = await fetch("http://localhost:8080/properties");
        const properties = await response.json();

        const propertyList = document.getElementById("property-list");
        propertyList.innerHTML = properties
            .filter((prop) => prop.owner?.id === user.id) // Only display properties owned by the user
            .map(
                (prop) => `
                <div>
                    <h3>${prop.title}</h3>
                    <p>${prop.description}</p>
                    <p>Price: ${prop.price}</p>
                    <p>Amenities: ${prop.amenities.join(", ")}</p>
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
                    <button onclick="deleteProperty(${prop.id})">Delete Property</button>
                </div>
            `
            )
            .join("");
    } catch (error) {
        console.error("Error loading properties:", error);
        alert("Failed to load properties. Please try again later.");
    }
}

async function addProperty() {
    const title = document.getElementById("property-title").value;
    const description = document.getElementById("property-description").value;
    const price = document.getElementById("property-price").value;
    const amenities = document.getElementById("property-amenities").value.split(",");

    const user = JSON.parse(sessionStorage.getItem("user"));
    if (!user || !user.id) {
        alert("User information is missing.");
        return;
    }

    try {
        await fetch("http://localhost:8080/properties", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                title,
                description,
                price,
                amenities,
                owner: { id: user.id }
            }),
        });

        loadProperties();
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
