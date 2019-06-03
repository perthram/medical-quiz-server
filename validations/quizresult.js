const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateQuizResults(data) {
  let errors = {};

  data.score = !isEmpty(data.score) ? data.score : '';
  data.subject = !isEmpty(data.subject) ? data.subject : '';

  if (Validator.isEmpty(data.score)) {
    errors.score = 'Score is required';
  }

  if (Validator.isEmpty(data.subject)) {
    errors.subject = 'Subject Name is required';
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};
