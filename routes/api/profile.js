const express = require('express');
const router = express.Router();
const passport = require('passport');

//Load Validation
const validateQuizResults = require('../../validations/quizresult');

//Load Profile Model
const Profile = require('../../models/Profile');

//@route GET api/profile
//@desc  Get all profiles
//@access Private
router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const errors = {};

    Profile.find()
      .populate('user', ['name', 'avatar', 'rollnumber'])
      .then(profiles => {
        if (!profiles) {
          errors.noprofile = 'There are no profiles';
          return res.status(404).json(errors);
        }

        res.json(profiles);
      })
      .catch(err => res.status(404).json({ profile: 'There are no profiles' }));
  }
);

//@route POST api/profile/quizresults
//@desc Add education to profile
//@access Private
router.post(
  '/quizresults',
  passport.authenticate('mobilejwt', { session: false }),
  (req, res) => {
    const { errors, isValid } = validateQuizResults(req.body);

    //Check Validation
    if (!isValid) {
      //Return any errors with 400 status
      return res.status(400).json(errors);
    }

    //Get Fields
    const profileFields = { quizresults: [] };
    profileFields.user = req.user.id;

    const newQuizResults = {
      score: req.body.score,
      subject: req.body.subject,
    };
    profileFields.quizresults.push(newQuizResults);

    Profile.findOne({ user: req.user.id })
      .then(profile => {
        if (profile) {
          //Add to quiz results array
          profile.quizresults.push(newQuizResults);
          profile
            .save()
            .then(() =>
              res.json({ message: 'Quiz Result Submitted Succesfully' })
            );
        } else {
          //Create
          new Profile(profileFields)
            .save()
            .then(() =>
              res.json({ message: 'Quiz Result Submitted Succesfully' })
            );
        }
      })
      .catch(err =>
        res
          .status(400)
          .json({ message: 'Results Not Submitted,No profile found' })
      );
  }
);

module.exports = router;
