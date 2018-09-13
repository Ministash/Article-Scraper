var express = require("express");
var bodyParser = require("body-parser");
var exphbs = require("express-handlebars");
let articleRoutes = require('./controllers/api-routes.js');
const mongoose = require('mongoose');
var db = require("./models");


var app = express();

mongoose.Promise = Promise;
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/8080";

mongoose.connect(MONGODB_URI, {
  useMongoClient: true
});


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

app.use(articleRoutes)(app, db);
app.use(express.static(__dirname + "/public"));



var PORT = process.env.PORT || 8080;
// Start our server so that it can begin listening to client requests.
  app.listen(PORT, function() {
    console.log("Server listening on: http://localhost:" + PORT);
  });
