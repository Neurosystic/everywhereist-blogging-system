/**
 * Main application file.
 * 
 * NOTE: This file contains many required packages, but not all of them - you may need to add more!
 */

// Setup Express
const express = require("express");
const app = express();
const port = 3000;

// Setup body-parser
app.use(express.urlencoded({ extended: false }));

// Setup cookie-parser
const cookieParser = require("cookie-parser");
app.use(cookieParser());

// Make the "public" folder available statically
const path = require("path");
app.use(express.static(path.join(__dirname, "public")));

// Setup Handlebars
const handlebars = require("express-handlebars");
app.engine("handlebars", handlebars({
    defaultLayout: "main",
    partialsDir: path.join(__dirname, "views/partials")
}));
app.set("view engine", "handlebars");

// Use the toaster middleware
app.use(require("./middleware/toaster-middleware.js"));

//Set up authentication middleware 
const { addUserToLocals } = require("./middleware/auth-middleware.js");
app.use(addUserToLocals);

// Setup routes
app.use(require("./routes/application-routes.js"));
app.use(require("./routes/auth-routes.js"));
app.use(require("./routes/api-routes.js"));
app.use(require("./routes/blogging-routes.js"));

// Start the server running.
app.listen(port, function () {
    console.log(`App listening on port ${port}!`);
});