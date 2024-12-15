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
        password: document.getElementById("tenant-password").value,
    };

    try {
        const response = await fetch(`http://localhost:8080/users/${user.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedData),
        });

        if (response.ok) {
            alert("Profile updated successfully.");
            loadTenantProfile();
        } else {
            const errorData = await response.json();
            alert("Failed to update profile: " + errorData.message);
        }
    } catch (error) {
        console.error("Error updating profile:", error);
        alert("Failed to update profile. Please try again later.");
    }
}

async function toggleOrderHistory() {
    const orderHistory = document.getElementById("order-history");
    const button = document.getElementById("toggle-order-history");

    if (orderHistory.style.display === "none") {
        await loadOrderHistory();
        orderHistory.style.display = "block";
        button.textContent = "Close";
    } else {
        orderHistory.style.display = "none";
        button.textContent = "Show Order History";
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
        orderHistoryContainer.innerHTML = orders
            .map(order => `
                <div class="order-card" style="border: 1px solid #ddd; padding: 15px; margin: 10px; border-radius: 8px; background-color: #f9f9f9;">
                    <h3>${order.property?.title || "Unknown Property"}</h3>
                    <p><strong>Start Date:</strong> ${order.startDate || "N/A"}</p>
                    <p><strong>End Date:</strong> ${order.endDate || "N/A"}</p>
                    <p><strong>Status:</strong> ${order.status || "Unknown"}</p>
                    <p><strong>Total Price:</strong> $${order.totalPrice || 0}</p>
                </div>
            `)
            .join("");
    } catch (error) {
        console.error("Error loading order history:", error);
        alert("Failed to load order history. Please try again later.");
    }
}

function logout() {
    userExit();
    sessionStorage.clear();
    window.location.href = "index.html";
}

function goToHomePage() {
    window.location.href = "tenant.html"; // ”кажите URL вашей главной страницы
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
