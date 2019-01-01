var express = require("express");
var router = express.Router({mergeParams: true});
var campground = require("../models/campgrounds");
var Comment = require ("../models/comment");
var middleware = require("../middleware/index.js");

router.get("/new", middleware.isLoggedIn, function(req,res){
	campground.findById(req.params.id, function(err, campground){
		if (err) {
			console.log(err);
		} else {
			res.render("comments/new", {campground: campground});
		}
	})
})

router.post("/", middleware.isLoggedIn, function(req, res){
	campground.findById(req.params.id, function(err, foundCamp){
		if (err) {
			console.log(err);
		} else {
			Comment.create(req.body.comment, function(err, comment){
				if (err) {
					console.log(err);
				} else {
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					comment.save();
					foundCamp.comments.push(comment);
					foundCamp.save();
					res.redirect("/campgrounds/"+ foundCamp._id);
				}
			})
		}
	})
})
router.get("/:commentid/edit", middleware.checkCommentOwnership, function(req, res){
	var campground_id = req.params.id;
	Comment.findById(req.params.commentid, function(err, foundComment){
		if (err) {
			res.redirect("back");
		} else {
			res.render("comments/edit", {foundComment: foundComment, campground_id: campground_id});
		}
	})

})
router.put("/:commentid", middleware.checkCommentOwnership, function(req, res){	
	Comment.findByIdAndUpdate(req.params.commentid, req.body.comment, function(err, found){
		if (err) {
			console.log(err);
		} else {
			res.redirect("/campgrounds/" + req.params.id);
		}
	})
})

router.delete("/:commentid", middleware.checkCommentOwnership, function(req, res){
	Comment.findByIdAndRemove(req.params.commentid, function(err){
		if (err) {
			res.redirect("back");
		} else {
			res.redirect("/campgrounds/" + req.params.id);
		}
	})
})



function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} 
	res.redirect("/login");
}


module.exports = router;