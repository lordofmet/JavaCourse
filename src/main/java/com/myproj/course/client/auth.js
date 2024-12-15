async function login() {
    const username = document.getElementById("login-username").value;
    const password = document.getElementById("login-password").value;

    const response = await fetch("http://localhost:8080/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
    });

    if (response.ok) {
        const user = await response.json();
        sessionStorage.setItem("user", JSON.stringify(user));
        userEnter();
        if (user.role === "OWNER") {
            window.location.href = "owner.html";
        } else if (user.role === "TENANT") {
            window.location.href = "tenant.html";
        }
    } else {
        alert("Login failed.");
    }
}

async function register() {
    const fullName = document.getElementById("register-fullname").value;
    const username = document.getElementById("register-username").value;
    const password = document.getElementById("register-password").value;
    const email = document.getElementById("register-email").value;
    const role = document.getElementById("register-role").value;

    const response = await fetch("http://localhost:8080/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, username, password, email, role }),
    });

    if (response.ok) {
        alert("Registration successful. Please login.");
    } else {
        alert("Registration failed.");
    }
}

function logout() {
    sessionStorage.clear();
    window.location.href = "index.html";
    userExit();
}


async function userEnter() {
    try {
        const response = await fetch("http://localhost:8080/server/enter", {
            method: "POST",
        });
        if (response.ok) {
            console.log("User entered.");
        } else {
            console.error("Failed to increase active users.");
        }
    } catch (error) {
        console.error("Error updating active users:", error);
    }
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