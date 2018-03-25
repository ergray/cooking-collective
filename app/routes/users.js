var express = require('express')
var passport = require('passport')
var ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn()
var router = express.Router()

router.get('/', ensureLoggedIn, function(req, res, next){
    console.log('user is ', req.user)
    // res.render('user', {user: req.user })
    res.end()
})

module.exports = router