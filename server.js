let express = require("express");
let mongojs = require("mongojs");
let mongoose = require("mongoose");
let bodyParser = require("body-parser");
let cheerio = require("cheerio");
let request = require("request");
let router = express.Router();

// create a port
let PORT = process.env.PORT || 3000;

// Initialize Express
let app = express();

// Set up a static folder (public) for our web app
app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

let exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");



let MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

// Set mongoose to leverage built in JavaScript ES6 Promises
// Connect to the Mongo DB
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);

// Database configuration
// Save the URL of our database as well as the name of our collection
let databaseUrl = "MongoHw";
let collections = ["data"];

// Use mongojs to hook the database to the db variable
var db = mongojs(databaseUrl, collections);

// This makes sure that any errors are logged if mongodb runs into an issue
db.on("error", function(error) {
    console.log("Database Error:", error);
  });

  // Routes
// 1. At the root path, send a simple hello world message to the browser using handlebars
app.get("/", function (req, res) {
    res.render("index");
  });

  // 2. News Related to Scraper Bikes
  app.get("/news", function(req, res) {
    request("https://www.eastbaytimes.com", function(error, response, html) {
  
    // Load the HTML into cheerio and save it to a variable
    // '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'
    let $ = cheerio.load(html);
  
  
    // Select each element in the HTML body from which you want information.
    // NOTE: Cheerio selectors function similarly to jQuery's selectors,
    // but be sure to visit the package's npm page to see how it works
    $(".entry-title").each(function(i, element) {
  
      let link = $(element).children().attr("href");
      let title = $(element).children().text();
    //   let picture = $(element).children().attr("")

  
      // Save these results in an object that we'll insert into database collection
      let stuff = [];
      let info = db.data.insert({
        title: title,
        link: link,
      });
      stuff.push(info);
      console.log("This is stuff", stuff);
    });
    res.json({message: 'hi'});
  });  
  });

  // 3. At the "/all" path, display every entry in the data collection
app.get("/all", function(req, res) {
    // Query: In our database, go to the data collection, then "find" everything
    db.data.find({}, function(err, found) {
      // Log any errors if the server encounters one
      if (err) {
        console.log(err);
      }
      // Otherwise, send the result of this query to the browser
      else {
        res.json(found);
      }
    });
  });
  
// Set the app to listen on port 3000
app.listen(3000, function() {
  console.log("App running on port 3000!");
});