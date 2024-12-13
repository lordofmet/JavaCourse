document.addEventListener("DOMContentLoaded", () => {
    loadBasket();
});

async function loadBasket() {
    const user = JSON.parse(sessionStorage.getItem("user"));

    try {
        const response = await fetch(`http://localhost:8080/baskets/${user.id}`);
        if (!response.ok) {
            throw new Error(`Failed to load basket: ${response.statusText}`);
        }

        const basket = await response.json();

        if (!basket || !basket.bookings) {
            console.error("Error: Basket or bookings not found.");
            document.getElementById("basket-list").innerHTML = "<p>Your basket is empty.</p>";
            return;
        }

        const basketList = document.getElementById("basket-list");
        basketList.innerHTML = basket.bookings
            .map(
                (booking) => `
                <div class="basket-item">
                    <h3>${booking.property.title}</h3>
                    <p>Start Date: ${booking.startDate}</p>
                    <p>End Date: ${booking.endDate}</p>
                    <p>Total Price: $${booking.totalPrice}</p>
                    <div class="action-buttons">
                        <button onclick="removeFromBasket(${booking.id})">Remove</button>
                    </div>
                </div>
            `
            )
            .join("");
    } catch (error) {
        console.error("Error loading basket:", error);
        alert("Failed to load basket.");
    }
}


async function removeFromBasket(bookingId) {
    const user = JSON.parse(sessionStorage.getItem("user"));

    try {
        const response = await fetch(`http://localhost:8080/baskets/${user.id}/remove/${bookingId}`, {
            method: "DELETE",
        });

        if (response.ok) {
            alert("Booking removed from basket.");
            loadBasket();
        } else {
            alert("Failed to remove booking.");
        }
    } catch (error) {
        console.error("Error removing booking:", error);
    }
}

function goBack() {
    window.location.href = "tenant.html";
}
