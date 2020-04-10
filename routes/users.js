const router = require('express').Router({mergeParams: true});
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodeMailer = require('nodemailer');
const key = process.env.SECRET;
const auth = require('../middleware/auth');
const User = require('../models/user.model');

//Input validation
const validateRegisterInput = require('../middleware/register');
const validateLoginInput = require('..//middleware/login');

router.post('/register', (req, res) => {
// Form validation
const { errors, isValid } = validateRegisterInput(req.body);
// Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }
User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      return res.status(400).json({ email: 'Email already exists' });
    } else {
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
      });
// Hash password before saving in database
      bcrypt.genSalt(10, (err, passSalt) => {
        bcrypt.hash(newUser.password, passSalt, (err, passHash) => {
          if (err) throw err;
          if (req.body.verify === true) {
          newUser.password = passHash;
          newUser
            .save()
              .then(user => {
              let transporter = nodeMailer.createTransport({
                host: 'smtp.gmail.com',
                port: 465,
                secure: true,
                auth: {
                    user: process.env.GMAIL_USER_NAME, 
                    pass: process.env.GMAIL_USER_PASSWORD
                }
              });
              let mailOptions = {
                to: req.body.email,
                subject: "Activation email for ITILApp",
                html: `<p>Hi! Please click the following link to activate your ITILApp account</p> <a href='https://itilapp.herokuapp.com/verify/${newUser._id}'>Activation Link</a>`
              };
              transporter.sendMail(mailOptions, (error, info) => {
                  if (error) {
                       console.log(error);
                  }
              });
              res.json(user)
          });
        } else {
          newUser.active = true; 
          newUser.password = passHash;
          newUser
            .save()
            .then(user => {
              res.json(user);
            });
          }
        });
      });
    }
  });
});

router.post('/login', (req, res) => {
  // Form validation
let { errors, isValid } = validateLoginInput(req.body);
// Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }
const email = req.body.email;
const password = req.body.password;
// Find user by email
  User.findOne({ email }).then(user => {
    // Check if user exists
    if (!user) {
      return res.status(404).json({ emailnotfound: 'Email not found' });
    }

    if(user.active === true) {
// Check password
      bcrypt.compare(password, user.password).then(isMatch => {
        if (isMatch) {
          // User matched
          // Create JWT Payload
          const payload = {
            id: user.id,
            name: user.name
          };
  // Sign token
          jwt.sign(
            payload,
            key,
            {
              expiresIn: 31556926 // 1 year in seconds
            },
            (err, token) => {
              res.json({
                success: true,
                token: token
              });
            }
          );
        } else {
          return res
            .status(400)
            .json({ passwordincorrect: 'Password incorrect' });
        }
      });
  } else {
    return res.status(403).json({ activated: 'Account not activated'})
  }
  });
});

//user search
router.get('/', auth, async (req, res) => {
    try {
        let users = await User.find({})
        res.json(users);
    } catch(e) {
        console.log(e);
    }
});

module.exports = router;
   