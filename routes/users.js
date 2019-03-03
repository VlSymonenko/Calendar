var express = require('express');
var router = express.Router();
const functions = require('../models/user');
router.post('/connect', (req, res, next) => {
  functions.clientConnect();
  res.redirect('/user/signin');
});
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
router.get('/signin', (req, res, next) => {
  res.render('user/signin', {});
});

router.post('/signin', (req, res, nex) => {
  req.check('email', 'Invalid email').notEmpty().isEmail();
  req.check('password', 'Invalid password').notEmpty();
  //  req.check('name', 'Name cannot be empty').notEmpty();
  let errors = req.validationErrors();
  if(errors){
  let id = functions.findUser(req);
  setTimeout(function() {
    if (id != undefined) {
      console.log("UserID " + id);
      req.session.userid = id;
      res.redirect('/user/profile');
    } else {
      console.log("User not found");
      res.redirect('/user/signin')
    }
  }, 3000);
}else{
  res.redirect('/user/signin');
}
});

router.get('/signup', (req, res, next) => {
  res.render('user/signup', {});
});

router.post('/signup', (req, res, nex) => {
  req.check('email', 'Invalid email').notEmpty().isEmail();
  req.check('password', 'Invalid password').notEmpty().isLength({
    min: 4
  });
  req.check('name', 'Name cannot be empty').notEmpty();
  let errors = req.validationErrors();
  if (errors) {
    console.log(errors);
  } else {
    //req.session.userid = req.body.id;
    //console.log("User id" + req.session.userid);
    let userId = functions.addUser(req);
    setTimeout(function() {
      console.log("To session " + userId);
      req.session.userid = userId;
      if (userId) {
        res.redirect('/user/profile');
      } else {
        res.redirect('/user/signup');
      }
    }, 0);
  }
});

router.get('/profile', (req, res, next) => {
  res.render('user/profile');
});

router.post('/profile', (req, res, next) => {
  req.check('eventName', 'Event name cannot be empty').notEmpty();
  //req.check('time','Invalid time');
  //req.check('day','Not a day').isDate({format:'DD-MM-YYYY'})
  let errors = req.validationErrors();
  if (errors) {
    console.log(errors);
  } else {
    console.log(req.session.userid);
    functions.addEvent(req);
  }
  res.redirect('/user/profile');
});

router.get('/event', (req, res) => {
  res.render('events');
});

router.post('/event', (req, res) => {
  let a = functions.findEvents(req);
  console.log(a);
  req.session.events = a;
  res.redirect('/user/seeEvents');
});

router.get('/seeEvents', (req, res) => {
  res.render('seeEvents', {
    events: req.session.events
  });
});

router.get('/logout', (req, res, next) => {
  //  functions.clientDisconnect();
  res.redirect('/user/signin');
})

module.exports = router;
