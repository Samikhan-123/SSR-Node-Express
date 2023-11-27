const fs = require("fs");
const express = require("express");
const morgan = require("morgan");
const server = express();
server.use(express.json());

// const index = fs.readFileSync('index.html', 'utf-8');
const users = JSON.parse(fs.readFileSync("users.json", "utf-8"));
const products = users.products;

server.use(morgan("dev"));
server.use(express.static("public"));
const auth = (req, res, next) => {
    if (req.query.password == "sami") {
        // console.log(req.query)
        next();
    } else {
        res.status(401).send(`<p>Enter Password in the URL</p>`);
        console.log("password is sami");
    }
};

server.get("/users", (req, res) => {
    const productHTML = products
        .map((product) => {
            return `
            <div class="card m-2 col-sm-6 col-12 col-md-6 col-lg-4 col-xl-3 shadow-sm p-3 mb-5 bg-body rounded">
                    <img src="${product.thumbnail}" style = "height:14rem" class="card-img-top" alt="...">
                    <div class="card-body">
                        <h5 class="card-title text-dark">${product.title}</h5>
                        <p class="card-text">${product.description}</p>
                        <hr />
                        <div class="d-flex">
                        <h6 class="col-6 text-warning fw-bold">$${product.price}</h6>
                        <h6  style = "position:relative; right:20px" class="col-6 d-flex justify-content-end text-dark">${product.rating}</h6>
                        <span style = "position:relative; top:-3px; right:20px"  class="material-symbols-outlined text-info">
                        star_rate
                        </span>
                        </div>
                        <hr />
                        <a href="https://www.google.com" class="btn btn-primary mt-3 d-flex fw-bold justify-content-center text-center">Find Now</a>
                    </div> 
                </div>`;
        })
        .join(""); // Join the HTML strings for all products

    // Wrap the cards in a flex container
    const finalHTML = `
        <!DOCTYPE html>
        <html lang="en">

        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Your Page Title</title>
            <!-- Include Bootstrap CSS -->
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
            <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
        </head>

        <body>
        <h1 class= 'text-center fw-bold mt-3' >Products</h1>
            <div class="d-flex flex-wrap justify-content-around">${productHTML}</div>

        </body>
        </html>`;

    res.setHeader("Content-Type", "text/html");
    res.end(finalHTML);
    // console.log(finalHTML,"finalHTML")
});

server.get("/products", auth, (req, res) => {
    res.json(products);
});

server.get("/products/:id", (req, res) => {
    let id = req.params.id;
    const prd = products.find((p) => p.id === +id);
    if (!prd) {
        return res.status(404).send({
            error: "Product not found",
        });
    }
    res.json(prd); // Respond with the product found
});

server.post("/products", (req, res) => {
    console.log(req.body);
    // Push the new product to the array
    products.push(req.body);
    res.json(req.body); // Respond with the added product
});

server.put("/", (req, res) => {
    res.json({ type: "PUT" });
});

server.delete("/", (req, res) => {
    res.json({ type: "DELETE" });
});

server.patch("/", (req, res) => {
    res.json({ type: "PATCH" });
});

server.listen(3000, () => {
    console.log("Server is running on port 3000");
});
