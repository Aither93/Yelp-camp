var express = require ("express");
var app = express ();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var campground = require("./models/campgrounds");
var Comment = require("./models/comment");
var seedDB = require("./seeds");
var passport = require("passport");
var localStrategy = require("passport-local");
var User = require("./models/users");
var methodOverride = require("method-override");
var flash = require("connect-flash");
// seedDB();
mongoose.connect("mongodb://localhost/yelpcamp");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname+"/public"));
var commentRoutes = require("./routes/comments");
var campgroundRoutes = require("./routes/campgrounds");
var indexRoutes = require("./routes/index");
app.use(flash());
//passport config
app.use(require("express-session")({
	secret: "Ahmed is awesome",
	resave: false,
	saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});
app.use(methodOverride("_method"));



app.use("/campgrounds/:id/comments",commentRoutes);
app.use("/campgrounds",campgroundRoutes);
app.use(indexRoutes);




app.listen (3000, function(){
	console.log("Yelp camp is runninng");
})