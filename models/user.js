const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({

  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator(v) {
        return validator.isEmail(v);
      },
    },
  },

  name: {
    type: String,
    required: true,
    minLength: 2,
    maxLength: 30,
  },

  password: {
    type: String,
    required: true,
    select: false,
  },
});

module.exports = mongoose.model('user', userSchema);
