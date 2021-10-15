// Get company name from query string
const companyName = document.location.href.split("=")[1].trim();
// Submiot form button
const submitBtn = document.getElementById("submitBtn");

const addCompanyFetch = async (e) => {
    e.preventDefault();

    // Get token for authentication
    const userAuth = JSON.parse(localStorage.getItem("user"));

    const body = {
        name: document.getElementById("name").value.trim(),
        founded: document.getElementById("founded").value,
        parent: companyName
    }

    const response = await fetch("/api/businesses", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${userAuth.token}` },
        body: JSON.stringify(body)
    });

    const data = await response.json();

    // Add error message if not successful
    if (response.status !== 200) {
        const p = document.createElement("p");
        p.classList.add("text-center", "form-error");
        p.textContent = data.message;

        document.querySelector("form").appendChild(p);
        return
    }

    // Redirect to app if success
    document.location.href = "/interface";
}

submitBtn.addEventListener("click", addCompanyFetch);