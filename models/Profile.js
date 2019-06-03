const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProfileSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'mobileusers',
  },

  quizresults: [
    {
      score: {
        type: String,
        required: true,
      },
      subject: {
        type: String,
        required: true,
      },
      date: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

module.exports = Profile = mongoose.model('profile', ProfileSchema);
