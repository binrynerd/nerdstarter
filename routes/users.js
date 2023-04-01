const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const passport = require("passport");

// end-points
router.get("/login", (req, res) => res.render("login"));
router.get("/register", (req, res) => res.render("register"));



// Registraion Handle
router.post("/register", (req, res) => {
  const errors = [];
  const { name, email, password, password2 } = req.body;

  // form validation
  if (!name || !email || !password) {
    errors.push({ msg: "Fill in all fields" });
  } else if (password.length < 1) {
    errors.push({ msg: "Password should be atleast 8 characters long" });
  } else if (password !== password2) {
    errors.push({ msg: "Passwords do not match" });
  };
  if (errors.length > 0) {
    res.render("register", {
      errors,
    });
  }else{
    User.findOne({email: email}).then((user)=>{
      if (user){
        errors.push({msg: 'User already exist'});
        res.render('register', {errors})
      }else{
        const newUser = User({
          name,
          email,
          password
        });
        // ecrypting password to store in db
        bcrypt.genSalt(10, (err, salt)=>{
          bcrypt.hash(newUser.password, salt, (err, hash)=>{
            if(err) throw err;
            newUser.password = hash;
            newUser.save().then((user)=>{
              req.flash(
                'success_msg',
                'You are now registered and can log in'
              );
              res.redirect('/users/login');
            }).catch((err)=>console.log(err));
          });
        });
      };
    });
  };
});


//       Local Strategy Login Handle
router.post('/login', (req, res, next)=>{
  passport.authenticate("local", {
    successRedirect: "/protected",
    failureRedirect: "/users/login",
    failureFlash: true,
  })
    (req, res, next);
})



// logout handle
router.get('/logout', (req, res, next)=>{
  req.logout(function (err) {
    if (err) { return next(err); }
  });
  res.redirect('/')
})

module.exports = router;
