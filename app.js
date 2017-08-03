var express = require("express");
var path = require("path");
var swig = require("swig");
swig.setDefaults({cache:false});
var db = require("./db");
var app = express();


app.set('view engine', 'html');
app.engine('html', swig.renderFile);

app.use(require('body-parser').urlencoded({extended: false }));
app.use('/vendor', express.static(path.join(__dirname, 'node_modules')));
app.use(require('method-override')('_method'));


app.get("/", function(req, res, next){
    var typeOfUsers = ["Users", "Managers"];
    var totalManagers = 0;
    var totalUsers = 0;
    db.getUsers(function(err, users){
                 if(err){
                     return next(err);
                 }
    });
    res.render("index", {typeOfUsers});
});

app.use('/users', require('./routes/users.js'));


var port = process.env.PORT || 3000;
app.listen(port, function(){
    console.log("listening on port:", port);

    //
     db.sync(function(err){
         if(err){
            return  console.log(err.message);  
         }
         // after sync
         db.seed(function(err){
             if(err){
                 return console.log(err.message);
             }
             db.getUsers(function(err, users){
                 if(err){
                     return console.log(err.message);
                 }
                 //console.log(users);
             })

         });
         
     });
});
