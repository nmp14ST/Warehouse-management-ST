const businessesBtn = document.getElementById("businesses");
const warehousesBtn = document.getElementById("warehouses");

const markupArray = ['<ul>']
let data;

// Functions to get and add businesses to html
const getBusinesses = async () => {
    const response = await fetch("/api/businesses", {
        method: "GET"
    });

    if (response.status === 200) {
        return await response.json();
    }
}

// Switch case for traversing through the data
const createList = (items) => {
    switch (typeof items) {
        case "object":
            getDetails(items);
            break;
    }
};

// get details
const getDetails = (details) => {
    // iterate over the detail items of object
    markupArray.push(`<li><div class="list-div">`);
    for (const detail in details) {
        // fetch the value of each item
        if (detail == "children" && details[detail].length > 0) {
            markupArray.push("</div><ul>");
            details[detail].forEach((element) => {
                getDetails(element);
            });
            markupArray.push("</ul>");
        } else if (detail === "__v" || detail === "_id") {
            // skip
        } else {
            if (detail === "warehouses") {
                markupArray.push(`<span data-id=${details["_id"]} class="span-btn">${detail}: ${details[detail]} </span>`);
            } else {
                markupArray.push(`<span>${details[detail]} </span>`);
            }
        }
    }
    markupArray.push("</li>");
};

// Get businessses, add to html, and add event listener for getting warehouses specific to that company
const appendBusinesses = async (e) => {
    // If button click to get business, prevent default
    e ? e.preventDefault() : null;

    // Get businesses from db
    data = await getBusinesses();

    createList(data);
    markupArray.push("</ul>");
    document.querySelector(".right-panel").innerHTML = markupArray.join("");

    // Add event listener to warehouse buttons on businesses
    const spanBtns = document.querySelectorAll(".span-btn");

    if (spanBtns.length) {
        spanBtns.forEach(btn => {
            btn.addEventListener("click", getWarehouses);
        });
    }
}

// Functions to get warehouses and add to html
// Get warehouses
const getWarehouses = (e) => {
    e.preventDefault();

    const id = e.target.getAttribute("data-id");
    console.log(id);
}

// Call business function on window load
window.onload = async () => {
    await appendBusinesses();
};

// LEft-nav-panel button events for changing interface

businessesBtn.addEventListener("click", appendBusinesses);