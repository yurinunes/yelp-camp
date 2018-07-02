var middlewareObj = {};
var Campground  = require("../models/campground.js");
var Comment  = require("../models/comment.js");

middlewareObj.checkCampgroundOwnership = function(req, res, next){
    if(req.isAuthenticated()){
            Campground.findById(req.params.id, function(err, foundCampground){
                if(err || !foundCampground){
                    // redirecting to previous page
                    req.flash("error", "Campground not found");
                    res.redirect("back");
                } else {
                    // 
                    if(foundCampground.author.id.equals(req.user._id)) {
                        next();
                } else {
                    res.redirect("back");
                }
                }
            });  
        } else {
        res.redirect("back");
        }
};

middlewareObj.checkCommentOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err) {
                req.flash("error", "Comment not found!");
                res.redirect("back");
            } else {
                if(foundComment.author.id.equals(req.user.id)){
                    next();
                } else {
                    res.redirect("back");
                }
            }
        });
                } else {
                    res.redirect("back");
                }
            };

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next(); 
        
    }
        req.flash("error", "Login first!");
        res.redirect("/login");
    };


module.exports = middlewareObj;