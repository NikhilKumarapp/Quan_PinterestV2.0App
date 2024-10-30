var express = require('express');
var router = express.Router();
const passport = require('passport');
const userModel = require('./users');
const postModel = require('./post');
const LocalStrategy = require('passport-local');
const multer = require('./multer');
passport.use(new LocalStrategy(userModel.authenticate()));

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log(req);
  res.render('index',{nav: false});
});

router.get('/register', function(req, res, next) {
  res.render('register',{nav: false});
});

router.get('/profile', isLoggedIn ,async function(req, res, next) {
  const user = await userModel.findOne({username: req.session.passport.user}).populate('posts');
  res.render('profile',{user, nav:true});
});

router.get('/feed', isLoggedIn ,async function(req, res, next) {
  const user = await userModel.findOne({username: req.session.passport.user});
  const posts = await postModel.find().populate('user');
  res.render('feed',{user, posts, nav:true});
});

router.get('/show/post', isLoggedIn ,async function(req, res, next) {
  const user = await userModel.findOne({username: req.session.passport.user}).populate('posts');
  res.render('show',{user, nav:true});
});

router.get('/addPost', isLoggedIn ,async function(req, res, next) {
  const user = await userModel.findOne({username: req.session.passport.user});
  res.render('addPost',{user, nav:true});
});

router.post('/createPost', isLoggedIn,multer.single('postimage') ,async function(req, res, next) {
  const user = await userModel.findOne({username: req.session.passport.user});
  const post  = await postModel.create({
    user : user._id,
    title: req.body.title,
    description: req.body.description,
    image: req.file.filename,
  })

  user.posts.push(post._id);
  await user.save();
  res.redirect("/profile");

});

router.post('/register', async function(req, res) {
  const userData = new userModel({
    username: req.body.username,
    email: req.body.email,
    contract: req.body.contract,
  });
  await userModel.register(userData, req.body.password).then(function(){
    passport.authenticate("local")(req, res,function(){
      res.redirect("/profile");
    })

  });
})

router.post('/login', passport.authenticate("local", {
  successRedirect: "/profile",
  failureRedirect: "/",
  failureFlash: true,
}));

router.get('/logout', function(req, res){
  req.logout(function(err){
    if (err) { return next(err); }
      res.redirect("/");
  });
});

router.post('/fileupload', isLoggedIn ,  multer.single('image') , async function(req, res, next) {
  if (!req.file){
    return res.status(400).send('No file uploaded');
  }
  const user = await userModel.findOne({username: req.session.passport.user});
  user.profileImage = req.file.filename, 
  await user.save();
 res.redirect("/profile");


});

function isLoggedIn(req, res ,next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect("/");
}


module.exports = router;
