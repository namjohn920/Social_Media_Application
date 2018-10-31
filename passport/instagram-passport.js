const passport = require('passport');
const keys = require('../config/keys');
const User = require('../models/user');
const InstagramStrategy = require('passport-instagram').Strategy;

passport.serializeUser(function(user, done) {
    done(null, user.id);
});
  
passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

passport.use(new InstagramStrategy({
    clientID: keys.InstagramClientID,
    clientSecret: keys.InstagramClientSecret,
    callbackURL: "/auth/instagram/callback",
    proxy: true 
  },
  function(accessToken, refreshToken, profile, done) {
    console.log(profile);

    User.findOne({
        instagram:profile.id
    }).then((user)=>{
        if(user){
            done(null, user);
        }else{
            const newUser = {
                instagram: profile.id,
                fullname: profile.displayName,
                firstname: profile.displayName.substring(0, profile.displayName.indexOf(' ')),
                lastname: profile.displayName.substring(profile.displayName.indexOf(' '), profile.displayName.length),
                image: profile._json.data.profile_picture
            }
            //save new user into the database 
            new User(newUser).save().then((user)=> {
                done(null, user); 
            });
        }
    }); 
  }
));

