const businessesBtn = document.getElementById("businesses");
const warehousesBtn = document.getElementById("warehouses");
const rightPanelSection = document.querySelector(".right-panel");

// User for authentication
const userAuth = JSON.parse(localStorage.getItem("user"));

let businessMarkupArray = [];
let fullWarehouseList = [];
let cached = false;
let data;

// TODO: Take fetch requests and condense into one reuable function and pass the query route and query values as arguments

// Boolean to determine if building tables for warehouses or products
let isProductTable = false;

// Functions to get and add businesses to html
const getBusinesses = async () => {
    const response = await fetch("/api/businesses", {
        method: "GET",
        headers: { "Authorization": `Bearer ${userAuth.token}` }
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
    getDetails(items);
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
                businessMarkupArray.push(`<span data-id=${details["_id"]} data-name="${details["name"]}" class="span-btn">${detail}: ${details[detail]} </span><a href="/addCompany?id=${details["name"]}" class="span-btn-add">Add Business</a>`);
            } else {
                businessMarkupArray.push(`<span>${details[detail]} </span>`);
            }
        }
    }
    businessMarkupArray.push("</li>");
};

// Get businessses, add to html, and add event listener for getting warehouses specific to that company
const appendBusinesses = async () => {
    // Get businesses from db if not already obtained
    if (!cached) {
        data = await getBusinesses();
    }
    // Create html tree from data and if not cached (already build array for tree) add </ul> to end of list
    createList(data);
    if (!cached) {
        businessMarkupArray.push("</ul>");
    }
    // Set cached to true after html list has been made
    cached = true;
    // Append to html
    rightPanelSection.innerHTML = businessMarkupArray.join("");

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
    const warehouses = await queryWarehouses(name);
    // Create table from warehouses and make sure it is not a prodeuct table
    isProductTable = false;
    createTable(warehouses);
    // Remove active tab on business li in left-pnael nav bar
    document.getElementById("businesses").classList.remove("nav-list-item-active");
}

// Fetch request for all warehouses of a specific company
const queryWarehouses = async (name) => {
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
    // Create table of warehouses and make sure not product table
    isProductTable = false;
    createTable(fullWarehouseList);
}

