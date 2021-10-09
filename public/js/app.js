const markupArray = ['<ul>']

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

// Call functions on page load
window.onload = async () => {
    const data = await getBusinesses();
    console.log(data);
    createList(data);
    markupArray.push("</ul>");
    document.querySelector(".right-panel").innerHTML = markupArray.join("");
};