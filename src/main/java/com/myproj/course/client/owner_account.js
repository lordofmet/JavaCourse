document.addEventListener("DOMContentLoaded", loadOwnerProfile);

async function loadOwnerProfile() {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || user.role !== "OWNER") {
        window.location.href = "index.html";
        return;
    }

    document.getElementById("owner-username").value = user.username;
    document.getElementById("owner-fullName").value = user.fullName;
    document.getElementById("owner-email").value = user.email;
}

async function updateOwnerProfile() {
    const user = JSON.parse(localStorage.getItem("user"));
    const updatedData = {
        username: document.getElementById("owner-username").value,
        fullName: document.getElementById("owner-fullName").value,
        email: document.getElementById("owner-email").value,
        password: document.getElementById("owner-password").value,
    };

    try {
        const response = await fetch(`http://localhost:8080/users/${user.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedData),
        });

        if (response.ok) {
            alert("Profile updated successfully.");
            loadOwnerProfile();
        } else {
            const errorData = await response.json();
            if (errorData.message) {
                alert(errorData.message);
            } else {
                alert("Failed to update profile. Please use another username or email.");
            }
        }
    } catch (error) {
        console.error("Error updating profile:", error);
        alert("Failed to update profile. Please try again later.");
    }
}

async function loadSalesStatistics() {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user.id) {
        alert("User information is missing.");
        return;
    }

    try {
        const response = await fetch(`http://localhost:8080/bookings/owner/${user.id}/statistics`);
        if (!response.ok) {
            throw new Error(`Failed to load sales statistics: ${response.statusText}`);
        }

        const statistics = await response.json();
        document.getElementById("total-sales-month").textContent = statistics.totalSalesThisMonth.toFixed(2) || 0;
        document.getElementById("total-sales-year").textContent = statistics.totalSalesThisYear.toFixed(2) || 0;
        document.getElementById("expected-payments-next-month").textContent = statistics.expectedPaymentsNextMonth.toFixed(2) || 0;
        document.getElementById("expected-payments-next-year").textContent = statistics.expectedPaymentsNextYear.toFixed(2) || 0;
        document.getElementById("average-monthly-income").textContent = statistics.averageMonthlyIncome.toFixed(2) || 0;

        document.getElementById("sales-statistics").style.display = "block";
    } catch (error) {
        console.error("Error loading sales statistics:", error);
        alert("Failed to load sales statistics. Please try again later.");
    }
}

function closeSalesStatistics() {
    document.getElementById("sales-statistics").style.display = "none";
}

function logout() {
    userExit();
    localStorage.clear();
    window.location.href = "index.html";
}

function goToHomePage() {
    window.location.href = "owner.html";
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