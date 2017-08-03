var router = require("express").Router();
var db = require("../db");

// adding user and manager
router.post('/',  function(req, res, next){
    var status;
    if(req.body.manager === "on"){
        status = 'manager';
    }else{
        status = 'user';
    }
    db.createUser({name:req.body.name, status:status}, function(err, result){
        if(err){
            return next(err);
        }
        // console.log(result);
        // stay at home page
         res.redirect("/");
    });
})

// going to users page
router.get('/users', function(req, res, next){
  db.getUsers(function(err, users){
                 if(err){
                     return next(err);
                 }
                 res.render("users", {users: users});
    });
   //res.render("users", {users: allusers});
});

// going to managers page
router.get('/managers', function(req, res, next){
   db.getManagers(function(err, managers){
                 if(err){
                     return next(err);
                 }
                 //console.log(managers.length);
                 if(managers.length < 0){
                    // why doen't get here?
                 }
                 res.render("managers", {users: managers});
    });
   //res.render("users", {users: allusers});
});

// delete manager for managers
router.delete('/managers/:id', function(req, res, next){
    db.updateUser(req.params.id, function(err, result){
        if(err){
            return next(err);
        }
        res.redirect("/users/managers");
    });
})

// delete user from users
router.delete("/users/:id", function(req, res, next){
    db.deleteUser(req.params.id, function(err, result){
        if(err){
            return next(err);
        }
        res.redirect("/users/users");
    });
})

// delete user from users
router.delete("/users/managers/:id", function(req, res, next){
    db.updateUser(req.params.id, function(err, result){
        if(err){
            return next(err);
        }
        res.redirect("/users/users");
    });
})




module.exports = router;