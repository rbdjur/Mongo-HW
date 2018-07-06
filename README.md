# Mongo-HW

Challenges =

in the /scrape Route, 

I was getting an article validation error of the documents for "link" and "title".  This prompted me to check the Article.js file that held the construction outlines of the database and collection "Article".  But after tampering with my code, this error appeared due to failing to define an object and set the respective properties, "title" and "link" of the object, to the assigned variables that had the data for the articles' titles and url. 

07/03/2018
Fixed a catch error 

UnhandledPromiseRejectionWarning: TypeError: db.articles.create is not a function

+ 

UnhandledPromiseRejectionWarning: Unhandled promise rejection. This error originated either by throwing inside of an async function without a catch block, or by rejecting a promise which was not handled with .catch(). (rejection id: 1)
(node:4982) [DEP0018] DeprecationWarning: Unhandled promise rejections are deprecated. In the future, promise rejections that are not handled will terminate the Node.js process with a non-zero exit code.
[nodemon] restarting due to changes...

07/04/2018
The final task for this assignment requires the ability to leave notes on articles that a user an access at a later time.  Right now, in the mongo data base, "mongoHeadlines", only the id, title, and link to a given article exists.  Next step, I need to be able to retrieve the unique id of each article, then create a new document in the existing database to store notes.  

Then, retrieve the id and the associative notes belonging to it.  I did this by:

Phase I - find title, id, and link. 
1.  console.log("first article - Best Pizza " + dbData[0].title);
2. console.log("first article - id " + dbData[0]._id);
3. console.log("first article - url " + dbData[0].link);

Phase II - form a div that the notes can exist

