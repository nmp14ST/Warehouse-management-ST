const data = {
    name: "SkillStorm",
    founded: 2006,
    warehouses: 0,
    children: [
        {
            name: "TaxesInc",
            founded: 2007,
            warehouses: 6,
            children: [
                {
                    name: "ChildA",
                    founded: 2010,
                    warehouses: 1
                }
            ]
        },
        {
            name: "SkillStormPartner",
            founded: 2007,
            warehouses: 2
        },
        {
            name: "WarehouseSolutions",
            founded: 2006,
            warehouses: 10,
            children: [
                {
                    name: "WHS2",
                    founded: 2011,
                    warehouses: 12
                },
                {
                    name: "WHS3",
                    founded: 2011,
                    warehouses: 5,
                    children: [
                        {
                            name: "CoolCompany",
                            founded: 2015,
                            warehouses: 1,
                            children: [
                                {
                                    name: "CoolCompany2",
                                    founded: 2019,
                                    warehouses: 1
                                }, {
                                    name: "Nathan's Famous Hotdogs",
                                    founded: 2016,
                                    warehouses: 3
                                }
                            ]
                        }
                    ]
                },
                {
                    name: "WHS4",
                    founded: 2012,
                    warehouses: 2
                }
            ]
        },
    ]
};


const markupArray = ['<ul>']

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
    markupArray.push(`<li data-id=1><div class="list-div">`);
    for (const detail in details) {
        // fetch the value of each item

        if (detail == "children") {
            markupArray.push("</div><ul>");
            details[detail].forEach((element) => {
                getDetails(element);
            });
            markupArray.push("</ul>");
        } else {
            if (detail === "warehouses") {
                markupArray.push(`<span>${detail}: ${details[detail]} </span>`);
            } else {
                markupArray.push(`<span>${details[detail]} </span>`);
            }
        }
    }
    markupArray.push("</li>");
};

// Call functions on page load
window.onload = () => {
    createList(data);
    markupArray.push("</ul>");
    document.querySelector(".right-panel").innerHTML = markupArray.join("");
};