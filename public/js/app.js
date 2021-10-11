const businessesBtn = document.getElementById("businesses");
const warehousesBtn = document.getElementById("warehouses");

let businessMarkupArray = [];
let fullWarehouseList = [];
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
    // If businessMarkupArray is empty add a ul, else return and array already made (psuedo cache)
    if (!businessMarkupArray.length) {
        businessMarkupArray = ["<ul>"];
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
    businessMarkupArray.push(`<li><div class="list-div">`);
    for (const detail in details) {
        // fetch the value of each item
        if (detail == "children" && details[detail].length > 0) {
            businessMarkupArray.push("</div><ul>");
            details[detail].forEach((element) => {
                getDetails(element);
            });
            businessMarkupArray.push("</ul>");
        } else if (detail === "__v" || detail === "_id") {
            // skip
        } else {
            if (detail === "warehouses") {
                businessMarkupArray.push(`<span data-id=${details["_id"]} data-name="${details["name"]}" class="span-btn">${detail}: ${details[detail]} </span>`);
            } else {
                businessMarkupArray.push(`<span>${details[detail]} </span>`);
            }
        }
    }
    businessMarkupArray.push("</li>");
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
        businessMarkupArray.push("</ul>");
    }
    // Set cached to true after html list has been made
    cached = true;
    // Append to html
    document.querySelector(".right-panel").innerHTML = businessMarkupArray.join("");

    // Add event listener to warehouse buttons on businesses
    const spanBtns = document.querySelectorAll(".span-btn");

    if (spanBtns.length) {
        spanBtns.forEach(btn => {
            btn.addEventListener("click", getWarehouses);
        });
    }
}

// Functions to get warehouses and add to html
// Get warehouses for specific company
const getWarehouses = async (e) => {
    e.preventDefault();

    const name = e.target.getAttribute("data-name");

    const warehouses = await queryWarehouse(name);
    displayCompanyWarehouses(warehouses);
}

// Build html for the warehouses for a specific company 
const displayCompanyWarehouses = (wh) => {

};

// Fetch request for all warehouses of a specific company
const queryWarehouse = async (name) => {
    const response = await fetch(`/api/warehouses/${name}`, {
        method: "GET"
    });

    if (response.status === 404) {
        console.log("Cant find warehouses for " + name);
        return;
    }

    return response.json();
}

// Fetch request for all warehouses
const queryAllWarehouses = async () => {
    const response = await fetch("/api/warehouses", {
        method: "GET"
    });

    if (response.status !== 200) {
        console.log("Issues");
    }

    const warehouses = await response.json();

    return warehouses;
}

// Get all warehouses and create table on interface screen
const getAllWarehouses = async (e) => {
    e.preventDefault();

    // Get warehouse data if dont already have it
    if (!fullWarehouseList.length) {
        fullWarehouseList = await queryAllWarehouses();
    }
    // Create table of warehouses
    createWarehouseTable(fullWarehouseList);
}
// Create html table using warehouse list (wl)
const createWarehouseTable = (wl) => {
    // Create table element and headers
    const table = document.createElement("table");
    table.classList.add("warehouse-data");
    const headerRow = document.createElement("tr");
    headerRow.classList.add("header-row", "row");
    // Create headers from properties of first element
    for (const prop in wl[0]) {
        if (prop !== "__v" && prop !== "products") {
            const header = document.createElement("th");
            header.innerText = prop;
            headerRow.appendChild(header);
        }
    }
    table.appendChild(headerRow);

    // Create rows for each warehouse and add data
    for (const ele of wl) {
        const tr = document.createElement("tr");
        tr.classList.add("row");
        for (const prop in ele) {
            if (prop !== "__v" && prop !== "products") {
                const td = document.createElement("td");
                td.innerText = ele[prop];
                td.classList.add("table-data")
                tr.appendChild(td);
            }
        }
        table.appendChild(tr);
    }

    // Add table to page
    document.querySelector(".right-panel").innerHTML = "";
    document.querySelector(".right-panel").appendChild(table);
}

// Call business function on window load
window.onload = async () => {
    await appendBusinesses();
};

// Left-nav-panel button events for changing interface
businessesBtn.addEventListener("click", appendBusinesses);
warehousesBtn.addEventListener("click", getAllWarehouses);