var express     = require("express");
var router      = express.Router({mergeParams: true});
var Campground  = require("../models/campground");
var Comment     = require("../models/comment");
var middleware  = require("../middleware");

// NEW ROUTE

router.get("/new", middleware.isLoggedIn, function(req, res) {
    Campground.findById(req.params.id, function(err, foundCampground){
        if(err || !foundCampground){
            req.flash("error", "Campground not found");
            console.log(err);
        } else {
            res.render("comments/new", {campground: foundCampground});
        }
    });
    
});

// Create route

router.post("/", function(req, res){
//   lookup campground using ID
   Campground.findById(req.params.id, function(err, foundCampground){
       if(err){
           console.log(err);
       } else {
        //   Creating comment
           Comment.create(req.body.comment, function(err, newComment){
               if(err){
                   console.log(err);
               } else {
                //   add username and id to comment
                newComment.author.id = req.user._id;
                newComment.author.username = req.user.username;
                newComment.save();
                //   foundCampgroud is reffering to the second call bakc while newComment the third
                // .push is used to put a comment in the comment variable
                // Adding comment to campground variable   
                   foundCampground.comments.push(newComment);
                //Saving the comment   
                   foundCampground.save();
                //Redirecting    
                   res.redirect("/campgrounds/" + foundCampground._id);
               }
           });
       }
   }); 
});

// EDIT ROUTE
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res) {
        Campground.findById(req.params.id, function(err, foundCampground){
            if(err || !foundCampground) {
                req.flash("error", "Campground not found");
                return res.redirect("back");
            }
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err){
                req.flash("error", "Comment not found");
                res.redirect("back");
            } else {
                res.render("comments/edit", {comment: foundComment, campground_id: req.params.id});
            }   
        });
    });
}); 

// UPDATE ROUTE

router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
   Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
       if(err){
           res.redirect("back");
       } else {
           req.flash("success", "Comment edited");
           res.redirect("/campgrounds/" + req.params.id);
       }
   }); 
});

// DESTROY ROUTE

router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
   Comment.findByIdAndRemove(req.params.comment_id, function(err){
      if(err){
          req.flash("error", "You don't have permission");
          res.redirect("back");
      } else {
          req.flash("success", "Comment deleted!");
        res.redirect("/campgrounds/" + req.params.id);   
      }
   }); 
});

module.exports = router;