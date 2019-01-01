var express = require("express");
var router = express.Router();
var passport = require("passport");
var localStrategy = require("passport-local");
var User = require("../models/users");


router.get("/", function(req, res){
	res.render("landing");
});

// =======================
// Comments routes 
// =======================

// Authentication Routes
// sign up
router.get("/register", function(req,res){
	res.render("register");
})
router.post("/register", function(req, res){
	User.register(new User({username: req.body.username}), req.body.password, function(err, user){
		if (err) {
			console.log(err);
			return res.render("register");
		}
		passport.authenticate("local")(req, res, function(){
			res.redirect("/campgrounds");
		})
	})
})
// sign in
router.get("/login", function(req, res){
	res.render("login");
})

router.post("/login", passport.authenticate("local",{
	successRedirect:"/campgrounds",
	failureRedirect:"/login"
}), function(req, res){
	
})
//sign out
router.get("/logout", function(req, res){
	req.logout();
	req.flash("success", "Logged out successfuly");
	res.redirect("/");
});

module.exports = router;