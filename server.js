let express = require("express");
let mongojs = require("mongojs");
let mongoose = require("mongoose");
let bodyParser = require("body-parser");
let cheerio = require("cheerio");
let request = require("request");
let axios = require("axios");
let logger = require("morgan");
let router = express.Router();

// create a port
const PORT = process.env.PORT || 3000;

// Initialize Express
let app = express();

// Use morgan logger for logging requests
app.use(logger("dev"));

// Set up a static folder (public) for our web app
app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

let exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// The app name for this application on heroku is "pacific bayou"

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

// Set mongoose to leverage built in JavaScript ES6 Promises
// Connect to the Mongo DB
mongoose.Promise = Promise;
//mongoose.connect(process.env.MONGODB_URI);
mongoose.connect(MONGODB_URI);

// let important;

// Database configuration
// Save the URL of our database as well as the name of our collection
// let databaseUrl = "mongoHeadlines"; //"MongoHw"
// let collections = ["articles"];  //["data"];

// // Use mongojs to hook the database to the db variable
// let db = mongojs(databaseUrl, collections);
let db = require("./model");



// Routes
// 1. At the root path, send a simple hello world message to the browser using handlebars
app.get("/articles", function (req, res) {
  console.log('getting stuffs + inside /');

  db.Article.find({}).sort({ date: 1 }).then(function (dbData, err) {
    if (err) throw err;

    const context = {
      things: dbData.reverse(),
    };

    let important = dbData

    console.log(context);
    console.log("This is important", important);

    res.render("index", context);
    // res.render("index");
  })
});

// 2. All new scraped data
app.get("/scrape", function (req, res) {
  console.log("Inside /scrape");
  // code for scraped articles
  axios.get("https://www.eastbaytimes.com").then(function (response) {
    let $ = cheerio.load(response.data);

    $(".entry-title").each(function (i, element) {

      let link = $(element).children().attr("href");
      let title = $(element).children().text();

      let result = {};

      result.title = $(this).children().text();
      result.link = $(element).children().attr("href");
      // result.date = Date.now();

      const info = {
        link: link,
        title: title,
        date: Date.now()
      };

      console.log("This is current result", info);
      // console.log("Just link", link);
      // console.log("Just title", title);

      db.Article.create(info).then(function (dbNew) {
        console.log("LOOK!" + dbNew);
      })
        .catch(function (err) {
          return res.json(err);
        });
    });

    res.send("New Articles Scraped Into Database!");
  });
});

// #3. 
// Route for grabbing a specific Article by id, populate it with it's note
app.get("/articles/:id", function (req, res) {
  // let articleId = 
  // console.log("/scrape/:id context", );
  // console.log(_id);

  // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
  db.Article.find({}).sort({ date: -1 })
    // One({ _id: req.params.id })
    // ..and populate all of the notes associated with it
    .populate("Note")
    .then(function (dbArticle) {
      // If we were able to successfully find an Article with the given id, send it back to the client
      res.json(dbArticle[req.params.id]);
    })
    .catch(function (err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// #4. 
// Route for saving/updating an Article's associated Note
app.post("/articles/:id", function (req, res) {
  console.log("inside post of /articles/:id");
  // Create a new note and pass the req.body to the entry
  db.Note.create(req.body)
    .then(function (dbNote) {
      console.log("ad.Note.create", dbNote);
      // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
      // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
      // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
      return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
    })
    .then(function (dbArticle) {
      // If we were able to successfully update an Article, send it back to the client
      res.json(dbArticle);
    })
    .catch(function (err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});





// .catch(function(err) {
//   return res.json(err)
// })

// };
//   res.send(db.articles.find({})
// );

// const result = {};

// result.title = title;
// result.link = link;

// db.articles.find(info).then(function(stuff) {
//   console.log("inside db.articles.insert function block");
//   console.log(stuff);
// }).catch(function(err) {
//   return res.json(err);
// });

// });
// res.send("New Articles Scraped Into Databse!")
// });






// request("https://www.eastbaytimes.com", function (error, response, html) {

//   // Load the HTML into cheerio and save it to a variable
//   // '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'
//   let $ = cheerio.load(html);


//   // Select each element in the HTML body from which you want information.
//   // NOTE: Cheerio selectors function similarly to jQuery's selectors,
//   // but be sure to visit the package's npm page to see how it works
//   $(".entry-title").each(function (i, element) {

//     let link = $(element).children().attr("href");
//     let title = $(element).children().text();
//     //   let picture = $(element).children().attr("")


//     // Save these results in an object that we'll insert into database collection
//     let info = db.data.insert({
//       title: title,
//       link: link,
//     });
//     // Put title and link into an object called infoObject
//     let articleInfo =
//     {
//       title: title,
//       link: link,
//     }
//     console.log("THIS IS IMPORTANT", articleInfo);
//     console.log("title of article only", articleInfo.title);
//     console.log("url of article only", articleInfo.link);


//   stuff.push(info);
//   console.log("This is stuff", info);
// });
// res.json({ message: 'Succesfully Scraped' });
// res.json({ articleInfo });
// res.json(articleInfo);
//   });
// });

// 3. At the "/all" path, display every entry in the data collection
// app.get("/articles", function (req, res) {
//   console.log("inside /articles")
// db.articles.find({});

// // .then(function(dbArticle) {
// //   console.log("dbArticle" + dbArticle);
// //   res.json(dbArticle)
// // }).catch(function(err) {
// //   res.json(err)
// // });

// });

// // Route for grabbing a specific Article by id, populate it with it's note
// app.get("/articles/:id", function(req, res) {
//   // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
//   db.Article.findOne({ _id: req.params.id })
//     // ..and populate all of the notes associated with it
//     .populate("note")
//     .then(function(dbArticle) {
//       // If we were able to successfully find an Article with the given id, send it back to the client
//       res.json(dbArticle);
//     })
//     .catch(function(err) {
//       // If an error occurred, send it to the client
//       res.json(err);
//     });
// });








//   // Query: In our database, go to the data collection, then "find" everything
//   db.data.find({}, function (err, found) {
//     // created array to push found into stuff
//     let stuff = [];
//     stuff.push(found);
//     // console.log(stuff)
//     console.log("HERE AT THE ARTICLES: titles + urls", stuff);
//     // Log any errors if the server encounters one
//     if (err) {
//       console.log(err);
//     }
//     // Otherwise, send the result of this query to the browser
//     else {
//       //   res.render("index", stuff)
//       res.json(stuff);
//     }
//   });
// });


// Set the app to listen on port 3000
app.listen(3000, function () {
  console.log("App running on port 3000!");
});

// app.listen(process.env.PORT || 3000);