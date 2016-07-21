var path = require("path");
var express = require("express");
var zipdb = require("zippity-do-dah");
var ForecastIo = require("forecastio");

var app = express();
var weather = new ForecastIo("5eb451deabd9049265d950d1ceae86b3");

//Serves static files out of public 
app.use(express.static(path.resolve(__dirname, "public")));

app.set("views", path.resolve(__dirname, "views"));
app.set("view engine", "ejs");

//Renders the index view if the home page is hit
app.get("/", function(req,res){
  res.render("index");
})

app.get(/^\/(\d{5})$/, function(req, res, next) {
  var zipcode = req.params[0];
  var location = zipdb.zipcode(zipcode);
  if (!location.zipcode) {
    next();
    return;
  }

var latitude = location.latitude;
var longitude = location.longitude;

weather.forecast(latitude, longitude, function(err, data) {
  if (err) {
    next();
    return;
  }
  res.json({
  zipcode: zipcode,
  temperature: data.currently.temperature
    });
  });
});

//Shows a 404 error if no other routes are matched
app.use(function(req, res){
  res.status(404).render("404");
});


//Starts the server:
app.listen(3000)

