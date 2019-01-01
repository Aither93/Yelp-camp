var mongoose = require("mongoose");
var campground = require("./models/campgrounds");
var Comment = require("./models/comment");
var data = [
	{
		name: "Cloud's Rest",
		image: "https://images.unsplash.com/photo-1530541930197-ff16ac917b0e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
		description:"Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod"
	},
	{
		name: "Mountain Heaven",
		image: "https://images.unsplash.com/photo-1484960055659-a39d25adcb3c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
		description:"Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod"
	},
	{
		name: "Sea bea",
		image: "https://images.unsplash.com/photo-1497906539264-eb74442e37a9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
		description:"Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod"
	}

]

function seedDB(){
	//remove all camps
	campground.remove({}, function(err){
	if (err){
		console.log(err);
	} else {
		console.log ("removed all campgrounds");
		//create Camps
		data.forEach(function(camp){
		campground.create(camp, function(err, createdCamp){
			if (err) {
				console.log (err);
			} else {
				console.log("createdCamp");
				Comment.create({
								text:"I wish no more",
								author:"Messi"
								},
								function(err, com){
									if (err) {
										console.log(err);
									} else {
										createdCamp.comments.push(com);
										createdCamp.save();
										console.log("Comment created");
									}
								})
			}
		})

	})
	}
})
}

module.exports = seedDB;
