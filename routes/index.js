var express     = require("express");
var router      = express.Router();
var User        = require("../models/user");
var passport    = require("passport");

// Root route
router.get("/", function(req, res){
  res.render("landing"); 
});

// REGISTER
// Show register form
router.get("/register", function(req, res) {
   res.render("register"); 
});

// sign up logic 
router.post("/register", function(req, res) {
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            req.flash("error", err.message);
            return res.redirect("register");
        }
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "You are registered as " + user.username);
            res.redirect("/campgrounds");
        });
    });
});

// LOGIN
// Showing login page
router.get("/login", function(req, res){
    res.render("login");
});

// Login logic
// Second parameter: middleware
router.post("/login", passport.authenticate(("local"),{
    successRedirect: "/campgrounds",
    failureRedirect: "/login",
    successFlash: "You're logged in",
    failureFlash: "Your username/password is invalid"
}),
    function(req, res){});

// LOGOUT
// Logout logic
router.get("/logout", function(req, res){
    req.logout();
    req.flash("success", "Logout done, BABE!!");
    res.redirect("/campgrounds");
});

// function isLoggedIn(req, res, next){
//     if(req.isAuthenticated()){
//         return next(); 
        
//     }
//         res.redirect("/login");
//     }
    
module.exports = router;    