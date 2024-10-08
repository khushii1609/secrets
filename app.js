//jshint esversio
//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const session=require("express-session");
const passport=require("passport");
const passportlocalmongoose=require("passport-local-mongoose");
const app = express();
require('dotenv').config();

app.set('view engine', 'ejs');
const saltRound=10;

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));
mongoose.connect("mongodb://localhost:27017/user-DB", {useNewUrlParser: true});

app.use(session({
  secret: "ourlittlesecret.",
resave:false,
saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());


const userSchema= new mongoose.Schema({
  email: String,
  password: String
});
const secret=process.env.SECRET;//encrytionkey:secret

userSchema.plugin(passportlocalmongoose);

const User= new mongoose.model("User", userSchema);

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



//TODO
app.get("/",function(req,res){
    res.render("home");
});
app.get("/login",function(req,res){
    res.render("login");
});
app.get("/secrets", function(req,res){
  if(req.isAuthenticated()){
    res.render("secrets");
  }
  else{
    res.redirect("/login");
  }
});
app.get("/logout",function(req,res){
  req.logout();
  res.redirect("/");
});


app.post("/login", function(req,res){
  const user= new User({
     username: req.body.username,
     password: req.body.password
  });
  
  req.login(user,function(err){
    if(err){
      console.log(err);
    }
      else{
        passport.authenticate("local")(req,res,function(){
    res.redirect("/secrets");});
  }
});  
});

app.get("/register", function(req,res){
    res.render("register");
});
app.post("/register",function(req,res){
 User.register({username: req.body.username}, req.body.password,function(err,user){
  if(err){console.log(err);
    res.redirect("/register");
  }else{
    passport.authenticate("local")(req,res,function(){res.redirect("/secrets");})
  }
});


});
app.listen(3000, function() {
  console.log("Server started on port 3000");
});