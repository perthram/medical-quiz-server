const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateFileInput(data) {
  let errors = {};
  data.mimetype = !isEmpty(data.mimetype) ? data.mimetype : '';
  data.size = !isEmpty(data.size) ? data.size.toString() : '';

  if (Validator.isEmpty(data.size)) {
    errors.size = 'Empty file not allowed';
  }

  if (
    data.mimetype !==
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
    data.mimetype !== 'application/vnd.ms-excel'
  ) {
    errors.mimetype =
      'Not a valid file format,only .xls or .xlsx format are allowed.';
  }
  if (Validator.isEmpty(data.mimetype) || Validator.isMimeType(data.mimetype)) {
    errors.mimetype = 'File input is required';
  }

  return {
    errors,
    isValid: !isEmpty(errors),
  };
};
