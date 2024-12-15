document.addEventListener("DOMContentLoaded", () => {
    loadBasket();
});

async function loadBasket() {
    const user = JSON.parse(localStorage.getItem("user"));

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

        const unPaidBookings = basket.bookings.filter(booking => booking.status !== "Paid");

        if (unPaidBookings.length === 0) {
            basketList.innerHTML = "<p>Your basket contains only paid bookings.</p>";
        } else {
            basketList.innerHTML = unPaidBookings
                .map(
                    (booking) => `
                    <div class="basket-item">
                        <h3>${booking.property.title}</h3>
                        <p>Start Date: ${booking.startDate}</p>
                        <p>End Date: ${booking.endDate}</p>
                        <p>Total Price: $${booking.totalPrice.toFixed(2)}</p>
                        <div class="action-buttons">
                            <button onclick="removeFromBasket(${booking.id})">Remove</button>
                        </div>
                    </div>
                `
                )
                .join("");
        }
    } catch (error) {
        console.error("Error loading basket:", error);
        alert("Failed to load basket.");
    }
}

async function removeFromBasket(bookingId) {
    const user = JSON.parse(localStorage.getItem("user"));

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

async function payForBasket() {
    const user = JSON.parse(localStorage.getItem("user"));

    try {
        const response = await fetch(`http://localhost:8080/baskets/${user.id}/pay`, {
            method: "POST",
        });

        if (response.ok) {
            alert("Payment successful!");
            loadBasket();
        } else {
            alert("Failed to process payment.");
        }
    } catch (error) {
        console.error("Error processing payment:", error);
        alert("Payment failed.");
    }
}

function goBack() {
    window.location.href = "tenant.html";
}