// Create html table using warehouse list or product list (wl)
const createTable = (wl) => {
    // Container for whole table
    const div = document.createElement("div");
    div.classList.add("table-container");

    // Section header
    const h2 = document.createElement("h2");
    h2.classList.add("text-center", "bg-orange");
    // Change text if warehouse or product
    if (!isProductTable) {
        h2.textContent = "Warehouses";
    }
    else {
        h2.textContent = "Products";
    }
    div.appendChild(h2);

    const table = document.createElement("table");
    table.classList.add("warehouse-data");

    // Determine if wl is empty or not and if empty add table empty message
    if (!wl.length) {
        if (isProductTable) {
            const msg = document.createElement("p");
            msg.classList.add("text-center", "text-light", "no-products-msg");
            msg.innerText = "No products";

            div.appendChild(msg);
            document.querySelector(".card-container").appendChild(div);
            div.appendChild(table);
            return
        }
    }

    // Create table element and headers
    const headerRow = document.createElement("tr");
    headerRow.classList.add("header-row", "row");

    // Create headers from properties of first element
    for (const prop in wl[0]) {
        if (prop !== "__v" && prop !== "products" && prop !== "_id") {
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
        tr.setAttribute("data-id", ele._id);

        // Give event listener for querying specific warehouse selected
        if (!isProductTable) {
            tr.addEventListener("click", getSingleWarehouse);
        }

        for (const prop in ele) {
            if (prop !== "__v" && prop !== "products" && prop !== "_id") {
                const td = document.createElement("td");
                td.innerText = ele[prop];
                td.classList.add("table-data");
                tr.appendChild(td);
            }
        }

        // If product table, create trash can icon so user can delete product and edit button
        if (isProductTable) {
            createDeleteAndEditButtons(tr, ele);
        }
        table.appendChild(tr);
    }

    // append table and side divs to container
    div.appendChild(table);

    // Add table to page and if not a product table refresh right panel html else just append to warehouse card container
    if (!isProductTable) {
        rightPanelSection.innerHTML = "<div></div>";
        rightPanelSection.appendChild(div);
    } else {
        document.querySelector(".card-container").appendChild(div);
    }
}

// Function to add edit and delete buttons to product form
const createDeleteAndEditButtons = (tr, ele) => {
    const span = document.createElement("span");

    const i = document.createElement("i");
    i.classList.add("fas", "fa-trash");
    i.setAttribute("data-id", ele._id);
    i.addEventListener("click", deleteProduct);

    const editI = document.createElement("i");
    editI.classList.add("fas", "fa-edit");
    editI.setAttribute("data-id", ele._id);
    editI.addEventListener("click", editProduct);

    span.appendChild(i);
    span.appendChild(editI);
    tr.lastElementChild.appendChild(span);
    tr.lastElementChild.classList.add("flex-td");
}

//  Get warehouse and show user options
const getSingleWarehouse = async (e) => {
    const id = e.target.parentElement.getAttribute("data-id");

    const warehouse = await queryWarehouse(id);

    showWarehouseInfo(warehouse);
}

//  Query single warehouse by id
const queryWarehouse = async (id) => {
    const response = await fetch(`/api/warehouses/single/${id}`, {
        method: "GET"
    });

    if (response.status !== 200) {
        console.log("err");
        return;
    }

    const warehouse = await response.json();

    return warehouse;
}

// Show information on warehouse (wh)
const showWarehouseInfo = (wh) => {
    // Create card for holding warehouse data
    const card = document.createElement("div");
    card.classList.add("card");

    // Creaate header for card
    const cardHeader = document.createElement("div");
    cardHeader.classList.add("card-header", "text-center", "bg-orange");
    const h2 = document.createElement("h2");
    h2.textContent = wh.name;

    const h3 = document.createElement("h3");
    h3.textContent = wh["company_name"];

    cardHeader.appendChild(h2);
    cardHeader.appendChild(h3);

    // Image for header
    const cardImg = document.createElement("img");
    cardImg.classList.add("card-image");
    cardImg.setAttribute("src", "../images/wave-circle.jpeg");
    cardImg.setAttribute("alt", "wave image");
    cardHeader.appendChild(cardImg);

    card.appendChild(cardHeader);

    // Create body for card
    const cardBody = document.createElement("div");
    cardBody.classList.add("card-body", "text-center", "bg-light-gray");

    const whID = document.createElement("p");
    whID.textContent = `Warehouse ID: ${wh._id}`;
    whID.setAttribute("id", "warehouse-id");
    whID.setAttribute("data-id", wh._id);

    const numProducts = document.createElement("p");
    numProducts.setAttribute("id", "whProductCount");
    numProducts.textContent = `Number of Products: ${wh.numProducts}`;

    const limit = document.createElement("p");
    limit.textContent = `Warehouse Maximum Capacity: ${wh.limit}`;

    const size = document.createElement("p");
    size.setAttribute("id", "whSize");
    size.textContent = `Current Capacity: ${wh.size}`;

    // Button for getting products
    const buttonDiv = document.createElement("div");
    buttonDiv.classList.add("flex-std-c", "align-center");
    const button = document.createElement("button");
    button.textContent = "Add product";
    button.setAttribute("data-id", wh._id);
    // Add event listener for adding product
    button.addEventListener("click", showProductForm);
    buttonDiv.appendChild(button);

    cardBody.appendChild(whID);
    cardBody.appendChild(numProducts);
    cardBody.appendChild(limit);
    cardBody.appendChild(size);
    cardBody.appendChild(buttonDiv);
    card.appendChild(cardBody);

    // Add event listener for animation to button
    button.addEventListener("mousedown", () => {
        button.classList.add("shift-button");
    });
    button.addEventListener("mouseup", () => {
        button.classList.remove("shift-button");
    });

    // Container for card
    const cardContainer = document.createElement("section");
    cardContainer.classList.add("card-container", "bg-linear-0-5");
    cardContainer.appendChild(card);

    rightPanelSection.innerHTML = "<div></div>";
    rightPanelSection.appendChild(cardContainer);

    // Create form for adding products but give it a class of hidden at first and only display when add product button is clicked
    createForm(cardContainer);

    // Create product list and mark it is for products instead of warehosues
    isProductTable = true;
    createTable(wh.products);
}

// Function for adding product to warehouse
const showProductForm = (e) => {
    e.preventDefault();

    document.getElementById("product-form").classList.toggle("hidden");
}

// Create HTML form for adding product
// Passes card container (cc) so we can easily append to page
const createForm = (cc, edit = false) => {
    const form = document.createElement("form");
    form.classList.add("hidden");
    form.setAttribute("id", "product-form");

    const formH2 = document.createElement("h2");
    formH2.textContent = "Enter Product Information";
    formH2.classList.add("text-center");
    form.appendChild(formH2);

    // Label and input for name
    const labelName = document.createElement("label");
    labelName.innerHTML = "Enter product name";
    const inputName = document.createElement("input");
    inputName.setAttribute("type", "text");
    inputName.setAttribute("id", "product-name");

    // Label and input for price
    const labelPrice = document.createElement("label");
    labelPrice.innerHTML = "Enter product price";
    const inputPrice = document.createElement("input");
    inputPrice.setAttribute("type", "number");
    inputPrice.setAttribute("id", "product-price");

    // Label and input for space
    const labelSpace = document.createElement("label");
    labelSpace.innerHTML = "Enter space product consumes";
    const inputSpace = document.createElement("input");
    inputSpace.setAttribute("type", "number");
    inputSpace.setAttribute("id", "product-space");

    // Label and input for description
    const labelDesc = document.createElement("label");
    labelDesc.innerHTML = "Enter description";
    const inputDesc = document.createElement("input");
    inputDesc.setAttribute("type", "textarea");
    inputDesc.setAttribute("id", "product-desc");

    // Button for form
    const btnDiv = document.createElement("div");
    const formBtn = document.createElement("button");
    formBtn.textContent = "Submit";

    // If not editing (submititng new product) call submit product form with event listener. else call edit product form
    if (!edit) {
        formBtn.addEventListener("click", submitProductForm);
    } else {
        formBtn.addEventListener("click", editProductForm);
    }

    btnDiv.classList.add("flex-std-c", "align-center");
    // Add event listener for animation to button
    formBtn.addEventListener("mousedown", () => {
        formBtn.classList.add("shift-button");
    });
    formBtn.addEventListener("mouseup", () => {
        formBtn.classList.remove("shift-button");
    });
    btnDiv.appendChild(formBtn);

    form.appendChild(labelName);
    form.appendChild(inputName);
    form.appendChild(labelPrice);
    form.appendChild(inputPrice);

    // Only add ability to edit space to creating product
    if (!edit) {
        form.appendChild(labelSpace);
        form.appendChild(inputSpace);
    }

    form.appendChild(labelDesc);
    form.appendChild(inputDesc);
    form.appendChild(btnDiv);

    cc.appendChild(form);
}

const submitProductForm = async (e) => {
    e.preventDefault();

    let whID;
    if (document.getElementById("warehouse-id")) {
        whID = document.getElementById("warehouse-id").getAttribute("data-id");
    }

    const name = document.getElementById("product-name").value.trim();;
    const price = document.getElementById("product-price").value.trim();;
    const space = document.getElementById("product-space").value.trim();;
    const description = document.getElementById("product-desc").value.trim();;

    const sizeEle = document.getElementById("whSize");
    let whSize = sizeEle.textContent.split(" ");
    whSize = parseInt(whSize[whSize.length - 1]);

    const body = {
        name,
        price,
        space,
        description,
    }

    const response = await fetch(`/api/products/${whID}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
    });

    if (response.status !== 200) {
        console.log(response);
        const data = await response.json();

        // Create and append error message to form
        // If error message already exists, dont create new one
        if (!document.getElementById("addProductError")) {
            const p = document.createElement("p");
            p.classList.add("error", "text-center");
            p.setAttribute("id", "addProductError");
            p.innerText = data.message;

            document.getElementById("product-form").appendChild(p);
        }

        return;
    }

    const data = await response.json();

    // Create table entry for new product
    const tr = document.createElement("tr");
    tr.classList.add("row");
    for (const prop in body) {
        const td = document.createElement("td");
        td.classList.add("table-data");
        td.textContent = body[prop];
        tr.appendChild(td);
    }

    const span = document.createElement("span");

    // Add delete and edit buttons
    createDeleteAndEditButtons(tr, data);

    // If table doesnt exist with header and data yet, add it
    if (!document.querySelector(".header-row")) {
        const headerRow = document.createElement("tr");
        headerRow.classList.add("header-row", "row");

        for (const prop in data) {
            if (prop !== "__v" && prop !== "products" && prop !== "_id") {
                const header = document.createElement("th");
                header.innerText = prop;
                headerRow.appendChild(header);
            }
        }

        document.querySelector(".warehouse-data").appendChild(headerRow);
    }

    document.querySelector(".warehouse-data").appendChild(tr);

    if (document.querySelector(".no-products-msg")) {
        document.querySelector(".no-products-msg").remove();
    }

    // Change card values to represent changes
    updateCardHtml(space, true);
}

const deleteProduct = async (e) => {
    e.preventDefault();

    const id = e.target.getAttribute("data-id");
    const whID = document.getElementById("warehouse-id").getAttribute("data-id");

    const response = await fetch(`/api/products/${whID}/${id}`, {
        method: "DELETE"
    });

    console.log(response.status);

    if (response.status > 200) {
        // Do later
        return
    }

    const data = await response.json();

    // e,target is the trash can. Delete the node for the whole table row which is 3 levels up
    e.target.parentElement.parentElement.parentElement.remove();
    // Update html for warehouse card
    updateCardHtml(data.space, false)
}

const updateCardHtml = (space, isIncProducts) => {
    // Update product count on card
    const numProductsEle = document.getElementById("whProductCount");
    let numProducts = numProductsEle.textContent.split(" ");
    numProducts = parseInt(numProducts[numProducts.length - 1]);
    // If incrementing products, increase product count else decrease
    if (isIncProducts) numProducts++;
    if (!isIncProducts) numProducts--;
    numProductsEle.textContent = `Number of Products: ${numProducts}`;

    // Update current capacity of warehouse on card.
    const sizeEle = document.getElementById("whSize");
    let size = sizeEle.textContent.split(" ");
    size = parseInt(size[size.length - 1]);
    // If incrementing products, add product size to warehosue capacity. Else reduce capacity
    if (isIncProducts) size += parseInt(space);
    if (!isIncProducts) size -= parseInt(space);
    sizeEle.textContent = `Current Capacity: ${size}`;
}

// Remove html for cards and create form for editting product
const editProduct = (e) => {
    e.preventDefault();

    const ID = e.target.getAttribute("data-id");

    document.querySelector(".card-container").remove();

    // new container for editting
    const div = document.createElement("div");
    div.classList.add("edit-form-container");

    // Create form for editing product
    createForm(div, true);
    rightPanelSection.appendChild(div);
    // Remove default hidden class from form
    document.getElementById("product-form").classList.remove("hidden");
    rightPanelSection.querySelector("button").setAttribute("data-id", ID);
}

// Fetch request to edit product
const editProductForm = async (e) => {
    e.preventDefault();

    const ID = e.target.getAttribute("data-id");

    const body = {
        name: document.getElementById("product-name").value.trim(),
        price: document.getElementById("product-price").value.trim(),
        description: document.getElementById("product-desc").value.trim()
    }

    const reponse = await fetch(`api/products/${ID}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
    });

    if (reponse.status !== 200) {
        if (!document.getElementById("addProductError")) {
            const p = document.createElement("p");
            p.classList.add("error", "text-center");
            p.setAttribute("id", "addProductError");
            p.innerText = data.message;

            document.getElementById("product-form").appendChild(p);
        }
        return
    }

    appendBusinesses();
}

// Call business function on window load
window.onload = async () => {
    await appendBusinesses();
};

// Left-nav-panel button events for changing interface
businessesBtn.addEventListener("click", appendBusinesses);
warehousesBtn.addEventListener("click", getAllWarehouses);