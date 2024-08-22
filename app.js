//jshint esversio
//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const bcrypt= require("bcrypt");
const app = express();
require('dotenv').config();

app.set('view engine', 'ejs');
const saltRound=10;

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));
mongoose.connect("mongodb://localhost:27017/user-DB", {useNewUrlParser: true});

const userSchema= new mongoose.Schema({
  email: String,
  password: String
});
const secret=process.env.SECRET;//encrytionkey:secret


const User= new mongoose.model("User", userSchema);



//TODO
app.get("/",function(req,res){
    res.render("home");
});
app.get("/login",function(req,res){
    res.render("login");
});
app.post("/login", function(req,res){
  const username=req.body.username;
  const password=req.body.password;
  User.findOne({email: username},function(err,foundUser){
if(err){
  console.log(err);
}else{
  if(foundUser){
  bcrypt.compare(password, foundUser.password, function(err, response){
    if(response===true){
      res.render("secrets")}
  });
}
}
});  
});

app.get("/register", function(req,res){
    res.render("register");
});
app.post("/register",function(req,res){
  bcrypt.hash(req.body.password, saltRound, function(err,hash){
  const newUser = new User({email:req.body.username,
    password:hash});
    
newUser.save(function(err){
  if(err){console.log(err);}
  else{res.render("secrets");}
});
});

});
app.listen(3000, function() {
  console.log("Server started on port 3000");
});