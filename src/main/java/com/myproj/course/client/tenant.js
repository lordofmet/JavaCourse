document.addEventListener("DOMContentLoaded", loadProperties);

async function loadProperties() {
    const user = JSON.parse(sessionStorage.getItem("user"));
    if (!user || user.role !== "TENANT") {
        window.location.href = "index.html";
        return;
    }

    // Display full name
    document.getElementById("tenant-name").textContent = user.fullName;

    try {
        // Fetch properties from server
        const response = await fetch("http://localhost:8080/properties");
        if (!response.ok) {
            throw new Error(`Failed to load properties: ${response.statusText}`);
        }

        const properties = await response.json();

        if (!Array.isArray(properties)) {
            throw new Error("Received data is not an array");
        }

        const propertyList = document.getElementById("property-list");
        propertyList.innerHTML = properties
            .map(
                (prop) => `
                <div>
                    <h3>${prop.title}</h3>
                    <p>${prop.description}</p>
                    <p>Price: ${prop.price}</p>
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
        user: { id: user.id }, // устанавливаем ID пользователя
        property: { id: parseInt(propertyId) } // устанавливаем ID свойства
    };

    const response = await fetch(`http://localhost:8080/properties/${propertyId}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reviewData)
    });

    if (response.ok) {
        alert("Review added successfully!");
        loadProperties(); // перезагрузить список после добавления отзыва
    } else {
        alert("Failed to add review.");
    }
}

function logout() {
    sessionStorage.clear();
    window.location.href = "index.html";
}
