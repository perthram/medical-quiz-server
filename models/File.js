const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const FileUploadSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  data: {
    type: [Object],
    required: true,
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
});

module.exports = FileUpload = mongoose.model('fileupload', FileUploadSchema);
