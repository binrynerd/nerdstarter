 const express = require('express')
 const router = express.Router();
 const passport = require('passport')
const {sendMail} =  require('../controllers/nodemailer')
const {ensureAuthenticated} = require('../controllers/auth')


// @dec - to root page
router.get("/", (req, res) => res.render("home"));
router.get('/protected', ensureAuthenticated, (req , res)=> res.render('protected'))


// @dec - Nodemailer Endpoint
router.get('/mail', (req, res)=>{
    res.render('mail')
} )
router.post('/mail', sendMail )


// Authentication with google
router.get('/auth/google', passport.authenticate('google', {scope: ['email', 'profile']}));

router.get('/google/callback',
    passport.authenticate( 'google', {
        successRedirect: '/protected',
        failureRedirect: '/user/login'
}));






module.exports = router
