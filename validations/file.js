const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateFileInput(data) {
  let errors = {};
  data.mimetype = !isEmpty(data.mimetype) ? data.mimetype : '';
  data.size = !isEmpty(data.size) ? data.size.toString() : '';

  if (Validator.isEmpty(data.mimetype) && Validator.isMimeType(data.mimetype)) {
    errors.mimetype = 'File input is required';
  }

  if (
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'.localeCompare(
      data.mimetype
    ) !== 0 &&
    'application/vnd.ms-excel'.localeCompare(data.mimetype) !== 0
  ) {
    errors.mimetype =
      'Not a valid file format,only .xls or .xlsx format are allowed.';
  }

  if (Validator.isEmpty(data.size)) {
    errors.size = 'Empty file not allowed';
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};
