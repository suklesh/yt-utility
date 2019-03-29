const express = require("express");
const app = express();
const request = require("request");
var parseString = require("xml2js").parseString;

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
  /* The request method below returns the youtube video details,
  of which we need to strip the trackID
  */

  // The below function helps in createing the url that will be passed in the request function below.
  const videID = req.query.v;
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
    });
  });
});
module.exports = app;

//https://www.youtube.com/api/timedtext?v=nShlloNgM2E&lang=en&fmt=srv3
