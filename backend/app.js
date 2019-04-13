const express = require("express");
const app = express();
const request = require("request");
const authRoutes = require("./routes/auth");
const API_KEY = process.env.API_KEY;
const mongoosse = require("mongoose");

// Mongo cluster pass - lfUAcRdrKFz1Vy1l ytApp
mongoosse
  .connect(
    "mongodb+srv://suk:" +
      process.env.MONGO_ATLAS_PW +
      "@cluster0-pordn.mongodb.net/test?retryWrites=true"
  )
  .then(() => {
    console.log("Connected to DB");
  })
  .catch(() => {
    console.log("Connection Failed");
  });

// https://codeburst.io/hitchhikers-guide-to-back-end-development-with-examples-3f97c70e0073
// To parse the data in the body we will need to add middleware into our application to provide this functionality
const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var parseString = require("xml2js").parseString;
//const captionsAvailable;

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Orign, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, OPTIONS, DELETE"
  );
  next();
});

app.use("/api/getCaptionInfo", (req, res, next) => {
  // NEED CODE: code required to make a captions call,and make sure that transcripts are available
  // The above might not be required once the oAut2 is implemented.
  const videID = req.query.v;
  const searchString = req.query.str;

  //searchString = "here";

  // Build the url that will be passed in the request function below.
  const url =
    "https://www.youtube.com/api/timedtext?v=" + videID + "&lang=en&fmt=srv3";

  // will be using the xml to json parser --> https://www.npmjs.com/package/xml2js ; https://www.thepolyglotdeveloper.com/2015/01/parse-xml-response-nodejs/
  // the request function below helps in returning the transcript in a JSON format. And the same will be sent over to the front end for
  // further processing
  request(url, function(error, response, body) {
    console.log("error:", error); // Print the error if one occurred
    console.log("statusCode:", response && response.statusCode); // Print the response status code if a response was received
    //console.log("body:", body);
    var xml = body;
    parseString(xml, function(err, result) {
      //res.status(200).json(result);
      //res.status(200).json(result.timedtext.body[0]); ************* USE THIS RESPONSE If the alternate does not work **************
      const test = result.timedtext.body[0].p;
      console.log(searchWord(test, searchString));
      res.status(200).json(searchWord(test, searchString));
      console.log(searchString);
      //console.log(result.timedtext.body[0].p[0]._); //Use this in angular service to help render the value into the HTML element accordingly
      //console.log(result.timedtext.body[0].p[1].$.t);
      //console.log(result.timedtext.body[0]);
      //console.log(test);
      //YourControllerName/ActionMethodName?querystring1=querystringvalue1&querystring2=querystringvalue2&querystring3=querystringvalue3");
    });

    function searchWord(test, searchString) {
      //console.log(test);
      const length = Object.keys(test).length;
      var results = [];
      var searchVal = searchString;
      for (var i = 0; i < length; i++) {
        if (searchArray(test[i]._, searchVal)) {
          results.push(test[i].$.t);
        }
      }
      return results;
    }

    function searchArray(sentance, searchWord) {
      str = sentance;
      strgs = str.split(" ");
      // console.log(strgs);
      //console.log(strgs);
      for (i = 0; i < strgs.length; i++) {
        if (strgs[i] === searchWord) {
          return true;
        }
      }
    }
  });
});

app.use("/api/videoInfo", (req, res, next) => {
  const videID = req.query.v;
  captionsCheck = {};
  captionsAvailable = "";
  contentInfo = {};

  // captions API url below
  const url2 =
    "https://www.googleapis.com/youtube/v3/captions?part=snippet&key=" +
    API_KEY +
    "&videoId=" +
    videID;
  // Video Detials below
  const url =
    "https://www.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&id=" +
    videID +
    "&key=" +
    API_KEY;

  function videDetails() {
    // Snippet of content details Youtube API below
    request(url, function(error, response, body) {
      console.log("error:", error); // Print the error if one occurred
      console.log("statusCode:", response && response.statusCode); // Print the response status code if a response was received
      //console.log("body:", body);
      contentInfo = JSON.parse(body);
      console.log("******* Entered Results  *******");
      //res.status(200).json(contentInfo.items[0]);
      console.log(
        "Inside the response captionsAvailable = " + captionsAvailable
      );
      res.status(200).json({
        captionsAvailable: captionsAvailable,
        contentInfo: contentInfo.items[0]
      });
    });
  }

  // This code below can change when the OAuth 2.0 is implemented, which will give access to all captions
  request(url2, function(error, response, body) {
    console.log("error:", error); // Print the error if one occurred
    console.log("statusCode:", response && response.statusCode); // Print the response status code if a response was received
    contentInfo = JSON.parse(body);
    //console.log(contentInfo.items[1]);
    console.log("******* Entered Caption Check *******");
    if (
      contentInfo.items[1] != null &&
      contentInfo.items[1].snippet.trackKind === "standard"
    ) {
      captionsAvailable = "true";
      console.log("Caption Available " + captionsAvailable);
    } else {
      captionsAvailable = "false";
      console.log("Caption Not Available " + captionsAvailable);
    }
    videDetails();
  });
});

// app.use(bodyParser.urlencoded({extended: true}));
app.use("/api/auth", authRoutes);
module.exports = app;
//https://www.youtube.com/api/timedtext?v=nShlloNgM2E&lang=en&fmt=srv3
