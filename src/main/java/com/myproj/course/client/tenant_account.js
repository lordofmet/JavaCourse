document.addEventListener("DOMContentLoaded", loadTenantProfile);

async function loadTenantProfile() {
    const user = JSON.parse(sessionStorage.getItem("user"));
    if (!user || user.role !== "TENANT") {
        window.location.href = "index.html";
        return;
    }

    document.getElementById("tenant-username").value = user.username;
    document.getElementById("tenant-fullName").value = user.fullName;
    document.getElementById("tenant-email").value = user.email;
    document.getElementById("tenant-password").value = user.password;
}

async function updateTenantProfile() {
    const user = JSON.parse(sessionStorage.getItem("user"));
    const updatedData = {
        username: document.getElementById("tenant-username").value,
        fullName: document.getElementById("tenant-fullName").value,
        email: document.getElementById("tenant-email").value,
        password: document.getElementById("tenant-password").value
    };

    try {
        const response = await fetch(`http://localhost:8080/users/${user.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedData),
        });

        if (response.ok) {
            alert("Profile updated successfully.");
            loadTenantProfile(); // Refresh to show updated information
        } else {
            const errorData = await response.json();
            alert("Failed to update profile: " + errorData.message);
        }
    } catch (error) {
        console.error("Error updating profile:", error);
        alert("Failed to update profile. Please try again later.");
    }
}

async function loadOrderHistory() {
    const user = JSON.parse(sessionStorage.getItem("user"));
    if (!user || !user.id) {
        alert("User information is missing.");
        return;
    }

    try {
        const response = await fetch(`http://localhost:8080/bookings/user/${user.id}`);
        if (!response.ok) {
            throw new Error(`Failed to load order history: ${response.statusText}`);
        }

        const orders = await response.json();
        const orderHistoryContainer = document.getElementById("order-history");
        orderHistoryContainer.innerHTML = orders.map(order => `
            <div>
                <p><strong>Property:</strong> ${order.property.title || "Unknown"}</p>
                <p><strong>Start Date:</strong> ${order.startDate}</p>
                <p><strong>End Date:</strong> ${order.endDate}</p>
                <p><strong>Status:</strong> ${order.status}</p>
                <p><strong>Total Price:</strong> ${order.totalPrice}</p>
            </div>
        `).join("");

        orderHistoryContainer.style.display = "block";
    } catch (error) {
        console.error("Error loading order history:", error);
        alert("Failed to load order history. Please try again later.");
    }
}

function logout() {
    sessionStorage.clear();
    window.location.href = "index.html";
}
