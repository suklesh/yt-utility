const express = require("express");
const app = express();
const request = require("request");
var parseString = require("xml2js").parseString;
const API_KEY = "AIzaSyBK-tVKOHjUUzYnu-zhQphDYsyYv2NGpHg";
var captionsAvailable = "";

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

  // Build the url that will be passed in the request function below.
  const url =
    "https://www.youtube.com/api/timedtext?v=" + videID + "&lang=en&fmt=srv3";

  // will be using the xml to json parser --> https://www.npmjs.com/package/xml2js ; https://www.thepolyglotdeveloper.com/2015/01/parse-xml-response-nodejs/
  // the request function below helps in returning the transcript in a JSON format. And the same will be sent over to the front end for
  // further processing
  request(url, function(error, response, body) {
    console.log("error:", error); // Print the error if one occurred
    console.log("statusCode:", response && response.statusCode); // Print the response status code if a response was received
    console.log("body:", body);
    var xml = body;
    parseString(xml, function(err, result) {
      res.status(200).json(result);
      const test = JSON.stringify(result);
      //console.log(result.timedtext.body[0].p[0]._); //Use this in angular service to help render the value into the HTML element accordingly
      //console.log(result.timedtext.body[0].p[1].$.t);
    });
  });
});

app.use("/api/videoInfo", (req, res, next) => {
  const videID = req.query.v;

  captionsCheck = {};
  // captions API url below
  const url2 =
    "https://www.googleapis.com/youtube/v3/captions?part=snippet&key=" +
    API_KEY +
    "&videoId=" +
    videID;
  request(url2, function(error, response, body) {
    console.log("error:", error); // Print the error if one occurred
    console.log("statusCode:", response && response.statusCode); // Print the response status code if a response was received
    contentInfo = JSON.parse(body);
    //console.log(contentInfo.items[1]);
    if (
      contentInfo.items[1] != null &&
      contentInfo.items[1].snippet.trackKind === "standard"
    ) {
      console.log("Entered Value Setter");
      captionsAvailable = "true";
    } else {
      captionsAvailable = "false";
    }
  });

  contentInfo = {};
  // Snippet of content details Youtube API below
  const url =
    "https://www.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&id=" +
    videID +
    "&key=" +
    API_KEY;

  request(url, function(error, response, body) {
    console.log("error:", error); // Print the error if one occurred
    console.log("statusCode:", response && response.statusCode); // Print the response status code if a response was received
    //console.log("body:", body);
    contentInfo = JSON.parse(body);
    //res.status(200).json(contentInfo.items[0]);
    res.status(200).json({
      captionsAvailable: captionsAvailable,
      contentInfo: contentInfo.items[0]
    });
  });
});

module.exports = app;

//https://www.youtube.com/api/timedtext?v=nShlloNgM2E&lang=en&fmt=srv3
