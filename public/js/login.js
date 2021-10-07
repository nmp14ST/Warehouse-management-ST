const loginBtn = document.getElementById("loginBtn");
const formError = document.querySelector(".form-error");

if (localStorage.getItem("email")) {
    document.getElementById("email").value = localStorage.getItem("email");
}

const login = async (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    if (!email || !password) {
        formError.textContent = "Please provide a valid email and password.";
        return;
    }

    if (!email.includes("@") || !email.includes(".")) {
        formError.textContent = "Enter valid email";
        return;
    }

    const response = await fetch("/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    });

    const data = await response.json();
    console.log(data);

    if (response.status !== 200) {
        formError.textContent = data.message;
        return;
    }

    if (document.getElementById("rememberMe").checked) {
        localStorage.setItem("email", email);
    }

    localStorage.setItem("user", JSON.stringify(data));
    document.location.href = "/interface";
}

if (loginBtn) {
    loginBtn.addEventListener("click", login);
}