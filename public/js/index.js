// Redirect if not logged in
if (!localStorage.getItem("user")) {
    document.location.href = "/login";
}