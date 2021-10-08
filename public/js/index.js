const navExpand = document.querySelector(".nav__expand");
const nav = document.querySelector(".left-nav");
const navListItem = document.querySelectorAll(".nav-list-item");
const rightPanel = document.querySelector(".right-panel");

// Redirect if not logged in
if (!localStorage.getItem("user")) {
    document.location.href = "/login";
}

// Expand and close left-nav bar
navExpand.addEventListener("click", () => {
    nav.classList.toggle("closed");
    rightPanel.classList.toggle("closed-left");
});

//  Change active list item in left nav bar
function listActive(e) {
    navListItem.forEach(link => {
        link.classList.remove("nav-list-item-active");
        this.classList.add("nav-list-item-active");
    });
}

//  Event listener for each list item
navListItem.forEach(link => {
    link.addEventListener("click", listActive);
});