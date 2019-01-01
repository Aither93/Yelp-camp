//all the middlewares go here
var campground = require("../models/campgrounds")
var Comment = require("../models/comment")
var middlewareObj = {};
var flash = require("connect-flash");
middlewareObj.checkCampOwnership = function (req, res, next){
	if (req.isAuthenticated()){
		campground.findById(req.params.id, function(err, foundCamp){
			if (err) {
				res.redirect("back");
			} else {
				if (foundCamp.author.id.equals(req.user._id)){
					next();
				} else{
					req.flash("error", "You don't have permission for this");
					res.redirect("back");
				}
			}
		});
	} else{
		req.flash("error", "please login first");
		res.redirect("/login");
	}
}

middlewareObj.checkCommentOwnership = function (req, res, next){
	if (req.isAuthenticated()) {
		Comment.findById(req.params.commentid, function(err, foundComment){
			if (err) {
				res.redirect("back");
			} else {
				if (foundComment.author.id.equals(req.user._id)) {
					next();
				} else {
					req.flash("error", "You don't have permission for this");
					res.redirect("back");
				}
			}
		})
	} else {
		req.flash("error", "please login first");
		res.redirect("/login");
	}
}

middlewareObj.isLoggedIn = function (req, res, next){
	if(req.isAuthenticated()){
		return next();
	} 
	req.flash("error", "please login first");
	res.redirect("/login");
}



module.exports = middlewareObj;  