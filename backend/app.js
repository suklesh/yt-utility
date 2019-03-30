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
  // NEED CODE: code required to make a captions call,and make sure that transcripts are available
  // The above might not be required once the oAut2 is implemented.

  // Build the url that will be passed in the request function below.
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
      const test = JSON.stringify(result);
      //console.log(result.timedtext.body[0].p[0]._); //Use this in angular service to help render the value into the HTML element accordingly
      //console.log(result.timedtext.body[0].p[1].$.t);
    });
  });
});
module.exports = app;

//https://www.youtube.com/api/timedtext?v=nShlloNgM2E&lang=en&fmt=srv3
