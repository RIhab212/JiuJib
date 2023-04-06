const mongoose = require('mongoose');

const userDetailSchema = new mongoose.Schema({
  fname: String,
  lname: String,
  email: { type: String, unique: true },
  password: String,
  isAdmin: { type: Boolean, default: false },
  ph: { type: String, unique: true },
  gender: { type: String, required: true },
}, {
  collection: 'UserInfo',
});

const UserInfo = mongoose.model('UserInfo', userDetailSchema);

const userDetailPhoneNSchema = new mongoose.Schema({
  ph: { type: String, unique: true },
}, {
  collection: 'UserPhoneInfo',
});

const UserPhoneInfo = mongoose.model('UserPhoneInfo', userDetailPhoneNSchema);

module.exports = {
  UserInfo,
  UserPhoneInfo,
};
