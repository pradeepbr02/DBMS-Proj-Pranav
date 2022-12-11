const express = require('express');

const bodyParser = require('body-parser');

const ejs = require('ejs');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const { Db } = require('mongodb');
mongoose.set('strictQuery', true)
mongoose.connect('mongodb://localhost:27017/landDB' , {useNewUrlParser : true});



const loginSchema = new mongoose.Schema({
    fullName : String,
    email : String,
    userName : String,
    password : String

});

const login = new mongoose.model("login" , loginSchema);

const app = express();

app.use(express.static("public"));
app.set('view engine' , 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

app.get('/' , (req , res)=>{
    res.render("home")
});

app.get("/signup" , (req , res)=>{
    res.render("signup");
});

app.get("/login", (req , res)=>{
    res.render("login");
});

app.post("/login" , (req , res)=>{

    let username = req.body.username;
    let password = req.body.pass;

    login.findOne({userName : username} , (err , foundUser)=>{
        if(err){
            throw err;
        }
        else{
            if(foundUser){
                bcrypt.compare(password , foundUser.password , (req , result)=>{
                    if(result===true){
                        console.log("login succesfull");
                    }

                })
            }
        }
    } )

})


app.post("/signup" , async (req , res)=>{

let hashedpassword = await bcrypt.hash(req.body.pass ,9);

login.findOne({userName : req.body.username} , (err , results)=>{
    console.log(results);
    if(results.userName===req.body.username){
        console.log("Already exists");
        
        res.redirect("/");

    }
    else{
        const userLogin = new login({
    
            fullName : req.body.fullname,
            email : req.body.email ,
            userName : req.body.username,
            password: hashedpassword
        });
    
        userLogin.save((err)=>{
            if(!err){
                console.log("registered");
                res.redirect("/login");
            }
            else{
                console.log(err);
            }
        });
    

    }
})
   

  
    


})

app.listen(5000 , (re, res)=>{
    console.log("Server is running on port 5000")
})