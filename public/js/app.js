const businessesBtn = document.getElementById("businesses");
const warehousesBtn = document.getElementById("warehouses");

let markupArray = [];
let cached = false;
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
    // If markupArray is empty add a ul, else return and array already made (psuedo cache)
    if (!markupArray.length) {
        markupArray = ["<ul>"];
    } else {
        console.log("Didnt query");
        return;
    }

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

    // Create html tree from data and if not cached (already build array for tree) add </ul> to end of list
    createList(data);
    if (!cached) {
        markupArray.push("</ul>");
    }
    // Set cached to true after html list has been made
    cached = true;

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

// Get all warehouses and create table on interface screen
const getAllWarehouses = (e) => {
    e.preventDefault();
}

// Call business function on window load
window.onload = async () => {
    await appendBusinesses();
};

// Left-nav-panel button events for changing interface
businessesBtn.addEventListener("click", appendBusinesses);
warehousesBtn.addEventListener("click", getAllWarehouses);