var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    Campground  = require("./models/campgrounds"),
    seedDB      = require("./seeds");
 
 
seedDB();

mongoose.connect("mongodb://localhost/yelpcamp");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

//        
app.get("/", function(req,res) {
    res.render("landing");
});

// INDEX: /thing : GET - Display list of all "Things"
app.get("/campgrounds", function(req,res) {
    
    //Get camopgrounds from DB
    Campground.find({}, function(err, allCampgrounds){
        if(err){
            console.log(err);
        } else{
            res.render("campgrounds/index",{campgroundsVar: allCampgrounds});
        }
    });
    
});

// CREATE: /thing/new : GET - creates new "Thing"
app.post("/campgrounds", function(req,res) {
    var name = req.body.name;
    var image = req.body.image;
    var discription = req.body.discription;

    var newCampground = {name: name,image: image, discription: discription};
    
    Campground.create(newCampground, function(err, newCampgrounds){
        if(err){
            console.log(err);
        } else{
            res.redirect("/campgrounds");
        }
    });
    
});

// NEW: /thing : POST - Shows form to create new "Thing"
app.get("/campgrounds/new", function(req,res){
    res.render("campgrounds/new");
})

//SHOW - shows more info about a single campground
app.get("/campgrounds/:id", function(req,res){
    //find campground with provided id
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err);
        } else {
            console.log("found campground " + foundCampground);
            //render show template with that campground
            res.render("campgrounds/show", {campground: foundCampground});
        }
        
    });
    
});

//=========================
// COMMENTS ROUTES
//=========================

app.get("/campgrounds/:id/comments/new", function(req, res){
    //find campground by id
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
        } else {
            res.render("comments/new", {campground: campground});
        }
    });
    
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Yelping commenced!");
});