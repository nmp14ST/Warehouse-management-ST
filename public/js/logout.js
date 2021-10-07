const logoutBtn = document.getElementById("logoutBtn");

const logout = (e) => {
    e.preventDefault();

    localStorage.removeItem("user");
    document.location.href = "/login";
}

if (logoutBtn) {
    logoutBtn.addEventListener("click", logout);
}