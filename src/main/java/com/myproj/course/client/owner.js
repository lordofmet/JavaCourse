document.addEventListener("DOMContentLoaded", loadProperties);

async function loadProperties() {
    const user = JSON.parse(sessionStorage.getItem("user"));
    if (!user || user.role !== "OWNER") {
        window.location.href = "index.html";
    }

    // Display full name
    document.getElementById("owner-name").textContent = user.fullName;

    const response = await fetch("http://localhost:8080/properties");
    const properties = await response.json();

    const propertyList = document.getElementById("property-list");
    propertyList.innerHTML = properties
        .map(
            (prop) => `
            <div>
                <h3>${prop.title}</h3>
                <p>${prop.description}</p>
                <p>Price: ${prop.price}</p>
                <p>Amenities: ${prop.amenities.join(", ")}</p>
                <button onclick="deleteProperty(${prop.id})">Delete</button>
            </div>
        `
        )
        .join("");
}

async function addProperty() {
    const title = document.getElementById("property-title").value;
    const description = document.getElementById("property-description").value;
    const price = document.getElementById("property-price").value;
    const amenities = document.getElementById("property-amenities").value.split(",");

    await fetch("http://localhost:8080/properties", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, price, amenities }),
    });

    loadProperties();
}

async function deleteProperty(id) {
    await fetch(`http://localhost:8080/properties/${id}`, { method: "DELETE" });
    loadProperties();
}

function logout() {
    sessionStorage.clear();
    window.location.href = "index.html";
}