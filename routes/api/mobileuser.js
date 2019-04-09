const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');
const passport = require('passport');

//Load Input Validation
const validateRegisterInput = require('../../validations/resgister');
const validLoginInput = require('../../validations/login');

//Load User model
const MobileUser = require('../../models/MobileUser');

//Load File model
const FileUpload = require('../../models/File');

//@route POST api/mobile/users/register
//@desc Register User
//@access Public

router.post('/register', (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body);

  //Check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  MobileUser.findOne({ email: req.body.email }).then(user => {
    if (user) {
      errors.email = 'Email already exists';
      return res.status(400).json(errors);
    } else {
      const avatar = gravatar.url(req.body.email, {
        s: '200', //Size
        r: 'pg', //Rating
        d: 'mm', //Default
      });
      const newUser = new MobileUser({
        name: req.body.name,
        email: req.body.email,
        avatar,
        password: req.body.password,
      });

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then(user => res.json(user))
            .catch(err => console.log(err));
        });
      });
    }
  });
});

//@route GET api/mobile/users/login
//@desc Login User/ Returning  JWT Token
//@access Public
router.post('/login', (req, res) => {
  const { errors, isValid } = validLoginInput(req.body);
  //Check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }
  const email = req.body.email;
  const password = req.body.password;

  //Find a user by email
  MobileUser.findOne({ email }).then(user => {
    //Check for User
    if (!user) {
      errors.email = 'User not found';
      return res.status(404).json(errors);
    }

    //Check Password
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        //User Matched
        const payload = { id: user.id, name: user.name, avatar: user.avatar }; //Create JWT Payload

        //Sign Token
        jwt.sign(
          payload,
          keys.secretOrKey,
          { expiresIn: 3600 },
          (err, token) => {
            res.json({
              success: true,
              token: 'Bearer ' + token,
            });
          }
        );
      } else {
        errors.password = 'Password incorrect';
        return res.status(400).json(errors);
      }
    });
  });
});

//@route GET api/mobile/users/category/:categoryname
//@desc Get data for particular category
//@access Private

router.get(
  '/category/:categoryname',
  passport.authenticate('mobilejwt', { session: false }),
  (req, res) => {
    FileUpload.findOne({ name: req.params.categoryname })
      .then(file => {
        if (file) return res.json(file);
        return res.status(404).json({
          nofilefound:
            'No data for the category ' + req.params.categoryname + ' found',
        });
      })
      .catch(() =>
        res.status(404).json({
          nofilefound:
            'No data for the category ' + req.params.categoryname + ' found',
        })
      );
  }
);

////@route GETapi/mobile/users/categories
//@desc Get All categories
//@access Private

router.get(
  '/categories',
  passport.authenticate('mobilejwt', { session: false }),
  (req, res) => {
    FileUpload.find()
      .sort({ date: -1 })
      .then(files => {
        const categories = [];
        files.forEach(file => {
          if (file.data.length > 0) {
            categories.push(file.name);
          }
        });
        return res.json(categories);
      })
      .catch(() => res.status(404).json({ nofilefound: 'No File found' }));
  }
);

//@route GET api/mobile/users/current
//@desc  Return current user
//@access Private
router.get(
  '/current',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    res.json({
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
    });
  }
);

module.exports = router;
