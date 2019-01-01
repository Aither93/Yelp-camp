var express = require("express");
var campground = require("../models/campgrounds");
var router = express.Router();
var middleware = require("../middleware/index.js");
//index route --show all camps
router.get("/", function(req, res){
	campground.find({}, function(err,camps){
		if (err){
			console.log(err);
		} else {
			res.render("campgrounds/campgrounds",{campgrounds:camps, currentUser: req.user});
		}	})

});
//The Create route --create new camp to db
router.post("/", middleware.isLoggedIn, function(req,res){
	//get data from the forms
	var name = req.body.name;
	var image = req.body.image;
	var description = req.body.description;
	var id = req.user._id;
	var username = req.user.username;
	var newCapmground = {name: name, image: image,description: description, author: {
		id : id,
		username: username
	}};
	// Create a new campground and save it to db then redirect
	campground.create(newCapmground, function(err, newCamp){
		if (err){
			console.log(err);
		} else {
			res.redirect("/campgrounds");
		}
	})
});
// The new route--show form to create new camp
router.get("/new", middleware.isLoggedIn, function(req, res){
	res.render("campgrounds/new");
})
//Show ===Shows info about one camp
router.get("/:id", function(req, res){
	campground.findById(req.params.id).populate("comments").exec(function(err, foundCamp){
		if (err){
			console.log(err);
		} else {
			res.render("campgrounds/show", {foundCamp: foundCamp});	
		}
	})
})

// Edit Campground 
router.get("/:id/edit",middleware.checkCampOwnership, function(req, res){
	campground.findById(req.params.id, function(err, foundCamp){
		if (err) {
			res.render("back");
		} else{
				res.render("campgrounds/edit", {foundCamp: foundCamp});
		}
	})
})
//update Campground
router.put("/:id", middleware.checkCampOwnership, function(req, res){
	var name = req.body.name;
	var image = req.body.image;
	var description = req.body.description;
	var newCapmground = {name: name, image: image,description: description};
	campground.findByIdAndUpdate(req.params.id, newCapmground,function(err, edited){
		if (err) {
			res.redirect("/");
		} else {
			res.redirect("/campgrounds/"+ req.params.id);
		}
	})
})
// Destroy Campground
router.delete("/:id", middleware.checkCampOwnership, function(req, res){
	campground.findByIdAndRemove(req.params.id, function(err){
		if (err) {
			res.redirect("/campgrounds");
		} else{
			res.redirect("/campgrounds");
		}
	})
})




module.exports = router;


