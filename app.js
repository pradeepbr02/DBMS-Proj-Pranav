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

const postSchema = new mongoose.Schema({
    title:String ,
    landSize : String ,
    location : String ,
    landPrice :String ,
    landContact:Number
});

const login = new mongoose.model("login" , loginSchema);
const post = new mongoose.model("post" , postSchema);
const app = express();

app.use(express.static("public"));
app.set('view engine' , 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

app.get('/' , (req , res)=>{
    post.find({} , ( err, foundUsers)=>{
        if(err){
            console.log(err);
        }
        if(!foundUsers){
            console.log("No posts found");
        }
        else{
            res.render("home" , {

                array:foundUsers

            })
            console.log(foundUsers);
        }
    })
    
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
                        res.redirect("/")
                    }

                })
            }
        }
    } )

})


app.post("/signup" , async (req , res)=>{

let hashedpassword = await bcrypt.hash(req.body.pass ,9);

login.findOne({email: req.body.email} , (err , results)=>{
    
    console.log(results);
    if(results){
        console.log("Already exists");
        
        res.redirect("/");

    }
    else if(!results){
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

app.get('/submit' , (req , res)=>{
    res.render("submit");
})

app.post("/submit" , (req , res)=>{
    const post1 = new post({
        title : req.body.farm ,
        landSize : req.body.landSize,
        location : req.body.location,
        landPrice : req.body.landPrice ,
        landContact : req.body.contact
    });

    post1.save((err)=>{
        if(!err){
            res.redirect("/");
            console.log("post added successfully");
        }
        else{
            console.log(err);
        }
    })

});

app.get("/viewPost/:title" , (req , res)=>{
    const title = req.params.title;
  post.findOne({title : title} , (err , foundUser)=>{
    res.render("viewPost" , {
        array : foundUser

    })
  })
});

app.post('/land/booked' , (req , res)=>{
    res.send('Booked');
})



app.get('/about' , (req , res)=>{
    res.render("about");
})

app.listen(5000 , (re, res)=>{
    console.log("Server is running on port 5000")
})